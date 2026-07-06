/**
 * ═══════════════════════════════════════════════════════════
 *  Shri Gurukripa — Email API Routes
 *  Mount on your Express app: app.use("/api/email", emailRoutes)
 * ═══════════════════════════════════════════════════════════
 */

import express, { Request, Response } from "express";
import { createOtp, verifyOtp, clearOtp } from "./otpManager.js";
import {
  sendOtpEmail,
  sendBookingConfirmation,
  sendBookingCancellation,
  sendDriverAssigned,
  sendTripReminder,
  sendWelcomeEmail,
} from "./emailService.js";

const router = express.Router();

// ── Simple email format validator ─────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Rate-limit map (IP → timestamp[]) ────────────────────
const rateLimitMap = new Map<string, number[]>();
function isRateLimited(ip: string, windowMs = 60_000, maxReqs = 5): boolean {
  const now = Date.now();
  const times = (rateLimitMap.get(ip) || []).filter(t => now - t < windowMs);
  times.push(now);
  rateLimitMap.set(ip, times);
  return times.length > maxReqs;
}

// ═══════════════════════════════════════════════════════════
//  POST /api/email/send-otp
//  Body: { email, name }
// ═══════════════════════════════════════════════════════════
router.post("/send-otp", async (req: Request, res: Response) => {
  const ip = req.ip || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please slow down." });
  }

  const { email, name } = req.body;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  const { otp, error } = createOtp(email);
  if (error) return res.status(429).json({ ok: false, error });

  const sent = await sendOtpEmail(email, name || "Valued Customer", otp);
  if (!sent) {
    return res.status(500).json({ ok: false, error: "Failed to send OTP. Please try again." });
  }

  res.json({ ok: true, message: "Verification code sent to your email." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/verify-otp
//  Body: { email, otp }
// ═══════════════════════════════════════════════════════════
router.post("/verify-otp", (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ ok: false, error: "Email and OTP are required." });
  }

  const result = verifyOtp(email, String(otp).trim());
  if (!result.success) {
    return res.status(400).json({ ok: false, error: result.error });
  }

  clearOtp(email);
  res.json({ ok: true, message: "Email verified successfully!" });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/resend-otp
//  Body: { email, name }
// ═══════════════════════════════════════════════════════════
router.post("/resend-otp", async (req: Request, res: Response) => {
  const ip = req.ip || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please slow down." });
  }

  const { email, name } = req.body;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address." });
  }

  const { otp, error } = createOtp(email); // createOtp handles resend limits internally
  if (error) return res.status(429).json({ ok: false, error });

  const sent = await sendOtpEmail(email, name || "Valued Customer", otp);
  if (!sent) return res.status(500).json({ ok: false, error: "Failed to resend OTP." });

  res.json({ ok: true, message: "New verification code sent to your email." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/booking-confirm
//  Body: booking details object
// ═══════════════════════════════════════════════════════════
router.post("/booking-confirm", async (req: Request, res: Response) => {
  const { email, ...booking } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: "Customer email is required." });

  const ok = await sendBookingConfirmation(email, booking);
  res.json({ ok, message: ok ? "Confirmation email sent." : "Email failed." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/booking-cancel
//  Body: { email, userName, bookingId, refundStatus?, refundAmount?, refundDays? }
// ═══════════════════════════════════════════════════════════
router.post("/booking-cancel", async (req: Request, res: Response) => {
  const { email, ...params } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: "Email is required." });

  const ok = await sendBookingCancellation(email, params);
  res.json({ ok, message: ok ? "Cancellation email sent." : "Email failed." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/driver-assigned
//  Body: { email, ...driverParams }
// ═══════════════════════════════════════════════════════════
router.post("/driver-assigned", async (req: Request, res: Response) => {
  const { email, ...params } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: "Email is required." });

  const ok = await sendDriverAssigned(email, params);
  res.json({ ok, message: ok ? "Driver assignment email sent." : "Email failed." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/trip-reminder
//  Body: { email, ...reminderParams }
// ═══════════════════════════════════════════════════════════
router.post("/trip-reminder", async (req: Request, res: Response) => {
  const { email, ...params } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: "Email is required." });

  const ok = await sendTripReminder(email, params);
  res.json({ ok, message: ok ? "Reminder email sent." : "Email failed." });
});

// ═══════════════════════════════════════════════════════════
//  POST /api/email/welcome
//  Body: { email, name }
// ═══════════════════════════════════════════════════════════
router.post("/welcome", async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ ok: false, error: "Email and name are required." });

  const ok = await sendWelcomeEmail(email, name);
  res.json({ ok, message: ok ? "Welcome email sent." : "Email failed." });
});

export default router;
