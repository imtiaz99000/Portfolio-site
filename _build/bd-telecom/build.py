"""Builds imtiazkarim.com/bd-telecom/ from data.json and the templates in this folder.
Run from this folder:  python3 build.py
Writes ../../bd-telecom/ (dashboard, operators, data, guides, assets) and ../../sitemap.xml, ../../robots.txt."""
import csv, hashlib, html, json, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(SITE, 'bd-telecom')
DATA = json.load(open(os.path.join(HERE, 'data.json')))
BY = {r['month']: r for r in DATA}
MONTHS = [r['month'] for r in DATA]
FULL = [r for r in DATA if r['grameenphone'] is not None and r['total_mobile'] is not None]
FIRST, LAST = FULL[0], FULL[-1]
UPDATED = ('October 2026', 'অক্টোবর ২০২৬')

BD = '০১২৩৪৫৬৭৮৯'
def bn(s): return ''.join(BD[int(c)] if c.isdigit() else c for c in str(s))
MON_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
MON_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
SH_EN = [m[:3] for m in MON_EN]
SH_BN = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে']
def mlab(m, lang='en', short=False):
    y, mo = m.split('-')
    if lang == 'bn': return (SH_BN if short else MON_BN)[int(mo) - 1] + ' ' + bn(y)
    return (SH_EN if short else MON_EN)[int(mo) - 1] + ' ' + y
def num(v, d=2, lang='en'):
    s = ('%.' + str(d) + 'f') % v
    return bn(s) if lang == 'bn' else s
def sgn(v, d=2, lang='en'):
    s = ('+' if v > 0 else '−' if v < 0 else '') + ('%.' + str(d) + 'f') % abs(v)
    return bn(s) if lang == 'bn' else s
esc = html.escape

OPS = [
    dict(k='grameenphone', slug='grameenphone', en='Grameenphone', bn='গ্রামীণফোন', s='GP', c='--gp'),
    dict(k='robi', slug='robi', en='Robi', bn='রবি', s='R', c='--robi'),
    dict(k='banglalink', slug='banglalink', en='Banglalink', bn='বাংলালিংক', s='BL', c='--bl'),
    dict(k='teletalk', slug='teletalk', en='Teletalk', bn='টেলিটক', s='TT', c='--tt'),
]
def badge(o, cls='badge'):
    ink = 'var(--bl-ink)' if o['k'] == 'banglalink' else '#fff'
    return '<span class="%s" style="background:var(%s);color:%s" aria-hidden="true">%s</span>' % (cls, o['c'], ink, o['s'])
def T(en, bnv, tag='span'):
    return '<%s data-en>%s</%s><%s data-bn>%s</%s>' % (tag, en, tag, tag, bnv, tag)

ICON = {
 'chart': '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
 'users': '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5"/>',
 'db': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
 'book': '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
 'sim': '<path d="M6 2h8l4 4v16H6z"/><rect x="9" y="11" width="6" height="7" rx="1"/>',
 'phone': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
 'alert': '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
 'download': '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
 'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5"/>',
 'code': '<path d="M8 6l-6 6 6 6"/><path d="M16 6l6 6-6 6"/>',
}
def ic(name): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % ICON[name]
def tint(c): return 'background:color-mix(in srgb,var(%s) 16%%,transparent);color:var(%s)' % (c, c)

LOGO = ('<svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="#0E8A86"/>'
        '<stop offset="1" stop-color="#F2A93B"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#102A2B"/><path d="M12 44 C24 44 26 22 38 22 S50 34 54 20" '
        'stroke="url(#mg)" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="12" cy="44" r="5" fill="#0E8A86"/><circle cx="54" cy="20" r="5" fill="#F2A93B"/></svg>')
NAV = [('dash', '/bd-telecom/', 'Dashboard', 'ড্যাশবোর্ড'), ('ops', '/bd-telecom/operators/', 'Operators', 'অপারেটর'),
       ('data', '/bd-telecom/data/', 'Data', 'ডেটা'), ('guides', '/bd-telecom/guides/', 'Guides', 'গাইড')]
