// uz_website_bot — Netlify Function (Telegram webhook mode)
// Exclusive Web Studio — search-first UX: mijoz xizmat nomini yozadi,
// bot mos keladigan xizmatni kartada ko'rsatadi. UZ/RU/EN, til Netlify
// Blobs'da saqlanadi (fallback: in-memory). Token: env BOT_TOKEN.

const API = (token, method) => `https://api.telegram.org/bot${token}/${method}`;

const OWNER_USERNAME = process.env.OWNER_USERNAME || "YOUR_TELEGRAM";
const DEMO_STORE = "https://storelab-demo-x6kixvm5.myshopify.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "storelab2026";
const CHANNEL_URL = "https://t.me/build_website_uz";

const LANG_ORDER = ["uz", "ru", "en"];
const memoryLangs = new Map();

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
    } catch (e) { /* ignore */ }
  }
  return memoryLangs.get(key) || "uz";
}

async function setLang(chatId, lang) {
  const key = String(chatId);
  memoryLangs.set(key, lang);
  if (blobs) {
    try { await blobs.set(key, lang); } catch (e) { /* ignore */ }
  }
}

// ---- UI labels per language -------------------------------------------------

const T = {
  uz: {
    welcome: (
      "👋 Assalomu alaykum!\n\n" +
      "<b>Exclusive Web Studio</b> — Toshkent. Biznesingiz uchun raqamli yechimlar.\n\n" +
      "💡 <b>Xizmat kerakmi?</b> Shunchaki yozing: «do'kon», «sayt», «logo», «bot» — " +
      "bot sizga mos xizmatni darhol ko'rsatadi.\n\n" +
      "⭐ Premium paket: do'kon + bot + to'lovlar — 2.5M–4M so'm\n" +
      "🎁 Birinchi 3 mijozga −50%\n\n" +
      "Yoki pastdagi tugmalardan foydalaning 👇"
    ),
    services_menu: "🛍 <b>14 xizmat — 5 yo'nalish</b>\n\nKeraklisini tanlang 👇\n\n💡 Yoki shunchaki yozing: «logo», «bot», «do'kon»...",
    prices: (
      "💰 <b>Narxlar</b> (14 xizmat)\n\n" +
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
      "✅ Bepul konsultatsiya · ✅ Topshirgach to'lov · ✅ 3–7 kun"
    ),
    lbl: {
      services: "🛍 Xizmatlar (14)", prices: "💰 Narxlar",
      premium: "⭐ Premium paket", demo: "🌐 Demo do'kon",
      channel: "📣 Kanal", order: "💬 Buyurtma / konsultatsiya",
      order_btn: "📞 Buyurtma qilish",
      back: "🏠 Asosiy menyu", back_services: "◀️ Xizmatlar",
      cat_savdo: "🛒 Onlayn savdo", cat_sayt: "💻 Saytlar",
      cat_bot: "🤖 Telegram va to'lovlar", cat_growth: "📣 Ko'rinish va o'sish",
      cat_support: "🔧 Qo'llab-quvvatlash", cat_premium: "⭐ Premium paket",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      price_label: "Narxi", duration_label: "Muddat",
      included_label: "Nima kiradi", promo: "🎁 Birinchi 3 mijozga −50%",
      cur: "so'm",
      found: "🔍 Topilgan xizmatlar — tanlang:",
      not_found: "😕 Bu so'z bo'yicha xizmat topilmadi.\n\nSinab ko'ring: «do'kon», «sayt», «logo», «bot», «menyu»\n\nYoki pastdagi tugmalardan tanlang:",
      thanks: "Xabaringiz uchun rahmat! Tez orada javob beraman. Tezkor buyurtma: @",
      unknown: "Noma'lum buyruq. /start ni bosing.",
      demo_msg: "🌐 Demo do'kon: {url}\n🔑 Parol: {pw}",
      lang_switched: "✅ Til: O'zbekcha",
      help: "🆘 <b>Yordam</b>\n\n• Qidiruv: xizmat nomini yozing (masalan «logo»)\n• Tugmalar: Xizmatlar, Narxlar, Premium paket\n• 🌍 Til: pastdagi UZ/RU/EN tugmalari\n• 🌐 Demo do'kon: /demo\n• Buyurtma: @",
      cat_pick: "Tanlang 👇",
      price_note: "boshlab — aniq narx bepul konsultatsiyada kelishiladi",
    },
  },
  ru: {
    welcome: (
      "👋 Здравствуйте!\n\n" +
      "<b>Exclusive Web Studio</b> — Ташкент. Цифровые решения для вашего бизнеса.\n\n" +
      "💡 <b>Нужна услуга?</b> Просто напишите: «магазин», «сайт», «логотип», «бот» — " +
      "бот сразу покажет подходящую услугу.\n\n" +
      "⭐ Премиум пакет: магазин + бот + оплаты — 2.5–4 млн сум\n" +
      "🎁 Первым 3 клиентам −50%\n\n" +
      "Или используйте кнопки ниже 👇"
    ),
    services_menu: "🛍 <b>14 услуг — 5 направлений</b>\n\nВыберите нужную 👇\n\n💡 Или просто напишите: «логотип», «бот», «магазин»...",
    prices: (
      "💰 <b>Цены</b> (14 услуг)\n\n" +
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
      "✅ Бесплатная консультация · ✅ Оплата после сдачи · ✅ 3–7 дней"
    ),
    lbl: {
      services: "🛍 Услуги (14)", prices: "💰 Цены",
      premium: "⭐ Премиум пакет", demo: "🌐 Демо магазин",
      channel: "📣 Канал", order: "💬 Заказ / консультация",
      order_btn: "📞 Заказать",
      back: "🏠 Главное меню", back_services: "◀️ Услуги",
      cat_savdo: "🛒 Онлайн торговля", cat_sayt: "💻 Сайты",
      cat_bot: "🤖 Telegram и платежи", cat_growth: "📣 Видимость и рост",
      cat_support: "🔧 Поддержка", cat_premium: "⭐ Премиум пакет",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      price_label: "Цена", duration_label: "Срок",
      included_label: "Что входит", promo: "🎁 Первым 3 клиентам −50%",
      cur: "сум",
      found: "🔍 Найденные услуги — выберите:",
      not_found: "😕 По этому слову услуга не найдена.\n\nПопробуйте: «магазин», «сайт», «логотип», «бот», «меню»\n\nИли выберите кнопками ниже:",
      thanks: "Спасибо за сообщение! Скоро ответим. Быстрый заказ: @",
      unknown: "Неизвестная команда. Нажмите /start.",
      demo_msg: "🌐 Демо магазин: {url}\n🔑 Пароль: {pw}",
      lang_switched: "✅ Язык: Русский",
      help: "🆘 <b>Помощь</b>\n\n• Поиск: напишите название услуги (например «логотип»)\n• Кнопки: Услуги, Цены, Премиум пакет\n• 🌍 Язык: UZ/RU/EN внизу\n• 🌐 Демо: /demo\n• Заказ: @",
      cat_pick: "Выберите 👇",
      price_note: "начиная с — точную цену согласуем на бесплатной консультации",
    },
  },
  en: {
    welcome: (
      "👋 Hello!\n\n" +
      "<b>Exclusive Web Studio</b> — Tashkent. Digital solutions for your business.\n\n" +
      "💡 <b>Need a service?</b> Just type it: «store», «website», «logo», «bot» — " +
      "the bot instantly shows the matching service.\n\n" +
      "⭐ Premium package: store + bot + payments — 2.5–4M UZS\n" +
      "🎁 First 3 clients get −50%\n\n" +
      "Or use the buttons below 👇"
    ),
    services_menu: "🛍 <b>14 services — 5 categories</b>\n\nPick the one you need 👇\n\n💡 Or just type: «logo», «bot», «store»...",
    prices: (
      "💰 <b>Prices</b> (14 services)\n\n" +
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
      "✅ Free consultation · ✅ Pay on delivery · ✅ 3–7 days"
    ),
    lbl: {
      services: "🛍 Services (14)", prices: "💰 Prices",
      premium: "⭐ Premium package", demo: "🌐 Demo store",
      channel: "📣 Channel", order: "💬 Order / consultation",
      order_btn: "📞 Order now",
      back: "🏠 Main menu", back_services: "◀️ Services",
      cat_savdo: "🛒 Online commerce", cat_sayt: "💻 Websites",
      cat_bot: "🤖 Telegram & payments", cat_growth: "📣 Visibility & growth",
      cat_support: "🔧 Support", cat_premium: "⭐ Premium package",
      lang_row: ["🇺🇿 UZ", "🇷🇺 RU", "🇬🇧 EN"],
      price_label: "Price", duration_label: "Timeframe",
      included_label: "What's included", promo: "🎁 First 3 clients −50%",
      cur: "UZS",
      found: "🔍 Matching services — pick one:",
      not_found: "😕 No service matched that word.\n\nTry: «store», «website», «logo», «bot», «menu»\n\nOr pick from the buttons below:",
      thanks: "Thanks for your message! We'll reply shortly. Fast order: @",
      unknown: "Unknown command. Press /start.",
      demo_msg: "🌐 Demo store: {url}\n🔑 Password: {pw}",
      lang_switched: "✅ Language: English",
      help: "🆘 <b>Help</b>\n\n• Search: type a service name (e.g. «logo»)\n• Buttons: Services, Prices, Premium package\n• 🌍 Language: UZ/RU/EN at the bottom\n• 🌐 Demo store: /demo\n• Order: @",
      cat_pick: "Pick one 👇",
      price_note: "starting from — exact price agreed at the free consultation",
    },
  },
};

