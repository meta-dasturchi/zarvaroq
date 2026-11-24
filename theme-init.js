/* ZARVARAQ — theme-init.js
   Sahifa chizilishidan OLDIN tun/kun rejimini qo'llaydi (oq "miltillash" bo'lmasligi uchun).
   Inline <script> o'rniga alohida fayl — Content-Security-Policy qat'iy bo'lishi uchun. */
(function () {
  var theme = "light";
  try {
    var saved = localStorage.getItem("zv_theme");
    if (saved === "dark" || saved === "light") theme = saved;
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);
})();