def header(active):
    nav = ''.join('<a href="%s"%s>%s</a>' % (u, ' aria-current="page"' if k == active else '', T(e, b)) for k, u, e, b in NAV)
    return ('<div class="top"><div class="wrap">\n  <a class="mark" href="/" aria-label="Mohd Imtiaz Karim, home">%s<span>%s</span></a>\n'
            '  <nav class="sitenav" aria-label="BD Telecom">%s</nav>\n'
            '  <div class="ctrls"><button class="ctl lang" id="langBtn" type="button" aria-label="Switch language"></button>'
            '<button class="ctl icon" id="themeBtn" type="button" aria-label="Switch light or dark mode"></button></div>\n</div></div>') % (LOGO, T('Mohd Imtiaz Karim', 'মোহাম্মদ ইমতিয়াজ করিম'), nav)

FAVICON = open(os.path.join(HERE, 'dashboard.tpl.html')).read().split('<link rel="icon" href="')[1].split('"')[0]
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&family=Anek+Bangla:wght@400;500;600;700&display=swap" rel="stylesheet">'

def page(path, active, title_en, title_bn, desc_en, body, default_lang='en', crumbs=None):
    url = 'https://imtiazkarim.com/bd-telecom/' + path
    cr = ''
    if crumbs:
        cr = '<p class="crumbs">' + ' / '.join('<a href="%s">%s</a>' % (u, T(e, b)) for u, e, b in crumbs) + '</p>'
    return '''<!doctype html>
<html lang="%(dl)s" data-default-lang="%(dl)s">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(te)s</title>
<meta name="bdt-title-en" content="%(te)s"><meta name="bdt-title-bn" content="%(tb)s">
<meta name="description" content="%(de)s">
<link rel="canonical" href="%(url)s">
<meta property="og:title" content="%(te)s"><meta property="og:description" content="%(de)s"><meta property="og:image" content="https://imtiazkarim.com/bd-telecom/og.png">
<link rel="icon" href="%(fav)s">
<script>(function(){var r=document.documentElement,d=r.getAttribute('data-default-lang')||'en';try{var t=localStorage.getItem('bdt-theme');if(t)r.setAttribute('data-theme',t);r.lang=localStorage.getItem('bdt-lang')||d}catch(e){r.lang=d}})()</script>
%(fonts)s
<link rel="stylesheet" href="/bd-telecom/assets/bdt.css?v=%(cssv)s">
</head>
<body>
%(head)s
<main class="wrap">
%(cr)s
%(body)s
</main>
<footer><div class="wrap"><span>%(foot)s</span><a href="/">%(home)s</a></div></footer>
<script src="/bd-telecom/assets/bdt.js?v=%(jsv)s"></script>
</body>
</html>
''' % dict(dl=default_lang, te=esc(title_en), tb=esc(title_bn), de=esc(desc_en), url=url, fav=FAVICON, fonts=FONTS, cssv=CSSV, jsv=JSV, head=header(active), cr=cr, body=body,
           foot=T('Data: Bangladesh Telecommunication Regulatory Commission (BTRC). Analysis by Mohd Imtiaz Karim.', 'ডেটা: বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন (BTRC)। বিশ্লেষণ: মোহাম্মদ ইমতিয়াজ করিম।'),
           home=T('Back to imtiazkarim.com', 'imtiazkarim.com এ ফিরুন'))

def write(rel, content):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf8').write(content)

