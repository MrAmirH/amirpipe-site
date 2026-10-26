import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ============================================================
   امیرپایپ | مرجع تخصصی لوله‌کشی و تأسیسات مهندسی ساختمان
   تحت پوشش شرکت سینا برج بیژن (شماره ثبت ۳۷۲۰۵۰)
   ------------------------------------------------------------
   تصاویر: پوشه public/images (مسیر در کد: /images/نام-فایل)
   ============================================================ */

const PHONE_MAIN = "09123303743";
const PHONE_BACKUP = "09900857057";
const TELEGRAM_BOT = "https://t.me/Amirpipe_bot";
const ADDRESS = "خیابان پیروزی، چهارصد دستگاه / نبرد";
const MAP_URL = "https://nshn.ir/5fQbvgBYexRYmZ";
const MODAL_TEXT = "امیرپایپ (سینا برج بیژن) | مشاوره و اجرا: ۰۹۱۲۳۳۰۳۷۴۳ - تلگرام: @Amirpipe_bot";

// تصاویر محلی از پوشه public/images
const imgSrc = (file) => `/images/${file}`;

const NAV = [
  { id: "home", label: "صفحه اصلی" },
  { id: "featured", label: "پروژه‌های برتر" },
  { id: "services", label: "خدمات" },
  { id: "gallery", label: "گالری نمونه‌کارها" },
  { id: "about", label: "درباره ما" },
  { id: "contact", label: "تماس با ما" },
];

const FEATURED = [
  {
    title: "لوله‌کشی کامل برج مسکونی ۱۲ طبقه",
    desc: "اجرای کامل لوله‌کشی آب سرد و گرم، فاضلاب و کلکتورها با لوله پنج‌لایه و تست فشار.",
    img: "manifold-1.webp",
    alt: "لوله‌کشی کلکتوری برج مسکونی توسط امیرپایپ",
  },
  {
    title: "اجرای گرمایش از کف ویلای لوکس",
    desc: "طراحی و اجرای گرمایش از کف با کلکتور مرکزی، کنترل دمای هر اتاق و ضمانت‌نامه کتبی.",
    img: "heating.webp",
    alt: "اجرای گرمایش از کف توسط امیرپایپ",
  },
  {
    title: "بازسازی کامل تأسیسات آپارتمان قدیمی",
    desc: "تعویض لوله‌های گالوانیزه فرسوده با پوش‌فیت، بدون خرابی غیرضروری و با تحویل تمیز.",
    img: "pipe-floor-1.webp",
    alt: "بازسازی تأسیسات ساختمان توسط امیرپایپ",
  },
  {
    title: "موتورخانه و پمپ‌های مجتمع تجاری",
    desc: "نصب و راه‌اندازی پمپ‌های بوستر، مخزن ذخیره آب و سیستم کنترل فشار.",
    img: "pump-1.webp",
    alt: "نصب پمپ و موتورخانه توسط امیرپایپ",
  },
  {
    title: "نشت‌یابی و ترمیم لوله ترکیده ساختمان اداری",
    desc: "تشخیص دقیق محل نشت با دستگاه دیجیتال و تعمیر با حداقل تخریب.",
    img: "drain-1.webp",
    alt: "نشت‌یابی و ترمیم لوله توسط امیرپایپ",
  },
];

