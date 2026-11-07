// uz_website_bot — Netlify Function (Telegram webhook mode)
// Exclusive Web Studio — 14 xizmat · UZ/RU/EN trilingual · language persisted
// in Netlify Blobs (fallback: in-memory). Token: Netlify env BOT_TOKEN.

const API = (token, method) => `https://api.telegram.org/bot${token}/${method}`;

const OWNER_USERNAME = process.env.OWNER_USERNAME || "YOUR_TELEGRAM";
const DEMO_STORE = "https://storelab-demo-x6kixvm5.myshopify.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "storelab2026";
const CHANNEL_URL = "https://t.me/build_website_uz";

const BOT_NAME = "Exclusive Web Studio 🛒";
const BOT_DESCRIPTION = (
  "🛒 Shopify do'konlar · 💻 Saytlar · 🤖 Telegram botlar · 📣 Brending — Toshkent.\n\n" +
  "14 xizmat, 3 tilda (UZ/RU/EN). Premium paket: do'kon + bot + Payme/Click + kanal.\n\n" +
  "🎁 Birinchi 3 mijozga −50%\n\n" +
  "🌐 Demo: storelab-demo-x6kixvm5.myshopify.com (parol: storelab2026)\n" +
  "🚀 Kanal: t.me/build_website_uz"
);
const BOT_SHORT_DESCRIPTION = (
  "🛒 Shopify do'konlar, saytlar, Telegram botlar — Toshkent. 14 xizmat · 3 til · 3 kunda tayyor."
);
const BOT_COMMANDS = [
  { command: "start", description: "Boshlash · Start · Старт" },
  { command: "services", description: "14 xizmat · Services · Услуги" },
  { command: "prices", description: "Narxlar · Prices · Цены" },
  { command: "demo", description: "Demo do'kon + parol" },
  { command: "premium", description: "Premium paket" },
  { command: "help", description: "Yordam · Help · Помощь" },
];

const LANG_ORDER = ["uz", "ru", "en"];
const memoryLangs = new Map();

// ---- Persistence: Netlify Blobs, graceful fallback -------------------------
let blobs = null;
try {
  const { getStore } = await import("@netlify/blobs");
  blobs = getStore("bot_lang");
} catch (e) {
  console.warn("[lang] Netlify Blobs unavailable, using in-memory:", e && e.message);
}

async function getLang(chatId) {
  const key = String(chatId);
  if (blobs) {
    try {
      const v = await blobs.get(key);
      if (v && LANG_ORDER.includes(v)) return v;
    } catch (e) {
      console.warn("[lang get]", e && e.message);
    }
  }
  return memoryLangs.get(key) || "uz";
}

async function setLang(chatId, lang) {
  const key = String(chatId);
  memoryLangs.set(key, lang);
  if (blobs) {
    try {
      await blobs.set(key, lang);
    } catch (e) {
      console.warn("[lang set]", e && e.message);
    }
  }
}

// ---- Trilingual content ----------------------------------------------------

