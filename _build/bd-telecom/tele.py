"""Teledensity and penetration page, from BTRC's 'Teledensity and Penetration' table."""
import csv, os, shutil
SRC_EN = 'BTRC, Teledensity and Penetration table'
SRC_BN = 'BTRC, টেলিডেনসিটি ও পেনেট্রেশন সারণি'

def load(B):
    rows = list(csv.DictReader(open(os.path.join(B.HERE, 'data_src', 'teledensity.csv'))))
    for r in rows:
        for k in list(r):
            if k != 'month': r[k] = float(r[k]) if r[k] else None
    rows.sort(key=lambda r: r['month'])
    return rows

def chart(B, rows, series, ymin, ymax, step, unit, h=280, W=720, cls=''):
    T, bn, mlab = B.T, B.bn, B.mlab
    H, L, R, TP, BT = h, 44, 130, 14, 26
    n = len(rows); iw, ih = W - L - R, H - TP - BT
    x = lambda i: L + i * iw / (n - 1); y = lambda v: TP + ih - (v - ymin) / (ymax - ymin) * ih
    o = ['<svg viewBox="0 0 %d %d" role="img" class="schart">' % (W, H)]
    t = ymin
    while t <= ymax + 1e-9:
        o.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="var(--grid)"/>' % (L, W - R, y(t), y(t)))
        o.append('<text x="%d" y="%.1f" text-anchor="end">%s</text>' % (L - 8, y(t) + 4, T('%g%s' % (t, unit), '%s%s' % (bn('%g' % t), unit), 'tspan')))
        t += step
    for i, r in enumerate(rows):
        if r['month'].endswith('-01') or i == n - 1 and False:
            o.append('<text x="%.1f" y="%d" text-anchor="middle">%s</text>' % (x(i), H - 6, T(r['month'][:4], bn(r['month'][:4]), 'tspan')))
    labels = []
    for key, en, bnn, col in series:
        d, pen, last = '', False, None
        for i, r in enumerate(rows):
            v = r[key]
            if v is None: pen = False; continue
            d += ('L' if pen else 'M') + '%.1f %.1f' % (x(i), y(v)); pen = True; last = (i, v)
        o.append('<path d="%s" fill="none" stroke="var(%s)" stroke-width="2" stroke-linejoin="round"/>' % (d, col))
        for i, r in enumerate(rows):
            if r[key] is not None:
                o.append('<circle cx="%.1f" cy="%.1f" r="6" fill="transparent"><title>%s, %s: %.2f%s</title></circle>' % (x(i), y(r[key]), en, mlab(r['month']), r[key], unit))
        i, v = last
        o.append('<circle cx="%.1f" cy="%.1f" r="4" fill="var(%s)" stroke="var(--surface)" stroke-width="2"/>' % (x(i), y(v), col))
        labels.append([y(v), en, bnn, v, col, x(i)])
    labels.sort(key=lambda a: a[0])
    for j in range(1, len(labels)):
        if labels[j][0] - labels[j - 1][0] < 30: labels[j][0] = labels[j - 1][0] + 30
    for ly, en, bnn, v, col, lx in labels:
        o.append('<text x="%.1f" y="%.1f" class="lbl">%s</text>' % (lx + 9, ly + 1, T(en, bnn, 'tspan')))
        o.append('<text x="%.1f" y="%.1f" class="note">%s</text>' % (lx + 9, ly + 15, T('%.2f%s' % (v, unit), bn('%.2f' % v) + unit, 'tspan')))
    o.append('</svg>')
    return '<div class="chart %s">' % cls + ''.join(o) + '</div>'

