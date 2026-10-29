import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/itc-licensees-2024-12.pdf'
L=[('Fiber @ Home Limited','BTRC/LL/ITC/Fiber@Home(20)/2011-06','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('Summit Communications Limited','BTRC/LL/ITC/Summit(19)/2011-05','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('Novocom Limited','BTRC/LL/ITC/Novocom(15)/2011-01','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('1Asia Alliance Communication Limited','BTRC/LL/ITC/1Asia(16)/2011-02','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('BD Link Communication Limited','BTRC/LL/ITC/BDlink(17)/2011-03','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('Mango Teleservices Limited','BTRC/LL/ITC/Mango(18)/2011-04','5 Jan 2012','4 Jan 2027','৫ জানু ২০১২','৪ জানু ২০২৭'),
('Bangladesh Telecommunications Company Limited (BTCL)','BTRC/LL/ITC/BTCL(14)/2011-07','9 Oct 2014','8 Oct 2029','৯ অক্টো ২০১৪','৮ অক্টো ২০২৯')]
nm=lambda a,b:'<span style="color:var(--ink)">%s</span><br><small style="font-size:.82rem">%s</small>'%(a,b)
ten=[[nm(a,b),c,d] for a,b,c,d,_,_ in L]; tbn=[[nm(a,b),e,f] for a,b,_,_,e,f in L]
POL='/bd-telecom/guides/telecom-network-licensing-policy-2025/'
en=f'''<div class="callout">{INFO}<p><b>In short:</b> BTRC's list as of <b>12 December 2024</b> shows <b>7</b> International Terrestrial Cable (ITC) licensees. Six were licensed on 5 January 2012 and expire on <b>4 January 2027</b>. The seventh, state-owned BTCL, runs to 8 October 2029.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download BTRC's ITC licensee list (PDF)</span></a></div>
<h2>What an ITC licence is</h2>
<p>An ITC licence lets a company carry international connectivity, mainly internet bandwidth, across Bangladesh's land border over fibre cables. It is the land-based counterpart to the submarine cables that land at Cox's Bazar and Kuakata.</p>
<h2>The licensees</h2>
{table(['Licensee and licence number','Issued','Expires'],ten)}
<p>The list gives each next renewal date as the day after expiry: 5 January 2027 for the six private licensees and 9 October 2029 for BTCL.</p>
<h2>What happens next</h2>
<p>Under the <a href="{POL}">Telecommunications Network and Licensing Policy 2025</a>, ITC licensees can migrate to the new <b>ICSP</b> (International Connectivity Service Provider) licence. Once the new licensing regime starts, licences can be renewed only in the new categories, and ICSPs are capped at 49% foreign ownership (policy clauses 7.8.7, 7.8.8 and 10.3.3). With six licences expiring in January 2027, their renewal is likely to be one of the first big tests of the migration.</p>
<div class="callout warn">{WARN}<p>This page is based on BTRC's licensee list dated 12 December 2024. Licences may have changed since then, so check with BTRC for the current status.</p></div>'''
bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> <b>১২ ডিসেম্বর ২০২৪</b> পর্যন্ত BTRC এর তালিকায় ইন্টারন্যাশনাল টেরেস্ট্রিয়াল ক্যাবল (ITC) লাইসেন্সধারী <b>৭টি</b>। এর মধ্যে ছয়টি লাইসেন্স পেয়েছে ৫ জানুয়ারি ২০১২ এ, আর মেয়াদ শেষ <b>৪ জানুয়ারি ২০২৭</b> এ। সপ্তমটি রাষ্ট্রায়ত্ত BTCL, যার মেয়াদ ৮ অক্টোবর ২০২৯ পর্যন্ত।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>BTRC এর ITC লাইসেন্সধারী তালিকা ডাউনলোড (PDF)</span></a></div>
<h2>ITC লাইসেন্স কী</h2>
<p>ITC লাইসেন্স দিয়ে কোনো প্রতিষ্ঠান স্থলসীমান্ত দিয়ে ফাইবার ক্যাবলের মাধ্যমে আন্তর্জাতিক সংযোগ, মূলত ইন্টারনেট ব্যান্ডউইথ, আনা-নেওয়া করতে পারে। কক্সবাজার আর কুয়াকাটায় নামা সাবমেরিন ক্যাবলের স্থলপথের বিকল্প এটি।</p>
<h2>লাইসেন্সধারীরা</h2>
{table(['লাইসেন্সধারী ও লাইসেন্স নম্বর','ইস্যু','মেয়াদ শেষ'],tbn)}
<p>তালিকায় পরবর্তী নবায়নের তারিখ মেয়াদ শেষের পরদিন: ছয়টি বেসরকারি প্রতিষ্ঠানের জন্য ৫ জানুয়ারি ২০২৭, আর BTCL এর জন্য ৯ অক্টোবর ২০২৯।</p>
<h2>সামনে কী</h2>
<p><a href="{POL}">টেলিযোগাযোগ নেটওয়ার্ক ও লাইসেন্সিং নীতিমালা ২০২৫</a> অনুযায়ী ITC লাইসেন্সধারীরা নতুন <b>ICSP</b> (আন্তর্জাতিক সংযোগ সেবাদাতা) লাইসেন্সে যেতে পারবে। নতুন লাইসেন্সিং ব্যবস্থা চালু হলে নবায়ন হবে শুধু নতুন ক্যাটাগরিতে, আর ICSP তে বিদেশি মালিকানা সর্বোচ্চ ৪৯% (নীতিমালার ধারা ৭.৮.৭, ৭.৮.৮ ও ১০.৩.৩)। জানুয়ারি ২০২৭ এ ছয়টি লাইসেন্সের মেয়াদ শেষ হচ্ছে, তাই এগুলোর নবায়ন সম্ভবত এই স্থানান্তরের প্রথম বড় পরীক্ষাগুলোর একটি হবে।</p>
<div class="callout warn">{WARN}<p>এই পেজ BTRC এর ১২ ডিসেম্বর ২০২৪ এর লাইসেন্সধারী তালিকার ভিত্তিতে তৈরি। এরপর লাইসেন্সে পরিবর্তন হয়ে থাকতে পারে, তাই বর্তমান অবস্থা BTRC থেকে মিলিয়ে নিন।</p></div>'''
g=dict(slug='itc-licensees',icon='db',color='--gp',
 title_en='International Terrestrial Cable (ITC) licensees in Bangladesh',
 title_bn='বাংলাদেশের ইন্টারন্যাশনাল টেরেস্ট্রিয়াল ক্যাবল (ITC) লাইসেন্সধারী',
 sum_en='The 7 companies licensed to carry international bandwidth over land cables, their licence numbers and expiry dates, and the move to ICSP.',
 sum_bn='স্থলপথের ক্যাবলে আন্তর্জাতিক ব্যান্ডউইথ আনার লাইসেন্স পাওয়া ৭টি প্রতিষ্ঠান, লাইসেন্স নম্বর, মেয়াদ, আর ICSP তে যাওয়ার বিষয়।',
 sources=[['BTRC: International Terrestrial Cable (ITC) License List as on 12-12-2024 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]
i=[x['slug'] for x in G].index('tower-sharing-licensing-guidelines-2018')+1; G.insert(i,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
