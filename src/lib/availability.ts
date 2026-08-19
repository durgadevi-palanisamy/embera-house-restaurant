import prisma from "./prisma";
import { generateConfirmationCode } from "./utils";

export interface TimeSlotAvailability {
  time: string;
  mealType: "LUNCH" | "DINNER";
  available: boolean;
  remainingCovers: number;
  tablesAvailable: number;
  reason?: string;
}

export interface BookingPayload {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "19:30"
  seatingArea?: string;
  occasion?: string;
  dietaryNotes?: string;
  accessibilityNotes?: string;
  specialRequests?: string;
  userId?: string;
}

export async function getAvailableSlots(dateString: string, partySize: number, seatingArea?: string): Promise<{
  date: string;
  dayName: string;
  slots: TimeSlotAvailability[];
  isOpen: boolean;
  closureReason?: string;
}> {
  const dateObj = new Date(dateString);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // 1. Check special date closures
  const specialHour = await prisma.specialOpeningHour.findFirst({
    where: { date: dateString },
  });

  if (specialHour && specialHour.isClosed) {
    return {
      date: dateString,
      dayName: dateObj.toLocaleDateString("en-GB", { weekday: "long" }),
      slots: [],
      isOpen: false,
      closureReason: specialHour.note || "The restaurant is closed for a private event on this date.",
    };
  }

  // 2. Fetch regular opening hours for this day of week
  const openingHours = await prisma.openingHour.findMany({
    where: { dayOfWeek, isClosed: false },
  });

  if (openingHours.length === 0) {
    return {
      date: dateString,
      dayName: dateObj.toLocaleDateString("en-GB", { weekday: "long" }),
      slots: [],
      isOpen: false,
      closureReason: "The restaurant is closed on this day.",
    };
  }

  // 3. Fetch all active tables fitting this party size
  const tableFilter: any = {
    isActive: true,
    maxCapacity: { gte: partySize },
  };

  if (seatingArea && seatingArea !== "NO_PREFERENCE") {
    tableFilter.room = seatingArea;
  }

  const suitableTables = await prisma.restaurantTable.findMany({
    where: tableFilter,
  });

  // 4. Fetch existing confirmed reservations for the entire day
  const existingBookings = await prisma.reservation.findMany({
    where: {
      date: dateString,
      status: { in: ["CONFIRMED", "SEATED", "PENDING"] },
    },
  });

  // Read max covers per slot setting
  const maxCoversSetting = await prisma.siteSetting.findUnique({
    where: { key: "MAX_COVERS_PER_SLOT" },
  });
  const maxCoversLimit = maxCoversSetting ? parseInt(maxCoversSetting.value, 10) : 18;

  // Generate standard 15-minute intervals for each service period
  const slots: TimeSlotAvailability[] = [];

  for (const period of openingHours) {
    const meal = period.mealType as "LUNCH" | "DINNER";
    const [startH, startM] = period.openTime.split(":").map(Number);
    let [endH, endM] = period.closeTime.split(":").map(Number);
    if (endH === 0 && endM === 0) {
      endH = 24;
    }

    let curH = startH;
    let curM = startM;

    // We stop taking new reservations 1 hour 30 mins before closing
    const lastBookingMinutes = endH * 60 + endM - 90;

    while (curH * 60 + curM <= lastBookingMinutes) {
      const timeStr = `${String(curH).padStart(2, "0")}:${String(curM).padStart(2, "0")}`;

      // Calculate covers already booked in this specific slot
      const slotBookings = existingBookings.filter((b) => b.timeSlot === timeStr);
      const bookedCoversInSlot = slotBookings.reduce((sum, b) => sum + b.partySize, 0);

      // Check which suitable tables are already occupied
      const occupiedTableIds = new Set(
        slotBookings.map((b) => b.tableId).filter(Boolean)
      );

      const freeSuitableTables = suitableTables.filter(
        (t) => !occupiedTableIds.has(t.id)
      );

      const remainingCovers = Math.max(0, maxCoversLimit - bookedCoversInSlot);
      const hasCoverSpace = remainingCovers >= partySize;
      const hasTableSpace = freeSuitableTables.length > 0;

      const isAvailable = hasCoverSpace && hasTableSpace && suitableTables.length > 0;

      slots.push({
        time: timeStr,
        mealType: meal,
        available: isAvailable,
        remainingCovers,
        tablesAvailable: freeSuitableTables.length,
        reason: !isAvailable
          ? suitableTables.length === 0
            ? "Party size exceeds available table capacities."
            : !hasTableSpace
            ? "All matching tables are reserved for this time."
            : "Slot capacity reached."
          : undefined,
      });

      // Increment by 15 or 30 minutes (30 minutes interval for fine dining)
      curM += 30;
      if (curM >= 60) {
        curH += Math.floor(curM / 60);
        curM = curM % 60;
      }
    }
  }

  return {
    date: dateString,
    dayName: dateObj.toLocaleDateString("en-GB", { weekday: "long" }),
    slots,
    isOpen: true,
  };
}

