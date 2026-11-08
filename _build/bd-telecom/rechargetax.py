"""Recharge tax calculator: how much of a mobile recharge goes to the government as VAT, supplementary duty and surcharge."""

SD, VAT, SUR = 0.20, 0.15, 0.01
SOURCES = [
    ('The Business Standard, 22 Jan 2025: supplementary duty on talk time and internet restored to 20%', 'https://www.tbsnews.net/bangladesh/hiked-vat-now-reduced-medicines-internet-restaurants-5-other-sectors-1049581'),
    ('The Daily Star, 6 Jun 2024: 15% VAT and 1% surcharge on top-ups; SD raised from 15% to 20%', 'https://www.thedailystar.net/business/bangladesh-national-budget-fy2024-25/news/mobile-internet-talktime-be-costlier-3628716'),
    ('Bangladesh Pratidin, 8 Jan 2025: Tk 28.1 of Tk 100 is SD, VAT and surcharge', 'https://en.bd-pratidin.com/economy/2025/01/08/27371'),
    ('bdnews24, 3 Jun 2025: FY2025-26 budget cut operators’ turnover tax to 1.5%', 'https://bdnews24.com/budget2025-26/2a85c700a795'),
    ('bdnews24, 11 Jun 2026: FY2026-27 budget withdrew the Tk 300 SIM tax', 'https://bdnews24.com/budget2026-27/619493585718'),
]


def split(amount):
    base = amount / (1 + SD + VAT * (1 + SD) + SUR)
    sd = base * SD; vat = (base + sd) * VAT; sur = base * SUR
    return base, sd, vat, sur


def build_rechargetax(B):
    T, bn, ic, page, write = B.T, B.bn, B.ic, B.page, B.write
    import finance
    f2 = lambda v, lang='en': finance.fmt(v, 2, lang)
    rows = ''
    for a in (20, 50, 100, 200, 500, 1000):
        b, s, v, u = split(a)
        rows += '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td><b>%s</b></td></tr>' % tuple(T(f2(x), f2(x, 'bn')) for x in (a, b, s, v, u, s + v + u))
    b100, s100, v100, u100 = split(100)
    tax100 = s100 + v100 + u100
    th = ''.join('<th>%s</th>' % T(e, b) for e, b in [('Recharge', 'রিচার্জ'), ('Service value', 'সেবার মূল্য'), ('SD 20%', 'সম্পূরক শুল্ক ২০%'), ('VAT 15%', 'VAT ১৫%'), ('Surcharge 1%', 'সারচার্জ ১%'), ('Total tax', 'মোট কর')])
    js = '''<script>(function(){
var SD=%s,VAT=%s,SUR=%s,BN='০১২৩৪৫৬৭৮৯';
function f(v){var s=v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});return document.documentElement.lang==='bn'?s.replace(/\\d/g,function(c){return BN[c]}):s}
var i=document.getElementById('rt-a'),o=document.getElementById('rt-out');
function go(){var a=parseFloat(String(i.value).replace(/[০-৯]/g,function(c){return BN.indexOf(c)}))||0;var b=a/(1+SD+VAT*(1+SD)+SUR),s=b*SD,v=(b+s)*VAT,u=b*SUR,t=s+v+u,p=a?t/a*100:0;
var row=function(en,bn,x,c){return '<div class="rt-r'+(c?' '+c:'')+'"><span><span data-en>'+en+'</span><span data-bn>'+bn+'</span></span><b>'+f(x)+'</b></div>'};
o.innerHTML='<div class="rt-bar"><span style="flex:'+b+';background:var(--tt)"></span><span style="flex:'+s+';background:var(--robi)"></span><span style="flex:'+v+';background:var(--amber)"></span><span style="flex:'+u+';background:var(--gp)"></span></div>'
+row('Service you receive','আপনি যে সেবা পান',b,'big')+row('Supplementary duty (20%%)','সম্পূরক শুল্ক (২০%%)',s)+row('VAT (15%%)','VAT (১৫%%)',v)+row('Surcharge (1%%)','সারচার্জ (১%%)',u)
+row('Total to the government','মোট সরকারের কাছে',t,'tot')+'<p class="sub" style="margin:8px 0 0"><span data-en>'+f(p)+'%% of what you pay is tax.</span><span data-bn>আপনার দেওয়া টাকার '+f(p)+'%% কর।</span></p>'}
i.addEventListener('input',go);document.getElementById('langBtn')&&document.getElementById('langBtn').addEventListener('click',function(){setTimeout(go,30)});go()})();</script>''' % (SD, VAT, SUR)
    srcs = ''.join('<li><a href="%s" rel="noopener">%s</a></li>' % (u, B.esc(t)) for t, u in SOURCES)
    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<div class="card rt"><label for="rt-a">%s</label><div class="rt-in"><span>৳</span><input id="rt-a" type="number" inputmode="decimal" min="0" step="1" value="100"></div><div id="rt-out" aria-live="polite"></div></div>
