"""Operator finance pages from listed operators' quarterly results: one page per operator plus a comparison page."""
import csv, os

QBN = {'1': '১', '2': '২', '3': '৩', '4': '৪'}


def load(B, src):
    rows = list(csv.DictReader(open(os.path.join(B.HERE, 'data_src', src))))
    for r in rows:
        for k in list(r):
            if k != 'quarter': r[k] = float(r[k]) if r[k] != '' else None
        q = r['quarter']; r['q'], r['y'] = q[0], int('20' + q[2:])
        r['key'] = r['y'] * 10 + int(r['q'])
        r['rev_cr'] = r['total_rev'] / 10; r['ebitda_cr'] = r['ebitda'] / 10; r['pat_cr'] = r['pat'] / 10 if r.get('pat') is not None else None; r['capex_cr'] = r['capex'] / 10
        r['data_cr'] = r['data_rev_bn'] * 100 if r['data_rev_bn'] is not None else None
        r['data_share'] = r['data_cr'] / r['rev_cr'] * 100 if r['data_cr'] is not None else None
        r['sites_k'] = r['sites'] / 1000 if r.get('sites') else None; r['sites4_k'] = r['sites_4g'] / 1000 if r.get('sites_4g') else None
        r['du_share'] = r['data_subs_m'] / r['subs_m'] * 100 if r.get('data_subs_m') else None
        r['u4_share'] = r['users_4g_m'] / r['subs_m'] * 100 if r.get('users_4g_m') else None
        for k in ('pat', 'data_subs_m', 'users_4g_m', 'eps_bdt', 'sites', 'sites_4g', 'mou_min', 'digital_rev'): r.setdefault(k, None)
        r['digital_cr'] = r['digital_rev'] / 10 if r.get('digital_rev') is not None else None
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
    """Quarterly chart. kind='bar' draws the first series as bars with a value on every bar; other series are lines.
    Every series gets its highest and lowest quarter marked. Hover uses the shared .pt tooltip."""
    T, bn = B.T, B.bn
    bars = kind == 'bar'
    h = h + (44 if bars else 30)
    H, L, R, TP, BT = h, 52, 18 if bars else 110, (48 if bars else 34), 26
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
    sv = lambda v: (fmt(v, d), fmt(v, d, 'bn'))
    labels, marks, boxes = [], [], []
    def place(cx, cy, w_, up):
        """Nudge a label vertically until it does not overlap one already placed."""
        for k in range(8):
            yy = cy + (-1 if up else 1) * 13 * k
            if all(abs(cx - bx) > (w_ + bw) / 2 + 2 or abs(yy - by) > 12 for bx, by, bw in boxes):
                boxes.append((cx, yy, w_)); return yy
        boxes.append((cx, cy, w_)); return cy
    for si, (key, en, bnn, col) in enumerate(series):
        pts = [(i, r[key]) for i, r in enumerate(rows) if r[key] is not None]
        if not pts: continue
        hi = max(pts, key=lambda p: p[1]); lo = min(pts, key=lambda p: p[1])
        if bars and si == 0:
            bw = slot * .68
            for i, v in pts:
                y0, y1 = y(max(v, 0)), y(min(v, 0)) if ymin < 0 else y(ymin)
                o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="2" fill="var(%s)" opacity="%s"/>' % (x(i) - bw / 2, y0, bw, max(y1 - y0, 1), '--down' if v < 0 else col, '1' if i == pts[-1][0] else '.82'))
                ex = (i == hi[0] or i == lo[0])
                ty = (y(v) + 5) if v < 0 else (y0 - 4)
                o.append('<text class="bv%s" transform="rotate(-90 %.1f %.1f)" x="%.1f" y="%.1f" text-anchor="%s" dominant-baseline="central">%s</text>' % (
                    ' ex' if ex else '', x(i), ty, x(i), ty, 'end' if v < 0 else 'start', T(sv(v)[0], sv(v)[1], 'tspan')))
                if ex:
                    ln = 6.4 * len(sv(v)[0]) + 6
                    my = (ty + ln + 9) if v < 0 else (ty - ln - 2)
                    o.append('<text class="pk" x="%.1f" y="%.1f" text-anchor="middle" style="fill:var(%s)">%s</text>' % (x(i), my, '--up' if i == hi[0] else '--down', '▲' if i == hi[0] else '▼'))
        else:
            dpath, pen = '', False
            for i, r in enumerate(rows):
                v = r[key]
                if v is None: pen = False; continue
                dpath += ('L' if pen else 'M') + '%.1f %.1f' % (x(i), y(v)); pen = True
            o.append('<path d="%s" fill="none" stroke="var(%s)" stroke-width="2.2" stroke-linejoin="round"/>' % (dpath, col))
            li, lv = pts[-1]
            o.append('<circle cx="%.1f" cy="%.1f" r="4" fill="var(%s)" stroke="var(--surface)" stroke-width="2"/>' % (x(li), y(lv), col))
            labels.append([y(lv), en, bnn, lv, col, x(li)])
            fi, fv = pts[0]
            if fi not in (hi[0], lo[0]) and len(series) == 1:
                marks.append((fi, fv, col, '', False if fv >= (hi[1] + lo[1]) / 2 else True, 'first'))
            for (pi, pv), up, tag in ((hi, True, '▲ '), (lo, False, '▼ ')):
                if pi == li: continue
                marks.append((pi, pv, col, tag, up, 'ex'))
    for i, v, col, tag, up, cls in sorted(marks, key=lambda m: m[1], reverse=True):
        cx, cy = x(i), y(v)
        if cls == 'ex':
            o.append('<circle cx="%.1f" cy="%.1f" r="4.5" fill="var(--surface)" stroke="var(%s)" stroke-width="2.4"/>' % (cx, cy, col))
        else:
            o.append('<circle cx="%.1f" cy="%.1f" r="3" fill="var(%s)"/>' % (cx, cy, col))
        txt = tag + sv(v)[0] + ('' if unit_en.strip() in ('cr', 'm', 'k', 'GB', 'Tk') else unit_en.strip())
        wpx = 6.2 * len(txt) + 4
        if not up and cy + 18 > H - BT: up = True
        if up and cy - 10 < TP - 26: up = False
        ly = place(cx, cy - 10 if up else cy + 17, wpx, up)
        anchor = 'start' if cx - wpx / 2 < L else ('end' if cx + wpx / 2 > W - R + 40 else 'middle')
        o.append('<text class="pk" x="%.1f" y="%.1f" text-anchor="%s" style="fill:var(%s)">%s</text>' % (cx, ly, anchor, col, T(txt, tag + sv(v)[1] + ('' if unit_en.strip() in ('cr', 'm', 'k', 'GB', 'Tk') else unit_en.strip()), 'tspan')))
    for si, (key, en, bnn, col) in enumerate(series):
        for i, r in enumerate(rows):
            v = r[key]
            if v is None: continue
            o.append('<circle class="pt" cx="%.1f" cy="%.1f" r="6" fill="transparent" data-men="%s" data-mbn="%s" data-sen="%s" data-sbn="%s" data-ven="%s" data-vbn="%s" data-c="%s"></circle>' % (
                x(i), y(v), ql(r), ql(r, 'bn'), en, bnn, fmt(v, d) + unit_en, fmt(v, d, 'bn') + unit_bn, '--down' if (bars and si == 0 and v < 0) else col))
    labels.sort(key=lambda a: a[0])
    for j in range(1, len(labels)):
        if labels[j][0] - labels[j - 1][0] < 30: labels[j][0] = labels[j - 1][0] + 30
    for ly, en, bnn, v, col, lx in labels:
        o.append('<text x="%.1f" y="%.1f" class="lbl">%s</text>' % (lx + 9, ly + 1, T(en, bnn, 'tspan')))
        o.append('<text x="%.1f" y="%.1f" class="note">%s</text>' % (lx + 9, ly + 15, T(fmt(v, d) + unit_en, fmt(v, d, 'bn') + unit_bn, 'tspan')))
    o.append('</svg>')
    leg = ('<div class="pkleg">%s</div>' % T('▲ highest and ▼ lowest quarter are marked. Tap any quarter for its values.', '▲ সর্বোচ্চ আর ▼ সর্বনিম্ন প্রান্তিক চিহ্নিত। যেকোনো প্রান্তিকে ট্যাপ করলে সংখ্যা দেখাবে।'))
    return '<div class="chart scroll qend">' + ''.join(o) + '</div>' + leg