const T = {
  uz: {
    welcome: (
      "👋 Assalomu alaykum!\n\n" +
      "*Exclusive Web Studio* — Toshkent. Biznesingiz uchun raqamli yechimlar:\n" +
      "🛒 Onlayn do'konlar · 💻 Saytlar · 🤖 Telegram botlar · 📣 Brending\n\n" +
      "⭐ *Premium paket:* do'kon + bot + Payme/Click + kanal — 2.5M–4M so'm\n" +
      "🎁 Birinchi 3 mijozga *−50%*\n\n" +
      "✅ Bepul konsultatsiya · ✅ Ish topshirgach to'lov · ✅ 3–7 kun\n\n" +
      "🌐 Tilni almashtirish pastda 👇"
    ),
    services_menu: "🛍 *14 xizmat — 5 yo'nalish*\n\nKerakli yo'nalishni tanlang 👇",
    prices: (
      "💰 *Narxlar* (14 xizmat)\n\n" +
      "🛒 Onlayn savdo\n" +
      "• Shopify do'kon — 800K–1.5M\n" +
      "• Mahsulot yuklash — 300K\n" +
      "• Uzum Market setup — 500K–800K\n\n" +
      "💻 Saytlar\n" +
      "• Landing page — 500K–1M\n" +
      "• Vizitka/korporativ — 1M–2M\n" +
      "• QR menyu — 250K–400K\n\n" +
      "🤖 Telegram va to'lovlar\n" +
      "• Telegram bot — 500K–1.5M\n" +
      "• Payme/Click — 300K–500K\n\n" +
      "📣 Ko'rinish va o'sish\n" +
      "• Instagram sahifa — 200K–300K\n" +
      "• Google Business — 150K–250K\n" +
      "• Basic SEO — 250K–400K\n" +
      "• Logo/brending — 150K–500K\n\n" +
      "🔧 Qo'llab-quvvatlash — 200K/oy\n\n" +
      "⭐ Premium paket — 2.5M–4M\n\n" +
      "🎁 Birinchi 3 mijozga −50%\n\n" +
      "✅ Bepul konsultatsiya · ✅ Topshirgach to'lov\n" +
      "✅ 3–7 kun · ✅ ~1 soat javob"
    ),
    cat_savdo: (
      "🛒 *Onlayn savdo* (3 xizmat)\n\n" +
      "1. *Shopify do'kon tashkil etish* — 800K–1.5M so'm\n" +
      "   tema, 8+ mahsulot, to'lovlar, yetkazib berish, mobil versiya\n" +
      "2. *Mahsulot yuklash* (50 tagacha) — 300K so'm\n" +
      "   rasmlar, tavsiflar, variantlar (o'lcham/rang), inventar\n" +
      "3. *Uzum Market seller setup* — 500K–800K so'm\n" +
      "   kabinet, katalog, mahsulot joylash\n\n" +
      "🎁 Birinchi 3 mijozga −50%"
    ),
    cat_sayt: (
      "💻 *Saytlar* (3 xizmat)\n\n" +
      "1. *Landing page* — 500K–1M so'm\n" +
      "   bir sahifa, mobil versiya, forma, analytics\n" +
      "2. *Vizitka / korporativ sayt* (3–5 sahifa) — 1M–2M so'm\n" +
      "   ko'psahifali sayt, UZ/RU/EN, admin panel\n" +
      "3. *QR menyu* (kafelar uchun) — 250K–400K so'm\n" +
      "   stollarda QR, menyu yangilash oson"
    ),
    cat_bot: (
      "🤖 *Telegram va to'lovlar* (2 xizmat)\n\n" +
      "1. *Telegram bot yaratish* (buyurtma/info) — 500K–1.5M so'm\n" +
      "   menyu, savat, buyurtma xabari, kanal integratsiya\n" +
      "2. *Payme/Click integratsiya* — 300K–500K so'm\n" +
      "   merchant hisobi mijozniki, to'lovlar do'konga tushadi"
    ),
    cat_growth: (
      "📣 *Ko'rinish va o'sish* (4 xizmat)\n\n" +
      "1. *Instagram biznes sahifa* — 200K–300K so'm\n" +
      "   profil, highlight, post shablonlar\n" +
      "2. *Google Business Profile* — 150K–250K so'm\n" +
      "   xaritalarda topilasiz, sharhlar\n" +
      "3. *Basic SEO* — 250K–400K so'm\n" +
      "   sarlavhalar, tavsiflar, tezlik\n" +
      "4. *Logo / brending* — 150K–500K so'm\n" +
      "   logo, ranglar, ijodiy to'plam"
    ),
    cat_support: (
      "🔧 *Qo'llab-quvvatlash* (1 xizmat)\n\n" +
      "*Oylik qo'llab-quvvatlash* — 200K/oy\n" +
      "   yangilanishlar, tuzatishlar, kichik o'zgarishlar\n\n" +
      "🎁 Birinchi mijozga 1 oy bepul"
    ),
    cat_premium: (
      "⭐ *Premium flagman*\n\n" +
      "*To'liq onlayn paket* — 2.5M–4M so'm\n\n" +
      "✅ Shopify do'kon (to'liq sozlangan)\n" +
      "✅ Telegram bot (menyu, buyurtmalar)\n" +
      "✅ Payme/Click integratsiya\n" +
      "✅ Telegram kanal setup\n\n" +
      "🎁 Birinchi 3 mijozga −50% → *1.25M–2M so'm*\n\n" +
      "Biznesingiz 1 haftada to'liq onlayn bo'ladi."
    ),
    lbl: {
      services: "🛍 Xizmatlar (14)", prices: "💰 Narxlar",
      premium: "⭐ Premium paket", demo: "🌐 Demo do'kon",
      channel: "📣 Kanal", order: "💬 Buyurtma / konsultatsiya",
      back: "◀️ Asosiy menyu", back_services: "◀️ Xizmatlar",
      cat_savdo: "🛒 Onlayn savdo (3)", cat_sayt: "💻 Saytlar (3)",
      cat_bot: "🤖 Telegram va to'lovlar (2)", cat_growth: "📣 Ko'rinish va o'sish (4)",
      cat_support: "🔧 Qo'llab-quvvatlash (1)",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      thanks: "Xabaringiz uchun rahmat! Tez orada javob beraman. Tezkor buyurtma: @",
      unknown: "Noma'lum buyruq. /start ni bosing.",
      demo_msg: "🌐 Demo do'kon: {url}\n🔑 Parol: {pw}",
      lang_switched: "✅ Til: O'zbekcha",
      help: "🆘 <b>Yordam</b>\n\n• Tugmalar: Xizmatlar, Narxlar, Premium paket\n• 🌍 Til almashtirish: pastdagi UZ/RU/EN tugmalari\n• 🌐 Demo do'kon: /demo\n• Buyurtma: @",
    },
  },
  ru: {
    welcome: (
      "👋 Здравствуйте!\n\n" +
      "*Exclusive Web Studio* — Ташкент. Цифровые решения для вашего бизнеса:\n" +
      "🛒 Интернет-магазины · 💻 Сайты · 🤖 Telegram-боты · 📣 Брендинг\n\n" +
      "⭐ *Премиум пакет:* магазин + бот + Payme/Click + канал — 2.5–4 млн сум\n" +
      "🎁 Первым 3 клиентам *−50%*\n\n" +
      "✅ Бесплатная консультация · ✅ Оплата после сдачи · ✅ 3–7 дней\n\n" +
      "🌐 Смена языка ниже 👇"
    ),
    services_menu: "🛍 *14 услуг — 5 направлений*\n\nВыберите направление 👇",
    prices: (
      "💰 *Цены* (14 услуг)\n\n" +
      "🛒 Онлайн торговля\n" +
      "• Shopify магазин — 800 тыс.–1.5 млн\n" +
      "• Загрузка товаров — 300 тыс.\n" +
      "• Uzum Market setup — 500–800 тыс.\n\n" +
      "💻 Сайты\n" +
      "• Landing page — 500 тыс.–1 млн\n" +
      "• Визитка/корпоратив — 1–2 млн\n" +
      "• QR-меню — 250–400 тыс.\n\n" +
      "🤖 Telegram и платежи\n" +
      "• Telegram-бот — 500 тыс.–1.5 млн\n" +
      "• Payme/Click — 300–500 тыс.\n\n" +
      "📣 Видимость и рост\n" +
      "• Instagram — 200–300 тыс.\n" +
      "• Google Business — 150–250 тыс.\n" +
      "• Basic SEO — 250–400 тыс.\n" +
      "• Логотип/брендинг — 150–500 тыс.\n\n" +
      "🔧 Поддержка — 200 тыс./мес\n\n" +
      "⭐ Премиум пакет — 2.5–4 млн\n\n" +
      "🎁 Первым 3 клиентам −50%\n\n" +
      "✅ Бесплатная консультация · ✅ Оплата после сдачи\n" +
      "✅ 3–7 дней · ✅ Ответ ~1 час"
    ),
    cat_savdo: (
      "🛒 *Онлайн торговля* (3 услуги)\n\n" +
      "1. *Создание Shopify магазина* — 800 тыс.–1.5 млн сум\n" +
      "   тема, 8+ товаров, оплата, доставка, мобильная версия\n" +
      "2. *Загрузка товаров* (до 50) — 300 тыс. сум\n" +
      "   фото, описания, варианты (размер/цвет), остатки\n" +
      "3. *Uzum Market seller setup* — 500–800 тыс. сум\n" +
      "   кабинет, каталог, размещение товаров\n\n" +
      "🎁 Первым 3 клиентам −50%"
    ),
    cat_sayt: (
      "💻 *Сайты* (3 услуги)\n\n" +
      "1. *Landing page* — 500 тыс.–1 млн сум\n" +
      "   одна страница, мобильная версия, форма, аналитика\n" +
      "2. *Визитка / корпоративный сайт* (3–5 страниц) — 1–2 млн сум\n" +
      "   многостраничный сайт, UZ/RU/EN, админ-панель\n" +
      "3. *QR-меню* (для кафе) — 250–400 тыс. сум\n" +
      "   QR на столиках, лёгкое обновление меню"
    ),
    cat_bot: (
      "🤖 *Telegram и платежи* (2 услуги)\n\n" +
      "1. *Создание Telegram-бота* (заказ/инфо) — 500 тыс.–1.5 млн сум\n" +
      "   меню, корзина, уведомления о заказах, интеграция канала\n" +
      "2. *Интеграция Payme/Click* — 300–500 тыс. сум\n" +
      "   merchant-аккаунт ваш, платежи идут в магазин"
    ),
    cat_growth: (
      "📣 *Видимость и рост* (4 услуги)\n\n" +
      "1. *Instagram бизнес-страница* — 200–300 тыс. сум\n" +
      "   профиль, хайлайты, шаблоны постов\n" +
      "2. *Google Business Profile* — 150–250 тыс. сум\n" +
      "   вас находят на картах, отзывы\n" +
      "3. *Basic SEO* — 250–400 тыс. сум\n" +
      "   заголовки, описания, скорость\n" +
      "4. *Логотип / брендинг* — 150–500 тыс. сум\n" +
      "   логотип, цвета, фирменный стиль"
    ),
    cat_support: (
      "🔧 *Поддержка* (1 услуга)\n\n" +
      "*Ежемесячная поддержка* — 200 тыс. сум/мес\n" +
      "   обновления, правки, небольшие изменения\n\n" +
      "🎁 Первому клиенту 1 месяц бесплатно"
    ),
    cat_premium: (
      "⭐ *Премиум флагман*\n\n" +
      "*Полный онлайн пакет* — 2.5–4 млн сум\n\n" +
      "✅ Shopify магазин (полностью настроен)\n" +
      "✅ Telegram-бот (меню, заказы)\n" +
      "✅ Интеграция Payme/Click\n" +
      "✅ Настройка Telegram-канала\n\n" +
      "🎁 Первым 3 клиентам −50% → *1.25–2 млн сум*\n\n" +
      "Ваш бизнес станет полностью онлайн за 1 неделю."
    ),
    lbl: {
      services: "🛍 Услуги (14)", prices: "💰 Цены",
      premium: "⭐ Премиум пакет", demo: "🌐 Демо магазин",
      channel: "📣 Канал", order: "💬 Заказ / консультация",
      back: "◀️ Главное меню", back_services: "◀️ Услуги",
      cat_savdo: "🛒 Онлайн торговля (3)", cat_sayt: "💻 Сайты (3)",
      cat_bot: "🤖 Telegram и платежи (2)", cat_growth: "📣 Видимость и рост (4)",
      cat_support: "🔧 Поддержка (1)",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      thanks: "Спасибо за сообщение! Скоро ответим. Быстрый заказ: @",
      unknown: "Неизвестная команда. Нажмите /start.",
      demo_msg: "🌐 Демо магазин: {url}\n🔑 Пароль: {pw}",
      lang_switched: "✅ Язык: Русский",
      help: "🆘 <b>Помощь</b>\n\n• Кнопки: Услуги, Цены, Премиум пакет\n• 🌍 Смена языка: UZ/RU/EN внизу\n• 🌐 Демо: /demo\n• Заказ: @",
    },
  },
  en: {
    welcome: (
      "👋 Hello!\n\n" +
      "*Exclusive Web Studio* — Tashkent. Digital solutions for your business:\n" +
      "🛒 Online stores · 💻 Websites · 🤖 Telegram bots · 📣 Branding\n\n" +
      "⭐ *Premium package:* store + bot + Payme/Click + channel — 2.5–4M UZS\n" +
      "🎁 First 3 clients get *−50%*\n\n" +
      "✅ Free consultation · ✅ Pay on delivery · ✅ 3–7 days\n\n" +
      "🌐 Language switch below 👇"
    ),
    services_menu: "🛍 *14 services — 5 categories*\n\nPick the direction you need 👇",
    prices: (
      "💰 *Prices* (14 services)\n\n" +
      "🛒 Online commerce\n" +
      "• Shopify store — 800K–1.5M\n" +
      "• Product upload — 300K\n" +
      "• Uzum Market setup — 500–800K\n\n" +
      "💻 Websites\n" +
      "• Landing page — 500K–1M\n" +
      "• Business/corporate — 1–2M\n" +
      "• QR menu — 250–400K\n\n" +
      "🤖 Telegram & payments\n" +
      "• Telegram bot — 500K–1.5M\n" +
      "• Payme/Click — 300–500K\n\n" +
      "📣 Visibility & growth\n" +
      "• Instagram page — 200–300K\n" +
      "• Google Business — 150–250K\n" +
      "• Basic SEO — 250–400K\n" +
      "• Logo/branding — 150–500K\n\n" +
      "🔧 Support — 200K/mo\n\n" +
      "⭐ Premium package — 2.5–4M\n\n" +
      "🎁 First 3 clients −50%\n\n" +
      "✅ Free consultation · ✅ Pay on delivery\n" +
      "✅ 3–7 days · ✅ ~1 hour response"
    ),
    cat_savdo: (
      "🛒 *Online commerce* (3 services)\n\n" +
      "1. *Shopify store setup* — 800K–1.5M UZS\n" +
      "   theme, 8+ products, payments, shipping, mobile-ready\n" +
      "2. *Product upload* (up to 50) — 300K UZS\n" +
      "   photos, descriptions, variants (size/color), inventory\n" +
      "3. *Uzum Market seller setup* — 500–800K UZS\n" +
      "   seller cabinet, catalog, product listing\n\n" +
      "🎁 First 3 clients −50%"
    ),
    cat_sayt: (
      "💻 *Websites* (3 services)\n\n" +
      "1. *Landing page* — 500K–1M UZS\n" +
      "   single page, mobile-ready, form, analytics\n" +
      "2. *Business card / corporate site* (3–5 pages) — 1–2M UZS\n" +
      "   multi-page, UZ/RU/EN, admin panel\n" +
      "3. *QR menu* (for cafés) — 250–400K UZS\n" +
      "   QR on tables, easy menu updates"
    ),
    cat_bot: (
      "🤖 *Telegram & payments* (2 services)\n\n" +
      "1. *Telegram bot creation* (orders/info) — 500K–1.5M UZS\n" +
      "   menu, cart, order notifications, channel integration\n" +
      "2. *Payme/Click integration* — 300–500K UZS\n" +
      "   merchant account is yours, payments go to your store"
    ),
    cat_growth: (
      "📣 *Visibility & growth* (4 services)\n\n" +
      "1. *Instagram business page* — 200–300K UZS\n" +
      "   profile, highlights, post templates\n" +
      "2. *Google Business Profile* — 150–250K UZS\n" +
      "   get found on maps, reviews\n" +
      "3. *Basic SEO* — 250–400K UZS\n" +
      "   headings, descriptions, speed\n" +
      "4. *Logo / branding* — 150–500K UZS\n" +
      "   logo, colors, brand kit"
    ),
    cat_support: (
      "🔧 *Support* (1 service)\n\n" +
      "*Monthly support* — 200K UZS/mo\n" +
      "   updates, fixes, small changes\n\n" +
      "🎁 First client: 1 month free"
    ),
    cat_premium: (
      "⭐ *Premium flagship*\n\n" +
      "*Full online package* — 2.5–4M UZS\n\n" +
      "✅ Shopify store (fully configured)\n" +
      "✅ Telegram bot (menu, orders)\n" +
      "✅ Payme/Click integration\n" +
      "✅ Telegram channel setup\n\n" +
      "🎁 First 3 clients −50% → *1.25–2M UZS*\n\n" +
      "Your business goes fully online in 1 week."
    ),
    lbl: {
      services: "🛍 Services (14)", prices: "💰 Prices",
      premium: "⭐ Premium package", demo: "🌐 Demo store",
      channel: "📣 Channel", order: "💬 Order / consultation",
      back: "◀️ Main menu", back_services: "◀️ Services",
      cat_savdo: "🛒 Online commerce (3)", cat_sayt: "💻 Websites (3)",
      cat_bot: "🤖 Telegram & payments (2)", cat_growth: "📣 Visibility & growth (4)",
      cat_support: "🔧 Support (1)",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      thanks: "Thanks for your message! We'll reply shortly. Fast order: @",
      unknown: "Unknown command. Press /start.",
      demo_msg: "🌐 Demo store: {url}\n🔑 Password: {pw}",
      lang_switched: "✅ Language: English",
      help: "🆘 <b>Help</b>\n\n• Buttons: Services, Prices, Premium package\n• 🌍 Language switch: UZ/RU/EN at the bottom\n• 🌐 Demo store: /demo\n• Order: @",
    },
  },
};