<div class="callout"><span>%s</span><p>%s</p></div>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div></div></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><article class="prose card">%s</article></section>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><ol class="srcl">%s</ol><p class="sub" style="margin:8px 0 0">%s</p></div></section>%s''' % (
        T('How much of your recharge goes in tax?', 'রিচার্জের কত টাকা করে যায়?'),
        T('Type a recharge amount to see how much is service and how much is VAT, supplementary duty and surcharge. The same taxes apply to talk time and mobile internet packs.',
          'রিচার্জের পরিমাণ লিখুন, দেখুন কত টাকা সেবা আর কত টাকা VAT, সম্পূরক শুল্ক আর সারচার্জ। টকটাইম আর মোবাইল ইন্টারনেট প্যাক, দুটোতেই একই কর।'),
        T('Rates in force since January 2025, checked against the FY2025-26 and FY2026-27 budgets', 'জানুয়ারি ২০২৫ থেকে চালু হার, ২০২৫-২৬ আর ২০২৬-২৭ বাজেটের সাথে মিলিয়ে দেখা'),
        T('Recharge amount (Tk)', 'রিচার্জের পরিমাণ (টাকা)'),
        ic('info'), T('On a Tk 100 recharge you receive Tk %s worth of service and Tk %s goes to the government. The tax is included in the price you pay, so the 20%% duty and 15%% VAT are charged on top of the service value, not taken out of Tk 100.' % (f2(b100), f2(tax100)),
                      '১০০ টাকা রিচার্জে আপনি %s টাকার সেবা পান, আর %s টাকা যায় সরকারের কাছে। কর দামের ভেতরেই ধরা থাকে, তাই ২০%% শুল্ক আর ১৫%% VAT হিসাব হয় সেবার মূল্যের ওপর, ১০০ টাকা থেকে কেটে নয়।' % (f2(b100, 'bn'), f2(tax100, 'bn'))),
        T('Common amounts', 'প্রচলিত পরিমাণ'), th, rows,
        T('How it is worked out', 'হিসাবটা যেভাবে'),
        T('<p>Start from the service value. Supplementary duty is 20% of that value. VAT is 15% of the value plus the duty. The surcharge is 1% of the value. Together they make 1.39 times the service value, so a recharge divided by 1.39 gives the service you receive.</p><p>These are the taxes you pay directly. Operators pay more on top, such as revenue share and spectrum fees to BTRC, a minimum turnover tax and corporate income tax, which is why industry estimates of the government’s total share of a recharge are higher. A January 2025 estimate reported by Bangladesh Pratidin put it at Tk 54.6 of every Tk 100: Tk 28.1 in the taxes above, Tk 6.1 in revenue share and minimum tax, and Tk 20.4 in other indirect taxes. That figure is an industry estimate, not an official rate.</p>',
          '<p>শুরু সেবার মূল্য থেকে। সম্পূরক শুল্ক সেই মূল্যের ২০%। VAT হলো মূল্য আর শুল্ক মিলিয়ে তার ১৫%। সারচার্জ মূল্যের ১%। সব মিলিয়ে সেবার মূল্যের ১.৩৯ গুণ, তাই রিচার্জকে ১.৩৯ দিয়ে ভাগ করলে আপনি যে সেবা পান তা বের হয়।</p><p>এগুলো সরাসরি আপনার দেওয়া কর। এর বাইরে অপারেটররা আরও দেয়, যেমন BTRC কে রেভিনিউ শেয়ার আর তরঙ্গ ফি, ন্যূনতম টার্নওভার কর আর আয়কর। তাই শিল্পের হিসাবে একটি রিচার্জে সরকারের মোট ভাগ আরও বেশি দেখায়। বাংলাদেশ প্রতিদিনে প্রকাশিত জানুয়ারি ২০২৫ এর একটি হিসাবে প্রতি ১০০ টাকায় এটি ৫৪.৬ টাকা: ওপরের করে ২৮.১ টাকা, রেভিনিউ শেয়ার ও ন্যূনতম করে ৬.১ টাকা, আর অন্যান্য পরোক্ষ করে ২০.৪ টাকা। এটি শিল্পের একটি হিসাব, সরকারি হার নয়।</p>', 'div'),
        T('Sources', 'সূত্র'), srcs, T('Tax rates change with the national budget. This page is checked after each budget.', 'জাতীয় বাজেটের সাথে করের হার বদলায়। প্রতিটি বাজেটের পর এই পেজ মিলিয়ে দেখা হয়।'), js)
    write('recharge-tax/index.html', page('recharge-tax/', 'guides', 'Mobile recharge tax calculator: VAT, supplementary duty and surcharge on Tk 100 | BD Telecom', 'মোবাইল রিচার্জে কর: ১০০ টাকায় কত টাকা সরকারের | BD Telecom',
          'On a Tk 100 mobile recharge in Bangladesh you get Tk %.2f of service; Tk %.2f is supplementary duty (20%%), VAT (15%%) and surcharge (1%%). Calculator for any amount.' % (b100, tax100), body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))
    return ['bd-telecom/recharge-tax/']