def build_tele(B):
    T, bn, ic, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num, B.sgn
    rows = load(B)
    shutil.copy(os.path.join(B.HERE, 'data_src', 'teledensity.csv'), os.path.join(B.OUT, 'teledensity-penetration.csv'))
    L = rows[-1]; P = rows[-2]; Y = [r for r in rows if r['month'] == '%d%s' % (int(L['month'][:4]) - 1, L['month'][4:])][0]
    def tile(key, en, bnn, unit='%', unit_bn='%'):
        v, p, yv = L[key], P[key], Y[key]
        u = '<small>%s</small>' % unit; ub = '<small>%s</small>' % unit_bn
        pts = unit == '%'
        ch = T('<b class="%s">%s%s</b> vs %s<br>%s%s in a year' % ('up' if v > p else 'down' if v < p else '', sgn(v - p), ' pts' if pts else unit, mlab(P['month'], 'en', True), sgn(v - yv), ' pts' if pts else unit),
               '%s এর তুলনায় <b class="%s">%s%s</b><br>এক বছরে %s%s' % (mlab(P['month'], 'bn', True), 'up' if v > p else 'down' if v < p else '', sgn(v - p, 2, 'bn'), ' পয়েন্ট' if pts else unit_bn, sgn(v - yv, 2, 'bn'), ' পয়েন্ট' if pts else unit_bn))
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(num(v) + u, num(v, 2, 'bn') + ub), ch, T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    tiles = ''.join([tile('teledensity_pct', 'Teledensity', 'টেলিডেনসিটি'), tile('internet_penetration_pct', 'Internet penetration', 'ইন্টারনেট পেনেট্রেশন'),
                     tile('mobile_internet_pct', 'Mobile internet penetration', 'মোবাইল ইন্টারনেট পেনেট্রেশন'), tile('fixed_broadband_pct', 'Fixed broadband penetration', 'ফিক্সড ব্রডব্যান্ড পেনেট্রেশন'),
                     tile('mobile_broadband_pct', 'Mobile broadband penetration', 'মোবাইল ব্রডব্যান্ড পেনেট্রেশন'), tile('subs_4g_m', '4G subscribers', '4G গ্রাহক', 'm', 'মি.'),
                     tile('subs_3g_m', '3G subscribers', '3G গ্রাহক', 'm', 'মি.'), tile('mobile_broadband_subs_m', 'Mobile broadband subscribers', 'মোবাইল ব্রডব্যান্ড গ্রাহক', 'm', 'মি.')])
    c1 = chart(B, rows, [('teledensity_pct', 'Teledensity', 'টেলিডেনসিটি', '--accent'), ('internet_penetration_pct', 'Internet', 'ইন্টারনেট', '--gp'),
                         ('mobile_internet_pct', 'Mobile internet', 'মোবাইল ইন্টারনেট', '--amber')], 60, 115, 10, '%', cls='scroll')
    c2 = chart(B, rows, [('fixed_broadband_pct', 'Fixed broadband', 'ফিক্সড ব্রডব্যান্ড', '--tt')], 5, 9, 1, '%', h=260, W=420)
    r3 = [r for r in rows if r['subs_4g_m'] is not None]
    c3 = chart(B, r3, [('subs_4g_m', '4G', '4G', '--gp'), ('subs_3g_m', '3G', '3G', '--robi')], 0, 130, 20, 'm', h=260, W=420)
    hd = ['Month', 'Teledensity', 'Internet', 'Fixed broadband', 'Mobile internet', 'Mobile broadband subs (m)', 'Mobile broadband', '3G (m)', '4G (m)']
    hb = ['মাস', 'টেলিডেনসিটি', 'ইন্টারনেট', 'ফিক্সড ব্রডব্যান্ড', 'মোবাইল ইন্টারনেট', 'মোবাইল ব্রডব্যান্ড গ্রাহক (মি.)', 'মোবাইল ব্রডব্যান্ড', '3G (মি.)', '4G (মি.)']
    ks = ['teledensity_pct', 'internet_penetration_pct', 'fixed_broadband_pct', 'mobile_internet_pct', 'mobile_broadband_subs_m', 'mobile_broadband_pct', 'subs_3g_m', 'subs_4g_m']
    FLAG = {('2024-09', 'mobile_internet_pct'), ('2022-07', 'fixed_broadband_pct'), ('2024-05', 'mobile_broadband_subs_m'), ('2024-06', 'mobile_broadband_subs_m'), ('2024-05', 'mobile_broadband_pct')}
    def cell(r, k):
        v = r[k]
        if v is None: return '<td class="gap">–</td>'
        pct = k.endswith('pct'); s = ('%.2f' % v) + ('%' if pct else '')
        f = ' class="flag" title="Check: see the note below"' if (r['month'], k) in FLAG else ''
        return '<td%s>%s</td>' % (f, T(s, bn(s)))
    trs = ''.join('<tr><td>%s</td>%s</tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), ''.join(cell(r, k) for k in ks)) for r in reversed(rows))
    th = ''.join('<th>%s</th>' % T(a, b) for a, b in zip(hd, hb))
    first = rows[0]
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/teledensity-penetration.csv" download>%s%s</a></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="grid2"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></div></section>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="wide"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Teledensity and internet penetration in Bangladesh', 'বাংলাদেশে টেলিডেনসিটি ও ইন্টারনেট পেনেট্রেশন'),
        T('How many mobile and internet subscriptions there are per 100 people, every month from %s to %s, with 3G and 4G subscribers.' % (mlab(first['month']), mlab(L['month'])),
          'প্রতি ১০০ জনে কয়টা মোবাইল আর ইন্টারনেট সাবস্ক্রিপশন, %s থেকে %s পর্যন্ত প্রতি মাসে, সাথে 3G আর 4G গ্রাহক।' % (mlab(first['month'], 'bn'), mlab(L['month'], 'bn'))),
        T('Latest data %s · source BTRC' % mlab(L['month']), 'সর্বশেষ ডেটা %s · সূত্র BTRC' % mlab(L['month'], 'bn')), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'),
        T('Teledensity, internet and mobile internet', 'টেলিডেনসিটি, ইন্টারনেট আর মোবাইল ইন্টারনেট'), T('Subscriptions per 100 people, %', 'প্রতি ১০০ জনে সাবস্ক্রিপশন, %'), c1,
        T('Fixed broadband', 'ফিক্সড ব্রডব্যান্ড'), T('Per 100 people, %', 'প্রতি ১০০ জনে, %'), c2,
        T('3G and 4G subscribers', '3G আর 4G গ্রাহক'), T('Millions, from %s' % mlab(r3[0]['month']), 'মিলিয়ন, %s থেকে' % mlab(r3[0]['month'], 'bn')), c3,
        ic('info'), T('Teledensity counts voice and internet subscriptions, not people. One person can have several SIMs, so it can go above 100%. Internet penetration equals fixed broadband plus mobile internet.',
                      'টেলিডেনসিটি মানুষ নয়, ভয়েস আর ইন্টারনেট সাবস্ক্রিপশন গোনে। একজনের একাধিক SIM থাকতে পারে, তাই এটা ১০০% ছাড়াতে পারে। ইন্টারনেট পেনেট্রেশন = ফিক্সড ব্রডব্যান্ড + মোবাইল ইন্টারনেট।'),
        T('Month by month', 'মাসভিত্তিক'), th, trs, ic('alert'),
        T('Figures are shown exactly as BTRC publishes them. Highlighted cells look inconsistent in the source: September 2024 mobile internet repeats August (internet minus fixed gives 71.60%); July 2022 fixed broadband reads 6.04% where the total implies 6.40%; mobile broadband subscribers jump to 127.3m and 129.17m in May and June 2024. The 3G and 4G counts also do not add up to the mobile broadband total, and BTRC does not explain the difference. From June 2023 back, BTRC publishes only the four penetration rates.',
          'সংখ্যাগুলো BTRC যেভাবে প্রকাশ করেছে ঠিক সেভাবেই দেখানো হয়েছে। চিহ্নিত ঘরগুলো মূল উৎসে অসামঞ্জস্যপূর্ণ মনে হয়: সেপ্টেম্বর ২০২৪ এর মোবাইল ইন্টারনেট আগস্টের পুনরাবৃত্তি (ইন্টারনেট থেকে ফিক্সড বাদ দিলে ৭১.৬০%); জুলাই ২০২২ এ ফিক্সড ব্রডব্যান্ড ৬.০৪%, যেখানে মোট অনুযায়ী ৬.৪০% হয়; মে আর জুন ২০২৪ এ মোবাইল ব্রডব্যান্ড গ্রাহক হঠাৎ ১২৭.৩ ও ১২৯.১৭ মিলিয়ন। 3G আর 4G গ্রাহকের যোগফলও মোবাইল ব্রডব্যান্ডের মোটের সাথে মেলে না, আর BTRC এর ব্যাখ্যা দেয়নি। জুন ২০২৩ এর আগে BTRC শুধু চারটি পেনেট্রেশনের হার প্রকাশ করে।'))
    write('kpi/teledensity/index.html', page('kpi/teledensity/', 'kpi', 'Teledensity and internet penetration in Bangladesh (BTRC, monthly) | BD Telecom', 'বাংলাদেশে টেলিডেনসিটি ও ইন্টারনেট পেনেট্রেশন | BD Telecom',
          'Bangladesh teledensity %.2f%% and internet penetration %.2f%% in %s. Monthly BTRC data since 2021 with mobile broadband, 3G and 4G subscribers. Download CSV.' % (L['teledensity_pct'], L['internet_penetration_pct'], mlab(L['month'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
    return L, P
