# 📚 ZARVARAQ — premium onlayn kitob do‘koni

**HTML5 + CSS3 + Vanilla JavaScript + Netlify Functions + Telegram Bot**

- 270 ta kitob, 15 kategoriya
- 3 til (O‘zbek / English / Русский)
- Tun-kun rejimi
- Savatcha va checkout
- Ro‘yxatdan o‘tish / kirish
- Buyurtmalar **Telegram botingizga** avtomatik yuboriladi

React, Vue va boshqa frameworklar ishlatilmagan.

---

## 1. Loyiha tuzilmasi

```
zarvaraq/
├── index.html              ← Asosiy sahifa (barcha bo‘limlar, modal oynalar)
├── style.css               ← Dizayn: ranglar, komponentlar, animatsiyalar, dark mode
├── responsive.css          ← Moslashuvchanlik: 320px dan 1920px gacha
├── theme-init.js           ← Tema sahifa chizilishidan OLDIN qo‘llanadi (miltillash bo‘lmasligi uchun)
├── translations.js         ← UZ / EN / RU tarjimalar + kitob tavsiflari
├── books.js                ← 270 ta kitob bazasi (brauzer VA server uchun umumiy)
├── cart.js                 ← Savatcha, checkout, buyurtmani serverga yuborish
├── auth.js                 ← Ro‘yxatdan o‘tish / kirish (server yoki demo rejim)
├── app.js                  ← Router, katalog, qidiruv, filtr, muqovalar, modal, tema, til
├── netlify.toml            ← Netlify sozlamalari, /api/* yo‘llari, xavfsizlik sarlavhalari
├── package.json            ← Faqat @netlify/blobs (server omboriga kerak)
├── .env.example            ← Environment Variables namunasi
├── .gitignore
├── netlify/
│   ├── functions/
│   │   ├── order.js        ← POST /api/order    — buyurtmani tekshirib Telegram'ga yuboradi
│   │   ├── telegram.js     ← GET  /api/telegram — bot ulanishini tekshirish
│   │   └── auth.js         ← /api/auth          — ro‘yxatdan o‘tish/kirish (scrypt + cookie)
│   └── lib/
│       ├── telegram.js     ← Telegram Bot API bilan ishlash (token faqat process.env'dan)
│       ├── store.js        ← Netlify Blobs ombori + rate limiter
│       └── http.js         ← JSON javob, IP, origin tekshiruvi
└── tests/
    ├── run-tests.js        ← Server testlari (30 ta): npm test
    └── dev-server.js       ← Netlify'siz lokal sinov serveri
```

### Fayllar qanday bog‘langan

```
index.html
  ├─ <link>   style.css, responsive.css
  └─ <script> theme-init.js → translations.js → books.js → cart.js → auth.js → app.js
                                   │              │           │          │
                              ZV.i18n        ZV.BOOKS     ZV.cart    ZV.auth     ZV.util / ZV.ui
                                                │
netlify/functions/order.js ── require("../../books.js")  ← narxlar shu yerdan tekshiriladi
```

Brauzerdagi barcha modullar bitta global `ZV` obyekti orqali bog‘lanadi. Skriptlar `defer` bilan, aynan shu tartibda yuklanadi.

### Buyurtma arxitekturasi

```
Brauzer (cart.js)
   │  POST /api/order  { customer, items:[{id, qty}], requestId }
   ▼
Netlify Function (order.js)
   │  1. Ma’lumotlarni tekshiradi
   │  2. Narxlarni books.js dan qayta hisoblaydi
   │  3. Spam va takroriy buyurtmani tekshiradi
   │  4. process.env.TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
   ▼
Telegram Bot API  →  📱 Sizning Telegram chatingiz
```

> 🔐 **Bot token frontend kodida YO‘Q.** U faqat Netlify Environment Variables’da saqlanadi va faqat server funksiyasi ichida o‘qiladi.

---

## 2. VS Code’da ishga tushirish

### A) Faqat ko‘rish uchun (eng oddiy)

1. VS Code’da `File → Open Folder` orqali `zarvaraq` papkasini oching.
2. **Live Server** kengaytmasini o‘rnating.
3. `index.html` ustida o‘ng tugmani bosing → **Open with Live Server**.

Bu rejimda katalog, qidiruv, filtrlar, savatcha, til va tema to‘liq ishlaydi. Kirish/ro‘yxatdan o‘tish esa **DEMO rejimda** ishlaydi.

> ⚠️ Live Server’da buyurtma Telegram’ga **bormaydi**: server funksiyalari faqat Netlify (yoki `netlify dev`) bilan ishlaydi. Sayt buni aniq xabar bilan ko‘rsatadi.

