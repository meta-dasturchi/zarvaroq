/* =====================================================================
   ZARVARAQ — translations.js
   Uch til: UZ (o'zbek), EN (ingliz), RU (rus).
   - HTML ichida: data-i18n="kalit"           → textContent
                  data-i18n-placeholder="kalit" → placeholder
                  data-i18n-aria="kalit"        → aria-label
   - JS ichida:   ZV.i18n.t("kalit", { n: 5 })
   Tanlangan til localStorage("zv_lang") da saqlanadi.
   ===================================================================== */
(function (root) {
  "use strict";

  var T = {
    uz: {
      "meta.title": "ZARVARAQ — premium onlayn kitob do‘koni",
      "brand.tagline": "Kitob — eng yaxshi sarmoya",

      "nav.home": "Bosh sahifa",
      "nav.all": "Barcha kitoblar",
      "nav.categories": "Kategoriyalar",
      "nav.bestsellers": "Bestsellerlar",
      "nav.new": "Yangi kitoblar",
      "nav.about": "Biz haqimizda",
      "nav.contact": "Aloqa",
      "nav.menu": "Menyu",
      "nav.search": "Qidirish",
      "nav.cart": "Savatcha",
      "nav.theme": "Tun/kun rejimi",
      "nav.language": "Til",
      "nav.login": "Kirish",
      "nav.account": "Hisob",

      "hero.badge": "Yangi mavsum — 270+ kitob",
      "hero.title1": "Har bir varaqda",
      "hero.title2": "yangi olam",
      "hero.text": "O‘zbek va jahon adabiyoti, biznes, IT, psixologiya va bolalar kitoblari — O‘zbekiston bo‘ylab tez yetkazib berish bilan.",
      "hero.cta": "Kitoblarni ko‘rish",
      "hero.cta2": "Bestsellerlar",
      "hero.stat1": "kitob",
      "hero.stat2": "kategoriya",
      "hero.stat3": "viloyatga yetkazish",

      "sec.popular": "Mashhur kitoblar",
      "sec.popularSub": "Kitobxonlar eng ko‘p tanlayotgan asarlar",
      "sec.bestsellers": "Bestsellerlar",
      "sec.bestsellersSub": "Vaqt sinovidan o‘tgan, eng ko‘p sotilgan kitoblar",
      "sec.new": "Yangi kelgan kitoblar",
      "sec.newSub": "Javonlarimizga yaqinda kelgan nashrlar",
      "sec.categories": "Kitob kategoriyalari",
      "sec.categoriesSub": "O‘zingizga yoqqan yo‘nalishni tanlang",
      "sec.discounts": "Chegirmadagi kitoblar",
      "sec.discountsSub": "Cheklangan muddatli maxsus narxlar",
      "sec.why": "Nega bizni tanlashadi?",
      "sec.testimonials": "Mijozlar fikrlari",
      "sec.viewAll": "Barchasini ko‘rish",
      "sec.booksCount": "{n} ta kitob",

      "why.1t": "Original nashrlar",
      "why.1d": "Faqat ishonchli nashriyotlar va rasmiy distribyutorlardan.",
      "why.2t": "Tez yetkazib berish",
      "why.2d": "Toshkent bo‘ylab 24 soatda, viloyatlarga 2–4 kunda.",
      "why.3t": "Qulay to‘lov",
      "why.3d": "Kitobni qo‘lingizga olganda naqd yoki karta orqali to‘lang.",
      "why.4t": "Mutaxassis maslahati",
      "why.4d": "Kitob tanlashda kutubxonachilarimiz yordam beradi.",

      "test.1": "Buyurtma ertasi kuniyoq keldi, kitoblar juda chiroyli qadoqlangan edi. Endi faqat ZARVARAQdan olaman.",
      "test.1n": "Dilnoza R.",
      "test.1r": "Toshkent",
      "test.2": "IT bo‘yicha kerakli kitoblarni boshqa joydan topolmagandim. Bu yerda hammasi bor ekan.",
      "test.2n": "Jasur T.",
      "test.2r": "Samarqand",
      "test.3": "Bolalarim uchun ertak kitoblar oldim — sifati a’lo, narxlari ham hamyonbop.",
      "test.3n": "Madina A.",
      "test.3r": "Farg‘ona",

      "news.title": "Yangi kitoblardan birinchi bo‘lib xabardor bo‘ling",
      "news.text": "Haftalik tavsiyalar, chegirmalar va yangi kelgan kitoblar — to‘g‘ridan-to‘g‘ri pochtangizga.",
      "news.placeholder": "Email manzilingiz",
      "news.button": "Obuna bo‘lish",
      "news.success": "Obuna uchun rahmat! Endi yangiliklarni birinchi bo‘lib olasiz.",
      "news.invalid": "Iltimos, to‘g‘ri email manzil kiriting.",

      "cat.fiction": "Badiiy adabiyot",
      "cat.detective": "Detektiv",
      "cat.scifi": "Fantastika",
      "cat.history": "Tarixiy kitoblar",
      "cat.psychology": "Psixologiya",
      "cat.business": "Biznes va moliya",
      "cat.it": "Dasturlash va IT",
      "cat.selfdev": "Shaxsiy rivojlanish",
      "cat.kids": "Bolalar adabiyoti",
      "cat.science": "Ilmiy kitoblar",
      "cat.philosophy": "Falsafa",
      "cat.world": "Jahon adabiyoti",
      "cat.religion": "Diniy-ma’rifiy",
      "cat.education": "Ta’lim va darsliklar",
      "cat.biography": "Biografiya",
      "cat.all": "Barcha kategoriyalar",

      "catalog.title": "Kitoblar katalogi",
      "catalog.sub": "Qidiring, saralang va o‘zingizga mos kitobni toping",
      "catalog.search": "Kitob nomi, muallif yoki kategoriya...",
      "catalog.category": "Kategoriya",
      "catalog.sort": "Saralash",
      "catalog.priceFrom": "Narx (dan)",
      "catalog.priceTo": "Narx (gacha)",
      "catalog.reset": "Tozalash",
      "catalog.found": "{n} ta kitob topildi",
      "catalog.none": "Hech narsa topilmadi",
      "catalog.noneText": "Boshqa so‘z bilan qidirib ko‘ring yoki filtrlarni tozalang.",
      "catalog.more": "Yana ko‘rsatish",
      "catalog.filters": "Filtrlar",

      "filter.all": "Barcha kitoblar",
      "filter.popular": "Eng mashhurlari",
      "filter.newest": "Eng yangilari",
      "filter.cheap": "Eng arzonlari",
      "filter.expensive": "Eng qimmatlari",
      "filter.rating": "Reytingi yuqorilari",
      "filter.discount": "Chegirmadagilar",
      "filter.bestseller": "Bestsellerlar",
      "filter.new": "Yangi kelganlar",

      "book.by": "Muallif",
      "book.author": "Muallif",
      "book.pages": "Sahifalar",
      "book.language": "Kitob tili",
      "book.year": "Nashr yili",
      "book.rating": "Reyting",
      "book.reviews": "{n} ta baho",
      "book.stock": "Omborda",
      "book.inStock": "{n} dona mavjud",
      "book.outOfStock": "Sotuvda yo‘q",
      "book.category": "Kategoriya",
      "book.id": "Kitob ID",
      "book.bestseller": "Bestseller",
      "book.new": "Yangi",
      "book.details": "Batafsil",
      "book.add": "Savatchaga",
      "book.addFull": "Savatchaga qo‘shish",
      "book.buy": "Xarid qilish",
      "book.about": "Kitob haqida",
      "book.similar": "O‘xshash kitoblar",
      "book.bc": "mil. av. {n}",
      "lang.uz": "O‘zbek",
      "lang.en": "Ingliz",
      "lang.ru": "Rus",
      "currency": "so‘m",
      "pcs": "dona",

      "cart.title": "Savatcha",
      "cart.empty": "Savatchangiz bo‘sh",
      "cart.emptyText": "Katalogdan o‘zingizga yoqqan kitoblarni qo‘shing.",
      "cart.browse": "Katalogga o‘tish",
      "cart.items": "Mahsulotlar",
      "cart.total": "Jami",
      "cart.delivery": "Yetkazib berish",
      "cart.deliveryFree": "Bepul",
      "cart.clear": "Savatchani tozalash",
      "cart.checkout": "Buyurtma berish",
      "cart.remove": "O‘chirish",
      "cart.increase": "Ko‘paytirish",
      "cart.decrease": "Kamaytirish",
      "cart.added": "«{t}» savatchaga qo‘shildi",
      "cart.removed": "Kitob savatchadan o‘chirildi",
      "cart.cleared": "Savatcha tozalandi",
      "cart.confirmRemove": "Bu kitobni savatchadan o‘chirasizmi?",
      "cart.confirmClear": "Savatchadagi barcha kitoblarni o‘chirasizmi?",
      "cart.maxStock": "Omborda faqat {n} dona mavjud",
      "cart.outOfStock": "Bu kitob hozircha sotuvda yo‘q",
      "cart.each": "dona narxi",

      "confirm.yes": "Ha, o‘chirish",
      "confirm.no": "Bekor qilish",
      "confirm.title": "Tasdiqlang",

      "co.title": "Buyurtmani rasmiylashtirish",
      "co.contact": "Aloqa ma’lumotlari",
      "co.delivery": "Yetkazib berish manzili",
      "co.fullName": "Ism va familiya",
      "co.fullNamePh": "Masalan: Aziz Karimov",
      "co.phone": "Telefon raqami",
      "co.region": "Viloyat",
      "co.regionPh": "Viloyatni tanlang",
      "co.district": "Tuman yoki shahar",
      "co.districtPh": "Masalan: Chilonzor tumani",
      "co.address": "Manzil",
      "co.addressPh": "Ko‘cha, uy, xonadon raqami",
      "co.comment": "Qo‘shimcha izoh",
      "co.commentPh": "Kuryer uchun izoh (ixtiyoriy)",
      "co.summary": "Buyurtma tarkibi",
      "co.confirm": "Buyurtmani tasdiqlash",
      "co.sending": "Yuborilmoqda...",
      "co.payNote": "To‘lov kitobni qabul qilganda amalga oshiriladi.",
      "co.successTitle": "Buyurtmangiz qabul qilindi!",
      "co.successText": "Operatorimiz tez orada siz bilan bog‘lanadi.",
      "co.orderNo": "Buyurtma raqami",
      "co.done": "Yaxshi",
      "co.err.name": "Ism va familiyani to‘liq kiriting (kamida 2 ta so‘z).",
      "co.err.phone": "Telefon raqami noto‘g‘ri. Format: +998 90 123 45 67",
      "co.err.region": "Viloyatni tanlang.",
      "co.err.district": "Tuman yoki shaharni kiriting.",
      "co.err.address": "Manzilni to‘liqroq kiriting (kamida 5 belgi).",
      "co.err.comment": "Izoh juda uzun (maksimum 500 belgi).",
      "co.err.empty": "Savatcha bo‘sh — buyurtma berib bo‘lmaydi.",

      "err.network": "Server bilan aloqa yo‘q. Internetni tekshirib, qayta urinib ko‘ring.",
      "err.server": "Serverda xatolik yuz berdi. Birozdan so‘ng qayta urinib ko‘ring.",
      "err.rate": "Juda ko‘p urinish. Iltimos, {n} daqiqadan so‘ng qayta urinib ko‘ring.",
      "err.duplicate": "Bu buyurtma allaqachon yuborilgan. Operator siz bilan bog‘lanadi.",
      "err.validation": "Ma’lumotlarda xatolik bor. Iltimos, tekshirib qayta yuboring.",
      "err.stock": "Ba’zi kitoblar omborda yetarli emas. Savatchani yangilang.",
      "err.notConfigured": "Do‘kon hali Telegram bilan ulanmagan. Administrator bilan bog‘laning.",
      "err.localFile": "Buyurtma faqat Netlify’da (yoki «netlify dev» orqali) ishlaydi. Faylni to‘g‘ridan-to‘g‘ri ochganda server funksiyasi mavjud emas.",

      "auth.login": "Kirish",
      "auth.register": "Ro‘yxatdan o‘tish",
      "auth.loginTitle": "Hisobingizga kiring",
      "auth.registerTitle": "Yangi hisob yaratish",
      "auth.firstName": "Ism",
      "auth.lastName": "Familiya",
      "auth.email": "Email",
      "auth.phone": "Telefon raqami",
      "auth.password": "Parol",
      "auth.password2": "Parolni tasdiqlang",
      "auth.login_id": "Email yoki telefon",
      "auth.submitLogin": "Kirish",
      "auth.submitRegister": "Ro‘yxatdan o‘tish",
      "auth.haveAccount": "Hisobingiz bormi?",
      "auth.noAccount": "Hisobingiz yo‘qmi?",
      "auth.logout": "Chiqish",
      "auth.hello": "Salom, {n}!",
      "auth.welcome": "Xush kelibsiz, {n}!",
      "auth.registered": "Ro‘yxatdan muvaffaqiyatli o‘tdingiz!",
      "auth.loggedOut": "Hisobdan chiqdingiz",
      "auth.pwHint": "Kamida 8 belgi, harf va raqam bo‘lsin",
      "auth.demo": "DEMO REJIM: server autentifikatsiyasi ulanmagan. Ma’lumotlar faqat shu brauzerda saqlanadi (parol SHA-256 + salt bilan xeshlanadi). Haqiqiy hisob uchun saytni Netlify’ga joylang.",
      "auth.secure": "Xavfsiz ulanish: parollar serverda scrypt bilan xeshlanadi.",
      "auth.err.firstName": "Ismni kiriting (2–40 belgi).",
      "auth.err.lastName": "Familiyani kiriting (2–40 belgi).",
      "auth.err.email": "Email manzil noto‘g‘ri.",
      "auth.err.phone": "Telefon raqami noto‘g‘ri. Format: +998 90 123 45 67",
      "auth.err.password": "Parol kamida 8 belgi bo‘lib, harf va raqamdan iborat bo‘lsin.",
      "auth.err.password2": "Parollar mos kelmadi.",
      "auth.err.loginId": "Email yoki telefon raqamini kiriting.",
      "auth.err.required": "Parolni kiriting.",
      "auth.err.exists": "Bu email yoki telefon bilan hisob allaqachon mavjud.",
      "auth.err.invalid": "Login yoki parol noto‘g‘ri.",
      "auth.err.rate": "Juda ko‘p urinish. Birozdan so‘ng qayta urining.",

      "about.title": "Biz haqimizda",
      "about.lead": "ZARVARAQ — kitobni sevuvchilar tomonidan, kitobni sevuvchilar uchun yaratilgan do‘kon.",
      "about.p1": "Biz 2026-yilda bitta maqsad bilan ish boshladik: O‘zbekistonning istalgan burchagidagi kitobxonga sifatli kitobni tez va qulay yetkazish. «Zarvaraq» — oltin varaq degani. Har bir kitob kimningdir hayotida oltin sahifa bo‘lishiga ishonamiz.",
      "about.p2": "Katalogimizda o‘zbek mumtoz adabiyotidan tortib zamonaviy dasturlash qo‘llanmalarigacha bo‘lgan 270 dan ortiq nom bor. Har bir kitobni jamoamiz shaxsan tanlaydi.",
      "about.s1": "mamnun mijoz",
      "about.s2": "yetkazilgan kitob",
      "about.s3": "o‘rtacha reyting",

      "contact.title": "Aloqa",
      "contact.lead": "Savollaringiz bormi? Biz har kuni 9:00 dan 21:00 gacha aloqadamiz.",
      "contact.phone": "Telefon",
      "contact.email": "Email",
      "contact.address": "Manzil",
      "contact.addressVal": "Toshkent sh., Amir Temur ko‘chasi, 1-uy",
      "contact.hours": "Ish vaqti",
      "contact.hoursVal": "Har kuni, 9:00 – 21:00",
      "contact.telegram": "Telegram orqali yozish",

      "footer.about": "Premium onlayn kitob do‘koni. O‘zbek va jahon adabiyoti, ilmiy va ta’limiy nashrlar — butun O‘zbekiston bo‘ylab yetkazib berish bilan.",
      "footer.links": "Foydali havolalar",
      "footer.categories": "Kategoriyalar",
      "footer.contact": "Aloqa",
      "footer.rights": "Barcha huquqlar himoyalangan.",
      "footer.made": "Mehr bilan yaratilgan",

      "toast.theme.dark": "Tungi rejim yoqildi",
      "toast.theme.light": "Kunduzgi rejim yoqildi",
      "toast.lang": "Til o‘zgartirildi",
      "loading": "Yuklanmoqda...",
      "close": "Yopish",
      "notFound": "Sahifa topilmadi",

      "region.tashkent_city": "Toshkent shahri",
      "region.tashkent": "Toshkent viloyati",
      "region.andijan": "Andijon viloyati",
      "region.bukhara": "Buxoro viloyati",
      "region.fergana": "Farg‘ona viloyati",
      "region.jizzakh": "Jizzax viloyati",
      "region.khorezm": "Xorazm viloyati",
      "region.namangan": "Namangan viloyati",
      "region.navoi": "Navoiy viloyati",
      "region.kashkadarya": "Qashqadaryo viloyati",
      "region.samarkand": "Samarqand viloyati",
      "region.sirdarya": "Sirdaryo viloyati",
      "region.surkhandarya": "Surxondaryo viloyati",
      "region.karakalpakstan": "Qoraqalpog‘iston Respublikasi"
    },

    en: {
      "meta.title": "ZARVARAQ — premium online bookstore",
      "brand.tagline": "A book is the best investment",

      "nav.home": "Home",
      "nav.all": "All books",
      "nav.categories": "Categories",
      "nav.bestsellers": "Bestsellers",
      "nav.new": "New arrivals",
      "nav.about": "About us",
      "nav.contact": "Contact",
      "nav.menu": "Menu",
      "nav.search": "Search",
      "nav.cart": "Cart",
      "nav.theme": "Dark/light mode",
      "nav.language": "Language",
      "nav.login": "Sign in",
      "nav.account": "Account",

      "hero.badge": "New season — 270+ books",
      "hero.title1": "A new world",
      "hero.title2": "on every page",
      "hero.text": "Uzbek and world literature, business, IT, psychology and children's books — with fast delivery across Uzbekistan.",
      "hero.cta": "Browse books",
      "hero.cta2": "Bestsellers",
      "hero.stat1": "books",
      "hero.stat2": "categories",
      "hero.stat3": "regions served",

      "sec.popular": "Popular books",
      "sec.popularSub": "The titles readers choose most",
      "sec.bestsellers": "Bestsellers",
      "sec.bestsellersSub": "Time-tested, best-selling books",
      "sec.new": "New arrivals",
      "sec.newSub": "Editions that just reached our shelves",
      "sec.categories": "Book categories",
      "sec.categoriesSub": "Pick the genre you love",
      "sec.discounts": "Books on sale",
      "sec.discountsSub": "Special prices for a limited time",
      "sec.why": "Why readers choose us",
      "sec.testimonials": "What customers say",
      "sec.viewAll": "View all",
      "sec.booksCount": "{n} books",

      "why.1t": "Original editions",
      "why.1d": "Only from trusted publishers and official distributors.",
      "why.2t": "Fast delivery",
      "why.2d": "Within 24 hours in Tashkent, 2–4 days to the regions.",
      "why.3t": "Easy payment",
      "why.3d": "Pay in cash or by card when the book is in your hands.",
      "why.4t": "Expert advice",
      "why.4d": "Our librarians help you choose the right book.",

      "test.1": "My order arrived the next day, beautifully packed. From now on I only buy from ZARVARAQ.",
      "test.1n": "Dilnoza R.",
      "test.1r": "Tashkent",
      "test.2": "I couldn't find the IT books I needed anywhere else. Everything is here.",
      "test.2n": "Jasur T.",
      "test.2r": "Samarkand",
      "test.3": "I bought fairy-tale books for my kids — excellent quality and fair prices.",
      "test.3n": "Madina A.",
      "test.3r": "Fergana",

      "news.title": "Be the first to hear about new books",
      "news.text": "Weekly picks, discounts and new arrivals — straight to your inbox.",
      "news.placeholder": "Your email address",
      "news.button": "Subscribe",
      "news.success": "Thanks for subscribing! You'll hear the news first.",
      "news.invalid": "Please enter a valid email address.",

      "cat.fiction": "Fiction",
      "cat.detective": "Detective",
      "cat.scifi": "Science fiction & fantasy",
      "cat.history": "History",
      "cat.psychology": "Psychology",
      "cat.business": "Business & finance",
      "cat.it": "Programming & IT",
      "cat.selfdev": "Self-development",
      "cat.kids": "Children's books",
      "cat.science": "Science",
      "cat.philosophy": "Philosophy",
      "cat.world": "World literature",
      "cat.religion": "Religion & enlightenment",
      "cat.education": "Education & textbooks",
      "cat.biography": "Biography",
      "cat.all": "All categories",

      "catalog.title": "Book catalog",
      "catalog.sub": "Search, sort and find the book that fits you",
      "catalog.search": "Title, author or category...",
      "catalog.category": "Category",
      "catalog.sort": "Sort by",
      "catalog.priceFrom": "Price (from)",
      "catalog.priceTo": "Price (to)",
      "catalog.reset": "Reset",
      "catalog.found": "{n} books found",
      "catalog.none": "Nothing found",
      "catalog.noneText": "Try a different keyword or reset the filters.",
      "catalog.more": "Show more",
      "catalog.filters": "Filters",

      "filter.all": "All books",
      "filter.popular": "Most popular",
      "filter.newest": "Newest",
      "filter.cheap": "Lowest price",
      "filter.expensive": "Highest price",
      "filter.rating": "Top rated",
      "filter.discount": "On sale",
      "filter.bestseller": "Bestsellers",
      "filter.new": "New arrivals",

      "book.by": "by",
      "book.author": "Author",
      "book.pages": "Pages",
      "book.language": "Language",
      "book.year": "Published",
      "book.rating": "Rating",
      "book.reviews": "{n} ratings",
      "book.stock": "In stock",
      "book.inStock": "{n} in stock",
      "book.outOfStock": "Out of stock",
      "book.category": "Category",
      "book.id": "Book ID",
      "book.bestseller": "Bestseller",
      "book.new": "New",
      "book.details": "Details",
      "book.add": "Add to cart",
      "book.addFull": "Add to cart",
      "book.buy": "Buy now",
      "book.about": "About the book",
      "book.similar": "Similar books",
      "book.bc": "{n} BC",
      "lang.uz": "Uzbek",
      "lang.en": "English",
      "lang.ru": "Russian",
      "currency": "UZS",
      "pcs": "pcs",

      "cart.title": "Shopping cart",
      "cart.empty": "Your cart is empty",
      "cart.emptyText": "Add books you like from the catalog.",
      "cart.browse": "Go to catalog",
      "cart.items": "Items",
      "cart.total": "Total",
      "cart.delivery": "Delivery",
      "cart.deliveryFree": "Free",
      "cart.clear": "Clear cart",
      "cart.checkout": "Checkout",
      "cart.remove": "Remove",
      "cart.increase": "Increase",
      "cart.decrease": "Decrease",
      "cart.added": "“{t}” added to cart",
      "cart.removed": "Book removed from cart",
      "cart.cleared": "Cart cleared",
      "cart.confirmRemove": "Remove this book from the cart?",
      "cart.confirmClear": "Remove all books from the cart?",
      "cart.maxStock": "Only {n} in stock",
      "cart.outOfStock": "This book is currently out of stock",
      "cart.each": "each",

      "confirm.yes": "Yes, remove",
      "confirm.no": "Cancel",
      "confirm.title": "Please confirm",

      "co.title": "Checkout",
      "co.contact": "Contact details",
      "co.delivery": "Delivery address",
      "co.fullName": "Full name",
      "co.fullNamePh": "e.g. Aziz Karimov",
      "co.phone": "Phone number",
      "co.region": "Region",
      "co.regionPh": "Select a region",
      "co.district": "District or city",
      "co.districtPh": "e.g. Chilanzar district",
      "co.address": "Address",
      "co.addressPh": "Street, building, apartment",
      "co.comment": "Additional comment",
      "co.commentPh": "Note for the courier (optional)",
      "co.summary": "Order summary",
      "co.confirm": "Confirm order",
      "co.sending": "Sending...",
      "co.payNote": "Payment is made on delivery.",
      "co.successTitle": "Your order has been placed!",
      "co.successText": "Our operator will contact you shortly.",
      "co.orderNo": "Order number",
      "co.done": "Great",
      "co.err.name": "Enter your full name (at least 2 words).",
      "co.err.phone": "Invalid phone number. Format: +998 90 123 45 67",
      "co.err.region": "Please select a region.",
      "co.err.district": "Please enter a district or city.",
      "co.err.address": "Please enter a fuller address (at least 5 characters).",
      "co.err.comment": "Comment is too long (max 500 characters).",
      "co.err.empty": "Your cart is empty — nothing to order.",

      "err.network": "Cannot reach the server. Check your connection and try again.",
      "err.server": "A server error occurred. Please try again shortly.",
      "err.rate": "Too many attempts. Please try again in {n} minutes.",
      "err.duplicate": "This order has already been sent. An operator will contact you.",
      "err.validation": "Some data is invalid. Please check and resubmit.",
      "err.stock": "Some books don't have enough stock. Please update your cart.",
      "err.notConfigured": "The store is not connected to Telegram yet. Please contact the administrator.",
      "err.localFile": "Orders only work on Netlify (or via “netlify dev”). The server function isn't available when the file is opened directly.",

      "auth.login": "Sign in",
      "auth.register": "Sign up",
      "auth.loginTitle": "Sign in to your account",
      "auth.registerTitle": "Create a new account",
      "auth.firstName": "First name",
      "auth.lastName": "Last name",
      "auth.email": "Email",
      "auth.phone": "Phone number",
      "auth.password": "Password",
      "auth.password2": "Confirm password",
      "auth.login_id": "Email or phone",
      "auth.submitLogin": "Sign in",
      "auth.submitRegister": "Sign up",
      "auth.haveAccount": "Already have an account?",
      "auth.noAccount": "Don't have an account?",
      "auth.logout": "Sign out",
      "auth.hello": "Hi, {n}!",
      "auth.welcome": "Welcome, {n}!",
      "auth.registered": "You have registered successfully!",
      "auth.loggedOut": "You have signed out",
      "auth.pwHint": "At least 8 characters with letters and digits",
      "auth.demo": "DEMO MODE: server authentication is not connected. Data is stored only in this browser (password hashed with SHA-256 + salt). Deploy to Netlify for real accounts.",
      "auth.secure": "Secure connection: passwords are hashed on the server with scrypt.",
      "auth.err.firstName": "Enter your first name (2–40 characters).",
      "auth.err.lastName": "Enter your last name (2–40 characters).",
      "auth.err.email": "Invalid email address.",
      "auth.err.phone": "Invalid phone number. Format: +998 90 123 45 67",
      "auth.err.password": "Password must be at least 8 characters with letters and digits.",
      "auth.err.password2": "Passwords do not match.",
      "auth.err.loginId": "Enter your email or phone number.",
      "auth.err.required": "Enter your password.",
      "auth.err.exists": "An account with this email or phone already exists.",
      "auth.err.invalid": "Incorrect login or password.",
      "auth.err.rate": "Too many attempts. Please try again later.",

      "about.title": "About us",
      "about.lead": "ZARVARAQ is a bookstore made by book lovers, for book lovers.",
      "about.p1": "We started in 2026 with one goal: to deliver quality books quickly and conveniently to readers anywhere in Uzbekistan. “Zarvaraq” means “golden page” — we believe every book can become a golden page in someone's life.",
      "about.p2": "Our catalog holds more than 270 titles, from Uzbek classics to modern programming guides. Every book is hand-picked by our team.",
      "about.s1": "happy customers",
      "about.s2": "books delivered",
      "about.s3": "average rating",

      "contact.title": "Contact",
      "contact.lead": "Have questions? We're available every day from 9:00 to 21:00.",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.address": "Address",
      "contact.addressVal": "1 Amir Temur street, Tashkent",
      "contact.hours": "Working hours",
      "contact.hoursVal": "Every day, 9:00 – 21:00",
      "contact.telegram": "Message us on Telegram",

      "footer.about": "Premium online bookstore. Uzbek and world literature, science and education — delivered across Uzbekistan.",
      "footer.links": "Useful links",
      "footer.categories": "Categories",
      "footer.contact": "Contact",
      "footer.rights": "All rights reserved.",
      "footer.made": "Made with love",

      "toast.theme.dark": "Dark mode on",
      "toast.theme.light": "Light mode on",
      "toast.lang": "Language changed",
      "loading": "Loading...",
      "close": "Close",
      "notFound": "Page not found",

      "region.tashkent_city": "Tashkent city",
      "region.tashkent": "Tashkent region",
      "region.andijan": "Andijan region",
      "region.bukhara": "Bukhara region",
      "region.fergana": "Fergana region",
      "region.jizzakh": "Jizzakh region",
      "region.khorezm": "Khorezm region",
      "region.namangan": "Namangan region",
      "region.navoi": "Navoi region",
      "region.kashkadarya": "Kashkadarya region",
      "region.samarkand": "Samarkand region",
      "region.sirdarya": "Sirdarya region",
      "region.surkhandarya": "Surkhandarya region",
      "region.karakalpakstan": "Republic of Karakalpakstan"
    },

    ru: {
      "meta.title": "ZARVARAQ — премиальный онлайн-магазин книг",
      "brand.tagline": "Книга — лучшая инвестиция",

      "nav.home": "Главная",
      "nav.all": "Все книги",
      "nav.categories": "Категории",
      "nav.bestsellers": "Бестселлеры",
      "nav.new": "Новинки",
      "nav.about": "О нас",
      "nav.contact": "Контакты",
      "nav.menu": "Меню",
      "nav.search": "Поиск",
      "nav.cart": "Корзина",
      "nav.theme": "Тёмная/светлая тема",
      "nav.language": "Язык",
      "nav.login": "Войти",
      "nav.account": "Аккаунт",

      "hero.badge": "Новый сезон — 270+ книг",
      "hero.title1": "Новый мир",
      "hero.title2": "на каждой странице",
      "hero.text": "Узбекская и мировая литература, бизнес, IT, психология и детские книги — с быстрой доставкой по всему Узбекистану.",
      "hero.cta": "Смотреть книги",
      "hero.cta2": "Бестселлеры",
      "hero.stat1": "книг",
      "hero.stat2": "категорий",
      "hero.stat3": "регионов доставки",

      "sec.popular": "Популярные книги",
      "sec.popularSub": "Книги, которые читатели выбирают чаще всего",
      "sec.bestsellers": "Бестселлеры",
      "sec.bestsellersSub": "Проверенные временем, самые продаваемые книги",
      "sec.new": "Новые поступления",
      "sec.newSub": "Издания, недавно появившиеся на наших полках",
      "sec.categories": "Категории книг",
      "sec.categoriesSub": "Выберите любимое направление",
      "sec.discounts": "Книги со скидкой",
      "sec.discountsSub": "Специальные цены на ограниченное время",
      "sec.why": "Почему выбирают нас?",
      "sec.testimonials": "Отзывы покупателей",
      "sec.viewAll": "Смотреть все",
      "sec.booksCount": "{n} книг",

      "why.1t": "Оригинальные издания",
      "why.1d": "Только от надёжных издательств и официальных дистрибьюторов.",
      "why.2t": "Быстрая доставка",
      "why.2d": "По Ташкенту за 24 часа, в регионы — за 2–4 дня.",
      "why.3t": "Удобная оплата",
      "why.3d": "Оплата наличными или картой при получении.",
      "why.4t": "Советы экспертов",
      "why.4d": "Наши библиотекари помогут выбрать книгу.",

      "test.1": "Заказ пришёл уже на следующий день, книги были красиво упакованы. Теперь покупаю только в ZARVARAQ.",
      "test.1n": "Дилноза Р.",
      "test.1r": "Ташкент",
      "test.2": "Нужные книги по IT я нигде не мог найти. А здесь есть всё.",
      "test.2n": "Жасур Т.",
      "test.2r": "Самарканд",
      "test.3": "Купила детям сказки — отличное качество и доступные цены.",
      "test.3n": "Мадина А.",
      "test.3r": "Фергана",

      "news.title": "Узнавайте о новинках первыми",
      "news.text": "Еженедельные подборки, скидки и новые поступления — прямо на вашу почту.",
      "news.placeholder": "Ваш email",
      "news.button": "Подписаться",
      "news.success": "Спасибо за подписку! Теперь вы узнаете новости первыми.",
      "news.invalid": "Пожалуйста, введите корректный email.",

      "cat.fiction": "Художественная литература",
      "cat.detective": "Детективы",
      "cat.scifi": "Фантастика",
      "cat.history": "История",
      "cat.psychology": "Психология",
      "cat.business": "Бизнес и финансы",
      "cat.it": "Программирование и IT",
      "cat.selfdev": "Саморазвитие",
      "cat.kids": "Детская литература",
      "cat.science": "Научные книги",
      "cat.philosophy": "Философия",
      "cat.world": "Мировая литература",
      "cat.religion": "Религиозно-просветительская",
      "cat.education": "Образование и учебники",
      "cat.biography": "Биографии",
      "cat.all": "Все категории",

      "catalog.title": "Каталог книг",
      "catalog.sub": "Ищите, сортируйте и находите подходящую книгу",
      "catalog.search": "Название, автор или категория...",
      "catalog.category": "Категория",
      "catalog.sort": "Сортировка",
      "catalog.priceFrom": "Цена (от)",
      "catalog.priceTo": "Цена (до)",
      "catalog.reset": "Сбросить",
      "catalog.found": "Найдено книг: {n}",
      "catalog.none": "Ничего не найдено",
      "catalog.noneText": "Попробуйте другой запрос или сбросьте фильтры.",
      "catalog.more": "Показать ещё",
      "catalog.filters": "Фильтры",

      "filter.all": "Все книги",
      "filter.popular": "Самые популярные",
      "filter.newest": "Самые новые",
      "filter.cheap": "Сначала дешёвые",
      "filter.expensive": "Сначала дорогие",
      "filter.rating": "С высоким рейтингом",
      "filter.discount": "Со скидкой",
      "filter.bestseller": "Бестселлеры",
      "filter.new": "Новинки",

      "book.by": "Автор",
      "book.author": "Автор",
      "book.pages": "Страниц",
      "book.language": "Язык книги",
      "book.year": "Год издания",
      "book.rating": "Рейтинг",
      "book.reviews": "оценок: {n}",
      "book.stock": "На складе",
      "book.inStock": "В наличии: {n} шт.",
      "book.outOfStock": "Нет в наличии",
      "book.category": "Категория",
      "book.id": "ID книги",
      "book.bestseller": "Бестселлер",
      "book.new": "Новинка",
      "book.details": "Подробнее",
      "book.add": "В корзину",
      "book.addFull": "Добавить в корзину",
      "book.buy": "Купить",
      "book.about": "О книге",
      "book.similar": "Похожие книги",
      "book.bc": "{n} до н. э.",
      "lang.uz": "Узбекский",
      "lang.en": "Английский",
      "lang.ru": "Русский",
      "currency": "сум",
      "pcs": "шт.",

      "cart.title": "Корзина",
      "cart.empty": "Ваша корзина пуста",
      "cart.emptyText": "Добавьте понравившиеся книги из каталога.",
      "cart.browse": "Перейти в каталог",
      "cart.items": "Товары",
      "cart.total": "Итого",
      "cart.delivery": "Доставка",
      "cart.deliveryFree": "Бесплатно",
      "cart.clear": "Очистить корзину",
      "cart.checkout": "Оформить заказ",
      "cart.remove": "Удалить",
      "cart.increase": "Увеличить",
      "cart.decrease": "Уменьшить",
      "cart.added": "«{t}» добавлена в корзину",
      "cart.removed": "Книга удалена из корзины",
      "cart.cleared": "Корзина очищена",
      "cart.confirmRemove": "Удалить эту книгу из корзины?",
      "cart.confirmClear": "Удалить все книги из корзины?",
      "cart.maxStock": "На складе только {n} шт.",
      "cart.outOfStock": "Этой книги сейчас нет в наличии",
      "cart.each": "за шт.",

      "confirm.yes": "Да, удалить",
      "confirm.no": "Отмена",
      "confirm.title": "Подтвердите",

      "co.title": "Оформление заказа",
      "co.contact": "Контактные данные",
      "co.delivery": "Адрес доставки",
      "co.fullName": "Имя и фамилия",
      "co.fullNamePh": "Например: Азиз Каримов",
      "co.phone": "Номер телефона",
      "co.region": "Область",
      "co.regionPh": "Выберите область",
      "co.district": "Район или город",
      "co.districtPh": "Например: Чиланзарский район",
      "co.address": "Адрес",
      "co.addressPh": "Улица, дом, квартира",
      "co.comment": "Дополнительный комментарий",
      "co.commentPh": "Комментарий для курьера (необязательно)",
      "co.summary": "Состав заказа",
      "co.confirm": "Подтвердить заказ",
      "co.sending": "Отправка...",
      "co.payNote": "Оплата при получении книги.",
      "co.successTitle": "Ваш заказ принят!",
      "co.successText": "Наш оператор скоро свяжется с вами.",
      "co.orderNo": "Номер заказа",
      "co.done": "Хорошо",
      "co.err.name": "Введите имя и фамилию полностью (минимум 2 слова).",
      "co.err.phone": "Неверный номер. Формат: +998 90 123 45 67",
      "co.err.region": "Выберите область.",
      "co.err.district": "Введите район или город.",
      "co.err.address": "Укажите адрес подробнее (минимум 5 символов).",
      "co.err.comment": "Комментарий слишком длинный (максимум 500 символов).",
      "co.err.empty": "Корзина пуста — нечего заказывать.",

      "err.network": "Нет связи с сервером. Проверьте интернет и повторите попытку.",
      "err.server": "Ошибка сервера. Повторите попытку чуть позже.",
      "err.rate": "Слишком много попыток. Повторите через {n} мин.",
      "err.duplicate": "Этот заказ уже отправлен. Оператор свяжется с вами.",
      "err.validation": "В данных есть ошибки. Проверьте и отправьте снова.",
      "err.stock": "Некоторых книг недостаточно на складе. Обновите корзину.",
      "err.notConfigured": "Магазин ещё не подключён к Telegram. Свяжитесь с администратором.",
      "err.localFile": "Заказы работают только на Netlify (или через «netlify dev»). При открытии файла напрямую серверная функция недоступна.",

      "auth.login": "Вход",
      "auth.register": "Регистрация",
      "auth.loginTitle": "Войдите в аккаунт",
      "auth.registerTitle": "Создайте новый аккаунт",
      "auth.firstName": "Имя",
      "auth.lastName": "Фамилия",
      "auth.email": "Email",
      "auth.phone": "Номер телефона",
      "auth.password": "Пароль",
      "auth.password2": "Подтвердите пароль",
      "auth.login_id": "Email или телефон",
      "auth.submitLogin": "Войти",
      "auth.submitRegister": "Зарегистрироваться",
      "auth.haveAccount": "Уже есть аккаунт?",
      "auth.noAccount": "Нет аккаунта?",
      "auth.logout": "Выйти",
      "auth.hello": "Привет, {n}!",
      "auth.welcome": "Добро пожаловать, {n}!",
      "auth.registered": "Вы успешно зарегистрировались!",
      "auth.loggedOut": "Вы вышли из аккаунта",
      "auth.pwHint": "Минимум 8 символов, буквы и цифры",
      "auth.demo": "ДЕМО-РЕЖИМ: серверная аутентификация не подключена. Данные хранятся только в этом браузере (пароль хешируется SHA-256 + соль). Для настоящих аккаунтов разместите сайт на Netlify.",
      "auth.secure": "Защищённое соединение: пароли хешируются на сервере (scrypt).",
      "auth.err.firstName": "Введите имя (2–40 символов).",
      "auth.err.lastName": "Введите фамилию (2–40 символов).",
      "auth.err.email": "Неверный email.",
      "auth.err.phone": "Неверный номер. Формат: +998 90 123 45 67",
      "auth.err.password": "Пароль: минимум 8 символов, буквы и цифры.",
      "auth.err.password2": "Пароли не совпадают.",
      "auth.err.loginId": "Введите email или номер телефона.",
      "auth.err.required": "Введите пароль.",
      "auth.err.exists": "Аккаунт с таким email или телефоном уже существует.",
      "auth.err.invalid": "Неверный логин или пароль.",
      "auth.err.rate": "Слишком много попыток. Повторите позже.",

      "about.title": "О нас",
      "about.lead": "ZARVARAQ — магазин, созданный любителями книг для любителей книг.",
      "about.p1": "Мы начали работу в 2026 году с одной целью: быстро и удобно доставлять качественные книги читателям в любой уголок Узбекистана. «Зарварак» означает «золотая страница» — мы верим, что каждая книга может стать золотой страницей в чьей-то жизни.",
      "about.p2": "В нашем каталоге более 270 наименований — от узбекской классики до современных руководств по программированию. Каждую книгу наша команда выбирает лично.",
      "about.s1": "довольных клиентов",
      "about.s2": "доставленных книг",
      "about.s3": "средний рейтинг",

      "contact.title": "Контакты",
      "contact.lead": "Есть вопросы? Мы на связи каждый день с 9:00 до 21:00.",
      "contact.phone": "Телефон",
      "contact.email": "Email",
      "contact.address": "Адрес",
      "contact.addressVal": "г. Ташкент, ул. Амира Темура, 1",
      "contact.hours": "Время работы",
      "contact.hoursVal": "Ежедневно, 9:00 – 21:00",
      "contact.telegram": "Написать в Telegram",

      "footer.about": "Премиальный онлайн-магазин книг. Узбекская и мировая литература, научные и учебные издания — с доставкой по всему Узбекистану.",
      "footer.links": "Полезные ссылки",
      "footer.categories": "Категории",
      "footer.contact": "Контакты",
      "footer.rights": "Все права защищены.",
      "footer.made": "Сделано с любовью",

      "toast.theme.dark": "Тёмная тема включена",
      "toast.theme.light": "Светлая тема включена",
      "toast.lang": "Язык изменён",
      "loading": "Загрузка...",
      "close": "Закрыть",
      "notFound": "Страница не найдена",

      "region.tashkent_city": "город Ташкент",
      "region.tashkent": "Ташкентская область",
      "region.andijan": "Андижанская область",
      "region.bukhara": "Бухарская область",
      "region.fergana": "Ферганская область",
      "region.jizzakh": "Джизакская область",
      "region.khorezm": "Хорезмская область",
      "region.namangan": "Наманганская область",
      "region.navoi": "Навоийская область",
      "region.kashkadarya": "Кашкадарьинская область",
      "region.samarkand": "Самаркандская область",
      "region.sirdarya": "Сырдарьинская область",
      "region.surkhandarya": "Сурхандарьинская область",
      "region.karakalpakstan": "Республика Каракалпакстан"
    }
  };

  /* Kitob tavsiflari — har kategoriya uchun 3 xil shablon, 3 tilda.
     {title}, {author}, {year} avtomatik qo'yiladi. */
  var DESC = {
    uz: {
      fiction: [
        "{author} qalamiga mansub «{title}» — o‘zbek nasrining yorqin namunasi. Inson taqdiri, muhabbat va sadoqat haqidagi ta’sirli hikoya.",
        "«{title}» qahramonlarning ichki dunyosini chuqur ochib beradi. {author} hayotiy voqealarni betakror uslubda tasvirlaydi.",
        "Avloddan avlodga o‘qilib kelayotgan asar. «{title}» sizni o‘ylashga, his qilishga va qayta-qayta varaqlashga undaydi."
      ],
      detective: [
        "«{title}» — so‘nggi sahifagacha sirini saqlaydigan detektiv. {author} o‘quvchini har bobda yangi jumboq bilan hayratga soladi.",
        "Murakkab jinoyat, aqlli tergovchi va kutilmagan yakun. {author}ning «{title}» asari janr muxlislari uchun majburiy kitob.",
        "Keskin syujet va puxta o‘ylangan dalillar. «{title}» — bir o‘tirishda o‘qib tugatiladigan kitob."
      ],
      scifi: [
        "«{title}» o‘quvchini butunlay boshqa olamga olib kiradi. {author} fan va tasavvur chegarasida ulkan dunyo yaratgan.",
        "Kelajak, texnologiya va inson tabiati haqidagi jasur g‘oyalar. {author}ning «{title}» asari janr klassikasiga aylangan.",
        "Ajoyib sarguzasht va chuqur falsafa uyg‘unligi. «{title}» fantastika muxlislarining sevimli kitobi."
      ],
      history: [
        "«{title}» o‘tmish voqealarini jonli va ishonarli tarzda hikoya qiladi. {author} tarixni bugungi kun bilan bog‘laydi.",
        "Buyuk shaxslar, saltanatlar va burilish nuqtalari haqida. {author}ning «{title}» asari tarix ixlosmandlari uchun.",
        "Faktlarga boy, qiziqarli bayon. «{title}» tarixni yangicha nigoh bilan ko‘rishga yordam beradi."
      ],
      psychology: [
        "«{title}» inson ongi va xulq-atvorini tushunishga yordam beradi. {author} ilmiy tadqiqotlarni sodda tilda tushuntiradi.",
        "O‘zingizni va atrofdagilarni yaxshiroq anglash uchun. {author}ning «{title}» kitobi amaliy maslahatlarga boy.",
        "Psixologiyaga oid eng ko‘p o‘qiladigan kitoblardan biri. «{title}» fikrlash tarzingizni o‘zgartiradi."
      ],
      business: [
        "«{title}» — pul, biznes va muvaffaqiyat haqidagi amaliy qo‘llanma. {author} o‘z tajribasi bilan bo‘lishadi.",
        "Tadbirkorlar va investorlar uchun majburiy kitob. {author}ning «{title}» asari moliyaviy savodxonlikni oshiradi.",
        "Aniq misollar va hayotiy saboqlar. «{title}» biznesingizni yangi bosqichga olib chiqishga yordam beradi."
      ],
      it: [
        "«{title}» — dasturchilar uchun klassik qo‘llanma. {author} sifatli kod yozishning amaliy tamoyillarini ko‘rsatadi.",
        "Boshlovchidan professionalgacha. {author}ning «{title}» kitobi aniq misollar va mashqlarga boy.",
        "IT sohasida har bir mutaxassis javonida bo‘lishi kerak bo‘lgan kitob. «{title}» bilimlaringizni tizimlashtiradi."
      ],
      selfdev: [
        "«{title}» kundalik odatlarni o‘zgartirish orqali katta natijalarga erishishni o‘rgatadi. {author}ning amaliy tavsiyalari.",
        "Samaradorlik, intizom va maqsadga erishish haqida. {author}ning «{title}» kitobi millionlab odamlarga yordam bergan.",
        "Hayotingizni yaxshi tomonga o‘zgartirish uchun ilhom va aniq qadamlar. «{title}» — sizning yangi boshlanishingiz."
      ],
      kids: [
        "«{title}» — bolalar va kattalar sevib o‘qiydigan ajoyib asar. {author} mehr, do‘stlik va jasorat haqida hikoya qiladi.",
        "Sehrli sarguzashtlar va yorqin qahramonlar. {author}ning «{title}» kitobi bolangizda kitobga mehr uyg‘otadi.",
        "Oila davrasida birga o‘qish uchun eng yaxshi tanlov. «{title}» xayol olamini kengaytiradi."
      ],
      science: [
        "«{title}» murakkab ilmiy g‘oyalarni hammaga tushunarli tilda bayon qiladi. {author}ning mashhur asari.",
        "Olam, hayot va inson haqidagi eng qiziqarli savollarga javob. {author}ning «{title}» kitobi bilimga chanqoqlar uchun.",
        "Ilm-fan tarixida o‘z o‘rniga ega asar. «{title}» dunyoga qarashingizni kengaytiradi."
      ],
      philosophy: [
        "«{title}» — {author}ning hayot, axloq va haqiqat haqidagi chuqur mulohazalari. Asrlar osha dolzarb asar.",
        "Inson nima uchun yashaydi? {author} «{title}» asarida abadiy savollarga javob izlaydi.",
        "Fikrlash madaniyatini shakllantiruvchi kitob. «{title}» har bir o‘qilganda yangi ma’no ochadi."
      ],
      world: [
        "«{title}» — jahon adabiyotining oltin fondiga kirgan asar. {author} inson qalbining eng nozik tomonlarini ochib beradi.",
        "Buyuk yozuvchi {author}ning «{title}» romani avlodlar tomonidan qayta-qayta o‘qiladi.",
        "Har bir kitobxon o‘qishi kerak bo‘lgan klassika. «{title}» hayot, muhabbat va taqdir haqida."
      ],
      religion: [
        "«{title}» — ma’naviyat va ma’rifatga oid qadrli manba. {author} asari ko‘p avlodlarga yo‘l ko‘rsatgan.",
        "Ilm, odob va axloq haqida. {author}ning «{title}» asari har bir xonadon kutubxonasida bo‘lishga loyiq.",
        "Qalbga tinchlik, aqlga ziyo beruvchi kitob. «{title}» sifatli nashrda taqdim etiladi."
      ],
      education: [
        "«{title}» — o‘quvchilar va o‘qituvchilar uchun ishonchli qo‘llanma. {author} materialni tizimli va tushunarli bayon qiladi.",
        "Imtihonlarga tayyorgarlik va mustaqil ta’lim uchun. «{title}» ko‘plab mashq va misollarni o‘z ichiga oladi.",
        "Bilimni mustahkamlash uchun eng yaxshi tanlov. {author}ning «{title}» qo‘llanmasi."
      ],
      biography: [
        "«{title}» — buyuk shaxs hayoti, muvaffaqiyatlari va mag‘lubiyatlari haqida ta’sirli hikoya. Muallif: {author}.",
        "Ilhom beruvchi hayot yo‘li. {author}ning «{title}» kitobi orzular sari intilishni o‘rgatadi.",
        "Tarixga iz qoldirgan inson haqida haqqoniy va qiziqarli bayon. «{title}» sizni befarq qoldirmaydi."
      ]
    },
    en: {
      fiction: [
        "“{title}” by {author} is a shining example of Uzbek prose — a moving story of fate, love and loyalty.",
        "“{title}” reveals the inner world of its characters in depth. {author} portrays real life in a unique style.",
        "A work read from generation to generation. “{title}” makes you think, feel and return to its pages again."
      ],
      detective: [
        "“{title}” keeps its secret to the very last page. {author} surprises the reader with a new puzzle in every chapter.",
        "A complex crime, a brilliant detective and an unexpected ending. {author}'s “{title}” is a must-read for genre fans.",
        "A tense plot and carefully planted clues — “{title}” is a book you finish in one sitting."
      ],
      scifi: [
        "“{title}” transports the reader to another world. {author} built a vast universe on the edge of science and imagination.",
        "Bold ideas about the future, technology and human nature. {author}'s “{title}” has become a genre classic.",
        "A blend of great adventure and deep philosophy. “{title}” is a favourite of science-fiction fans."
      ],
      history: [
        "“{title}” tells the story of the past in a vivid and convincing way. {author} connects history with today.",
        "About great figures, empires and turning points. {author}'s “{title}” is for every history lover.",
        "Fact-rich and engaging. “{title}” helps you see history through fresh eyes."
      ],
      psychology: [
        "“{title}” helps you understand the human mind and behaviour. {author} explains research in plain language.",
        "To understand yourself and others better. {author}'s “{title}” is full of practical advice.",
        "One of the most-read books on psychology. “{title}” will change the way you think."
      ],
      business: [
        "“{title}” is a practical guide to money, business and success. {author} shares hard-won experience.",
        "A must-read for entrepreneurs and investors. {author}'s “{title}” builds real financial literacy.",
        "Concrete examples and life lessons. “{title}” helps take your business to the next level."
      ],
      it: [
        "“{title}” is a classic for programmers. {author} shows practical principles of writing quality code.",
        "From beginner to professional. {author}'s “{title}” is packed with clear examples and exercises.",
        "A book every IT professional should have on the shelf. “{title}” structures your knowledge."
      ],
      selfdev: [
        "“{title}” teaches how small daily habits lead to big results. Practical advice from {author}.",
        "On productivity, discipline and achieving goals. {author}'s “{title}” has helped millions of people.",
        "Inspiration and clear steps to change your life for the better. “{title}” is your new beginning."
      ],
      kids: [
        "“{title}” is a wonderful book loved by children and adults alike. {author} writes about kindness, friendship and courage.",
        "Magical adventures and bright characters. {author}'s “{title}” will spark a love of reading in your child.",
        "The perfect choice for family reading time. “{title}” expands the world of imagination."
      ],
      science: [
        "“{title}” explains complex scientific ideas in language everyone can understand. A famous work by {author}.",
        "Answers to the most fascinating questions about the universe, life and humanity. {author}'s “{title}” is for the curious.",
        "A landmark in the history of science. “{title}” will broaden your view of the world."
      ],
      philosophy: [
        "“{title}” holds {author}'s deep reflections on life, ethics and truth — still relevant after centuries.",
        "Why do we live? In “{title}”, {author} searches for answers to eternal questions.",
        "A book that shapes a culture of thinking. “{title}” reveals new meaning with every reading."
      ],
      world: [
        "“{title}” belongs to the golden canon of world literature. {author} reveals the subtlest corners of the human heart.",
        "The great writer {author}'s “{title}” has been reread by generation after generation.",
        "A classic every reader should know. “{title}” is about life, love and destiny."
      ],
      religion: [
        "“{title}” is a treasured source of spirituality and enlightenment. The work of {author} has guided many generations.",
        "On knowledge, manners and ethics. {author}'s “{title}” deserves a place in every home library.",
        "A book that brings peace to the heart and light to the mind. “{title}” is offered in a quality edition."
      ],
      education: [
        "“{title}” is a reliable guide for students and teachers. {author} presents the material clearly and systematically.",
        "For exam preparation and self-study. “{title}” contains plenty of exercises and examples.",
        "The best choice for strengthening your knowledge — “{title}” by {author}."
      ],
      biography: [
        "“{title}” is a moving story of a remarkable life, its triumphs and setbacks. Author: {author}.",
        "An inspiring life journey. {author}'s “{title}” teaches you to strive for your dreams.",
        "An honest and gripping account of a person who left a mark on history. “{title}” won't leave you indifferent."
      ]
    },
    ru: {
      fiction: [
        "«{title}» ({author}) — яркий образец узбекской прозы. Трогательная история о судьбе, любви и верности.",
        "«{title}» глубоко раскрывает внутренний мир героев. {author} описывает жизнь в неповторимом стиле.",
        "Произведение, которое читают из поколения в поколение. «{title}» заставляет думать, чувствовать и возвращаться к страницам."
      ],
      detective: [
        "«{title}» хранит свою тайну до последней страницы. {author} удивляет новой загадкой в каждой главе.",
        "Сложное преступление, блестящий сыщик и неожиданный финал. «{title}» ({author}) — обязательна для поклонников жанра.",
        "Напряжённый сюжет и продуманные улики. «{title}» читается на одном дыхании."
      ],
      scifi: [
        "«{title}» переносит читателя в совершенно другой мир. {author} создал огромную вселенную на грани науки и воображения.",
        "Смелые идеи о будущем, технологиях и природе человека. «{title}» ({author}) стала классикой жанра.",
        "Сочетание захватывающих приключений и глубокой философии. «{title}» — любимая книга поклонников фантастики."
      ],
      history: [
        "«{title}» живо и убедительно рассказывает о событиях прошлого. {author} связывает историю с сегодняшним днём.",
        "О великих личностях, империях и поворотных моментах. «{title}» ({author}) — для любителей истории.",
        "Насыщенное фактами, увлекательное изложение. «{title}» помогает взглянуть на историю по-новому."
      ],
      psychology: [
        "«{title}» помогает понять человеческое мышление и поведение. {author} простым языком объясняет научные исследования.",
        "Чтобы лучше понимать себя и окружающих. «{title}» ({author}) полна практических советов.",
        "Одна из самых читаемых книг по психологии. «{title}» изменит ваш образ мышления."
      ],
      business: [
        "«{title}» — практическое руководство о деньгах, бизнесе и успехе. {author} делится собственным опытом.",
        "Обязательная книга для предпринимателей и инвесторов. «{title}» ({author}) повышает финансовую грамотность.",
        "Конкретные примеры и жизненные уроки. «{title}» поможет вывести ваш бизнес на новый уровень."
      ],
      it: [
        "«{title}» — классика для программистов. {author} показывает практические принципы написания качественного кода.",
        "От новичка до профессионала. «{title}» ({author}) полна понятных примеров и упражнений.",
        "Книга, которая должна быть на полке каждого IT-специалиста. «{title}» систематизирует ваши знания."
      ],
      selfdev: [
        "«{title}» учит добиваться больших результатов через маленькие ежедневные привычки. Практические советы от {author}.",
        "О продуктивности, дисциплине и достижении целей. «{title}» ({author}) помогла миллионам людей.",
        "Вдохновение и чёткие шаги, чтобы изменить жизнь к лучшему. «{title}» — ваше новое начало."
      ],
      kids: [
        "«{title}» — чудесная книга, которую любят и дети, и взрослые. {author} рассказывает о доброте, дружбе и смелости.",
        "Волшебные приключения и яркие герои. «{title}» ({author}) пробудит в ребёнке любовь к чтению.",
        "Лучший выбор для семейного чтения. «{title}» расширяет мир воображения."
      ],
      science: [
        "«{title}» объясняет сложные научные идеи понятным каждому языком. Знаменитая работа {author}.",
        "Ответы на самые интересные вопросы о Вселенной, жизни и человеке. «{title}» ({author}) — для любознательных.",
        "Произведение, занявшее своё место в истории науки. «{title}» расширит ваш взгляд на мир."
      ],
      philosophy: [
        "«{title}» — глубокие размышления {author} о жизни, морали и истине. Актуально спустя века.",
        "Зачем живёт человек? В «{title}» {author} ищет ответы на вечные вопросы.",
        "Книга, формирующая культуру мышления. «{title}» открывает новый смысл при каждом прочтении."
      ],
      world: [
        "«{title}» входит в золотой фонд мировой литературы. {author} раскрывает тончайшие стороны человеческой души.",
        "Роман великого писателя {author} «{title}» перечитывают поколение за поколением.",
        "Классика, которую должен прочитать каждый. «{title}» — о жизни, любви и судьбе."
      ],
      religion: [
        "«{title}» — ценный источник духовности и просвещения. Труд {author} стал ориентиром для многих поколений.",
        "О знании, нравственности и этике. «{title}» ({author}) достойна места в каждой домашней библиотеке.",
        "Книга, дарующая покой сердцу и свет разуму. «{title}» представлена в качественном издании."
      ],
      education: [
        "«{title}» — надёжное пособие для учеников и учителей. {author} излагает материал системно и понятно.",
        "Для подготовки к экзаменам и самообразования. «{title}» содержит множество упражнений и примеров.",
        "Лучший выбор для закрепления знаний — пособие «{title}» ({author})."
      ],
      biography: [
        "«{title}» — трогательная история жизни великого человека, его побед и неудач. Автор: {author}.",
        "Вдохновляющий жизненный путь. «{title}» ({author}) учит стремиться к мечте.",
        "Честный и захватывающий рассказ о человеке, оставившем след в истории. «{title}» не оставит вас равнодушным."
      ]
    }
  };

  var SUPPORTED = ["uz", "en", "ru"];
  var current = "uz";
  try {
    var saved = localStorage.getItem("zv_lang");
    if (saved && SUPPORTED.indexOf(saved) !== -1) current = saved;
  } catch (e) { /* localStorage bloklangan bo'lishi mumkin */ }

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  }

  function t(key, vars) {
    var dict = T[current] || T.uz;
    var str = dict[key];
    if (str === undefined) str = T.uz[key];
    if (str === undefined) return key;
    return interpolate(str, vars);
  }

  function bookTitle(book) {
    return book.title[current] || book.title.en;
  }

  function bookDescription(book) {
    var list = (DESC[current] || DESC.uz)[book.category];
    var tpl = list[book.id % list.length];
    return interpolate(tpl, { title: bookTitle(book), author: book.author, year: book.year });
  }

  // HTML elementlardagi data-i18n atributlarini yangilaydi
  function apply(rootEl) {
    var scope = rootEl || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.documentElement.lang = current;
    document.title = t("meta.title");
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem("zv_lang", lang); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent("zv:langchange", { detail: { lang: lang } }));
  }

  root.ZV = root.ZV || {};
  root.ZV.i18n = {
    t: t,
    apply: apply,
    setLang: setLang,
    getLang: function () { return current; },
    bookTitle: bookTitle,
    bookDescription: bookDescription,
    // Istalgan tildagi tarjima (joriy tilni o'zgartirmasdan) — qidiruv indeksi uchun
    tIn: function (lang, key) { return (T[lang] && T[lang][key]) || T.uz[key] || key; },
    SUPPORTED: SUPPORTED,
    REGIONS: ["tashkent_city", "tashkent", "andijan", "bukhara", "fergana", "jizzakh", "khorezm",
              "namangan", "navoi", "kashkadarya", "samarkand", "sirdarya", "surkhandarya", "karakalpakstan"]
  };
})(window);
