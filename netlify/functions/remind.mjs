// Scheduled reminder function — runs automatically on Netlify's cron.
// Weekly: Mondays 06:00 UTC (11:00 Tashkent). To switch to daily:
// change the schedule below to "0 6 * * *".
// Sends a promo reminder (in the user's language) to everyone who ever
// messaged the bot, skipping opt-outs (/stop) and the owner.

const API = (token, method) => `https://api.telegram.org/bot${token}/${method}`;

const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID || "7568804222";
const DEMO_STORE = "https://storelab-demo-x6kixvm5.myshopify.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "storelab2026";
const OWNER_USERNAME = process.env.OWNER_USERNAME || "YOUR_TELEGRAM";

const REMINDERS = {
  uz: (
    "⏳ <b>Eslatma!</b>\n\n" +
    "🎁 Birinchi 3 mijozga <b>−50%</b> — joylar to'lib bormoqda.\n" +
    "🛍 14 xizmat: Shopify do'kon, saytlar, botlar, logo, SEO...\n\n" +
    `🌐 Demo: ${DEMO_STORE} (parol: ${DEMO_PASSWORD})\n` +
    `💬 Joy band qilish: @${OWNER_USERNAME}\n\n` +
    "❌ Eslatmalarni o'chirish: /stop"
  ),
  ru: (
    "⏳ <b>Напоминание!</b>\n\n" +
    "🎁 Первым 3 клиентам <b>−50%</b> — места заполняются.\n" +
    "🛍 14 услуг: Shopify магазины, сайты, боты, логотипы, SEO...\n\n" +
    `🌐 Демо: ${DEMO_STORE} (пароль: ${DEMO_PASSWORD})\n` +
    `💬 Забронировать: @${OWNER_USERNAME}\n\n` +
    "❌ Отключить напоминания: /stop"
  ),
  en: (
    "⏳ <b>Don't miss out!</b>\n\n" +
    "🎁 First 3 clients get <b>−50%</b> — spots are filling up.\n" +
    "🛍 14 services: Shopify stores, websites, bots, logos, SEO...\n\n" +
    `🌐 Demo: ${DEMO_STORE} (password: ${DEMO_PASSWORD})\n` +
    `💬 Book a spot: @${OWNER_USERNAME}\n\n` +
    "❌ Turn off reminders: /stop"
  ),
};

export const config = { schedule: "0 6 * * 1" };

export default async () => {
  const token = process.env.BOT_TOKEN;
  if (!token) return Response.json({ ok: false, reason: "BOT_TOKEN not set" });

  let users = [];
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("bot_users");
    const res = store.list();
    for await (const entry of res) {
      try { users.push(JSON.parse(entry.value)); } catch (e) { /* skip bad row */ }
    }
  } catch (e) {
    console.error("[remind] registry read failed:", e && e.message);
    return Response.json({ ok: false, reason: "registry read failed" });
  }

  let sent = 0, skipped = 0;
  for (const u of users) {
    if (u.stop) { skipped++; continue; }
    if (String(u.id) === OWNER_CHAT_ID) { skipped++; continue; }
    const lang = ["uz", "ru", "en"].includes(u.lang) ? u.lang : "uz";
    try {
      await fetch(API(token, "sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: u.id, text: REMINDERS[lang], parse_mode: "HTML" }),
      });
      sent++;
    } catch (e) {
      console.error("[remind]", u.id, e && e.message);
    }
  }

  console.log(`[remind] done: sent=${sent} skipped=${skipped} total=${users.length}`);
  return Response.json({ ok: true, sent, skipped, total: users.length });
};
