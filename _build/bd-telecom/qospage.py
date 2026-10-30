"""QoS compliance page from BTRC's monthly MNO QoS reports."""
import json, os, csv
OPN = [('gp', 'Grameenphone', 'গ্রামীণফোন', 'grameenphone'), ('robi', 'Robi', 'রবি', 'robi'), ('bl', 'Banglalink', 'বাংলালিংক', 'banglalink'), ('tt', 'Teletalk', 'টেলিটক', 'teletalk')]
UPK = [0, 1, 4, 7, 8]
KN = {'drop': 0, 'cssr': 1, 'rrc': 4, 'mixed_drop': 7, 'mixed_cssr': 8}
def build_qos(B):
    T, bn, ic, page, write, mlab = B.T, B.bn, B.ic, B.page, B.write, B.mlab
    Q = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-qos-2026-08.json'), encoding='utf8'))
    KP = Q['kpis']; M = Q['month']; OPS = {o['k'][:2] if o['k'] != 'robi' else 'robi': o for o in B.OPS}
    OPS = {'gp': B.OPS[0], 'robi': B.OPS[1], 'bl': B.OPS[2], 'tt': B.OPS[3]}
    pill = {'ok': T('Met', 'পূরণ'), 'non': T('Not met', 'পূরণ হয়নি'), 'na': T('Not assessed', 'যাচাই হয়নি'), '': '–'}
    cls = {'ok': 'okp', 'non': 'warn', 'na': 'nap', '': ''}
    def p(s): return '<span class="pill %s">%s</span>' % (cls[s], pill[s]) if s else '<span class="gap">–</span>'
    # national matrix
    th = '<th>%s</th><th>%s</th>' % (T('Indicator', 'সূচক'), T('Benchmark', 'মানদণ্ড')) + ''.join('<th>%s%s</th>' % (B.badge(OPS[k]), T(e, b)) for k, e, b, _ in OPN)
    trs = ''
    for i, (en, bnn, thr) in enumerate(KP):
        tt = Q['national']['tt'][i]; td = Q['tt_declared'][i]
        ttc = p('na') + ('<br><small>%s %s</small>' % (T('Teletalk says:', 'টেলিটকের দাবি:'), pill[td]) if td else '')
        trs += '<tr><td>%s</td><td>%s</td>%s<td>%s</td></tr>' % (T(en, bnn), T(thr, bn(thr)), ''.join('<td>%s</td>' % p(Q['national'][k][i]) for k in ('gp', 'robi', 'bl')), ttc)
    # district + upazila
    dth = '<th>%s</th>' % T('Indicator', 'সূচক') + ''.join('<th>%s</th>' % T(e, b) for _, e, b, _ in OPN)
    def frac(a, b, warn):
        if a is None: return '<td class="gap">–</td>'
        s = '%d / %d' % (a, b); return '<td class="frac%s">%s</td>' % (' flag' if a < b else '', T(s, bn(s)))
    dtr = ''.join('<tr><td>%s</td>%s</tr>' % (T(en, bnn), ''.join(frac(Q['district'][k][i], 64, True) for k, *_ in OPN)) for i, (en, bnn) in enumerate(Q['district_kpis']))
    utr = ''
    for j, ki in enumerate(UPK):
        en, bnn, _ = KP[ki]
        utr += '<tr><td>%s</td>%s</tr>' % (T(en, bnn), ''.join(frac(Q['upazila'][k]['ok'][j], Q['upazila'][k]['avail'], True) for k, *_ in OPN))
    avail = '<tr><td>%s</td>%s</tr>' % (T('Upazilas with service', 'সেবা আছে এমন উপজেলা'), ''.join('<td>%s</td>' % T(str(Q['upazila'][k]['avail']), bn(Q['upazila'][k]['avail'])) for k, *_ in OPN))
    bts = '<tr><td>%s</td>%s</tr>' % (T('Total sites (BTS, eNodeB)', 'মোট সাইট (BTS, eNodeB)'), ''.join('<td>%s</td>' % T(format(Q['bts'][k], ','), bn(format(Q['bts'][k], ','))) for k, *_ in OPN))
    # non-compliant upazilas
    nc = ''
    for k, en, bnn, _ in OPN[:3]:
        L = Q['noncompliant'][k]
        items = ''.join('<li><b>%s</b>, %s <small>(%s)</small></li>' % (x['upazila'], x['district'], ', '.join(T(KP[KN[kk]][0], KP[KN[kk]][1]) for kk in x['kpis'])) for x in L)
        nc += '<div class="card"><h3 style="display:flex;align-items:center;gap:8px">%s%s <span class="sub" style="font-weight:400">%s</span></h3><ul class="nclist">%s</ul></div>' % (
            B.badge(OPS[k]), T(en, bnn), T('%d upazilas' % len(L), '%sটি উপজেলা' % bn(len(L))), items)
    with open(os.path.join(B.OUT, 'qos-2026-08-noncompliant-upazilas.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['operator', 'district', 'upazila', 'kpis_not_met_btrc_monitored'])
        for k, *_ in OPN[:3]:
            for x in Q['noncompliant'][k]: w.writerow([k, x['district'], x['upazila'], '; '.join(KP[KN[kk]][0] for kk in x['kpis'])])
    dl = ''.join('<a class="btn" href="/bd-telecom/docs/qos-2026-08/%s.pdf" download>%s%s</a>' % (f, ic('download'), T(e, b)) for _, e, b, f in OPN)
    gpm = Q['upazila']['gp']['ok'][4]; gpa = Q['upazila']['gp']['avail']
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 10px">%s</p><div class="card"><div class="tablewrap"><table class="qos"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="grid2"><div class="card"><h3>%s</h3><p class="sub">%s</p><div class="tablewrap"><table class="qos"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div>
<div class="card"><h3>%s</h3><p class="sub">%s</p><div class="tablewrap"><table class="qos"><thead><tr>%s</tr></thead><tbody>%s%s%s</tbody></table></div></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 10px">%s</p><div class="grid3">%s</div>
<div class="btns" style="margin:12px 0 0"><a class="btn primary" href="/bd-telecom/qos-2026-08-noncompliant-upazilas.csv" download>%s%s</a></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="btns">%s</div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Mobile network quality (QoS) in Bangladesh, %s' % mlab(M), 'বাংলাদেশে মোবাইল নেটওয়ার্কের মান (QoS), %s' % mlab(M, 'bn')),
        T('Did each operator meet BTRC’s quality benchmarks for calls, 4G data and SMS, nationally, in all 64 districts and in every upazila? From BTRC’s monthly QoS reports.',
          'প্রতিটি অপারেটর কল, 4G ডেটা আর SMS এ BTRC এর মানদণ্ড পূরণ করেছে কিনা, দেশজুড়ে, ৬৪ জেলায় আর প্রতিটি উপজেলায়। BTRC এর মাসিক QoS প্রতিবেদন থেকে।'),
        T('BTRC, published 30 Sep 2026', 'BTRC, প্রকাশ ৩০ সেপ্টে ২০২৬'),
        ''.join('<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % x for x in [
            (T('National benchmarks met', 'জাতীয় মানদণ্ড পূরণ'), T('12 / 12', '১২ / ১২'), T('Grameenphone, Robi and Banglalink, BTRC-monitored', 'গ্রামীণফোন, রবি আর বাংলালিংক, BTRC যাচাইকৃত'), T(mlab(M) + ' · BTRC', mlab(M, 'bn') + ' · BTRC')),
            (T('Robi upazilas missing a benchmark', 'রবির যে উপজেলায় মানদণ্ড পূরণ হয়নি'), T(str(len(Q['noncompliant']['robi'])), bn(len(Q['noncompliant']['robi']))), T('all on 2G call setup success', 'সবগুলোতে 2G কল সেটআপ সাফল্য'), T(mlab(M) + ' · BTRC', mlab(M, 'bn') + ' · BTRC')),
            (T('Grameenphone upazilas missing a benchmark', 'গ্রামীণফোনের যে উপজেলায় মানদণ্ড পূরণ হয়নি'), T(str(len(Q['noncompliant']['gp'])), bn(len(Q['noncompliant']['gp']))), T('mostly VoLTE + GSM call setup in the hill tracts and Chattogram', 'বেশিরভাগ পার্বত্য অঞ্চল আর চট্টগ্রামে VoLTE + GSM কল সেটআপ'), T(mlab(M) + ' · BTRC', mlab(M, 'bn') + ' · BTRC')),
            (T('Teletalk', 'টেলিটক'), '<span style="font-size:1.35rem">%s</span>' % T('Not assessed', 'যাচাই হয়নি'), T('BTRC got incomplete raw files from Teletalk', 'টেলিটক থেকে BTRC অসম্পূর্ণ ফাইল পেয়েছে'), T(mlab(M) + ' · BTRC', mlab(M, 'bn') + ' · BTRC'))]),
        ic('info'), T('BTRC checks each operator’s network data against the benchmarks in its <a href="/bd-telecom/guides/qos-directives-2025/">2025 QoS directives</a>. The reports show whether each benchmark was met, not the measured values. District and upazila benchmarks are looser than the national ones (for example, a 2G call drop rate of 1.5%% or less instead of 1%%).'.replace('%%', '%'),
                      'BTRC প্রতিটি অপারেটরের নেটওয়ার্ক ডেটা <a href="/bd-telecom/guides/qos-directives-2025/">২০২৫ এর QoS নির্দেশিকার</a> মানদণ্ডের সাথে মিলিয়ে দেখে। প্রতিবেদনে শুধু মানদণ্ড পূরণ হয়েছে কিনা তা দেখানো হয়, মাপা সংখ্যা নয়। জেলা আর উপজেলার মানদণ্ড জাতীয়টির চেয়ে একটু শিথিল (যেমন 2G কল ড্রপ ১% এর বদলে ১.৫% বা কম)।'),
        T('National benchmarks', 'জাতীয় মানদণ্ড'), T('BTRC-monitored result for each operator', 'প্রতিটি অপারেটরের BTRC যাচাইকৃত ফল'), th, trs,
        T('Districts meeting the benchmark', 'মানদণ্ড পূরণ করা জেলা'), T('Out of 64 districts, BTRC-monitored. Teletalk figures are its own declaration.', '৬৪ জেলার মধ্যে, BTRC যাচাইকৃত। টেলিটকের সংখ্যা তাদের নিজেদের দাবি।'), dth, dtr,
        T('Upazilas meeting the benchmark', 'মানদণ্ড পূরণ করা উপজেলা'), T('Out of upazilas where the operator has service, BTRC-monitored. Teletalk figures are its own declaration.', 'অপারেটরের সেবা আছে এমন উপজেলার মধ্যে, BTRC যাচাইকৃত। টেলিটকের সংখ্যা তাদের নিজেদের দাবি।'), dth, utr, avail, bts,
        T('Upazilas where a benchmark was missed', 'যে উপজেলায় মানদণ্ড পূরণ হয়নি'), T('BTRC-monitored results. Teletalk is left out because BTRC could not assess it.', 'BTRC যাচাইকৃত ফল। টেলিটক বাদ, কারণ BTRC যাচাই করতে পারেনি।'), nc,
        ic('download'), T('Download list (CSV)', 'তালিকা ডাউনলোড (CSV)'), T('BTRC reports by operator (PDF)', 'অপারেটরভিত্তিক BTRC প্রতিবেদন (PDF)'), dl,
        ic('alert'), T('For Teletalk, BTRC says it received incomplete raw files, so it could not assess any benchmark. By Teletalk’s own figures it missed the national 4G connection (RRC) and 4G data session benchmarks, met 4G connection success in only 12 of 64 districts and 129 of 544 upazilas, and declared nothing for VoLTE, SMS or tower downtime. District names in the upazila list follow BTRC’s spelling.',
                      'টেলিটকের ক্ষেত্রে BTRC বলছে তারা অসম্পূর্ণ ফাইল পেয়েছে, তাই কোনো মানদণ্ড যাচাই করতে পারেনি। টেলিটকের নিজের হিসাবেই তারা জাতীয় পর্যায়ে 4G সংযোগ (RRC) আর 4G ডেটা সেশনের মানদণ্ড পূরণ করেনি, 4G সংযোগ সাফল্যে ৬৪ জেলার মাত্র ১২টি আর ৫৪৪ উপজেলার ১২৯টিতে মানদণ্ড পূরণ করেছে, আর VoLTE, SMS বা টাওয়ার বন্ধ থাকার কোনো তথ্য দেয়নি। উপজেলা তালিকায় জেলার নাম BTRC এর বানান অনুযায়ী।'))
    write('kpi/qos/index.html', page('kpi/qos/', 'kpi', 'Mobile network quality (QoS) in Bangladesh, %s: GP, Robi, Banglalink, Teletalk | BD Telecom' % mlab(M), 'বাংলাদেশে মোবাইল নেটওয়ার্কের মান (QoS) | BD Telecom',
          'BTRC QoS results for %s: which operators met the call, 4G and SMS benchmarks nationally, by district and by upazila, and the upazilas where they fell short.' % mlab(M), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
    return Q
