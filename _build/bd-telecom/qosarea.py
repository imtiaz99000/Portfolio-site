"""Area lookup: did each operator meet BTRC's upazila quality benchmarks where you live? From BTRC's MNO QoS report."""
import json, os

KPI = [('2G call drop rate', '2G কল ড্রপ হার', '≤ 1.50%', 'Calls cut off unexpectedly', 'কথার মাঝে কল কেটে যাওয়া'),
       ('2G call setup success', '2G কল সংযোগের সাফল্য', '≥ 98.00%', 'Calls that connect on the first try', 'প্রথম চেষ্টায় কল লাগা'),
       ('4G connection success (RRC)', '4G সংযোগের সাফল্য (RRC)', '≥ 98.50%', 'Phones that manage to join the 4G network', 'ফোন 4G নেটওয়ার্কে যুক্ত হতে পারা'),
       ('VoLTE + 2G combined drop rate', 'VoLTE + 2G মিলিয়ে কল ড্রপ', '≤ 1.50%', 'Calls cut off, counting 4G and 2G calls together', '4G আর 2G কল মিলিয়ে কল কেটে যাওয়া'),
       ('VoLTE + 2G combined call setup success', 'VoLTE + 2G মিলিয়ে কল সংযোগের সাফল্য', '≥ 98.00%', 'Calls that connect, counting 4G and 2G calls together', '4G আর 2G কল মিলিয়ে কল লাগা')]
OPK = [('gp', 0), ('robi', 1), ('bl', 2)]


