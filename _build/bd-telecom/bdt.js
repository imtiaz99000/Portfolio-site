/* Shared header behaviour for imtiazkarim.com/bd-telecom pages: language and theme toggles. */
(function () {
  'use strict';
  var root = document.documentElement;
  var IC = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  };
  function isDark() { var t = root.getAttribute('data-theme'); if (t) return t === 'dark'; return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
  function paint() {
    var bn = root.lang === 'bn';
    var lb = document.getElementById('langBtn');
    if (lb) { lb.innerHTML = bn ? '<span class="off">EN</span><b>বাংলা</b>' : '<b>EN</b><span class="off">বাংলা</span>'; lb.setAttribute('aria-label', bn ? 'Switch to English' : 'বাংলায় দেখুন'); }
    var tb = document.getElementById('themeBtn'), dk = isDark();
    if (tb) { tb.innerHTML = dk ? IC.sun : IC.moon; var l = bn ? (dk ? 'লাইট মোডে যান' : 'ডার্ক মোডে যান') : (dk ? 'Switch to light mode' : 'Switch to dark mode'); tb.setAttribute('aria-label', l); tb.title = l; }
    var t = document.querySelector('meta[name="bdt-title-' + (bn ? 'bn' : 'en') + '"]');
    if (t) document.title = t.content;
  }
  document.getElementById('langBtn').addEventListener('click', function () {
    root.lang = root.lang === 'bn' ? 'en' : 'bn';
    try { localStorage.setItem('bdt-lang', root.lang); } catch (e) {}
    paint();
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var nx = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', nx);
    try { localStorage.setItem('bdt-theme', nx); } catch (e) {}
    paint();
  });
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);
  paint();
})();