// ---- Service database: 14 services ------------------------------------------

const SERVICES = [
  { id: "shopify", cat: "savdo", price: "800K–1.5M", time: { uz: "3–7 kun", ru: "3–7 дней", en: "3–7 days" },
    kw: ["shopify", "do'kon", "dokon", "магазин", "store", "онлайн", "onlayn", "savdo", "интернет", "internet"],
    title: { uz: "Shopify do'kon tashkil etish", ru: "Создание Shopify магазина", en: "Shopify store setup" },
    inc: { uz: ["Dizayn va tema sozlash", "8+ mahsulot yuklash", "To'lov va yetkazib berish", "Mobil versiya"],
           ru: ["Дизайн и тема", "8+ товаров", "Оплата и доставка", "Мобильная версия"],
           en: ["Design and theme setup", "8+ products", "Payments and shipping", "Mobile-ready"] } },
  { id: "products", cat: "savdo", price: "300K", time: { uz: "1–2 kun", ru: "1–2 дня", en: "1–2 days" },
    kw: ["mahsulot", "yuklash", "товар", "загрузка", "products", "upload", "savdo"],
    title: { uz: "Mahsulot yuklash (50 tagacha)", ru: "Загрузка товаров (до 50)", en: "Product upload (up to 50)" },
    inc: { uz: ["Rasmlar bilan", "Tavsiflar va narxlar", "Variantlar (o'lcham/rang)", "Inventar"],
           ru: ["С фото", "Описания и цены", "Варианты (размер/цвет)", "Остатки"],
           en: ["With photos", "Descriptions and prices", "Variants (size/color)", "Inventory"] } },
  { id: "uzum", cat: "savdo", price: "500K–800K", time: { uz: "2–4 kun", ru: "2–4 дня", en: "2–4 days" },
    kw: ["uzum", "market", "маркет", "savdo", "onlayn"],
    title: { uz: "Uzum Market seller setup", ru: "Uzum Market seller setup", en: "Uzum Market seller setup" },
    inc: { uz: ["Seller kabinet", "Katalog sozlash", "Mahsulot joylash"],
           ru: ["Кабинет продавца", "Настройка каталога", "Размещение товаров"],
           en: ["Seller cabinet", "Catalog setup", "Product listing"] } },
  { id: "landing", cat: "sayt", price: "500K–1M", time: { uz: "2 kun", ru: "2 дня", en: "2 days" },
    kw: ["landing", "лендинг", "sahifa", "одностраничный", "sayt", "сайт", "website"],
    title: { uz: "Landing page", ru: "Landing page", en: "Landing page" },
    inc: { uz: ["Zamonaviy dizayn", "Mobil versiya", "Mijoz formasi", "Analytics"],
           ru: ["Современный дизайн", "Мобильная версия", "Форма для клиентов", "Аналитика"],
           en: ["Modern design", "Mobile-ready", "Customer form", "Analytics"] } },
  { id: "corporate", cat: "sayt", price: "1M–2M", time: { uz: "4–7 kun", ru: "4–7 дней", en: "4–7 days" },
    kw: ["sayt", "сайт", "vizitka", "визитка", "korporativ", "корпоративный", "website", "veb", "web"],
    title: { uz: "Vizitka / korporativ sayt (3–5 sahifa)", ru: "Визитка / корпоративный сайт (3–5 страниц)", en: "Business / corporate website (3–5 pages)" },
    inc: { uz: ["3–5 sahifa", "UZ/RU/EN tillar", "Admin panel", "Kontaktlar va forma"],
           ru: ["3–5 страниц", "Языки UZ/RU/EN", "Админ-панель", "Контакты и форма"],
           en: ["3–5 pages", "UZ/RU/EN languages", "Admin panel", "Contacts and form"] } },
  { id: "qrmenu", cat: "sayt", price: "250K–400K", time: { uz: "1–2 kun", ru: "1–2 дня", en: "1–2 days" },
    kw: ["qr", "menyu", "меню", "kafe", "кафе", "restoran", "restaurant", "sayt", "сайт", "website"],
    title: { uz: "QR menyu (kafelar uchun)", ru: "QR-меню (для кафе)", en: "QR menu (for cafés)" },
    inc: { uz: ["QR kodlar stollarga", "Onlayn menyu sahifasi", "Oson yangilanish"],
           ru: ["QR-коды на столы", "Онлайн-страница меню", "Лёгкое обновление"],
           en: ["QR codes for tables", "Online menu page", "Easy updates"] } },
  { id: "tbot", cat: "bot", price: "500K–1.5M", time: { uz: "3–5 kun", ru: "3–5 дней", en: "3–5 days" },
    kw: ["bot", "бот", "telegram"],
    title: { uz: "Telegram bot yaratish", ru: "Создание Telegram-бота", en: "Telegram bot creation" },
    inc: { uz: ["Menyu va tugmalar", "Buyurtma qabuli", "Mijozlarga javob", "Kanal integratsiya"],
           ru: ["Меню и кнопки", "Приём заказов", "Ответы клиентам", "Интеграция канала"],
           en: ["Menu and buttons", "Order intake", "Customer replies", "Channel integration"] } },
  { id: "payclick", cat: "bot", price: "300K–500K", time: { uz: "1–3 kun", ru: "1–3 дня", en: "1–3 days" },
    kw: ["payme", "click", "клик", "пейме", "to'lov", "tolov", "оплата", "платеж", "payment", "bot"],
    title: { uz: "Payme/Click integratsiya", ru: "Интеграция Payme/Click", en: "Payme/Click integration" },
    inc: { uz: ["Merchant hisobiga ulash", "To'lov tugmalari", "Test va ishga tushirish"],
           ru: ["Подключение merchant-аккаунта", "Кнопки оплаты", "Тест и запуск"],
           en: ["Merchant account hookup", "Payment buttons", "Test and launch"] } },
  { id: "instagram", cat: "growth", price: "200K–300K", time: { uz: "1 kun", ru: "1 день", en: "1 day" },
    kw: ["instagram", "инстаграм", "insta", "social"],
    title: { uz: "Instagram biznes sahifa", ru: "Instagram бизнес-страница", en: "Instagram business page" },
    inc: { uz: ["Biznes akkauntga o'tkazish", "Profil va highlight", "Post shablonlar"],
           ru: ["Перевод в бизнес-аккаунт", "Профиль и хайлайты", "Шаблоны постов"],
           en: ["Business account switch", "Profile and highlights", "Post templates"] } },
  { id: "gmb", cat: "growth", price: "150K–250K", time: { uz: "1 kun", ru: "1 день", en: "1 day" },
    kw: ["google", "бизнес", "business", "xarita", "карта", "maps", "profil"],
    title: { uz: "Google Business Profile", ru: "Google Business Profile", en: "Google Business Profile" },
    inc: { uz: ["Profil yaratish", "Xaritaga qo'shish", "Rasmlar va ma'lumot"],
           ru: ["Создание профиля", "Добавление на карту", "Фото и информация"],
           en: ["Profile creation", "Maps listing", "Photos and info"] } },
  { id: "seo", cat: "growth", price: "250K–400K", time: { uz: "2–3 kun", ru: "2–3 дня", en: "2–3 days" },
    kw: ["seo", "оптимизация", "поиск", "search"],
    title: { uz: "Basic SEO", ru: "Basic SEO", en: "Basic SEO" },
    inc: { uz: ["Sarlavha va tavsiflar", "Tezlik tekshiruvi", "Kalit so'zlar"],
           ru: ["Заголовки и описания", "Проверка скорости", "Ключевые слова"],
           en: ["Headings and descriptions", "Speed check", "Keywords"] } },
  { id: "logo", cat: "growth", price: "150K–500K", time: { uz: "1–3 kun", ru: "1–3 дня", en: "1–3 days" },
    kw: ["logo", "лого", "логотип", "brend", "бренд", "branding", "dizayn", "дизайн", "brand"],
    title: { uz: "Logo / brending", ru: "Логотип / брендинг", en: "Logo / branding" },
    inc: { uz: ["2–3 logo varianti", "Rang palitrasi", "Fayllar to'plami"],
           ru: ["2–3 варианта логотипа", "Цветовая палитра", "Набор файлов"],
           en: ["2–3 logo variants", "Color palette", "File kit"] } },
  { id: "support", cat: "support", price: "200K/oy", time: { uz: "davomiy", ru: "постоянно", en: "ongoing" },
    kw: ["qo'llab", "qollab", "поддержк", "support", "oylik", "обслуживан", "yangilash"],
    title: { uz: "Oylik qo'llab-quvvatlash", ru: "Ежемесячная поддержка", en: "Monthly support" },
    inc: { uz: ["Yangilanishlar", "Kichik tuzatishlar", "Ustuvor javob"],
           ru: ["Обновления", "Мелкие правки", "Приоритетный ответ"],
           en: ["Updates", "Small fixes", "Priority replies"] } },
  { id: "premium", cat: "premium", price: "2.5M–4M", time: { uz: "5–7 kun", ru: "5–7 дней", en: "5–7 days" },
    kw: ["premium", "paket", "пакет", "to'liq", "полный", "full", "hammasi", "всё", "все"],
    title: { uz: "⭐ To'liq onlayn paket", ru: "⭐ Полный онлайн пакет", en: "⭐ Full online package" },
    inc: { uz: ["Shopify do'kon", "Telegram bot", "Payme/Click", "Kanal setup"],
           ru: ["Shopify магазин", "Telegram-бот", "Payme/Click", "Настройка канала"],
           en: ["Shopify store", "Telegram bot", "Payme/Click", "Channel setup"] } },
];