def build_qosarea(B):
    T, bn, ic, page, write, mlab = B.T, B.bn, B.ic, B.page, B.write, B.mlab
    A = json.load(open(os.path.join(B.HERE, 'data_src', 'qos-upazila-2026-08.json'), encoding='utf8'))
    Q = json.load(open(os.path.join(B.HERE, 'data_src', 'btrc-qos-2026-08.json'), encoding='utf8'))
    M = Q['month']
    A.sort(key=lambda x: (x['d'], x['u']))
    code = {'ok': 1, 'non': 0, 'nos': 2}
    rows = [[x['d'], x['db'], x['u'], x['ub']] + [''.join(str(code.get(v, 3)) for v in x[k]) for k, _ in OPK] for x in A]
    allok = sum(1 for x in A if all(all(v == 'ok' for v in x[k]) for k, _ in OPK))
    short = {k: sum(1 for x in A if any(v == 'non' for v in x[k])) for k, _ in OPK}
    nos = {k: sum(1 for x in A if all(v == 'nos' for v in x[k])) for k, _ in OPK}
    ops = {k: B.OPS[i] for k, i in OPK}

    # district summary table (works without JavaScript, and for search engines)
    dists = []
    for d in sorted(set(x['d'] for x in A)):
        xs = [x for x in A if x['d'] == d]
        dists.append((d, xs[0]['db'], len(xs), {k: (sum(1 for x in xs if all(v == 'ok' for v in x[k])), sum(1 for x in xs if all(v == 'nos' for v in x[k]))) for k, _ in OPK}))
    def cell(ok, n, ns):
        s = '%d / %d' % (ok, n - ns)
        return '<td class="frac%s">%s%s</td>' % (' flag' if ok < n - ns else '', T(s, bn(s)), ('<br><small>%s</small>' % T('%d no service' % ns, '%sটিতে সেবা নেই' % bn(ns))) if ns else '')
    dtr = ''.join('<tr><td style="text-align:left">%s</td><td>%s</td>%s</tr>' % (T(d, db), T(str(n), bn(n)), ''.join(cell(c[k][0], n, c[k][1]) for k, _ in OPK)) for d, db, n, c in dists)
    dth = '<th style="text-align:left">%s</th><th>%s</th>' % (T('District', 'জেলা'), T('Areas', 'এলাকা')) + ''.join('<th>%s%s</th>' % (B.badge(ops[k]), T(ops[k]['en'], ops[k]['bn'])) for k, _ in OPK)
    kli = ''.join('<li><b>%s</b> <span class="pill nap">%s</span><br><small>%s</small></li>' % (T(e, b), T(t, bn(t)), T(de, db)) for e, b, t, de, db in KPI)

    data = json.dumps({'rows': rows, 'kpi': [[e, b] for e, b, *_ in KPI], 'ops': [[k, ops[k]['en'], ops[k]['bn'], ops[k]['s'], ops[k]['c']] for k, _ in OPK]}, ensure_ascii=False, separators=(',', ':'))
    js = r'''<script>
(function(){
var D=__DATA__,dS=document.getElementById('qa-d'),uS=document.getElementById('qa-u'),out=document.getElementById('qa-out');
var BN='০১২৩৪৫৬৭৮৯',bnum=function(s){return String(s).replace(/\d/g,function(c){return BN[c]})};
var L=function(){return document.documentElement.lang==='bn'};
var t=function(en,bn){return '<span data-en>'+en+'</span><span data-bn>'+bn+'</span>'};
var ds=[],seen={};D.rows.forEach(function(r){if(!seen[r[0]]){seen[r[0]]=1;ds.push([r[0],r[1]])}});
ds.sort(function(a,b){return a[1].localeCompare(b[1],'bn')});
dS.innerHTML='<option value="">জেলা বেছে নিন · Choose district</option>'+ds.map(function(d){return '<option value="'+d[0]+'">'+d[1]+' · '+d[0]+'</option>'}).join('');
function fillU(d,sel){var us=D.rows.filter(function(r){return r[0]===d});us.sort(function(a,b){return a[3].localeCompare(b[3],'bn')});
 uS.innerHTML='<option value="">উপজেলা বা থানা · Upazila or thana</option>'+us.map(function(r){return '<option value="'+r[2]+'"'+(r[2]===sel?' selected':'')+'>'+r[3]+' · '+r[2]+'</option>'}).join('');uS.disabled=!d}
function show(d,u){var r=D.rows.filter(function(x){return x[0]===d&&x[2]===u})[0];if(!r){out.innerHTML='';return}
 var good=[],h='';
 D.ops.forEach(function(o,i){var s=r[4+i],n=0,fail=[];for(var k=0;k<5;k++){if(s[k]==='1')n++;else if(s[k]==='0')fail.push(k)}
  var nos=s.split('').every(function(c){return c==='2'}),st,cls;
  if(nos){st=t('No service in this area','এই এলাকায় সেবা নেই');cls='nap'}
  else if(n===5){st=t('Met all 5 benchmarks','৫টি মানদণ্ডের সবকটি পূরণ');cls='okp';good.push(o)}
  else{st=t('Met '+n+' of 5 benchmarks','৫টির মধ্যে '+bnum(n)+'টি পূরণ');cls='warn'}
  var items=D.kpi.map(function(k,j){var c=s[j];var p=c==='1'?'<span class="pill okp">'+t('Met','পূরণ')+'</span>':c==='0'?'<span class="pill warn">'+t('Not met','পূরণ হয়নি')+'</span>':'<span class="pill nap">'+t('No service','সেবা নেই')+'</span>';return '<li>'+t(k[0],k[1])+p+'</li>'}).join('');
  h+='<div class="card qa-op"><div class="qa-h"><span class="badge" style="background:var('+o[4]+');color:'+(o[0]==='bl'?'var(--bl-ink)':'#fff')+'">'+o[3]+'</span><b>'+t(o[1],o[2])+'</b><span class="pill '+cls+'">'+st+'</span></div>'+(nos?'':'<ul class="qa-k">'+items+'</ul>')+'</div>'});
 var sum=good.length===3?t('All three operators met every BTRC benchmark here in __MEN__.','__MBN__ এ এখানে তিন অপারেটরই BTRC এর সব মানদণ্ড পূরণ করেছে।'):good.length?t(good.map(function(o){return o[1]}).join(' and ')+' met every benchmark here in __MEN__.','__MBN__ এ এখানে সব মানদণ্ড পূরণ করেছে: '+good.map(function(o){return o[2]}).join(' আর ')+'।'):t('No operator met every benchmark here in __MEN__.','__MBN__ এ এখানে কোনো অপারেটর সব মানদণ্ড পূরণ করেনি।');
 out.innerHTML='<h2 class="qa-place">'+t(r[2]+', '+r[0],r[3]+', '+r[1])+'</h2><p class="qa-sum">'+sum+'</p><div class="qa-grid">'+h+'</div><div class="card qa-op qa-tt"><div class="qa-h"><span class="badge" style="background:var(--tt);color:#fff">TT</span><b>'+t('Teletalk','টেলিটক')+'</b><span class="pill nap">'+t('Not assessed','যাচাই হয়নি')+'</span></div><p class="sub" style="margin:8px 0 0">'+t('BTRC could not check Teletalk in __MEN__ because Teletalk sent incomplete data files.','টেলিটক অসম্পূর্ণ ডেটা ফাইল পাঠানোয় __MBN__ এ BTRC টেলিটকের মান যাচাই করতে পারেনি।')+'</p></div>';
 try{history.replaceState(null,'','#'+encodeURIComponent(d)+'/'+encodeURIComponent(u))}catch(e){}}
dS.addEventListener('change',function(){fillU(dS.value);out.innerHTML=''});
uS.addEventListener('change',function(){show(dS.value,uS.value)});
var hh=decodeURIComponent(location.hash.slice(1)).split('/');
if(hh[0]&&seen[hh[0]]){dS.value=hh[0];fillU(hh[0],hh[1]);if(hh[1])show(hh[0],hh[1])}else{uS.disabled=true}
})();
</script>'''.replace('__DATA__', data).replace('__MEN__', mlab(M)).replace('__MBN__', mlab(M, 'bn'))

    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="card qa-pick"><label>%s<select id="qa-d"></select></label><label>%s<select id="qa-u" disabled><option>…</option></select></label></div>
