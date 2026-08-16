/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";

// In-memory cache to prevent duplicate email dispatches for the same message ID
const sentMessagesCache = new Set<string>();
const MAX_CACHE_SIZE = 1000;

function isDuplicateMessage(
  messageId: string,
  conversationId: string,
  messageText: string,
  timestamp?: string,
): boolean {
  const dedupKey =
    messageId || `${conversationId}:${timestamp || Date.now()}:${messageText}`;
  if (sentMessagesCache.has(dedupKey)) {
    return true;
  }
  sentMessagesCache.add(dedupKey);
  // Keep cache bounded to prevent memory leaks
  if (sentMessagesCache.size > MAX_CACHE_SIZE) {
    const firstKey = sentMessagesCache.keys().next().value;
    if (firstKey !== undefined) {
      sentMessagesCache.delete(firstKey);
    }
  }
  return false;
}

// Helper to validate email format
function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to remove any header injection characters (\r, \n)
function sanitizeHeader(str: string): string {
  if (!str) return "";
  return str.replace(/[\r\n]/g, "").trim();
}

// Helper to escape HTML characters to prevent XSS/HTML template breakages
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Email Notification
  app.post("/api/chat/email-notification", async (req, res) => {
    const {
      visitorName,
      visitorEmail,
      projectType,
      message,
      conversationId,
      timestamp,
      sender,
      messageId,
    } = req.body;

    // 1. Strict Sender Verification
    // Do not send emails for admin replies, auto welcome, or system-initiated messages. Only allow sender === "visitor"
    if (sender && sender !== "visitor") {
      console.info(
        `[Email Skip] Skipped notification because sender is '${sender}' (Only 'visitor' triggers emails).`,
      );
      return res
        .status(200)
        .json({ status: "skipped", reason: "ignored_sender_type" });
    }

    // 2. Validate payload parameters
    if (!visitorName || !visitorEmail || !message || !conversationId) {
      return res.status(400).json({
        status: "error",
        error: "missing_required_fields",
        message:
          "Missing required fields: visitorName, visitorEmail, message, or conversationId.",
      });
    }

    // 3. Prevent Duplicate Emails for the Same Message
    if (isDuplicateMessage(messageId, conversationId, message, timestamp)) {
      console.info(
        `[Email Skip] Skipped notification due to duplicate check for messageId: ${messageId || "none"}`,
      );
      return res
        .status(200)
        .json({ status: "skipped", reason: "duplicate_message" });
    }

    // 4. Sanitize and clean inputs to prevent header injection and XSS
    const sanitizedVisitorName = sanitizeHeader(visitorName);
    const sanitizedVisitorEmail = sanitizeHeader(visitorEmail);
    const escapedName = escapeHtml(sanitizedVisitorName);
    const escapedEmail = escapeHtml(sanitizedVisitorEmail);
    const escapedMessage = escapeHtml(message);
    const escapedProjectType = escapeHtml(projectType || "General Inquiry");
    const escapedConversationId = escapeHtml(conversationId);
    const escapedTimestamp = escapeHtml(timestamp);

    let resendKey = process.env.RESEND_API_KEY || "";
    if (!resendKey) {
      console.log(
        "[Server] RESEND_API_KEY is not configured. Notification skipped.",
      );
      return res
        .status(200)
        .json({ status: "skipped", reason: "missing_api_key" });
    }

    let adminEmail = process.env.ADMIN_EMAIL || "rahmanleanur@gmail.com";
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    console.log("Sending email notification...", {
      to: adminEmail,
      visitorName: sanitizedVisitorName,
      visitorEmail: sanitizedVisitorEmail,
      message: message,
      conversationId: conversationId,
    });

    if (!resendKey) {
      const errMsg =
        "RESEND_API_KEY configuration is missing. Notification skipped.";
      console.log("[Server] Notification skipped status:", errMsg);
      return res
        .status(200)
        .json({ status: "skipped", reason: "missing_api_key" });
    }

    try {
      const resend = new Resend(resendKey);
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const adminLink = `${appUrl.replace(/\/$/, "")}/admin`;

      // Build from field correctly depending on whether EMAIL_FROM is formatted or a raw email
      let fromField = emailFrom;
      if (!fromField.includes("<")) {
        fromField = `Leanur Portfolio <${fromField}>`;
      }

      // Build email sending options
      const emailOptions: any = {
        from: fromField,
        to: adminEmail,
        subject: `New Portfolio Chat Message from ${sanitizedVisitorName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Portfolio Chat Message from ${escapedName}</title>
          </head>
          <body style="background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px; color: #111111;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #ff6b00; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
              
              <!-- Header -->
              <div style="padding: 32px 32px 24px 32px; text-align: left; border-bottom: 1px solid #f3f4f6;">
                <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0; letter-spacing: -0.025em; text-transform: uppercase;">
                  Leanur Portfolio Chat
                </h1>
                <p style="font-size: 13px; color: #ff6b00; font-weight: 600; margin: 4px 0 0 0; letter-spacing: 0.05em; text-transform: uppercase;">
                  New Message Received
                </p>
              </div>

              <!-- Highlight Body -->
              <div style="padding: 32px;">
                
                <!-- Visitor and Message Highlight Block -->
                <div style="background-color: #fffaf5; border: 1px solid #ffedd5; border-left: 4px solid #ff6b00; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #ea580c; font-weight: bold;">
                    From ${escapedName}
                  </p>
                  <blockquote style="margin: 0; font-size: 16px; font-style: italic; font-weight: 500; color: #111111; line-height: 1.5;">
                    "${escapedMessage}"
                  </blockquote>
                </div>

                <!-- Details Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 13px;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 500; width: 120px;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111111; font-weight: 600;">
                      <a href="mailto:${escapedEmail}" style="color: #ff6b00; text-decoration: none;">${escapedEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 500;">Project Type:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111111; font-weight: 600;">${escapedProjectType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 500;">Conversation ID:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563; font-family: monospace; font-size: 11px;">${escapedConversationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 500;">Sent Time:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111111;">${escapedTimestamp || new Date().toLocaleString()}</td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 8px;">
                  <a href="${adminLink}" style="display: inline-block; background-color: #111111; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; border: 2px solid #111111; transition: background-color 0.15s ease;">
                    Open Admin Dashboard
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #fafafa; border-top: 1px solid #f3f4f6; padding: 24px 32px; text-align: center;">
                <p style="font-size: 11px; color: #9ca3af; margin: 0; font-weight: 500;">
                  Sent from Leanur.dev portfolio chat
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      // Set replyTo dynamic header if visitor's email is a valid email format
      if (isValidEmail(sanitizedVisitorEmail)) {
        emailOptions.replyTo = sanitizedVisitorEmail;
        emailOptions.reply_to = sanitizedVisitorEmail; // Support both standard formats for maximum safety
      }

      const response = await resend.emails.send(emailOptions);
      if (response.data) {
        console.log("Email status: success, reference ID:", response.data.id);
      } else {
        console.log("Email status: incomplete", response);
      }

      return res.json({ status: "success", data: response });
    } catch (err: any) {
      console.log("[Server] Processing issue:", err.message || err);
      return res.status(500).json({ status: "error", message: err.message });
    }
  });

  // API Route for testing Resend configuration easily
  app.get("/api/test-email", async (req, res) => {
    console.log("Sending email notification... (Test endpoint triggered)");
    let resendKey = process.env.RESEND_API_KEY || "";
    if (!resendKey) {
      const errMsg = "RESEND_API_KEY environment variable is missing.";
      console.log("[Test Email] Verification issue:", errMsg);
      return res
        .status(500)
        .json({ status: "error", error: "missing_api_key", message: errMsg });
    }

    let adminEmail = process.env.ADMIN_EMAIL || "rahmanleanur@gmail.com";
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    let fromField = emailFrom;
    if (!fromField.includes("<")) {
      fromField = `Leanur Portfolio <${fromField}>`;
    }

    try {
      const resend = new Resend(resendKey);
      const emailOptions = {
        from: fromField,
        to: adminEmail,
        subject: "Leanur Portfolio - Resend Test Connection",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; padding: 20px; background-color: #fafafa; color: #111111;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #ddd; border-top: 4px solid #ff6b00; padding: 20px; border-radius: 8px;">
              <h2 style="color: #ff6b00; text-transform: uppercase; font-size: 16px;">Resend Connection Test</h2>
              <p>Congratulations! Your portfolio's Resend configuration is working perfectly.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
              <p style="font-size: 13px;"><strong>Admin Email:</strong> ${adminEmail}</p>
              <p style="font-size: 13px;"><strong>Sent From:</strong> ${fromField}</p>
              <p style="font-size: 13px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </body>
          </html>
        `,
      };

      const response = await resend.emails.send(emailOptions);
      if (response.data) {
        console.log(
          "Test email successfully processed. Reference:",
          response.data.id,
        );
      } else {
        console.log("Test email status details:", response);
      }
      return res.json({
        status: "success",
        message: `Test email successfully sent to ${adminEmail}`,
        id: response.data?.id || null,
      });
    } catch (err: any) {
      console.log("[Test Email] Processing issues:", err.message || err);
      return res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
