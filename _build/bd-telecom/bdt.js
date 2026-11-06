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

/* Tap or hover a month on any static chart to read its values. */
(function () {
  function setup(svg) {
    var pts = [].slice.call(svg.querySelectorAll('circle.pt')); if (!pts.length) return;
    var host = svg.closest('.chart') || svg.parentNode, vb = svg.viewBox.baseVal;
    var xs = []; pts.forEach(function (c) { var x = +c.getAttribute('cx'); if (xs.indexOf(x) < 0) xs.push(x); }); xs.sort(function (a, b) { return a - b; });
    var ns = 'http://www.w3.org/2000/svg', line = document.createElementNS(ns, 'line');
    line.setAttribute('y1', 0); line.setAttribute('y2', vb.height - 24); line.setAttribute('stroke', 'var(--faint,#999)'); line.setAttribute('stroke-width', 1); line.setAttribute('opacity', 0); line.style.pointerEvents = 'none';
    svg.appendChild(line);
    var ring = document.createElementNS(ns, 'g'); ring.style.pointerEvents = 'none'; svg.appendChild(ring);
    var tip = document.createElement('div'); tip.className = 'tip'; tip.style.opacity = 0; host.style.position = 'relative'; host.appendChild(tip);
    var cur = -1;
    function show(ix) {
      cur = ix; var x = xs[ix], bn = document.documentElement.lang === 'bn';
      var here = pts.filter(function (c) { return +c.getAttribute('cx') === x; });
      line.setAttribute('x1', x); line.setAttribute('x2', x); line.setAttribute('opacity', 1);
      ring.innerHTML = ''; here.forEach(function (c) { var d = document.createElementNS(ns, 'circle'); d.setAttribute('cx', x); d.setAttribute('cy', c.getAttribute('cy')); d.setAttribute('r', 4.5); d.setAttribute('fill', 'var(' + c.dataset.c + ')'); d.setAttribute('stroke', 'var(--surface)'); d.setAttribute('stroke-width', 2); ring.appendChild(d); });
      var h = '<div class="m">' + (bn ? here[0].dataset.mbn : here[0].dataset.men) + '</div>';
      here.slice().sort(function (a, b) { return +a.getAttribute('cy') - +b.getAttribute('cy'); }).forEach(function (c) {
        h += '<div class="r"><span><i style="background:var(' + c.dataset.c + ')"></i>' + (bn ? c.dataset.sbn : c.dataset.sen) + '</span><b>' + (bn ? c.dataset.vbn : c.dataset.ven) + '</b></div>'; });
      tip.innerHTML = h; tip.style.opacity = 1;
      var r = svg.getBoundingClientRect(), hr = host.getBoundingClientRect(), px = r.left - hr.left + x / vb.width * r.width, tw = tip.offsetWidth;
      tip.style.left = Math.max(0, Math.min(host.clientWidth - tw, px + (px > host.clientWidth / 2 ? -tw - 12 : 12))) + 'px'; tip.style.top = (r.top - hr.top + 6) + 'px';
    }
    function hide() { cur = -1; line.setAttribute('opacity', 0); ring.innerHTML = ''; tip.style.opacity = 0; }
    function at(e) { var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * vb.width, best = 0;
      xs.forEach(function (v, i) { if (Math.abs(v - x) < Math.abs(xs[best] - x)) best = i; }); return best; }
    svg.style.touchAction = 'pan-y'; svg.setAttribute('tabindex', '0');
    svg.addEventListener('pointerdown', function (e) { show(at(e)); });
    svg.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.buttons) show(at(e)); });
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    svg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { show(Math.min(xs.length - 1, cur + 1)); e.preventDefault(); } if (e.key === 'ArrowLeft') { show(Math.max(0, cur < 0 ? xs.length - 1 : cur - 1)); e.preventDefault(); } if (e.key === 'Escape') hide(); });
    svg.addEventListener('blur', hide);
    document.addEventListener('pointerdown', function (e) { if (!svg.contains(e.target)) hide(); });
  }
  function init() { [].forEach.call(document.querySelectorAll('svg.schart'), setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