const SERVICES = [
  {
    icon: "pipe",
    title: "لوله‌کشی تخصصی آب، فاضلاب، گاز و شوفاژ",
    desc: "اجرای اصولی با مصالح استاندارد و تست فشار کامل.",
    items: [
      "لوله پنج‌لایه نیوپایپ و سوپرپایپ",
      "اتصالات پوش‌فیت",
      "فاضلاب پلیکا و پلی‌پروپیلن",
      "گرمایش از کف استاندارد",
    ],
  },
  {
    icon: "wall",
    title: "مرمت و بازسازی اساسی",
    desc: "نوسازی ساختمان با کمترین ضایعات و بیشترین کیفیت.",
    items: [
      "مرمت نمای داخلی و خارجی",
      "عایق‌کاری",
      "تخریب اصولی",
      "نوسازی سرویس‌های بهداشتی",
    ],
  },
  {
    icon: "boiler",
    title: "نصب و تعمیرات تجهیزات",
    desc: "نصب، سرویس و عیب‌یابی انواع تجهیزات تأسیساتی.",
    items: [
      "موتورخانه، پکیج و چیلر",
      "آبگرمکن، کولر آبی و گازی",
      "نصب شیرآلات",
      "نصب لوازم بهداشتی",
    ],
  },
  {
    icon: "leak",
    title: "نشت‌یابی و لوله‌بازکنی",
    desc: "تشخیص دقیق خرابی بدون تخریب‌های اضافه.",
    items: [
      "نشت‌یابی دیجیتال",
      "تشخیص ترکیدگی لوله با دستگاه پیشرفته",
      "لوله‌بازکنی بدون خرابی",
      "جوشکاری تأسیساتی",
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "همه پروژه‌ها" },
  { id: "sewage", label: "لوله‌کشی فاضلاب (پوش‌فیت و پلیکا)" },
  { id: "pump", label: "پمپ و مخزن آب" },
  { id: "collector", label: "لوله‌کشی کلکتوری و گرمایش از کف" },
  { id: "meter", label: "تفکیک کنتور و انشعابات آب و گاز" },
  { id: "wallhung", label: "نصب و زیرسازی وال‌هنگ (توالت توکار)" },
];

const GALLERY = [
  { id: 1, cat: "sewage", title: "فاضلاب‌کشی پوش‌فیت ساختمان ۵ واحدی", img: "drain-1.webp", alt: "فاضلاب‌کشی پوش‌فیت ساختمان ۵ واحدی - امیرپایپ", desc: "اجرای کامل شبکه فاضلاب با لوله و اتصالات پوش‌فیت، شیب‌بندی استاندارد و تست آب‌بندی پیش از پوشش." },
  { id: 2, cat: "sewage", title: "لوله‌کشی پلیکا آپارتمان نوساز", img: "drain-2.webp", alt: "لوله‌کشی پلیکا آپارتمان نوساز - امیرپایپ", desc: "نصب لوله‌های پلیکا با رعایت مبحث ۱۶ مقررات ملی ساختمان و عایق‌کاری صوتی." },
  { id: 3, cat: "sewage", title: "اجرای شبکه فاضلاب ساختمان (نمونه ۳)", img: "drain-3.webp", alt: "خدمات لوله‌کشی فاضلاب امیرپایپ - نمونه ۳", desc: "اجرای لوله‌کشی فاضلاب ساختمان با شیب‌بندی استاندارد و اتصالات مرغوب." },
  { id: 4, cat: "sewage", title: "اجرای شبکه فاضلاب ساختمان (نمونه ۴)", img: "drain-4.webp", alt: "خدمات لوله‌کشی فاضلاب امیرپایپ - نمونه ۴", desc: "اجرای لوله‌کشی فاضلاب ساختمان با شیب‌بندی استاندارد و اتصالات مرغوب." },
  { id: 5, cat: "pump", title: "نصب پمپ بوستر و مخزن ذخیره", img: "pump-1.webp", alt: "نصب پمپ بوستر و مخزن ذخیره - امیرپایپ", desc: "نصب پمپ بوستر، مخزن ۲ هزار لیتری و تابلوی کنترل فشار برای مجتمع مسکونی." },
  { id: 6, cat: "pump", title: "راه‌اندازی سیستم پمپاژ و ذخیره آب", img: "pump-2.webp", alt: "راه‌اندازی سیستم پمپاژ و ذخیره آب - امیرپایپ", desc: "اجرای سیستم پمپاژ دوبله با قابلیت سوییچ خودکار و حفاظت از کارکرد بی‌آب." },
  { id: 7, cat: "pump", title: "نصب پمپ آب ساختمان (نمونه ۳)", img: "pump-3.webp", alt: "خدمات نصب پمپ آب امیرپایپ - نمونه ۳", desc: "نصب و راه‌اندازی پمپ آب با لوله‌کشی اصولی و تست کامل." },
  { id: 8, cat: "pump", title: "نصب پمپ آب ساختمان (نمونه ۴)", img: "pump-4.webp", alt: "خدمات نصب پمپ آب امیرپایپ - نمونه ۴", desc: "نصب و راه‌اندازی پمپ آب با لوله‌کشی اصولی و تست کامل." },
  { id: 9, cat: "collector", title: "لوله‌کشی کلکتوری واحد مسکونی", img: "manifold-1.webp", alt: "لوله‌کشی کلکتوری واحد مسکونی - امیرپایپ", desc: "کلکتور مرکزی آب سرد و گرم با لوله‌های پنج‌لایه و برچسب‌گذاری مسیرها." },
  { id: 10, cat: "collector", title: "کلکتورکشی آب سرد و گرم (نمونه ۲)", img: "manifold-2.webp", alt: "خدمات لوله‌کشی کلکتوری امیرپایپ - نمونه ۲", desc: "اجرای کلکتور با شیرهای قطع‌وصل مستقل و مسیرهای مشخص برای هر مصرف‌کننده." },
  { id: 11, cat: "collector", title: "کلکتورکشی و گرمایش از کف", img: "heating.webp", alt: "کلکتورکشی و گرمایش از کف - امیرپایپ", desc: "اجرای لوله‌کشی کلکتوری با شیرهای قطع‌وصل مستقل برای هر واحد مصرف و تست فشار ۲۴ ساعته." },
  { id: 12, cat: "collector", title: "اجرای لوله گرمایش از کف", img: "pipe-floor-1.webp", alt: "خدمات گرمایش از کف امیرپایپ", desc: "پخش لوله گرمایش از کف با فواصل استاندارد و تست فشار پیش از پوشش." },
  { id: 13, cat: "meter", title: "تفکیک کنتور آب ساختمان چندواحدی", img: "meter-1.webp", alt: "تفکیک کنتور آب ساختمان چندواحدی - امیرپایپ", desc: "انشعاب‌گیری و تفکیک کنتور آب هر واحد با هماهنگی کامل مراحل اداری." },
  { id: 14, cat: "meter", title: "انشعابات آب و گاز مجتمع", img: "meter-2.webp", alt: "انشعابات آب و گاز مجتمع - امیرپایپ", desc: "اجرای انشعابات اصولی آب و گاز مطابق با ضوابط شرکت‌های مربوطه." },
  { id: 15, cat: "meter", title: "تفکیک کنتور و انشعابات (نمونه ۳)", img: "meter-3.webp", alt: "خدمات تفکیک کنتور امیرپایپ - نمونه ۳", desc: "اجرای انشعابات و نصب کنتور با رعایت ضوابط و استانداردهای مربوطه." },
  { id: 16, cat: "wallhung", title: "زیرسازی و نصب توالت وال‌هنگ", img: "wallhung-1.webp", alt: "زیرسازی و نصب توالت وال‌هنگ - امیرپایپ", desc: "نصب شاسی فلزی توکار، تنظیم ارتفاع و آب‌بندی کامل با ضمانت نصب." },
];

const ICONS = {
  phone: "M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z",
  telegram: "M21.9 4.3L18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.3-.1-.5-.6-.2L6.6 13.2 2 11.800c-1-.3-1-1 .2-1.500L20.200 3.400c.8-.3 1.600.2 1.700.900z",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M6 6l12 12M18 6L6 18",
  zoom: "M11 4a7 7 0 105.2 11.700l4 4 1.400-1.400-4-4A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10zm-1 2v2H8v2h2v2h2v-2h2v-2h-2V8z",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  up: "M12 19V5M5 12l7-7 7 7",
  pin: "M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.500a2.500 2.500 0 110-5 2.500 2.500 0 010 5z",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.400l4 2.300-.8 1.400L11 13V7z",
  shield: "M12 2l8 3v6c0 5-3.400 9.500-8 11-4.600-1.500-8-6-8-11V5l8-3zm-1 13l6-6-1.400-1.400L11 12.200 8.400 9.600 7 11l4 4z",
  check: "M5 12l5 5L20 7",
  insta: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.500-3.500a1 1 0 100 2 1 1 0 000-2z",
  whatsapp: "M12 2a10 10 0 00-8.600 15.100L2 22l5-1.300A10 10 0 1012 2zm5 13.500c-.2.600-1.200 1.200-1.700 1.200-.5.100-1 .2-3.300-.7-2.800-1.100-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.400 0 .6l-.4.600c-.2.200-.3.400-.1.700.2.300.8 1.300 1.800 2.100 1.200 1 2.200 1.300 2.500 1.500.3.100.5.100.7-.1l.9-1.100c.2-.3.400-.2.700-.1l1.900.9c.3.100.5.200.6.300.1.200.1.800-.1 1.400z",
  linkedin: "M4 3a2 2 0 110 4 2 2 0 010-4zM2 9h4v12H2zm7 0h4v1.700c.6-1 1.900-2 3.800-2 4 0 4.200 2.600 4.200 5.300V21h-4v-6c0-1.400 0-3-1.900-3s-2.100 1.400-2.100 2.900V21H9z",
};

const Icon = ({ name, size = 20, stroke = false, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth={stroke ? 2 : 0}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

const ServiceIcon = ({ type }) => {
  const common = { width: 34, height: 34, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "pipe")
    return (<svg {...common}><path d="M6 14h22a8 8 0 018 8v12" /><path d="M2 10v8M2 14h4M32 34h8M36 38v6" /><circle cx="36" cy="30" r="2" /></svg>);
  if (type === "wall")
    return (<svg {...common}><rect x="6" y="8" width="36" height="32" rx="2" /><path d="M6 19h36M6 30h36M18 8v11M30 19v11M18 30v10" /></svg>);
  if (type === "boiler")
    return (<svg {...common}><rect x="12" y="6" width="24" height="36" rx="5" /><circle cx="24" cy="20" r="6" /><path d="M24 17v3l2 2M18 36h12" /></svg>);
  return (<svg {...common}><path d="M24 5c6 9 11 14 11 21a11 11 0 01-22 0c0-7 5-12 11-21z" /><path d="M19 28a5 5 0 005 5" /></svg>);
};

const toTel = (n) => `tel:+98${n.replace(/^0/, "")}`;

/* ---------- Brand mark ---------- */
function Logo({ small = false }) {
  const s = small ? 38 : 46;
  return (
    <span className="logo" style={{ width: s, height: s }}>
      <svg viewBox="0 0 48 48" width={s} height={s} aria-hidden="true">
        <defs>
          <linearGradient id={`lg${small ? "s" : "b"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#0D30B4" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill={`url(#lg${small ? "s" : "b"})`} />
        <path d="M10 17h17a7 7 0 017 7v8" stroke="#fff" strokeWidth="4.500" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="35" r="4.500" fill="#A20515" stroke="#fff" strokeWidth="2" />
      </svg>
    </span>
  );
}

/* ---------- Image with graceful fallback ---------- */
function SafeImg({ src, alt, className = "", ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.500" strokeLinecap="round">
          <path d="M6 14h22a8 8 0 018 8v12" /><circle cx="36" cy="38" r="3" />
        </svg>
      </div>
    );
  return <img src={src} alt={alt} className={className} loading="lazy" draggable={false} onError={() => setFailed(true)} {...rest} />;
}

/* ============================================================
   Header
   ============================================================ */
function Header({ active, onNav }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id) => {
    setOpen(false);
    onNav(id);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <button className="brand" onClick={() => go("home")} aria-label="امیر پایپ">
          <Logo />
          <span className="brand-text">
            <strong>امیر پایپ</strong>
            <small>
              <Icon name="shield" size={12} /> ثبت‌شده: سینا برج بیژن · ۳۷۲۰۵۰
            </small>
          </span>
        </button>

        <nav className="nav-desktop" aria-label="منوی اصلی">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-link ${active === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>

        <a href={toTel(PHONE_MAIN)} className="btn btn-red header-call">
          <Icon name="phone" size={18} />
          <span dir="ltr">{PHONE_MAIN}</span>
        </a>

        <button className="burger" onClick={() => setOpen(!open)} aria-label="منو" aria-expanded={open}>
          <Icon name={open ? "close" : "menu"} stroke size={24} />
        </button>
      </div>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {NAV.map((n) => (
          <button key={n.id} className={`nav-link ${active === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
            {n.label}
          </button>
        ))}
        <a href={toTel(PHONE_MAIN)} className="btn btn-red block">
          <Icon name="phone" size={18} /> تماس فوری: <span dir="ltr">{PHONE_MAIN}</span>
        </a>
      </div>
    </header>
  );
}

/* ============================================================
   Hero
   ============================================================ */
function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="badge glass">
            <Icon name="shield" size={16} /> ضمانت کتبی حسن انجام کار
          </span>
          <h1>
            امیر پایپ <span className="sep">|</span>
            <span className="grad"> مرجع تخصصی لوله‌کشی و تأسیسات مهندسی ساختمان</span>
          </h1>
          <p>
            تحت پوشش شرکت <b>سینا برج بیژن</b> (شماره ثبت ۳۷۲۰۵۰) - اجرای اصولی، ضمانت کتبی حسن انجام کار،
            اعزام فوری اکیپ مجهز به کل تهران و حومه
          </p>
          <div className="hero-cta">
            <a href={toTel(PHONE_MAIN)} className="btn btn-red btn-lg pulse">
              <Icon name="phone" size={20} /> درخواست فوری کارشناس / تماس
            </a>
            <a href={TELEGRAM_BOT} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
              <Icon name="telegram" size={20} /> ارتباط در تلگرام
            </a>
          </div>
          <ul className="hero-stats">
            <li><b>۲۴/۷</b><span>اعزام شبانه‌روزی</span></li>
            <li><b>مبحث ۱۶ و ۱۷</b><span>مقررات ملی ساختمان</span></li>
            <li><b>ضمانت‌نامه</b><span>کتبی و رسمی</span></li>
          </ul>
        </div>

        <div className="hero-card glass">
          <div className="hero-card-head">
            <span className="live-dot" /> اکیپ در دسترس است
          </div>
          <h3>تماس اضطراری</h3>
          <p>ترکیدگی لوله، نشتی یا گرفتگی؟ همین حالا تماس بگیرید.</p>
          <a href={toTel(PHONE_MAIN)} className="big-phone" dir="ltr">{PHONE_MAIN}</a>
          <a href={toTel(PHONE_BACKUP)} className="mini-phone" dir="ltr">پشتیبان: {PHONE_BACKUP}</a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Featured Carousel
   ============================================================ */
function ImageModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="lb-box glass" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} aria-label="بستن"><Icon name="close" stroke size={22} /></button>
        <div className="lb-img"><SafeImg src={imgSrc(item.img)} alt={item.alt} /></div>
        <div className="lb-body">
          <p className="lb-contact">{MODAL_TEXT}</p>
        </div>
      </div>
    </div>
  );
}

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const trackRef = useRef(null);
  const count = FEATURED.length;
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || dragging) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, dragging, next]);

  const onDown = (e) => {
    if (e.target.closest("button")) return;
    setDragging(true);
    moved.current = false;
    startX.current = e.clientX;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
    setDragX(dx);
  };
  const onUp = (e) => {
    if (!dragging) return;
    const width = trackRef.current?.offsetWidth || 1;
    const threshold = Math.min(80, width * 0.15);
    // track is LTR: dragging right => previous slide, left => next slide
    if (dragX > threshold) prev();
    else if (dragX < -threshold) next();
    setDragging(false);
    setDragX(0);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  return (
    <section id="featured" className="section featured">
      <div className="container">
        <SectionHead kicker="نمونه اجراهای شاخص" title="پروژه‌های برتر امیر پایپ" sub="نگاهی به بخشی از پروژه‌های موفق اجراشده توسط امیر پایپ" />

        <div
          className="carousel glass"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            className="viewport"
            ref={trackRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <div
              className="track"
              style={{
                transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                transition: dragging ? "none" : "transform .7s cubic-bezier(.22,.8,.24,1)",
              }}
            >
              {FEATURED.map((p, i) => (
                <article className="slide" key={p.title} aria-hidden={i !== index} dir="rtl">
                  <div className="slide-img">
                    <SafeImg src={imgSrc(p.img)} alt={p.alt} />
                    <span className="slide-num">{String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                  </div>
                  <div className="slide-body">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <button className="btn btn-blue" onClick={() => !moved.current && setModal(p)}>
                      مشاهده جزئیات و مشاوره
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button className="arrow arrow-r" onClick={next} aria-label="بعدی"><Icon name="left" stroke size={22} /></button>
          <button className="arrow arrow-l" onClick={prev} aria-label="قبلی"><Icon name="right" stroke size={22} /></button>

          <div className="dots" role="tablist">
            {FEATURED.map((p, i) => (
              <button key={p.title} className={`dot ${i === index ? "on" : ""}`} onClick={() => setIndex(i)} aria-label={`اسلاید ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      {modal && <ImageModal item={modal} onClose={closeModal} />}
    </section>
  );
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div className="section-head">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
      <span className="bar" />
    </div>
  );
}

/* ============================================================
   Services
   ============================================================ */
function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <SectionHead kicker="خدمات ما" title="خدمات چهارگانه مهندسی" sub="از لوله‌کشی ساختمان نوساز تا نشت‌یابی و تعمیرات اضطراری" />
        <div className="grid-4">
          {SERVICES.map((s, i) => (
            <article className="card glass service" key={s.title}>
              <span className="service-no">{String(i + 1).padStart(2, "0")}</span>
              <div className="service-icon"><ServiceIcon type={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>
                {s.items.map((it) => (
                  <li key={it}><Icon name="check" stroke size={16} /> {it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Gallery + Lightbox
   ============================================================ */
function Gallery() {
  const [cat, setCat] = useState("all");
  const [active, setActive] = useState(null);

  const list = useMemo(() => (cat === "all" ? GALLERY : GALLERY.filter((g) => g.cat === cat)), [cat]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <SectionHead kicker="نمونه‌کارها" title="گالری جامع پروژه‌ها و نمونه‌کارها" sub="با انتخاب دسته‌بندی، پروژه‌های مرتبط را فوراً مشاهده کنید" />

        <div className="tabs" role="tablist">
          {CATEGORIES.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={`tab ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {list.map((g) => (
            <button key={g.id} className="g-card" onClick={() => setActive(g)} aria-label={`مشاهده ${g.title}`}>
              <SafeImg src={imgSrc(g.img)} alt={g.alt} />
              <span className="g-zoom"><Icon name="zoom" size={22} /></span>
              <span className="g-info">
                <strong>{g.title}</strong>
              </span>
            </button>
          ))}
          {list.length === 0 && <p className="empty">پروژه‌ای در این دسته ثبت نشده است.</p>}
        </div>
      </div>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label={active.title}>
          <div className="lb-box glass" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setActive(null)} aria-label="بستن"><Icon name="close" stroke size={22} /></button>
            <div className="lb-img"><SafeImg src={imgSrc(active.img)} alt={active.alt} /></div>
            <div className="lb-body">
              <h3>{active.title}</h3>
              <p>{active.desc}</p>
              <a href={toTel(PHONE_MAIN)} className="btn btn-red btn-lg">
                <Icon name="phone" size={20} />
                مشاوره برای اجرای پروژه مشابه: <span dir="ltr">{PHONE_MAIN}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   About
   ============================================================ */
function About() {
  const points = [
    "تکیه بر تجربه اجرایی و کادر مجرب",
    "رعایت کامل مبحث ۱۶ و ۱۷ مقررات ملی ساختمان",
    "ضمانت کیفیت کار و ضمانت‌نامه کتبی",
    "اعزام سریع اکیپ مجهز در سراسر تهران",
  ];
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <div className="about-visual glass">
          <Logo />
          <h3>امیر پایپ</h3>
          <p>تحت مدیریت امیر</p>
          <div className="company">
            <small>شرکت رسمی</small>
            <b>سینا برج بیژن</b>
            <small>شماره ثبت: ۳۷۲۰۵۰</small>
          </div>
        </div>
        <div className="about-text">
          <SectionHead kicker="درباره ما" title="آشنایی با امیر پایپ" />
          <p>
            امیر پایپ مجموعه‌ای تخصصی در حوزه لوله‌کشی و تأسیسات مهندسی ساختمان است که با مدیریت <b>امیر</b> و
            تحت پوشش شرکت رسمی <b>سینا برج بیژن</b> (شماره ثبت ۳۷۲۰۵۰) فعالیت می‌کند. تمرکز ما بر اجرای اصولی،
            شفافیت در هزینه‌ها و تحویل کار تمیز و بدون دردسر است.
          </p>
          <p>
            سال‌ها تجربه اجرایی در پروژه‌های مسکونی، تجاری و اداری، ما را به شریک مطمئن مالکان، سازندگان و مدیران
            ساختمان تبدیل کرده است.
          </p>
          <ul className="about-list">
            {points.map((p) => (
              <li key={p}><span className="tick"><Icon name="check" stroke size={16} /></span>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Contact
   ============================================================ */
function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead kicker="ارتباط با ما" title="تماس با امیر پایپ" sub="در هر ساعت از شبانه‌روز پاسخگوی شما هستیم" />
        <div className="contact-grid">
          <div className="card glass emergency">
            <h3><Icon name="phone" size={22} /> تماس مستقیم</h3>
            <a href={toTel(PHONE_MAIN)} className="phone-row main">
              <span>شماره اصلی</span><b dir="ltr">{PHONE_MAIN}</b>
            </a>
            <a href={toTel(PHONE_BACKUP)} className="phone-row">
              <span>شماره پشتیبان</span><b dir="ltr">{PHONE_BACKUP}</b>
            </a>
            <a href={TELEGRAM_BOT} target="_blank" rel="noopener noreferrer" className="btn btn-blue block">
              <Icon name="telegram" size={20} /> ورود به بات رسمی تلگرام
            </a>
            <div className="tg-numbers" dir="ltr">
              <a href={`https://t.me/+98${PHONE_MAIN.slice(1)}`} target="_blank" rel="noopener noreferrer">Telegram: {PHONE_MAIN}</a>
              <a href={`https://t.me/+98${PHONE_BACKUP.slice(1)}`} target="_blank" rel="noopener noreferrer">Telegram: {PHONE_BACKUP}</a>
            </div>
          </div>

          <div className="card glass">
            <div className="info-row">
              <span className="info-ico"><Icon name="pin" size={22} /></span>
              <div><small>آدرس دقیق</small><p><a href={MAP_URL} target="_blank" rel="noopener noreferrer">{ADDRESS}</a></p></div>
            </div>
            <div className="info-row">
              <span className="info-ico red"><Icon name="clock" size={22} /></span>
              <div>
                <small>ساعت کاری</small>
                <p>پاسخگویی و اعزام نیرو به‌صورت شبانه‌روزی (۲۴ ساعته / ۷ روز هفته)</p>
              </div>
            </div>
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue block">
              <Icon name="pin" size={20} /> مشاهده آدرس روی نقشه
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Telegram bot button (جایگزین پنل چت هوش مصنوعی غیرفعال)
   ============================================================ */
function TelegramButton() {
  return (
    <a
      className="tg-fab"
      href={TELEGRAM_BOT}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ارتباط مستقیم با امیرپایپ در تلگرام"
    >
      <Icon name="telegram" size={26} />
      <span className="fab-label">گفتگو در تلگرام</span>
    </a>
  );
}

/* ============================================================
   Footer
   ============================================================ */
function Footer({ onNav }) {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand"><Logo small /> <strong>امیر پایپ</strong></div>
          <p>مرجع تخصصی لوله‌کشی و تأسیسات مهندسی ساختمان، تحت پوشش شرکت سینا برج بیژن (ثبت ۳۷۲۰۵۰).</p>
          <div className="socials">
            <a href={TELEGRAM_BOT} target="_blank" rel="noopener noreferrer" aria-label="تلگرام"><Icon name="telegram" size={20} /></a>
            <a href={`https://wa.me/98${PHONE_MAIN.slice(1)}`} target="_blank" rel="noopener noreferrer" aria-label="واتساپ"><Icon name="whatsapp" size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام"><Icon name="insta" size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="لینکدین"><Icon name="linkedin" size={20} /></a>
          </div>
        </div>
        <div>
          <h4>دسترسی سریع</h4>
          <ul>{NAV.map((n) => (<li key={n.id}><button onClick={() => onNav(n.id)}>{n.label}</button></li>))}</ul>
        </div>
        <div>
          <h4>تماس</h4>
          <ul className="f-contact">
            <li><a href={toTel(PHONE_MAIN)} dir="ltr">{PHONE_MAIN}</a></li>
            <li><a href={toTel(PHONE_BACKUP)} dir="ltr">{PHONE_BACKUP}</a></li>
            <li><a href={MAP_URL} target="_blank" rel="noopener noreferrer">{ADDRESS}</a></li>
            <li>شبانه‌روزی، ۷ روز هفته</li>
          </ul>
        </div>
      </div>
      <div className="copy">
        <div className="container">© {new Date().toLocaleDateString("fa-IR", { year: "numeric" })} کلیه حقوق مادی و معنوی متعلق به امیر پایپ و شرکت سینا برج بیژن (شماره ثبت ۳۷۲۰۵۰) است.</div>
      </div>
      <button className={`to-top ${top ? "show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="بازگشت به بالا">
        <Icon name="up" stroke size={22} />
      </button>
    </footer>
  );
}

/* ============================================================
   App
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("home");

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: id === "home" ? 0 : y, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const on = () => {
      let cur = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="app" dir="rtl" lang="fa">
      <style>{CSS}</style>
      <Header active={active} onNav={scrollTo} />
      <main>
        <Hero />
        <Carousel />
        <Services />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer onNav={scrollTo} />
      <TelegramButton />
    </div>
  );
}

/* ============================================================
   Styles (self-contained, no Tailwind dependency)
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');

.app{
  --blue-600:#1d4ed8; --blue-700:#1e40af; --blue-900:#0b1f6b; --brand:#0D30B4;
  --red:#A20515; --red-600:#dc2626;
  --ink:#0b1437; --muted:#52608a; --bg:#f1f4fc; --card:rgba(255,255,255,.72);
  font-family:'Vazirmatn',Tahoma,sans-serif; color:var(--ink); background:var(--bg);
  line-height:1.8; -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
.app *{box-sizing:border-box}
.app button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
.app a{color:inherit;text-decoration:none}
.app ul{list-style:none;margin:0;padding:0}
.app h1,.app h2,.app h3,.app h4,.app p{margin:0}
.container{width:min(1180px,92%);margin-inline:auto}

.glass{background:var(--card);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);
  border:1px solid rgba(255,255,255,.55);box-shadow:0 10px 40px rgba(13,48,180,.12)}
.glass-dark{background:rgba(8,18,64,.9);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 60px rgba(0,0,0,.4);color:#fff}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.65rem 1.2rem;border-radius:14px;font-weight:700;font-size:.95rem;transition:.25s;white-space:nowrap}
.btn:hover{transform:translateY(-2px)}
.btn-red{background:linear-gradient(135deg,var(--red-600),var(--red));color:#fff;box-shadow:0 8px 24px rgba(162,5,21,.4)}
.btn-blue{background:linear-gradient(135deg,var(--blue-600),var(--brand));color:#fff;box-shadow:0 8px 24px rgba(13,48,180,.35)}
.btn-glass{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.4);backdrop-filter:blur(10px)}
.btn-glass:hover{background:rgba(255,255,255,.25)}
.btn-lg{padding:.95rem 1.6rem;font-size:1.02rem}
.btn.block{width:100%;white-space:normal}
.pulse{animation:pulse 2.4s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(220,38,38,.55)}70%{box-shadow:0 0 0 16px rgba(220,38,38,0)}100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}}

/* header */
.header{position:sticky;top:0;z-index:50;transition:.3s;background:rgba(255,255,255,.55);backdrop-filter:blur(14px);border-bottom:1px solid transparent}
.header.scrolled{background:rgba(255,255,255,.9);border-color:rgba(13,48,180,.12);box-shadow:0 6px 30px rgba(13,48,180,.1)}
.header-inner{display:flex;align-items:center;gap:1rem;height:72px}
.brand{display:flex;align-items:center;gap:.7rem;text-align:right}
.brand-text{display:flex;flex-direction:column;line-height:1.3}
.brand-text strong{font-size:1.25rem;font-weight:900;color:var(--brand)}
.brand-text small{display:flex;align-items:center;gap:.25rem;font-size:.68rem;color:var(--red);font-weight:600}
.logo{display:inline-flex;flex-shrink:0;filter:drop-shadow(0 4px 10px rgba(13,48,180,.35))}
.nav-desktop{display:flex;gap:.2rem;margin-inline:auto}
.nav-link{padding:.5rem .85rem;border-radius:10px;font-weight:600;font-size:.92rem;color:var(--muted);position:relative;transition:.2s}
.nav-link:hover{color:var(--brand);background:rgba(13,48,180,.07)}
.nav-link.active{color:var(--brand)}
.nav-link.active::after{content:"";position:absolute;inset-inline:.85rem;bottom:2px;height:3px;border-radius:3px;background:var(--red-600)}
.burger{display:none;margin-inline-start:auto;padding:.4rem;color:var(--brand)}
.nav-mobile{display:none}

/* hero */
.hero{position:relative;color:#fff;padding:4.5rem 0 5.5rem;overflow:hidden;isolation:isolate}
.hero-bg{position:absolute;inset:0;z-index:-2;background:
  radial-gradient(1200px 600px at 85% -10%,rgba(29,78,216,.9),transparent 60%),
  radial-gradient(900px 500px at 0% 110%,rgba(162,5,21,.55),transparent 60%),
  linear-gradient(160deg,#071045 0%,var(--blue-900) 40%,var(--brand) 100%)}
.hero-bg::after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(circle at 50% 40%,#000,transparent 75%)}
.orb{position:absolute;border-radius:50%;filter:blur(70px);z-index:-1;animation:float 9s ease-in-out infinite}
.orb-a{width:340px;height:340px;background:rgba(59,130,246,.55);top:-90px;left:6%}
.orb-b{width:300px;height:300px;background:rgba(220,38,38,.4);bottom:-90px;right:8%;animation-delay:-4s}
@keyframes float{50%{transform:translateY(30px) scale(1.08)}}
.hero-inner{display:grid;grid-template-columns:1.5fr 1fr;gap:3rem;align-items:center}
.badge{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem 1rem;border-radius:99px;font-size:.85rem;font-weight:600;margin-bottom:1.2rem;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.3)!important;box-shadow:none!important;color:#fff}
.hero h1{font-size:clamp(1.9rem,4.2vw,3.3rem);font-weight:900;line-height:1.5;margin-bottom:1.2rem}
.hero h1 .sep{color:#fb7185;margin-inline:.3rem}
.grad{background:linear-gradient(90deg,#fff,#bfd2ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{font-size:1.08rem;color:rgba(255,255,255,.88);max-width:640px;margin-bottom:1.8rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:.9rem;margin-bottom:2rem}
.hero-stats{display:flex;flex-wrap:wrap;gap:1.6rem}
.hero-stats li{display:flex;flex-direction:column;padding-inline-start:.9rem;border-inline-start:3px solid var(--red-600)}
.hero-stats b{font-size:1.05rem}
.hero-stats span{font-size:.8rem;color:rgba(255,255,255,.72)}
.hero-card{padding:2rem;border-radius:26px;text-align:center;color:#fff;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.28);box-shadow:0 30px 80px rgba(0,0,0,.35)}
.hero-card-head{display:inline-flex;align-items:center;gap:.5rem;font-size:.85rem;background:rgba(255,255,255,.12);padding:.25rem .9rem;border-radius:99px;margin-bottom:1rem}
.live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:live 1.8s infinite;margin-inline-end:.35rem}
.hero-card-head .live-dot{margin:0}
@keyframes live{70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
.hero-card h3{font-size:1.5rem;font-weight:800;margin-bottom:.3rem}
.hero-card p{font-size:.92rem;margin:0 auto 1.2rem}
.big-phone{display:block;font-size:2rem;font-weight:900;letter-spacing:1px;padding:.7rem;border-radius:16px;background:linear-gradient(135deg,var(--red-600),var(--red));box-shadow:0 10px 30px rgba(162,5,21,.5);transition:.25s}
.big-phone:hover{transform:scale(1.03)}
.mini-phone{display:block;margin-top:.9rem;color:rgba(255,255,255,.8);font-size:.92rem}

/* sections */
.section{padding:5rem 0;position:relative}
.section-head{text-align:center;margin-bottom:2.8rem}
.kicker{display:inline-block;color:var(--red-600);font-weight:800;font-size:.85rem;letter-spacing:.5px;margin-bottom:.3rem}
.section-head h2{font-size:clamp(1.6rem,3vw,2.3rem);font-weight:900;color:var(--brand)}
.section-head p{color:var(--muted);margin-top:.5rem}
.bar{display:block;width:70px;height:5px;border-radius:5px;margin:1rem auto 0;background:linear-gradient(90deg,var(--brand) 60%,var(--red-600) 60%)}
.about-text .section-head{text-align:right}
.about-text .bar{margin-inline:0}

/* carousel */
.featured{background:linear-gradient(180deg,#fff,var(--bg))}
.carousel{position:relative;border-radius:28px;overflow:hidden;padding:0}
.viewport{overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;direction:ltr}
.viewport:active{cursor:grabbing}
.track{display:flex;will-change:transform}
.slide{flex:0 0 100%;display:grid;grid-template-columns:1.2fr 1fr;min-height:420px;direction:rtl}
.slide-img{position:relative;overflow:hidden;background:#dbe4ff}
.slide-img img,.slide-img .img-fallback{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.slide-img::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,31,107,.0),rgba(11,31,107,.35))}
.slide-num{position:absolute;bottom:1rem;right:1rem;z-index:2;color:#fff;font-weight:800;background:rgba(0,0,0,.45);padding:.2rem .8rem;border-radius:99px;font-size:.85rem;backdrop-filter:blur(6px)}
.slide-body{padding:2.4rem;display:flex;flex-direction:column;justify-content:center;gap:1rem;align-items:flex-start}
.slide-body h3{font-size:1.6rem;font-weight:900;color:var(--brand);line-height:1.6}
.slide-body p{color:var(--muted)}
.tag{display:inline-flex;align-items:center;gap:.3rem;font-size:.82rem;font-weight:700;color:var(--red);background:rgba(162,5,21,.09);border:1px solid rgba(162,5,21,.2);padding:.2rem .8rem;border-radius:99px}
.tag.small{font-size:.72rem;background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.35);backdrop-filter:blur(6px)}
.arrow{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:var(--brand);background:rgba(255,255,255,.9);box-shadow:0 8px 24px rgba(0,0,0,.2);transition:.2s;z-index:3}
.arrow:hover{background:var(--brand);color:#fff}
.arrow-l{left:14px}.arrow-r{right:14px}
.dots{position:absolute;bottom:14px;left:0;right:0;display:flex;justify-content:center;gap:.5rem;z-index:3}
.dot{width:10px;height:10px;border-radius:10px;background:rgba(13,48,180,.3);transition:.3s}
.dot.on{width:30px;background:var(--red-600)}

/* services */
.services{background:var(--bg)}
.grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem}
.card{border-radius:24px;padding:2rem 1.6rem}
.service{position:relative;overflow:hidden;transition:.3s}
.service:hover{transform:translateY(-8px);box-shadow:0 24px 60px rgba(13,48,180,.22)}
.service::before{content:"";position:absolute;top:0;right:0;left:0;height:5px;background:linear-gradient(90deg,var(--brand),var(--red-600))}
.service-no{position:absolute;top:1rem;left:1.2rem;font-size:3rem;font-weight:900;color:rgba(13,48,180,.07)}
.service-icon{width:68px;height:68px;border-radius:20px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--blue-600),var(--brand));box-shadow:0 10px 26px rgba(13,48,180,.35);margin-bottom:1.1rem}
.service:nth-child(2n) .service-icon{background:linear-gradient(135deg,var(--red-600),var(--red));box-shadow:0 10px 26px rgba(162,5,21,.35)}
.service h3{font-size:1.1rem;font-weight:800;color:var(--brand);margin-bottom:.5rem;line-height:1.7}
.service p{color:var(--muted);font-size:.92rem;margin-bottom:1rem}
.service li{display:flex;gap:.5rem;align-items:flex-start;font-size:.9rem;padding:.25rem 0}
.service li svg{flex-shrink:0;margin-top:.35rem;color:var(--red-600)}

/* gallery */
.gallery{background:linear-gradient(180deg,var(--bg),#e5ebfb)}
.tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;margin-bottom:2rem}
.tab{padding:.6rem 1.2rem;border-radius:99px;font-weight:700;font-size:.88rem;background:rgba(255,255,255,.8);border:1px solid rgba(13,48,180,.15);color:var(--muted);transition:.25s}
.tab:hover{color:var(--brand);border-color:var(--brand)}
.tab.on{background:linear-gradient(135deg,var(--blue-600),var(--brand));color:#fff;border-color:transparent;box-shadow:0 8px 22px rgba(13,48,180,.35)}
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.3rem}
.g-card{position:relative;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(13,48,180,.18);transition:.35s;animation:pop .45s both;background:#cfd9ff;display:block;width:100%;text-align:right}
.g-card:hover{transform:translateY(-6px);box-shadow:0 24px 50px rgba(13,48,180,.32)}
@keyframes pop{from{opacity:0;transform:scale(.94) translateY(10px)}}
.g-card img,.g-card .img-fallback{width:100%;height:100%;object-fit:cover;transition:.6s;display:block}
.g-card:hover img{transform:scale(1.1)}
.g-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(7,16,69,.92))}
.g-info{position:absolute;z-index:2;bottom:0;right:0;left:0;padding:1rem;color:#fff;display:flex;flex-direction:column;gap:.4rem;align-items:flex-start}
.g-info strong{font-size:.98rem;line-height:1.6}
.g-zoom{position:absolute;z-index:3;top:12px;left:12px;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;background:rgba(162,5,21,.85);opacity:0;transform:scale(.6);transition:.3s}
.g-card:hover .g-zoom{opacity:1;transform:scale(1)}
.empty{grid-column:1/-1;text-align:center;color:var(--muted)}
.img-fallback{display:grid;place-items:center;background:linear-gradient(135deg,var(--blue-700),var(--brand));color:rgba(255,255,255,.7);min-height:100%}

/* lightbox */
.lightbox{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:1rem;background:rgba(3,8,32,.82);backdrop-filter:blur(12px);animation:fade .25s}
@keyframes fade{from{opacity:0}}
.lb-box{position:relative;width:min(960px,100%);max-height:94vh;overflow:auto;border-radius:26px;background:rgba(255,255,255,.96);animation:pop .35s}
.lb-close{position:absolute;top:12px;left:12px;z-index:3;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;background:rgba(0,0,0,.55)}
.lb-close:hover{background:var(--red)}
.lb-img{max-height:56vh;background:#0b1437;display:grid;place-items:center}
.lb-img img,.lb-img .img-fallback{width:100%;max-height:56vh;object-fit:contain;display:block;min-height:260px}
.lb-body{padding:1.6rem 2rem 2rem;display:flex;flex-direction:column;gap:.8rem;align-items:flex-start}
.lb-body h3{font-size:1.4rem;font-weight:900;color:var(--brand)}
.lb-body p{color:var(--muted)}
.lb-body .lb-contact{color:var(--brand);font-weight:800;font-size:1.05rem;line-height:2}

/* about */
.about{background:#fff}
.about-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:3rem;align-items:center}
.about-visual{border-radius:28px;padding:2.5rem 2rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.5rem;background:linear-gradient(160deg,var(--blue-900),var(--brand));color:#fff;border:0}
.about-visual .logo{transform:scale(1.6);margin:1rem 0 1.2rem}
.about-visual h3{font-size:1.8rem;font-weight:900}
.about-visual p{opacity:.8}
.company{margin-top:1.2rem;width:100%;padding:1rem;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);display:flex;flex-direction:column}
.company b{font-size:1.25rem}.company small{opacity:.8}
.about-text p{color:var(--muted);margin-bottom:1rem}
.about-list{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-top:1.2rem}
.about-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.9rem;border-radius:16px;background:var(--bg);font-weight:600;font-size:.92rem}
.tick{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--red-600);color:#fff}

/* contact */
.contact{background:linear-gradient(180deg,#fff,#e8eeff)}
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:1.6rem}
.emergency{display:flex;flex-direction:column;gap:1rem;border-top:6px solid var(--red-600)}
.emergency h3{display:flex;gap:.5rem;align-items:center;color:var(--red);font-weight:900;font-size:1.2rem}
.phone-row{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.2rem;border-radius:16px;background:#fff;border:1px solid rgba(13,48,180,.15);transition:.25s}
.phone-row b{font-size:1.25rem;color:var(--brand)}
.phone-row span{color:var(--muted);font-size:.9rem}
.phone-row:hover{border-color:var(--red-600);transform:translateX(-4px)}
.phone-row.main{background:linear-gradient(135deg,var(--red-600),var(--red));border:0}
.phone-row.main b,.phone-row.main span{color:#fff}
.tg-numbers{display:flex;flex-direction:column;gap:.3rem;font-size:.85rem;color:var(--muted);text-align:center}
.tg-numbers a:hover{color:var(--brand);text-decoration:underline}
.info-row{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.3rem}
.info-ico{flex-shrink:0;width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#fff;background:var(--brand)}
.info-ico.red{background:var(--red)}
.info-row small{color:var(--muted);font-weight:600}
.info-row p{font-weight:700}
.map{width:100%;height:230px;border:0;border-radius:18px;margin-top:.4rem}

/* footer */
.footer{background:linear-gradient(180deg,#071045,#040a2b);color:rgba(255,255,255,.82);padding-top:3.5rem;position:relative}
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1.2fr;gap:2.5rem;padding-bottom:2.5rem}
.footer-brand{display:flex;align-items:center;gap:.7rem;font-size:1.3rem;color:#fff;margin-bottom:.8rem}
.footer p{font-size:.92rem;margin-bottom:1rem}
.footer h4{color:#fff;font-weight:800;margin-bottom:1rem;position:relative;padding-bottom:.6rem}
.footer h4::after{content:"";position:absolute;bottom:0;right:0;width:36px;height:3px;background:var(--red-600);border-radius:3px}
.footer li{padding:.2rem 0;font-size:.92rem}
.footer li button,.footer li a{color:inherit;transition:.2s}
.footer li button:hover,.footer li a:hover{color:#fff;padding-inline-start:.4rem}
.socials{display:flex;gap:.6rem}
.socials a{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.08);transition:.25s}
.socials a:hover{background:var(--red-600);transform:translateY(-3px)}
.copy{border-top:1px solid rgba(255,255,255,.1);padding:1.1rem 0;text-align:center;font-size:.82rem;color:rgba(255,255,255,.6)}
.to-top{position:fixed;bottom:24px;left:24px;z-index:60;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--blue-600),var(--brand));box-shadow:0 10px 30px rgba(13,48,180,.5);opacity:0;pointer-events:none;transform:translateY(20px);transition:.3s}
.to-top.show{opacity:1;pointer-events:auto;transform:none}
.to-top:hover{background:var(--red)}

/* telegram button */
.app .tg-fab{position:fixed;bottom:24px;right:24px;z-index:70;display:flex;align-items:center;gap:.6rem;padding:.9rem 1.2rem;border-radius:99px;color:#fff;font-weight:700;background:linear-gradient(135deg,var(--red-600),var(--red));box-shadow:0 12px 34px rgba(162,5,21,.55);transition:.25s}
.app .tg-fab:hover{transform:translateY(-3px) scale(1.03)}
.fab-label{font-size:.88rem}

/* responsive */
@media(max-width:1000px){
  .nav-desktop,.header-call{display:none}
  .burger{display:block}
  .nav-mobile{display:flex;flex-direction:column;gap:.3rem;padding:0 4%;max-height:0;overflow:hidden;transition:.35s;background:rgba(255,255,255,.97)}
  .nav-mobile.open{max-height:520px;padding:.8rem 4% 1.2rem;border-bottom:1px solid rgba(13,48,180,.12)}
  .nav-mobile .nav-link{text-align:right}
  .hero-inner{grid-template-columns:1fr}
  .about-grid,.contact-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:720px){
  .slide{grid-template-columns:1fr}
  .slide-img{height:230px}
  .slide-body{padding:1.5rem}
  .arrow{width:38px;height:38px}
  .about-list{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr}
  .section{padding:3.5rem 0}
  .fab-label{display:none}
  .app .tg-fab{padding:.95rem}
  .hero{padding:3rem 0 4rem}
}
@media(prefers-reduced-motion:reduce){.app *{animation:none!important;transition:none!important}}
`;
