"""BD Telecom home: the month's key numbers, every section of the site, and what changed recently."""
import json, os

UPDATES = [
    ('2026-11-09', 'methodology/', 'How this data is built: sources, checks and the errors they found', 'এই ডেটা যেভাবে তৈরি: সূত্র, যাচাই আর ধরা পড়া ভুল'),
    ('2026-11-09', 'recharge-tax/', 'Recharge tax calculator: how much of Tk 100 goes to the government', 'রিচার্জ কর ক্যালকুলেটর: ১০০ টাকার কত টাকা সরকারের কাছে যায়'),
    ('2026-11-08', 'kpi/qos/area/', 'Network quality where you live: check your upazila for Grameenphone, Robi and Banglalink', 'আপনার এলাকায় নেটওয়ার্কের মান: আপনার উপজেলায় গ্রামীণফোন, রবি আর বাংলালিংকের ফল'),
    ('2026-11-08', 'kpi/finance/', 'Operator finances: Grameenphone, Robi and Banglalink, every quarter since 2020, with a side-by-side comparison', 'অপারেটরদের আর্থিক অবস্থা: গ্রামীণফোন, রবি আর বাংলালিংক, ২০২০ থেকে প্রতি প্রান্তিক, পাশাপাশি তুলনা সহ'),
    ('2026-10-31', 'kpi/qos/', 'BTRC quality of service report for August 2026: national, district and upazila results', 'আগস্ট ২০২৬ এর BTRC সেবার মান (QoS) প্রতিবেদন: জাতীয়, জেলা আর উপজেলার ফল'),
    ('2026-10-31', 'kpi/spectrum/', 'Spectrum assigned to each operator, by band', 'অপারেটরভিত্তিক বরাদ্দকৃত তরঙ্গ, ব্যান্ড অনুযায়ী'),
    ('2026-10-31', 'kpi/handsets/', 'Smartphone and 5G handset share by network', 'নেটওয়ার্ক অনুযায়ী স্মার্টফোন আর 5G হ্যান্ডসেটের ভাগ'),
    ('2026-10-31', 'kpi/towers/', 'Mobile towers by owner since December 2022', 'ডিসেম্বর ২০২২ থেকে মালিকানা অনুযায়ী মোবাইল টাওয়ার'),
    ('2026-10-30', 'licensees/', 'Licensee directories: ISP (Divisional), VTS and ITC', 'লাইসেন্সধারীদের তালিকা: ISP (বিভাগীয়), VTS আর ITC'),
]


