# Уведомления о новых заказах

## Рекомендуемый способ: Telegram Bot ⭐

Самый удобный способ для админа — получать уведомления в Telegram.

### Быстрая настройка (5 минут):

**1. Создайте бота** у @BotFather:
- Отправьте `/newbot`
- Придумайте имя: `"В своей тарелке — уведомления"`
- Скопируйте токен: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**2. Узнайте свой chat_id**:
- Напишите боту @userinfobot
- Получите ID: `123456789`

**3. Добавьте в проект** `.env.local`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

**4. Создайте API** (`app/api/notify/route.ts`):
```typescript
export async function POST(req: Request) {
  const { orderId, customer, total } = await req.json();
  
  const message = `
🍽 <b>Новый заказ!</b>

📋 Номер: ${orderId}
👤 Клиент: ${customer}
💰 Сумма: ${total.toLocaleString()} ₽
⏰ Время: ${new Date().toLocaleTimeString('ru-RU')}

<a href="https://vsvoitar.ru/admin/orders">Открыть в админке</a>
  `;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });
}
```

## Пример уведомления в Telegram:

```
🍽 Новый заказ!

📋 Номер: ORD-001
👤 Клиент: Иванов Александр
💰 Сумма: 15,000 ₽
⏰ Время: 14:30

[Открыть в админке]
```

## Альтернативные способы:

| Способ | Скорость | Стоимость | Когда использовать |
|--------|----------|-----------|-------------------|
| **Telegram** | Мгновенно | Бесплатно | Всегда (основной) |
| **Email** | 1-5 мин | Бесплатно | Дублирование + история |
| **WhatsApp** | Мгновенно | Платно (Twilio) | VIP-клиенты |
| **SMS** | Мгновенно | 1-3₽/шт | Срочные/важные заказы |
| **Push (PWA)** | Мгновенно | Бесплатно | Только когда админ на сайте |

## Flow уведомлений:

```
Клиент оформляет заказ
         ↓
    POST /api/orders
         ↓
    ┌─────────────┬─────────────┐
    ↓             ↓             ↓
 Telegram      Email        Push (если вкладка открыта)
    ↓             ↓
  Админ       Админ
получает    получает
уведомление  копию
```

## Статусы и уведомления:

| Когда | Клиент | Админ |
|-------|--------|-------|
| Новый заказ | ✅ Email | ✅ Telegram + Звук |
| Подтверждён | ✅ WhatsApp/SMS | — |
| Готов | ✅ "Можно забирать" | — |
| В пути | ✅ Курьер выехал | — |
| Доставлен | ✅ Спасибо за заказ | — |
| Отменён | ✅ Причина | ✅ Причина |

## Звуковые уведомления в админке:

Добавьте в `AdminDashboardPage`:

```typescript
useEffect(() => {
  // Request notification permission
  if ('Notification' in window) {
    Notification.requestPermission();
  }
  
  // Play sound on new order
  const audio = new Audio('/sounds/new-order.mp3');
  socket.on('new_order', () => {
    audio.play();
    new Notification('Новый заказ!', { body: 'Поступил заказ в систему' });
  });
}, []);
```