# ---------- static SVG line chart (hover via native titles; the table carries every value) ----------
def svg_line(series, ymin, ymax, ticks, unit_en, unit_bn, h=260, fmt=2):
    W, H, L, R, TP, B = 720, h, 46, 96, 14, 26
    iw, ih, n = W - L - R, H - TP - B, len(MONTHS)
    x = lambda i: L + i * iw / (n - 1)
    y = lambda v: TP + ih - (v - ymin) / (ymax - ymin) * ih
    o = ['<svg viewBox="0 0 %d %d" role="img" class="schart">' % (W, H)]
    for t in ticks:
        o.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="var(--grid)"/>' % (L, W - R, y(t), y(t)))
        o.append('<text x="%d" y="%.1f" text-anchor="end">%s%s</text>' % (L - 8, y(t) + 4, T(str(t), bn(t), 'tspan'), T(unit_en, unit_bn, 'tspan')))
    for i, m in enumerate(MONTHS):
        if i % 6 == 0 or i == n - 1:
            o.append('<text x="%.1f" y="%d" text-anchor="%s">%s</text>' % (x(i), H - 6, 'end' if i == n - 1 else 'middle', T(mlab(m, 'en', True), mlab(m, 'bn', True), 'tspan')))
    for name_en, name_bn, col, get in series:
        d, pen, last = '', False, None
        for i, m in enumerate(MONTHS):
            v = get(BY[m])
            if v is None: pen = False; continue
            d += ('L' if pen else 'M') + '%.1f %.1f' % (x(i), y(v)); pen = True; last = (i, v)
        o.append('<path d="%s" fill="none" stroke="var(%s)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' % (d, col))
        for i, m in enumerate(MONTHS):
            v = get(BY[m])
            if v is None: continue
            o.append('<circle cx="%.1f" cy="%.1f" r="7" fill="transparent"><title>%s: %s</title></circle>' % (x(i), y(v), mlab(m), ('%.' + str(fmt) + 'f') % v))
        if last:
            i, v = last
            o.append('<circle cx="%.1f" cy="%.1f" r="4.5" fill="var(%s)" stroke="var(--surface)" stroke-width="2"/>' % (x(i), y(v), col))
            o.append('<text x="%.1f" y="%.1f" class="lbl">%s</text>' % (x(i) + 9, y(v) + 4, T(name_en, name_bn, 'tspan')))
            o.append('<text x="%.1f" y="%.1f" class="note">%s</text>' % (x(i) + 9, y(v) + 19, T(('%.' + str(fmt) + 'f') % v + unit_en, bn(('%.' + str(fmt) + 'f') % v) + unit_bn, 'tspan')))
    o.append('</svg>')
    return '<div class="chart">' + ''.join(o) + '</div>'

