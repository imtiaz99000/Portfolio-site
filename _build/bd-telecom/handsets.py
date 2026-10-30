"""Mobile handset penetration in MNO networks (BTRC, Oct 2025 to Sep 2026)."""
import json, os, csv
import tele
NET = [('all', 'All three networks', 'তিন নেটওয়ার্ক মিলিয়ে', '--total'), ('gp', 'Grameenphone', 'গ্রামীণফোন', '--gp'), ('robi', 'Robi', 'রবি', '--robi'), ('bl', 'Banglalink', 'বাংলালিংক', '--bl')]
def build_handsets(B):
    T, bn, ic, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num, B.sgn
    D = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-handsets.json')))
    for n in D:
        for r in D[n]:
            r['smart_m'] = r['smart'] / 1e6; r['g5_m'] = r['g5'] / 1e6; r['g4_m'] = r['g4'] / 1e6; r['g2_m'] = r['g2'] / 1e6; r['g3_m'] = r['g3'] / 1e6; r['tot_m'] = r['total'] / 1e6
    with open(os.path.join(B.OUT, 'handsets-btrc-2025-2026.csv'), 'w', newline='') as f:
        ks = ['g2', 'g3', 'g4', 'g5', 'total', 'smart', 'f700', 'f23', 'unknown', 'feat_pct', 'smart_pct', 'g5_pct', 'f700_pct', 'f23_pct']
        w = csv.writer(f); w.writerow(['network', 'month', '2g', '3g', '4g', '5g', 'total_phones', 'smartphones_3g_5g', 'smart_700mhz', 'smart_2_3_2_6ghz', 'unknown_technology', 'feature_pct', 'smartphone_pct', '5g_pct', '700mhz_pct_of_smart', '2_3_2_6ghz_pct_of_smart'])
        for n, *_ in NET:
            for r in D[n]: w.writerow([n, r['month']] + [int(r[k]) if k in ('g2', 'g3', 'g4', 'g5', 'total', 'smart', 'f700', 'f23', 'unknown') else r[k] for k in ks])
    A = D['all']; F, L = A[0], A[-1]
    fm = lambda v, lang='en': (('%.2f' % (v / 1e6)) if lang == 'en' else bn('%.2f' % (v / 1e6)))
    def tile(en, bnn, v, vb, unit, ub, d_en, d_bn):
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(v + '<small>%s</small>' % unit, vb + '<small>%s</small>' % ub), T(d_en, d_bn), T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    d = lambda k: L[k] - F[k]
    tiles = (tile('Mobile phones on GP, Robi and Banglalink', 'জিপি, রবি ও বাংলালিংকে মোবাইল ফোন', fm(L['total']), fm(L['total'], 'bn'), 'm', 'মি.',
                  '%s m since %s' % (sgn(d('total') / 1e6), mlab(F['month'], 'en', True)), '%s থেকে %s মি.' % (mlab(F['month'], 'bn', True), sgn(d('total') / 1e6, 2, 'bn'))) +
             tile('Smartphones (3G to 5G)', 'স্মার্টফোন (3G থেকে 5G)', '%.2f' % L['smart_pct'], bn('%.2f' % L['smart_pct']), '%', '%',
                  '%s m phones · was %.2f%%' % (fm(L['smart']), F['smart_pct']), '%s মি. ফোন · আগে ছিল %s%%' % (fm(L['smart'], 'bn'), bn('%.2f' % F['smart_pct']))) +
             tile('5G phones', '5G ফোন', fm(L['g5']), fm(L['g5'], 'bn'), 'm', 'মি.', '%.2f%% of phones · %s m in 12 months' % (L['g5_pct'], sgn(d('g5') / 1e6)), 'ফোনের %s%% · ১২ মাসে %s মি.' % (bn('%.2f' % L['g5_pct']), sgn(d('g5') / 1e6, 2, 'bn'))) +
             tile('Feature phones (2G)', 'ফিচার ফোন (2G)', fm(L['g2']), fm(L['g2'], 'bn'), 'm', 'মি.', '%.2f%% of phones · %s m in 12 months' % (L['feat_pct'], sgn(d('g2') / 1e6)), 'ফোনের %s%% · ১২ মাসে %s মি.' % (bn('%.2f' % L['feat_pct']), sgn(d('g2') / 1e6, 2, 'bn'))))
    c1 = tele.chart(B, A, [('smart_pct', 'All', 'সব', '--total')] and [(n, en, bnn, col) for n, en, bnn, col in []], 0, 1, 1, '%') if False else None
    # smartphone share per network: build pseudo rows keyed by month
    months = [r['month'] for r in A]
    rows = [dict(month=m, **{n: D[n][i]['smart_pct'] for n, *_ in NET}) for i, m in enumerate(months)]
    rows5 = [dict(month=m, **{n: D[n][i]['g5_pct'] for n, *_ in NET}) for i, m in enumerate(months)]
    c1 = tele.chart(B, rows, [(n, en, bnn, col) for n, en, bnn, col in NET], 50, 80, 5, '%', h=300, cls='scroll')
    c2 = tele.chart(B, rows5, [(n, en, bnn, col) for n, en, bnn, col in NET], 0, 12, 2, '%', h=300, cls='scroll')
    # latest comparison table by network
    def row(n, en, bnn):
        r = D[n][-1]; c = lambda s: '<td>%s</td>' % T(s, bn(s))
        return '<tr><td>%s</td>%s%s%s%s%s%s%s</tr>' % (T(en, bnn), c(fm(r['total'])), c('%.2f%%' % r['smart_pct']), c(fm(r['g4'])), c(fm(r['g5'])), c('%.2f%%' % r['g5_pct']), c('%.2f%%' % r['f700_pct']), c(fm(r['g2'])))
    cmp_ = ''.join(row(n, en, bnn) for n, en, bnn, _ in NET[1:]) + row('all', 'Total', 'মোট')
    cmph = ''.join('<th>%s</th>' % T(a, b) for a, b in [('Network', 'নেটওয়ার্ক'), ('Phones (m)', 'ফোন (মি.)'), ('Smartphone share', 'স্মার্টফোনের ভাগ'), ('4G phones (m)', '4G ফোন (মি.)'), ('5G phones (m)', '5G ফোন (মি.)'), ('5G share', '5G এর ভাগ'), ('700 MHz-ready smartphones', '700 MHz সমর্থিত স্মার্টফোন'), ('Feature phones (m)', 'ফিচার ফোন (মি.)')])
    def mrow(r, flag=False):
        c = lambda s, fl=False: '<td%s>%s</td>' % (' class="flag"' if fl else '', T(s, bn(s)))
        return '<tr><td>%s</td>%s%s%s%s%s%s%s</tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), c(fm(r['g2'])), c(fm(r['g3'])), c(fm(r['g4'])), c(fm(r['g5'])), c(fm(r['total'])), c('%.2f%%' % r['smart_pct']), c('%.2f%%' % r['g5_pct']))
    mth = ''.join('<th>%s</th>' % T(a, b) for a, b in [('Month', 'মাস'), ('2G (m)', '2G (মি.)'), ('3G (m)', '3G (মি.)'), ('4G (m)', '4G (মি.)'), ('5G (m)', '5G (মি.)'), ('Total (m)', 'মোট (মি.)'), ('Smartphone', 'স্মার্টফোন'), ('5G', '5G')])
    mtr = ''.join(mrow(r) for r in reversed(A))
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/handsets-btrc-2025-2026.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/btrc-handset-penetration-2026-10.pdf" download>%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Smartphone and 5G handset penetration in Bangladesh', 'বাংলাদেশে স্মার্টফোন ও 5G হ্যান্ডসেট পেনেট্রেশন'),
        T('Which phones people use on the Grameenphone, Robi and Banglalink networks: 2G feature phones, 3G, 4G and 5G smartphones, and which smartphones support the 700 MHz and 2.3/2.6 GHz bands. Monthly, %s to %s.' % (mlab(F['month']), mlab(L['month'])),
          'গ্রামীণফোন, রবি আর বাংলালিংকের নেটওয়ার্কে মানুষ কোন ফোন ব্যবহার করে: 2G ফিচার ফোন, 3G, 4G আর 5G স্মার্টফোন, আর কোন স্মার্টফোন 700 MHz ও 2.3/2.6 GHz ব্যান্ড সমর্থন করে। মাসিক, %s থেকে %s।' % (mlab(F['month'], 'bn'), mlab(L['month'], 'bn'))),
        T('BTRC, published 14 Oct 2026', 'BTRC, প্রকাশ ১৪ অক্টো ২০২৬'), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC report (PDF)', 'BTRC এর প্রতিবেদন (PDF)'),
        ic('info'), T('BTRC compiles this from each operator’s monthly network data. It covers handsets seen on Grameenphone, Robi and Banglalink; Teletalk is not included. A smartphone here means a 3G, 4G or 5G handset. The total counts handsets by technology and excludes those of unknown technology.',
                      'BTRC প্রতিটি অপারেটরের মাসিক নেটওয়ার্ক তথ্য থেকে এটি তৈরি করে। এতে গ্রামীণফোন, রবি আর বাংলালিংকের নেটওয়ার্কে দেখা হ্যান্ডসেট আছে; টেলিটক নেই। এখানে স্মার্টফোন মানে 3G, 4G বা 5G হ্যান্ডসেট। মোট সংখ্যায় প্রযুক্তি অনুযায়ী হ্যান্ডসেট গোনা হয়েছে, অজানা প্রযুক্তির হ্যান্ডসেট বাদে।'),
        T('By network, %s' % mlab(L['month']), 'নেটওয়ার্ক অনুযায়ী, %s' % mlab(L['month'], 'bn')), cmph, cmp_,
        T('Smartphone share of phones', 'ফোনের মধ্যে স্মার্টফোনের ভাগ'), T('% of handsets on each network that are 3G, 4G or 5G', 'প্রতিটি নেটওয়ার্কে 3G, 4G বা 5G হ্যান্ডসেটের ভাগ, %'), c1,
        T('5G phone share', '5G ফোনের ভাগ'), T('% of handsets on each network that are 5G', 'প্রতিটি নেটওয়ার্কে 5G হ্যান্ডসেটের ভাগ, %'), c2,
        T('All three networks, month by month', 'তিন নেটওয়ার্ক মিলিয়ে, মাসভিত্তিক'), mth, mtr, ic('alert'),
        T('Checked: in every month the three networks add up to the combined table, and 3G plus 4G plus 5G equals the smartphone count. One oddity in the source: Grameenphone’s 700 MHz and 2.3/2.6 GHz smartphone counts for July 2026 are exactly the same as June’s, which looks like June’s figures were repeated.',
          'যাচাই করা হয়েছে: প্রতি মাসে তিন নেটওয়ার্কের যোগফল সম্মিলিত সারণির সমান, আর 3G, 4G ও 5G মিলে স্মার্টফোনের সংখ্যার সমান। মূল উৎসে একটি অস্বাভাবিকতা: জুলাই ২০২৬ এ গ্রামীণফোনের 700 MHz আর 2.3/2.6 GHz সমর্থিত স্মার্টফোনের সংখ্যা জুনের সংখ্যার হুবহু এক, যা দেখে মনে হয় জুনের সংখ্যাই আবার বসানো হয়েছে।'))
    write('kpi/handsets/index.html', page('kpi/handsets/', 'kpi', 'Smartphone and 5G handset penetration in Bangladesh (BTRC) | BD Telecom', 'বাংলাদেশে স্মার্টফোন ও 5G হ্যান্ডসেট পেনেট্রেশন | BD Telecom',
          '%.2f%% of phones on GP, Robi and Banglalink are smartphones and %.2f%% are 5G (%s). Monthly BTRC handset data by network, with charts, table and CSV.' % (L['smart_pct'], L['g5_pct'], mlab(L['month'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
    return L, A[-2]