def build_hub(B, guides):
    T, bn, ic, tint, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.tint, B.page, B.write, B.mlab, B.num, B.sgn
    import finance, tele
    D = {s: finance.load(B, finance.OPS_FIN[s]['src']) for s in ('grameenphone', 'robi', 'banglalink')}
    M = sorted(json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-mobile-subscribers.json'))), key=lambda r: r['month'])
    I = sorted(json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-internet-subscribers.json'))), key=lambda r: r['month'])
    TL = tele.load(B)[-1]
    TW = sorted(json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-towers.json'))), key=lambda r: r['month'])[-1]
    HS = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-handsets.json')))['all'][-1]
    m, mp = M[-1], [r for r in M if r['month'] == '%d-%s' % (int(M[-1]['month'][:4]) - 1, M[-1]['month'][5:])][0]
    i_, ip = I[-1], [r for r in I if r['month'] == '%d-%s' % (int(I[-1]['month'][:4]) - 1, I[-1]['month'][5:])][0]
    fq = {s: (D[s][-1], [r for r in D[s] if r['key'] == D[s][-1]['key'] - 10][0]) for s in D}
    rev, rev0 = sum(fq[s][0]['rev_cr'] for s in D), sum(fq[s][1]['rev_cr'] for s in D)
    Lq = fq['robi'][0]
    pc = lambda a, b: (a - b) / b * 100

    def tile(href, en, bnn, v_en, v_bn, d_en, d_bn, meta_en, meta_bn):
        return ('<a class="tile kpi" href="/bd-telecom/%s" style="text-decoration:none;color:inherit"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></a>' % (
            href, T(en, bnn), T(v_en, v_bn), T(d_en, d_bn), T(meta_en, meta_bn)))
    chg = lambda v, unit_en, unit_bn, d=2: ('<b class="%s">%s%s</b>' % ('up' if v > 0 else 'down', sgn(v, d), unit_en), '<b class="%s">%s%s</b>' % ('up' if v > 0 else 'down', sgn(v, d, 'bn'), unit_bn))
    dm, dmb = chg(m['total'] - mp['total'], ' m', ' মি.')
    di, dib = chg(i_['total'] - ip['total'], ' m', ' মি.')
    dr, drb = chg(pc(rev, rev0), '%', '%', 1)
    tiles = (tile('kpi/mobile-subscribers/', 'Mobile subscriptions', 'মোবাইল সাবস্ক্রিপশন', num(m['total']) + '<small>m</small>', num(m['total'], 2, 'bn') + '<small>মি.</small>',
                  dm + ' in a year', 'এক বছরে ' + dmb, mlab(m['month']) + ' · BTRC', mlab(m['month'], 'bn') + ' · BTRC')
             + tile('kpi/internet-subscribers/', 'Internet subscriptions', 'ইন্টারনেট সাবস্ক্রিপশন', num(i_['total']) + '<small>m</small>', num(i_['total'], 2, 'bn') + '<small>মি.</small>',
                    di + ' in a year', 'এক বছরে ' + dib, mlab(i_['month']) + ' · BTRC', mlab(i_['month'], 'bn') + ' · BTRC')
             + tile('kpi/finance/', 'Operator revenue (quarter)', 'অপারেটরদের রেভিনিউ (প্রান্তিক)', finance.fmt(rev) + '<small> Tk cr</small>', finance.fmt(rev, 0, 'bn') + '<small> কোটি</small>',
                    dr + ' vs a year earlier', 'এক বছরে ' + drb, '%s · GP, Robi, Banglalink' % finance.ql(Lq), '%s · জিপি, রবি, বাংলালিংক' % finance.ql(Lq, 'bn'))
             + tile('kpi/teledensity/', 'Teledensity', 'টেলিডেনসিটি', num(TL['teledensity_pct']) + '<small>%</small>', num(TL['teledensity_pct'], 2, 'bn') + '<small>%</small>',
                    'internet penetration %s%%' % num(TL['internet_penetration_pct']), 'ইন্টারনেট পেনেট্রেশন %s%%' % num(TL['internet_penetration_pct'], 2, 'bn'), mlab(TL['month']) + ' · BTRC', mlab(TL['month'], 'bn') + ' · BTRC')
             + tile('kpi/handsets/', 'Smartphones', 'স্মার্টফোন', num(HS['smart_pct'], 1) + '<small>%</small>', num(HS['smart_pct'], 1, 'bn') + '<small>%</small>',
                    'of phones; 5G phones %s%%' % num(HS['g5_pct'], 1), 'ফোনের মধ্যে; 5G ফোন %s%%' % num(HS['g5_pct'], 1, 'bn'), mlab(HS['month']) + ' · BTRC', mlab(HS['month'], 'bn') + ' · BTRC')
             + tile('kpi/towers/', 'Mobile towers', 'মোবাইল টাওয়ার', '{:,}'.format(TW['total']), bn('{:,}'.format(TW['total'])),
                    'across operators and tower companies', 'অপারেটর আর টাওয়ার কোম্পানি মিলিয়ে', mlab(TW['month']) + ' · BTRC', mlab(TW['month'], 'bn') + ' · BTRC'))

    # market share bar
    key = {'grameenphone': 'gp', 'robi': 'robi', 'banglalink': 'bl', 'teletalk': 'tt'}
    share = ''.join('<span style="flex:%.2f;background:var(%s)" title="%s %.1f%%"></span>' % (m[key[o['k']]], o['c'], o['en'], m[key[o['k']]] / m['total'] * 100) for o in B.OPS)
    leg = ''.join('<a href="/bd-telecom/operators/%s/" class="shl">%s<b>%s</b><span>%s</span></a>' % (o['slug'], B.badge(o), T(o['en'], o['bn']),
                  T('%s%% · %s m' % (num(m[key[o['k']]] / m['total'] * 100, 1), num(m[key[o['k']]])), '%s%% · %s মি.' % (num(m[key[o['k']]] / m['total'] * 100, 1, 'bn'), num(m[key[o['k']]], 2, 'bn')))) for o in B.OPS)

    sections = [
        ('kpi/', 'chart', '--accent', 'KPI', 'KPI', 'Every key telecom number with its month, source and change: subscribers, quality, finance and infrastructure.', 'খাতের সব গুরুত্বপূর্ণ সংখ্যা, মাস, সূত্র আর পরিবর্তন সহ: গ্রাহক, সেবার মান, আর্থিক অবস্থা আর অবকাঠামো।'),
        ('kpi/finance/', 'chart', '--amber', 'Operator finances', 'অপারেটরদের আর্থিক অবস্থা', 'Revenue, margins, profit and ARPU for Grameenphone, Robi and Banglalink, every quarter since 2020.', '২০২০ থেকে প্রতি প্রান্তিকে গ্রামীণফোন, রবি আর বাংলালিংকের রেভিনিউ, মার্জিন, মুনাফা আর ARPU।'),
        ('kpi/qos/area/', 'signal', '--tt', 'Network quality where you live', 'আপনার এলাকায় নেটওয়ার্কের মান', 'Pick your upazila to see whether each operator met BTRC’s quality benchmarks there.', 'আপনার উপজেলা বেছে নিন, দেখুন প্রতিটি অপারেটর সেখানে BTRC এর মান পূরণ করেছে কিনা।'),
        ('operators/', 'users', '--gp', 'Operators', 'অপারেটর', 'Subscribers and market share for each of the four mobile operators.', 'চার মোবাইল অপারেটরের গ্রাহক আর মার্কেট শেয়ার।'),
        ('market-2024-2026/', 'signal', '--robi', 'The 2024 to 2026 subscriber slump', '২০২৪ থেকে ২০২৬ এর গ্রাহক পতন', 'How the market lost 6.6 million subscriptions in 17 months and then recovered: a data story.', 'কীভাবে বাজার ১৭ মাসে ৬৬ লাখ সাবস্ক্রিপশন হারিয়ে আবার ঘুরে দাঁড়াল: ডেটার গল্প।'),
        ('recharge-tax/', 'coin', '--robi', 'Tax on your recharge', 'রিচার্জে কত কর', 'Type any amount to see how much is service and how much goes to the government as VAT, duty and surcharge.', 'যেকোনো পরিমাণ লিখুন, দেখুন কত টাকা সেবা আর কত টাকা VAT, শুল্ক আর সারচার্জ হিসেবে সরকারের কাছে যায়।'),
        ('glossary/', 'book', '--amber', 'Telecom glossary', 'টেলিকম শব্দকোষ', 'ARPU, EBITDA, churn, QoS and more, in plain Bangla and English.', 'ARPU, EBITDA, চার্ন, QoS আর আরও অনেক শব্দ, সহজ বাংলা আর ইংরেজিতে।'),
        ('methodology/', 'shield', '--accent', 'How this data is built', 'এই ডেটা যেভাবে তৈরি', 'The sources, the four checks every quarter passes, and the errors they found in published reports.', 'সূত্র, প্রতিটি প্রান্তিকের চারটি যাচাই, আর প্রকাশিত প্রতিবেদনে সেগুলো যে ভুল ধরেছে।'),
        ('data/', 'db', '--tt', 'Data archive', 'ডেটা আর্কাইভ', 'Monthly subscriber data with SQL and CSV downloads.', 'মাসিক গ্রাহক ডেটা, SQL আর CSV ডাউনলোড সহ।'),
        ('licensees/', 'shield', '--bl', 'Licensees', 'লাইসেন্সধারী', 'Searchable lists of ISP, VTS and ITC licence holders from BTRC.', 'BTRC এর ISP, VTS আর ITC লাইসেন্সধারীদের খোঁজা যায় এমন তালিকা।'),
    ]
    scards = ''.join('<a class="linkcard" href="/bd-telecom/%s"><span class="ti"><span class="ic" style="%s">%s</span>%s</span><p>%s</p></a>' % (u, tint(c), ic(i), T(e, b), T(pe, pb)) for u, i, c, e, b, pe, pb in sections)
    gcards = ''.join('<a class="linkcard" href="/bd-telecom/guides/%s/"><span class="ti"><span class="ic" style="%s">%s</span>%s</span></a>' % (g['slug'], tint(g['color']), ic(g['icon']), T(B.esc(g['title_en']), B.esc(g['title_bn']))) for g in guides[:6])

    def dlab(d, lang='en'):
        y, mo, dd = d.split('-')
        return ('%d %s %s' % (int(dd), B.SH_EN[int(mo) - 1], y)) if lang == 'en' else ('%s %s %s' % (bn(int(dd)), B.SH_BN[int(mo) - 1], bn(y)))
    ups = ''.join('<li><span class="ud">%s</span><a href="/bd-telecom/%s">%s</a></li>' % (T(dlab(d), dlab(d, 'bn')), u, T(e, b)) for d, u, e, b in UPDATES)

    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="tiles kpis">%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><p class="sub" style="margin:0 0 10px">%s</p><div class="sharebar">%s</div><div class="shleg">%s</div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards">%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards">%s<a class="linkcard" href="/bd-telecom/guides/"><span class="ti">%s →</span><p>%s</p></a></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><ul class="updates">%s</ul></div></section>
<div class="callout"><span>%s</span><p>%s</p></div>''' % (
        T('Bangladesh telecom, in numbers', 'সংখ্যায় বাংলাদেশের টেলিকম'),
        T('Subscribers, market share, network quality, operator finances, licences and plain-language guides, from BTRC data and the operators’ own published results. Every figure is checked and dated.',
          'গ্রাহক, মার্কেট শেয়ার, নেটওয়ার্কের মান, অপারেটরদের আর্থিক অবস্থা, লাইসেন্স আর সহজ ভাষার গাইড, BTRC এর ডেটা আর অপারেটরদের প্রকাশিত ফলাফল থেকে। প্রতিটি সংখ্যা যাচাই করা, তারিখ সহ।'),
        T('Latest BTRC data %s · latest results %s' % (mlab(m['month']), finance.ql(Lq)), 'সর্বশেষ BTRC ডেটা %s · সর্বশেষ ফলাফল %s' % (mlab(m['month'], 'bn'), finance.ql(Lq, 'bn'))),
        T('Key numbers', 'মূল সংখ্যা'), tiles,
        T('Mobile market share', 'মোবাইল মার্কেট শেয়ার'), T('Share of %s million active mobile subscriptions, %s, BTRC' % (num(m['total']), mlab(m['month'])), '%s মিলিয়ন সক্রিয় মোবাইল সাবস্ক্রিপশনের ভাগ, %s, BTRC' % (num(m['total'], 2, 'bn'), mlab(m['month'], 'bn'))), share, leg,
        T('Explore', 'ঘুরে দেখুন'), scards,
        T('Guides', 'গাইড'), gcards, T('All %d guides' % len(guides), 'সব %sটি গাইড' % bn(len(guides))), T('Laws, policies, SIMs and handsets, in plain language', 'আইন, নীতিমালা, SIM আর হ্যান্ডসেট, সহজ ভাষায়'),
        T('What’s new', 'নতুন কী'), ups,
        ic('info'), T('Made by Mohd Imtiaz Karim, a telecom professional in Bangladesh. Data is free to use with credit.', 'তৈরি করেছেন মোহাম্মদ ইমতিয়াজ করিম, বাংলাদেশের একজন টেলিকম পেশাজীবী। ক্রেডিট দিয়ে ডেটা বিনামূল্যে ব্যবহার করা যাবে।'))
    write('index.html', page('', 'dash', 'Bangladesh telecom data: subscribers, market share, operator finances and guides | BD Telecom', 'বাংলাদেশ টেলিকম ডেটা: গ্রাহক, মার্কেট শেয়ার, অপারেটরদের আর্থিক অবস্থা ও গাইড | BD Telecom',
          'Bangladesh telecom in numbers: %s million mobile subscriptions in %s, market share by operator, Grameenphone, Robi and Banglalink results, QoS, towers, licences and guides.' % (num(m['total']), mlab(m['month'])), body,
          foot=('Data: BTRC, and the published results of Grameenphone, Robi Axiata and VEON. Analysis by Mohd Imtiaz Karim.', 'ডেটা: BTRC, আর গ্রামীণফোন, রবি আজিয়াটা ও VEON এর প্রকাশিত ফলাফল। বিশ্লেষণ: মোহাম্মদ ইমতিয়াজ করিম।')))
