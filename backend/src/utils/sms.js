import { config } from "dotenv";
config();

/**
 * Dynamic Multi-Provider SMS Utility
 * Supports:
 * 1. Twilio (via native HTTP Fetch)
 * 2. Fast2SMS (Indian Gateway)
 * 3. 2Factor.in (Indian Gateway)
 * 4. Console Box Fallback (Zero setup, interruption-free testing)
 */
export async function sendSMS(to, body) {
  const provider = (process.env.SMS_PROVIDER || "").toLowerCase();

  // 1. Twilio Integration
  if (provider === "twilio" || (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && !provider)) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!sid || !token || !from) {
      console.warn("⚠️ Twilio credentials missing in .env. Falling back to Console Log.");
      return logToConsole(to, body);
    }

    try {
      const basicAuth = Buffer.from(`${sid}:${token}`).toString("base64");
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Body: body,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Twilio API returned status ${res.status}`);
      }

      console.log(`✅ Twilio SMS sent successfully to ${to}. SID: ${data.sid}`);
      return { sid: data.sid, provider: "twilio", to, body };
    } catch (err) {
      console.error("❌ Twilio SMS delivery failed:", err.message);
      throw new Error(`Twilio SMS delivery failed: ${err.message}`);
    }
  }

  // 2. Fast2SMS Integration
  if (provider === "fast2sms" || (process.env.FAST2SMS_API_KEY && !provider)) {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Fast2SMS API key missing in .env. Falling back to Console Log.");
      return logToConsole(to, body);
    }

    try {
      const cleanPhone = to.replace(/\D/g, "");
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: body,
          language: "english",
          numbers: cleanPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.return) {
        throw new Error(data.message || `Fast2SMS returned return=false`);
      }

      console.log(`✅ Fast2SMS SMS sent successfully to ${to}. Message: ${data.message}`);
      return { sid: data.request_id || "fast2sms-success", provider: "fast2sms", to, body };
    } catch (err) {
      console.error("❌ Fast2SMS delivery failed:", err.message);
      throw new Error(`Fast2SMS delivery failed: ${err.message}`);
    }
  }

  // 3. 2Factor.in Integration
  if (provider === "2factor" || (process.env.TWOFACTOR_API_KEY && !provider)) {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ 2Factor API key missing in .env. Falling back to Console Log.");
      return logToConsole(to, body);
    }

    try {
      const cleanPhone = to.replace(/\D/g, "");
      // Try to extract a 6 digit OTP from the body text
      const otpMatch = body.match(/\b\d{6}\b/);
      const otp = otpMatch ? otpMatch[0] : "";

      let url;
      if (otp) {
        // Use 2Factor's high-speed OTP endpoint
        url = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/${otp}`;
      } else {
        // Use general SMS template or addon service (fall back)
        url = `https://2factor.in/API/V1/${apiKey}/ADDON_SERVICES/SEND/TSMS`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.Status !== "Success") {
        throw new Error(data.Details || "2Factor API failed");
      }

      console.log(`✅ 2Factor SMS sent successfully to ${to}. Session ID: ${data.Details}`);
      return { sid: data.Details, provider: "2factor", to, body };
    } catch (err) {
      console.error("❌ 2Factor delivery failed:", err.message);
      throw new Error(`2Factor delivery failed: ${err.message}`);
    }
  }

  // 4. Default: Console Log Fallback (Zero Setup & Free)
  return logToConsole(to, body);
}

/**
 * Beautiful, high-visibility Console Box logger
 */
function logToConsole(to, body) {
  const line = "═".repeat(60);
  const title = "🔐 SECURE SMS OTP BOX (DEVELOPER FALLBACK)";
  
  console.info(`
╔${line}╗
║ ${title.padEnd(58)} ║
╠${line}╣
║ Recipient: ${to.padEnd(47)} ║
║ Status:    FREE / DEVELOPMENT MODE (No API cost)              ║
║ Message:   ${body.padEnd(47)} ║
╚${line}╝
`);

  return { sid: "console-fallback-placeholder", provider: "console", to, body };
}