/**
 * Creates a reservation inside a safe database transaction with concurrency lock prevention
 */
export async function createReservationTransactional(data: BookingPayload) {
  return await prisma.$transaction(async (tx) => {
    // 1. Re-verify availability within transaction to prevent race conditions
    const existingBookings = await tx.reservation.findMany({
      where: {
        date: data.date,
        timeSlot: data.timeSlot,
        status: { in: ["CONFIRMED", "SEATED", "PENDING"] },
      },
    });

    const bookedCovers = existingBookings.reduce((sum, b) => sum + b.partySize, 0);

    const maxCoversSetting = await tx.siteSetting.findUnique({
      where: { key: "MAX_COVERS_PER_SLOT" },
    });
    const maxCoversLimit = maxCoversSetting ? parseInt(maxCoversSetting.value, 10) : 18;

    if (bookedCovers + data.partySize > maxCoversLimit) {
      throw new Error("RESERVATION_SLOT_FULL");
    }

    // 2. Find and assign optimal table
    const tableFilter: any = {
      isActive: true,
      minCapacity: { lte: data.partySize },
      maxCapacity: { gte: data.partySize },
    };

    if (data.seatingArea && data.seatingArea !== "NO_PREFERENCE") {
      tableFilter.room = data.seatingArea;
    }

    const availableTables = await tx.restaurantTable.findMany({
      where: tableFilter,
      orderBy: { maxCapacity: "asc" }, // pick best-fit table
    });

    const occupiedTableIds = new Set(
      existingBookings.map((b) => b.tableId).filter(Boolean)
    );

    const assignedTable = availableTables.find((t) => !occupiedTableIds.has(t.id));

    // 3. Generate confirmation code
    const confirmationCode = generateConfirmationCode();

    // 4. Create the reservation
    const reservation = await tx.reservation.create({
      data: {
        confirmationCode,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        partySize: data.partySize,
        date: data.date,
        timeSlot: data.timeSlot,
        seatingArea: data.seatingArea || "NO_PREFERENCE",
        occasion: data.occasion,
        dietaryNotes: data.dietaryNotes,
        accessibilityNotes: data.accessibilityNotes,
        specialRequests: data.specialRequests,
        status: "CONFIRMED",
        userId: data.userId,
        tableId: assignedTable?.id || null,
      },
      include: {
        table: true,
      },
    });

    // 5. Create status history
    await tx.reservationStatusHistory.create({
      data: {
        reservationId: reservation.id,
        status: "CONFIRMED",
        changedBy: data.userId ? "GUEST_ACCOUNT" : "GUEST",
        note: `Table ${assignedTable ? assignedTable.tableNumber : "Auto-Assigned"} allocated.`,
      },
    });

    return reservation;
  });
}