const SVC_BY_ID = Object.fromEntries(SERVICES.map(s => [s.id, s]));

// entry price in thousands of UZS — used to sort lists cheapest-first
const MIN_PRICE = { shopify: 800, products: 300, uzum: 500, landing: 500, corporate: 1000,
                    qrmenu: 250, tbot: 500, payclick: 300, instagram: 200, gmb: 150,
                    seo: 250, logo: 150, support: 200, premium: 2500 };

const CATS = ["savdo", "sayt", "bot", "growth", "support", "premium"];

// ---- Keyboards and cards -----------------------------------------------------

function mainMenu(lang) {
  const L = T[lang].lbl, lr = L.lang_row;
  return { inline_keyboard: [
    [{ text: L.services, callback_data: "services_menu" }, { text: L.prices, callback_data: "prices" }],
    [{ text: L.premium, callback_data: "svc_premium" }],
    [{ text: L.demo, url: DEMO_STORE }, { text: L.channel, url: CHANNEL_URL }],
    [{ text: L.order, url: `https://t.me/${OWNER_USERNAME}` }],
    [{ text: lr[0], callback_data: "set_lang_uz" }, { text: lr[1], callback_data: "set_lang_ru" }, { text: lr[2], callback_data: "set_lang_en" }],
  ] };
}

