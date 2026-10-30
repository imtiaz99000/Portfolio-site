"""KPI hub: one page with every tracked telecom KPI, its latest value, period, change, source and update date."""
import json, os
GROUPS = [('mkt','Subscribers and market','গ্রাহক ও বাজার','users','--accent'),('qos','Network quality (QoS)','নেটওয়ার্কের মান (QoS)','signal','--gp'),
          ('fin','Financial','আর্থিক','chart','--amber'),('inf','Infrastructure and technology','অবকাঠামো ও প্রযুক্তি','tower','--tt')]
NEED = {'qos':('BTRC QoS results or drive-test reports, or each operator’s published QoS figures','BTRC এর QoS ফলাফল বা ড্রাইভ টেস্ট রিপোর্ট, অথবা অপারেটরদের প্রকাশিত QoS সংখ্যা'),
        'fin':('Quarterly financial reports of Grameenphone and Robi (listed companies) and any Banglalink or Teletalk figures','গ্রামীণফোন আর রবির ত্রৈমাসিক আর্থিক প্রতিবেদন (তালিকাভুক্ত কোম্পানি), আর বাংলালিংক বা টেলিটকের প্রকাশিত সংখ্যা'),
        'inf':('BTRC or operator figures for 4G and 5G sites, bandwidth use and MNP. Tower counts are live from BTRC','4G ও 5G সাইট, ব্যান্ডউইথ ব্যবহার আর MNP নিয়ে BTRC বা অপারেটরের সংখ্যা। টাওয়ারের সংখ্যা BTRC থেকে চালু হয়েছে')}

def market_kpis(B):
    D = [r for r in B.DATA if r['total_mobile'] is not None]
    last = D[-1]; prev = [r for r in D if r['month'] < last['month']][-1]
    yr = [r for r in D if r['month'] == '%d-%s' % (int(last['month'][:4]) - 1, last['month'][5:])]
    out = []
    def add(id, en, bn, v, pv, unit_en, unit_bn, d=2, yv=None):
        out.append(dict(id=id, en=en, bn=bn, value=v, prev=pv, yoy=yv, d=d, unit_en=unit_en, unit_bn=unit_bn, period=last['month'], prev_period=prev['month'], source=last['source']))
    add('mkt_total', 'Mobile subscriptions', 'মোবাইল সাবস্ক্রিপশন', last['total_mobile'], prev['total_mobile'], 'm', 'মি.', yv=yr[0]['total_mobile'] if yr else None)
    if last['mobile_internet']:
        pm = prev['mobile_internet'] if prev['mobile_internet'] else None
        add('mkt_mi', 'Mobile internet subscriptions', 'মোবাইল ইন্টারনেট সাবস্ক্রিপশন', last['mobile_internet'], pm, 'm', 'মি.')
        out[-1]['extra'] = ('%.1f%% of mobile subscriptions' % (last['mobile_internet'] / last['total_mobile'] * 100), 'মোবাইল সাবস্ক্রিপশনের %s%%' % B.bn('%.1f' % (last['mobile_internet'] / last['total_mobile'] * 100)))
        add('mkt_fi', 'Fixed internet subscriptions', 'ফিক্সড ইন্টারনেট সাবস্ক্রিপশন', last['fixed_internet'], prev['fixed_internet'], 'm', 'মি.')
        add('mkt_ti', 'Total internet subscriptions', 'মোট ইন্টারনেট সাবস্ক্রিপশন', last['total_internet'], prev['total_internet'], 'm', 'মি.')
    for o in B.OPS:
        add('mkt_' + o['k'], o['en'], o['bn'], last[o['k']], prev[o['k']], 'm', 'মি.', yv=yr[0][o['k']] if yr and yr[0][o['k']] else None)
        sh, ps = last[o['k']] / last['total_mobile'] * 100, prev[o['k']] / prev['total_mobile'] * 100
        out[-1]['extra'] = ('Market share %.1f%% (%s pts)' % (sh, B.sgn(sh - ps, 2)), 'মার্কেট শেয়ার %s%% (%s পয়েন্ট)' % (B.bn('%.1f' % sh), B.sgn(sh - ps, 2, 'bn')))
        out[-1]['badge'] = o
    return out, last

