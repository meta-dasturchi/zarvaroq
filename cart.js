/* =====================================================================
   ZARVARAQ — cart.js
   Savatcha + Checkout + buyurtmani Netlify Function'ga yuborish.
   Bog'liqliklar (ish vaqtida chaqiriladi):
     ZV.BOOKS (books.js), ZV.i18n (translations.js), ZV.ui va ZV.util (app.js)
   Savatcha localStorage("zv_cart") da saqlanadi: [{ id, qty }]
   Narxlar localStorage'da SAQLANMAYDI — har doim books.js dan olinadi.
   ===================================================================== */
(function (root) {
  "use strict";

  var STORAGE_KEY = "zv_cart";
  var MAX_QTY = 20;            // bitta kitobdan maksimal soni (server ham shuni tekshiradi)
  var ORDER_ENDPOINT = "/api/order";
  var items = [];              // [{ id: Number, qty: Number }]
  var pendingRequestId = null; // takroriy yuborishning oldini olish (idempotency)

  var ZV = root.ZV = root.ZV || {};
  function t(k, v) { return ZV.i18n.t(k, v); }
  function $(sel) { return document.querySelector(sel); }

  /* ---------- Saqlash / yuklash ---------- */
  function bookById(id) { return ZV.util.bookById(id); }

  function load() {
    var raw = [];
    try { raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (e) { raw = []; }
    if (!Array.isArray(raw)) raw = [];
    // Ma'lumotni tekshirish: noma'lum ID, noto'g'ri son yoki tugagan kitoblar olib tashlanadi
    var seen = {};
    items = raw.reduce(function (acc, it) {
      var id = parseInt(it && it.id, 10);
      var qty = parseInt(it && it.qty, 10);
      var book = bookById(id);
      if (!book || seen[id] || !(qty > 0) || book.stock < 1) return acc;
      seen[id] = true;
      acc.push({ id: id, qty: Math.min(qty, book.stock, MAX_QTY) });
      return acc;
    }, []);
    save();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) {}
  }

  /* ---------- Hisob-kitob ---------- */
  function count() { return items.reduce(function (s, i) { return s + i.qty; }, 0); }
  function lineTotal(it) { return bookById(it.id).price * it.qty; }
  function total() { return items.reduce(function (s, i) { return s + lineTotal(i); }, 0); }
  function find(id) { return items.filter(function (i) { return i.id === id; })[0]; }

  /* ---------- Amallar ---------- */
  function add(id, qty) {
    var book = bookById(id);
    if (!book) return false;
    qty = qty || 1;
    if (book.stock < 1) { ZV.ui.toast(t("cart.outOfStock"), "error"); return false; }
    var it = find(id);
    var current = it ? it.qty : 0;
    var limit = Math.min(book.stock, MAX_QTY);
    if (current + qty > limit) {
      ZV.ui.toast(t("cart.maxStock", { n: limit }), "error");
      if (current >= limit) return false;
      qty = limit - current;
    }
    if (it) it.qty += qty; else items.push({ id: id, qty: qty });
    save(); update(true);
    ZV.ui.toast(t("cart.added", { t: ZV.i18n.bookTitle(book) }), "success");
    return true;
  }

  function setQty(id, qty) {
    var it = find(id); var book = bookById(id);
    if (!it || !book) return;
    var limit = Math.min(book.stock, MAX_QTY);
    if (qty > limit) { ZV.ui.toast(t("cart.maxStock", { n: limit }), "error"); qty = limit; }
    if (qty < 1) return;
    it.qty = qty;
    save(); update();
  }

  function increase(id) { var it = find(id); if (it) setQty(id, it.qty + 1); }

  function decrease(id) {
    var it = find(id); if (!it) return;
    if (it.qty > 1) { setQty(id, it.qty - 1); return; }
    // Soni 1 bo'lsa — tasdiqlash so'raladi
    ZV.ui.confirm(t("cart.confirmRemove")).then(function (ok) { if (ok) remove(id); });
  }

  function remove(id) {
    var row = document.querySelector('.cart-item[data-id="' + id + '"]');
    var doRemove = function () {
      items = items.filter(function (i) { return i.id !== id; });
      save(); update();
      ZV.ui.toast(t("cart.removed"));
    };
    if (row && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      row.classList.add("removing");
      setTimeout(doRemove, 280);
    } else doRemove();
  }

  function clear(silent) {
    items = []; save(); update();
    if (!silent) ZV.ui.toast(t("cart.cleared"));
  }

  /* ---------- Chizish (render) ---------- */
  function updateBadge(bump) {
    var badge = $("#cartCount");
    if (!badge) return;
    badge.textContent = String(count());
    if (bump) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
  }

  function renderDrawer() {
    var body = $("#cartItems"); var foot = $("#cartFoot");
    if (!body) return;
    var esc = ZV.util.escapeHtml, fmt = ZV.util.formatPrice;
    $("#cartHeadCount").textContent = items.length ? "(" + count() + ")" : "";

    if (!items.length) {
      body.innerHTML =
        '<div class="cart-empty"><div class="empty-icon">🛒</div>' +
        "<h3>" + esc(t("cart.empty")) + "</h3><p>" + esc(t("cart.emptyText")) + "</p>" +
        '<a href="#/catalog" class="btn btn-primary" data-close>' + esc(t("cart.browse")) + "</a></div>";
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map(function (it) {
      var b = bookById(it.id);
      var limit = Math.min(b.stock, MAX_QTY);
      return '<div class="cart-item" data-id="' + b.id + '">' +
        '<div class="ci-cover">' + ZV.ui.coverImg(b, "small") + "</div>" +
        "<div>" +
          '<div class="ci-title">' + esc(ZV.i18n.bookTitle(b)) + "</div>" +
          '<div class="ci-author">' + esc(b.author) + "</div>" +
          '<div class="ci-bottom">' +
            '<div class="qty">' +
              '<button type="button" data-cart="dec" data-id="' + b.id + '" aria-label="' + esc(t("cart.decrease")) + '">−</button>' +
              "<span>" + it.qty + "</span>" +
              '<button type="button" data-cart="inc" data-id="' + b.id + '" aria-label="' + esc(t("cart.increase")) + '"' + (it.qty >= limit ? " disabled" : "") + ">+</button>" +
            "</div>" +
            '<div class="ci-price">' + fmt(lineTotal(it)) + "<small>" + fmt(b.price) + " × " + it.qty + "</small></div>" +
          "</div>" +
          '<button type="button" class="ci-remove" data-cart="remove" data-id="' + b.id + '">' + esc(t("cart.remove")) + "</button>" +
        "</div></div>";
    }).join("");
    $("#cartSubtotal").textContent = fmt(total());
    $("#cartTotal").textContent = fmt(total());
  }

  function update(bump) {
    updateBadge(bump);
    renderDrawer();
    var co = $("#checkoutModal");
    if (co && !co.hidden) renderSummary();
  }

  /* ---------- Checkout ---------- */
  function fillRegions() {
    var sel = $("#regionSelect"); if (!sel) return;
    var current = sel.value;
    sel.innerHTML = '<option value="">' + ZV.util.escapeHtml(t("co.regionPh")) + "</option>" +
      ZV.i18n.REGIONS.map(function (r) {
        return '<option value="' + r + '">' + ZV.util.escapeHtml(t("region." + r)) + "</option>";
      }).join("");
    sel.value = current;
  }

  function renderSummary() {
    var esc = ZV.util.escapeHtml, fmt = ZV.util.formatPrice;
    $("#checkoutItems").innerHTML = items.map(function (it) {
      var b = bookById(it.id);
      return "<li>" + ZV.ui.coverImg(b, "small") +
        "<span>" + esc(ZV.i18n.bookTitle(b)) + "<small>" + it.qty + " " + esc(t("pcs")) + " × " + fmt(b.price) + "</small></span>" +
        "<b>" + fmt(lineTotal(it)) + "</b></li>";
    }).join("");
    $("#checkoutTotal").textContent = fmt(total());
  }

  function openCheckout() {
    if (!items.length) { ZV.ui.toast(t("co.err.empty"), "error"); return; }
    ZV.ui.closeModal($("#cartDrawer"));
    fillRegions();
    renderSummary();
    clearErrors($("#checkoutForm"));
    $("#checkoutAlert").hidden = true;
    // Kirgan foydalanuvchi ma'lumotlarini avtomatik to'ldirish
    var user = ZV.auth && ZV.auth.currentUser();
    var form = $("#checkoutForm");
    if (user) {
      if (!form.fullName.value) form.fullName.value = (user.firstName + " " + user.lastName).trim();
      if (form.phone.value.replace(/\D/g, "").length <= 3 && user.phone) form.phone.value = ZV.util.formatPhone(user.phone);
    }
    form.dataset.openedAt = String(Date.now());
    ZV.ui.openModal($("#checkoutModal"));
  }

  function clearErrors(form) {
    form.querySelectorAll(".form-field.has-error").forEach(function (f) { f.classList.remove("has-error"); });
    form.querySelectorAll("[data-error]").forEach(function (e) { e.textContent = ""; });
  }

  function setError(form, name, msg) {
    var el = form.querySelector('[data-error="' + name + '"]');
    if (el) { el.textContent = msg; el.closest(".form-field").classList.add("has-error"); }
  }

  function validateCheckout(form) {
    clearErrors(form);
    var v = ZV.util.validators;
    var data = {
      fullName: form.fullName.value.trim().replace(/\s+/g, " "),
      phone: ZV.util.normalizePhone(form.phone.value),
      region: form.region.value,
      district: form.district.value.trim(),
      address: form.address.value.trim(),
      comment: form.comment.value.trim()
    };
    var ok = true;
    if (!v.fullName(data.fullName)) { setError(form, "fullName", t("co.err.name")); ok = false; }
    if (!v.phone(data.phone)) { setError(form, "phone", t("co.err.phone")); ok = false; }
    if (ZV.i18n.REGIONS.indexOf(data.region) === -1) { setError(form, "region", t("co.err.region")); ok = false; }
    if (data.district.length < 2 || data.district.length > 60) { setError(form, "district", t("co.err.district")); ok = false; }
    if (data.address.length < 5 || data.address.length > 160) { setError(form, "address", t("co.err.address")); ok = false; }
    if (data.comment.length > 500) { setError(form, "comment", t("co.err.comment")); ok = false; }
    if (!ok) {
      var first = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (first) first.focus();
      return null;
    }
    return data;
  }

  function showAlert(msg) {
    var a = $("#checkoutAlert");
    a.textContent = msg; a.hidden = false;
    a.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function errorMessage(status, body) {
    var code = body && body.error;
    if (code === "RATE_LIMIT") return t("err.rate", { n: Math.max(1, Math.ceil((body.retryAfter || 60) / 60)) });
    if (code === "DUPLICATE") return t("err.duplicate");
    if (code === "VALIDATION") return t("err.validation");
    if (code === "STOCK") return t("err.stock");
    if (code === "NOT_CONFIGURED") return t("err.notConfigured");
    if (status === 404) return t("err.localFile");
    return t("err.server");
  }

  function submitCheckout(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var btn = $("#checkoutSubmit");
    $("#checkoutAlert").hidden = true;
    if (!items.length) { showAlert(t("co.err.empty")); return; }
    var data = validateCheckout(form);
    if (!data) return;

    if (location.protocol === "file:") { showAlert(t("err.localFile")); return; }

    if (!pendingRequestId) pendingRequestId = ZV.util.uuid();
    var payload = {
      requestId: pendingRequestId,
      lang: ZV.i18n.getLang(),
      customer: data,
      items: items.map(function (i) { return { id: i.id, qty: i.qty }; }),
      clientTotal: total(),            // server buni faqat solishtirish uchun ishlatadi
      website: form.website.value,     // honeypot
      elapsedMs: Date.now() - Number(form.dataset.openedAt || Date.now())
    };

    btn.classList.add("is-loading"); btn.disabled = true;
    btn.querySelector(".btn-label").textContent = t("co.sending");

    var controller = "AbortController" in root ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;

    fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; });
      })
      .then(function (r) {
        if (!r.res.ok || !r.body.ok) { showAlert(errorMessage(r.res.status, r.body)); return; }
        // Muvaffaqiyat: faqat endi savatcha tozalanadi
        var snapshot = r.body.order;
        pendingRequestId = null;
        clear(true);
        form.reset();
        form.phone.value = "+998 ";
        ZV.ui.closeModal($("#checkoutModal"));
        showSuccess(snapshot);
      })
      .catch(function () { showAlert(t("err.network")); })
      .then(function () {
        if (timer) clearTimeout(timer);
        btn.classList.remove("is-loading"); btn.disabled = false;
        btn.querySelector(".btn-label").textContent = t("co.confirm");
      });
  }

  function showSuccess(order) {
    var esc = ZV.util.escapeHtml, fmt = ZV.util.formatPrice;
    $("#successOrderId").textContent = order.id;
    $("#successList").innerHTML = order.items.map(function (i) {
      var b = bookById(i.id);
      return "<div><span>" + esc(b ? ZV.i18n.bookTitle(b) : i.title) + " × " + i.qty + "</span><b>" + fmt(i.lineTotal) + "</b></div>";
    }).join("") + '<div><b>' + esc(t("cart.total")) + "</b><b>" + fmt(order.total) + "</b></div>";
    setTimeout(function () { ZV.ui.openModal($("#successModal")); }, 300);
  }

  /* ---------- Hodisalar ---------- */
  function bind() {
    // Savatcha ichidagi +, −, o'chirish tugmalari (event delegation)
    $("#cartItems").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cart]");
      if (!btn) return;
      var id = parseInt(btn.dataset.id, 10);
      var action = btn.dataset.cart;
      if (action === "inc") increase(id);
      else if (action === "dec") decrease(id);
      else if (action === "remove") ZV.ui.confirm(t("cart.confirmRemove")).then(function (ok) { if (ok) remove(id); });
    });
    $("#clearCartBtn").addEventListener("click", function () {
      ZV.ui.confirm(t("cart.confirmClear")).then(function (ok) { if (ok) clear(); });
    });
    $("#checkoutBtn").addEventListener("click", openCheckout);
    $("#checkoutForm").addEventListener("submit", submitCheckout);
    $("#checkoutForm").phone.addEventListener("input", ZV.util.phoneMask);
    // Boshqa tabda savatcha o'zgarsa — sinxronlash
    root.addEventListener("storage", function (e) { if (e.key === STORAGE_KEY) { load(); update(); } });
    document.addEventListener("zv:langchange", function () { fillRegions(); update(); });
  }

  function init() { load(); bind(); update(); }

  ZV.cart = {
    init: init, add: add, remove: remove, clear: clear, increase: increase, decrease: decrease,
    setQty: setQty, count: count, total: total, items: function () { return items.slice(); },
    openCheckout: openCheckout, buyNow: function (id) {
      var book = bookById(id);
      if (!book || book.stock < 1) { ZV.ui.toast(t("cart.outOfStock"), "error"); return; }
      if (!find(id)) add(id, 1);
      openCheckout();
    },
    MAX_QTY: MAX_QTY
  };
})(window);
