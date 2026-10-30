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
        T('One correction: for March 2026 BTRC\\u2019s table shows Grameenphone at 84.84 million, but the four operators add up to BTRC\\u2019s total of 186.06 million only with 84.48. This page uses 84.48 and marks the cell.',
          'একটি সংশোধন: মার্চ ২০২৬ এ BTRC এর সারণিতে গ্রামীণফোন ৮৪.৮৪ মিলিয়ন, কিন্তু চার অপারেটরের যোগফল BTRC এর মোট ১৮৬.০৬ মিলিয়নের সাথে মেলে কেবল ৮৪.৪৮ হলে। এই পেজে ৮৪.৪৮ ব্যবহার করা হয়েছে, আর ঘরটি চিহ্নিত।'))
    write('kpi/mobile-subscribers/index.html', page('kpi/mobile-subscribers/', 'kpi', 'Mobile subscribers in Bangladesh by operator, 2021 to 2026 (BTRC) | BD Telecom', 'বাংলাদেশে অপারেটরভিত্তিক মোবাইল গ্রাহক, ২০২১-২০২৬ | BD Telecom',
          'Monthly BTRC mobile subscriber numbers for Grameenphone, Robi, Banglalink and Teletalk from %s to %s: %s million in total. Charts, table and CSV.' % (mlab(F['month']), mlab(L['month']), num(L['total'])), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI')]))
