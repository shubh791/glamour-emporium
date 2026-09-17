import crypto from "crypto";
import Razorpay from "razorpay";

/**
 * Returns active Razorpay configuration from environment variables
 */
export function getRazorpayConfig() {
  const keyId =
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || "";

  const isPlaceholder =
    !keyId ||
    !keySecret ||
    keyId.includes("placeholder") ||
    keyId.includes("xxxx") ||
    keySecret.includes("placeholder") ||
    keySecret.includes("your_test_secret");

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured: Boolean(keyId && keySecret && !isPlaceholder),
  };
}

/**
 * Returns an authenticated Razorpay instance
 */
export function getRazorpayInstance() {
  const { keyId, keySecret, isConfigured } = getRazorpayConfig();
  if (!isConfigured) {
    throw new Error(
      "Razorpay credentials not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Creates a Razorpay Order on the server
 * @param {Object} params
 * @param {string} params.bookingCode - Unique booking receipt identifier
 * @param {number} params.orderAmount - Amount in INR (e.g. 99)
 * @param {Object} [params.customerDetails] - { customerName, customerPhone, customerEmail }
 * @param {Object} [params.notes] - Custom metadata notes
 * @returns {Promise<{success: boolean, orderId?: string, amount?: number, currency?: string, keyId?: string, error?: string, code?: string}>}
 */
export async function createRazorpayOrder({
  bookingCode,
  orderAmount = 99,
  customerDetails = {},
  notes = {},
}) {
  const config = getRazorpayConfig();

  if (!config.isConfigured) {
    const errorMsg =
      "Razorpay test keys are not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file to test checkout.";
    console.warn("[Razorpay Server PG Warning]", errorMsg);
    return {
      success: false,
      error: errorMsg,
      code: "RAZORPAY_KEYS_NOT_CONFIGURED",
    };
  }

  try {
    const razorpay = getRazorpayInstance();
    // Razorpay requires amount in lowest currency denomination (paise) -> ₹99 = 9900 paise
    const amountInPaise = Math.round(Number(orderAmount) * 100);

    const cleanPhone = String(customerDetails.customerPhone || "")
      .replace(/\D/g, "")
      .slice(-10);

    const orderPayload = {
      amount: amountInPaise,
      currency: "INR",
      receipt: String(bookingCode).slice(0, 40),
      notes: {
        bookingCode: String(bookingCode),
        customerName: (customerDetails.customerName || "Salon Customer").trim(),
        customerPhone: cleanPhone,
        salon: "Glamour Emporium Unisex Salon, Panipat",
        ...notes,
      },
    };

    console.log("[Razorpay PG] Creating order:", {
      receipt: orderPayload.receipt,
      amountPaise: orderPayload.amount,
      keyIdPrefix: config.keyId.slice(0, 8),
    });

    const order = await razorpay.orders.create(orderPayload);

    console.log("[Razorpay PG] Order created successfully:", {
      orderId: order.id,
      amount: order.amount,
      status: order.status,
      receipt: order.receipt,
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.keyId,
      receipt: order.receipt,
      raw: order,
    };
  } catch (err) {
    console.error("[Razorpay Server PG Order Creation Exception]", err);

    const isAuthError =
      err.statusCode === 401 ||
      err.error?.code === "BAD_REQUEST_ERROR" && err.error?.description === "Authentication failed";

    const errorMessage = isAuthError
      ? "Razorpay payment gateway authentication failed. Please verify active Key ID and Secret in your dashboard or .env.local file."
      : (err.error?.description || err.message || "Failed to create Razorpay order");

    return {
      success: false,
      error: errorMessage,
      code: isAuthError ? "RAZORPAY_AUTH_FAILED" : (err.error?.code || "RAZORPAY_ORDER_FAILED"),
      details: err,
    };
  }
}

/**
 * Cryptographically verifies Razorpay Payment Signature (HMAC SHA-256)
 * @param {Object} params
 * @param {string} params.orderId - Razorpay order ID (e.g. order_...)
 * @param {string} params.paymentId - Razorpay payment ID (e.g. pay_...)
 * @param {string} params.signature - Signature received from client checkout
 * @returns {boolean}
 */
export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature }) {
  const { keyId, keySecret } = getRazorpayConfig();

  // Safe diagnostics in terminal only (never log secrets)
  console.log("[Razorpay Diagnostics - Signature Verification]", {
    hasKeyId: Boolean(keyId),
    hasSecret: Boolean(keySecret),
    receivedOrderId: orderId || null,
    receivedPaymentId: paymentId || null,
    hasSignature: Boolean(signature),
  });

  if (!keySecret || !orderId || !paymentId || !signature) {
    console.warn("[Razorpay Verification] Signature check failed: Missing secret or required payment parameters.");
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const signatureBuf = Buffer.from(signature, "utf-8");

    if (expectedBuf.length !== signatureBuf.length) {
      console.warn("[Razorpay Verification] Signature length mismatch.");
      return false;
    }

    const isValid = crypto.timingSafeEqual(expectedBuf, signatureBuf);
    if (!isValid) {
      console.warn("[Razorpay Verification] Signature mismatch: Calculated HMAC does not match client signature.");
    } else {
      console.log("[Razorpay Verification] Signature verified successfully via HMAC SHA-256.");
    }

    return isValid;
  } catch (err) {
    console.error("[Razorpay Signature Verification Error]", err.message);
    return false;
  }
}

/**
 * Verifies Razorpay Webhook Signature (HMAC SHA-256)
 * @param {Object} params
 * @param {string} params.rawBody - Raw text body of webhook request
 * @param {string} params.signature - Value from x-razorpay-signature header
 * @returns {boolean}
 */
export function verifyRazorpayWebhookSignature({ rawBody, signature }) {
  const { webhookSecret, keySecret } = getRazorpayConfig();
  const secret = webhookSecret || keySecret;

  if (!secret || !rawBody || !signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch (err) {
    console.error("[Razorpay Webhook Signature Verification Error]", err);
    return false;
  }
}

/**
 * Fetches order details directly from Razorpay API
 * @param {string} orderId
 * @returns {Promise<any>}
 */
export async function fetchRazorpayOrder(orderId) {
  const razorpay = getRazorpayInstance();
  return razorpay.orders.fetch(orderId);
}

/**
 * Fetches payment details directly from Razorpay API
 * @param {string} paymentId
 * @returns {Promise<any>}
 */
export async function fetchRazorpayPayment(paymentId) {
  const razorpay = getRazorpayInstance();
  return razorpay.payments.fetch(paymentId);
}