function servicesMenuKb(lang) {
  const L = T[lang].lbl;
  return { inline_keyboard: [
    [{ text: L.cat_savdo, callback_data: "cat_savdo" }, { text: L.cat_sayt, callback_data: "cat_sayt" }],
    [{ text: L.cat_bot, callback_data: "cat_bot" }],
    [{ text: L.cat_growth, callback_data: "cat_growth" }],
    [{ text: L.cat_support, callback_data: "cat_support" }],
    [{ text: L.premium, callback_data: "svc_premium" }],
    [{ text: L.back, callback_data: "back_main" }],
  ] };
}

function categoryPage(lang, cat) {
  const L = T[lang].lbl;
  const services = SERVICES.filter(s => s.cat === cat).sort((a, b) => MIN_PRICE[a.id] - MIN_PRICE[b.id]);
  const kb = services.map(s => [{ text: `${s.title[lang]} · ${s.price} ${L.cur}`, callback_data: `svc_${s.id}` }]);
  kb.push([{ text: L.back_services, callback_data: "services_menu" }, { text: L.back, callback_data: "back_main" }]);
  return { text: `${L["cat_" + cat]} — ${services.length}\n${L.cat_pick}`, keyboard: { inline_keyboard: kb } };
}

function svcCard(lang, svc) {
  const L = T[lang].lbl;
  const lines = [
    `🛍 <b>${svc.title[lang]}</b>`,
    "",
    `💰 ${L.price_label}: <b>${svc.price} ${L.cur}</b> (${L.price_note})`,
    `⏱ ${L.duration_label}: ${svc.time[lang]}`,
    "",
    `✅ ${L.included_label}:`,
    ...svc.inc[lang].map(x => `  • ${x}`),
    "",
    L.promo,
  ];
  return lines.join("\n");
}