def build():
    global CSSV, JSV
    os.makedirs(os.path.join(OUT, 'assets'), exist_ok=True)
    css = open(os.path.join(HERE, 'bdt.base.css')).read() + '\n.chart svg.schart{display:block;width:100%;height:auto}\n'
    js = open(os.path.join(HERE, 'bdt.js')).read()
    CSSV = hashlib.sha1(css.encode()).hexdigest()[:8]; JSV = hashlib.sha1(js.encode()).hexdigest()[:8]
    open(os.path.join(OUT, 'assets', 'bdt.css'), 'w').write(css)
    open(os.path.join(OUT, 'assets', 'bdt.js'), 'w').write(js)
    for f in ['subscribers.csv', 'analysis.sql']: shutil.copy(os.path.join(HERE, f), OUT)
    shutil.copy(os.path.join(HERE, 'results.txt'), os.path.join(OUT, 'analysis-results.txt'))

    # dashboard
    t = open(os.path.join(HERE, 'dashboard.tpl.html')).read()
    t = t.replace('__HEADER__', header('dash')).replace('__CSSV__', CSSV).replace('__DATA__', json.dumps(DATA, separators=(',', ':')))
    write('index.html', t)

    # operators index + pages
    cards = ''
    for o in OPS:
        v, s1 = LAST[o['k']], LAST[o['k']] / LAST['total_mobile'] * 100
        cards += ('<a class="linkcard" href="/bd-telecom/operators/%s/"><span class="ti">%s%s</span><p>%s</p></a>' % (o['slug'], badge(o), T(o['en'], o['bn']),
                  T('%s million subscriptions · %s%% of the market' % (num(v), num(s1, 1)), '%s মিলিয়ন সাবস্ক্রিপশন · বাজারের %s%%' % (num(v, 2, 'bn'), num(s1, 1, 'bn')))))
    body = ('<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header><div class="cards">%s</div>' %
            (T('Mobile operators in Bangladesh', 'বাংলাদেশের মোবাইল অপারেটর'),
             T('Subscriber trend, market share and two-year change for each of the four operators, from BTRC data. Latest month: %s.' % mlab(LAST['month']),
               'BTRC এর ডেটা থেকে চার অপারেটরের গ্রাহকের প্রবণতা, মার্কেট শেয়ার আর দুই বছরের পরিবর্তন। সর্বশেষ মাস: %s।' % mlab(LAST['month'], 'bn')), cards))
    write('operators/index.html', page('operators/', 'ops', 'Mobile operators in Bangladesh | BD Telecom', 'বাংলাদেশের মোবাইল অপারেটর | BD Telecom',
                                       'Grameenphone, Robi, Banglalink and Teletalk: subscribers, market share and trends from BTRC data.', body,
                                       crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))
    for o in OPS:
        k = o['k']
        rows = [r for r in DATA if r[k] is not None]
        lo = min(rows, key=lambda r: r[k]); hi = max(rows, key=lambda r: r[k])
        s0, s1 = FIRST[k] / FIRST['total_mobile'] * 100, LAST[k] / LAST['total_mobile'] * 100
        d2 = LAST[k] - FIRST[k]; p2 = d2 / FIRST[k] * 100
        dA = BY['2025-12'][k] - BY['2025-07'][k]; dB = BY['2026-08'][k] - BY['2026-02'][k]
        kv = ''.join('<div class="tile"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div></div>' % x for x in [
            (T('Subscriptions, %s' % mlab(LAST['month'], 'en', True), 'সাবস্ক্রিপশন, %s' % mlab(LAST['month'], 'bn', True)), T(num(LAST[k]) + '<small>m</small>', num(LAST[k], 2, 'bn') + '<small>মি.</small>'), T('active, BTRC', 'সক্রিয়, BTRC')),
            (T('Market share', 'মার্কেট শেয়ার'), T(num(s1, 1) + '<small>%</small>', num(s1, 1, 'bn') + '<small>%</small>'), T('was %s%% in %s' % (num(s0, 1), mlab(FIRST['month'], 'en', True)), '%s এ ছিল %s%%' % (mlab(FIRST['month'], 'bn', True), num(s0, 1, 'bn')))),
            (T('Two-year change', 'দুই বছরের পরিবর্তন'), T(sgn(d2) + '<small>m</small>', sgn(d2, 2, 'bn') + '<small>মি.</small>'), T('%s%% since %s' % (sgn(p2, 1), mlab(FIRST['month'], 'en', True)), '%s থেকে %s%%' % (mlab(FIRST['month'], 'bn', True), sgn(p2, 1, 'bn')))),
            (T('Recovery, Feb to Aug 2026', 'ফেব্রু থেকে আগস্ট ২০২৬'), T(sgn(dB) + '<small>m</small>', sgn(dB, 2, 'bn') + '<small>মি.</small>'), T('Jul to Dec 2025: %s m' % sgn(dA), 'জুলাই-ডিসে ২০২৫: %s মি.' % sgn(dA, 2, 'bn')))])
        story = T('%s had %s million active subscriptions in %s, %s%% of the market. Over two years it %s %s million (%s%%). Its lowest month in the data was %s (%s million) and its highest was %s (%s million). During the SIM-limit clean-up from July to December 2025 it changed by %s million, and from February to August 2026 by %s million.'
                  % (o['en'], num(LAST[k]), mlab(LAST['month']), num(s1, 1), 'gained' if d2 >= 0 else 'lost', num(abs(d2)), sgn(p2, 1), mlab(lo['month']), num(lo[k]), mlab(hi['month']), num(hi[k]), sgn(dA), sgn(dB)),
                  '%s এ %s এর সক্রিয় সাবস্ক্রিপশন ছিল %s মিলিয়ন, বাজারের %s%%। দুই বছরে %s মিলিয়ন %s (%s%%)। ডেটায় সবচেয়ে কম ছিল %s এ (%s মিলিয়ন), সবচেয়ে বেশি %s এ (%s মিলিয়ন)। জুলাই থেকে ডিসেম্বর ২০২৫ এর SIM সীমার সময়ে পরিবর্তন %s মিলিয়ন, আর ফেব্রুয়ারি থেকে আগস্ট ২০২৬ এ %s মিলিয়ন।'
                  % (mlab(LAST['month'], 'bn'), o['bn'], num(LAST[k], 2, 'bn'), num(s1, 1, 'bn'), num(abs(d2), 2, 'bn'), 'বেড়েছে' if d2 >= 0 else 'কমেছে', sgn(p2, 1, 'bn'), mlab(lo['month'], 'bn'), num(lo[k], 2, 'bn'), mlab(hi['month'], 'bn'), num(hi[k], 2, 'bn'), sgn(dA, 2, 'bn'), sgn(dB, 2, 'bn')), 'p')
        vals = [r[k] for r in rows]; pad = max(0.5, (max(vals) - min(vals)) * 0.25)
        y0, y1 = int(min(vals) - pad), int(max(vals) + pad) + 1
        step = max(1, round((y1 - y0) / 4)); ticks = list(range(y0, y1 + 1, step))
        ch1 = svg_line([(o['en'], o['bn'], o['c'], lambda r, k=k: r[k])], ticks[0], ticks[-1], ticks, 'm', ' মি.')
        sv = [r[k] / r['total_mobile'] * 100 for r in FULL]; sp = max(0.6, (max(sv) - min(sv)) * 0.5)
        sy0, sy1 = int(min(sv) - sp), int(max(sv) + sp) + 1
        ch2 = svg_line([(T('Share', 'শেয়ার', 'tspan'), '', o['c'], lambda r, k=k: (r[k] / r['total_mobile'] * 100) if r[k] is not None and r['total_mobile'] else None)],
                       sy0, sy1, list(range(sy0, sy1 + 1, max(1, round((sy1 - sy0) / 4)))), '%', '%', h=220, fmt=1)
        trs = ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), T(num(r[k]), num(r[k], 2, 'bn')) if r[k] is not None else '<span class="gap">–</span>',
                      T(num(r[k] / r['total_mobile'] * 100, 1) + '%', num(r[k] / r['total_mobile'] * 100, 1, 'bn') + '%') if r[k] is not None and r['total_mobile'] else '–') for r in reversed(DATA))
        others = ''.join('<a class="linkcard" href="/bd-telecom/operators/%s/"><span class="ti">%s%s</span></a>' % (x['slug'], badge(x), T(x['en'], x['bn'])) for x in OPS if x is not o)
        body = ('<header class="pagehead"><h1 style="display:flex;align-items:center;gap:14px">%s%s</h1><p class="dek">%s</p></header>'
                '<div class="kv tiles">%s</div>'
                '<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>'
                '<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>'
                '<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr><th>%s</th><th>%s</th><th>%s</th></tr></thead><tbody>%s</tbody></table></div></div></section>'
                '<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards">%s<a class="linkcard" href="/bd-telecom/"><span class="ti"><span class="ic" style="%s">%s</span>%s</span></a></div></section>'
                ) % (badge(o, 'badge big'), T(o['en'], o['bn']), story, kv,
                     T('Active subscriptions', 'সক্রিয় সাবস্ক্রিপশন'), T('Millions, %s to %s. Breaks are months with no published operator figure.' % (mlab(FIRST['month']), mlab(LAST['month'])), 'মিলিয়ন, %s থেকে %s। রেখা ভাঙা মানে সেই মাসের অপারেটরভিত্তিক সংখ্যা প্রকাশিত হয়নি।' % (mlab(FIRST['month'], 'bn'), mlab(LAST['month'], 'bn'))), ch1,
                     T('Market share', 'মার্কেট শেয়ার'), T('Share of all active mobile subscriptions, %', 'মোট সক্রিয় মোবাইল সাবস্ক্রিপশনের ভাগ, %'), ch2,
                     T('Month by month', 'মাসভিত্তিক'), T('Month', 'মাস'), T('Subscriptions (m)', 'সাবস্ক্রিপশন (মি.)'), T('Share', 'শেয়ার'), trs,
                     T('Other operators', 'অন্য অপারেটর'), others, tint('--accent'), ic('chart'), T('Full market dashboard', 'পুরো বাজারের ড্যাশবোর্ড'))
        write('operators/%s/index.html' % o['slug'], page('operators/%s/' % o['slug'], 'ops', '%s subscribers and market share | BD Telecom' % o['en'], '%s গ্রাহক ও মার্কেট শেয়ার | BD Telecom' % o['bn'],
              '%s: %s million active subscriptions in %s, %.1f%% market share. Two years of BTRC data with charts and tables.' % (o['en'], num(LAST[k]), mlab(LAST['month']), s1), body,
              crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/operators/', 'Operators', 'অপারেটর')]))

    # data archive
    cols = [('grameenphone', 'GP', 'জিপি'), ('robi', 'Robi', 'রবি'), ('banglalink', 'Banglalink', 'বাংলালিংক'), ('teletalk', 'Teletalk', 'টেলিটক'), ('total_mobile', 'Total mobile', 'মোট মোবাইল'),
            ('mobile_internet', 'Mobile internet', 'মোবাইল ইন্টারনেট'), ('fixed_internet', 'Fixed', 'ফিক্সড'), ('total_internet', 'Total internet', 'মোট ইন্টারনেট')]
    th = '<th>%s</th>' % T('Month', 'মাস') + ''.join('<th>%s</th>' % T(e, b) for _, e, b in cols) + '<th style="text-align:left">%s</th>' % T('Source', 'উৎস')
    trs = ''
    for r in reversed(DATA):
        tds = ''.join('<td>%s</td>' % (T(num(r[c], 1 if r['precision'] == 0.1 else 2), num(r[c], 1 if r['precision'] == 0.1 else 2, 'bn')) if r[c] is not None else '<span class="gap">–</span>') for c, _, _ in cols)
        trs += '<tr><td>%s</td>%s<td style="text-align:left;white-space:normal;min-width:220px;color:var(--muted)">%s</td></tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), tds, esc(r['source'] or '') or T('No published figure found', 'প্রকাশিত সংখ্যা পাওয়া যায়নি'))
    body = ('<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header>'
            '<div class="btns" style="margin:0 0 16px"><a class="btn primary" href="/bd-telecom/subscribers.csv" download>%s%s</a><a class="btn" href="/bd-telecom/analysis.sql" download>%s%s</a></div>'
            '<div class="callout"><span>%s</span><p>%s</p></div>'
            '<div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div>'
            '<p class="soon">%s</p>') % (
        T('Bangladesh telecom data: monthly subscribers', 'বাংলাদেশ টেলিকম ডেটা: মাসিক গ্রাহক'),
        T('Active mobile subscriptions by operator and internet subscriptions, in millions. BTRC figures, as published in its reports and the national press. Free to download and reuse with credit.', 'অপারেটর অনুযায়ী সক্রিয় মোবাইল সাবস্ক্রিপশন আর ইন্টারনেট সাবস্ক্রিপশন, মিলিয়নে। BTRC এর রিপোর্ট ও জাতীয় সংবাদমাধ্যমে প্রকাশিত BTRC এর হিসাব। ক্রেডিট দিয়ে বিনামূল্যে ডাউনলোড ও ব্যবহার করা যাবে।'),
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('code'), T('Download SQL', 'SQL ডাউনলোড'), ic('info'),
        T('Every month with an operator split is checked: the four operators must add up to the published total. Blank cells are months where no published figure was found.', 'অপারেটরভিত্তিক প্রতিটা মাস যাচাই করা: চার অপারেটরের যোগফল প্রকাশিত মোটের সমান হতে হবে। ফাঁকা ঘর মানে সেই মাসের প্রকাশিত সংখ্যা পাওয়া যায়নি।'),
        th, trs, T('Coming next: the full archive from 2015, taken directly from BTRC reports.', 'শীঘ্রই আসছে: ২০১৫ থেকে পুরো আর্কাইভ, সরাসরি BTRC এর রিপোর্ট থেকে।'))
    write('data/index.html', page('data/', 'data', 'Bangladesh mobile and internet subscriber data (BTRC) | BD Telecom', 'বাংলাদেশের মোবাইল ও ইন্টারনেট গ্রাহক ডেটা (BTRC) | BD Telecom',
          'Monthly BTRC subscriber data for Grameenphone, Robi, Banglalink and Teletalk, plus mobile and fixed internet. Download as CSV.', body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))

    # guides
    guides = json.load(open(os.path.join(HERE, 'guides.json'), encoding='utf8'))
    cards = ''
    for g in guides:
        cards += '<a class="linkcard" href="/bd-telecom/guides/%s/"><span class="ti"><span class="ic" style="%s">%s</span>%s</span><p>%s</p></a>' % (g['slug'], tint(g['color']), ic(g['icon']), T(esc(g['title_en']), esc(g['title_bn'])), T(esc(g['sum_en']), esc(g['sum_bn'])))
        srcs = ''.join('<li><a href="%s" rel="noopener">%s</a></li>' % (esc(u), esc(t)) for t, u in g['sources'])
        gb = ('<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header><article class="prose">%s<div class="srcs"><b>%s</b><ol>%s</ol><p>%s</p></div></article>') % (
            T(esc(g['title_en']), esc(g['title_bn'])), T(esc(g['sum_en']), esc(g['sum_bn'])), T('Updated ' + UPDATED[0], 'হালনাগাদ: ' + UPDATED[1]),
            '<div data-en>%s</div><div data-bn>%s</div>' % (g['body_en'], g['body_bn']), T('Sources', 'সূত্র'), srcs,
            T('Rules change. Check with BTRC (helpline 100) or your operator (121) before acting.', 'নিয়ম বদলাতে পারে। কিছু করার আগে BTRC (হেল্পলাইন ১০০) বা আপনার অপারেটরের (১২১) সাথে মিলিয়ে নিন।'))
        write('guides/%s/index.html' % g['slug'], page('guides/%s/' % g['slug'], 'guides', g['title_en'] + ' | BD Telecom', g['title_bn'] + ' | BD Telecom', g['sum_en'], gb, default_lang='bn',
              crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/guides/', 'Guides', 'গাইড')]))
    body = '<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header><div class="cards">%s</div>' % (
        T('Telecom guides for Bangladesh', 'বাংলাদেশের টেলিকম গাইড'), T('Plain-language answers to common questions about SIMs, handsets and mobile rules, with sources.', 'SIM, হ্যান্ডসেট আর মোবাইলের নিয়ম নিয়ে সাধারণ প্রশ্নের সহজ উত্তর, সূত্র সহ।'), cards)
    write('guides/index.html', page('guides/', 'guides', 'Telecom guides for Bangladesh | BD Telecom', 'বাংলাদেশের টেলিকম গাইড | BD Telecom',
          'Simple guides to SIM limits, checking SIMs on your NID and checking if a phone is legal under NEIR in Bangladesh.', body, default_lang='bn',
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))

    # sitemap + robots for the whole site
    pages = ['', 'tools/pdf-squeeze/', 'tools/pixelshrink/', 'rssp-demo/', 'bd-telecom/', 'bd-telecom/operators/', 'bd-telecom/data/', 'bd-telecom/guides/'] + \
            ['bd-telecom/operators/%s/' % o['slug'] for o in OPS] + ['bd-telecom/guides/%s/' % g['slug'] for g in guides]
    if os.path.isdir(os.path.join(SITE, 'churn')): pages.append('churn/')
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>https://imtiazkarim.com/%s</loc></url>\n' % p for p in pages) + '</urlset>\n'
    open(os.path.join(SITE, 'sitemap.xml'), 'w').write(sm)
    open(os.path.join(SITE, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: https://imtiazkarim.com/sitemap.xml\n')
    print('built', len(pages), 'pages in sitemap')

if __name__ == '__main__':
    build()
