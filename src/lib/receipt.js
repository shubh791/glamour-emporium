import { formatDisplayDate } from "@/data/bookingConfig";

/**
 * Generates official high-definition printable HTML receipt
 * @param {Object} booking - Booking database record
 * @returns {string} HTML document string
 */
export function generateReceiptHtml(booking) {
  const maskedPhone = "+91 •••••• " + booking.phone.slice(-4);
  const serviceDisplay = booking.service
    ? (booking.serviceCategory && booking.service !== booking.serviceCategory
        ? `${booking.service} (${booking.serviceCategory})`
        : booking.service)
    : booking.serviceCategory || "Salon Service";

  const formattedBookingDate = formatDisplayDate(booking.bookingDate) || booking.bookingDate;

  const formattedPaymentDate = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Glamour-Emporium-${booking.bookingCode}-Advance-Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: #0c0b0a;
      color: #1a1918;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      padding: 30px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .no-print-bar {
      width: 100%;
      max-width: 680px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .btn-gold {
      background-color: #c9a87c;
      color: #0c0b0a;
    }
    .btn-gold:hover {
      background-color: #dfbe93;
    }

    .btn-dark {
      background-color: #181614;
      color: #eae6df;
      border-color: rgba(255, 255, 255, 0.15);
    }
    .btn-dark:hover {
      border-color: #c9a87c;
      color: #fff;
    }

    .receipt-container {
      width: 100%;
      max-width: 680px;
      background: #ffffff;
      color: #1a1918;
      border: 1px solid #c9a87c;
      padding: 40px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
      position: relative;
    }

    .receipt-header {
      text-align: center;
      border-bottom: 2px solid #f0ede6;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #111;
      margin-bottom: 4px;
    }

    .brand-subtitle {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.22em;
      color: #8c7355;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .receipt-title-badge {
      display: inline-block;
      background: #fbf9f5;
      border: 1px solid #c9a87c;
      color: #8c7355;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 16px;
      margin-bottom: 12px;
    }

    .legal-text {
      font-size: 11px;
      color: #555;
      line-height: 1.5;
    }

    .legal-meta {
      display: inline-block;
      margin-top: 6px;
      padding: 3px 10px;
      background: #fbf9f5;
      border: 1px solid #ebe5d8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #444;
      letter-spacing: 0.05em;
    }

    .receipt-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fbf9f5;
      border: 1px solid #ebe5d8;
      padding: 12px 18px;
      margin-bottom: 24px;
    }

    .receipt-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 0.1em;
      color: #111;
    }

    .badge-confirmed {
      background: #114b2d;
      color: #e5fbe8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 2px;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }

    .details-table tr {
      border-bottom: 1px solid #f0ede6;
    }

    .details-table td {
      padding: 10px 0;
      font-size: 13px;
      vertical-align: top;
    }

    .details-label {
      width: 38%;
      color: #666;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .details-value {
      width: 62%;
      color: #111;
      font-weight: 500;
      text-align: right;
    }

    .amount-box {
      background: #fbf9f5;
      border: 1px dashed #c9a87c;
      padding: 16px 20px;
      margin-bottom: 24px;
    }

    .amount-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .amount-row.total {
      margin-bottom: 0;
      padding-top: 8px;
      border-top: 1px solid #ebe5d8;
      font-weight: 600;
    }

    .amount-label {
      font-size: 13px;
      color: #333;
    }

    .amount-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 600;
      color: #111;
    }

    .notice-box {
      background: #fffdfa;
      border-left: 3px solid #c9a87c;
      padding: 12px 16px;
      font-size: 11.5px;
      line-height: 1.6;
      color: #444;
      margin-bottom: 24px;
    }

    .receipt-footer {
      text-align: center;
      border-top: 1px solid #f0ede6;
      padding-top: 18px;
      font-size: 11px;
      color: #777;
      line-height: 1.5;
    }

    @media print {
      body {
        background: #ffffff;
        color: #000000;
        padding: 0;
      }
      .no-print-bar {
        display: none !important;
      }
      .receipt-container {
        border: none;
        box-shadow: none;
        padding: 20px;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <a href="/find-booking" class="btn btn-dark">← Return to Bookings</a>
    <button onclick="window.print()" class="btn btn-gold">🖨️ Print / Save as PDF</button>
  </div>

  <div class="receipt-container">
    <div class="receipt-header">
      <div class="brand-title">Glamour Emporium</div>
      <div class="brand-subtitle">Unisex Salon • Panipat</div>
      <div class="receipt-title-badge">Advance Payment Receipt</div>
      <div class="legal-text">
        Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103<br>
        Phone: +91 74950 68282
      </div>
      <div class="legal-meta">
        SS Enterprises (Proprietor: Salma Saifi) | GSTIN: 06OXPPS0718P1ZD
      </div>
    </div>

    <div class="receipt-badge-row">
      <div>
        <div style="font-size:9px; color:#888; font-family:'JetBrains Mono', monospace; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:2px;">Booking Reference</div>
        <div class="receipt-code">${booking.bookingCode}</div>
      </div>
      <div class="badge-confirmed">CONFIRMED &amp; PAID</div>
    </div>

    <table class="details-table">
      <tr>
        <td class="details-label">Customer Name</td>
        <td class="details-value">${booking.customerName}</td>
      </tr>
      <tr>
        <td class="details-label">Mobile Number</td>
        <td class="details-value">${maskedPhone}</td>
      </tr>
      <tr>
        <td class="details-label">Service</td>
        <td class="details-value">${serviceDisplay}</td>
      </tr>
      <tr>
        <td class="details-label">Appointment Date</td>
        <td class="details-value" style="color:#8c7355; font-weight:600;">${formattedBookingDate}</td>
      </tr>
      <tr>
        <td class="details-label">Time Slot</td>
        <td class="details-value" style="color:#8c7355; font-weight:600;">${booking.bookingTime}</td>
      </tr>
      ${booking.notes ? `
      <tr>
        <td class="details-label">Special Notes</td>
        <td class="details-value" style="font-size:12px; color:#555;">${booking.notes}</td>
      </tr>` : ""}
      <tr>
        <td class="details-label">Payment Mode</td>
        <td class="details-value">Online via Razorpay</td>
      </tr>
      ${booking.razorpayPaymentId ? `
      <tr>
        <td class="details-label">Payment ID</td>
        <td class="details-value" style="font-family:'JetBrains Mono', monospace; font-size:11px;">${booking.razorpayPaymentId}</td>
      </tr>` : ""}
      <tr>
        <td class="details-label">Payment Date</td>
        <td class="details-value" style="font-size:12px; color:#666;">${formattedPaymentDate}</td>
      </tr>
    </table>

    <div class="amount-box">
      <div class="amount-row">
        <span class="amount-label">Appointment Advance Fee</span>
        <span class="amount-value">₹${booking.amount || 99}.00</span>
      </div>
      <div class="amount-row total">
        <span class="amount-label">Total Amount Paid</span>
        <span class="amount-value" style="color:#114b2d;">₹${booking.amount || 99}.00 ${booking.currency || "INR"}</span>
      </div>
    </div>

    <div class="notice-box">
      <strong>Important Notice:</strong> Advance amount will be adjusted against the final salon bill. (This is an official advance payment receipt, not a final tax invoice).
    </div>

    <div class="receipt-footer">
      Thank you for choosing Glamour Emporium Unisex Salon.<br>
      Please arrive 5–10 minutes before your scheduled appointment time.
    </div>
  </div>
</body>
</html>`;
}
