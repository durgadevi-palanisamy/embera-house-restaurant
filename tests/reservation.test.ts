import { describe, it, expect } from "vitest";
import { getAvailableSlots } from "../src/lib/availability";

describe("Reservation Availability Engine", () => {
  it("calculates slots accurately for a given date and party size", async () => {
    // 2026-09-15 is a Tuesday (open for lunch & dinner)
    const result = await getAvailableSlots("2026-09-15", 2);

    expect(result.isOpen).toBe(true);
    expect(result.slots.length).toBeGreaterThan(0);

    const lunchSlot = result.slots.find((s) => s.mealType === "LUNCH");
    const dinnerSlot = result.slots.find((s) => s.mealType === "DINNER");

    expect(lunchSlot).toBeDefined();
    expect(dinnerSlot).toBeDefined();
  });

  it("handles party size exceeding capacity gracefully", async () => {
    // Huge party size (50 guests) exceeds table maximums
    const result = await getAvailableSlots("2026-09-15", 50);
    const availableSlots = result.slots.filter((s) => s.available);
    expect(availableSlots.length).toBe(0);
  });
});
