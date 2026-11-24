/* =====================================================================
   ZARVARAQ — auth.js
   Ro'yxatdan o'tish va kirish.
   IKKI REJIM:
   1) SERVER (asosiy): Netlify Function /api/auth
      - parollar serverda scrypt bilan xeshlanadi (Netlify Blobs'da saqlanadi)
      - sessiya HttpOnly + Secure cookie orqali (JS tokenni ko'ra olmaydi)
   2) DEMO (zaxira): server topilmasa (masalan, faylni to'g'ridan-to'g'ri ochganda)
      - foydalanuvchilar faqat shu brauzerda saqlanadi
      - parol OCHIQ saqlanmaydi: PBKDF2-SHA256 (150 000 iteratsiya) + tasodifiy salt
      - bu rejim sahifada aniq "DEMO REJIM" deb ko'rsatiladi
   ===================================================================== */
(function (root) {
  "use strict";

  var ENDPOINT = "/api/auth";
  var DEMO_USERS = "zv_demo_users";
  var DEMO_SESSION = "zv_demo_session";
  var PROFILE = "zv_profile"; // faqat ko'rsatish uchun (ism, email) — parol yoki token emas
  var mode = "demo";          // "server" | "demo"
  var user = null;

  var ZV = root.ZV = root.ZV || {};
  function t(k, v) { return ZV.i18n.t(k, v); }
  function $(s) { return document.querySelector(s); }

  /* ---------- Yordamchi ---------- */
  function api(method, body, query) {
    return fetch(ENDPOINT + (query || ""), {
      method: method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { status: res.status, ok: res.ok && data.ok, data: data };
      });
    });
  }

  function bufToHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }

  function pbkdf2(password, saltHex) {
    if (!root.crypto || !crypto.subtle) return Promise.reject(new Error("NO_CRYPTO"));
    var enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]).then(function (key) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(saltHex), iterations: 150000 }, key, 256);
    }).then(bufToHex);
  }

  function randomHex(n) {
    var a = new Uint8Array(n); crypto.getRandomValues(a); return bufToHex(a.buffer);
  }

  function readDemoUsers() {
    try { var u = JSON.parse(localStorage.getItem(DEMO_USERS) || "[]"); return Array.isArray(u) ? u : []; } catch (e) { return []; }
  }

  function publicUser(u) {
    return { firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone };
  }

  function setUser(u) {
    user = u ? publicUser(u) : null;
    try {
      if (user) localStorage.setItem(PROFILE, JSON.stringify(user)); else localStorage.removeItem(PROFILE);
    } catch (e) {}
    renderButton();
  }

  /* ---------- Rejimni aniqlash ---------- */
  function detectMode() {
    if (location.protocol === "file:") return Promise.resolve("demo");
    return api("GET", null, "?action=status")
      .then(function (r) {
        if (r.ok && r.data.configured) {
          mode = "server";
          user = r.data.user ? publicUser(r.data.user) : null;
          return "server";
        }
        return "demo";
      })
      .catch(function () { return "demo"; });
  }

  /* ---------- Validatsiya ---------- */
  var nameRe = /^[\p{L}\p{M}'’ʻʼ`\- ]{2,40}$/u;
  function validateRegister(f) {
    var v = ZV.util.validators, e = {};
    var d = {
      firstName: f.firstName.value.trim(), lastName: f.lastName.value.trim(),
      email: f.email.value.trim().toLowerCase(), phone: ZV.util.normalizePhone(f.phone.value),
      password: f.password.value, password2: f.password2.value
    };
    if (!nameRe.test(d.firstName)) e.firstName = t("auth.err.firstName");
    if (!nameRe.test(d.lastName)) e.lastName = t("auth.err.lastName");
    if (!v.email(d.email)) e.email = t("auth.err.email");
    if (!v.phone(d.phone)) e.phone = t("auth.err.phone");
    if (!v.password(d.password)) e.password = t("auth.err.password");
    if (!e.password && d.password !== d.password2) e.password2 = t("auth.err.password2");
    return { data: d, errors: e };
  }

  function validateLogin(f) {
    var e = {};
    var raw = f.login.value.trim();
    var login = raw.indexOf("@") !== -1 ? raw.toLowerCase() : ZV.util.normalizePhone(raw);
    if (!(ZV.util.validators.email(login) || ZV.util.validators.phone(login))) e.login = t("auth.err.loginId");
    if (!f.password.value) e.password = t("auth.err.required");
    return { data: { login: login, password: f.password.value }, errors: e };
  }

  function showErrors(form, errors) {
    form.querySelectorAll(".form-field").forEach(function (fl) { fl.classList.remove("has-error"); });
    form.querySelectorAll("[data-error]").forEach(function (el) { el.textContent = ""; });
    var first = null;
    Object.keys(errors).forEach(function (k) {
      var el = form.querySelector('[data-error="' + k + '"]');
      if (el) { el.textContent = errors[k]; el.closest(".form-field").classList.add("has-error"); }
      if (!first) first = form.querySelector('[name="' + k + '"]');
    });
    if (first) first.focus();
    return !first;
  }

  function alertBox(form, msg, ok) {
    var a = form.querySelector("[data-alert]");
    if (!msg) { a.hidden = true; return; }
    a.textContent = msg; a.className = "form-alert" + (ok ? " ok" : ""); a.hidden = false;
  }

  function busy(form, on) {
    var b = form.querySelector('button[type="submit"]');
    b.classList.toggle("is-loading", on); b.disabled = on;
  }

  /* ---------- Ro'yxatdan o'tish / Kirish ---------- */
  function register(d) {
    if (mode === "server") {
      return api("POST", { action: "register", firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, password: d.password })
        .then(function (r) {
          if (r.ok) return r.data.user;
          throw new Error(r.data.error || "SERVER");
        });
    }
    var users = readDemoUsers();
    if (users.some(function (u) { return u.email === d.email || u.phone === d.phone; })) return Promise.reject(new Error("EXISTS"));
    var salt = randomHex(16);
    return pbkdf2(d.password, salt).then(function (hash) {
      var rec = { firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, salt: salt, hash: hash, createdAt: Date.now() };
      users.push(rec);
      localStorage.setItem(DEMO_USERS, JSON.stringify(users));
      localStorage.setItem(DEMO_SESSION, d.email);
      return rec;
    });
  }

  function login(d) {
    if (mode === "server") {
      return api("POST", { action: "login", login: d.login, password: d.password }).then(function (r) {
        if (r.ok) return r.data.user;
        throw new Error(r.data.error || "SERVER");
      });
    }
    var u = readDemoUsers().filter(function (x) { return x.email === d.login || x.phone === d.login; })[0];
    if (!u) return Promise.reject(new Error("INVALID"));
    return pbkdf2(d.password, u.salt).then(function (hash) {
      if (hash !== u.hash) throw new Error("INVALID");
      localStorage.setItem(DEMO_SESSION, u.email);
      return u;
    });
  }

  function logout() {
    var p = mode === "server" ? api("POST", { action: "logout" }).catch(function () {}) : Promise.resolve();
    try { localStorage.removeItem(DEMO_SESSION); } catch (e) {}
    return p.then(function () {
      setUser(null);
      ZV.ui.closeModal($("#authModal"));
      ZV.ui.toast(t("auth.loggedOut"));
    });
  }

  function errText(code) {
    return {
      EXISTS: t("auth.err.exists"), INVALID: t("auth.err.invalid"), RATE_LIMIT: t("auth.err.rate"),
      VALIDATION: t("err.validation"), NO_CRYPTO: t("err.server")
    }[code] || t("err.server");
  }

  /* ---------- UI ---------- */
  function renderButton() {
    var txt = $("#authBtnText");
    if (!txt) return;
    [txt, $("#authBtnMText")].forEach(function (el) {
      if (!el) return;
      if (user) { el.removeAttribute("data-i18n"); el.textContent = user.firstName; }
      else { el.setAttribute("data-i18n", "nav.login"); el.textContent = t("nav.login"); }
    });
    $("#authBtn").setAttribute("aria-label", user ? t("nav.account") : t("nav.login"));
  }

  function renderMode() {
    var el = $("#authMode");
    el.textContent = mode === "server" ? t("auth.secure") : t("auth.demo");
    el.classList.toggle("secure", mode === "server");
  }

  function switchTab(tab) {
    var isLogin = tab === "login";
    document.querySelectorAll(".auth-tab").forEach(function (b) {
      var active = b.dataset.authTab === tab;
      b.classList.toggle("active", active); b.setAttribute("aria-selected", String(active));
    });
    $("#loginForm").hidden = !isLogin;
    $("#registerForm").hidden = isLogin;
    var title = $("#authTitle");
    title.setAttribute("data-i18n", isLogin ? "auth.loginTitle" : "auth.registerTitle");
    title.textContent = t(isLogin ? "auth.loginTitle" : "auth.registerTitle");
    alertBox($("#loginForm")); alertBox($("#registerForm"));
  }

  function renderAccount() {
    var body = $("#authModal .modal-body");
    var acc = body.querySelector(".account-view");
    var parts = body.querySelectorAll(".auth-tabs, #authTitle, #authMode, #loginForm, #registerForm");
    if (!user) {
      if (acc) acc.remove();
      parts.forEach(function (p) { p.style.display = ""; });
      switchTab("login");
      return;
    }
    parts.forEach(function (p) { p.style.display = "none"; });
    if (!acc) { acc = document.createElement("div"); acc.className = "account-view center"; body.appendChild(acc); }
    var esc = ZV.util.escapeHtml;
    acc.innerHTML =
      '<div class="avatar avatar-lg">' + esc(user.firstName.charAt(0).toUpperCase()) + "</div>" +
      "<h2>" + esc(t("auth.hello", { n: user.firstName })) + "</h2>" +
      '<p class="muted">' + esc(user.firstName + " " + user.lastName) + "<br>" + esc(user.email) + "<br>" + esc(ZV.util.formatPhone(user.phone)) + "</p>" +
      '<p class="auth-mode' + (mode === "server" ? " secure" : "") + '">' + esc(mode === "server" ? t("auth.secure") : t("auth.demo")) + "</p>" +
      '<button type="button" class="btn btn-ghost btn-block" id="logoutBtn">' + esc(t("auth.logout")) + "</button>";
    acc.querySelector("#logoutBtn").addEventListener("click", logout);
  }

  function open(tab) {
    renderMode();
    renderAccount();
    if (!user) switchTab(tab || "login");
    ZV.ui.openModal($("#authModal"));
  }

  function bind() {
    $("#authBtn").addEventListener("click", function () { open("login"); });
    document.querySelectorAll("[data-auth-tab]").forEach(function (b) {
      b.addEventListener("click", function () { switchTab(b.dataset.authTab); });
    });
    document.querySelectorAll(".pw-toggle").forEach(function (b) {
      b.addEventListener("click", function () {
        var inp = b.previousElementSibling;
        inp.type = inp.type === "password" ? "text" : "password";
      });
    });
    $("#registerForm").phone.addEventListener("input", ZV.util.phoneMask);

    $("#registerForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.currentTarget, r = validateRegister(form);
      alertBox(form);
      if (!showErrors(form, r.errors)) return;
      busy(form, true);
      register(r.data).then(function (u) {
        setUser(u);
        form.reset(); form.phone.value = "+998 ";
        ZV.ui.closeModal($("#authModal"));
        ZV.ui.toast(t("auth.registered") + " " + t("auth.welcome", { n: u.firstName }), "success");
      }).catch(function (err) { alertBox(form, errText(err.message)); })
        .then(function () { busy(form, false); });
    });

    $("#loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.currentTarget, r = validateLogin(form);
      alertBox(form);
      if (!showErrors(form, r.errors)) return;
      busy(form, true);
      login(r.data).then(function (u) {
        setUser(u);
        form.reset();
        ZV.ui.closeModal($("#authModal"));
        ZV.ui.toast(t("auth.welcome", { n: u.firstName }), "success");
      }).catch(function (err) { alertBox(form, errText(err.message)); })
        .then(function () { busy(form, false); });
    });

    document.addEventListener("zv:langchange", function () { renderButton(); renderMode(); if (user) renderAccount(); });
  }

  function init() {
    // Darhol oldingi profilni ko'rsatamiz (tez UI), keyin server bilan tekshiramiz
    try {
      var cached = JSON.parse(localStorage.getItem(PROFILE) || "null");
      if (cached && cached.firstName) user = cached;
    } catch (e) {}
    bind();
    renderButton();
    return detectMode().then(function (m) {
      mode = m;
      if (m === "demo") {
        var email = null;
        try { email = localStorage.getItem(DEMO_SESSION); } catch (e) {}
        var u = email && readDemoUsers().filter(function (x) { return x.email === email; })[0];
        setUser(u || null);
      } else {
        setUser(user); // server javobidagi foydalanuvchi (cookie haqiqiy bo'lsa)
      }
      renderMode();
    });
  }

  ZV.auth = {
    init: init,
    open: open,
    logout: logout,
    currentUser: function () { return user; },
    mode: function () { return mode; }
  };
})(window);
