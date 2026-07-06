/**
 * ═══════════════════════════════════════════════════════════
 *  Shri Gurukripa Tours & Taxi — SMTP Email Configuration
 *  Supports: Gmail, Brevo, SendGrid, Amazon SES
 * ═══════════════════════════════════════════════════════════
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ── Build transporter from .env variables ──────────────────
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false otherwise
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certs in dev
  },
});

// ── Verify connection on startup ───────────────────────────
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully.");
    return true;
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
    return false;
  }
}

export const FROM_EMAIL =
  process.env.SMTP_FROM || "Shri Gurukripa Tours <noreply@shrigurukripa.com>";