function mainMenu(lang) {
  const L = T[lang].lbl;
  return { inline_keyboard: [
    [{ text: L.services, callback_data: "services_menu" }, { text: L.prices, callback_data: "prices" }],
    [{ text: L.premium, callback_data: "cat_premium" }],
    [{ text: L.demo, url: DEMO_STORE }, { text: L.channel, url: CHANNEL_URL }],
    [{ text: L.order, url: `https://t.me/${OWNER_USERNAME}` }],
    [
      { text: L.lang_row[0], callback_data: "set_lang_uz" },
      { text: L.lang_row[1], callback_data: "set_lang_ru" },
      { text: L.lang_row[2], callback_data: "set_lang_en" },
    ],
  ] };
}

function servicesMenuKb(lang) {
  const L = T[lang].lbl;
  return { inline_keyboard: [
    [{ text: L.cat_savdo, callback_data: "cat_savdo" }, { text: L.cat_sayt, callback_data: "cat_sayt" }],
    [{ text: L.cat_bot, callback_data: "cat_bot" }],
    [{ text: L.cat_growth, callback_data: "cat_growth" }],
    [{ text: L.cat_support, callback_data: "cat_support" }],
    [{ text: L.premium, callback_data: "cat_premium" }],
    [{ text: L.back, callback_data: "back_main" }],
  ] };
}

