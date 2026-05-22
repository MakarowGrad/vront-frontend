/**
 * Test notifications API
 * Send test message to configured channels
 */

import { NextResponse } from "next/server";

type Channel = "telegram" | "whatsapp" | "instagram" | "email";

interface TestPayload {
  channel: Channel;
  settings: {
    telegramBotToken?: string;
    telegramChatId?: string;
    whatsappNumber?: string;
    instagramUsername?: string;
    notificationEmail?: string;
  };
}

export async function POST(request: Request) {
  try {
    const { channel, settings }: TestPayload = await request.json();
    
    switch (channel) {
      case "telegram":
        return await testTelegram(settings);
      case "whatsapp":
        return await testWhatsApp(settings);
      case "instagram":
        return await testInstagram(settings);
      case "email":
        return await testEmail(settings);
      default:
        return NextResponse.json(
          { success: false, error: "Unknown channel" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send test notification" },
      { status: 500 }
    );
  }
}

async function testTelegram(settings: TestPayload["settings"]) {
  const { telegramBotToken, telegramChatId } = settings;
  
  if (!telegramBotToken || !telegramChatId) {
    return NextResponse.json(
      { success: false, error: "Missing Telegram credentials" },
      { status: 400 }
    );
  }

  const message = `
🧪 <b>Тестовое уведомление</b>

✅ Настройки Telegram работают корректно!

⏰ Время: ${new Date().toLocaleString("ru-RU")}
📱 Канал: Test
  `.trim();

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return NextResponse.json({ success: true, message: "Telegram test sent" });
}

async function testWhatsApp(settings: TestPayload["settings"]) {
  const { whatsappNumber } = settings;
  
  if (!whatsappNumber) {
    return NextResponse.json(
      { success: false, error: "Missing WhatsApp number" },
      { status: 400 }
    );
  }

  // In real app, integrate with WhatsApp Business API (Twilio, Meta, etc.)
  console.log(`[WhatsApp] Would send test to: ${whatsappNumber}`);
  
  return NextResponse.json({ 
    success: true, 
    message: "WhatsApp test simulated",
    note: "In production, integrate with WhatsApp Business API"
  });
}

async function testInstagram(settings: TestPayload["settings"]) {
  const { instagramUsername } = settings;
  
  if (!instagramUsername) {
    return NextResponse.json(
      { success: false, error: "Missing Instagram username" },
      { status: 400 }
    );
  }

  // In real app, use Facebook Graph API
  console.log(`[Instagram] Would send DM to: @${instagramUsername}`);
  
  return NextResponse.json({ 
    success: true, 
    message: "Instagram test simulated",
    note: "In production, use Facebook Graph API for Instagram DMs"
  });
}

async function testEmail(settings: TestPayload["settings"]) {
  const { notificationEmail } = settings;
  
  if (!notificationEmail) {
    return NextResponse.json(
      { success: false, error: "Missing email address" },
      { status: 400 }
    );
  }

  // In real app, integrate with SMTP (SendGrid, AWS SES, etc.)
  console.log(`[Email] Would send test to: ${notificationEmail}`);
  
  return NextResponse.json({ 
    success: true, 
    message: "Email test simulated",
    note: "In production, integrate with SMTP provider"
  });
}