def nice(vals, n=4, floor0=True):
    """Round axis bounds and step for a quarterly chart."""
    vs = [v for v in vals if v is not None]
    lo, hi = min(vs), max(vs)
    if floor0 and lo >= 0: lo = 0
    span = (hi - lo) or abs(hi) or 1
    raw = span / n; mag = 10 ** len(str(int(raw))) / 10 if raw >= 1 else 0.1
    for m in (1, 2, 2.5, 5, 10):
        step = m * mag
        if step >= raw: break
    import math
    a = math.floor(lo / step) * step; b = math.ceil(hi * 1.04 / step) * step
    return a, b, step


FOOT = ('Data: Grameenphone and Robi Axiata published results, and VEON factbooks for Banglalink. Analysis by Mohd Imtiaz Karim.', 'ডেটা: গ্রামীণফোন আর রবি আজিয়াটার প্রকাশিত ফলাফল, আর বাংলালিংকের জন্য VEON এর ফ্যাক্টবুক। বিশ্লেষণ: মোহাম্মদ ইমতিয়াজ করিম।')


def bnfix(h):
    return h.replace('গ্রামীণফোন এর', 'গ্রামীণফোনের').replace('রবি এর', 'রবির').replace('বাংলালিংক এর', 'বাংলালিংকের')


MILLION_COLS = ('total_rev', 'mobile_rev', 'interconnect_rev', 'other_rev', 'ebitda', 'dep_amort', 'ebit', 'pat', 'capex', 'capex_incl_rou', 'total_assets', 'total_liabilities', 'total_equity')

