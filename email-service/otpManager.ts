/**
 * ═══════════════════════════════════════════════════════════
 *  Shri Gurukripa — OTP Manager
 *  Generates, stores & verifies secure 6-digit OTPs in memory.
 *  For production, replace the Map with Firebase/Firestore or Redis.
 * ═══════════════════════════════════════════════════════════
 */

import crypto from "crypto";

interface OTPRecord {
  hashedOtp:  string;
  expiry:     number; // Unix timestamp (ms)
  used:       boolean;
  attempts:   number;
  resendCount: number;
  lastResend: number;
}

// In-memory store: email -> OTPRecord
// Replace with DB calls in production!
const otpStore = new Map<string, OTPRecord>();

const OTP_EXPIRY_MS   = (Number(process.env.OTP_EXPIRY)  || 300) * 1000; // default 5 min
const MAX_ATTEMPTS    = 3;
const MAX_RESENDS     = 5;
const RESEND_COOLDOWN = 60_000; // 60 seconds

// ── Helpers ───────────────────────────────────────────────
function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOtp(): string {
  // Cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
}

// ── Generate & store OTP ──────────────────────────────────
export function createOtp(email: string): { otp: string; error?: string } {
  const existing = otpStore.get(email);

  if (existing) {
    // Resend cooldown check
    const now = Date.now();
    if (existing.resendCount >= MAX_RESENDS) {
      return { otp: "", error: "Too many OTP requests. Please try again later." };
    }
    if (now - existing.lastResend < RESEND_COOLDOWN) {
      const wait = Math.ceil((RESEND_COOLDOWN - (now - existing.lastResend)) / 1000);
      return { otp: "", error: `Please wait ${wait} seconds before requesting a new code.` };
    }
  }

  const otp = generateOtp();
  const record: OTPRecord = {
    hashedOtp:   hashOtp(otp),
    expiry:      Date.now() + OTP_EXPIRY_MS,
    used:        false,
    attempts:    0,
    resendCount: existing ? existing.resendCount + 1 : 0,
    lastResend:  Date.now(),
  };

  otpStore.set(email, record);

  // Auto-clean after expiry + 1 min buffer
  setTimeout(() => otpStore.delete(email), OTP_EXPIRY_MS + 60_000);

  return { otp };
}

// ── Verify OTP ────────────────────────────────────────────
export function verifyOtp(
  email: string,
  inputOtp: string
): { success: boolean; error?: string } {
  const record = otpStore.get(email);

  if (!record) {
    return { success: false, error: "No OTP found. Please request a new one." };
  }
  if (record.used) {
    return { success: false, error: "This OTP has already been used." };
  }
  if (Date.now() > record.expiry) {
    otpStore.delete(email);
    return { success: false, error: "OTP has expired. Please request a new one." };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    return { success: false, error: "Too many failed attempts. Please request a new OTP." };
  }

  const isValid = hashOtp(inputOtp) === record.hashedOtp;

  if (!isValid) {
    record.attempts += 1;
    otpStore.set(email, record);
    const left = MAX_ATTEMPTS - record.attempts;
    return { success: false, error: `Invalid code. ${left} attempt${left !== 1 ? "s" : ""} remaining.` };
  }

  // Mark used
  record.used = true;
  otpStore.set(email, record);
  return { success: true };
}

// ── Clear OTP (on successful login/logout) ────────────────
export function clearOtp(email: string): void {
  otpStore.delete(email);
}
