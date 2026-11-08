"""Operator finance pages from listed operators' quarterly results. Robi first; Grameenphone and Banglalink slot in later."""
import csv, os

SRC = 'robi-financials.csv'
QBN = {'1': '১', '2': '২', '3': '৩', '4': '৪'}


def load(B):
    rows = list(csv.DictReader(open(os.path.join(B.HERE, 'data_src', SRC))))
    for r in rows:
        for k in list(r):
            if k != 'quarter': r[k] = float(r[k]) if r[k] != '' else None
        q = r['quarter']; r['q'], r['y'] = q[0], int('20' + q[2:])
        r['key'] = r['y'] * 10 + int(r['q'])
        r['rev_cr'] = r['total_rev'] / 10; r['ebitda_cr'] = r['ebitda'] / 10; r['pat_cr'] = r['pat'] / 10; r['capex_cr'] = r['capex'] / 10
        r['data_cr'] = r['data_rev_bn'] * 100 if r['data_rev_bn'] is not None else None
        r['data_share'] = r['data_cr'] / r['rev_cr'] * 100 if r['data_cr'] is not None else None
        r['sites_k'] = r['sites'] / 1000; r['sites4_k'] = r['sites_4g'] / 1000
    rows.sort(key=lambda r: r['key'])
    return rows


def ql(r, lang='en', short=False):
    if lang == 'bn': return 'Q%s %s' % (QBN[r['q']], ''.join('০১২৩৪৫৬৭৮৯'[int(c)] for c in (str(r['y'])[2:] if short else str(r['y']))))
    return "Q%s '%s" % (r['q'], str(r['y'])[2:]) if short else 'Q%s %d' % (r['q'], r['y'])


def fmt(v, d=0, lang='en'):
    s = ('{:,.%df}' % d).format(v)
    if lang == 'bn': s = ''.join('০১২৩৪৫৬৭৮৯'[int(c)] if c.isdigit() else c for c in s)
    return s


def qchart(B, rows, series, ymin, ymax, step, unit_en, unit_bn, d=0, kind='bar', h=260, W=720):
    """Quarterly chart. kind='bar' draws the first series as bars; any other series are lines. Hover uses the shared .pt tooltip."""
    T, bn = B.T, B.bn
    H, L, R, TP, BT = h, 52, 18 if kind == 'bar' else 110, 14, 26
    n = len(rows); iw, ih = W - L - R, H - TP - BT
    slot = iw / n
    x = lambda i: L + slot * (i + .5)
    y = lambda v: TP + ih - (v - ymin) / (ymax - ymin) * ih
    o = ['<svg viewBox="0 0 %d %d" role="img" class="schart">' % (W, H)]
    t = ymin
    while t <= ymax + 1e-9:
        o.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="var(--grid)"/>' % (L, W - R, y(t), y(t)))
        o.append('<text x="%d" y="%.1f" text-anchor="end">%s</text>' % (L - 8, y(t) + 4, T(fmt(t, 0 if step >= 1 else 1) + ('%' if unit_en == '%' else ''), fmt(t, 0 if step >= 1 else 1, 'bn') + ('%' if unit_en == '%' else ''), 'tspan')))
        t += step
    for i, r in enumerate(rows):
        if r['q'] == '1' or i == 0:
            o.append('<text x="%.1f" y="%d" text-anchor="%s">%s</text>' % (x(i) - slot / 2, H - 6, 'start', T(str(r['y']), bn(str(r['y'])), 'tspan')))
            if i: o.append('<line x1="%.1f" x2="%.1f" y1="%d" y2="%d" stroke="var(--grid)"/>' % (x(i) - slot / 2, x(i) - slot / 2, TP, H - BT + 4))
    labels = []
    for si, (key, en, bnn, col) in enumerate(series):
        if kind == 'bar' and si == 0:
            bw = slot * .68
            for i, r in enumerate(rows):
                v = r[key]
                if v is None: continue
                y0, y1 = y(max(v, 0)), y(min(v, 0)) if ymin < 0 else y(ymin)
                o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="2" fill="var(%s)" opacity="%s"/>' % (x(i) - bw / 2, y0, bw, max(y1 - y0, 1), '--down' if v < 0 else col, '1' if i == n - 1 else '.82'))
        else:
            dpath, pen, last = '', False, None
            for i, r in enumerate(rows):
                v = r[key]
                if v is None: pen = False; continue
                dpath += ('L' if pen else 'M') + '%.1f %.1f' % (x(i), y(v)); pen = True; last = (i, v)
            o.append('<path d="%s" fill="none" stroke="var(%s)" stroke-width="2.2" stroke-linejoin="round"/>' % (dpath, col))
            if last:
                o.append('<circle cx="%.1f" cy="%.1f" r="4" fill="var(%s)" stroke="var(--surface)" stroke-width="2"/>' % (x(last[0]), y(last[1]), col))
                labels.append([y(last[1]), en, bnn, last[1], col, x(last[0])])
        for i, r in enumerate(rows):
            v = r[key]
            if v is None: continue
            o.append('<circle class="pt" cx="%.1f" cy="%.1f" r="6" fill="transparent" data-men="%s" data-mbn="%s" data-sen="%s" data-sbn="%s" data-ven="%s" data-vbn="%s" data-c="%s"></circle>' % (
                x(i), y(v), ql(r), ql(r, 'bn'), en, bnn, fmt(v, d) + unit_en, fmt(v, d, 'bn') + unit_bn, '--down' if (kind == 'bar' and si == 0 and v < 0) else col))
    labels.sort(key=lambda a: a[0])
    for j in range(1, len(labels)):
        if labels[j][0] - labels[j - 1][0] < 30: labels[j][0] = labels[j - 1][0] + 30
    for ly, en, bnn, v, col, lx in labels:
        o.append('<text x="%.1f" y="%.1f" class="lbl">%s</text>' % (lx + 9, ly + 1, T(en, bnn, 'tspan')))
        o.append('<text x="%.1f" y="%.1f" class="note">%s</text>' % (lx + 9, ly + 15, T(fmt(v, d) + unit_en, fmt(v, d, 'bn') + unit_bn, 'tspan')))
    o.append('</svg>')
    return '<div class="chart scroll qend">' + ''.join(o) + '</div>'