OPS_FIN = {
    'robi': dict(src='robi-financials.csv', csv='robi-financials-2020-2026.csv', op=1, col='--robi', company='Robi Axiata PLC', company_bn='রবি আজিয়াটা পিএলসি',
                 pub=('29 Oct 2026', '২৯ অক্টো ২০২৬'), site='https://www.robi.com.bd',
                 tile8=('sites', 'Network sites', 'নেটওয়ার্ক সাইট', 0, '', ''),
                 notes=[
        ('ARPU method changes. Robi has changed how it calculates ARPU more than once, and its own reports show different values for the same quarter. For example, one 2025 summary gives 125 Tk for the first quarter of 2025 while the investor presentations give 138 Tk. This page uses the series that matches Robi’s latest presentations, so compare ARPU across long periods with care.',
         'ARPU এর হিসাবের পদ্ধতি: রবি একাধিকবার ARPU হিসাবের পদ্ধতি বদলেছে, তাই তাদের নিজেদের প্রতিবেদনেই একই প্রান্তিকের আলাদা সংখ্যা পাওয়া যায়। যেমন ২০২৫ এর একটি সারসংক্ষেপে ২০২৫ এর প্রথম প্রান্তিকের ARPU ১২৫ টাকা, কিন্তু বিনিয়োগকারীদের প্রেজেন্টেশনে ১৩৮ টাকা। এই পেজে রবির সর্বশেষ প্রেজেন্টেশনের সাথে মেলে এমন সিরিজ ব্যবহার করা হয়েছে, তাই দীর্ঘ সময়ের ARPU তুলনা সাবধানে করুন।'),
        ('Q3 2024: the older five-year summary repeats the second quarter’s balance sheet in the third quarter column. This page uses the corrected figures from Robi’s 2024 to 2025 summary (total assets Tk 213,546 million). Data revenue, 4G users and data use for that quarter exclude free data given during the period, as Robi notes; those cells are marked.',
         '২০২৪ এর তৃতীয় প্রান্তিক: পুরনো পাঁচ বছরের সারসংক্ষেপে তৃতীয় প্রান্তিকের ঘরে দ্বিতীয় প্রান্তিকের ব্যালেন্স শিটই আবার লেখা। এই পেজে রবির ২০২৪-২০২৫ সারসংক্ষেপের সংশোধিত সংখ্যা ব্যবহার করা হয়েছে (মোট সম্পদ ২,১৩,৫৪৬ মিলিয়ন টাকা)। রবির নোট অনুযায়ী ওই প্রান্তিকের ডেটা রেভিনিউ, 4G ব্যবহারকারী আর ডেটা ব্যবহারে বিনামূল্যের ডেটা ধরা হয়নি, ঘরগুলো চিহ্নিত।'),
        ('Q4 2025: depreciation jumped to Tk 6,624 million from about Tk 3,700 million a quarter, so operating profit (EBIT) fell to Tk 2,724 million even though EBITDA held steady. Profit after tax still rose that quarter.',
         '২০২৫ এর চতুর্থ প্রান্তিক: অবচয় প্রতি প্রান্তিকের প্রায় ৩,৭০০ মিলিয়ন টাকা থেকে বেড়ে ৬,৬২৪ মিলিয়ন টাকা হয়েছে, তাই EBITDA স্থির থাকলেও পরিচালন মুনাফা (EBIT) কমে ২,৭২৪ মিলিয়ন টাকা হয়েছে। তবু সেই প্রান্তিকে কর-পরবর্তী মুনাফা বেড়েছে।'),
        ('Every quarter is checked: mobile, interconnect and other revenue add up to total revenue; EBITDA minus depreciation and amortisation equals EBIT; liabilities plus equity equal total assets. Data revenue added up by year matches the yearly totals in Robi’s presentations.',
         'প্রতিটি প্রান্তিক যাচাই করা: মোবাইল, ইন্টারকানেক্ট আর অন্যান্য রেভিনিউ যোগ করলে মোট রেভিনিউ হয়; EBITDA থেকে অবচয় ও অ্যামর্টাইজেশন বাদ দিলে EBIT হয়; দায় আর ইকুইটি যোগ করলে মোট সম্পদ হয়। বছরভিত্তিক ডেটা রেভিনিউর যোগফল রবির প্রেজেন্টেশনের বার্ষিক মোটের সাথে মেলে।')],
                 flag=('3Q24', ('data_cr', 'users_4g_m', 'gb_per_sub_month'), 'Excludes free data')),
    'grameenphone': dict(src='gp-financials.csv', csv='grameenphone-financials-2020-2026.csv', op=0, col='--gp', company='Grameenphone Ltd.', company_bn='গ্রামীণফোন লিমিটেড',
               pub=('27 Oct 2026', '২৭ অক্টো ২০২৬'), site='https://www.grameenphone.com/about/investor-relations',
               tile8=('eps_bdt', 'Earnings per share', 'শেয়ারপ্রতি আয়', 2, ' Tk', ' টাকা'),
               notes=[
        ('Data revenue is shown only up to the end of 2023, because Grameenphone stopped publishing it after that. Grameenphone’s data revenue covers pay-as-you-go data, data packs and outbound roaming; data inside voice and data bundles is counted separately as bundle revenue, so it is not directly comparable with Robi’s data revenue.',
         'ডেটা রেভিনিউ দেখানো হয়েছে ২০২৩ সালের শেষ পর্যন্ত, কারণ এরপর গ্রামীণফোন এটা প্রকাশ করা বন্ধ করেছে। গ্রামীণফোনের ডেটা রেভিনিউতে আছে পে-অ্যাজ-ইউ-গো ডেটা, ডেটা প্যাক আর আউটবাউন্ড রোমিং; ভয়েস ও ডেটার বান্ডেল প্যাকের আয় আলাদা করে "বান্ডেল রেভিনিউ" হিসেবে গোনা হয়। তাই এটা রবির ডেটা রেভিনিউর সাথে সরাসরি তুলনীয় নয়।'),
        ('Active data users are subscriptions with at least 150 KB of data use in the last three months. Grameenphone published 4G data users only from the end of 2021 to the end of 2023, and does not publish quarterly site counts.',
         'সক্রিয় ডেটা ব্যবহারকারী মানে যে সাবস্ক্রিপশনে গত তিন মাসে অন্তত ১৫০ কেবি ডেটা ব্যবহার হয়েছে। গ্রামীণফোন 4G ডেটা ব্যবহারকারীর সংখ্যা শুধু ২০২১ এর শেষ থেকে ২০২৩ এর শেষ পর্যন্ত প্রকাশ করেছে, আর প্রান্তিকভিত্তিক সাইট সংখ্যা প্রকাশ করে না।'),
        ('Quarterly profit for 2020 comes from Grameenphone’s presentations and earnings per share (1,350.3 million shares). The four quarters add up to the audited 2020 profit of Tk 37,187 million. In the newest analytical workbook the 2020 subscriber and ARPU cells are misaligned, so those come from the 2021 workbook.',
         '২০২০ সালের প্রান্তিক মুনাফা নেওয়া হয়েছে গ্রামীণফোনের প্রেজেন্টেশন আর শেয়ারপ্রতি আয় থেকে (১৩৫.০৩ কোটি শেয়ার)। চার প্রান্তিকের যোগফল অডিট করা ২০২০ সালের মুনাফা ৩৭,১৮৭ মিলিয়ন টাকার সাথে হুবহু মেলে। সর্বশেষ বিশ্লেষণী ওয়ার্কবুকে ২০২০ এর গ্রাহক আর ARPU এর ঘরগুলো এলোমেলো, তাই সেগুলো ২০২১ এর ওয়ার্কবুক থেকে নেওয়া।'),
        ('EBITDA is before other items, as Grameenphone reports it. Capex excludes licence and spectrum fees and leased assets, the same basis as Robi. Every quarter is checked: mobile and non-mobile revenue add up to total revenue, EBITDA minus depreciation equals operating profit, and liabilities plus equity equal total assets. Each year’s quarters add up to the audited annual revenue and profit.',
         'EBITDA গ্রামীণফোনের হিসাব অনুযায়ী অন্যান্য খাতের আগে। ক্যাপেক্সে লাইসেন্স ও তরঙ্গ ফি আর লিজ সম্পদ বাদ, রবির মতোই। প্রতিটি প্রান্তিক যাচাই করা: মোবাইল আর নন-মোবাইল রেভিনিউ যোগ করলে মোট রেভিনিউ হয়, EBITDA থেকে অবচয় বাদ দিলে পরিচালন মুনাফা হয়, আর দায় ও ইকুইটি যোগ করলে মোট সম্পদ হয়। প্রতি বছরের প্রান্তিকগুলোর যোগফল অডিট করা বার্ষিক রেভিনিউ আর মুনাফার সাথে মেলে।')],
               flag=None),
    'banglalink': dict(src='bl-financials.csv', csv='banglalink-financials-2020-2026.csv', op=2, col='--bl', company='VEON Ltd., Banglalink’s parent', company_bn='বাংলালিংকের মালিক প্রতিষ্ঠান VEON',
               pub=('6 Nov 2026', '৬ নভে ২০২৬'), publisher='VEON', publisher_bn='VEON', site='https://www.veon.com/investors/reports-results', listed=False,
               tile8=('coverage_4g_pct', '4G network coverage', '4G নেটওয়ার্ক কভারেজ', 1, '%', '%'),
               notes=[
        ('Banglalink is not listed in Bangladesh. These figures come from the Bangladesh pages of the quarterly factbooks published by its parent VEON, in Bangladeshi taka. VEON reports revenue, EBITDA, operating profit and capex for each country, but not profit after tax, a balance sheet or data users, so those are missing here.',
         'বাংলালিংক বাংলাদেশে তালিকাভুক্ত নয়। এই সংখ্যাগুলো এর মালিক প্রতিষ্ঠান VEON এর ত্রৈমাসিক ফ্যাক্টবুকের বাংলাদেশ অংশ থেকে, টাকায়। VEON প্রতিটি দেশের রেভিনিউ, EBITDA, পরিচালন মুনাফা আর ক্যাপেক্স প্রকাশ করে, কিন্তু কর-পরবর্তী মুনাফা, ব্যালেন্স শিট বা ডেটা ব্যবহারকারীর সংখ্যা দেয় না, তাই এগুলো এখানে নেই।'),
        ('Q2 2025: EBITDA of Tk 10,739 million (a 75.6% margin) includes a one-off release of a USD 45 million provision, as VEON notes. Without it the margin would have been close to the usual 40% range.',
         '২০২৫ এর দ্বিতীয় প্রান্তিক: EBITDA ১০,৭৩৯ মিলিয়ন টাকা (মার্জিন ৭৫.৬%), কারণ VEON এর নোট অনুযায়ী এতে ৪৫ মিলিয়ন ডলারের একটি প্রভিশন একবারের জন্য ফেরত যুক্ত হয়েছে। এটা বাদ দিলে মার্জিন স্বাভাবিক ৪০% এর কাছাকাছি থাকত।'),
        ('Data revenue is shown up to the end of 2024. From 2025 VEON reports Banglalink’s revenue as telecom and digital instead, so the data series stops. Digital revenue (MyBL, Toffee, Ryze and other services) is published from 2023.',
         'ডেটা রেভিনিউ দেখানো হয়েছে ২০২৪ এর শেষ পর্যন্ত। ২০২৫ থেকে VEON বাংলালিংকের রেভিনিউ টেলিকম আর ডিজিটাল এই দুই ভাগে দেখায়, তাই ডেটা রেভিনিউর সিরিজ থেমে গেছে। ডিজিটাল রেভিনিউ (MyBL, Toffee, Ryze আর অন্যান্য সেবা) ২০২৩ থেকে প্রকাশিত।'),
        ('4G users from 2023 are VEON’s published 4G customers. For 2020 to 2022 they are worked out from VEON’s 4G penetration rate multiplied by customers. ARPU was recalculated by VEON from 2023, which lowered it by about 3%, so the line has a small break there. Minutes per subscriber are published only up to Q3 2024.',
         '২০২৩ থেকে 4G ব্যবহারকারী VEON এর প্রকাশিত 4G গ্রাহক। ২০২০ থেকে ২০২২ এর সংখ্যা VEON এর 4G পেনেট্রেশনের হার আর গ্রাহক সংখ্যা গুণ করে বের করা। ২০২৩ থেকে VEON নতুনভাবে ARPU হিসাব করেছে, এতে ARPU প্রায় ৩% কমেছে, তাই রেখায় সেখানে ছোট একটা ছেদ আছে। গ্রাহকপ্রতি মিনিট শুধু ২০২৪ এর তৃতীয় প্রান্তিক পর্যন্ত প্রকাশিত।'),
        ('Each year’s quarters add up to VEON’s full-year figures: Tk 61,490 million revenue in 2023, Tk 59,780 million in 2024 and Tk 55,922 million in 2025, matching VEON’s 2025 annual report. Factbooks from Q3 2024 to Q3 2026 were compared and show no restatements for the overlapping quarters.',
         'প্রতি বছরের প্রান্তিকগুলোর যোগফল VEON এর বার্ষিক হিসাবের সাথে মেলে: রেভিনিউ ২০২৩ এ ৬১,৪৯০ মিলিয়ন, ২০২৪ এ ৫৯,৭৮০ মিলিয়ন আর ২০২৫ এ ৫৫,৯২২ মিলিয়ন টাকা, VEON এর ২০২৫ সালের বার্ষিক প্রতিবেদনের সাথে মিলেছে। ২০২৪ এর তৃতীয় প্রান্তিক থেকে ২০২৬ এর তৃতীয় প্রান্তিক পর্যন্ত ফ্যাক্টবুকগুলো মিলিয়ে দেখা হয়েছে, কোনো পুরনো সংখ্যা বদলানো হয়নি।')],
               flag=('2Q25', ('ebitda_cr', 'ebitda_margin_pct'), 'Includes a USD 45 million provision release')),
}


