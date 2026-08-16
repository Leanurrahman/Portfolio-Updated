/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface EmailNotificationPayload {
  visitorName: string;
  visitorEmail: string;
  projectType?: string;
  message: string;
  conversationId: string;
  timestamp: string;
  sender?: string;
  messageId?: string;
}

/**
 * Sends an email notification to the administrator.
 * Proxies the request to the /api/chat/email-notification API route.
 * Safe to call client-side; keys like RESEND_API_KEY are kept on the server.
 */
export async function sendEmailNotification(payload: EmailNotificationPayload) {
  try {
    console.log("Sending email notification...", payload);
    const response = await fetch("/api/chat/email-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detailsText = await response.text();
      console.log("Notification route response code:", response.status, detailsText);
    } else {
      const data = await response.json();
      console.log("Notification route response status details:", data.status);
    }
  } catch (err: any) {
    // Graceful fallback to avoid interrupting the chat message flow
    console.log("Notification process warning:", err.message || err);
  }
}
