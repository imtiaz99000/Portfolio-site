"""Five-year mobile subscriber history from BTRC's Mobile Subscribers table."""
import json, os, csv
import tele
def build_subhist(B):
    T, bn, ic, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num, B.sgn
    rows = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-mobile-subscribers.json')))
    rows.sort(key=lambda r: r['month'])
    for r in rows:
        if r['month'] == '2026-03': r['gp'] = 84.48; r['flag'] = True
        r['grameenphone'], r['robi_'], r['banglalink'], r['teletalk'] = r['gp'], r['robi'], r['bl'], r['tt']
    with open(os.path.join(B.OUT, 'mobile-subscribers-btrc-2021-2026.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['month', 'grameenphone_m', 'robi_m', 'banglalink_m', 'teletalk_m', 'total_m', 'note'])
        for r in rows: w.writerow([r['month'], r['gp'], r['robi'], r['bl'], r['tt'], r['total'], 'BTRC table shows GP 84.84; 84.48 matches BTRC total' if r.get('flag') else ''])
    F, L = rows[0], rows[-1]
    hi = max(rows, key=lambda r: r['total']); lo = min(rows, key=lambda r: r['total'])
    def tile(k, en, bnn):
        v0, v1 = F[k], L[k]; p = (v1 - v0) / v0 * 100
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(num(v1) + '<small>m</small>', num(v1, 2, 'bn') + '<small>মি.</small>'),
            T('<b class="%s">%s m</b> since %s (%s%%)' % ('up' if v1 > v0 else 'down', sgn(v1 - v0), mlab(F['month'], 'en', True), sgn(p, 1)),
              '%s থেকে <b class="%s">%s মি.</b> (%s%%)' % (mlab(F['month'], 'bn', True), 'up' if v1 > v0 else 'down', sgn(v1 - v0, 2, 'bn'), sgn(p, 1, 'bn'))),
            T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    tiles = tile('total', 'All mobile subscriptions', 'মোট মোবাইল সাবস্ক্রিপশন') + ''.join(tile(o['k'] if o['k'] != 'robi' else 'robi_', o['en'], o['bn']) for o in B.OPS)
    c1 = tele.chart(B, rows, [('total', 'Total', 'মোট', '--total')], 175, 200, 5, 'm', h=260)
    c2 = tele.chart(B, rows, [('gp', 'Grameenphone', 'গ্রামীণফোন', '--gp'), ('robi', 'Robi', 'রবি', '--robi'), ('bl', 'Banglalink', 'বাংলালিংক', '--bl'), ('tt', 'Teletalk', 'টেলিটক', '--tt')], 0, 100, 20, 'm', h=300, cls='scroll')
    def c(v, fl=False):
        s = '%.2f' % v; return '<td%s>%s</td>' % (' class="flag" title="BTRC table shows 84.84"' if fl else '', T(s, bn(s)))
    trs = ''.join('<tr><td>%s</td>%s%s%s%s%s</tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), c(r['gp'], r.get('flag')), c(r['robi']), c(r['bl']), c(r['tt']), c(r['total'])) for r in reversed(rows))
    th = '<th>%s</th>' % T('Month', 'মাস') + ''.join('<th>%s%s</th>' % (B.badge(o), T(o['en'], o['bn'])) for o in B.OPS) + '<th>%s</th>' % T('Total', 'মোট')
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/mobile-subscribers-btrc-2021-2026.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/btrc-mobile-subscribers-2026-09.pdf" download>%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Mobile subscribers in Bangladesh, 2021 to 2026', 'বাংলাদেশে মোবাইল গ্রাহক, ২০২১ থেকে ২০২৬'),
        T('Active mobile subscriptions for each operator, every month from %s to %s, straight from BTRC.' % (mlab(F['month']), mlab(L['month'])),
          '%s থেকে %s পর্যন্ত প্রতি মাসে প্রতিটি অপারেটরের সক্রিয় মোবাইল সাবস্ক্রিপশন, সরাসরি BTRC থেকে।' % (mlab(F['month'], 'bn'), mlab(L['month'], 'bn'))),
        T('BTRC table updated 23 Sep 2026', 'BTRC সারণি হালনাগাদ ২৩ সেপ্টে ২০২৬'), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC table (PDF)', 'BTRC এর সারণি (PDF)'),
        ic('info'), T('BTRC counts a subscriber as a biometrically verified subscription with any activity (voice, data, SMS and so on) at least once in the preceding 90 days.',
                      'BTRC এর হিসাবে গ্রাহক মানে বায়োমেট্রিক যাচাই করা সাবস্ক্রিপশন, যেটিতে আগের ৯০ দিনে অন্তত একবার কোনো ব্যবহার (ভয়েস, ডেটা, SMS ইত্যাদি) হয়েছে।'),
        T('All mobile subscriptions', 'মোট মোবাইল সাবস্ক্রিপশন'),
        T('Millions. Peak %s in %s; low %s in %s.' % (num(hi['total']), mlab(hi['month']), num(lo['total']), mlab(lo['month'])),
          'মিলিয়ন। সর্বোচ্চ %s এ %s, সর্বনিম্ন %s এ %s।' % (mlab(hi['month'], 'bn'), num(hi['total'], 2, 'bn'), mlab(lo['month'], 'bn'), num(lo['total'], 2, 'bn'))), c1,
        T('By operator', 'অপারেটর অনুযায়ী'), T('Millions', 'মিলিয়ন'), c2,
        T('Month by month', 'মাসভিত্তিক'), th, trs, ic('alert'),
        T('One correction: for March 2026 BTRC’s table shows Grameenphone at 84.84 million, but the four operators add up to BTRC’s total of 186.06 million only with 84.48. This page uses 84.48 and marks the cell.',
          'একটি সংশোধন: মার্চ ২০২৬ এ BTRC এর সারণিতে গ্রামীণফোন ৮৪.৮৪ মিলিয়ন, কিন্তু চার অপারেটরের যোগফল BTRC এর মোট ১৮৬.০৬ মিলিয়নের সাথে মেলে কেবল ৮৪.৪৮ হলে। এই পেজে ৮৪.৪৮ ব্যবহার করা হয়েছে, আর ঘরটি চিহ্নিত।'))
    write('kpi/mobile-subscribers/index.html', page('kpi/mobile-subscribers/', 'kpi', 'Mobile subscribers in Bangladesh by operator, 2021 to 2026 (BTRC) | BD Telecom', 'বাংলাদেশে অপারেটরভিত্তিক মোবাইল গ্রাহক, ২০২১-২০২৬ | BD Telecom',
          'Monthly BTRC mobile subscriber numbers for Grameenphone, Robi, Banglalink and Teletalk from %s to %s: %s million in total. Charts, table and CSV.' % (mlab(F['month']), mlab(L['month']), num(L['total'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))

def build_inethist(B):
    T, bn, ic, page, write, mlab, num, sgn = B.T, B.bn, B.ic, B.page, B.write, B.mlab, B.num, B.sgn
    rows = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-internet-subscribers.json'))); rows.sort(key=lambda r: r['month'])
    with open(os.path.join(B.OUT, 'internet-subscribers-btrc-2021-2026.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['month', 'mobile_internet_m', 'isp_pstn_m', 'total_m', 'note'])
        for r in rows: w.writerow([r['month'], r['mobile'], r['fixed'], r['total'], 'BTRC total does not equal mobile + ISP/PSTN (142.70)' if r['month'] == '2024-06' else ''])
    F, L = rows[0], rows[-1]; hi = max(rows, key=lambda r: r['mobile'])
    def tile(k, en, bnn):
        v0, v1 = F[k], L[k]; p = (v1 - v0) / v0 * 100
        return '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T(en, bnn), T(num(v1) + '<small>m</small>', num(v1, 2, 'bn') + '<small>মি.</small>'),
            T('<b class="%s">%s m</b> since %s (%s%%)' % ('up' if v1 > v0 else 'down', sgn(v1 - v0), mlab(F['month'], 'en', True), sgn(p, 1)),
              '%s থেকে <b class="%s">%s মি.</b> (%s%%)' % (mlab(F['month'], 'bn', True), 'up' if v1 > v0 else 'down', sgn(v1 - v0, 2, 'bn'), sgn(p, 1, 'bn'))),
            T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    sh = L['fixed'] / L['total'] * 100; sh0 = F['fixed'] / F['total'] * 100
    tiles = tile('total', 'All internet subscriptions', 'মোট ইন্টারনেট সাবস্ক্রিপশন') + tile('mobile', 'Mobile internet', 'মোবাইল ইন্টারনেট') + tile('fixed', 'ISP and PSTN (fixed)', 'ISP ও PSTN (ফিক্সড)') + \
        '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div><div class="meta">%s</div></div>' % (
            T('Fixed share of internet', 'ইন্টারনেটে ফিক্সডের ভাগ'), T('%.1f<small>%%</small>' % sh, bn('%.1f' % sh) + '<small>%</small>'),
            T('was %.1f%% in %s' % (sh0, mlab(F['month'], 'en', True)), '%s এ ছিল %s%%' % (mlab(F['month'], 'bn', True), bn('%.1f' % sh0))), T('%s · BTRC' % mlab(L['month']), '%s · BTRC' % mlab(L['month'], 'bn')))
    c1 = tele.chart(B, rows, [('mobile', 'Mobile', 'মোবাইল', '--gp'), ('total', 'Total', 'মোট', '--total')], 100, 150, 10, 'm', h=280, cls='scroll')
    c2 = tele.chart(B, rows, [('fixed', 'ISP and PSTN', 'ISP ও PSTN', '--tt')], 9, 16, 1, 'm', h=240)
    def c(v, fl=False):
        s = '%.2f' % v; return '<td%s>%s</td>' % (' class="flag"' if fl else '', T(s, bn(s)))
    trs = ''.join('<tr><td>%s</td>%s%s%s</tr>' % (T(mlab(r['month']), mlab(r['month'], 'bn')), c(r['mobile']), c(r['fixed']), c(r['total'], r['month'] == '2024-06')) for r in reversed(rows))
    th = ''.join('<th>%s</th>' % T(a, b) for a, b in [('Month', 'মাস'), ('Mobile (m)', 'মোবাইল (মি.)'), ('ISP and PSTN (m)', 'ISP ও PSTN (মি.)'), ('Total (m)', 'মোট (মি.)')])
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="tiles kpis">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/internet-subscribers-btrc-2021-2026.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/btrc-internet-subscribers-2026-09.pdf" download>%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Internet subscribers in Bangladesh, 2021 to 2026', 'বাংলাদেশে ইন্টারনেট গ্রাহক, ২০২১ থেকে ২০২৬'),
        T('Mobile internet and fixed (ISP and PSTN) internet subscriptions, every month from %s to %s, from BTRC.' % (mlab(F['month']), mlab(L['month'])),
          '%s থেকে %s পর্যন্ত প্রতি মাসে মোবাইল ইন্টারনেট আর ফিক্সড (ISP ও PSTN) ইন্টারনেট সাবস্ক্রিপশন, BTRC থেকে।' % (mlab(F['month'], 'bn'), mlab(L['month'], 'bn'))),
        T('BTRC table updated 23 Sep 2026', 'BTRC সারণি হালনাগাদ ২৩ সেপ্টে ২০২৬'), tiles,
        ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC table (PDF)', 'BTRC এর সারণি (PDF)'),
        ic('info'), T('BTRC counts an internet subscriber as a subscription that accessed the internet at least once in the preceding 90 days. ISP and PSTN figures come from BTRC’s market analysis and data from almost all ISPs, and are updated quarterly, which is why they stay flat for three months at a time.',
                      'BTRC এর হিসাবে ইন্টারনেট গ্রাহক মানে আগের ৯০ দিনে অন্তত একবার ইন্টারনেট ব্যবহার করা সাবস্ক্রিপশন। ISP ও PSTN এর সংখ্যা BTRC প্রায় সব ISP এর তথ্য আর বাজার বিশ্লেষণ থেকে হিসাব করে, আর তিন মাস পরপর হালনাগাদ করে। তাই এই সংখ্যা তিন মাস একই থাকে।'),
        T('Mobile and total internet', 'মোবাইল ও মোট ইন্টারনেট'), T('Millions. Mobile internet peaked at %s in %s.' % (num(hi['mobile']), mlab(hi['month'])), 'মিলিয়ন। মোবাইল ইন্টারনেট সর্বোচ্চ ছিল %s এ %s।' % (mlab(hi['month'], 'bn'), num(hi['mobile'], 2, 'bn'))), c1,
        T('ISP and PSTN (fixed) internet', 'ISP ও PSTN (ফিক্সড) ইন্টারনেট'), T('Millions, updated quarterly', 'মিলিয়ন, তিন মাস পরপর হালনাগাদ'), c2,
        T('Month by month', 'মাসভিত্তিক'), th, trs, ic('alert'),
        T('For June 2024 BTRC’s table gives a total of 142.17 million, but mobile (129.17) plus ISP and PSTN (13.53) makes 142.70. The figures are shown as BTRC publishes them and the cell is marked.',
          'জুন ২০২৪ এ BTRC এর সারণিতে মোট ১৪২.১৭ মিলিয়ন, কিন্তু মোবাইল (১২৯.১৭) আর ISP ও PSTN (১৩.৫৩) যোগ করলে হয় ১৪২.৭০। সংখ্যাগুলো BTRC যেভাবে দিয়েছে সেভাবেই দেখানো, আর ঘরটি চিহ্নিত।'))
    write('kpi/internet-subscribers/index.html', page('kpi/internet-subscribers/', 'kpi', 'Internet subscribers in Bangladesh, mobile and ISP, 2021 to 2026 (BTRC) | BD Telecom', 'বাংলাদেশে ইন্টারনেট গ্রাহক, ২০২১-২০২৬ | BD Telecom',
          'Monthly BTRC internet subscriber numbers for Bangladesh from %s to %s: %s million in total, %s million mobile and %s million ISP and PSTN. Charts, table and CSV.' % (mlab(F['month']), mlab(L['month']), num(L['total']), num(L['mobile']), num(L['fixed'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