def build_kpi(B):
    T, bn, ic, tint, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.tint, B.page, B.write, B.mlab, B.num, B.sgn
    man = json.load(open(os.path.join(B.HERE, 'data_src', 'kpi_manual.json'), encoding='utf8'))['kpis']
    mk, last = market_kpis(B)
    import tele
    TL, TP = tele.build_tele(B)
    import subhist
    subhist.build_subhist(B)
    subhist.build_inethist(B)
    import towers
    TW, TWP = towers.build_towers(B)
    import handsets
    HS, HSP = handsets.build_handsets(B)
    import qospage
    QQ = qospage.build_qos(B)
    import spectrum
    SP, SPM = spectrum.build_spectrum(B)
    def card(k):
        v, pv, d = k['value'], k['prev'], k['d']
        ch = ''
        if pv is not None:
            dv = v - pv; cls = 'up' if dv > 0 else 'down' if dv < 0 else ''
            ch = T('<b class="%s">%s%s</b> vs %s' % (cls, sgn(dv, d), ' pts' if k['unit_en'] == '%' else k['unit_en'], mlab(k['prev_period'], 'en', True)),
                   '%s এর তুলনায় <b class="%s">%s%s</b>' % (mlab(k['prev_period'], 'bn', True), cls, sgn(dv, d, 'bn'), ' পয়েন্ট' if k['unit_en'] == '%' else k['unit_bn']))
        if k.get('extra'):
            ch += ('<br>' if ch else '') + T(*k['extra'])
        if k.get('yoy'):
            yv = (v - k['yoy']) / k['yoy'] * 100
            ch += '<br>' + T('%s%% in a year' % sgn(yv, 1), 'এক বছরে %s%%' % sgn(yv, 1, 'bn'))
        unit = '<small>%s</small>' % k['unit_en'] if k['unit_en'] != '%' else '<small>%</small>'
        unitb = '<small>%s</small>' % k['unit_bn'] if k['unit_en'] != '%' else '<small>%</small>'
        return ('<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            (B.badge(k['badge']) + ' ' if k.get('badge') else '') + T(k['en'], k['bn']), T(num(v, d) + unit, num(v, d, 'bn') + unitb), ch, T('%s · %s' % (mlab(k['period']), k['source']), '%s · %s' % (mlab(k['period'], 'bn'), k['source']))))
    def card_manual(k):
        s = k['series']
        tgt = ('<div class="d">%s</div>' % T('BTRC benchmark: ' + k['target'], 'BTRC মানদণ্ড: ' + k['target_bn'])) if k.get('target') else ''
        if not s:
            return '<div class="tile kpi wait"><div class="l">%s</div><div class="v"><span class="pill">%s</span></div>%s<div class="meta">%s</div></div>' % (
                T(k['en'], k['bn']), T('Awaiting data', 'ডেটার অপেক্ষায়'), tgt, T('Unit: ' + k['unit'], 'একক: ' + k['unit']))
        x = s[-1]
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s<small>%s</small></div>%s<div class="meta">%s · %s</div></div>' % (
            T(k['en'], k['bn']), x['value'], k['unit'], tgt, x['period'], x['source'])
    secs = ''
    for g, en, bnn, icon, col in GROUPS:
        if g == 'mkt':
            tk = [dict(id='tele', en='Teledensity', bn='টেলিডেনসিটি', value=TL['teledensity_pct'], prev=TP['teledensity_pct'], d=2, unit_en='%', unit_bn='%', period=TL['month'], prev_period=TP['month'], source='BTRC'),
                  dict(id='inet', en='Internet penetration', bn='ইন্টারনেট পেনেট্রেশন', value=TL['internet_penetration_pct'], prev=TP['internet_penetration_pct'], d=2, unit_en='%', unit_bn='%', period=TL['month'], prev_period=TP['month'], source='BTRC'),
                  dict(id='mbb', en='4G subscribers', bn='4G গ্রাহক', value=TL['subs_4g_m'], prev=TP['subs_4g_m'], d=2, unit_en='m', unit_bn='মি.', period=TL['month'], prev_period=TP['month'], source='BTRC')]
            cards = ''.join(card(k) for k in mk) + ''.join(card(k) for k in tk) + '<a class="tile kpi more" href="/bd-telecom/kpi/mobile-subscribers/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Mobile subscribers by operator', 'অপারেটরভিত্তিক মোবাইল গ্রাহক'), T('Five years of BTRC data', 'BTRC এর পাঁচ বছরের ডেটা'), T('Charts, table and CSV', 'চার্ট, সারণি আর CSV')) + '<a class="tile kpi more" href="/bd-telecom/kpi/internet-subscribers/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Internet subscribers', 'ইন্টারনেট গ্রাহক'), T('Mobile and ISP since 2021', '২০২১ থেকে মোবাইল ও ISP'), T('Charts, table and CSV', 'চার্ট, সারণি আর CSV')) + '<a class="tile kpi more" href="/bd-telecom/kpi/teledensity/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Teledensity and penetration', 'টেলিডেনসিটি ও পেনেট্রেশন'), T('Monthly trend since 2021', '২০২১ থেকে মাসিক প্রবণতা'), T('Charts, table and CSV', 'চার্ট, সারণি আর CSV'))
            note = T('Updated %s from BTRC figures. Change is against the previous month with data.' % mlab(last['month']), 'BTRC এর সংখ্যা থেকে %s পর্যন্ত হালনাগাদ। পরিবর্তন আগের ডেটাসহ মাসের তুলনায়।' % mlab(last['month'], 'bn'))
        else:
            ks = [k for k in man if k['group'] == g]; cards = ''.join(card_manual(k) for k in ks)
            if g == 'qos':
                def qc(k, en, bnn):
                    nu = len(QQ['noncompliant'][k]) if k in QQ['noncompliant'] else None
                    if k == 'tt':
                        v = T('Not assessed', 'যাচাই হয়নি'); d_ = T('incomplete files to BTRC', 'BTRC এর কাছে অসম্পূর্ণ ফাইল')
                    else:
                        met = sum(1 for x in QQ['national'][k] if x == 'ok'); v = T('%d / 12' % met, '%s / ১২' % bn(met)); d_ = T('national benchmarks met · %d upazilas short' % nu, 'জাতীয় মানদণ্ড পূরণ · %sটি উপজেলায় ঘাটতি' % bn(nu))
                    return '<div class="tile kpi"><div class="l">%s %s</div><div class="v" style="font-size:1.45rem">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (B.badge(B.OPS[['gp','robi','bl','tt'].index(k)]), T(en, bnn), v, d_, T(mlab(QQ['month']) + ' · BTRC QoS report', mlab(QQ['month'], 'bn') + ' · BTRC QoS প্রতিবেদন'))
                cards = qc('gp', 'Grameenphone', 'গ্রামীণফোন') + qc('robi', 'Robi', 'রবি') + qc('bl', 'Banglalink', 'বাংলালিংক') + qc('tt', 'Teletalk', 'টেলিটক') + '<a class="tile kpi more" href="/bd-telecom/kpi/qos/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('QoS report', 'QoS প্রতিবেদন'), T('National, district and upazila results', 'জাতীয়, জেলা আর উপজেলার ফল'), T('Tables, lists and PDFs', 'সারণি, তালিকা আর PDF'))
                note = T('BTRC QoS report for %s, published 30 September 2026.' % mlab(QQ['month']), 'BTRC এর %s এর QoS প্রতিবেদন, প্রকাশ ৩০ সেপ্টেম্বর ২০২৬।' % mlab(QQ['month'], 'bn'))
            if g == 'inf':
                tw = [dict(id='tw', en='Mobile towers', bn='মোবাইল টাওয়ার', value=TW['total'] / 1000, prev=TWP['total'] / 1000, d=2, unit_en='k', unit_bn=' হাজার', period=TW['month'], prev_period=TWP['month'], source='BTRC'),
                      dict(id='twc', en='Towers owned by tower companies', bn='টাওয়ার কোম্পানির টাওয়ার', value=TW['tco_pct'], prev=TWP['tco_pct'], d=1, unit_en='%', unit_bn='%', period=TW['month'], prev_period=TWP['month'], source='BTRC')]
                tw += [dict(id='hs', en='Smartphone share of phones', bn='ফোনে স্মার্টফোনের ভাগ', value=HS['smart_pct'], prev=HSP['smart_pct'], d=2, unit_en='%', unit_bn='%', period=HS['month'], prev_period=HSP['month'], source='BTRC (GP, Robi, Banglalink)'),
                       dict(id='hs5', en='5G phones', bn='5G ফোন', value=HS['g5'] / 1e6, prev=HSP['g5'] / 1e6, d=2, unit_en='m', unit_bn='মি.', period=HS['month'], prev_period=HSP['month'], source='BTRC (GP, Robi, Banglalink)')]
                tw += [dict(id='sp', en='Access spectrum assigned', bn='বরাদ্দকৃত অ্যাক্সেস তরঙ্গ', value=SP['totals']['all'], prev=None, d=1, unit_en='MHz', unit_bn='মে.হা.', period='2026-08', prev_period=None, source='BTRC')]
                cards = ''.join(card(k) for k in tw) + '<a class="tile kpi more" href="/bd-telecom/kpi/spectrum/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Spectrum by operator', 'অপারেটরভিত্তিক তরঙ্গ'), T('MHz by band, per subscriber', 'ব্যান্ড ও গ্রাহকপ্রতি মেগাহার্জ'), T('Chart, table and CSV', 'চার্ট, সারণি আর CSV')) + '<a class="tile kpi more" href="/bd-telecom/kpi/handsets/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Handset penetration', 'হ্যান্ডসেট পেনেট্রেশন'), T('Smartphones and 5G by network', 'নেটওয়ার্ক অনুযায়ী স্মার্টফোন ও 5G'), T('Charts, table and CSV', 'চার্ট, সারণি আর CSV')) + '<a class="tile kpi more" href="/bd-telecom/kpi/towers/"><div class="l">%s</div><div class="v" style="font-size:1.05rem">%s →</div><div class="meta">%s</div></a>' % (T('Towers by owner', 'মালিকানা অনুযায়ী টাওয়ার'), T('Monthly since Dec 2022', 'ডিসে ২০২২ থেকে মাসিক'), T('Charts, table and CSV', 'চার্ট, সারণি আর CSV')) + cards
            if g != 'qos': note = T('Waiting for files: ' + NEED[g][0] + '.', 'ফাইলের অপেক্ষায়: ' + NEED[g][1] + '।')
        secs += '<section class="block" id="%s"><div class="sechead"><h2 style="display:flex;align-items:center;gap:10px"><span class="ic" style="%s;width:32px;height:32px;border-radius:9px;display:inline-grid;place-items:center">%s</span>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="tiles kpis">%s</div></section>' % (
            g, tint(col), ic(icon), T(en, bnn), note, cards)
    jump = ''.join('<a href="#%s">%s</a>' % (g, T(en, bnn)) for g, en, bnn, _, _ in GROUPS)
    body = ('<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header><nav class="jump" aria-label="KPI groups">%s</nav>%s'
            '<div class="callout"><span>%s</span><p>%s</p></div>') % (
        T('Bangladesh telecom KPIs', 'বাংলাদেশ টেলিকম KPI'),
        T('Every key number for the sector in one place: subscribers and market share, network quality, finances and infrastructure. Each figure shows its month, its source and the change since the last update.',
          'খাতের সব গুরুত্বপূর্ণ সংখ্যা এক জায়গায়: গ্রাহক ও মার্কেট শেয়ার, নেটওয়ার্কের মান, আর্থিক অবস্থা আর অবকাঠামো। প্রতিটি সংখ্যার পাশে মাস, সূত্র আর আগের হালনাগাদের পর থেকে পরিবর্তন দেখানো আছে।'),
        T('Updated monthly · latest data %s' % mlab(last['month']), 'প্রতি মাসে হালনাগাদ · সর্বশেষ ডেটা %s' % mlab(last['month'], 'bn')), jump, secs, ic('info'),
        T('Figures are taken from official reports and BTRC data, checked, then published. Groups marked "Awaiting data" fill in as reports arrive.', 'সংখ্যাগুলো সরকারি প্রতিবেদন আর BTRC এর ডেটা থেকে নিয়ে যাচাই করে প্রকাশ করা হয়। "ডেটার অপেক্ষায়" লেখা অংশগুলো প্রতিবেদন আসার সাথে সাথে পূরণ হবে।'))
    write('kpi/index.html', page('kpi/', 'kpi', 'Bangladesh telecom KPIs: subscribers, market share, QoS, finance | BD Telecom', 'বাংলাদেশ টেলিকম KPI | BD Telecom',
          'Monthly Bangladesh telecom KPIs: mobile and internet subscribers, operator market share, network quality, finances and infrastructure, each with its source.', body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))
    return ['bd-telecom/kpi/', 'bd-telecom/kpi/teledensity/', 'bd-telecom/kpi/mobile-subscribers/', 'bd-telecom/kpi/internet-subscribers/', 'bd-telecom/kpi/towers/', 'bd-telecom/kpi/handsets/', 'bd-telecom/kpi/qos/', 'bd-telecom/kpi/spectrum/']
