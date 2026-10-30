"""Tower counts by owner from BTRC's 'Operator tower numbers' table."""
import json, os, csv
import tele
OWN = [('gp', 'Grameenphone', 'গ্রামীণফোন', 'mno', '--gp'), ('robi', 'Robi', 'রবি', 'mno', '--robi'), ('bl', 'Banglalink', 'বাংলালিংক', 'mno', '--bl'), ('tt', 'Teletalk', 'টেলিটক', 'mno', '--tt'),
       ('edotco', 'edotco', 'edotco', 'tco', '--accent'), ('summit', 'Summit Towers', 'Summit Towers', 'tco', '--accent'), ('kirtonkhola', 'Kirtonkhola Tower', 'Kirtonkhola Tower', 'tco', '--accent'),
       ('frontier', 'Frontier Towers', 'Frontier Towers', 'tco', '--accent'), ('btcl', 'BTCL (sharing permit)', 'BTCL (শেয়ারিং পারমিট)', 'btcl', '--muted')]
def build_towers(B):
    T, bn, ic, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num, B.sgn
    rows = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-towers.json'))); rows.sort(key=lambda r: r['month'])
    for r in rows:
        r['sum'] = sum(r[k] for k, *_ in OWN); r['tco'] = sum(r[k] for k, _, _, g, _ in OWN if g == 'tco'); r['mno'] = sum(r[k] for k, _, _, g, _ in OWN if g == 'mno')
        r['tco_pct'] = r['tco'] / r['sum'] * 100
    with open(os.path.join(B.OUT, 'towers-btrc-2022-2026.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['month'] + [k for k, *_ in OWN] + ['total_btrc', 'sum_of_owners'])
        for r in rows: w.writerow([r['month']] + [r[k] for k, *_ in OWN] + [r['total'], r['sum']])
    F, L = rows[0], rows[-1]; P = rows[-2]
    fi = lambda v, lang='en': (format(v, ',') if lang == 'en' else bn(format(v, ',')))
    def tile(en, bnn, v, d_en, d_bn, unit=''):
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(v[0] + unit, v[1] + unit), T(d_en, d_bn), T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    dt = L['total'] - F['total']
    tiles = (tile('Towers in Bangladesh', 'বাংলাদেশে টাওয়ার', (fi(L['total']), fi(L['total'], 'bn')), '<b class="up">+%s</b> since %s' % (fi(dt), mlab(F['month'], 'en', True)), '%s থেকে <b class="up">+%s</b>' % (mlab(F['month'], 'bn', True), fi(dt, 'bn'))) +
             tile('Owned by tower companies', 'টাওয়ার কোম্পানির মালিকানায়', ('%.1f' % L['tco_pct'], bn('%.1f' % L['tco_pct'])), 'was %.1f%% in %s' % (F['tco_pct'], mlab(F['month'], 'en', True)), '%s এ ছিল %s%%' % (mlab(F['month'], 'bn', True), bn('%.1f' % F['tco_pct'])), '<small>%</small>') +
             tile('edotco towers', 'edotco এর টাওয়ার', (fi(L['edotco']), fi(L['edotco'], 'bn')), 'largest owner, %.0f%% of all towers' % (L['edotco'] / L['sum'] * 100), 'সবচেয়ে বড় মালিক, মোট টাওয়ারের %s%%' % bn('%.0f' % (L['edotco'] / L['sum'] * 100))) +
             tile('Summit Towers', 'Summit Towers', (fi(L['summit']), fi(L['summit'], 'bn')), 'from %s in %s' % (fi(F['summit']), mlab(F['month'], 'en', True)), '%s এ ছিল %s' % (mlab(F['month'], 'bn', True), fi(F['summit'], 'bn'))))
    mx = max(L[k] for k, *_ in OWN)
    bars = ['<div class="hbars">']
    for k, en, bnn, g, col in sorted(OWN, key=lambda o: -L[o[0]]):
        bars.append('<div class="hb"><span class="hl">%s</span><span class="ht"><span class="hf" style="width:%.1f%%;background:var(%s)"></span></span><span class="hv"><b>%s</b> <span>%s</span></span></div>' % (
            T(en, bnn), L[k] / mx * 100, col, T(fi(L[k]), fi(L[k], 'bn')), T({'mno': 'operator', 'tco': 'tower co.', 'btcl': 'permit'}[g], {'mno': 'অপারেটর', 'tco': 'টাওয়ার কো.', 'btcl': 'পারমিট'}[g])))
    bars.append('</div>')
    for r in rows: r['tco_k'] = r['tco'] / 1000; r['mno_k'] = r['mno'] / 1000; r['tot_k'] = r['total'] / 1000
    c1 = tele.chart(B, rows, [('tot_k', 'All towers', 'মোট', '--total'), ('tco_k', 'Tower companies', 'টাওয়ার কোম্পানি', '--accent'), ('mno_k', 'Mobile operators', 'মোবাইল অপারেটর', '--amber')], 0, 50, 10, 'k', h=280, cls='scroll')
    ks = [k for k, *_ in OWN]
    def cell(r, k):
        v = r[k]; fl = (r['month'] == '2023-05' and k == 'frontier')
        return '<td%s>%s</td>' % (' class="flag"' if fl else '', T(fi(v), fi(v, 'bn')))
    trs = ''.join('<tr><td>%s</td>%s<td%s>%s</td></tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), ''.join(cell(r, k) for k in ks),
                  ' class="flag"' if abs(r['sum'] - r['total']) > 2 else '', T(fi(r['total']), fi(r['total'], 'bn'))) for r in reversed(rows))
    th = '<th>%s</th>' % T('Month', 'মাস') + ''.join('<th>%s</th>' % T(en, bnn) for _, en, bnn, _, _ in OWN) + '<th>%s</th>' % T('Total (BTRC)', 'মোট (BTRC)')
    bad = [r for r in rows if abs(r['sum'] - r['total']) > 2]
    badm_en = ', '.join(mlab(r['month'], 'en', True) for r in bad); badm_bn = ', '.join(mlab(r['month'], 'bn', True) for r in bad)
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/towers-btrc-2022-2026.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/btrc-tower-numbers-2026-09.pdf" download>%s%s</a></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="wide"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Mobile towers in Bangladesh by owner', 'বাংলাদেশে মালিকানা অনুযায়ী মোবাইল টাওয়ার'),
        T('How many towers each mobile operator and tower company owns, every month from %s to %s, from BTRC.' % (mlab(F['month']), mlab(L['month'])),
          '%s থেকে %s পর্যন্ত প্রতি মাসে কোন মোবাইল অপারেটর আর টাওয়ার কোম্পানির কয়টা টাওয়ার, BTRC থেকে।' % (mlab(F['month'], 'bn'), mlab(L['month'], 'bn'))),
        T('BTRC table updated 23 Sep 2026', 'BTRC সারণি হালনাগাদ ২৩ সেপ্টে ২০২৬'), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC table (PDF)', 'BTRC এর সারণি (PDF)'),
        T('Who owns the towers, %s' % mlab(L['month']), 'কার কয়টা টাওয়ার, %s' % mlab(L['month'], 'bn')), T('Number of towers', 'টাওয়ারের সংখ্যা'), ''.join(bars),
        T('Towers over time', 'সময়ের সাথে টাওয়ার'), T('Thousands of towers. Tower companies are edotco, Summit, Kirtonkhola and Frontier.', 'হাজার টাওয়ার। টাওয়ার কোম্পানি: edotco, Summit, Kirtonkhola আর Frontier।'), c1,
        ic('info'), T('Two moves stand out. Between December 2023 and January 2024 Banglalink\\u2019s count fell by about 2,000 while Summit\\u2019s rose by about 2,000, which fits Banglalink handing towers to Summit. In March 2026 Grameenphone\\u2019s count dropped by 462. Under BTRC\\u2019s 2018 tower sharing guidelines, operators roll back their own tower sharing as tower companies cover each area.'.replace('\\\\u2019', '’'),
                      'দুটো পরিবর্তন চোখে পড়ে। ডিসেম্বর ২০২৩ থেকে জানুয়ারি ২০২৪ এ বাংলালিংকের প্রায় ২,০০০ টাওয়ার কমেছে আর Summit এর প্রায় ২,০০০ বেড়েছে, যা বাংলালিংক থেকে Summit এর কাছে টাওয়ার যাওয়ার সাথে মেলে। মার্চ ২০২৬ এ গ্রামীণফোনের টাওয়ার ৪৬২টি কমেছে। BTRC এর ২০১৮ এর টাওয়ার শেয়ারিং গাইডলাইন অনুযায়ী টাওয়ার কোম্পানি যে এলাকায় পৌঁছায়, সেখানে অপারেটররা নিজেদের টাওয়ার শেয়ারিং গুটিয়ে নেয়।'),
        T('Month by month', 'মাসভিত্তিক'), th, trs, ic('alert'),
        T('Shown as BTRC publishes them. In %s BTRC\\u2019s total does not equal the sum of the owners, by up to 279 towers; those totals are marked. May 2023 lists Frontier at 24, probably 244.'.replace('\\\\u2019', '’') % badm_en,
          'BTRC যেভাবে প্রকাশ করেছে সেভাবেই দেখানো। %s এ BTRC এর মোট সংখ্যা মালিকদের যোগফলের সমান নয়, পার্থক্য সর্বোচ্চ ২৭৯টি টাওয়ার; সেই মোটগুলো চিহ্নিত। মে ২০২৩ এ Frontier এর সংখ্যা ২৪ লেখা, সম্ভবত ২৪৪।' % badm_bn))
    body = body.replace('\\u2019', '’')
    write('kpi/towers/index.html', page('kpi/towers/', 'kpi', 'Mobile towers in Bangladesh by owner: GP, Robi, edotco, Summit (BTRC) | BD Telecom', 'বাংলাদেশে মালিকানা অনুযায়ী মোবাইল টাওয়ার | BD Telecom',
          'Bangladesh had %s mobile towers in %s. Monthly BTRC tower counts by operator and tower company since %s, with charts, table and CSV.' % (format(L['total'], ','), mlab(L['month']), mlab(F['month'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
    return L, P
