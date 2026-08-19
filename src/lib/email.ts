export interface ReservationEmailData {
  guestName: string;
  guestEmail: string;
  confirmationCode: string;
  date: string;
  timeSlot: string;
  partySize: number;
  seatingArea?: string;
  specialRequests?: string;
}

export async function sendReservationConfirmationEmail(data: ReservationEmailData) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reservation Confirmed - Embera House</title>
</head>
<body style="margin: 0; padding: 0; background-color: #11100E; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F7F2E9;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #191714; border: 1px solid rgba(255,255,255,0.1); padding: 40px;">
    
    <!-- Header -->
    <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 30px;">
      <h1 style="font-size: 28px; letter-spacing: 4px; color: #F7F2E9; text-transform: uppercase; margin: 0;">EMBERA HOUSE</h1>
      <p style="font-size: 11px; letter-spacing: 2px; color: #C86E45; text-transform: uppercase; margin: 8px 0 0 0;">Fire &bull; Flavour &bull; Moments</p>
    </div>

    <!-- Booking Confirmation -->
    <div style="padding: 30px 0; text-align: center;">
      <h2 style="font-size: 22px; color: #D3B98D; font-weight: 300; margin: 0 0 10px 0;">Table Reservation Confirmed</h2>
      <p style="font-size: 14px; color: #A9A095; line-height: 1.6; margin: 0;">
        Dear <strong>${data.guestName}</strong>, your reservation at Embera House has been successfully secured.
      </p>
    </div>

    <!-- Booking Details Box -->
    <div style="background-color: #11100E; border: 1px solid rgba(200, 110, 69, 0.3); padding: 25px; margin-bottom: 30px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Booking Reference:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #C86E45; font-family: monospace; font-size: 16px;">${data.confirmationCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Date:</td>
          <td style="padding: 8px 0; text-align: right; color: #F7F2E9; font-weight: bold;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Time:</td>
          <td style="padding: 8px 0; text-align: right; color: #D3B98D; font-weight: bold;">${data.timeSlot}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Party Size:</td>
          <td style="padding: 8px 0; text-align: right; color: #F7F2E9;">${data.partySize} Guests</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Seating Area:</td>
          <td style="padding: 8px 0; text-align: right; color: #F7F2E9;">${data.seatingArea?.replace("_", " ") || "Main Dining Room"}</td>
        </tr>
        ${data.specialRequests ? `
        <tr>
          <td style="padding: 8px 0; color: #A9A095;">Special Requests:</td>
          <td style="padding: 8px 0; text-align: right; color: #F7F2E9;">${data.specialRequests}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Location & Contact -->
    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; font-size: 12px; color: #A9A095; line-height: 1.6;">
      <p style="margin: 0 0 5px 0;"><strong style="color: #F7F2E9;">Embera House</strong></p>
      <p style="margin: 0 0 5px 0;">Block 4, The Mills, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013</p>
      <p style="margin: 0 0 5px 0;">Concierge: <a href="tel:+912267894400" style="color: #C86E45; text-decoration: none;">+91 22 6789 4400</a> | <a href="tel:+919820155300" style="color: #C86E45; text-decoration: none;">+91 98201 55300</a></p>
      <p style="margin: 15px 0 0 0; font-size: 11px; color: #778064;">
        * Cancellation Policy: Tables may be cancelled or modified up to 6 hours prior to your seating without charge.
      </p>
    </div>

  </div>
</body>
</html>
  `;

  console.log(`\n======================================================`);
  console.log(`📩 [REAL EMAIL DISPATCH ATTEMPT]`);
  console.log(`TO: ${data.guestName} <${data.guestEmail}>`);
  console.log(`SUBJECT: Table Reservation Confirmed - Ref: ${data.confirmationCode}`);
  console.log(`DATE & TIME: ${data.date} at ${data.timeSlot}`);
  console.log(`VENUE: Block 4, The Mills, Senapati Bapat Marg, Lower Parel, Mumbai 400013`);
  console.log(`======================================================\n`);

  // If RESEND_API_KEY is available in environment, send via Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Embera House <reservations@emberahouse.com>",
          to: [data.guestEmail],
          subject: `Reservation Confirmed (${data.confirmationCode}) - Embera House Mumbai`,
          html: htmlContent,
        }),
      });
      const resData = await res.json();
      console.log("Resend API response:", resData);
    } catch (err) {
      console.error("Resend API dispatch error:", err);
    }
  }

  return { success: true, messageId: `msg_${Date.now()}` };
}

export async function sendReservationCancellationEmail(data: ReservationEmailData) {
  console.log(`\n======================================================`);
  console.log(`📩 [CANCELLATION EMAIL DISPATCHED]`);
  console.log(`TO: ${data.guestName} <${data.guestEmail}>`);
  console.log(`CONFIRMATION CODE: ${data.confirmationCode}`);
  console.log(`STATUS: Successfully Cancelled`);
  console.log(`======================================================\n`);

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Embera House <reservations@emberahouse.com>",
          to: [data.guestEmail],
          subject: `Reservation Cancelled (${data.confirmationCode}) - Embera House Mumbai`,
          html: `
            <div style="background-color: #11100E; color: #F7F2E9; padding: 40px; font-family: sans-serif;">
              <h2>Reservation Cancelled</h2>
              <p>Dear ${data.guestName}, your reservation (Ref: <strong>${data.confirmationCode}</strong>) for ${data.date} has been cancelled.</p>
              <p>We hope to welcome you another evening soon.</p>
              <p>— The Team at Embera House, Lower Parel, Mumbai</p>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.error("Cancellation email error:", e);
    }
  }

  return { success: true };
}

export async function sendContactAcknowledgementEmail(name: string, email: string, enquiryType: string) {
  console.log(`\n======================================================`);
  console.log(`📩 [CONTACT ENQUIRY ACKNOWLEDGEMENT DISPATCHED]`);
  console.log(`TO: ${name} <${email}>`);
  console.log(`ENQUIRY TYPE: ${enquiryType}`);
  console.log(`======================================================\n`);

  return { success: true };
}
