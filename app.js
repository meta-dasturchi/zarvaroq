/* =====================================================================
   ZARVARAQ — app.js
   Asosiy ilova: yordamchi funksiyalar, muqovalar, router, sahifalarni
   chizish, qidiruv, filtrlash, modal oynalar, tema, til, animatsiyalar.
   Yuklanish tartibi (index.html): translations.js → books.js → cart.js → auth.js → app.js
   ===================================================================== */
(function (root) {
  "use strict";

  var ZV = root.ZV = root.ZV || {};
  var BOOKS = ZV.BOOKS;
  var CATEGORIES = ZV.CATEGORIES;
  var i18n = ZV.i18n;
  var t = i18n.t;

  /* ---------- Do'kon sozlamalari (o'zingiznikiga almashtiring) ---------- */
  var CONFIG = {
    phone: "+998901234567",
    email: "info@zarvaraq.uz",
    telegram: "https://t.me/zarvaraq",
    instagram: "https://instagram.com/zarvaraq",
    pageSize: 20
  };

  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $$(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }

  /* =====================================================================
     1. YORDAMCHI FUNKSIYALAR (ZV.util)
     ===================================================================== */
  var bookMap = {};
  BOOKS.forEach(function (b) { bookMap[b.id] = b; });

  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
  // XSS himoyasi: innerHTML'ga tushadigan HAR QANDAY matn shu funksiyadan o'tadi
  function escapeHtml(s) { return String(s == null ? "" : s).replace(/[&<>"'`]/g, function (c) { return ESC[c]; }); }

  function formatNumber(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function formatPrice(n) { return formatNumber(n) + " " + t("currency"); }

  function normalizePhone(v) {
    var d = String(v || "").replace(/\D/g, "");
    if (d.length === 9) d = "998" + d;
    return d ? "+" + d : "";
  }
  function formatPhone(p) {
    var d = String(p || "").replace(/\D/g, "");
    if (d.indexOf("998") !== 0 || d.length !== 12) return p || "";
    return "+998 " + d.substr(3, 2) + " " + d.substr(5, 3) + " " + d.substr(8, 2) + " " + d.substr(10, 2);
  }
  // Telefon maydoni uchun avtomatik format: +998 90 123 45 67
  function phoneMask(e) {
    var input = e.target;
    var d = input.value.replace(/\D/g, "");
    if (d.indexOf("998") !== 0) d = "998" + d.replace(/^9?9?8?/, "");
    d = d.slice(0, 12);
    var out = "+998";
    if (d.length > 3) out += " " + d.slice(3, 5);
    if (d.length > 5) out += " " + d.slice(5, 8);
    if (d.length > 8) out += " " + d.slice(8, 10);
    if (d.length > 10) out += " " + d.slice(10, 12);
    input.value = out + (d.length === 3 ? " " : "");
  }

  var validators = {
    email: function (v) { return /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(v) && v.length <= 120; },
    phone: function (v) { return /^\+998(33|50|55|77|88|90|91|93|94|95|97|98|99|20|61|62|65|66|67|69|70|71|72|73|74|75|76|79)\d{7}$/.test(v); },
    fullName: function (v) { return /^[\p{L}\p{M}'’ʻʼ`\-]{2,}( [\p{L}\p{M}'’ʻʼ`\-]{1,}){1,3}$/u.test(v) && v.length <= 80; },
    password: function (v) { return typeof v === "string" && v.length >= 8 && v.length <= 72 && /[A-Za-zЀ-ӿ]/.test(v) && /\d/.test(v); }
  };

  function uuid() {
    if (root.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }

  function debounce(fn, ms) { var h; return function () { var a = arguments, s = this; clearTimeout(h); h = setTimeout(function () { fn.apply(s, a); }, ms); }; }

  // Qidiruv uchun matnni normallashtirish (katta-kichik harf, apostrof turlari, diakritika)
  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/[‘’ʻʼ`´']/g, "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ё/g, "е")
      .replace(/\s+/g, " ").trim();
  }

  function formatYear(y) { return y < 0 ? t("book.bc", { n: Math.abs(y) }) : String(y); }
  function catName(id) { return t("cat." + id); }

  ZV.util = {
    escapeHtml: escapeHtml, formatPrice: formatPrice, formatNumber: formatNumber, normalizePhone: normalizePhone,
    formatPhone: formatPhone, phoneMask: phoneMask, validators: validators, uuid: uuid, debounce: debounce,
    bookById: function (id) { return bookMap[id]; }
  };

  /* =====================================================================
     2. MUQOVALAR
     Rasm manbasi: Open Library Covers API (bepul, ochiq foydalanish uchun).
       1) Kitob nomi + muallif bo'yicha Open Library'dan cover_i qidiriladi
       2) https://covers.openlibrary.org/b/id/{cover_i}-M.jpg yuklanadi
       3) Topilmasa / yuklanmasa — kitob nomi yozilgan chiroyli SVG muqova (fallback)
     Natijalar localStorage'da keshlanadi, rasmlar faqat ekranga kelganda yuklanadi.
     ===================================================================== */
  var Covers = (function () {
    var CACHE_KEY = "zv_covers_v2";
    var cache = {};
    try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {}; } catch (e) { cache = {}; }
    var pending = {};     // id -> Promise
    var queue = [];
    var active = 0;
    var MAX_PARALLEL = 4;
    var saveCache = debounce(function () { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {} }, 800);

    function xml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]; }); }

    function wrap(text, max, lines) {
      var words = String(text).split(/\s+/), out = [], line = "";
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (test.length > max && line) { out.push(line); line = words[i]; } else line = test;
        if (out.length === lines) break;
      }
      if (out.length < lines && line) out.push(line);
      if (out.length === lines && words.join(" ").length > out.join(" ").length) out[lines - 1] = out[lines - 1].replace(/.{0,2}$/, "…");
      return out;
    }

    // Har bir kitob uchun alohida, nomi yozilgan SVG muqova
    function fallback(book) {
      var cat = CATEGORIES.filter(function (c) { return c.id === book.category; })[0];
      var color = cat ? cat.color : "#1f4d3f";
      var title = i18n.bookTitle(book);
      var lines = wrap(title, 13, 4);
      var fs = lines.length > 3 ? 21 : 24;
      var startY = 150 - (lines.length - 1) * (fs * 0.62);
      var titleSvg = lines.map(function (l, i) {
        return '<text x="150" y="' + (startY + i * fs * 1.25) + '" font-size="' + fs + '" text-anchor="middle" fill="#fff8e6" font-family="Georgia,serif" font-weight="700">' + xml(l) + "</text>";
      }).join("");
      var authorLines = wrap(book.author.split(",")[0], 22, 2);
      var authorSvg = authorLines.map(function (l, i) {
        return '<text x="150" y="' + (330 + i * 18) + '" font-size="14" text-anchor="middle" fill="#e7c867" font-family="Arial,sans-serif" letter-spacing="1">' + xml(l.toUpperCase()) + "</text>";
      }).join("");
      var pattern = (book.id % 3 === 0)
        ? '<circle cx="250" cy="70" r="90" fill="#fff" opacity=".06"/><circle cx="40" cy="400" r="120" fill="#000" opacity=".1"/>'
        : (book.id % 3 === 1)
          ? '<path d="M0 360 L300 280 L300 450 L0 450Z" fill="#000" opacity=".12"/><path d="M0 0 L300 0 L300 40 L0 110Z" fill="#fff" opacity=".05"/>'
          : '<rect x="-40" y="40" width="380" height="16" fill="#fff" opacity=".07" transform="rotate(-12 150 225)"/><rect x="-40" y="390" width="380" height="40" fill="#000" opacity=".1" transform="rotate(-12 150 225)"/>';
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + color + '"/><stop offset="1" stop-color="#0d1f19"/></linearGradient></defs>' +
        '<rect width="300" height="450" fill="url(#g)"/>' + pattern +
        '<rect x="18" y="18" width="264" height="414" fill="none" stroke="#d4af37" stroke-width="1.5" opacity=".7"/>' +
        '<rect x="26" y="26" width="248" height="398" fill="none" stroke="#d4af37" stroke-width=".6" opacity=".5"/>' +
        '<text x="150" y="70" font-size="26" text-anchor="middle">' + xml(cat ? cat.icon : "📖") + "</text>" +
        '<line x1="110" y1="92" x2="190" y2="92" stroke="#d4af37" stroke-width="1.2"/>' +
        titleSvg +
        '<line x1="120" y1="300" x2="180" y2="300" stroke="#d4af37" stroke-width="1.2"/>' +
        authorSvg +
        '<text x="150" y="410" font-size="10" text-anchor="middle" fill="#d4af37" font-family="Georgia,serif" letter-spacing="4" opacity=".8">ZARVARAQ</text>' +
        "</svg>";
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    function coverUrl(coverId, size) { return "https://covers.openlibrary.org/b/id/" + coverId + "-" + (size || "M") + ".jpg"; }

    function searchOL(title, author) {
      var url = "https://openlibrary.org/search.json?title=" + encodeURIComponent(title) +
        "&author=" + encodeURIComponent(author) + "&limit=5&fields=cover_i";
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (data) {
        var docs = (data && data.docs) || [];
        for (var i = 0; i < docs.length; i++) if (docs[i].cover_i) return docs[i].cover_i;
        return 0;
      });
    }

    function resolve(book) {
      if (cache[book.id] !== undefined) return Promise.resolve(cache[book.id]);
      if (pending[book.id]) return pending[book.id];
      pending[book.id] = new Promise(function (done) {
        queue.push(function () {
          var author = book.author.split(",")[0].trim();
          searchOL(book.title.en, author)
            .then(function (id) { return id || (book.title.uz !== book.title.en ? searchOL(book.title.uz, author) : 0); })
            .then(function (id) { cache[book.id] = id || 0; saveCache(); done(cache[book.id]); })
            .catch(function () { done(0); }) // tarmoq xatosi keshlanmaydi
            .then(function () { active--; pump(); });
        });
        pump();
      });
      return pending[book.id];
    }

    function pump() {
      while (active < MAX_PARALLEL && queue.length) { active++; queue.shift()(); }
    }

    function apply(img) {
      var id = parseInt(img.dataset.book, 10);
      var book = bookMap[id];
      if (!book || img.dataset.loaded) return;
      img.dataset.loaded = "1";
      resolve(book).then(function (coverId) {
        if (!coverId) return;
        var real = new Image();
        real.referrerPolicy = "no-referrer";
        real.onload = function () {
          // Open Library rasm topmasa 1x1 px qaytaradi — bunday holatda fallback qoladi
          if (real.naturalWidth > 10) { img.src = real.src; img.classList.remove("is-loading"); }
        };
        real.src = coverUrl(coverId, img.dataset.size === "large" ? "L" : "M");
      });
    }

    var io = "IntersectionObserver" in root ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); apply(en.target); } });
    }, { rootMargin: "300px" }) : null;

    function observe(scope) {
      $$("img.js-cover:not([data-loaded])", scope || document).forEach(function (img) {
        if (io) io.observe(img); else apply(img);
      });
    }

    return { fallback: fallback, observe: observe };
  })();

  // Muqova <img> HTML'i. Avval fallback ko'rsatiladi, keyin haqiqiy rasm almashtiriladi.
  function coverImg(book, size) {
    return '<img class="js-cover is-loading" data-book="' + book.id + '" data-size="' + (size || "medium") + '"' +
      ' src="' + Covers.fallback(book) + '" alt="' + escapeHtml(i18n.bookTitle(book) + " — " + book.author) + '"' +
      ' loading="lazy" decoding="async" width="300" height="450" referrerpolicy="no-referrer">';
  }

  /* =====================================================================
     3. UI: toast, modal, tasdiqlash
     ===================================================================== */
  var openStack = [];
  var lastFocus = [];

  function lockScroll() { document.body.classList.toggle("no-scroll", openStack.length > 0 || $("#navLinks").classList.contains("open")); }

  function openModal(el) {
    if (!el || !el.hidden) return;
    lastFocus.push(document.activeElement);
    el.hidden = false;
    el.classList.remove("closing");
    openStack.push(el);
    lockScroll();
    i18n.apply(el);
    var focusEl = el.querySelector("input:not([type=hidden]):not([tabindex='-1']), select, textarea, .modal-close, [data-close]");
    setTimeout(function () { if (focusEl) focusEl.focus({ preventScroll: true }); }, 60);
  }

  function closeModal(el) {
    if (!el || el.hidden || el.classList.contains("closing")) return;
    el.classList.add("closing");
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () {
      el.hidden = true;
      el.classList.remove("closing");
      openStack = openStack.filter(function (m) { return m !== el; });
      lockScroll();
      var f = lastFocus.pop();
      if (f && f.focus && document.contains(f)) f.focus({ preventScroll: true });
      el.dispatchEvent(new Event("zv:closed"));
    }, reduce ? 0 : 240);
  }

  function toast(msg, type) {
    var box = $("#toasts");
    var el = document.createElement("div");
    var time = type === "error" ? 4500 : 3000;
    el.className = "toast " + (type || "");
    el.style.setProperty("--toast-time", time + "ms");
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = '<span class="toast-icon">' + (type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️") + "</span><span></span>";
    el.lastChild.textContent = msg; // textContent — XSS'dan himoya
    box.appendChild(el);
    while (box.children.length > 4) box.removeChild(box.firstChild);
    setTimeout(function () { el.classList.add("hide"); setTimeout(function () { el.remove(); }, 300); }, time);
  }

  function confirmDialog(message) {
    return new Promise(function (resolve) {
      var modal = $("#confirmModal");
      $("#confirmText").textContent = message;
      var result = false;
      var yes = $("#confirmYes");
      function onYes() { result = true; closeModal(modal); }
      function onClosed() {
        yes.removeEventListener("click", onYes);
        modal.removeEventListener("zv:closed", onClosed);
        resolve(result);
      }
      yes.addEventListener("click", onYes);
      modal.addEventListener("zv:closed", onClosed);
      openModal(modal);
      setTimeout(function () { yes.focus(); }, 80);
    });
  }

  ZV.ui = { toast: toast, openModal: openModal, closeModal: closeModal, confirm: confirmDialog, coverImg: coverImg };

  /* =====================================================================
     4. KITOB KARTASI
     ===================================================================== */
  function badges(b) {
    var out = "";
    if (b.stock < 1) out += '<span class="badge badge-oos">' + escapeHtml(t("book.outOfStock")) + "</span>";
    if (b.bestseller) out += '<span class="badge badge-best">' + escapeHtml(t("book.bestseller")) + "</span>";
    if (b.isNew) out += '<span class="badge badge-new">' + escapeHtml(t("book.new")) + "</span>";
    if (b.discount) out += '<span class="badge badge-sale">−' + b.discount + "%</span>";
    return out ? '<div class="badges">' + out + "</div>" : "";
  }

  function stars(rating) {
    return '<span class="stars-bar" style="--pct:' + (rating / 5 * 100).toFixed(0) + '%" aria-hidden="true"></span>';
  }

  function bookCard(b, i) {
    var title = escapeHtml(i18n.bookTitle(b));
    var oos = b.stock < 1;
    return '<article class="book-card reveal" style="--i:' + ((i || 0) % 5) + '" data-id="' + b.id + '">' +
      '<button type="button" class="book-cover" data-action="details" data-id="' + b.id + '" aria-label="' + escapeHtml(t("book.details")) + ": " + title + '">' +
        coverImg(b) + badges(b) +
        '<span class="cover-overlay"><span>' + escapeHtml(t("book.details")) + "</span></span>" +
      "</button>" +
      '<div class="book-info">' +
        '<div class="book-cat">' + escapeHtml(catName(b.category)) + "</div>" +
        '<h3 class="book-title" data-action="details" data-id="' + b.id + '">' + title + "</h3>" +
        '<div class="book-author">' + escapeHtml(b.author) + "</div>" +
        '<div class="rating">' + stars(b.rating) + "<b>" + b.rating.toFixed(1) + "</b></div>" +
        '<p class="book-desc">' + escapeHtml(i18n.bookDescription(b)) + "</p>" +
        '<div class="price-row"><span class="price">' + formatPrice(b.price) + "</span>" +
          (b.oldPrice ? '<span class="old-price">' + formatPrice(b.oldPrice) + "</span>" : "") + "</div>" +
        '<div class="card-actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-action="add" data-id="' + b.id + '"' + (oos ? " disabled" : "") + ">" +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>' + escapeHtml(t("book.add")) + "</button>" +
          '<button type="button" class="btn btn-gold btn-sm btn-buy" data-action="buy" data-id="' + b.id + '"' + (oos ? " disabled" : "") + ">" + escapeHtml(t("book.buy")) + "</button>" +
          '<button type="button" class="btn btn-ghost btn-sm btn-details" data-action="details" data-id="' + b.id + '">' + escapeHtml(t("book.details")) + "</button>" +
        "</div>" +
      "</div></article>";
  }

  function renderBooks(container, list) {
    container.innerHTML = list.map(bookCard).join("");
    Covers.observe(container);
    Reveal.observe(container);
  }

  /* =====================================================================
     5. KITOB BATAFSIL OYNASI
     ===================================================================== */
  function openBook(id) {
    var b = bookMap[id];
    if (!b) return;
    var oos = b.stock < 1;
    var similar = BOOKS.filter(function (x) { return x.category === b.category && x.id !== b.id; })
      .sort(function (a, c) { return c.popularity - a.popularity; }).slice(0, 5);
    var langName = t("lang." + b.language);
    $("#bookModalBody").innerHTML =
      '<div class="book-detail">' +
        '<div class="book-cover">' + coverImg(b, "large") + badges(b) + "</div>" +
        "<div>" +
          '<div class="bd-head"><div class="bd-cat">' + escapeHtml(catName(b.category)) + "</div>" +
          '<h2 class="bd-title" id="bookModalTitle">' + escapeHtml(i18n.bookTitle(b)) + "</h2>" +
          '<div class="bd-author">' + escapeHtml(t("book.author")) + ": <b>" + escapeHtml(b.author) + "</b></div>" +
          '<div class="rating">' + stars(b.rating) + "<b>" + b.rating.toFixed(1) + "</b> · " + escapeHtml(t("book.reviews", { n: b.reviews })) + "</div></div>" +
          '<div class="bd-price"><span class="price">' + formatPrice(b.price) + "</span>" +
            (b.oldPrice ? '<span class="old-price">' + formatPrice(b.oldPrice) + '</span><span class="badge badge-sale">−' + b.discount + "%</span>" : "") + "</div>" +
          '<div class="bd-desc"><h3>' + escapeHtml(t("book.about")) + "</h3><p>" + escapeHtml(i18n.bookDescription(b)) + "</p></div>" +
          '<dl class="specs">' +
            "<div><dt>" + escapeHtml(t("book.id")) + "</dt><dd>#" + String(b.id).padStart(4, "0") + "</dd></div>" +
            "<div><dt>" + escapeHtml(t("book.pages")) + "</dt><dd>" + b.pages + "</dd></div>" +
            "<div><dt>" + escapeHtml(t("book.language")) + "</dt><dd>" + escapeHtml(langName) + "</dd></div>" +
            "<div><dt>" + escapeHtml(t("book.year")) + "</dt><dd>" + escapeHtml(formatYear(b.year)) + "</dd></div>" +
            "<div><dt>" + escapeHtml(t("book.category")) + "</dt><dd>" + escapeHtml(catName(b.category)) + "</dd></div>" +
            "<div><dt>" + escapeHtml(t("book.stock")) + "</dt><dd class=\"" + (oos ? "stock-no" : "stock-ok") + "\">" +
              escapeHtml(oos ? t("book.outOfStock") : t("book.inStock", { n: b.stock })) + "</dd></div>" +
          "</dl>" +
          '<div class="bd-actions">' +
            '<button type="button" class="btn btn-primary btn-lg" data-action="add" data-id="' + b.id + '"' + (oos ? " disabled" : "") + ">" + escapeHtml(t("book.addFull")) + "</button>" +
            '<button type="button" class="btn btn-gold btn-lg" data-action="buy" data-id="' + b.id + '"' + (oos ? " disabled" : "") + ">" + escapeHtml(t("book.buy")) + "</button>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="similar"><h3>' + escapeHtml(t("book.similar")) + '</h3><div class="similar-list">' +
        similar.map(function (s) {
          return '<button type="button" class="similar-item" data-action="details" data-id="' + s.id + '"><span class="book-cover">' + coverImg(s) + "</span><span>" + escapeHtml(i18n.bookTitle(s)) + "</span></button>";
        }).join("") +
      "</div></div>";
    var modal = $("#bookModal");
    modal.dataset.book = String(id);
    Covers.observe(modal);
    if (modal.hidden) openModal(modal);
    else $(".modal-panel", modal).scrollTop = 0;
  }

  /* =====================================================================
     6. QIDIRUV VA FILTRLASH
     ===================================================================== */
  // Har bir kitob uchun barcha tillardagi qidiruv matni (bir marta hisoblanadi)
  var searchIndex = {};
  function buildIndex() {
    BOOKS.forEach(function (b) {
      var cats = i18n.SUPPORTED.map(function (l) { return i18n.tIn(l, "cat." + b.category); }).join(" ");
      searchIndex[b.id] = norm([b.title.uz, b.title.en, b.title.ru, b.author, cats].join(" | "));
    });
  }

  function search(query, list) {
    var q = norm(query);
    if (!q) return list || BOOKS;
    var terms = q.split(" ").filter(Boolean);
    return (list || BOOKS).filter(function (b) {
      var hay = searchIndex[b.id];
      return terms.every(function (term) { return hay.indexOf(term) !== -1; });
    });
  }

  var SORTERS = {
    all: function (a, b) { return a.id - b.id; },
    popular: function (a, b) { return b.popularity - a.popularity; },
    newest: function (a, b) { return b.year - a.year || b.id - a.id; },
    cheap: function (a, b) { return a.price - b.price; },
    expensive: function (a, b) { return b.price - a.price; },
    rating: function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
    discount: function (a, b) { return b.discount - a.discount || a.price - b.price; }
  };

  var catalog = { q: "", cat: "", sort: "all", min: "", max: "", chips: {}, page: 1, results: [] };

  function applyCatalog() {
    var list = search(catalog.q);
    if (catalog.cat) list = list.filter(function (b) { return b.category === catalog.cat; });
    var min = parseInt(catalog.min, 10), max = parseInt(catalog.max, 10);
    if (!isNaN(min)) list = list.filter(function (b) { return b.price >= min; });
    if (!isNaN(max)) list = list.filter(function (b) { return b.price <= max; });
    if (catalog.chips.bestseller) list = list.filter(function (b) { return b.bestseller; });
    if (catalog.chips["new"]) list = list.filter(function (b) { return b.isNew; });
    if (catalog.chips.discount || catalog.sort === "discount") list = list.filter(function (b) { return b.discount > 0; });
    catalog.results = list.slice().sort(SORTERS[catalog.sort] || SORTERS.all);
  }

  function renderCatalog(append) {
    var grid = $("#catalogGrid");
    var total = catalog.results.length;
    var end = catalog.page * CONFIG.pageSize;
    var start = append ? (catalog.page - 1) * CONFIG.pageSize : 0;
    var slice = catalog.results.slice(start, end);
    if (append) {
      grid.insertAdjacentHTML("beforeend", slice.map(bookCard).join(""));
      Covers.observe(grid); Reveal.observe(grid);
    } else renderBooks(grid, slice);
    $("#catCount").textContent = t("catalog.found", { n: total });
    $("#catalogEmpty").hidden = total > 0;
    $("#loadMore").hidden = end >= total;
  }

  function syncCatalogForm() {
    $("#catSearch").value = catalog.q;
    $("#catCategory").value = catalog.cat;
    $("#catSort").value = catalog.sort;
    $("#catMin").value = catalog.min;
    $("#catMax").value = catalog.max;
    $$("#catChips .chip").forEach(function (c) {
      var on = !!catalog.chips[c.dataset.chip];
      c.classList.toggle("active", on); c.setAttribute("aria-pressed", String(on));
    });
  }

  function catalogToHash() {
    var p = new URLSearchParams();
    if (catalog.q) p.set("q", catalog.q);
    if (catalog.cat) p.set("cat", catalog.cat);
    if (catalog.sort !== "all") p.set("sort", catalog.sort);
    if (catalog.min) p.set("min", catalog.min);
    if (catalog.max) p.set("max", catalog.max);
    var f = Object.keys(catalog.chips).filter(function (k) { return catalog.chips[k]; });
    if (f.length) p.set("f", f.join(","));
    var qs = p.toString();
    var hash = "#/catalog" + (qs ? "?" + qs : "");
    if (location.hash !== hash) history.replaceState(null, "", hash);
    setActiveNav("catalog", p);
  }

  function updateCatalog() {
    catalog.page = 1;
    applyCatalog(); renderCatalog(false); catalogToHash();
  }

  function fillCategorySelect() {
    var sel = $("#catCategory"); var cur = sel.value;
    sel.innerHTML = '<option value="">' + escapeHtml(t("cat.all")) + "</option>" +
      CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + c.icon + " " + escapeHtml(catName(c.id)) + "</option>"; }).join("");
    sel.value = cur;
  }

  /* =====================================================================
     7. SAHIFALAR (views) VA ROUTER
     ===================================================================== */
  function catCard(c) {
    var count = BOOKS.filter(function (b) { return b.category === c.id; }).length;
    return '<a class="cat-card reveal" href="#/catalog?cat=' + c.id + '" style="--cat-color:' + c.color + '">' +
      '<span class="cat-icon" aria-hidden="true">' + c.icon + "</span>" +
      '<span class="cat-name">' + escapeHtml(catName(c.id)) + "</span>" +
      '<span class="cat-count">' + escapeHtml(t("sec.booksCount", { n: count })) + "</span></a>";
  }

  function byPopularity(a, b) { return b.popularity - a.popularity; }

  function renderHome() {
    var best = BOOKS.filter(function (b) { return b.bestseller && b.stock > 0; }).sort(byPopularity);
    var popular = BOOKS.filter(function (b) { return !b.bestseller && b.stock > 0; }).sort(function (a, b) { return b.rating * 1000 + b.reviews - (a.rating * 1000 + a.reviews); }).slice(0, 10);
    var fresh = BOOKS.filter(function (b) { return b.isNew; }).sort(SORTERS.newest).slice(0, 10);
    var sale = BOOKS.filter(function (b) { return b.discount > 0 && b.stock > 0; }).sort(SORTERS.discount).slice(0, 15);

    $("#heroBooks").innerHTML = [best[2], best[0], best[1]].map(function (b) {
      return '<div class="hero-book">' + coverImg(b, "large") + "</div>";
    }).join("");
    Covers.observe($("#heroBooks"));
    renderBooks($("#homePopular"), popular);
    renderBooks($("#homeBest"), best.slice(0, 15));
    renderBooks($("#homeNew"), fresh);
    renderBooks($("#homeSale"), sale);
    $("#homeCats").innerHTML = CATEGORIES.slice(0, 10).map(catCard).join("");
    Reveal.observe($("#homeCats"));
    $("#statBooks").textContent = BOOKS.length;
  }

  function renderCategories() {
    $("#allCats").innerHTML = CATEGORIES.map(catCard).join("");
    Reveal.observe($("#allCats"));
  }

  function renderAbout() {
    var picks = [1, 37, 145, 199, 163, 109].map(function (id) { return bookMap[id]; });
    $("#aboutBooks").innerHTML = picks.map(function (b) { return '<div class="mini-cover">' + coverImg(b) + "</div>"; }).join("");
    Covers.observe($("#aboutBooks"));
  }

  function renderFooterCats() {
    $("#footerCats").innerHTML = CATEGORIES.slice(0, 7).map(function (c) {
      return '<li><a href="#/catalog?cat=' + c.id + '">' + escapeHtml(catName(c.id)) + "</a></li>";
    }).join("");
  }

  function setActiveNav(view, params) {
    var key = view;
    if (view === "catalog" && params) {
      var f = params.get("f") || "";
      if (f === "bestseller") key = "bestseller";
      else if (f === "new") key = "new";
    }
    $$("[data-nav]").forEach(function (a) {
      var on = a.dataset.nav === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  var currentView = null;
  function route() {
    var hash = location.hash.replace(/^#/, "") || "/";
    var parts = hash.split("?");
    var path = parts[0].replace(/\/+$/, "") || "/";
    var params = new URLSearchParams(parts[1] || "");

    // #/book/12 — kitob oynasini ochish (ulashiladigan havola)
    var m = path.match(/^\/book\/(\d+)$/);
    if (m) {
      if (!currentView) showView("home");
      openBook(parseInt(m[1], 10));
      return;
    }

    var map = { "/": "home", "/catalog": "catalog", "/categories": "categories", "/about": "about", "/contact": "contact" };
    var view = map[path] || "notfound";

    if (view === "catalog") {
      var chips = {};
      (params.get("f") || "").split(",").forEach(function (f) { if (["bestseller", "new", "discount"].indexOf(f) !== -1) chips[f] = true; });
      var sort = params.get("sort");
      var cat = params.get("cat");
      catalog.q = (params.get("q") || "").slice(0, 80);
      catalog.cat = CATEGORIES.some(function (c) { return c.id === cat; }) ? cat : "";
      catalog.sort = SORTERS[sort] ? sort : "all";
      catalog.min = /^\d+$/.test(params.get("min") || "") ? params.get("min") : "";
      catalog.max = /^\d+$/.test(params.get("max") || "") ? params.get("max") : "";
      catalog.chips = chips;
      syncCatalogForm();
      catalog.page = 1; applyCatalog(); renderCatalog(false);
    }
    showView(view);
    setActiveNav(view, params);
    closeMenu();
  }

  function showView(view) {
    var changed = view !== currentView;
    $$(".view").forEach(function (v) { v.hidden = v.dataset.view !== view; });
    currentView = view;
    if (view === "about") renderAbout();
    if (changed) {
      var html = document.documentElement;
      html.style.scrollBehavior = "auto"; // sahifa almashganda darhol tepaga
      root.scrollTo(0, 0);
      html.style.scrollBehavior = "";
    }
    Reveal.observe($('[data-view="' + view + '"]'));
  }

  /* =====================================================================
     8. SCROLL REVEAL
     ===================================================================== */
  var Reveal = (function () {
    var io = "IntersectionObserver" in root ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }) : null;
    return {
      observe: function (scope) {
        $$(".reveal:not(.in)", scope || document).forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });
      }
    };
  })();

  /* =====================================================================
     9. TEMA, TIL, MENYU, QIDIRUV OYNASI
     ===================================================================== */
  function setTheme(theme, silent) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("zv_theme", theme); } catch (e) {}
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1411" : "#1f4d3f");
    if (!silent) toast(t(theme === "dark" ? "toast.theme.dark" : "toast.theme.light"));
  }

  function openMenu() {
    $("#navLinks").classList.add("open"); $("#navBackdrop").classList.add("show");
    $("#burger").setAttribute("aria-expanded", "true"); lockScroll();
  }
  function closeMenu() {
    $("#navLinks").classList.remove("open"); $("#navBackdrop").classList.remove("show");
    $("#burger").setAttribute("aria-expanded", "false"); lockScroll();
  }

  function highlight(text, q) {
    var safe = escapeHtml(text);
    var terms = norm(q).split(" ").filter(function (x) { return x.length > 1; });
    if (!terms.length) return safe;
    terms.forEach(function (term) {
      var re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      safe = safe.replace(re, "<mark>$1</mark>");
    });
    return safe;
  }

  function renderSearch(q) {
    var box = $("#searchResults");
    if (!q.trim()) { box.innerHTML = ""; return; }
    var res = search(q).sort(byPopularity);
    if (!res.length) { box.innerHTML = '<div class="sr-empty">' + escapeHtml(t("catalog.none")) + "</div>"; return; }
    box.innerHTML = res.slice(0, 8).map(function (b) {
      return '<button type="button" class="sr-item" data-action="details" data-id="' + b.id + '">' + coverImg(b, "small") +
        "<span><b>" + highlight(i18n.bookTitle(b), q) + "</b><small>" + highlight(b.author, q) + " · " + escapeHtml(catName(b.category)) + "</small></span>" +
        "<strong>" + formatPrice(b.price) + "</strong></button>";
    }).join("") +
      '<button type="button" class="sr-all" id="searchAll">' + escapeHtml(t("sec.viewAll")) + " (" + res.length + ") →</button>";
    Covers.observe(box);
  }

  function openSearch() {
    var ov = $("#searchOverlay");
    ov.hidden = false;
    openStack.push(ov); lockScroll();
    setTimeout(function () { $("#searchInput").focus(); }, 30);
  }
  function closeSearch() {
    var ov = $("#searchOverlay");
    if (ov.hidden) return;
    ov.hidden = true;
    openStack = openStack.filter(function (m) { return m !== ov; }); lockScroll();
  }

  function fillContacts() {
    $$('[data-contact="phone"]').forEach(function (a) { a.href = "tel:" + CONFIG.phone; });
    $$('[data-contact="email"]').forEach(function (a) { a.href = "mailto:" + CONFIG.email; });
    $$('[data-contact="telegram"]').forEach(function (a) { a.href = CONFIG.telegram; });
    $$('[data-contact="instagram"]').forEach(function (a) { a.href = CONFIG.instagram; });
    $$('[data-contact-value="phone"]').forEach(function (s) { s.textContent = formatPhone(CONFIG.phone); });
    $$('[data-contact-value="email"]').forEach(function (s) { s.textContent = CONFIG.email; });
  }

  // Til o'zgarganda dinamik qismlarni qayta chizish
  function rerenderAll() {
    fillCategorySelect();
    renderFooterCats();
    renderHome();
    renderCategories();
    if (currentView === "catalog") { var p = catalog.page; applyCatalog(); catalog.page = 1; renderCatalog(false); while (catalog.page < p) { catalog.page++; renderCatalog(true); } }
    if (currentView === "about") renderAbout();
    var bm = $("#bookModal");
    if (!bm.hidden) openBook(parseInt(bm.dataset.book, 10));
    var q = $("#searchInput").value; if (q) renderSearch(q);
    Reveal.observe();
  }

  /* =====================================================================
     10. HODISALAR (event listeners)
     ===================================================================== */
  function bindEvents() {
    // Kitob tugmalari — bitta umumiy listener (event delegation)
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-action]");
      if (el) {
        var id = parseInt(el.dataset.id, 10);
        var action = el.dataset.action;
        if (action === "details") { closeSearch(); openBook(id); }
        else if (action === "add") ZV.cart.add(id, 1);
        else if (action === "buy") { closeModal($("#bookModal")); ZV.cart.buyNow(id); }
        return;
      }
      var closer = e.target.closest("[data-close]");
      if (closer) {
        var m = closer.closest(".modal, .drawer");
        if (m) closeModal(m);
      }
      if (e.target.id === "searchAll") {
        var q = $("#searchInput").value.trim();
        closeSearch();
        location.hash = "#/catalog?q=" + encodeURIComponent(q);
      }
    });

    // Klaviatura: Esc — oynani yopish, "/" — qidiruv
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if ($("#navLinks").classList.contains("open")) { closeMenu(); return; }
        var top = openStack[openStack.length - 1];
        if (!top) return;
        if (top.id === "searchOverlay") closeSearch(); else closeModal(top);
      } else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName) && !openStack.length) {
        e.preventDefault(); openSearch();
      } else if (e.key === "Tab" && openStack.length) {
        // Fokusni ochiq oyna ichida ushlab turish
        var modal = openStack[openStack.length - 1];
        var f = $$('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea', modal).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });

    root.addEventListener("hashchange", function () {
      // Hash o'zgarsa ochiq kitob oynasi/savatcha yopiladi
      ["#bookModal", "#cartDrawer"].forEach(function (s) { if (!$(s).hidden && !/^#\/book\//.test(location.hash)) closeModal($(s)); });
      route();
    });

    $("#cartBtn").addEventListener("click", function () { openModal($("#cartDrawer")); });
    $("#themeToggle").addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
    // Mobil menyudagi nusxalar (≤480px)
    $("#themeToggleM").addEventListener("click", function () { $("#themeToggle").click(); });
    $("#authBtnM").addEventListener("click", function () { closeMenu(); $("#authBtn").click(); });
    $("#langSelect").addEventListener("change", function (e) { i18n.setLang(e.target.value); });
    document.addEventListener("zv:langchange", function () { rerenderAll(); toast(t("toast.lang")); });

    $("#burger").addEventListener("click", function () { $("#navLinks").classList.contains("open") ? closeMenu() : openMenu(); });
    $("#navBackdrop").addEventListener("click", closeMenu);
    $$("#navLinks a").forEach(function (a) { a.addEventListener("click", closeMenu); });

    // Qidiruv oynasi
    $("#searchBtn").addEventListener("click", openSearch);
    $("#searchClose").addEventListener("click", closeSearch);
    $("#searchOverlay").addEventListener("click", function (e) { if (e.target.id === "searchOverlay") closeSearch(); });
    $("#searchInput").addEventListener("input", debounce(function (e) { renderSearch(e.target.value); }, 150));
    $("#searchInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); var q = e.target.value.trim(); closeSearch(); location.hash = "#/catalog?q=" + encodeURIComponent(q); }
    });

    // Katalog filtrlari
    $("#catalogForm").addEventListener("submit", function (e) { e.preventDefault(); });
    $("#catSearch").addEventListener("input", debounce(function (e) { catalog.q = e.target.value.slice(0, 80); updateCatalog(); }, 200));
    $("#catCategory").addEventListener("change", function (e) { catalog.cat = e.target.value; updateCatalog(); });
    $("#catSort").addEventListener("change", function (e) { catalog.sort = e.target.value; updateCatalog(); });
    var onPrice = debounce(function () {
      var mn = $("#catMin").value, mx = $("#catMax").value;
      catalog.min = /^\d+$/.test(mn) ? mn : ""; catalog.max = /^\d+$/.test(mx) ? mx : "";
      updateCatalog();
    }, 350);
    $("#catMin").addEventListener("input", onPrice);
    $("#catMax").addEventListener("input", onPrice);
    $("#catReset").addEventListener("click", function (e) {
      e.preventDefault();
      catalog.q = ""; catalog.cat = ""; catalog.sort = "all"; catalog.min = ""; catalog.max = ""; catalog.chips = {};
      syncCatalogForm(); updateCatalog();
    });
    $("#catChips").addEventListener("click", function (e) {
      var c = e.target.closest(".chip"); if (!c) return;
      catalog.chips[c.dataset.chip] = !catalog.chips[c.dataset.chip];
      syncCatalogForm(); updateCatalog();
    });
    $("#loadMore").addEventListener("click", function () { catalog.page++; renderCatalog(true); });

    // Newsletter
    $("#newsletterForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.currentTarget, input = $("#newsletterEmail"), email = input.value.trim().toLowerCase();
      if (!validators.email(email)) {
        form.classList.remove("invalid"); void form.offsetWidth; form.classList.add("invalid");
        toast(t("news.invalid"), "error"); input.focus(); return;
      }
      form.classList.remove("invalid");
      try {
        var list = JSON.parse(localStorage.getItem("zv_newsletter") || "[]");
        if (list.indexOf(email) === -1) list.push(email);
        localStorage.setItem("zv_newsletter", JSON.stringify(list.slice(-50)));
      } catch (err) {}
      input.value = "";
      toast(t("news.success"), "success");
    });

    // Navbar soyasi va "yuqoriga" tugmasi
    var ticking = false;
    root.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = root.scrollY;
        $("#header").classList.toggle("scrolled", y > 10);
        $("#toTop").classList.toggle("show", y > 700);
        ticking = false;
      });
    }, { passive: true });
    $("#toTop").addEventListener("click", function () { root.scrollTo({ top: 0, behavior: "smooth" }); });

    // Ekran kattalashganda mobil menyuni yopish
    root.addEventListener("resize", debounce(function () { if (root.innerWidth > 1300) closeMenu(); }, 150));
  }

  /* =====================================================================
     11. ISHGA TUSHIRISH
     ===================================================================== */
  function init() {
    buildIndex(); // qidiruv indeksi (3 tildagi nomlar + muallif + kategoriya)

    $("#langSelect").value = i18n.getLang();
    $("#year").textContent = new Date().getFullYear();
    i18n.apply();
    fillContacts();
    fillCategorySelect();
    renderFooterCats();
    renderHome();
    renderCategories();
    bindEvents();
    ZV.cart.init();
    ZV.auth.init();
    route();

    // Yuklanish animatsiyasini yashirish
    setTimeout(function () { $("#pageLoader").classList.add("done"); }, 350);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
