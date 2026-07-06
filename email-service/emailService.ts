/**
 * ═══════════════════════════════════════════════════════════
 *  Shri Gurukripa — Email Service (Main Dispatcher)
 *  Call these functions from your server routes to send emails.
 * ═══════════════════════════════════════════════════════════
 */

import { transporter, FROM_EMAIL } from "./emailConfig.js";
import {
  otpTemplate,
  bookingConfirmationTemplate,
  bookingCancelledTemplate,
  driverAssignedTemplate,
  tripReminderTemplate,
  welcomeTemplate,
  adminNotificationTemplate,
} from "./emailTemplates.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "";

// ── Generic send helper ───────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({ from: FROM_EMAIL, to, subject, html });
    console.log(`📧 Email sent to ${to} — MessageId: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────
//  PUBLIC API — Call these from your Express routes
// ─────────────────────────────────────────────────────────

/** Send OTP to user's email */
export async function sendOtpEmail(
  email: string,
  userName: string,
  otp: string,
  expiryMinutes = 5
): Promise<boolean> {
  const { subject, html } = otpTemplate({ userName, otp, expiryMinutes });
  return sendEmail(email, subject, html);
}

/** Send booking confirmation to customer */
export async function sendBookingConfirmation(
  email: string,
  params: Parameters<typeof bookingConfirmationTemplate>[0]
): Promise<boolean> {
  const { subject, html } = bookingConfirmationTemplate(params);
  const ok = await sendEmail(email, subject, html);
  // Also notify admin
  if (ADMIN_EMAIL) {
    const { subject: as, html: ah } = adminNotificationTemplate({
      eventType: "New Booking",
      details: {
        "Booking ID":   params.bookingId,
        "Customer":     params.userName,
        "From":         params.pickup,
        "To":           params.drop,
        "Date":         params.date,
        "Vehicle":      params.vehicle,
        "Fare (₹)":     params.fare,
        "Customer Email": email,
      },
    });
    await sendEmail(ADMIN_EMAIL, as, ah);
  }
  return ok;
}

/** Send cancellation email */
export async function sendBookingCancellation(
  email: string,
  params: Parameters<typeof bookingCancelledTemplate>[0]
): Promise<boolean> {
  const { subject, html } = bookingCancelledTemplate(params);
  const ok = await sendEmail(email, subject, html);
  if (ADMIN_EMAIL) {
    const { subject: as, html: ah } = adminNotificationTemplate({
      eventType: "Booking Cancellation",
      details: {
        "Booking ID":   params.bookingId,
        "Customer":     params.userName,
        "Refund":       `₹${params.refundAmount ?? 0}`,
        "Customer Email": email,
      },
    });
    await sendEmail(ADMIN_EMAIL, as, ah);
  }
  return ok;
}

/** Send driver assignment email */
export async function sendDriverAssigned(
  email: string,
  params: Parameters<typeof driverAssignedTemplate>[0]
): Promise<boolean> {
  const { subject, html } = driverAssignedTemplate(params);
  return sendEmail(email, subject, html);
}

/** Send trip reminder (24h or 2h before) */
export async function sendTripReminder(
  email: string,
  params: Parameters<typeof tripReminderTemplate>[0]
): Promise<boolean> {
  const { subject, html } = tripReminderTemplate(params);
  return sendEmail(email, subject, html);
}

/** Send welcome email on first login/registration */
export async function sendWelcomeEmail(
  email: string,
  userName: string
): Promise<boolean> {
  const { subject, html } = welcomeTemplate({ userName, email });
  const ok = await sendEmail(email, subject, html);
  if (ADMIN_EMAIL) {
    const { subject: as, html: ah } = adminNotificationTemplate({
      eventType: "New Registration",
      details: { "Name": userName, "Email": email, "Time": new Date().toLocaleString("en-IN") },
    });
    await sendEmail(ADMIN_EMAIL, as, ah);
  }
  return ok;
}

/** Send raw admin notification */
export async function sendAdminAlert(
  eventType: Parameters<typeof adminNotificationTemplate>[0]["eventType"],
  details: Record<string, string | number>
): Promise<boolean> {
  if (!ADMIN_EMAIL) return false;
  const { subject, html } = adminNotificationTemplate({ eventType, details });
  return sendEmail(ADMIN_EMAIL, subject, html);
}