### B) To‘liq rejim — Netlify Functions bilan (tavsiya etiladi)

Kompyuteringizda [Node.js](https://nodejs.org) 18 yoki undan yangi versiyasi bo‘lishi kerak.

```bash
npm install                    # @netlify/blobs ni o‘rnatadi
npm install -g netlify-cli     # Netlify CLI (bir marta)
cp .env.example .env           # .env fayliga token va chat ID yozing
netlify dev                    # → http://localhost:8888
```

Endi saytdan berilgan buyurtma haqiqatan Telegram’ga boradi.

### C) Netlify CLI’siz tez sinov

```bash
MOCK_TELEGRAM=1 node tests/dev-server.js
```

Bu holatda Telegram’ga hech narsa yuborilmaydi: xabar terminalga chiqadi.

### Testlar

```bash
npm test
```

30 ta server testi ishlaydi. Ular quyidagilarni tekshiradi:
- validatsiya va narxni qayta hisoblash
- XSS
- spam va takroriy buyurtma
- rate limit
- Telegram xatolari
- autentifikatsiya

---

## 3. Telegram bot yaratish va BOT TOKEN olish

1. Telegram’da **@BotFather** ni oching → **Start**.
2. `/newbot` buyrug‘ini yuboring.
3. Bot nomini yozing, masalan: `ZARVARAQ Buyurtmalar`.
4. Bot username’ini yozing. U `bot` bilan tugashi kerak, masalan: `zarvaraq_orders_bot`.
5. BotFather sizga token beradi, masalan:
   ```
   7123456789:AAHk3x...uzun_satr...
   ```
   Bu — **TELEGRAM_BOT_TOKEN**. Uni hech kimga bermang va GitHub’ga yuklamang!

## 4. CHAT ID olish

### Variant 1 — buyurtmalar shaxsiy chatingizga kelsin

1. Yangi botingizni oching va **Start** bosing (yoki istalgan xabar yozing).
2. Brauzerda quyidagi manzilni oching (`<TOKEN>` o‘rniga tokeningizni qo‘ying):
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
3. Javobdagi `"chat":{"id":123456789,...}` ni toping. Shu raqam — **TELEGRAM_CHAT_ID**.

> Agar `"result":[]` bo‘sh chiqsa: botga yana bitta xabar yozing va sahifani yangilang.

### Variant 2 — buyurtmalar guruhga kelsin

1. Telegram guruhi yarating va botni guruhga qo‘shing.
2. Guruhda biror xabar yozing, masalan: `/start@zarvaraq_orders_bot`.
3. Yuqoridagi `getUpdates` manzilini oching.
4. Guruh ID’si **minus bilan** boshlanadi, masalan: `-1001234567890`. Shu raqamni oling.

> Muhim: botga guruhda xabar yozish huquqi bo‘lishi kerak.

---

## 5. GitHub’ga yuklash

```bash
cd zarvaraq
git init
git add .
git commit -m "ZARVARAQ onlayn kitob do‘koni"
git branch -M main
git remote add origin https://github.com/<USERNAME>/zarvaraq.git
git push -u origin main
```

`.env` fayli `.gitignore` ichida turibdi, shuning uchun token GitHub’ga **tushmaydi**. Har ehtimolga qarshi `git status` bilan tekshirib oling.

## 6. Netlify’ga ulash

1. [app.netlify.com](https://app.netlify.com) ga GitHub orqali kiring.
2. **Add new site → Import an existing project → GitHub** ni tanlang va `zarvaraq` repozitoriyasini tanlang.
3. Build sozlamalarini o‘zgartirmang: `netlify.toml` ularni avtomatik beradi.
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
4. **Deploy** tugmasini bosing.

## 7. Environment Variables sozlash (ENG MUHIM QADAM)

Netlify’da **Site configuration → Environment variables → Add a variable** bo‘limiga kiring va quyidagilarni qo‘shing:

| Nomi | Qiymati | Majburiymi |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | BotFather bergan token | ✅ Ha |
| `TELEGRAM_CHAT_ID` | Chat yoki guruh ID’si | ✅ Ha |
| `AUTH_SECRET` | Kamida 32 belgili tasodifiy satr (pastga qarang) | Haqiqiy login uchun |
| `ADMIN_TEST_KEY` | Kamida 12 belgili maxfiy so‘z | Ixtiyoriy (test xabar uchun) |

`AUTH_SECRET` yaratish uchun terminalda quyidagini ishga tushiring:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Qiymatlarni qo‘shgandan keyin **Deploys → Trigger deploy → Deploy site** ni bosing. Environment Variables faqat qayta deploy’dan keyin kuchga kiradi.

> Tokenni **faqat shu yerga** yozasiz. HTML, CSS va JS fayllarga token yozilmaydi.

## 8. Netlify Functions ishlashini tekshirish

Brauzerda quyidagi manzilni oching:

```
https://<sizning-saytingiz>.netlify.app/api/telegram
```

Hammasi to‘g‘ri bo‘lsa, shunday javob chiqadi:

```json
{ "ok": true, "configured": true,
  "env": { "TELEGRAM_BOT_TOKEN": true, "TELEGRAM_CHAT_ID": true },
  "bot": { "username": "zarvaraq_orders_bot", "name": "ZARVARAQ Buyurtmalar" } }
```

| Javob | Ma’nosi va yechimi |
|---|---|
| `"configured": false` | O‘zgaruvchilar qo‘shilmagan yoki qayta deploy qilinmagan |
| `"error": "INVALID_TOKEN"` | Token noto‘g‘ri nusxalangan |
| 404 sahifa | Functions deploy bo‘lmagan → Netlify’da **Logs → Functions** ni tekshiring |

### Telegram’ga test xabar yuborish

Buning uchun `ADMIN_TEST_KEY` o‘rnatilgan bo‘lishi kerak:

```bash
curl -X POST https://<sayt>.netlify.app/api/telegram \
     -H "Content-Type: application/json" \
     -d '{"key":"<ADMIN_TEST_KEY>"}'
```

## 9. Test buyurtma yuborish

1. Saytni oching va 2–3 ta kitobni savatchaga qo‘shing.
2. Savatcha belgisini bosing → **Buyurtma berish**.
3. Formani to‘ldiring: ism-familiya, telefon (`+998 90 123 45 67`), viloyat, tuman, manzil.
4. **Buyurtmani tasdiqlash** tugmasini bosing.
5. Saytda buyurtma raqami chiqadi (masalan, `ZV-261124-K3F9QX`) va savatcha tozalanadi.
6. Telegram’ga quyidagi ko‘rinishda xabar keladi:

```
📚 ZARVARAQ — YANGI BUYURTMA

🆔 Buyurtma raqami: ZV-261124-K3F9QX

👤 Mijoz: Aziz Karimov
📞 Telefon: +998901234567
📍 Manzil: Samarqand viloyati, Urgut tumani, Navoiy ko‘chasi, 5-uy

🛒 BUYURTMA TARKIBI:

1. O‘tkan kunlar — Abdulla Qodiriy
   Soni: 2 dona
   Narxi: 178 000 so‘m (89 000 so‘m × 2)

💰 Jami summa: 178 000 so‘m

📝 Izoh: Kechqurun olib keling
```

> Bir xil telefon va bir xil tarkib bilan 5 daqiqa ichida qayta buyurtma berilsa, sayt «Bu buyurtma allaqachon yuborilgan» deydi. Bu — takroriy buyurtmadan himoya. Testda boshqa kitob yoki boshqa telefon raqamini ishlating.

---

## 10. Xavfsizlik

| Himoya | Qanday amalga oshirilgan |
|---|---|
| Token maxfiyligi | Faqat `process.env` orqali o‘qiladi. Javoblarda ham, loglarda ham chiqmaydi |
| Narxni soxtalashtirish | Server faqat `{id, qty}` oladi. Narx `books.js` dan olinadi. localStorage’dagi narx e’tiborga olinmaydi |
| Validatsiya | Ism, telefon (`+998` operator kodlari), viloyat ro‘yxati, uzunlik chegaralari, boshqaruv belgilari, 1–20 dona, ombordagi qoldiq |
| Spam | Ko‘rinmas honeypot maydon, 1,5 soniyadan tez yuborilgan formani rad etish |
| Rate limit | Bir IP’dan 10 daqiqada 5 ta, bir telefondan 10 daqiqada 3 ta buyurtma |
| Takroriy buyurtma | `requestId` (idempotency) + bir xil tarkib 5 daqiqa ichida rad etiladi |
| XSS | Barcha dinamik matnlar ekranlanadi (`escapeHtml`). Telegram xabarida ham. Qat’iy Content-Security-Policy |
| CSRF | `Origin` tekshiruvi, `SameSite=Strict` cookie |
| Parollar | Server: scrypt + salt (Netlify Blobs). Demo: PBKDF2-SHA256 (150 000 iteratsiya). Ochiq parol hech qayerda saqlanmaydi |
| Sessiya | HMAC bilan imzolangan token, `HttpOnly; Secure` cookie (JavaScript o‘qiy olmaydi) |

### Autentifikatsiya rejimlari

- **Server rejimi** — saytda «Xavfsiz ulanish» yozuvi chiqadi.
  - Netlify’da `AUTH_SECRET` o‘rnatilgan bo‘lsa, avtomatik yoqiladi.
  - Foydalanuvchilar Netlify Blobs’da saqlanadi (Netlify’da qo‘shimcha sozlash shart emas).
- **DEMO rejim** — `AUTH_SECRET` bo‘lmasa yoki sayt lokal ochilsa ishlaydi.
  - Kirish oynasida sariq **«DEMO REJIM»** ogohlantirishi ko‘rinadi.
  - Ma’lumotlar faqat shu brauzerda, xeshlangan holda saqlanadi.

---

## 11. Kitob muqovalari haqida

Muqovalar **Open Library Covers API** (`covers.openlibrary.org`) dan olinadi. Bu Internet Archive’ning bepul va ochiq xizmati.

Qanday ishlaydi:
1. Kitob ekranga kelganda, sayt Open Library’dan **kitob nomi + muallif** bo‘yicha muqova ID’sini qidiradi.
2. Topilgan muqova yuklanadi. Natija brauzerda keshlanadi, shuning uchun keyingi safar tezroq ochiladi.
3. Muqova topilmasa yoki yuklanmasa, o‘sha kitob uchun **alohida chizilgan SVG muqova** ko‘rsatiladi. Unda kitob nomi, muallifi va kategoriya rangi bo‘ladi. Bu fallback.

Natijada hech qachon «buzilgan rasm» ko‘rinmaydi va barcha kitoblarga bir xil rasm qo‘yilmaydi.

**Bilish kerak bo‘lgan cheklov:** Open Library’da asosan xalqaro nashrlar bor. O‘zbek mualliflarining ko‘p kitoblari (O‘tkan kunlar, Ufq va hokazo) u yerda yo‘q, shuning uchun ular chiroyli SVG muqova bilan chiqadi. O‘zingizdagi haqiqiy muqova suratlarini qo‘shmoqchi bo‘lsangiz:
1. Rasmlarni `covers/` papkasiga `1.jpg`, `2.jpg` … (kitob ID’si bo‘yicha) shaklida joylang.
2. `app.js` ichidagi `Covers.apply` funksiyasida `coverUrl(...)` o‘rniga `"covers/" + id + ".jpg"` ni ishlating.

---

## 12. Sozlash

- **Do‘kon aloqa ma’lumotlari** — `app.js` boshidagi `CONFIG` obyekti:
  - `phone`, `email`, `telegram`, `instagram` — havolalaringizni shu yerga yozing.
- **Kitob qo‘shish yoki o‘zgartirish** — `books.js` dagi `RAW` ro‘yxati. Har bir qator:
  ```
  ["kategoriya", "Nomi (UZ)", "Original/EN nomi", "Nomi (RU)", "Muallif", yil, sahifa, "u|e|r", "b|n"]
  ```
  - `b` = bestseller, `n` = yangi.
  - Narx, chegirma, reyting va ombordagi son avtomatik hisoblanadi. Server ham xuddi shu fayldan foydalanadi.
- **Matnlar va tarjimalar** — `translations.js`.
- **Ranglar** — `style.css` boshidagi `:root` (yorug‘ rejim) va `[data-theme="dark"]` (tungi rejim) bloklari.

---

## 13. Muammolar va yechimlar

| Muammo | Yechim |
|---|---|
| «Do‘kon hali Telegram bilan ulanmagan» | Environment Variables’ni qo‘shing va qayta deploy qiling |
| Buyurtma ketmayapti, server xatosi chiqyapti | Netlify → **Logs → Functions → order** bo‘limini oching. `chat not found` bo‘lsa, chat ID noto‘g‘ri yoki botga hali **Start** bosilmagan |
| Guruhga xabar kelmayapti | Bot guruhda borligini va ID minus bilan yozilganini tekshiring |
| «Juda ko‘p urinish» | Rate limit ishladi — 10 daqiqa kuting |
| Muqovalar chiqmayapti | Internet yoki Open Library vaqtincha ishlamayapti — sayt SVG fallback ko‘rsatadi |
| Login DEMO rejimda qolyapti | `AUTH_SECRET` (32+ belgi) qo‘shilmagan yoki qayta deploy qilinmagan |