<div id="qa-out" aria-live="polite"></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="tiles kpis">%s</div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><ul class="qa-def">%s</ul></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><p class="sub" style="margin:0 0 12px">%s</p><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="cards"><a class="linkcard" href="/bd-telecom/kpi/qos/"><span class="ti">%s</span><p>%s</p></a><a class="linkcard" href="/bd-telecom/guides/qos-directives-2025/"><span class="ti">%s</span><p>%s</p></a></div></section>
%s''' % (
        T('Mobile network quality where you live', 'আপনার এলাকায় মোবাইল নেটওয়ার্কের মান'),
        T('Pick your district and upazila to see whether Grameenphone, Robi and Banglalink met BTRC’s quality benchmarks there in %s.' % mlab(M),
          'জেলা আর উপজেলা বেছে নিন, দেখুন %s এ আপনার এলাকায় গ্রামীণফোন, রবি আর বাংলালিংক BTRC এর মান পূরণ করেছে কিনা।' % mlab(M, 'bn')),
        T('BTRC QoS report for %s, published 30 Sep 2026' % mlab(M), 'BTRC এর %s এর QoS প্রতিবেদন, প্রকাশ ৩০ সেপ্টে ২০২৬' % mlab(M, 'bn')),
        T('District', 'জেলা'), T('Upazila or thana', 'উপজেলা বা থানা'),
        ic('info'), T('This shows pass or fail against BTRC’s minimum standards, measured by BTRC over the whole month. It is not a speed test and does not rank operators: where several operators meet every benchmark, all of them cleared the same minimum bar. Your own experience can still differ inside an upazila, indoors or at busy hours.',
                      'এখানে দেখানো হয়েছে BTRC এর ন্যূনতম মান পূরণ হয়েছে কিনা, যা BTRC পুরো মাস ধরে মেপেছে। এটা গতির পরীক্ষা নয়, আর অপারেটরদের মধ্যে কে সেরা তাও বলে না: একাধিক অপারেটর সব মান পূরণ করলে সবাই একই ন্যূনতম সীমা পার হয়েছে। একই উপজেলার ভেতরে, ঘরের ভেতরে বা ব্যস্ত সময়ে আপনার অভিজ্ঞতা আলাদা হতে পারে।'),
        T('Across the country', 'সারা দেশে'),
        '<div class="tile kpi"><div class="l">%s</div><div class="v">%s</div><div class="d">%s</div></div>' % (T('Areas where all three met everything', 'যেখানে তিন অপারেটরই সব মান পূরণ করেছে'), T('%d<small> / %d</small>' % (allok, len(A)), '%s<small> / %s</small>' % (bn(allok), bn(len(A)))), T('upazilas and city thanas', 'উপজেলা ও শহরের থানা'))
        + ''.join('<div class="tile kpi"><div class="l">%s %s</div><div class="v">%s</div><div class="d">%s</div></div>' % (B.badge(ops[k]), T(ops[k]['en'], ops[k]['bn']), T('%d<small> areas short</small>' % short[k], '%s<small>টি এলাকায় ঘাটতি</small>' % bn(short[k])), T('no service in %d' % nos[k], '%sটিতে সেবা নেই' % bn(nos[k]))) for k, _ in OPK),
        T('The five checks in each upazila', 'প্রতিটি উপজেলায় পাঁচটি পরীক্ষা'), kli,
        T('District by district', 'জেলাভিত্তিক'), T('Areas where each operator met all five benchmarks, out of the areas where it has service.', 'প্রতিটি অপারেটর কতগুলো এলাকায় পাঁচটি মানদণ্ডের সবকটি পূরণ করেছে, যেসব এলাকায় তাদের সেবা আছে তার মধ্যে।'), dth, dtr,
        T('More on network quality', 'নেটওয়ার্কের মান নিয়ে আরও'), T('Full QoS report', 'পূর্ণ QoS প্রতিবেদন'), T('National and district results, lists and PDFs', 'জাতীয় ও জেলার ফল, তালিকা আর PDF'),
        T('BTRC QoS Directives 2025', 'BTRC QoS নির্দেশিকা ২০২৫'), T('What the benchmarks are and why they exist', 'মানদণ্ডগুলো কী আর কেন'), js)
    write('kpi/qos/area/index.html', page('kpi/qos/area/', 'kpi', 'Mobile network quality in your upazila: GP, Robi, Banglalink (BTRC, %s) | BD Telecom' % mlab(M), 'আপনার এলাকায় মোবাইল নেটওয়ার্কের মান: জিপি, রবি, বাংলালিংক | BD Telecom',
          'Check whether Grameenphone, Robi and Banglalink met BTRC quality benchmarks in your district and upazila in %s, for all %d upazilas and city thanas in Bangladesh.' % (mlab(M), len(A)), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom'), ('/bd-telecom/kpi/', 'KPI', 'KPI'), ('/bd-telecom/kpi/qos/', 'QoS', 'QoS')]))
    return ['bd-telecom/kpi/qos/area/']
