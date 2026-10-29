"""Licensee directory pages for BD Telecom. Called from build.py."""
import json, os, shutil, html, collections, datetime
esc = html.escape
DIV_BN = {'Dhaka':'ঢাকা','Chattogram':'চট্টগ্রাম','Khulna':'খুলনা','Rajshahi':'রাজশাহী','Mymensingh':'ময়মনসিংহ','Sylhet':'সিলেট','Rangpur':'রংপুর','Barishal':'বরিশাল'}


def build_vts(B):
    import sys, csv
    sys.path.insert(0, os.path.join(B.HERE, 'data_src')); import vts
    T, bn, ic, page, write = B.T, B.bn, B.ic, B.page, B.write
    P = lambda x: datetime.datetime.strptime(x, '%d-%b-%y').date()
    TODAY = datetime.date(2026, 10, 30)
    BNM = ['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টে','অক্টো','নভে','ডিসে']
    fd = lambda d: (d.strftime('%-d %b %Y'), '%s %s %s' % (bn(d.day), BNM[d.month-1], bn(d.year)))
    with open(os.path.join(B.OUT, 'vts-licensees.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['type', 'sl', 'name', 'address', 'licence_number', 'from', 'to'])
        for kind, rows in (('VTS licence', vts.VTS), ('VTS service approval', vts.APPROVAL)):
            for r in rows: w.writerow([kind, r[0], r[1], r[2], r[3], P(r[4]).isoformat(), P(r[5]).isoformat()])
    def table_rows(rows):
        out = ''
        for sl, nm, ad, no, a, b in rows:
            ended = P(b) < TODAY
            f1, t1 = fd(P(a)), fd(P(b))
            out += '<tr data-st="%s"><td>%d</td><td><b style="color:var(--ink)">%s</b><br><small>%s</small></td><td><small>%s</small></td><td>%s</td><td>%s%s</td></tr>' % (
                'ended' if ended else 'ok', sl, esc(nm), esc(ad), esc(no), T(*f1), T(*t1), ' <span class="pill warn">%s</span>' % T('ended', 'শেষ') if ended else '')
        return out
    ended = sum(P(r[5]) < TODAY for r in vts.VTS); n = len(vts.VTS)
    head = '<thead><tr><th>#</th><th>%s</th><th>%s</th><th>%s</th><th>%s</th></tr></thead>' % (T('Licensee', 'লাইসেন্সধারী'), T('Licence number', 'লাইসেন্স নম্বর'), T('From', 'শুরু'), T('To', 'শেষ'))
    tiles = ''.join('<div class="tile"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div></div>' % x for x in [
        (T('VTS licensees', 'VTS লাইসেন্সধারী'), T(str(n), bn(n)), T('companies on BTRC\u2019s list', 'BTRC এর তালিকায়')),
        (T('Term still running', 'মেয়াদ চলছে'), T(str(n - ended), bn(n - ended)), T('by the dates on the list, at October 2026', 'তালিকার তারিখ অনুযায়ী, অক্টোবর ২০২৬ এ')),
        (T('Term already ended', 'মেয়াদ শেষ'), T(str(ended), bn(ended)), T('end date before October 2026', 'অক্টোবর ২০২৬ এর আগে শেষ')),
        (T('Mobile operators approved', 'অনুমোদিত মোবাইল অপারেটর'), T('3', '৩'), T('GP, Robi, Banglalink', 'জিপি, রবি, বাংলালিংক'))])
    POL = '/bd-telecom/guides/telecom-network-licensing-policy-2025/'
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header>
<div class="kv tiles">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/vts-licensees.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/vts-licensees-2025.pdf" download>%s%s</a></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="dir">%s<tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 10px">%s</p><div class="card"><div class="tablewrap"><table class="dir">%s<tbody>%s</tbody></table></div></div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>''' % (
        T('Vehicle Tracking Service (VTS) licensees in Bangladesh', 'বাংলাদেশের ভেহিকেল ট্র্যাকিং সার্ভিস (VTS) লাইসেন্সধারী'),
        T('The %d companies licensed by BTRC to provide GPS vehicle tracking, and the mobile operators with VTS service approval, with licence numbers and terms.' % n,
          'GPS দিয়ে গাড়ি ট্র্যাকিং সেবা দিতে BTRC থেকে লাইসেন্স পাওয়া %sটি প্রতিষ্ঠান, আর VTS সার্ভিস অনুমোদন পাওয়া মোবাইল অপারেটর, লাইসেন্স নম্বর ও মেয়াদ সহ।' % bn(n)),
        tiles, ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC list (PDF)', 'BTRC এর তালিকা (PDF)'),
        ic('info'), T('VTS will not need a licence for long. Under the <a href="%s">Telecommunications Network and Licensing Policy 2025</a>, the VTS licence is deregulated when each current term ends, and mobile operators are to help other companies provide the service (clause 9.1 and Table 2).' % POL,
                      'VTS এর জন্য আর বেশিদিন লাইসেন্স লাগবে না। <a href="%s">টেলিযোগাযোগ নেটওয়ার্ক ও লাইসেন্সিং নীতিমালা ২০২৫</a> অনুযায়ী বর্তমান মেয়াদ শেষ হলে VTS লাইসেন্স ডিরেগুলেটেড হবে, আর মোবাইল অপারেটররা অন্য প্রতিষ্ঠানকে এই সেবা দিতে সহায়তা করবে (ধারা ৯.১ ও টেবিল ২)।' % POL),
        T('VTS licence', 'VTS লাইসেন্স'), head, table_rows(vts.VTS),
        T('VTS service approval (mobile operators)', 'VTS সার্ভিস অনুমোদন (মোবাইল অপারেটর)'), T('Mobile operators provide VTS under a service approval rather than a separate licence.', 'মোবাইল অপারেটররা আলাদা লাইসেন্স নয়, সার্ভিস অনুমোদনের অধীনে VTS দেয়।'), head, table_rows(vts.APPROVAL),
        ic('alert'), T('BTRC\u2019s list is undated. The latest start date on it is 19 March 2025. "Ended" means the end date on the list is before October 2026; a renewal may have been issued since. Names and addresses are shown as BTRC lists them, without email addresses.',
                       'BTRC এর তালিকায় কোনো তারিখ নেই। এতে সর্বশেষ শুরুর তারিখ ১৯ মার্চ ২০২৫। "শেষ" মানে তালিকার শেষ তারিখ অক্টোবর ২০২৬ এর আগে; এরপর নবায়ন হয়ে থাকতে পারে। নাম আর ঠিকানা BTRC এর তালিকা অনুযায়ী, ইমেইল ছাড়া।'))
    write('licensees/vts/index.html', page('licensees/vts/', 'lic', 'Vehicle Tracking Service (VTS) licensees in Bangladesh | BD Telecom', 'বাংলাদেশের VTS লাইসেন্সধারী | BD Telecom',
          'All %d BTRC-licensed vehicle tracking (VTS) companies in Bangladesh, plus GP, Robi and Banglalink service approvals, with licence numbers and terms.' % n, body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/licensees/', 'Licensees', 'লাইসেন্সধারী')]))
    return n

def build_licensees(B):
    T, bn, ic, tint, page, write = B.T, B.bn, B.ic, B.tint, B.page, B.write
    rows = json.load(open(os.path.join(B.HERE, 'data_src', 'isp-divisional-2024-12-23.json'), encoding='utf8'))
    shutil.copy(os.path.join(B.HERE, 'data_src', 'isp-divisional-2024-12-23.csv'), os.path.join(B.OUT, 'isp-divisional-2024-12-23.csv'))
    n = len(rows); past = sum(1 for r in rows if r['past_at_list']); pp = round(past / n * 100)
    P = lambda s: datetime.datetime.strptime(s, '%d-%b-%Y').date()
    fut = sum(1 for r in rows if P(r['validity']) >= datetime.date(2026, 10, 30))
    c = collections.Counter(r['division'] for r in rows); cp = collections.Counter(r['division'] for r in rows if r['past_at_list'])
    divs = [d for d, _ in c.most_common()]
    # bar chart: licensees per division, darker part = validity date already past on the list date
    mx = max(c.values())
    svg = ['<div class="hbars" role="img" aria-label="ISP divisional licensees by division">']
    for d in divs:
        t = c[d]; p = cp[d]
        svg.append('<div class="hb"><span class="hl">%s</span><span class="ht"><span class="hf" style="width:%.1f%%" title="%s: %d licensees"><span class="hp" style="width:%.1f%%"></span></span></span><span class="hv">%s</span></div>' % (
            T(d, DIV_BN[d]), t / mx * 100, d, t, p / t * 100, T('<b>%d</b> <span>(%d past)</span>' % (t, p), '<b>%s</b> <span>(%s পেরিয়েছে)</span>' % (bn(t), bn(p)))))
    svg.append('</div>')
    legend = ('<p class="sub" style="display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 0"><span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--accent);vertical-align:-1px;margin-right:6px"></span>%s</span>'
              '<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:color-mix(in srgb,var(--accent) 30%%,var(--surface));vertical-align:-1px;margin-right:6px"></span>%s</span></p>') % (
        T('Validity date already past on 23 Dec 2024', '২৩ ডিসে ২০২৪ এ বৈধতার তারিখ পেরিয়ে গেছে'), T('Validity date still ahead', 'বৈধতার তারিখ সামনে'))
    tiles = ''.join('<div class="tile"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div></div>' % x for x in [
        (T('ISP (Divisional) licensees', 'ISP (বিভাগীয়) লাইসেন্সধারী'), T(str(n), bn(n)), T('on BTRC’s list of 23 Dec 2024', 'BTRC এর ২৩ ডিসে ২০২৪ এর তালিকায়')),
        (T('In Dhaka Division', 'ঢাকা বিভাগে'), T(str(c['Dhaka']), bn(c['Dhaka'])), T('%d%% of the total' % round(c['Dhaka'] / n * 100), 'মোটের %s%%' % bn(round(c['Dhaka'] / n * 100)))),
        (T('Validity past on the list date', 'তালিকার দিনে বৈধতা পেরিয়েছে'), T('%d<small>%%</small>' % pp, '%s<small>%%</small>' % bn(pp)), T('%d of %d licensees' % (past, n), '%s এর মধ্যে %s টি' % (bn(n), bn(past)))),
        (T('Valid beyond October 2026', 'অক্টোবর ২০২৬ এর পরও বৈধ'), T(str(fut), bn(fut)), T('by the dates on the list', 'তালিকার তারিখ অনুযায়ী'))])
    opts = ''.join('<option value="%s">%s</option>' % (d, d) for d in sorted(c))
    trs = ''
    for r in rows:
        st = 'past' if r['past_at_list'] else 'ok'
        trs += ('<tr data-div="%s" data-st="%s"><td>%d</td><td><b style="color:var(--ink)">%s</b><br><small>%s</small></td><td>%s</td><td><small>%s</small></td><td>%s%s</td></tr>' % (
            r['division'], st, r['sl'], esc(r['name']), esc(r['addr']), T(r['division'], DIV_BN[r['division']]), esc(r['num']), esc(r['validity']),
            ' <span class="pill warn">%s</span>' % T('past', 'পেরিয়েছে') if st == 'past' else ''))
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header>
<div class="kv tiles">%s</div>
<div class="btns" style="margin:4px 0 14px"><a class="btn primary" href="/bd-telecom/isp-divisional-2024-12-23.csv" download>%s%s</a><a class="btn" href="/bd-telecom/docs/isp-divisional-licensees-2024-12.pdf" download>%s%s</a></div>
<section class="block"><div class="card"><h3>%s</h3><p class="sub">%s</p>%s%s</div></section>
<div class="callout warn"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div>
<div class="filters"><input id="q" type="search" placeholder="Search name, address or licence number" aria-label="Search licensees"><select id="dv" aria-label="Division"><option value="">%s</option>%s</select><select id="st" aria-label="Status"><option value="">%s</option><option value="ok">%s</option><option value="past">%s</option></select><span id="cnt" class="sub"></span></div>
<div class="card"><div class="tablewrap"><table class="dir"><thead><tr><th>#</th><th>%s</th><th>%s</th><th>%s</th><th>%s</th></tr></thead><tbody id="tb">%s</tbody></table></div></div></section>
<p class="soon">%s</p>
<script>(function(){var q=document.getElementById('q'),dv=document.getElementById('dv'),st=document.getElementById('st'),cnt=document.getElementById('cnt'),rs=[].slice.call(document.querySelectorAll('#tb tr'));
var ph={en:'Search name, address or licence number',bn:'নাম, ঠিকানা বা লাইসেন্স নম্বর দিয়ে খুঁজুন'};
function f(){var t=q.value.trim().toLowerCase(),d=dv.value,s=st.value,k=0;rs.forEach(function(r){var on=(!d||r.dataset.div===d)&&(!s||r.dataset.st===s)&&(!t||r.textContent.toLowerCase().indexOf(t)>-1);r.hidden=!on;if(on)k++});
var bnl=document.documentElement.lang==='bn';cnt.textContent=bnl?(String(k).replace(/[0-9]/g,function(x){return '০১২৩৪৫৬৭৮৯'[x]})+'টি দেখানো হচ্ছে'):(k+' shown');q.placeholder=bnl?ph.bn:ph.en}
[q,dv,st].forEach(function(e){e.addEventListener('input',f)});new MutationObserver(f).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});f()})()</script>''' % (
        T('ISP (Divisional) licensees in Bangladesh', 'বাংলাদেশের ISP (বিভাগীয়) লাইসেন্সধারী'),
        T('All %d internet service providers holding a divisional ISP licence on BTRC’s list of 23 December 2024. Search by name, area or licence number.' % n,
          'BTRC এর ২৩ ডিসেম্বর ২০২৪ এর তালিকায় বিভাগীয় ISP লাইসেন্সধারী সব %sটি ইন্টারনেট সেবাদাতা। নাম, এলাকা বা লাইসেন্স নম্বর দিয়ে খুঁজুন।' % bn(n)),
        tiles, ic('download'), T('Download CSV', 'CSV ডাউনলোড'), ic('download'), T('BTRC list (PDF)', 'BTRC এর তালিকা (PDF)'),
        T('Licensees by division', 'বিভাগ অনুযায়ী লাইসেন্সধারী'), T('Number of divisional ISP licensees in each division', 'প্রতি বিভাগে বিভাগীয় ISP লাইসেন্সধারীর সংখ্যা'), ''.join(svg), legend,
        ic('alert'), T('"Validity past" means the licence validity date on BTRC’s list was earlier than the list date, 23 December 2024. The list does not say whether a renewal was pending, so it does not by itself mean a licence was cancelled. Division and address are shown exactly as BTRC lists them.',
                      '"বৈধতা পেরিয়েছে" মানে BTRC এর তালিকায় লাইসেন্সের বৈধতার তারিখ তালিকার তারিখ, ২৩ ডিসেম্বর ২০২৪ এর আগে। নবায়ন প্রক্রিয়াধীন ছিল কিনা তালিকায় বলা নেই, তাই এতে লাইসেন্স বাতিল হয়েছে বোঝায় না। বিভাগ আর ঠিকানা BTRC এর তালিকা অনুযায়ীই দেখানো হয়েছে।'),
        T('Directory', 'তালিকা'), 'All divisions / সব বিভাগ', opts, 'Any status / যেকোনো অবস্থা', 'Validity ahead / বৈধতা সামনে', 'Validity past / বৈধতা পেরিয়েছে',
        T('Licensee', 'লাইসেন্সধারী'), T('Division', 'বিভাগ'), T('Licence number', 'লাইসেন্স নম্বর'), T('Licence validity', 'বৈধতা'), trs,
        T('Coming next: nationwide, district and upazila ISP licensees, and other licence categories.', 'শীঘ্রই আসছে: দেশব্যাপী, জেলা ও উপজেলা ISP লাইসেন্সধারী, আর অন্য লাইসেন্সের তালিকা।'))
    write('licensees/isp-divisional/index.html', page('licensees/isp-divisional/', 'lic', 'ISP (Divisional) licensees in Bangladesh: full BTRC list | BD Telecom', 'বাংলাদেশের ISP (বিভাগীয়) লাইসেন্সধারী: BTRC এর পূর্ণ তালিকা | BD Telecom',
          'Searchable list of all %d divisional ISP licensees in Bangladesh from BTRC (23 Dec 2024), by division, with licence numbers and validity dates. Download as CSV.' % n, body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/licensees/', 'Licensees', 'লাইসেন্সধারী')]))
    nv = build_vts(B)
    # hub
    cards = [('/bd-telecom/licensees/isp-divisional/', 'db', '--accent', 'ISP (Divisional)', 'ISP (বিভাগীয়)', '%d licensees · searchable directory' % n, '%sটি লাইসেন্সধারী · খোঁজার সুবিধা সহ' % bn(n)),
             ('/bd-telecom/guides/itc-licensees/', 'db', '--gp', 'International Terrestrial Cable (ITC)', 'ইন্টারন্যাশনাল টেরেস্ট্রিয়াল ক্যাবল (ITC)', '7 licensees · list of 12 Dec 2024', '৭টি লাইসেন্সধারী · ১২ ডিসে ২০২৪ এর তালিকা'),
             ('/bd-telecom/licensees/vts/', 'car', '--tt', 'Vehicle Tracking Service (VTS)', 'ভেহিকেল ট্র্যাকিং সার্ভিস (VTS)', '%d licensees + 3 mobile operators' % nv, '%sটি লাইসেন্সধারী + ৩টি মোবাইল অপারেটর' % bn(nv)),
             ('/bd-telecom/guides/tower-sharing-licensing-guidelines-2018/#licences', 'tower', '--amber', 'Tower sharing', 'টাওয়ার শেয়ারিং', '4 licensees · list of 23 Dec 2024', '৪টি লাইসেন্সধারী · ২৩ ডিসে ২০২৪ এর তালিকা')]
    cs = ''.join('<a class="linkcard" href="%s"><span class="ti"><span class="ic" style="%s">%s</span>%s</span><p>%s</p></a>' % (u, tint(col), ic(i), T(e, b), T(se, sb)) for u, i, col, e, b, se, sb in cards)
    body = '<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header><div class="cards">%s</div>' % (
        T('Telecom licensees in Bangladesh', 'বাংলাদেশের টেলিকম লাইসেন্সধারী'),
        T('Who holds which BTRC licence, from BTRC’s own licensee lists, with licence numbers and validity dates.', 'কোন প্রতিষ্ঠান কোন BTRC লাইসেন্স ধারণ করছে, BTRC এর নিজস্ব তালিকা থেকে, লাইসেন্স নম্বর আর বৈধতার তারিখ সহ।'), cs)
    write('licensees/index.html', page('licensees/', 'lic', 'Telecom licensees in Bangladesh | BD Telecom', 'বাংলাদেশের টেলিকম লাইসেন্সধারী | BD Telecom',
          'BTRC licensee lists for ISPs, international terrestrial cable and tower sharing in Bangladesh, with licence numbers and validity.', body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))
    return ['bd-telecom/licensees/', 'bd-telecom/licensees/isp-divisional/', 'bd-telecom/licensees/vts/']
