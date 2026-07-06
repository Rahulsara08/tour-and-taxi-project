/**
 * ═══════════════════════════════════════════════════════════
 *  Shri Gurukripa Tours & Taxi — HTML Email Templates
 *  All templates are mobile-friendly, brand-consistent, gorgeous.
 * ═══════════════════════════════════════════════════════════
 */

const BRAND = {
  name:    "Shri Gurukripa Tours & Taxi",
  tagline: "Your Journey, Our Commitment.",
  phone:   "9950072777",
  email:   "support@shrigurukripa.com",
  website: "https://shrigurukripa.com",
  colors: {
    primary:   "#1e3a5f",   // dark navy
    accent:    "#d4a017",   // golden
    accentAlt: "#f97316",   // orange
    bg:        "#f8f6f1",   // warm cream
    text:      "#1a1a2e",
    muted:     "#64748b",
  },
};

// ─── Shared wrapper ────────────────────────────────────────
function wrapTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',Arial,sans-serif; background:${BRAND.colors.bg}; color:${BRAND.colors.text}; }
    .email-wrapper { max-width:620px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,0.10); }
    .header { background:linear-gradient(135deg,${BRAND.colors.primary} 0%,#2d5a8e 100%); padding:36px 32px; text-align:center; position:relative; }
    .header-logo { font-size:26px; font-weight:800; color:${BRAND.colors.accent}; letter-spacing:1px; }
    .header-tagline { font-size:12px; color:rgba(255,255,255,0.65); margin-top:4px; letter-spacing:2px; text-transform:uppercase; }
    .header-divider { width:60px; height:3px; background:${BRAND.colors.accent}; margin:14px auto 0; border-radius:4px; }
    .body { padding:36px 32px; }
    .greeting { font-size:22px; font-weight:700; color:${BRAND.colors.primary}; margin-bottom:10px; }
    .body p { font-size:15px; line-height:1.7; color:${BRAND.colors.muted}; margin-bottom:16px; }
    .card { background:${BRAND.colors.bg}; border-radius:12px; padding:24px; margin:24px 0; border-left:5px solid ${BRAND.colors.accent}; }
    .card-row { display:flex; justify-content:space-between; align-items:flex-start; padding:10px 0; border-bottom:1px solid #e8e4d9; font-size:14px; }
    .card-row:last-child { border-bottom:none; }
    .card-label { color:${BRAND.colors.muted}; font-weight:600; width:45%; }
    .card-value { color:${BRAND.colors.text}; font-weight:700; width:55%; text-align:right; }
    .badge { display:inline-block; padding:4px 14px; border-radius:50px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
    .badge-success { background:#dcfce7; color:#166534; }
    .badge-warning { background:#fef9c3; color:#854d0e; }
    .badge-danger  { background:#fee2e2; color:#991b1b; }
    .otp-box { text-align:center; margin:30px 0; }
    .otp-code { font-size:52px; font-weight:800; letter-spacing:14px; color:${BRAND.colors.primary}; background:linear-gradient(135deg,#eef2ff,#e0e7ff); display:inline-block; padding:20px 36px; border-radius:16px; border:2px dashed ${BRAND.colors.accent}; }
    .otp-expiry { font-size:13px; color:${BRAND.colors.muted}; margin-top:12px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(135deg,${BRAND.colors.primary},#2d5a8e); color:#fff!important; text-decoration:none; border-radius:10px; font-weight:700; font-size:15px; margin:8px 6px; text-align:center; }
    .btn-gold { background:linear-gradient(135deg,${BRAND.colors.accent},#b8860b); }
    .divider { border:none; border-top:1px solid #e8e4d9; margin:24px 0; }
    .footer { background:${BRAND.colors.primary}; padding:28px 32px; text-align:center; }
    .footer p { color:rgba(255,255,255,0.65); font-size:12px; line-height:1.8; }
    .footer a { color:${BRAND.colors.accent}; text-decoration:none; font-weight:600; }
    .contact-strip { display:flex; justify-content:center; gap:20px; margin:16px 0; flex-wrap:wrap; }
    .contact-item { display:flex; align-items:center; gap:6px; font-size:13px; color:rgba(255,255,255,0.8); }
    .warning-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:16px 20px; margin-top:20px; font-size:13px; color:#9a3412; }
    @media(max-width:480px){
      .body,.header { padding:24px 20px; }
      .otp-code { font-size:36px; letter-spacing:8px; padding:16px 24px; }
      .card-row { flex-direction:column; gap:4px; }
      .card-value { text-align:left; }
    }
  </style>
</head>
<body>
<div style="padding:20px 16px; background:${BRAND.colors.bg};">
  <div class="email-wrapper">
    <div class="header">
      <div class="header-logo">🚖 ${BRAND.name}</div>
      <div class="header-tagline">${BRAND.tagline}</div>
      <div class="header-divider"></div>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      <div class="contact-strip">
        <span class="contact-item">📞 <a href="tel:${BRAND.phone}">${BRAND.phone}</a></span>
        <span class="contact-item">✉️ <a href="mailto:${BRAND.email}">${BRAND.email}</a></span>
        <span class="contact-item">🌐 <a href="${BRAND.website}">${BRAND.website}</a></span>
      </div>
      <p>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
      <p style="margin-top:6px;">Serving Rajasthan with Royal Comfort 🏰</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── 1. OTP Email ───────────────────────────────────────────
export function otpTemplate(params: {
  userName: string;
  otp: string;
  expiryMinutes?: number;
}): { subject: string; html: string } {
  const { userName, otp, expiryMinutes = 5 } = params;
  const body = `
    <div class="greeting">Hello, ${userName}! 👋</div>
    <p>We received a request to verify your email for <strong>${BRAND.name}</strong>. Use the secure code below to continue.</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">⏱️ This code expires in <strong>${expiryMinutes} minutes</strong></div>
    </div>
    <div class="warning-box">
      🔒 <strong>Security Notice:</strong> Do not share this code with anyone. Our team will never ask for your OTP. If you didn't request this, please ignore this email.
    </div>`;
  return {
    subject: `${otp} — Your Login Code | ${BRAND.name}`,
    html: wrapTemplate("Login Verification", body),
  };
}

// ─── 2. Booking Confirmation ────────────────────────────────
export function bookingConfirmationTemplate(params: {
  userName: string;
  bookingId: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  vehicle: string;
  passengers: number;
  fare: number;
  tripType: string;
  paymentStatus?: string;
}): { subject: string; html: string } {
  const {
    userName, bookingId, pickup, drop, date, time,
    vehicle, passengers, fare, tripType, paymentStatus = "Pending",
  } = params;
  const paidBadge = paymentStatus.toLowerCase() === "paid"
    ? `<span class="badge badge-success">✓ Paid</span>`
    : `<span class="badge badge-warning">⏳ Pending</span>`;
  const body = `
    <div class="greeting">Booking Confirmed! 🎉</div>
    <p>Dear <strong>${userName}</strong>, thank you for choosing <strong>${BRAND.name}</strong>. Your booking is confirmed and we are excited to serve you on your journey!</p>
    <div class="card">
      <div class="card-row"><span class="card-label">📋 Booking ID</span><span class="card-value">${bookingId}</span></div>
      <div class="card-row"><span class="card-label">🗺️ Trip Type</span><span class="card-value">${tripType}</span></div>
      <div class="card-row"><span class="card-label">📍 Pickup</span><span class="card-value">${pickup}</span></div>
      <div class="card-row"><span class="card-label">🏁 Destination</span><span class="card-value">${drop}</span></div>
      <div class="card-row"><span class="card-label">📅 Journey Date</span><span class="card-value">${date}</span></div>
      <div class="card-row"><span class="card-label">🕐 Journey Time</span><span class="card-value">${time}</span></div>
      <div class="card-row"><span class="card-label">🚗 Vehicle</span><span class="card-value">${vehicle}</span></div>
      <div class="card-row"><span class="card-label">👥 Passengers</span><span class="card-value">${passengers}</span></div>
      <div class="card-row"><span class="card-label">💰 Total Fare</span><span class="card-value" style="color:#166534;font-size:18px;">₹${fare.toLocaleString("en-IN")}</span></div>
      <div class="card-row"><span class="card-label">💳 Payment</span><span class="card-value">${paidBadge}</span></div>
    </div>
    <p>Need help? Call us anytime at <strong>📞 ${BRAND.phone}</strong>. We wish you a safe and royal journey! 🏰✨</p>
    <div style="text-align:center;margin-top:24px;">
      <a href="tel:${BRAND.phone}" class="btn btn-gold">📞 Call Support</a>
      <a href="https://wa.me/91${BRAND.phone}?text=Booking%20ID:%20${bookingId}" class="btn">💬 WhatsApp Us</a>
    </div>`;
  return {
    subject: `✅ Booking Confirmed — ${bookingId} | ${BRAND.name}`,
    html: wrapTemplate("Booking Confirmed", body),
  };
}

// ─── 3. Booking Cancelled ───────────────────────────────────
export function bookingCancelledTemplate(params: {
  userName: string;
  bookingId: string;
  refundStatus?: string;
  refundAmount?: number;
  refundDays?: number;
}): { subject: string; html: string } {
  const { userName, bookingId, refundStatus = "Processing", refundAmount = 0, refundDays = 5 } = params;
  const body = `
    <div class="greeting">Booking Cancelled 😔</div>
    <p>Dear <strong>${userName}</strong>, your booking <strong>${bookingId}</strong> has been cancelled as requested.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">📋 Booking ID</span><span class="card-value">${bookingId}</span></div>
      <div class="card-row"><span class="card-label">🔄 Refund Status</span><span class="card-value"><span class="badge badge-warning">${refundStatus}</span></span></div>
      ${refundAmount > 0 ? `<div class="card-row"><span class="card-label">💰 Refund Amount</span><span class="card-value">₹${refundAmount.toLocaleString("en-IN")}</span></div>` : ""}
      <div class="card-row"><span class="card-label">📆 Expected Refund</span><span class="card-value">Within ${refundDays} business days</span></div>
    </div>
    <p>If you cancelled by mistake or need help, please contact us immediately at <strong>${BRAND.phone}</strong>.</p>
    <div style="text-align:center;margin-top:24px;">
      <a href="tel:${BRAND.phone}" class="btn">📞 Contact Support</a>
    </div>`;
  return {
    subject: `❌ Booking Cancelled — ${bookingId} | ${BRAND.name}`,
    html: wrapTemplate("Booking Cancelled", body),
  };
}

// ─── 4. Driver Assigned ─────────────────────────────────────
export function driverAssignedTemplate(params: {
  userName: string;
  bookingId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleModel: string;
  pickupTime: string;
  mapsLink?: string;
}): { subject: string; html: string } {
  const { userName, bookingId, driverName, driverPhone, vehicleNumber, vehicleModel, pickupTime, mapsLink } = params;
  const body = `
    <div class="greeting">Your Driver is Assigned! 🚗</div>
    <p>Dear <strong>${userName}</strong>, great news! Your driver has been assigned for booking <strong>${bookingId}</strong>.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">👨‍✈️ Driver Name</span><span class="card-value">${driverName}</span></div>
      <div class="card-row"><span class="card-label">📱 Driver Phone</span><span class="card-value"><a href="tel:${driverPhone}" style="color:#1e3a5f;">${driverPhone}</a></span></div>
      <div class="card-row"><span class="card-label">🚗 Vehicle</span><span class="card-value">${vehicleModel}</span></div>
      <div class="card-row"><span class="card-label">🔢 Vehicle Number</span><span class="card-value">${vehicleNumber}</span></div>
      <div class="card-row"><span class="card-label">🕐 Pickup Time</span><span class="card-value">${pickupTime}</span></div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="tel:${driverPhone}" class="btn btn-gold">📞 Call Driver</a>
      ${mapsLink ? `<a href="${mapsLink}" class="btn">📍 Track on Maps</a>` : ""}
    </div>`;
  return {
    subject: `🚗 Driver Assigned — ${bookingId} | ${BRAND.name}`,
    html: wrapTemplate("Driver Assigned", body),
  };
}

// ─── 5. Trip Reminder ───────────────────────────────────────
export function tripReminderTemplate(params: {
  userName: string;
  bookingId: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  driverName?: string;
  driverPhone?: string;
  hoursLeft: number;
}): { subject: string; html: string } {
  const { userName, bookingId, pickup, drop, date, time, driverName, driverPhone, hoursLeft } = params;
  const body = `
    <div class="greeting">Reminder: Your Trip is in ${hoursLeft} Hours! ⏰</div>
    <p>Dear <strong>${userName}</strong>, this is a friendly reminder about your upcoming journey with <strong>${BRAND.name}</strong>.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">📋 Booking ID</span><span class="card-value">${bookingId}</span></div>
      <div class="card-row"><span class="card-label">📍 Pickup</span><span class="card-value">${pickup}</span></div>
      <div class="card-row"><span class="card-label">🏁 Drop</span><span class="card-value">${drop}</span></div>
      <div class="card-row"><span class="card-label">📅 Date</span><span class="card-value">${date}</span></div>
      <div class="card-row"><span class="card-label">🕐 Time</span><span class="card-value">${time}</span></div>
      ${driverName ? `<div class="card-row"><span class="card-label">👨‍✈️ Driver</span><span class="card-value">${driverName}</span></div>` : ""}
      ${driverPhone ? `<div class="card-row"><span class="card-label">📱 Driver Phone</span><span class="card-value">${driverPhone}</span></div>` : ""}
    </div>
    <p>Please be ready 10 minutes before your pickup time. Keep your ID proof ready. Have a wonderful journey! 🌟</p>
    <div style="text-align:center;margin-top:24px;">
      <a href="tel:${BRAND.phone}" class="btn">📞 Call Support</a>
      <a href="https://wa.me/91${BRAND.phone}" class="btn btn-gold">💬 WhatsApp</a>
    </div>`;
  return {
    subject: `⏰ Trip Reminder (${hoursLeft}h) — ${bookingId} | ${BRAND.name}`,
    html: wrapTemplate("Trip Reminder", body),
  };
}

// ─── 6. Welcome Email ───────────────────────────────────────
export function welcomeTemplate(params: {
  userName: string;
  email: string;
}): { subject: string; html: string } {
  const { userName, email } = params;
  const body = `
    <div class="greeting">Welcome to ${BRAND.name}! 🎊</div>
    <p>Dear <strong>${userName}</strong>, welcome aboard! Your account has been successfully created with email <strong>${email}</strong>.</p>
    <p>You can now book premium cab services across Rajasthan — Jaipur, Udaipur, Jodhpur, Jaisalmer, Pushkar and more!</p>
    <div class="card">
      <div class="card-row"><span class="card-label">✅ One-Way Trips</span><span class="card-value">Starting ₹999</span></div>
      <div class="card-row"><span class="card-label">🔄 Round Trips</span><span class="card-value">Best Value Packages</span></div>
      <div class="card-row"><span class="card-label">🌆 Local Rental</span><span class="card-value">4h / 8h Packages</span></div>
      <div class="card-row"><span class="card-label">✈️ Airport Transfers</span><span class="card-value">Always On Time</span></div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="${BRAND.website}" class="btn btn-gold">🚖 Book Your First Ride</a>
    </div>`;
  return {
    subject: `🎊 Welcome to ${BRAND.name}!`,
    html: wrapTemplate("Welcome", body),
  };
}

// ─── 7. Admin Notification ──────────────────────────────────
export function adminNotificationTemplate(params: {
  eventType: "New Booking" | "New Registration" | "Payment Success" | "Payment Failure" | "Booking Cancellation";
  details: Record<string, string | number>;
}): { subject: string; html: string } {
  const { eventType, details } = params;
  const emojiMap: Record<string, string> = {
    "New Booking": "📋",
    "New Registration": "👤",
    "Payment Success": "✅",
    "Payment Failure": "❌",
    "Booking Cancellation": "🚫",
  };
  const emoji = emojiMap[eventType] || "🔔";
  const rows = Object.entries(details)
    .map(([k, v]) => `<div class="card-row"><span class="card-label">${k}</span><span class="card-value">${v}</span></div>`)
    .join("");
  const body = `
    <div class="greeting">${emoji} Admin Alert: ${eventType}</div>
    <p>A new event occurred on your platform. Details below:</p>
    <div class="card">${rows}</div>
    <p style="font-size:12px;color:#94a3b8;">This is an automated admin notification. Do not reply to this email.</p>`;
  return {
    subject: `${emoji} Admin: ${eventType} | ${BRAND.name}`,
    html: wrapTemplate(`Admin — ${eventType}`, body),
  };
}