function catKb(lang) {
  const L = T[lang].lbl;
  return { inline_keyboard: [
    [{ text: L.back_services, callback_data: "services_menu" }],
    [{ text: L.back, callback_data: "back_main" }],
  ] };
}

function demoMsg(lang) {
  return T[lang].lbl.demo_msg.replace("{url}", DEMO_STORE).replace("{pw}", DEMO_PASSWORD);
}

const CAT_MAP = {
  cat_savdo: "cat_savdo", cat_sayt: "cat_sayt", cat_bot: "cat_bot",
  cat_growth: "cat_growth", cat_support: "cat_support", cat_premium: "cat_premium",
};

async function api(token, method, body) {
  const res = await fetch(API(token, method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) console.error(`[API ${method}]`, res.status, (await res.text()).slice(0, 200));
  return res.ok;
}

function mdToHtml(text) {
  // *bold* -> <b>bold</b>; HTML parse_mode is safer with underscores in usernames
  return text.replace(/\*([^*\n]+)\*/g, "<b>$1</b>");
}

async function send(token, chatId, text, menu) {
  const payload = { chat_id: chatId, text: mdToHtml(text), parse_mode: "HTML" };
  if (menu) payload.reply_markup = menu;
  return api(token, "sendMessage", payload);
}

async function handleUpdate(token, update) {
  const msg = update.message;
  const cb = update.callback_query;
  if (msg) {
    const chat = msg.chat.id;
    const lang = await getLang(chat);
    const t = T[lang].lbl;
    const text = (msg.text || "").trim().toLowerCase();
    if (text.startsWith("/start") || text === "/menu") {
      await send(token, chat, T[lang].welcome, mainMenu(lang));
    } else if (text === "/xizmatlar" || text === "/services" || text === "/услуги") {
      await send(token, chat, T[lang].services_menu, servicesMenuKb(lang));
    } else if (text === "/narxlar" || text === "/prices" || text === "/цены") {
      await send(token, chat, T[lang].prices, mainMenu(lang));
    } else if (text === "/demo") {
      await send(token, chat, demoMsg(lang), mainMenu(lang));
    } else if (text === "/premium") {
      await send(token, chat, T[lang].cat_premium, mainMenu(lang));
    } else if (text === "/help" || text === "/yordam" || text === "/помощь") {
      await send(token, chat, t.help + OWNER_USERNAME, mainMenu(lang));
    } else if (text.startsWith("/")) {
      await send(token, chat, t.unknown, mainMenu(lang));
    } else {
      await send(token, chat, t.thanks + OWNER_USERNAME, mainMenu(lang));
    }
  } else if (cb) {
    const chat = cb.message.chat.id;
    const lang = await getLang(chat);
    const data = cb.data;
    if (data === "services_menu") {
      await send(token, chat, T[lang].services_menu, servicesMenuKb(lang));
    } else if (data === "prices") {
      await send(token, chat, T[lang].prices, mainMenu(lang));
    } else if (data === "back_main") {
      await send(token, chat, T[lang].welcome, mainMenu(lang));
    } else if (CAT_MAP[data]) {
      const menu = data === "cat_premium" ? mainMenu(lang) : catKb(lang);
      await send(token, chat, T[lang][CAT_MAP[data]], menu);
    } else if (data.startsWith("set_lang_")) {
      const newLang = data.replace("set_lang_", "");
      if (LANG_ORDER.includes(newLang)) {
        await setLang(chat, newLang);
        await send(token, chat, T[newLang].lbl.lang_switched);
        await send(token, chat, T[newLang].welcome, mainMenu(newLang));
      }
    }
    await api(token, "answerCallbackQuery", { callback_query_id: cb.id });
  }
}

let profileDone = false;
function ensureProfile(token) {
  if (profileDone) return;
  profileDone = true;
  (async () => {
    try {
      await api(token, "setMyName", { name: BOT_NAME });
      await api(token, "setMyDescription", { description: BOT_DESCRIPTION });
      await api(token, "setMyShortDescription", { short_description: BOT_SHORT_DESCRIPTION });
      await api(token, "setMyCommands", { commands: BOT_COMMANDS });
      console.log("[profile] name, description, commands set");
    } catch (e) {
      console.warn("[profile]", e && e.message);
      profileDone = false;
    }
  })();
}

export default async (req) => {
  const token = process.env.BOT_TOKEN;
  if (!token) return new Response("BOT_TOKEN env var not set", { status: 500 });
  ensureProfile(token); // fire-and-forget, once per isolate

  if (req.method === "GET") return new Response("uz_website_bot is alive (UZ/RU/EN)", { status: 200 });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  try {
    const update = await req.json();
    await handleUpdate(token, update);
  } catch (e) {
    console.error("[handler]", e && e.message);
  }
  return new Response("ok", { status: 200 });
};

export const config = { path: "/.netlify/functions/bot" };