function svcDetailKb(lang, svc) {
  const L = T[lang].lbl;
  return { inline_keyboard: [
    [{ text: L.order_btn, url: `https://t.me/${OWNER_USERNAME}` }],
    [{ text: L.back_services, callback_data: `cat_${svc.cat}` }],
    [{ text: L.back, callback_data: "back_main" }],
  ] };
}

function searchServices(query) {
  // phone autocorrect turns ' into ’/ʻ — normalize so matching still works
  const q = query.toLowerCase().replace(/[\u2019\u02BB\u2018]/g, "'");
  const scored = [];
  for (const svc of SERVICES) {
    const hits = svc.kw.filter(kw => q.includes(kw)).length;
    if (hits) scored.push({ hits, id: svc.id });
  }
  scored.sort((a, b) => (b.hits - a.hits) || (MIN_PRICE[a.id] - MIN_PRICE[b.id]));
  return scored.slice(0, 4).map(x => SVC_BY_ID[x.id]);
}

function demoMsg(lang) {
  return T[lang].lbl.demo_msg.replace("{url}", DEMO_STORE).replace("{pw}", DEMO_PASSWORD);
}

// ---- Telegram plumbing --------------------------------------------------------

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
  const payload = { chat_id: chatId, text, parse_mode: "HTML" };
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
    const text = (msg.text || "").trim();
    const low = text.toLowerCase();
    if (low.startsWith("/start") || low === "/menu") {
      await send(token, chat, T[lang].welcome, mainMenu(lang));
    } else if (low === "/services" || low === "/xizmatlar" || low === "/услуги") {
      await send(token, chat, T[lang].services_menu, servicesMenuKb(lang));
    } else if (low === "/prices" || low === "/narxlar" || low === "/цены") {
      await send(token, chat, T[lang].prices, mainMenu(lang));
    } else if (low === "/demo") {
      await send(token, chat, demoMsg(lang), mainMenu(lang));
    } else if (low === "/premium") {
      const svc = SVC_BY_ID.premium;
      await send(token, chat, svcCard(lang, svc), svcDetailKb(lang, svc));
    } else if (low.startsWith("/svc_")) {
      const svc = SVC_BY_ID[low.replace("/svc_", "")];
      if (svc) await send(token, chat, svcCard(lang, svc), svcDetailKb(lang, svc));
    } else if (low === "/help" || low === "/yordam" || low === "/помощь") {
      await send(token, chat, t.help + OWNER_USERNAME, mainMenu(lang));
    } else if (low.startsWith("/")) {
      await send(token, chat, t.unknown, mainMenu(lang));
    } else {
      const matches = searchServices(low);
      if (matches.length === 1) {
        await send(token, chat, svcCard(lang, matches[0]), svcDetailKb(lang, matches[0]));
      } else if (matches.length > 1) {
        const kb = matches.map(s => [{ text: `${s.title[lang]} · ${s.price} ${t.cur}`, callback_data: `svc_${s.id}` }]);
        kb.push([{ text: t.back, callback_data: "back_main" }]);
        await send(token, chat, t.found, { inline_keyboard: kb });
      } else {
        await send(token, chat, t.not_found, servicesMenuKb(lang));
      }
    }
  } else if (cb) {
    const chat = cb.message.chat.id;
    const lang = await getLang(chat);
    const t = T[lang].lbl;
    const data = cb.data;
    if (data === "services_menu") {
      await send(token, chat, T[lang].services_menu, servicesMenuKb(lang));
    } else if (data === "prices") {
      await send(token, chat, T[lang].prices, mainMenu(lang));
    } else if (data === "back_main") {
      await send(token, chat, T[lang].welcome, mainMenu(lang));
    } else if (data.startsWith("svc_")) {
      const svc = SVC_BY_ID[data.replace("svc_", "")];
      if (svc) await send(token, chat, svcCard(lang, svc), svcDetailKb(lang, svc));
    } else if (data.startsWith("cat_")) {
      const cat = data.replace("cat_", "");
      if (CATS.includes(cat)) {
        const page = categoryPage(lang, cat);
        await send(token, chat, page.text, page.keyboard);
      }
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
      await api(token, "setMyName", { name: "Exclusive Web Studio 🛒" });
      await api(token, "setMyDescription", {
        description: "🛒 Shopify do'konlar · 💻 Saytlar · 🤖 Telegram botlar · 📣 Brending — Toshkent. 14 xizmat, 3 tilda. 🔍 Xizmat nomini yozing — bot topadi. /start",
      });
      await api(token, "setMyShortDescription", {
        short_description: "🛒 Shopify do'konlar, saytlar, botlar — Toshkent. 14 xizmat · 3 til · 3 kunda tayyor.",
      });
      await api(token, "setMyCommands", { commands: [
        { command: "start", description: "Boshlash · Start · Старт" },
        { command: "services", description: "14 xizmat · Services · Услуги" },
        { command: "prices", description: "Narxlar · Prices · Цены" },
        { command: "demo", description: "Demo do'kon + parol" },
        { command: "premium", description: "Premium paket" },
        { command: "help", description: "Yordam · Help · Помощь" },
      ] });
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

  if (req.method === "GET") return new Response("uz_website_bot is alive (UZ/RU/EN · search)", { status: 200 });
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
