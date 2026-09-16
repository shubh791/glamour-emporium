import crypto from "crypto";

/**
 * Returns active Cashfree configuration from environment variables
 */
export function getCashfreeConfig() {
  const appId = process.env.CASHFREE_APP_ID?.trim() || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY?.trim() || "";
  const env = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox")
    .toLowerCase()
    .trim();
  const baseUrl =
    env === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  const apiVersion = "2023-08-01";

  return {
    appId,
    secretKey,
    env,
    baseUrl,
    apiVersion,
    isConfigured: Boolean(appId && secretKey),
  };
}

/**
 * Creates a Cashfree Order on the server (PG API v2023-08-01)
 * @param {Object} params
 * @param {string} params.orderId - Unique order ID (associated with booking)
 * @param {number} params.orderAmount - Amount in INR (e.g. 99)
 * @param {Object} params.customerDetails - { customerId, customerName, customerPhone, customerEmail }
 * @param {string} [params.returnUrl] - Optional redirect URL
 * @returns {Promise<{success: boolean, paymentSessionId?: string, orderId?: string, raw?: any, error?: string, code?: string}>}
 */
export async function createCashfreeOrder({
  orderId,
  orderAmount = 99,
  customerDetails = {},
  returnUrl,
}) {
  const config = getCashfreeConfig();

  // Temporary development trace log (Safe: no secrets logged)
  console.log("[Cashfree Server PG] Initiating order creation:", {
    orderId,
    orderAmount: Number(orderAmount),
    environment: config.env,
    baseUrl: config.baseUrl,
    hasAppId: Boolean(config.appId),
    hasSecretKey: Boolean(config.secretKey),
  });

  if (!config.isConfigured) {
    const errorMsg =
      "Cashfree credentials missing on server. CASHFREE_APP_ID or CASHFREE_SECRET_KEY is empty in .env.local.";
    console.error("[Cashfree Server PG Error]", errorMsg);
    return {
      success: false,
      error: errorMsg,
      code: "CASHFREE_CONFIG_MISSING",
    };
  }

  // Normalize Indian phone to clean 10-digit number for Cashfree customer_details
  const rawPhone = customerDetails.customerPhone || "";
  const cleanPhone = String(rawPhone).replace(/\D/g, "").slice(-10);

  const payload = {
    order_id: String(orderId),
    order_amount: Number(orderAmount),
    order_currency: "INR",
    customer_details: {
      customer_id: customerDetails.customerId || `cust_${cleanPhone || Date.now()}`,
      customer_name: (customerDetails.customerName || "Salon Customer").trim(),
      customer_phone: cleanPhone,
      customer_email: customerDetails.customerEmail || "customer@glamouremporium.in",
    },
    order_meta: {
      return_url: returnUrl || undefined,
    },
    order_note: "Glamour Emporium Appointment Booking Advance",
  };

  try {
    const response = await fetch(`${config.baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": config.appId,
        "x-client-secret": config.secretKey,
        "x-api-version": config.apiVersion,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Development trace logging (Safe: no secrets)
    console.log("[Cashfree Server PG] /orders response:", {
      httpStatus: response.status,
      orderId: data?.order_id || orderId,
      orderStatus: data?.order_status,
      hasPaymentSessionId: Boolean(data?.payment_session_id),
      message: data?.message || null,
      code: data?.code || null,
    });

    if (!response.ok) {
      const errorMsg = data?.message || `Cashfree PG error (${response.status})`;
      console.error("[Cashfree Server PG Error Response]", data);
      return {
        success: false,
        error: errorMsg,
        code: data?.code || "CASHFREE_API_ERROR",
        raw: data,
      };
    }

    if (!data.payment_session_id) {
      return {
        success: false,
        error: "Cashfree API response did not contain payment_session_id.",
        code: "NO_SESSION_ID",
        raw: data,
      };
    }

    return {
      success: true,
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
      orderStatus: data.order_status,
      raw: data,
    };
  } catch (fetchErr) {
    console.error("[Cashfree Server PG Network Exception]", fetchErr);
    return {
      success: false,
      error: `Network error connecting to Cashfree (${config.env}): ${fetchErr.message}`,
      code: "NETWORK_ERROR",
    };
  }
}

/**
 * Fetches order details directly from Cashfree PG API
 * @param {string} orderId
 * @returns {Promise<any>}
 */
export async function fetchCashfreeOrder(orderId) {
  const config = getCashfreeConfig();
  if (!config.isConfigured) {
    throw new Error("Cashfree credentials missing.");
  }

  const response = await fetch(
    `${config.baseUrl}/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      headers: {
        "x-client-id": config.appId,
        "x-client-secret": config.secretKey,
        "x-api-version": config.apiVersion,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Failed to fetch Cashfree order (${response.status})`);
  }

  return data;
}

/**
 * Fetches payment details for an order from Cashfree PG API
 * @param {string} orderId
 * @returns {Promise<any[]>}
 */
export async function fetchCashfreeOrderPayments(orderId) {
  const config = getCashfreeConfig();
  if (!config.isConfigured) {
    throw new Error("Cashfree credentials missing.");
  }

  const response = await fetch(
    `${config.baseUrl}/orders/${encodeURIComponent(orderId)}/payments`,
    {
      method: "GET",
      headers: {
        "x-client-id": config.appId,
        "x-client-secret": config.secretKey,
        "x-api-version": config.apiVersion,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Verifies Cashfree Webhook Signature (HMAC-SHA256)
 * @param {Object} params
 * @param {string} params.rawBody - Raw unparsed request body string
 * @param {string} params.signature - Value from x-webhook-signature header
 * @param {string} params.timestamp - Value from x-webhook-timestamp header
 * @returns {boolean}
 */
export function verifyCashfreeWebhookSignature({ rawBody, signature, timestamp }) {
  const config = getCashfreeConfig();
  if (!config.secretKey || !signature || !timestamp || !rawBody) {
    return false;
  }

  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const computedSignature = crypto
      .createHmac("sha256", config.secretKey)
      .update(dataToSign)
      .digest("base64");

    return signature === computedSignature;
  } catch (err) {
    console.error("[Cashfree Webhook] Signature verification error:", err);
    return false;
  }
}