def build_one(B, slug, R):
    T, bn, ic, page, sgn = B.T, B.bn, B.ic, B.page, B.sgn
    write = lambda p, h: B.write(p, bnfix(h))
    C_ = OPS_FIN[slug]; O = B.OPS[C_['op']]; col = C_['col']
    L = R[-1]; Y = [r for r in R if r['key'] == L['key'] - 10][0]
    ytd = [r for r in R if r['y'] == L['y']]; ytd0 = [r for r in R if r['y'] == L['y'] - 1 and int(r['q']) <= int(L['q'])]
    s = lambda rs, k: sum(r[k] for r in rs)
    pc = lambda a, b: (a - b) / abs(b) * 100
    F = R[0]

    raw = list(csv.DictReader(open(os.path.join(B.HERE, 'data_src', C_['src']))))
    with open(os.path.join(B.OUT, C_['csv']), 'w', newline='') as f:
        w = csv.writer(f); hdr = list(raw[0].keys())
        w.writerow(['operator'] + [h + ('_bdt_m' if h in MILLION_COLS else '') for h in hdr])
        for r in raw: w.writerow([O['en']] + [r[h] for h in hdr])

    def yoy(k):
        v = pc(L[k], Y[k]); c = 'up' if v > 0 else 'down'
        return ('<b class="%s">%s%%</b> vs %s' % (c, sgn(v, 1), ql(Y, 'en', True)), '%s এর তুলনায় <b class="%s">%s%%</b>' % (ql(Y, 'bn', True), c, sgn(v, 1, 'bn')))

    def pp(k):
        v = L[k] - Y[k]; c = 'up' if v > 0 else 'down'
        return ('<b class="%s">%s pts</b> vs %s' % (c, sgn(v, 1), ql(Y, 'en', True)), '%s এর তুলনায় <b class="%s">%s পয়েন্ট</b>' % (ql(Y, 'bn', True), c, sgn(v, 1, 'bn')))

    def tile(en, bnn, v_en, v_bn, ch):
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(v_en, v_bn), T(*ch), T(ql(L) + ' · ' + O['en'], ql(L, 'bn') + ' · ' + O['bn']))
    k8, e8, b8, d8, ue8, ub8 = C_['tile8']
    tiles = (tile('Revenue', 'রেভিনিউ', fmt(L['rev_cr']) + '<small> Tk cr</small>', fmt(L['rev_cr'], 0, 'bn') + '<small> কোটি টাকা</small>', yoy('rev_cr'))
             + tile('EBITDA margin', 'EBITDA মার্জিন', fmt(L['ebitda_margin_pct'], 1) + '<small>%</small>', fmt(L['ebitda_margin_pct'], 1, 'bn') + '<small>%</small>', pp('ebitda_margin_pct'))
             + (tile('Profit after tax', 'কর-পরবর্তী মুনাফা', fmt(L['pat_cr']) + '<small> Tk cr</small>', fmt(L['pat_cr'], 0, 'bn') + '<small> কোটি টাকা</small>', yoy('pat_cr')) if L['pat_cr'] is not None else
                tile('EBITDA', 'EBITDA', fmt(L['ebitda_cr']) + '<small> Tk cr</small>', fmt(L['ebitda_cr'], 0, 'bn') + '<small> কোটি টাকা</small>', yoy('ebitda_cr')))
             + tile('ARPU (monthly)', 'ARPU (মাসিক)', fmt(L['arpu_bdt']) + '<small> Tk</small>', fmt(L['arpu_bdt'], 0, 'bn') + '<small> টাকা</small>', yoy('arpu_bdt'))
             + tile('Subscribers', 'গ্রাহক', fmt(L['subs_m'], 1) + '<small>m</small>', fmt(L['subs_m'], 1, 'bn') + '<small>মি.</small>', yoy('subs_m'))
             + (tile('Data users', 'ডেটা ব্যবহারকারী', fmt(L['data_subs_m'], 1) + '<small>m</small>', fmt(L['data_subs_m'], 1, 'bn') + '<small>মি.</small>', yoy('data_subs_m')) if L['data_subs_m'] is not None else
                tile('4G users', '4G ব্যবহারকারী', fmt(L['users_4g_m'], 1) + '<small>m</small>', fmt(L['users_4g_m'], 1, 'bn') + '<small>মি.</small>', yoy('users_4g_m')))
             + tile('Data use per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার', fmt(L['gb_per_sub_month'], 1) + '<small> GB/mo</small>', fmt(L['gb_per_sub_month'], 1, 'bn') + '<small> GB/মাস</small>', yoy('gb_per_sub_month'))
             + tile(e8, b8, fmt(L[k8], d8) + ('<small>%s</small>' % ue8 if ue8 else ''), fmt(L[k8], d8, 'bn') + ('<small>%s</small>' % ub8 if ub8 else ''), yoy(k8)))

    pk = 'pat_cr' if L['pat_cr'] is not None else 'ebitda_cr'
    pn_en, pn_bn = ('profit after tax', 'কর-পরবর্তী মুনাফা') if pk == 'pat_cr' else ('EBITDA', 'EBITDA')
    r9, r90 = s(ytd, 'rev_cr'), s(ytd0, 'rev_cr'); p9, p90 = s(ytd, pk), s(ytd0, pk)
    best = max(R, key=lambda r: r['rev_cr'])
    dv = pc(L['rev_cr'], Y['rev_cr'])
    du_k = 'data_subs_m' if L['data_subs_m'] is not None else 'users_4g_m'
    tail_en = ('Data now brings in %s%% of revenue, and the average subscriber uses %s GB a month.' % (fmt(L['data_share'], 1), fmt(L['gb_per_sub_month'], 1))) if L['data_share'] else \
              ('%s million of its %s million subscribers use %s, and the average subscriber uses %s GB a month.' % (fmt(L[du_k], 1), fmt(L['subs_m'], 1), 'data' if du_k == 'data_subs_m' else '4G', fmt(L['gb_per_sub_month'], 1)))
    tail_bn = ('রেভিনিউর %s%% এখন আসে ডেটা থেকে, আর একজন গ্রাহক গড়ে মাসে %s GB ডেটা ব্যবহার করেন।' % (fmt(L['data_share'], 1, 'bn'), fmt(L['gb_per_sub_month'], 1, 'bn'))) if L['data_share'] else \
              ('%s মিলিয়ন গ্রাহকের মধ্যে %s মিলিয়ন %s ব্যবহার করেন, আর একজন গ্রাহক গড়ে মাসে %s GB ডেটা ব্যবহার করেন।' % (fmt(L['subs_m'], 1, 'bn'), fmt(L[du_k], 1, 'bn'), 'ডেটা' if du_k == 'data_subs_m' else '4G', fmt(L['gb_per_sub_month'], 1, 'bn')))
    story = T(('In %s %s earned Tk %s crore in revenue, %s%% %s than a year earlier, with Tk %s crore of %s. '
               'For the first %d quarters of %d revenue reached Tk %s crore (%s%%) and %s Tk %s crore (%s%%). '
               'In %s quarterly revenue was Tk %s crore, and the best quarter on record is %s at Tk %s crore. ') % (
        ql(L), O['en'], fmt(L['rev_cr']), fmt(abs(dv), 1), 'more' if dv > 0 else 'less', fmt(L[pk]), pn_en, len(ytd), L['y'], fmt(r9), sgn(pc(r9, r90), 1), pn_en, fmt(p9), sgn(pc(p9, p90), 1),
        ql(F), fmt(F['rev_cr']), ql(best), fmt(best['rev_cr'])) + tail_en,
        ('%s এ %s এর রেভিনিউ %s কোটি টাকা, আগের বছরের একই প্রান্তিকের চেয়ে %s%% %s, আর %s %s কোটি টাকা। '
         '%s সালের প্রথম %sটি প্রান্তিকে রেভিনিউ %s কোটি টাকা (%s%%) আর %s %s কোটি টাকা (%s%%)। '
         '%s এ প্রান্তিক রেভিনিউ ছিল %s কোটি টাকা। এখন পর্যন্ত সবচেয়ে বেশি রেভিনিউ %s এ, %s কোটি টাকা। ') % (
        ql(L, 'bn'), O['bn'], fmt(L['rev_cr'], 0, 'bn'), fmt(abs(dv), 1, 'bn'), 'বেশি' if dv > 0 else 'কম', pn_bn, fmt(L[pk], 0, 'bn'), bn(L['y']), bn(len(ytd)), fmt(r9, 0, 'bn'), sgn(pc(r9, r90), 1, 'bn'), pn_bn, fmt(p9, 0, 'bn'), sgn(pc(p9, p90), 1, 'bn'),
        ql(F, 'bn'), fmt(F['rev_cr'], 0, 'bn'), ql(best, 'bn'), fmt(best['rev_cr'], 0, 'bn')) + tail_bn, 'p')

    def C(series, ue, ub, d=0, kind='bar', h=260, floor0=True):
        a, b, st = nice([r[k] for r in R for k, *_ in series if r[k] is not None], floor0=floor0)
        return qchart(B, R, series, a, b, st, ue, ub, d=d, kind=kind, h=h)
    has_dr = any(r['data_cr'] for r in R); has_4g = any(r['users_4g_m'] for r in R); has_sites = any(r['sites_k'] for r in R)
    lastdr = [r for r in R if r['data_cr']][-1] if has_dr else None
    charts = [
        (('Quarterly revenue', 'প্রান্তিক রেভিনিউ'), ('Tk crore. The latest quarter is shaded darker.', 'কোটি টাকা। সর্বশেষ প্রান্তিক গাঢ় রঙে।'), C([('rev_cr', 'Revenue', 'রেভিনিউ', col)], ' cr', ' কোটি')),
        (('EBITDA margin', 'EBITDA মার্জিন'), ('EBITDA as a share of revenue, %', 'রেভিনিউর তুলনায় EBITDA, %'), C([('ebitda_margin_pct', 'EBITDA margin', 'EBITDA মার্জিন', col)], '%', '%', d=1, kind='line', floor0=False)),
    ]
    if any(r['pat_cr'] is not None for r in R):
        charts.append((('Profit after tax', 'কর-পরবর্তী মুনাফা'), ('Tk crore. Red bars are losses.', 'কোটি টাকা। লাল বার মানে লোকসান।'), C([('pat_cr', 'Profit after tax', 'কর-পরবর্তী মুনাফা', '--accent')], ' cr', ' কোটি')))
    else:
        charts.append((('EBITDA', 'EBITDA'), ('Tk crore. %s does not publish profit after tax for this operator.' % C_['company'].split(',')[0], 'কোটি টাকা। এই অপারেটরের কর-পরবর্তী মুনাফা প্রকাশ করা হয় না।'), C([('ebitda_cr', 'EBITDA', 'EBITDA', '--accent')], ' cr', ' কোটি')))
    if has_dr:
        charts.append((('Data revenue', 'ডেটা রেভিনিউ'), ('Tk crore, %s to %s, as published by %s.' % (ql([r for r in R if r['data_cr']][0]), ql(lastdr), C_.get('publisher', O['en'])), 'কোটি টাকা, %s থেকে %s, %s এর প্রকাশিত হিসাব।' % (ql([r for r in R if r['data_cr']][0], 'bn'), ql(lastdr, 'bn'), C_.get('publisher_bn', O['bn']))),
                       C([('data_cr', 'Data revenue', 'ডেটা রেভিনিউ', '--total')], ' cr', ' কোটি')))
    charts += [
        (('Data use per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার'), ('GB per subscriber per month', 'প্রতি মাসে গ্রাহকপ্রতি GB'), C([('gb_per_sub_month', 'GB per month', 'মাসে GB', '--total')], ' GB', ' GB', d=1)),
        (('Subscribers', 'গ্রাহক'), ('Millions: all subscribers%s%s' % (', data users' if any(r['data_subs_m'] for r in R) else '', ' and 4G users' if has_4g else ''), 'মিলিয়ন: মোট গ্রাহক%s%s' % (', ডেটা ব্যবহারকারী' if any(r['data_subs_m'] for r in R) else '', ' আর 4G ব্যবহারকারী' if has_4g else '')),
         C([('subs_m', 'All', 'মোট', col)] + ([('data_subs_m', 'Data', 'ডেটা', '--total')] if any(r['data_subs_m'] for r in R) else []) + ([('users_4g_m', '4G data', '4G ডেটা', '--tt')] if has_4g else []), 'm', ' মি.', d=1, kind='line', h=280)),
        (('ARPU', 'ARPU'), ('Average monthly revenue per user, Tk', 'গ্রাহকপ্রতি গড় মাসিক আয়, টাকা'), C([('arpu_bdt', 'ARPU', 'ARPU', col)], ' Tk', ' টাকা', kind='line', floor0=False)),
        (('Capital spending', 'মূলধনী বিনিয়োগ (ক্যাপেক্স)'), ('Tk crore, excluding spectrum, licence fees and leased assets', 'কোটি টাকা, তরঙ্গ, লাইসেন্স ফি আর লিজ সম্পদ বাদে'), C([('capex_cr', 'Capex', 'ক্যাপেক্স', '--amber')], ' cr', ' কোটি')),
    ]
    if has_sites:
        charts.append((('Network sites', 'নেটওয়ার্ক সাইট'), ('Thousands of on-air sites, all and 4G', 'চালু সাইট, হাজারে: মোট আর 4G'),
                       C([('sites_k', 'All sites', 'মোট সাইট', col), ('sites4_k', '4G sites', '4G সাইট', '--tt')], 'k', ' হা.', d=1, kind='line', floor0=False)))
    chtml = ''.join('<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>' % (T(*a), T(*b), c) for a, b, c in charts)

    years = sorted(set(r['y'] for r in R)); arows = ''
    cell = lambda v, d=0: '<td>%s</td>' % (T(fmt(v, d), fmt(v, d, 'bn')) if v is not None else '<span class="gap">–</span>')
    for yv in reversed(years):
        rs = [r for r in R if r['y'] == yv]
        if len(rs) < 4 and yv != L['y']: continue
        lab = T(str(yv), bn(yv)) if len(rs) == 4 else T('%d (Q1 to Q%s)' % (yv, L['q']), '%s (Q১ থেকে Q%s)' % (bn(yv), QBN[L['q']]))
        rev, eb, cap = s(rs, 'rev_cr'), s(rs, 'ebitda_cr'), s(rs, 'capex_cr')
        pat = s(rs, 'pat_cr') if all(r['pat_cr'] is not None for r in rs) else None
        dr = s(rs, 'data_cr') if all(r['data_cr'] is not None for r in rs) else None
        arows += '<tr><td>%s</td>%s%s%s%s%s%s</tr>' % (lab, cell(rev), cell(eb), cell(eb / rev * 100, 1), cell(pat), cell(cap), cell(dr))
    ath = ''.join('<th>%s</th>' % T(a, b) for a, b in [('Year', 'বছর'), ('Revenue', 'রেভিনিউ'), ('EBITDA', 'EBITDA'), ('Margin %', 'মার্জিন %'), ('Profit after tax', 'কর-পরবর্তী মুনাফা'), ('Capex', 'ক্যাপেক্স'), ('Data revenue', 'ডেটা রেভিনিউ')])

    QC = [('rev_cr', 'Revenue (cr)', 'রেভিনিউ (কোটি)', 0), ('ebitda_cr', 'EBITDA (cr)', 'EBITDA (কোটি)', 0), ('ebitda_margin_pct', 'Margin %', 'মার্জিন %', 1), ('pat_cr', 'PAT (cr)', 'মুনাফা (কোটি)', 0),
          ('capex_cr', 'Capex (cr)', 'ক্যাপেক্স (কোটি)', 0), ('data_cr', 'Data rev (cr)', 'ডেটা রেভিনিউ (কোটি)', 0), ('subs_m', 'Subs (m)', 'গ্রাহক (মি.)', 1), ('data_subs_m', 'Data users (m)', 'ডেটা ব্যবহারকারী (মি.)', 1),
          ('users_4g_m', '4G users (m)', '4G ব্যবহারকারী (মি.)', 1), ('arpu_bdt', 'ARPU (Tk)', 'ARPU (টাকা)', 0), ('gb_per_sub_month', 'GB/sub/mo', 'GB/গ্রাহক/মাস', 1), ('mou_min', 'Minutes/sub', 'মিনিট/গ্রাহক', 0)]
    if has_sites: QC += [('sites', 'Sites', 'সাইট', 0), ('sites_4g', '4G sites', '4G সাইট', 0)]
    if not has_dr: QC = [x for x in QC if x[0] != 'data_cr']
    if any(r['digital_cr'] is not None for r in R): QC.insert(6, ('digital_cr', 'Digital rev (cr)', 'ডিজিটাল রেভিনিউ (কোটি)', 0))
    QC = [x for x in QC if any(r[x[0]] is not None for r in R)]
    qth = '<th>%s</th>' % T('Quarter', 'প্রান্তিক') + ''.join('<th>%s</th>' % T(a, b) for _, a, b, _ in QC)
    fl = C_['flag']
    def qcell(r, k, d):
        v = r[k]
        if v is None: return '<td><span class="gap">–</span></td>'
        f_ = fl and r['quarter'] == fl[0] and k in fl[1]
        return '<td%s>%s</td>' % (' class="flag" title="%s"' % fl[2] if f_ else '', T(fmt(v, d), fmt(v, d, 'bn')))
    qrows = ''.join('<tr><td>%s</td>%s</tr>' % (T(ql(r), ql(r, 'bn')), ''.join(qcell(r, k, d) for k, _, _, d in QC)) for r in reversed(R))
    nhtml = ''.join('<li>%s</li>' % T(a, b) for a, b in C_['notes'])
    other = [x for x in OPS_FIN if x != slug]
    rel = ''.join('<a class="linkcard" href="/bd-telecom/kpi/finance/%s/"><span class="ti">%s%s</span><p>%s</p></a>' % (x, B.badge(B.OPS[OPS_FIN[x]['op']]), T(B.OPS[OPS_FIN[x]['op']]['en'] + ' finances', B.OPS[OPS_FIN[x]['op']]['bn'] + ' এর আর্থিক অবস্থা'), T('Every quarter since 2020', '২০২০ থেকে প্রতি প্রান্তিক')) for x in other)

    body = '''<header class="pagehead"><h1 style="display:flex;align-items:center;gap:14px">%s%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
%s
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary adm" href="/bd-telecom/%s" download>%s%s</a><a class="btn" href="/bd-telecom/kpi/finance/">%s%s</a><a class="btn" href="%s" rel="noopener">%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
%s
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="card"><div class="tablewrap"><table class="wide"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="callout warn"><span>%s</span><ul style="margin:0;padding-left:18px">%s</ul></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards">%s<a class="linkcard" href="/bd-telecom/operators/%s/"><span class="ti">%s%s</span><p>%s</p></a><a class="linkcard" href="/bd-telecom/kpi/"><span class="ti">%s</span><p>%s</p></a><a class="linkcard" href="/bd-telecom/glossary/#ebitda"><span class="ti">%s</span><p>%s</p></a></div></section>''' % (
        B.badge(O, 'badge big'), T('%s finances, %d to %d' % (O['en'], F['y'], L['y']), '%s এর আর্থিক অবস্থা, %s থেকে %s' % (O['bn'], bn(F['y']), bn(L['y']))),
        T('Revenue, %s, ARPU, data use and subscribers for every quarter from %s to %s, from %s.' % ('profit' if C_.get('listed', True) else 'EBITDA', ql(F), ql(L), (C_['company'] + '’s published results') if C_.get('listed', True) else 'the quarterly factbooks of its parent VEON'),
          '%s থেকে %s পর্যন্ত প্রতি প্রান্তিকে %s এর রেভিনিউ, %s, ARPU, ডেটা ব্যবহার আর গ্রাহক, %s থেকে।' % (ql(F, 'bn'), ql(L, 'bn'), O['bn'], 'মুনাফা' if C_.get('listed', True) else 'EBITDA', (C_['company_bn'] + ' এর প্রকাশিত ফলাফল') if C_.get('listed', True) else 'মালিক প্রতিষ্ঠান VEON এর ত্রৈমাসিক ফ্যাক্টবুক')),
        T('Latest: %s results, published %s' % (ql(L), C_['pub'][0]), 'সর্বশেষ: %s এর ফলাফল, প্রকাশ %s' % (ql(L, 'bn'), C_['pub'][1])),
        story, tiles,
        C_['csv'], ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('chart'), T('Compare operators', 'অপারেটরদের তুলনা'), C_['site'], ic('book'), T('Investor page', 'বিনিয়োগকারী পেজ'),
        ic('info'), T('All money figures are in Tk crore (1 crore = 10 million). Changes compare with the same quarter a year earlier. %s' % ('%s is listed on the Dhaka and Chittagong stock exchanges and publishes these figures every quarter.' % O['en'] if C_.get('listed', True) else 'Banglalink is owned by VEON, which publishes these figures every quarter in its results and factbooks.'),
                      'সব টাকার অঙ্ক কোটি টাকায় (১ কোটি = ১০ মিলিয়ন)। পরিবর্তন আগের বছরের একই প্রান্তিকের তুলনায়। %s' % ('%s ঢাকা ও চট্টগ্রাম স্টক এক্সচেঞ্জে তালিকাভুক্ত, আর প্রতি প্রান্তিকে এই সংখ্যাগুলো প্রকাশ করে।' % O['bn'] if C_.get('listed', True) else 'বাংলালিংকের মালিক VEON প্রতি প্রান্তিকে তাদের ফলাফল আর ফ্যাক্টবুকে এই সংখ্যাগুলো প্রকাশ করে।')),
        chtml,
        T('Year by year', 'বছরভিত্তিক'), T('Tk crore, sum of the quarters', 'কোটি টাকা, প্রান্তিকগুলোর যোগফল'), ath, arows,
        T('Quarter by quarter', 'প্রান্তিকভিত্তিক'), T('Money in Tk crore.%s' % (' Shaded cells have a note below.' if fl else ''), 'টাকার অঙ্ক কোটিতে।%s' % (' রঙিন ঘরের ব্যাখ্যা নিচে।' if fl else '')), qth, qrows,
        T('Notes on the data', 'ডেটা নিয়ে কিছু কথা'), ic('alert'), nhtml,
        T('Related', 'সম্পর্কিত'), rel, O['slug'], B.badge(O), T('%s subscribers and market share' % O['en'], '%s এর গ্রাহক ও মার্কেট শেয়ার' % O['bn']), T('Monthly BTRC figures', 'BTRC এর মাসিক সংখ্যা'),
        T('All telecom KPIs', 'সব টেলিকম KPI'), T('Subscribers, quality, finance and infrastructure', 'গ্রাহক, মান, আর্থিক আর অবকাঠামো'),
        T('What do these terms mean?', 'শব্দগুলোর মানে কী?'), T('EBITDA, ARPU, capex and more in the glossary', 'EBITDA, ARPU, ক্যাপেক্স আর আরও শব্দ শব্দকোষে'))
    write('kpi/finance/%s/index.html' % slug, page('kpi/finance/%s/' % slug, 'kpi', '%s revenue, profit and ARPU by quarter, %d to %d | BD Telecom' % (O['en'], F['y'], L['y']), '%s এর রেভিনিউ, মুনাফা ও ARPU, প্রান্তিকভিত্তিক %s-%s | BD Telecom' % (O['bn'], bn(F['y']), bn(L['y'])),
          '%s quarterly results from %s to %s: revenue Tk %s crore in %s (%s%% a year), EBITDA margin %.1f%%, ARPU Tk %d. Charts, tables and CSV.' % (O['en'], ql(F), ql(L), fmt(L['rev_cr']), ql(L), sgn(dv, 1), L['ebitda_margin_pct'], L['arpu_bdt']), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI'), ('/bd-telecom/kpi/finance/', 'Finance', 'আর্থিক')], foot=FOOT))
    return L, Y


def build_compare(B, D):
    """Side-by-side page for every operator with financial data."""
    T, bn, ic, page, sgn = B.T, B.bn, B.ic, B.page, B.sgn
    write = lambda p, h: B.write(p, bnfix(h))
    slugs = list(D)
    keys = sorted(set(r['key'] for s_ in slugs for r in D[s_]))
    common_last = min(D[s_][-1]['key'] for s_ in slugs)
    keys = [k for k in keys if k <= common_last]
    idx = {s_: {r['key']: r for r in D[s_]} for s_ in slugs}
    M = []
    for k in keys:
        row = dict(key=k, y=k // 10, q=str(k % 10), quarter='%dQ%02d' % (k % 10, (k // 10) % 100))
        for s_ in slugs:
            r = idx[s_].get(k)
            for f in ('rev_cr', 'ebitda_margin_pct', 'pat_cr', 'arpu_bdt', 'subs_m', 'data_subs_m', 'users_4g_m', 'u4_share', 'gb_per_sub_month', 'capex_cr', 'du_share'):
                row[s_ + '_' + f] = r[f] if r else None
        M.append(row)
    ops = {s_: B.OPS[OPS_FIN[s_]['op']] for s_ in slugs}
    pc = lambda a, b: (a - b) / abs(b) * 100

    def C(f, ue, ub, d=0, floor0=True, h=280, n=4):
        ser = [(s_ + '_' + f, ops[s_]['en'], ops[s_]['bn'], OPS_FIN[s_]['col']) for s_ in slugs]
        a, b, st = nice([r[k] for r in M for k, *_ in ser if r[k] is not None], n=n, floor0=floor0)
        return qchart(B, M, ser, a, b, st, ue, ub, d=d, kind='line', h=h)
    charts = [
        (('Quarterly revenue', 'প্রান্তিক রেভিনিউ'), ('Tk crore', 'কোটি টাকা'), C('rev_cr', ' cr', ' কোটি')),
        (('EBITDA margin', 'EBITDA মার্জিন'), ('EBITDA as a share of revenue, %', 'রেভিনিউর তুলনায় EBITDA, %'), C('ebitda_margin_pct', '%', '%', 1, False)),
        (('Profit after tax', 'কর-পরবর্তী মুনাফা'), ('Tk crore. Not published for Banglalink.', 'কোটি টাকা। বাংলালিংকের জন্য প্রকাশিত নয়।'), C('pat_cr', ' cr', ' কোটি', n=7)),
        (('ARPU', 'ARPU'), ('Average monthly revenue per user, Tk. Each operator calculates it its own way.', 'গ্রাহকপ্রতি গড় মাসিক আয়, টাকা। প্রতিটি অপারেটর নিজের পদ্ধতিতে হিসাব করে।'), C('arpu_bdt', ' Tk', ' টাকা', 0, False)),
        (('Subscribers', 'গ্রাহক'), ('Millions, as each operator reports them', 'মিলিয়ন, প্রতিটি অপারেটরের নিজের হিসাবে'), C('subs_m', 'm', ' মি.', 1)),
        (('Data users as a share of subscribers', 'গ্রাহকের মধ্যে ডেটা ব্যবহারকারীর ভাগ'), ('%. Banglalink’s data users are not published.', '%। বাংলালিংকের ডেটা ব্যবহারকারীর সংখ্যা প্রকাশিত নয়।'), C('du_share', '%', '%', 1, False)),
        (('4G users as a share of subscribers', 'গ্রাহকের মধ্যে 4G ব্যবহারকারীর ভাগ'), ('%, for the quarters each operator published', '%, প্রতিটি অপারেটর যে প্রান্তিকগুলোর সংখ্যা প্রকাশ করেছে'), C('u4_share', '%', '%', 1, False)),
        (('Data use per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার'), ('GB per subscriber per month', 'প্রতি মাসে গ্রাহকপ্রতি GB'), C('gb_per_sub_month', ' GB', ' GB', 1)),
        (('Capital spending', 'মূলধনী বিনিয়োগ (ক্যাপেক্স)'), ('Tk crore, excluding spectrum, licence fees and leased assets', 'কোটি টাকা, তরঙ্গ, লাইসেন্স ফি আর লিজ সম্পদ বাদে'), C('capex_cr', ' cr', ' কোটি')),
    ]
    chtml = ''.join('<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>' % (T(*a), T(*b), c) for a, b, c in charts)

    LQ = {s_: idx[s_][common_last] for s_ in slugs}; YQ = {s_: idx[s_][common_last - 10] for s_ in slugs}
    Lr = LQ[slugs[0]]
    rows_ = [('Revenue (Tk crore)', 'রেভিনিউ (কোটি টাকা)', 'rev_cr', 0, True), ('Revenue growth, a year', 'এক বছরে রেভিনিউ বৃদ্ধি', None, 1, False), ('EBITDA margin %', 'EBITDA মার্জিন %', 'ebitda_margin_pct', 1, False),
             ('Profit after tax (Tk crore)', 'কর-পরবর্তী মুনাফা (কোটি টাকা)', 'pat_cr', 0, True), ('Profit margin %', 'মুনাফার হার %', 'npm', 1, False), ('ARPU (Tk)', 'ARPU (টাকা)', 'arpu_bdt', 0, False),
             ('Subscribers (m)', 'গ্রাহক (মি.)', 'subs_m', 1, False), ('Data users (m)', 'ডেটা ব্যবহারকারী (মি.)', 'data_subs_m', 1, False), ('4G users (m)', '4G ব্যবহারকারী (মি.)', 'users_4g_m', 1, False), ('GB per subscriber a month', 'গ্রাহকপ্রতি মাসিক GB', 'gb_per_sub_month', 1, False),
             ('Capex (Tk crore)', 'ক্যাপেক্স (কোটি টাকা)', 'capex_cr', 0, True)]
    for s_ in slugs: LQ[s_]['npm'] = LQ[s_]['pat_cr'] / LQ[s_]['rev_cr'] * 100 if LQ[s_]['pat_cr'] is not None else None
    trs = ''
    for en, bnn, k, d, _ in rows_:
        tds = ''
        for s_ in slugs:
            if k is None:
                v = pc(LQ[s_]['rev_cr'], YQ[s_]['rev_cr']); tds += '<td><b style="color:var(--%s)">%s</b></td>' % ('up' if v > 0 else 'down', T(sgn(v, 1) + '%', sgn(v, 1, 'bn') + '%'))
            else:
                tds += '<td>%s</td>' % (T(fmt(LQ[s_][k], d), fmt(LQ[s_][k], d, 'bn')) if LQ[s_].get(k) is not None else '<span class="gap">–</span>')
        trs += '<tr><td style="text-align:left">%s</td>%s</tr>' % (T(en, bnn), tds)
    th = '<th style="text-align:left">%s</th>' % T(ql(Lr), ql(Lr, 'bn')) + ''.join('<th>%s%s</th>' % (B.badge(ops[s_]), T(ops[s_]['en'], ops[s_]['bn'])) for s_ in slugs)

    tot = sum(LQ[s_]['rev_cr'] for s_ in slugs)
    shares = ', '.join('%s %s%%' % (ops[s_]['en'], fmt(LQ[s_]['rev_cr'] / tot * 100, 1)) for s_ in slugs)
    shares_bn = ', '.join('%s %s%%' % (ops[s_]['bn'], fmt(LQ[s_]['rev_cr'] / tot * 100, 1, 'bn')) for s_ in slugs)
    g = {s_: pc(LQ[s_]['rev_cr'], YQ[s_]['rev_cr']) for s_ in slugs}; fast = max(slugs, key=lambda s_: g[s_])
    mg = max(slugs, key=lambda s_: LQ[s_]['ebitda_margin_pct'])
    story = T(('In %s the three private operators together earned Tk %s crore in revenue: %s. %s grew fastest over the year (%s%%), while %s kept the highest EBITDA margin (%s%%). '
               'Banglalink’s figures come from its parent VEON, which does not publish its profit after tax. State-owned Teletalk does not publish quarterly results.') % (ql(Lr), fmt(tot), shares, ops[fast]['en'], sgn(g[fast], 1), ops[mg]['en'], fmt(LQ[mg]['ebitda_margin_pct'], 1)),
              ('%s এ বেসরকারি তিন অপারেটরের মোট রেভিনিউ %s কোটি টাকা: %s। এক বছরে সবচেয়ে বেশি বেড়েছে %s এর রেভিনিউ (%s%%), আর EBITDA মার্জিন সবচেয়ে বেশি %s এর (%s%%)। '
               'বাংলালিংকের সংখ্যা এর মালিক VEON থেকে নেওয়া, যারা বাংলালিংকের কর-পরবর্তী মুনাফা প্রকাশ করে না। সরকারি টেলিটক প্রান্তিক ফলাফল প্রকাশ করে না।') % (ql(Lr, 'bn'), fmt(tot, 0, 'bn'), shares_bn, ops[fast]['bn'], sgn(g[fast], 1, 'bn'), ops[mg]['bn'], fmt(LQ[mg]['ebitda_margin_pct'], 1, 'bn')), 'p')
    cards = ''.join('<a class="linkcard" href="/bd-telecom/kpi/finance/%s/"><span class="ti">%s%s</span><p>%s</p></a>' % (s_, B.badge(ops[s_]), T(ops[s_]['en'] + ' finances', ops[s_]['bn'] + ' এর আর্থিক অবস্থা'),
                    T('Revenue Tk %s crore in %s · every quarter since %d' % (fmt(D[s_][-1]['rev_cr']), ql(D[s_][-1]), D[s_][0]['y']), '%s এ রেভিনিউ %s কোটি টাকা · %s থেকে প্রতি প্রান্তিক' % (ql(D[s_][-1], 'bn'), fmt(D[s_][-1]['rev_cr'], 0, 'bn'), bn(D[s_][0]['y'])))) for s_ in slugs)
    notes = [('Each operator defines subscribers, data users and ARPU in its own way, so the lines show direction and scale rather than an exact like-for-like match. Grameenphone counts a data user after 150 KB of use in three months.',
              'প্রতিটি অপারেটর গ্রাহক, ডেটা ব্যবহারকারী আর ARPU নিজের মতো করে হিসাব করে, তাই রেখাগুলো দিক আর আকার বোঝায়, হুবহু তুলনা নয়। গ্রামীণফোন তিন মাসে ১৫০ কেবি ব্যবহার হলে ডেটা ব্যবহারকারী ধরে।'),
             ('Data revenue is left out of this comparison: Grameenphone stopped publishing it after 2023 and counts bundle revenue separately, so the two series do not match.',
              'এই তুলনায় ডেটা রেভিনিউ রাখা হয়নি: গ্রামীণফোন ২০২৩ এর পর এটা প্রকাশ বন্ধ করেছে আর বান্ডেলের আয় আলাদা করে গোনে, তাই দুই সিরিজ মেলে না।'),
             ('Capex excludes spectrum and licence fees for all three operators. Grameenphone and Robi also leave out leased assets; VEON’s capex for Banglalink excludes licences and leases too.', 'তিন অপারেটরের ক্যাপেক্সেই তরঙ্গ আর লাইসেন্স ফি বাদ। গ্রামীণফোন আর রবি লিজ সম্পদও বাদ দেয়; VEON এর হিসাবে বাংলালিংকের ক্যাপেক্সেও লাইসেন্স আর লিজ বাদ।'),
             ('Banglalink’s Q2 2025 EBITDA includes a one-off USD 45 million provision release, which is why its margin line spikes that quarter.', 'বাংলালিংকের ২০২৫ এর দ্বিতীয় প্রান্তিকের EBITDA তে ৪৫ মিলিয়ন ডলারের একবারের প্রভিশন ফেরত যুক্ত, তাই সেই প্রান্তিকে মার্জিনের রেখা হঠাৎ উঁচু।')]
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
%s
<div class="cards">%s</div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
%s
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="callout warn"><span>%s</span><ul style="margin:0;padding-left:18px">%s</ul></div></section>''' % (
        T('Mobile operator finances in Bangladesh', 'বাংলাদেশের মোবাইল অপারেটরদের আর্থিক অবস্থা'),
        T('Grameenphone, Robi and Banglalink side by side: revenue, margins, profit, ARPU, data use and capex for every quarter since 2020, from each company’s published results.',
          'গ্রামীণফোন, রবি আর বাংলালিংক পাশাপাশি: ২০২০ থেকে প্রতি প্রান্তিকের রেভিনিউ, মার্জিন, মুনাফা, ARPU, ডেটা ব্যবহার আর ক্যাপেক্স, প্রতিটি কোম্পানির প্রকাশিত ফলাফল থেকে।'),
        T('Latest common quarter: %s' % ql(Lr), 'সর্বশেষ সাধারণ প্রান্তিক: %s' % ql(Lr, 'bn')), story, cards,
        T('%s at a glance' % ql(Lr), '%s এক নজরে' % ql(Lr, 'bn')), th, trs, chtml,
        T('Comparing fairly', 'ন্যায্য তুলনার জন্য'), ic('alert'), ''.join('<li>%s</li>' % T(a, b) for a, b in notes))
    write('kpi/finance/index.html', page('kpi/finance/', 'kpi', 'Grameenphone vs Robi vs Banglalink: revenue, profit and ARPU by quarter | BD Telecom', 'গ্রামীণফোন, রবি ও বাংলালিংক: রেভিনিউ, মুনাফা ও ARPU | BD Telecom',
          'Grameenphone, Robi and Banglalink quarterly results compared since 2020: revenue, EBITDA margin, profit, ARPU, subscribers, data use and capex. In %s revenue was Tk %s crore, Tk %s crore and Tk %s crore.' % (ql(Lr), fmt(LQ['grameenphone']['rev_cr']), fmt(LQ['robi']['rev_cr']), fmt(LQ['banglalink']['rev_cr'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')], foot=FOOT))
    return LQ, YQ


def build_finance(B):
    T, sgn = B.T, B.sgn
    D = {s_: load(B, OPS_FIN[s_]['src']) for s_ in ('grameenphone', 'robi', 'banglalink')}
    for s_ in D: build_one(B, s_, D[s_])
    LQ, YQ = build_compare(B, D)
    pc = lambda a, b: (a - b) / abs(b) * 100

    def duo(en, bnn, k, d, unit_en, unit_bn, pts=False):
        rows = ''
        for s_ in D:
            L, Y = D[s_][-1], [r for r in D[s_] if r['key'] == D[s_][-1]['key'] - 10][0]
            if L[k] is None: continue
            ch = (L[k] - Y[k]) if pts else pc(L[k], Y[k]); c = 'up' if ch > 0 else 'down'
            o = B.OPS[OPS_FIN[s_]['op']]
            rows += '<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><a href="/bd-telecom/kpi/finance/%s/" style="display:flex;align-items:center;gap:6px;color:inherit;text-decoration:none;min-width:0;flex:1">%s<b style="font-size:1.25rem">%s</b><small style="color:var(--muted)">%s</small></a><b style="font-size:.85rem;color:var(--%s)">%s</b></div>' % (
                s_, B.badge(o), T(fmt(L[k], d), fmt(L[k], d, 'bn')), T(unit_en, unit_bn), c, T(sgn(ch, 1) + (' pts' if pts else '%'), sgn(ch, 1, 'bn') + (' পয়েন্ট' if pts else '%')))
        L0 = D['grameenphone'][-1]
        return '<div class="tile kpi"><div class="l">%s</div>%s<div class="meta">%s</div></div>' % (T(en, bnn), rows, T(ql(L0) + ' · company results · change vs a year earlier', ql(L0, 'bn') + ' · কোম্পানির ফলাফল · এক বছরের পরিবর্তন'))
    cards = (duo('Revenue (quarter)', 'রেভিনিউ (প্রান্তিক)', 'rev_cr', 0, 'Tk cr', 'কোটি')
             + duo('EBITDA margin', 'EBITDA মার্জিন', 'ebitda_margin_pct', 1, '%', '%', True)
             + duo('ARPU (monthly)', 'ARPU (মাসিক)', 'arpu_bdt', 0, 'Tk', 'টাকা')
             + duo('Profit after tax (quarter)', 'কর-পরবর্তী মুনাফা (প্রান্তিক)', 'pat_cr', 0, 'Tk cr', 'কোটি')
             + duo('Capex (quarter)', 'ক্যাপেক্স (প্রান্তিক)', 'capex_cr', 0, 'Tk cr', 'কোটি')
             + '<a class="tile kpi more" href="/bd-telecom/kpi/finance/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (
                 T('Compare operators', 'অপারেটরদের তুলনা'), T('GP, Robi and Banglalink since 2020', '২০২০ থেকে জিপি, রবি আর বাংলালিংক'), T('Charts and tables', 'চার্ট আর সারণি')))
    L0 = D['grameenphone'][-1]
    note = T('Company results to %s. Banglalink’s come from its parent VEON, without profit after tax. Teletalk does not publish quarterly results.' % ql(L0), '%s পর্যন্ত কোম্পানির ফলাফল। বাংলালিংকের সংখ্যা মালিক প্রতিষ্ঠান VEON থেকে, কর-পরবর্তী মুনাফা ছাড়া। টেলিটক প্রান্তিক ফলাফল প্রকাশ করে না।' % ql(L0, 'bn'))
    cards, note = bnfix(cards), bnfix(note)
    return cards, note, ['bd-telecom/kpi/finance/', 'bd-telecom/kpi/finance/grameenphone/', 'bd-telecom/kpi/finance/robi/', 'bd-telecom/kpi/finance/banglalink/']
