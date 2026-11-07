// uz_website_bot — Netlify Function (Telegram webhook mode)
// Deployment: see DEPLOY_NETLIFY.md. Token lives in Netlify env var BOT_TOKEN.

const API = (token, method) => `https://api.telegram.org/bot${token}/${method}`;

// ⚠️ Edit this once on GitHub (or set Netlify env var OWNER_USERNAME):
const OWNER_USERNAME = process.env.OWNER_USERNAME || "YOUR_TELEGRAM";
const DEMO_STORE = "https://3clu51ve-security-lab.myshopify.com";

const MAIN_MENU = {
  inline_keyboard: [
    [{ text: "🛒 Xizmatlar", callback_data: "svc" }, { text: "💰 Narxlar", callback_data: "prices" }],
    [{ text: "🌐 Jonli demo do'kon", url: DEMO_STORE }],
    [{ text: "💬 Bepul konsultatsiya", url: `https://t.me/${OWNER_USERNAME}` }],
  ],
};

const SERVICES =
  "🛒 *Xizmatlar*\n\n" +
  "1. *Shopify do'kon tashkil etish* — dizayn, tema, to'lovlar, yetkazib berish. Do'kon to'liq ishlaydigan holatda topshiriladi.\n" +
  "2. *Mahsulot yuklash* — rasmlar, tavsiflar, narxlar, variantlar.\n" +
  "3. *Landing page* — biznesingiz uchun zamonaviy bir sahifalik sayt.\n" +
  "4. *Doimiy qo'llab-quvvatlash* — yangilanishlar va tuzatishlar.\n\n" +
  "Jonli namoyish 👇";

const PRICES =
  "💰 *Narxlar* (birinchi 3 mijozga 50% chegirma)\n\n" +
  "• Shopify do'kon: *800 000 – 1 500 000 so'm*\n" +
  "• Mahsulot yuklash (50 tagacha): *300 000 so'm*\n" +
  "• Landing page: *500 000 – 1 000 000 so'm*\n" +
  "• Oylik qo'llab-quvvatlash: *200 000 so'm/oy*\n\n" +
  "✅ Konsultatsiya bepul\n✅ To'lov: ish topshirilgach\n✅ Aniq muddat: 3–7 kun";

const WELCOME =
  "👋 Assalomu alaykum!\n\n" +
  "Men *uz_website_bot* — biznesingiz uchun professional onlayn do'kon va saytlar yasayman.\n\n" +
  "Pastdagi tugmalardan foydalaning 👇";

async function api(token, method, body) {
  const res = await fetch(API(token, method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) console.error(`[API ${method}]`, res.status, (await res.text()).slice(0, 200));
  return res.ok;
}

async function send(token, chatId, text, menu) {
  const payload = { chat_id: chatId, text, parse_mode: "Markdown" };
  if (menu) payload.reply_markup = menu;
  return api(token, "sendMessage", payload);
}

async function handleUpdate(token, update) {
  const msg = update.message;
  const cb = update.callback_query;
  if (msg) {
    const chat = msg.chat.id;
    const text = (msg.text || "").trim().toLowerCase();
    if (text.startsWith("/start") || text === "/menu") {
      await send(token, chat, WELCOME, MAIN_MENU);
    } else if (text === "/xizmatlar" || text === "/services") {
      await send(token, chat, SERVICES, MAIN_MENU);
    } else if (text === "/narxlar" || text === "/prices") {
      await send(token, chat, PRICES, MAIN_MENU);
    } else if (text === "/demo") {
      await send(token, chat, `🌐 Jonli demo do'kon: ${DEMO_STORE}`, MAIN_MENU);
    } else if (text.startsWith("/")) {
      await send(token, chat, "Noma'lum buyruq. /start ni bosing.", MAIN_MENU);
    } else {
      await send(token, chat, "Xabaringiz uchun rahmat! Tez orada javob beraman. Tezkor aloqa uchun: @" + OWNER_USERNAME, MAIN_MENU);
    }
  } else if (cb) {
    const chat = cb.message.chat.id;
    if (cb.data === "svc") await send(token, chat, SERVICES, MAIN_MENU);
    else if (cb.data === "prices") await send(token, chat, PRICES, MAIN_MENU);
    await api(token, "answerCallbackQuery", { callback_query_id: cb.id });
  }
}

export default async (req) => {
  // GET = health check (UptimeRobot not needed — Netlify never sleeps)
  if (req.method === "GET") return new Response("uz_website_bot is alive", { status: 200 });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  try {
    const token = process.env.BOT_TOKEN;
    if (!token) return new Response("BOT_TOKEN env var not set", { status: 500 });
    const update = await req.json();
    await handleUpdate(token, update);
  } catch (e) {
    console.error("[handler]", e && e.message);
  }
  return new Response("ok", { status: 200 });
};

export const config = { path: "/.netlify/functions/bot" };
