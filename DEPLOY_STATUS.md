# Статус деплоя — отчёт от 2026-06-04

## ⚠️ Vercel не деплоит новые коммиты

**Проблема**: Vercel не пересобирает приложение после пушей в `main`.

**Доказательства**:
- JS bundle `page-437cb946af9fca7a.js` не меняется уже >30 минут
- `x-vercel-cache: HIT`, `age` растёт
- Последние коммиты (`af883cf`, `4f87a94`) не попали в production билд

**Причина**: Вероятно, сломана интеграция GitHub ↔ Vercel или авто-деплой отключён.

---

## ✅ Код готов к деплою

### Исправления в `app/lib/api.ts`
Runtime fallback на правильный бэкенд URL при деплое на vsvoeytarelke.ru:

```ts
const PROD_API_URL = 'https://makarowgrad-vront-backend-53ee.twc1.net/api';
const API_BASE = isInvalidApiUrl(process.env.NEXT_PUBLIC_API_URL)
  ? PROD_API_URL
  : process.env.NEXT_PUBLIC_API_URL;
```

### Исправления в `next.config.js`
CSP заголовки используют правильный origin через `new URL()`.

---

## 🛠️ Что делать после пробуждения

### Шаг 1: Форсировать деплой Vercel
1. Открыть https://vercel.com/dashboard
2. Найти проект `vront-frontend` (или `vsvoeytarelke`)
3. Перейти во вкладку **Deployments**
4. Нажать на последний коммит → кнопку **Redeploy** (или **Promote to Production**)
5. Дождаться окончания сборки (~2 мин)

**Если redeploy не помогает** — проверить настройки Git:
- Vercel Dashboard → Project Settings → Git
- Убедиться, что репозиторий `MakarowGrad/vront-frontend` подключён
- Убедиться, что **Production Branch** = `main`
- Убедиться, что **Auto Deploy** включён

**Если Git integration сломана**:
- Disconnect → Reconnect репозиторий
- Или создать новый проект и импортировать тот же репозиторий

### Шаг 2: Проверить сайт
- Открыть `https://vsvoeytarelke.ru/catalog`
- Должно появиться **43 блюда** с картинками

---

## 🔗 Бэкенд статус
Бэкенд на Timeweb работает корректно:
- `https://makarowgrad-vront-backend-53ee.twc1.net/` → 200 OK
- API, картинки, все endpoints отвечают

Подробнее: см. `DEPLOY_STATUS.md` в репозитории `vront-backend`.
