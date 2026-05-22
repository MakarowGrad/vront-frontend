/**
 * API Route for sending notifications
 * Supports: Telegram, Email
 */

import { NextResponse } from "next/server";

interface NotificationPayload {
  type: "new_order" | "status_change" | "cancelled";
  orderId: string;
  customer: string;
  phone?: string;
  total: number;
  status?: string;
  items?: { name: string; quantity: number }[];
}

export async function POST(request: Request) {
  try {
    const payload: NotificationPayload = await request.json();
    
    // Send Telegram notification
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
      await sendTelegramNotification(payload);
    }
    
    // Here you can add email notification logic
    // await sendEmailNotification(payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

async function sendTelegramNotification(payload: NotificationPayload) {
  const { type, orderId, customer, phone, total, status, items } = payload;
  
  let message = "";
  
  switch (type) {
    case "new_order":
      message = `
🍽 <b>НОВЫЙ ЗАКАЗ!</b>

📋 Номер: <code>${orderId}</code>
👤 Клиент: ${customer}
📞 Телефон: ${phone || "—"}
💰 Сумма: <b>${total.toLocaleString()} ₽</b>
⏰ Время: ${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}

${items ? `📦 Состав:\n${items.map(i => `• ${i.name} × ${i.quantity}`).join("\n")}` : ""}

<a href="https://vsvoitar.ru/admin/orders">Открыть в админке →</a>
      `.trim();
      break;
      
    case "status_change":
      message = `
🔄 <b>СТАТУС ИЗМЕНЁН</b>

📋 Заказ: ${orderId}
📊 Новый статус: <b>${status}</b>
👤 Клиент: ${customer}
      `.trim();
      break;
      
    case "cancelled":
      message = `
❌ <b>ЗАКАЗ ОТМЕНЁН</b>

📋 Номер: ${orderId}
👤 Клиент: ${customer}
💰 Сумма: ${total.toLocaleString()} ₽
      `.trim();
      break;
  }

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`);
  }
  
  return response.json();
}

// Example usage from client:
// await fetch('/api/notify', {
//   method: 'POST',
//   body: JSON.stringify({
//     type: 'new_order',
//     orderId: 'ORD-001',
//     customer: 'Иванов А.',
//     phone: '+79991234567',
//     total: 15000,
//     items: [{ name: 'Тартар', quantity: 2 }]
//   })
// });
