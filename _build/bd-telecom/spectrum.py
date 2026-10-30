"""Assigned access spectrum by operator and band (BTRC)."""
import json, os, csv
KEYS = [('gp', 0), ('robi', 1), ('bl', 2), ('tt', 3)]
SH = ['color-mix(in srgb,var(--accent) 100%,var(--surface))', 'color-mix(in srgb,var(--accent) 70%,var(--surface))', 'color-mix(in srgb,var(--amber) 100%,var(--surface))',
      'color-mix(in srgb,var(--amber) 60%,var(--surface))', 'color-mix(in srgb,var(--gp) 85%,var(--surface))', 'color-mix(in srgb,var(--gp) 45%,var(--surface))']
def build_spectrum(B):
    T, bn, ic, page, write, mlab, num = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num
    S = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-spectrum.json'))); BA = S['bands']
    for k, _ in KEYS:
        assert abs(sum(S['ops'][k]) - S['totals'][k]) < 0.01
    for j in range(6): assert abs(sum(S['ops'][k][j] for k, _ in KEYS) - S['totals']['bands'][j]) < 0.01
    subs = {k: B.LAST[n] for k, n in [('gp', 'grameenphone'), ('robi', 'robi'), ('bl', 'banglalink'), ('tt', 'teletalk')]}
    with open(os.path.join(B.OUT, 'spectrum-btrc-2026-08.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['operator'] + [b.replace(' ', '_') + '_mhz' for b in BA] + ['total_mhz', 'subscriptions_m_%s' % B.LAST['month'], 'mhz_per_million_subs'])
        for k, i in KEYS: w.writerow([B.OPS[i]['en']] + S['ops'][k] + [S['totals'][k], subs[k], round(S['totals'][k] / subs[k], 2)])
    mx = max(S['totals'][k] for k, _ in KEYS)
    bars = ''
    for k, i in KEYS:
        o = B.OPS[i]; segs = ''.join('<span class="seg" style="width:%.2f%%;background:%s" title="%s: %s MHz"></span>' % (v / mx * 100, SH[j], BA[j], v) for j, v in enumerate(S['ops'][k]) if v)
        bars += '<div class="sb"><span class="sl">%s%s</span><span class="st">%s</span><span class="sv"><b>%s</b> MHz</span></div>' % (B.badge(o), T(o['en'], o['bn']), segs, T(num(S['totals'][k], 1), num(S['totals'][k], 1, 'bn')))
    leg = '<p class="sub" style="display:flex;gap:14px;flex-wrap:wrap;margin:12px 0 0">' + ''.join('<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:%s;vertical-align:-1px;margin-right:6px"></span>%s</span>' % (SH[j], b) for j, b in enumerate(BA)) + '</p>'
    th = '<th>%s</th>' % T('Operator', 'অপারেটর') + ''.join('<th>%s</th>' % b for b in BA) + '<th>%s</th>' % T('Total', 'মোট')
    cell = lambda v: '<td%s>%s</td>' % (' class="gap"' if not v else '', T('%.1f' % v, bn('%.1f' % v)))
    trs = ''.join('<tr><td>%s%s</td>%s<td><b>%s</b></td></tr>' % (B.badge(B.OPS[i]), T(B.OPS[i]['en'], B.OPS[i]['bn']), ''.join(cell(v) for v in S['ops'][k]), T('%.1f' % S['totals'][k], bn('%.1f' % S['totals'][k]))) for k, i in KEYS)
    trs += '<tr><td><b>%s</b></td>%s<td><b>%s</b></td></tr>' % (T('Total', 'মোট'), ''.join(cell(v) for v in S['totals']['bands']), T('%.1f' % S['totals']['all'], bn('%.1f' % S['totals']['all'])))
    pm = {k: S['totals'][k] / subs[k] for k, _ in KEYS}
    pmx = max(pm.values())
    pmb = '<div class="hbars">' + ''.join('<div class="hb"><span class="hl">%s</span><span class="ht"><span class="hf" style="width:%.1f%%;background:var(%s)"></span></span><span class="hv"><b>%s</b> <span>MHz</span></span></div>' % (
        T(B.OPS[i]['en'], B.OPS[i]['bn']), pm[k] / pmx * 100, B.OPS[i]['c'], T('%.2f' % pm[k], bn('%.2f' % pm[k]))) for k, i in sorted(KEYS, key=lambda x: pm[x[0]])) + '</div>'
    gp = S['totals']['gp'] / S['totals']['all'] * 100
    low = {k: S['ops'][k][0] + S['ops'][k][1] for k, _ in KEYS}
    tile = lambda l, v, d: '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (l, v, d, T('BTRC, updated 31 Aug 2026', 'BTRC, হালনাগাদ ৩১ আগস্ট ২০২৬'))
    tiles = (tile(T('Access spectrum assigned', 'বরাদ্দকৃত অ্যাক্সেস তরঙ্গ'), T('406.6<small>MHz</small>', '৪০৬.৬<small>মে.হা.</small>'), T('across 6 bands and 4 operators', '৬টি ব্যান্ডে, ৪ অপারেটরকে')) +
             tile(T('Grameenphone’s share', 'গ্রামীণফোনের ভাগ'), T('%.1f<small>%%</small>' % gp, '%s<small>%%</small>' % bn('%.1f' % gp)), T('137.4 MHz, the most of any operator', '১৩৭.৪ মে.হা., অপারেটরদের মধ্যে সবচেয়ে বেশি')) +
             tile(T('Spectrum per million subscriptions', 'প্রতি মিলিয়ন সাবস্ক্রিপশনে তরঙ্গ'), T('%.2f<small>MHz</small>' % pm['gp'], '%s<small>মে.হা.</small>' % bn('%.2f' % pm['gp'])), T('Grameenphone, the lowest; Robi %.2f, Banglalink %.2f' % (pm['robi'], pm['bl']), 'গ্রামীণফোন, সবচেয়ে কম; রবি %s, বাংলালিংক %s' % (bn('%.2f' % pm['robi']), bn('%.2f' % pm['bl'])))) +
             tile(T('700 MHz holders', '700 MHz ধারক'), T('2', '২'), T('Grameenphone and Teletalk, 10 MHz each', 'গ্রামীণফোন আর টেলিটক, প্রতিটি ১০ মে.হা.')))
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/spectrum-btrc-2026-08.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/btrc-spectrum-2026-08.png" download>%s%s</a></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p><div class="sbars">%s</div>%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="spec"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<div class="callout"><span>%s</span><p>%s</p></div>''' % (
        T('Mobile spectrum held by each operator in Bangladesh', 'বাংলাদেশে প্রতিটি অপারেটরের বরাদ্দকৃত তরঙ্গ'),
        T('How much access spectrum BTRC has assigned to Grameenphone, Robi, Banglalink and Teletalk in each band, in MHz.', 'গ্রামীণফোন, রবি, বাংলালিংক আর টেলিটককে BTRC প্রতিটি ব্যান্ডে কত মেগাহার্জ অ্যাক্সেস তরঙ্গ বরাদ্দ দিয়েছে।'),
        T('BTRC, updated 31 Aug 2026', 'BTRC, হালনাগাদ ৩১ আগস্ট ২০২৬'), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC table (image)', 'BTRC এর সারণি (ছবি)'),
        T('Spectrum by operator and band', 'অপারেটর ও ব্যান্ড অনুযায়ী তরঙ্গ'), T('MHz. Low bands (700, 900 MHz) carry coverage; high bands (2.3, 2.6 GHz) carry capacity.', 'মেগাহার্জ। নিচের ব্যান্ড (700, 900 MHz) কভারেজ দেয়; উঁচু ব্যান্ড (2.3, 2.6 GHz) ক্যাপাসিটি দেয়।'), bars, leg,
        T('By band', 'ব্যান্ড অনুযায়ী'), th, trs,
        T('Spectrum per million subscriptions', 'প্রতি মিলিয়ন সাবস্ক্রিপশনে তরঙ্গ'),
        T('MHz of access spectrum for every million active subscriptions, using BTRC subscriber figures for %s.' % mlab(B.LAST['month']), '%s এর BTRC গ্রাহক সংখ্যা ধরে, প্রতি মিলিয়ন সক্রিয় সাবস্ক্রিপশনের জন্য কত মেগাহার্জ তরঙ্গ।' % mlab(B.LAST['month'], 'bn')), pmb,
        ic('info'), T('Grameenphone holds the most spectrum but serves far more subscribers, so it has the least spectrum per subscriber of the three private operators. Only Grameenphone and Teletalk hold 700 MHz, the band that travels farthest. Robi has the most low-band spectrum in 900 MHz (9 MHz) but no 700 MHz. Banglalink and Teletalk use 2.3 GHz for capacity; Grameenphone and Robi use 2.6 GHz.',
                      'গ্রামীণফোনের তরঙ্গ সবচেয়ে বেশি, কিন্তু গ্রাহকও অনেক বেশি, তাই তিন বেসরকারি অপারেটরের মধ্যে গ্রাহকপ্রতি তরঙ্গ তাদেরই সবচেয়ে কম। সবচেয়ে দূর পর্যন্ত পৌঁছানো 700 MHz ব্যান্ড আছে শুধু গ্রামীণফোন আর টেলিটকের। 900 MHz এ রবির তরঙ্গ সবচেয়ে বেশি (৯ মে.হা.), কিন্তু 700 MHz নেই। ক্যাপাসিটির জন্য বাংলালিংক আর টেলিটক 2.3 GHz, আর গ্রামীণফোন ও রবি 2.6 GHz ব্যবহার করে।'))
    write('kpi/spectrum/index.html', page('kpi/spectrum/', 'kpi', 'Mobile spectrum by operator in Bangladesh: GP, Robi, Banglalink, Teletalk (BTRC) | BD Telecom', 'বাংলাদেশে অপারেটরভিত্তিক বরাদ্দকৃত তরঙ্গ | BD Telecom',
          'BTRC has assigned 406.6 MHz of access spectrum: Grameenphone 137.4, Robi 124, Banglalink 80, Teletalk 65.2 MHz. By band, with spectrum per subscriber and CSV.', body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
    return S, pm