def build_finance(B):
    T, bn, ic, page, write, sgn = B.T, B.bn, B.ic, B.page, B.write, B.sgn
    R = load(B)
    L = R[-1]; P = R[-2]; Y = [r for r in R if r['key'] == L['key'] - 10][0]
    ytd = [r for r in R if r['y'] == L['y']]; ytd0 = [r for r in R if r['y'] == L['y'] - 1 and int(r['q']) <= int(L['q'])]
    s = lambda rs, k: sum(r[k] for r in rs)
    pc = lambda a, b: (a - b) / abs(b) * 100

    # CSV for download
    out_cols = ['quarter', 'total_rev', 'mobile_rev', 'interconnect_rev', 'other_rev', 'ebitda', 'ebitda_margin_pct', 'dep_amort', 'ebit', 'pat', 'capex', 'total_assets', 'total_liabilities', 'total_equity',
                'subs_m', 'data_subs_m', 'users_4g_m', 'arpu_bdt', 'mou_min', 'mb_per_sub', 'gb_per_sub_month', 'data_rev_bn', 'sites', 'sites_4g']
    raw = list(csv.DictReader(open(os.path.join(B.HERE, 'data_src', SRC))))
    with open(os.path.join(B.OUT, 'robi-financials-2020-2026.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['quarter'] + [c + ('_bdt_m' if c in ('total_rev', 'mobile_rev', 'interconnect_rev', 'other_rev', 'ebitda', 'dep_amort', 'ebit', 'pat', 'capex', 'total_assets', 'total_liabilities', 'total_equity') else '') for c in out_cols[1:]])
        for r in raw: w.writerow([r[c] for c in out_cols])

    def tile(en, bnn, v_en, v_bn, d_en, d_bn, cls=''):
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(v_en, v_bn), T(d_en, d_bn), T(ql(L) + ' · Robi', ql(L, 'bn') + ' · রবি'))

    def yoy(k, d=1, unit='%'):
        v = pc(L[k], Y[k]); c = 'up' if v > 0 else 'down'
        return ('<b class="%s">%s%%</b> vs %s' % (c, sgn(v, d), ql(Y, 'en', True)), '%s এর তুলনায় <b class="%s">%s%%</b>' % (ql(Y, 'bn', True), c, sgn(v, d, 'bn')))

    def pp(k):
        v = L[k] - Y[k]; c = 'up' if v > 0 else 'down'
        return ('<b class="%s">%s pts</b> vs %s' % (c, sgn(v, 1), ql(Y, 'en', True)), '%s এর তুলনায় <b class="%s">%s পয়েন্ট</b>' % (ql(Y, 'bn', True), c, sgn(v, 1, 'bn')))

    tiles = (tile('Revenue', 'রেভিনিউ', fmt(L['rev_cr']) + '<small> Tk cr</small>', fmt(L['rev_cr'], 0, 'bn') + '<small> কোটি টাকা</small>', *yoy('rev_cr'))
             + tile('EBITDA margin', 'EBITDA মার্জিন', fmt(L['ebitda_margin_pct'], 1) + '<small>%</small>', fmt(L['ebitda_margin_pct'], 1, 'bn') + '<small>%</small>', *pp('ebitda_margin_pct'))
             + tile('Profit after tax', 'কর-পরবর্তী মুনাফা', fmt(L['pat_cr']) + '<small> Tk cr</small>', fmt(L['pat_cr'], 0, 'bn') + '<small> কোটি টাকা</small>', *yoy('pat_cr'))
             + tile('ARPU (monthly)', 'ARPU (মাসিক)', fmt(L['arpu_bdt']) + '<small> Tk</small>', fmt(L['arpu_bdt'], 0, 'bn') + '<small> টাকা</small>', *yoy('arpu_bdt'))
             + tile('Subscribers', 'গ্রাহক', fmt(L['subs_m'], 1) + '<small>m</small>', fmt(L['subs_m'], 1, 'bn') + '<small>মি.</small>', *yoy('subs_m'))
             + tile('Data revenue share', 'রেভিনিউতে ডেটার ভাগ', fmt(L['data_share'], 1) + '<small>%</small>', fmt(L['data_share'], 1, 'bn') + '<small>%</small>', *pp('data_share'))
             + tile('Data use per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার', fmt(L['gb_per_sub_month'], 1) + '<small> GB/mo</small>', fmt(L['gb_per_sub_month'], 1, 'bn') + '<small> GB/মাস</small>', *yoy('gb_per_sub_month'))
             + tile('Network sites', 'নেটওয়ার্ক সাইট', fmt(L['sites']), fmt(L['sites'], 0, 'bn'), *yoy('sites')))

    r9, r90 = s(ytd, 'rev_cr'), s(ytd0, 'rev_cr'); p9, p90 = s(ytd, 'pat_cr'), s(ytd0, 'pat_cr')
    best = max(R, key=lambda r: r['rev_cr'])
    F = R[0]
    story = T(('In %s Robi earned Tk %s crore in revenue, %s%% %s than a year earlier, and kept Tk %s crore as profit after tax. '
               'For the first %d quarters of %d revenue reached Tk %s crore (%s%%) and profit Tk %s crore (%s%%). '
               'Quarterly revenue has grown from Tk %s crore in %s, and the best quarter on record is %s at Tk %s crore. '
               'Data now brings in %s%% of revenue, and the average subscriber uses %s GB a month.') % (
        ql(L), fmt(L['rev_cr']), fmt(abs(pc(L['rev_cr'], Y['rev_cr'])), 1), 'more' if L['rev_cr'] > Y['rev_cr'] else 'less', fmt(L['pat_cr']), len(ytd), L['y'], fmt(r9), sgn(pc(r9, r90), 1), fmt(p9), sgn(pc(p9, p90), 1),
        fmt(F['rev_cr']), ql(F), ql(best), fmt(best['rev_cr']), fmt(L['data_share'], 1), fmt(L['gb_per_sub_month'], 1)),
        ('%s এ রবির রেভিনিউ %s কোটি টাকা, আগের বছরের একই প্রান্তিকের চেয়ে %s%% %s, আর কর-পরবর্তী মুনাফা %s কোটি টাকা। '
         '%s সালের প্রথম %sটি প্রান্তিকে রেভিনিউ %s কোটি টাকা (%s%%) আর মুনাফা %s কোটি টাকা (%s%%)। '
         '%s এ প্রান্তিক রেভিনিউ ছিল %s কোটি টাকা। এখন পর্যন্ত সবচেয়ে বেশি রেভিনিউ %s এ, %s কোটি টাকা। '
         'রেভিনিউর %s%% এখন আসে ডেটা থেকে, আর একজন গ্রাহক গড়ে মাসে %s GB ডেটা ব্যবহার করেন।') % (
        ql(L, 'bn'), fmt(L['rev_cr'], 0, 'bn'), fmt(abs(pc(L['rev_cr'], Y['rev_cr'])), 1, 'bn'), 'বেশি' if L['rev_cr'] > Y['rev_cr'] else 'কম', fmt(L['pat_cr'], 0, 'bn'), bn(L['y']), bn(len(ytd)), fmt(r9, 0, 'bn'), sgn(pc(r9, r90), 1, 'bn'), fmt(p9, 0, 'bn'), sgn(pc(p9, p90), 1, 'bn'),
        ql(F, 'bn'), fmt(F['rev_cr'], 0, 'bn'), ql(best, 'bn'), fmt(best['rev_cr'], 0, 'bn'), fmt(L['data_share'], 1, 'bn'), fmt(L['gb_per_sub_month'], 1, 'bn')), 'p')

    C = lambda *a, **k: qchart(B, R, *a, **k)
    charts = [
        (('Quarterly revenue', 'প্রান্তিক রেভিনিউ'), ('Tk crore. The latest quarter is shaded darker.', 'কোটি টাকা। সর্বশেষ প্রান্তিক গাঢ় রঙে।'),
         C([('rev_cr', 'Revenue', 'রেভিনিউ', '--robi')], 0, 2800, 700, ' cr', ' কোটি')),
        (('EBITDA margin', 'EBITDA মার্জিন'), ('EBITDA as a share of revenue, %', 'রেভিনিউর তুলনায় EBITDA, %'),
         C([('ebitda_margin_pct', 'EBITDA margin', 'EBITDA মার্জিন', '--robi')], 30, 60, 10, '%', '%', d=1, kind='line')),
        (('Profit after tax', 'কর-পরবর্তী মুনাফা'), ('Tk crore. Red bars are losses.', 'কোটি টাকা। লাল বার মানে লোকসান।'),
         C([('pat_cr', 'Profit after tax', 'কর-পরবর্তী মুনাফা', '--accent')], -100, 400, 100, ' cr', ' কোটি')),
        (('Data revenue and its share of revenue', 'ডেটা রেভিনিউ আর মোট রেভিনিউতে এর ভাগ'), ('Data revenue in Tk crore (bars). Robi publishes it from the last quarter of 2020.', 'ডেটা রেভিনিউ, কোটি টাকা (বার)। রবি এটা ২০২০ এর শেষ প্রান্তিক থেকে প্রকাশ করে।'),
         C([('data_cr', 'Data revenue', 'ডেটা রেভিনিউ', '--gp')], 0, 1300, 325, ' cr', ' কোটি')),
        (('Data use per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার'), ('GB per subscriber per month', 'প্রতি মাসে গ্রাহকপ্রতি GB'),
         C([('gb_per_sub_month', 'GB per month', 'মাসে GB', '--gp')], 0, 12, 3, ' GB', ' GB', d=1)),
        (('Subscribers', 'গ্রাহক'), ('Millions: all subscribers, data users and 4G data users', 'মিলিয়ন: মোট গ্রাহক, ডেটা ব্যবহারকারী আর 4G ডেটা ব্যবহারকারী'),
         C([('subs_m', 'All', 'মোট', '--robi'), ('data_subs_m', 'Data', 'ডেটা', '--gp'), ('users_4g_m', '4G data', '4G ডেটা', '--tt')], 0, 60, 15, 'm', ' মি.', d=1, kind='line', h=280)),
        (('ARPU', 'ARPU'), ('Average monthly revenue per user, Tk. See the note on method changes below.', 'গ্রাহকপ্রতি গড় মাসিক আয়, টাকা। পদ্ধতি বদলের নোট নিচে দেখুন।'),
         C([('arpu_bdt', 'ARPU', 'ARPU', '--robi')], 100, 160, 15, ' Tk', ' টাকা', kind='line')),
        (('Capital spending', 'মূলধনী বিনিয়োগ (ক্যাপেক্স)'), ('Tk crore, excluding spectrum and leased assets', 'কোটি টাকা, তরঙ্গ আর লিজ সম্পদ বাদে'),
         C([('capex_cr', 'Capex', 'ক্যাপেক্স', '--amber')], 0, 800, 200, ' cr', ' কোটি')),
        (('Network sites', 'নেটওয়ার্ক সাইট'), ('Thousands of on-air sites, all and 4G', 'চালু সাইট, হাজারে: মোট আর 4G'),
         C([('sites_k', 'All sites', 'মোট সাইট', '--robi'), ('sites4_k', '4G sites', '4G সাইট', '--tt')], 10, 22, 3, 'k', ' হা.', d=1, kind='line', h=260)),
    ]
    chtml = ''.join('<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>' % (T(*a), T(*b), c) for a, b, c in charts)

    # annual table
    years = sorted(set(r['y'] for r in R))
    arows = ''
    for yv in reversed(years):
        rs = [r for r in R if r['y'] == yv]
        if len(rs) < 4 and yv != L['y']: continue
        lab = T(str(yv), bn(yv)) if len(rs) == 4 else T('%d (Q1 to Q%s)' % (yv, L['q']), '%s (Q১ থেকে Q%s)' % (bn(yv), QBN[L['q']]))
        rev, eb, pat, cap = s(rs, 'rev_cr'), s(rs, 'ebitda_cr'), s(rs, 'pat_cr'), s(rs, 'capex_cr')
        dr = s(rs, 'data_cr') if all(r['data_cr'] is not None for r in rs) else None
        cell = lambda v, d=0: '<td>%s</td>' % (T(fmt(v, d), fmt(v, d, 'bn')) if v is not None else '<span class="gap">–</span>')
        arows += '<tr><td>%s</td>%s%s%s%s%s%s</tr>' % (lab, cell(rev), cell(eb), cell(eb / rev * 100, 1), cell(pat), cell(cap), cell(dr))
    ath = ''.join('<th>%s</th>' % T(a, b) for a, b in [('Year', 'বছর'), ('Revenue', 'রেভিনিউ'), ('EBITDA', 'EBITDA'), ('Margin %', 'মার্জিন %'), ('Profit after tax', 'কর-পরবর্তী মুনাফা'), ('Capex', 'ক্যাপেক্স'), ('Data revenue', 'ডেটা রেভিনিউ')])

    # quarterly table
    QC = [('rev_cr', 'Revenue (cr)', 'রেভিনিউ (কোটি)', 0), ('ebitda_cr', 'EBITDA (cr)', 'EBITDA (কোটি)', 0), ('ebitda_margin_pct', 'Margin %', 'মার্জিন %', 1), ('pat_cr', 'PAT (cr)', 'মুনাফা (কোটি)', 0),
          ('capex_cr', 'Capex (cr)', 'ক্যাপেক্স (কোটি)', 0), ('data_cr', 'Data rev (cr)', 'ডেটা রেভিনিউ (কোটি)', 0), ('subs_m', 'Subs (m)', 'গ্রাহক (মি.)', 1), ('data_subs_m', 'Data subs (m)', 'ডেটা গ্রাহক (মি.)', 1),
          ('users_4g_m', '4G users (m)', '4G ব্যবহারকারী (মি.)', 1), ('arpu_bdt', 'ARPU (Tk)', 'ARPU (টাকা)', 0), ('gb_per_sub_month', 'GB/sub/mo', 'GB/গ্রাহক/মাস', 1), ('mou_min', 'Minutes/sub', 'মিনিট/গ্রাহক', 0), ('sites', 'Sites', 'সাইট', 0), ('sites_4g', '4G sites', '4G সাইট', 0)]
    qth = '<th>%s</th>' % T('Quarter', 'প্রান্তিক') + ''.join('<th>%s</th>' % T(a, b) for _, a, b, _ in QC)
    def qcell(r, k, d):
        v = r[k]
        if v is None: return '<td><span class="gap">–</span></td>'
        fl = (k in ('data_cr', 'users_4g_m', 'gb_per_sub_month') and r['quarter'] == '3Q24')
        return '<td%s>%s</td>' % (' class="flag" title="Excludes free data"' if fl else '', T(fmt(v, d), fmt(v, d, 'bn')))
    qrows = ''.join('<tr><td>%s</td>%s</tr>' % (T(ql(r), ql(r, 'bn')), ''.join(qcell(r, k, d) for k, _, _, d in QC)) for r in reversed(R))

    notes = [
        ('ARPU method changes. Robi has changed how it calculates ARPU more than once, and its own reports show different values for the same quarter. For example, one 2025 summary gives 125 Tk for the first quarter of 2025 while the investor presentations give 138 Tk. This page uses the series that matches Robi’s latest presentations, so compare ARPU across long periods with care.',
         'ARPU এর হিসাবের পদ্ধতি: রবি একাধিকবার ARPU হিসাবের পদ্ধতি বদলেছে, তাই তাদের নিজেদের প্রতিবেদনেই একই প্রান্তিকের আলাদা সংখ্যা পাওয়া যায়। যেমন ২০২৫ এর একটি সারসংক্ষেপে ২০২৫ এর প্রথম প্রান্তিকের ARPU ১২৫ টাকা, কিন্তু বিনিয়োগকারীদের প্রেজেন্টেশনে ১৩৮ টাকা। এই পেজে রবির সর্বশেষ প্রেজেন্টেশনের সাথে মেলে এমন সিরিজ ব্যবহার করা হয়েছে, তাই দীর্ঘ সময়ের ARPU তুলনা সাবধানে করুন।'),
        ('Q3 2024: the older five-year summary repeats the second quarter’s balance sheet in the third quarter column. This page uses the corrected figures from Robi’s 2024 to 2025 summary (total assets Tk 213,546 million). Data revenue, 4G users and data use for that quarter exclude free data given during the period, as Robi notes; those cells are marked.',
         '২০২৪ এর তৃতীয় প্রান্তিক: পুরনো পাঁচ বছরের সারসংক্ষেপে তৃতীয় প্রান্তিকের ঘরে দ্বিতীয় প্রান্তিকের ব্যালেন্স শিটই আবার লেখা। এই পেজে রবির ২০২৪-২০২৫ সারসংক্ষেপের সংশোধিত সংখ্যা ব্যবহার করা হয়েছে (মোট সম্পদ ২,১৩,৫৪৬ মিলিয়ন টাকা)। রবির নোট অনুযায়ী ওই প্রান্তিকের ডেটা রেভিনিউ, 4G ব্যবহারকারী আর ডেটা ব্যবহারে বিনামূল্যের ডেটা ধরা হয়নি, ঘরগুলো চিহ্নিত।'),
        ('Q4 2025: depreciation jumped to Tk 6,624 million from about Tk 3,700 million a quarter, so operating profit (EBIT) fell to Tk 2,724 million even though EBITDA held steady. Profit after tax still rose that quarter.',
         '২০২৫ এর চতুর্থ প্রান্তিক: অবচয় প্রতি প্রান্তিকের প্রায় ৩,৭০০ মিলিয়ন টাকা থেকে বেড়ে ৬,৬২৪ মিলিয়ন টাকা হয়েছে, তাই EBITDA স্থির থাকলেও পরিচালন মুনাফা (EBIT) কমে ২,৭২৪ মিলিয়ন টাকা হয়েছে। তবু সেই প্রান্তিকে কর-পরবর্তী মুনাফা বেড়েছে।'),
        ('Every quarter is checked: mobile, interconnect and other revenue add up to total revenue; EBITDA minus depreciation and amortisation equals EBIT; liabilities plus equity equal total assets. Data revenue added up by year matches the yearly totals in Robi’s presentations.',
         'প্রতিটি প্রান্তিক যাচাই করা: মোবাইল, ইন্টারকানেক্ট আর অন্যান্য রেভিনিউ যোগ করলে মোট রেভিনিউ হয়; EBITDA থেকে অবচয় ও অ্যামর্টাইজেশন বাদ দিলে EBIT হয়; দায় আর ইকুইটি যোগ করলে মোট সম্পদ হয়। বছরভিত্তিক ডেটা রেভিনিউর যোগফল রবির প্রেজেন্টেশনের বার্ষিক মোটের সাথে মেলে।'),
    ]
    nhtml = ''.join('<li>%s</li>' % T(a, b) for a, b in notes)

    body = '''<header class="pagehead"><h1 style="display:flex;align-items:center;gap:14px">%s%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
%s
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary adm" href="/bd-telecom/robi-financials-2020-2026.csv" download>%s%s</a><a class="btn" href="https://www.robi.com.bd" rel="noopener">%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
%s
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="card"><div class="tablewrap"><table class="wide"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="callout warn"><span>%s</span><ul style="margin:0;padding-left:18px">%s</ul></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards"><a class="linkcard" href="/bd-telecom/operators/robi/"><span class="ti">%s%s</span><p>%s</p></a><a class="linkcard" href="/bd-telecom/kpi/"><span class="ti">%s</span><p>%s</p></a></div></section>''' % (
        B.badge(B.OPS[1], 'badge big'), T('Robi finances, 2020 to 2026', 'রবির আর্থিক অবস্থা, ২০২০ থেকে ২০২৬'),
        T('Revenue, profit, ARPU, data and network for every quarter from %s to %s, from Robi Axiata PLC’s published results.' % (ql(F), ql(L)),
          '%s থেকে %s পর্যন্ত প্রতি প্রান্তিকে রবির রেভিনিউ, মুনাফা, ARPU, ডেটা আর নেটওয়ার্ক, রবি আজিয়াটা পিএলসির প্রকাশিত ফলাফল থেকে।' % (ql(F, 'bn'), ql(L, 'bn'))),
        T('Latest: %s results, published 29 Oct 2026' % ql(L), 'সর্বশেষ: %s এর ফলাফল, প্রকাশ ২৯ অক্টো ২০২৬' % ql(L, 'bn')),
        story, tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('book'), T('Robi’s website', 'রবির ওয়েবসাইট'),
        ic('info'), T('All money figures are in Tk crore (1 crore = 10 million). Changes compare with the same quarter a year earlier. Robi is listed on the Dhaka and Chittagong stock exchanges and publishes these figures every quarter.',
                      'সব টাকার অঙ্ক কোটি টাকায় (১ কোটি = ১০ মিলিয়ন)। পরিবর্তন আগের বছরের একই প্রান্তিকের তুলনায়। রবি ঢাকা ও চট্টগ্রাম স্টক এক্সচেঞ্জে তালিকাভুক্ত, আর প্রতি প্রান্তিকে এই সংখ্যাগুলো প্রকাশ করে।'),
        chtml,
        T('Year by year', 'বছরভিত্তিক'), T('Tk crore, sum of the quarters', 'কোটি টাকা, প্রান্তিকগুলোর যোগফল'), ath, arows,
        T('Quarter by quarter', 'প্রান্তিকভিত্তিক'), T('Money in Tk crore. Shaded cells have a note below.', 'টাকার অঙ্ক কোটিতে। রঙিন ঘরের ব্যাখ্যা নিচে।'), qth, qrows,
        T('Notes on the data', 'ডেটা নিয়ে কিছু কথা'), ic('alert'), nhtml,
        T('Related', 'সম্পর্কিত'), B.badge(B.OPS[1]), T('Robi subscribers and market share', 'রবির গ্রাহক ও মার্কেট শেয়ার'), T('Monthly BTRC figures', 'BTRC এর মাসিক সংখ্যা'),
        T('All telecom KPIs', 'সব টেলিকম KPI'), T('Subscribers, quality, finance and infrastructure', 'গ্রাহক, মান, আর্থিক আর অবকাঠামো'))
    write('kpi/finance/robi/index.html', page('kpi/finance/robi/', 'kpi', 'Robi revenue, profit and ARPU by quarter, 2020 to 2026 | BD Telecom', 'রবির রেভিনিউ, মুনাফা ও ARPU, প্রান্তিকভিত্তিক ২০২০-২০২৬ | BD Telecom',
          'Robi Axiata quarterly results from %s to %s: revenue Tk %s crore in %s (%s%% a year), EBITDA margin %.1f%%, ARPU Tk %d. Charts, tables and CSV.' % (ql(F), ql(L), fmt(L['rev_cr']), ql(L), sgn(pc(L['rev_cr'], Y['rev_cr']), 1), L['ebitda_margin_pct'], L['arpu_bdt']), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))

    # cards for the KPI hub
    def hub(en, bnn, v_en, v_bn, ch, key, d):
        return ('<div class="tile kpi"><div class="l">%s %s</div><div class="v">%s</div><div class="d">%s</div>%s<a class="kmore" href="/bd-telecom/kpi/finance/robi/">%s</a><div class="meta">%s</div></div>' % (
            B.badge(B.OPS[1]), T(en, bnn), T(v_en, v_bn), T(*ch), spark(B, R[-12:], key), T('Full history and table →', 'পুরো ইতিহাস ও সারণি →'), T(ql(L) + ' · Robi results', ql(L, 'bn') + ' · রবির ফলাফল')))
    cards = (hub('Revenue (quarter)', 'রেভিনিউ (প্রান্তিক)', fmt(L['rev_cr']) + '<small> Tk cr</small>', fmt(L['rev_cr'], 0, 'bn') + '<small> কোটি</small>', yoy('rev_cr'), 'rev_cr', 0)
             + hub('EBITDA margin', 'EBITDA মার্জিন', fmt(L['ebitda_margin_pct'], 1) + '<small>%</small>', fmt(L['ebitda_margin_pct'], 1, 'bn') + '<small>%</small>', pp('ebitda_margin_pct'), 'ebitda_margin_pct', 1)
             + hub('ARPU (monthly)', 'ARPU (মাসিক)', fmt(L['arpu_bdt']) + '<small> Tk</small>', fmt(L['arpu_bdt'], 0, 'bn') + '<small> টাকা</small>', yoy('arpu_bdt'), 'arpu_bdt', 0)
             + hub('Capex (quarter)', 'ক্যাপেক্স (প্রান্তিক)', fmt(L['capex_cr']) + '<small> Tk cr</small>', fmt(L['capex_cr'], 0, 'bn') + '<small> কোটি</small>', yoy('capex_cr'), 'capex_cr', 0)
             + '<a class="tile kpi more" href="/bd-telecom/kpi/finance/robi/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (
                 T('Robi finances', 'রবির আর্থিক অবস্থা'), T('Every quarter since 2020', '২০২০ থেকে প্রতি প্রান্তিক'), T('Charts, tables and CSV', 'চার্ট, সারণি আর CSV')))
    note = T('Robi results to %s. Grameenphone and Banglalink are being added.' % ql(L), '%s পর্যন্ত রবির ফলাফল। গ্রামীণফোন আর বাংলালিংক যোগ হচ্ছে।' % ql(L, 'bn'))
    return cards, note, ['bd-telecom/kpi/finance/robi/']


def spark(B, rows, key):
    pts = [r[key] for r in rows if r[key] is not None]
    W, H, p = 200, 40, 5; mn, mx = min(pts), max(pts); n = len(pts)
    X = lambda i: p + i / (n - 1) * (W - 2 * p); Yy = lambda v: p + (1 - (v - mn) / ((mx - mn) or 1)) * (H - 2 * p)
    d = ''.join(('M' if i == 0 else 'L') + '%.1f %.1f' % (X(i), Yy(v)) for i, v in enumerate(pts))
    return '<svg class="mini" viewBox="0 0 %d %d" aria-hidden="true" style="margin:6px 0 2px"><path d="%s" fill="none" stroke="var(--robi)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="%.1f" cy="%.1f" r="3.4" fill="var(--robi)"/></svg>' % (W, H, d, X(n - 1), Yy(pts[-1]))
