import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/drone-registration-flying-policy-2020.pdf'
def tx(x,y,en,bn,cls='',anchor='middle'):
    c=' class="%s"'%cls if cls else ''
    return '<text x="%d" y="%d" text-anchor="%s"%s><tspan data-en>%s</tspan><tspan data-bn>%s</tspan></text>'%(x,y,anchor,c,en,bn)
cx,cy=200,170
svg=('<svg viewBox="0 0 640 340" role="img" aria-label="Green zone height limits around an airport or KPI">'
 '<circle cx="%d" cy="%d" r="160" style="fill:color-mix(in srgb,var(--tt) 10%%,var(--surface));stroke:var(--tt)" stroke-width="1.5" stroke-dasharray="5 4"/>'%(cx,cy)+
 '<circle cx="%d" cy="%d" r="96" style="fill:color-mix(in srgb,var(--tt) 22%%,var(--surface));stroke:var(--tt)" stroke-width="1.5"/>'%(cx,cy)+
 '<circle cx="%d" cy="%d" r="58" style="fill:color-mix(in srgb,var(--robi) 22%%,var(--surface));stroke:var(--robi)" stroke-width="1.5"/>'%(cx,cy)+
 tx(cx,cy-4,'Airport / KPI','বিমানবন্দর / KPI')+tx(cx,cy+14,'Within 3 km: approval','৩ কিমির মধ্যে: অনুমোদন','s')+
 tx(cx,cy-72,'3 to 5 km','৩ থেকে ৫ কিমি','s')+tx(cx,cy-128,'Beyond 5 km','৫ কিমির বাইরে','s')+
 '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="var(--muted)" stroke-width="1.2"/>'%(cx+80,cy+40,390,120)+
 '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="var(--muted)" stroke-width="1.2"/>'%(cx+135,cy+80,390,230)+
 tx(400,112,'Green zone: up to 50 ft (15.24 m)','গ্রিন জোন: সর্বোচ্চ ৫০ ফুট (১৫.২৪ মি.)','','start')+tx(400,132,'between 3 and 5 km','৩ থেকে ৫ কিমির মধ্যে','s','start')+
 tx(400,222,'Green zone: up to 100 ft (30.48 m)','গ্রিন জোন: সর্বোচ্চ ১০০ ফুট (৩০.৪৮ মি.)','','start')+tx(400,242,'more than 5 km away','৫ কিমির বেশি দূরে','s','start')+'</svg>')
FIG_en='<figure class="figure">%s<figcaption>Green zone height limits from section 5 of the policy. CAAB’s drone app marks the zones by geofencing. Not to scale.</figcaption></figure><p class="swipe">Swipe sideways to see the full diagram.</p>'%svg
FIG_bn='<figure class="figure">%s<figcaption>নীতিমালার অনুচ্ছেদ ৫ অনুযায়ী গ্রিন জোনের উচ্চতার সীমা। বেবিচকের ড্রোন অ্যাপে জিওফেন্সিং দিয়ে জোনগুলো চিহ্নিত থাকে। মাপ অনুপাতে নয়।</figcaption></figure><p class="swipe">পুরো ছবি দেখতে পাশে সরান।</p>'%svg

en=f'''<div class="callout">{INFO}<p><b>In short:</b> The Civil Aviation and Tourism Ministry issued this policy on 22 September 2020, and it was published in the gazette on 5 October 2020. It sorts drones into four categories and the sky into three zones, sets out who must register a drone, and says when you need permission to fly. The Civil Aviation Authority of Bangladesh (CAAB, বেবিচক) runs it.</p></div>
<div class="callout warn">{WARN}<p>This policy dates from 2020. CAAB can add details through Air Navigation Orders, circulars and instructions (section 12), so check CAAB's latest rules before you buy, import or fly.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the gazette (PDF, Bangla)</span></a></div>
<h2>Four categories of drone</h2>
{table(['Category','Use'],[['A (ক)','Recreation: personal photography, a toy, hobby flying'],['B (খ)','Non-commercial work such as education and research, by government or private bodies or individuals'],['C (গ)','Commercial and professional work: surveys, photography, filming, carrying goods'],['D (ঘ)','State and military use']])}
<h2>Three zones</h2>
<ul>
<li><b>Green zone, no permission needed.</b> Between 3 and 5 km from an airport or KPI (key point installation), up to 50 ft (15.24 m). More than 5 km away, up to 100 ft (30.48 m).</li>
<li><b>Yellow zone, permission needed.</b> Restricted areas, military areas, densely populated areas and crowded areas.</li>
<li><b>Red zone, special permission needed.</b> Prohibited areas, danger areas, airports, KPIs and special KPIs.</li>
</ul>
{FIG_en}
<h2>Can I fly my drone without permission?</h2>
<p>Only if it is a <b>category A drone</b> used for recreation, it <b>weighs under 5 kg</b> including payload or <b>cannot fly above 100 ft</b>, and you fly it <b>in the green zone</b> (section 8(a)). Every other case needs permission:</p>
<ul>
<li>A category A drone of 5 kg or more, or able to fly above 100 ft, needs permission even in the green zone.</li>
<li>Category B and C drones need permission in every zone.</li>
<li>No night flying, from sunset to sunrise, without special CAAB permission.</li>
<li>Outside the green zone, the Air Defence Operations Centre must approve the place and time. Unless you fly category A in the green zone, you must also tell the local police station in writing before flying (section 9(d)).</li>
</ul>
<h2>Registering a drone</h2>
<p>Category B and C drones must be registered with CAAB and get a registration or identification number. Category A drones must be registered if they weigh more than 5 kg or can fly above 100 ft (section 7). The number has to be painted where it is easy to see on the drone. To register, you submit:</p>
<ol class="stepsv">
<li>The purpose of use, the drone's specifications and the purchase receipt.</li>
<li>A <b>BTRC certificate</b> showing that the drone's radio frequency will not interfere with radio, TV, mobile, satellite or aviation communication. This is needed for category B and C drones and for category A drones over 5 kg (section 7(f)).</li>
<li>Your photo, a copy of your NID and your mobile number.</li>
<li>A written plan for emergencies such as a flat battery, losing control or the drone leaving its range.</li>
<li>A Ministry of Defence no-objection certificate where it applies, and anything else CAAB asks for.</li>
</ol>
<h2>Importing and making drones</h2>
<p>Importing a category A, B or C drone or drone parts over 5 kg, including payload, needs a Ministry of Defence no-objection certificate before import, listing specifications and quantity. The import must happen within 1 year of the certificate, and you must show it to customs (section 6). Making drones over 5 kg needs clearance from the Public Security Division, and a drone factory needs Ministry of Defence clearance. Toy drones need no permission to make.</p>
<h2>Rules while flying</h2>
<ul>
<li>Stay at least <b>30 metres</b> away from crowds, roads with traffic, markets and shops, homes, and offices or courts. Flying closer needs permission from the local administration and CAAB (section 8(n)).</li>
<li>No flying within <b>2 km</b> of a VVIP's event venue, from 3 days before it, without special permission. Within 5 km of rallies and national or international sports events, follow CAAB's ANO (section 8(j) and (k)).</li>
<li>Within 3 km of a KPI you need the KPI committee's approval, and within 3 km of an airport you need CAAB's and the airport manager's approval (section 8(o)).</li>
<li>Always carry the CAAB approval and show it to CAAB, police or security agencies when asked (section 8(l)).</li>
<li>The air defence centre can bring down any drone flown without permission (section 8(r)).</li>
</ul>
<h2>Who can fly</h2>
<p>For anything beyond recreational flying of a small category A drone, the pilot must be at least <b>18</b> and have passed the <b>SSC</b> or equivalent. The pilot needs any training or licence CAAB requires, must know the aeronautical information for the airspace, must be fit, and must not fly within <b>8 hours</b> of taking drugs that affect the body (section 10). Pilots need a CAAB operator certificate (section 11).</p>
<h2>Penalties</h2>
<p>Unauthorised flying can be stopped by CAAB, the police or any law enforcement agency. The pilot, or the employer where it applies, can be punished under the Penal Code, 1860 and the Civil Aviation Act, 2017, and must pay compensation for any harm to people, animals, property or privacy (sections 8(p) and 13).</p>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the gazette, not legal advice. Approval steps and forms are set by CAAB, the Ministry of Defence and BTRC.</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এই নীতিমালা জারি করেছে ২২ সেপ্টেম্বর ২০২০ এ, আর গেজেটে প্রকাশ হয়েছে ৫ অক্টোবর ২০২০। এতে ড্রোনকে চার শ্রেণিতে আর আকাশকে তিন জোনে ভাগ করা হয়েছে। কোন ড্রোনের নিবন্ধন লাগবে আর কখন উড্ডয়নের অনুমতি লাগবে, তাও বলা আছে। দায়িত্বে বাংলাদেশ বেসামরিক বিমান চলাচল কর্তৃপক্ষ (বেবিচক)।</p></div>
<div class="callout warn">{WARN}<p>এই নীতিমালা ২০২০ সালের। বেবিচক ANO, সার্কুলার আর নির্দেশনার মাধ্যমে নতুন খুঁটিনাটি যোগ করতে পারে (অনুচ্ছেদ ১২)। তাই ড্রোন কেনা, আমদানি বা ওড়ানোর আগে বেবিচকের সর্বশেষ নিয়ম দেখে নিন।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গেজেট ডাউনলোড (PDF)</span></a></div>
<h2>ড্রোনের চার শ্রেণি</h2>
{table(['শ্রেণি','ব্যবহার'],[['ক','বিনোদন: ব্যক্তিগত ফটোগ্রাফি, খেলনা, শখে ওড়ানো'],['খ','শিক্ষা ও গবেষণার মতো অ-বাণিজ্যিক কাজ, সরকারি বা বেসরকারি সংস্থা বা ব্যক্তির'],['গ','বাণিজ্যিক ও পেশাদার কাজ: জরিপ, স্থিরচিত্র, চলচ্চিত্র নির্মাণ, পণ্য পরিবহন'],['ঘ','রাষ্ট্রীয় ও সামরিক প্রয়োজন']])}
<h2>তিনটি জোন</h2>
<ul>
<li><b>গ্রিন জোন, অনুমতি লাগবে না।</b> বিমানবন্দর বা KPI (গুরুত্বপূর্ণ স্থাপনা) থেকে ৩ কিমির বাইরে আর ৫ কিমির মধ্যে সর্বোচ্চ ৫০ ফুট (১৫.২৪ মি.)। ৫ কিমির বাইরে সর্বোচ্চ ১০০ ফুট (৩০.৪৮ মি.)।</li>
<li><b>ইয়েলো জোন, অনুমতি লাগবে।</b> সংরক্ষিত এলাকা, সামরিক এলাকা, ঘনবসতিপূর্ণ এলাকা আর জনসমাগমপূর্ণ এলাকা।</li>
<li><b>রেড জোন, বিশেষ অনুমতি লাগবে।</b> নিষিদ্ধ এলাকা, বিপজ্জনক এলাকা, বিমানবন্দর, KPI আর বিশেষ KPI।</li>
</ul>
{FIG_bn}
<h2>অনুমতি ছাড়া কি ড্রোন ওড়ানো যাবে?</h2>
<p>শুধু তখনই, যখন সেটা বিনোদনের <b>ক-শ্রেণির ড্রোন</b>, পেলোডসহ <b>৫ কেজির কম</b> বা <b>১০০ ফুটের বেশি উঠতে পারে না</b>, আর আপনি ওড়াচ্ছেন <b>গ্রিন জোনে</b> (অনুচ্ছেদ ৮(ক))। বাকি সব ক্ষেত্রে অনুমতি লাগবে:</p>
<ul>
<li>৫ কেজি বা তার বেশি ওজনের, কিংবা ১০০ ফুটের বেশি উঠতে পারে এমন ক-শ্রেণির ড্রোনের জন্য গ্রিন জোনেও অনুমতি লাগবে।</li>
<li>খ আর গ শ্রেণির ড্রোনের জন্য সব জোনেই অনুমতি লাগবে।</li>
<li>বেবিচকের বিশেষ অনুমতি ছাড়া রাতে, মানে সূর্যাস্ত থেকে সূর্যোদয় পর্যন্ত, ওড়ানো যাবে না।</li>
<li>গ্রিন জোনের বাইরে স্থান আর সময় উল্লেখ করে আকাশ প্রতিরক্ষা পরিচালনা কেন্দ্রের অনুমতি লাগবে। ক-শ্রেণি আর গ্রিন জোন ছাড়া অন্য সব ক্ষেত্রে ওড়ানোর আগে স্থানীয় থানাকে লিখিতভাবে জানাতে হবে (অনুচ্ছেদ ৯(ঘ))।</li>
</ul>
<h2>ড্রোন নিবন্ধন</h2>
<p>খ আর গ শ্রেণির ড্রোন বেবিচকে নিবন্ধন করে নিবন্ধন বা পরিচিতি নম্বর নিতে হবে। ক-শ্রেণির ড্রোন ৫ কেজির বেশি ওজনের হলে বা ১০০ ফুটের বেশি উঠতে পারলে নিবন্ধন বাধ্যতামূলক (অনুচ্ছেদ ৭)। নম্বরটি ড্রোনের গায়ে সহজে চোখে পড়ে এমন জায়গায় রং দিয়ে লিখতে হবে। নিবন্ধনে লাগবে:</p>
<ol class="stepsv">
<li>ব্যবহারের উদ্দেশ্য, ড্রোনের স্পেসিফিকেশন আর কেনার রশিদ।</li>
<li><b>BTRC এর প্রত্যয়নপত্র</b>, যাতে দেখানো থাকবে ড্রোনের ফ্রিকোয়েন্সি রেডিও, টেলিভিশন, মোবাইল, স্যাটেলাইট বা এভিয়েশন যোগাযোগে বাধা সৃষ্টি করবে না। এটা খ ও গ শ্রেণি আর ৫ কেজির বেশি ক-শ্রেণির ড্রোনের জন্য লাগবে (অনুচ্ছেদ ৭(চ))।</li>
<li>আবেদনকারীর ছবি, জাতীয় পরিচয়পত্রের কপি আর মোবাইল নম্বর।</li>
<li>ব্যাটারি ফুরিয়ে যাওয়া, নিয়ন্ত্রণ হারানো বা নিয়ন্ত্রণসীমার বাইরে চলে যাওয়ার মতো জরুরি অবস্থা সামলানোর লিখিত পরিকল্পনা।</li>
<li>প্রযোজ্য ক্ষেত্রে প্রতিরক্ষা মন্ত্রণালয়ের অনাপত্তিপত্র, আর বেবিচক চাইলে অন্য কাগজপত্র।</li>
</ol>
<h2>আমদানি আর তৈরি</h2>
<p>পেলোডসহ ৫ কেজির বেশি ওজনের ক, খ বা গ শ্রেণির ড্রোন বা যন্ত্রাংশ আমদানির আগে স্পেসিফিকেশন আর সংখ্যা উল্লেখ করে প্রতিরক্ষা মন্ত্রণালয়ের অনাপত্তি নিতে হবে। অনাপত্তি পাওয়ার ১ বছরের মধ্যে আমদানি করতে হবে, আর কাস্টমসে তা দেখাতে হবে (অনুচ্ছেদ ৬)। ৫ কেজির বেশি ওজনের ড্রোন তৈরিতে জননিরাপত্তা বিভাগের অনাপত্তি, আর কারখানা স্থাপনে প্রতিরক্ষা মন্ত্রণালয়ের অনাপত্তি লাগবে। খেলনা ড্রোন তৈরিতে কোনো অনুমতি লাগবে না।</p>
<h2>ওড়ানোর সময়ের নিয়ম</h2>
<ul>
<li>জনসমাগম, যান চলাচলের রাস্তা, বাজার ও বাণিজ্যিক এলাকা, আবাসিক ভবন আর অফিস-আদালত থেকে সবসময় অন্তত <b>৩০ মিটার</b> দূরে থাকতে হবে। কাছে ওড়াতে স্থানীয় প্রশাসন আর বেবিচকের অনুমতি লাগবে (অনুচ্ছেদ ৮(ণ))।</li>
<li>বিশেষ অনুমতি ছাড়া VVIP এর সভাস্থলের <b>২ কিমির</b> মধ্যে অনুষ্ঠানের ৩ দিন আগে থেকে ওড়ানো নিষেধ। সভা-সমাবেশ আর জাতীয় বা আন্তর্জাতিক খেলার ৫ কিমির মধ্যে বেবিচকের ANO মানতে হবে (অনুচ্ছেদ ৮(ট) ও (ঠ))।</li>
<li>KPI এর ৩ কিমির মধ্যে KPI কমিটির, আর বিমানবন্দরের ৩ কিমির মধ্যে বেবিচক ও বিমানবন্দরের পরিচালক বা ব্যবস্থাপকের অনুমোদন লাগবে (অনুচ্ছেদ ৮(ত))।</li>
<li>বেবিচকের অনুমোদনের কপি সবসময় সাথে রাখতে হবে, আর বেবিচক, পুলিশ বা নিরাপত্তা সংস্থা চাইলে দেখাতে হবে (অনুচ্ছেদ ৮(ড))।</li>
<li>অনুমতি ছাড়া ওড়ানো ড্রোন আকাশ প্রতিরক্ষা পরিচালনা কেন্দ্র ভূপাতিত করতে পারবে (অনুচ্ছেদ ৮(দ))।</li>
</ul>
<h2>কে ওড়াতে পারবেন</h2>
<p>ছোট ক-শ্রেণির ড্রোন বিনোদনের জন্য ওড়ানো ছাড়া অন্য সব ক্ষেত্রে চালকের বয়স অন্তত <b>১৮</b> হতে হবে, আর অন্তত <b>এসএসসি</b> বা সমমান পাস হতে হবে। বেবিচক নির্ধারিত প্রশিক্ষণ বা লাইসেন্স থাকতে হবে, আকাশসীমার তথ্য জানতে হবে, শারীরিক ও মানসিকভাবে সুস্থ থাকতে হবে। শরীরের স্বাভাবিক ক্ষমতা কমায় এমন ড্রাগ নেওয়ার <b>৮ ঘণ্টার</b> মধ্যে ওড়ানো যাবে না (অনুচ্ছেদ ১০)। চালককে বেবিচকের সার্টিফিকেট নিতে হবে (অনুচ্ছেদ ১১)।</p>
<h2>শাস্তি</h2>
<p>অনুমতি ছাড়া ওড়ালে বেবিচক, পুলিশ বা যেকোনো আইন প্রয়োগকারী সংস্থা ড্রোন উড্ডয়ন বন্ধ করতে পারবে। চালক, আর প্রযোজ্য ক্ষেত্রে তার নিয়োগকারী, দণ্ডবিধি, ১৮৬০ আর বেসামরিক বিমান চলাচল আইন, ২০১৭ অনুযায়ী শাস্তি পাবেন। মানুষ, প্রাণী, সম্পদ বা গোপনীয়তার ক্ষতি হলে ক্ষতিপূরণও দিতে হবে (অনুচ্ছেদ ৮(থ) ও ১৩)।</p>
<div class="callout warn">{WARN}<p>এটা গেজেটের সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। অনুমোদনের ধাপ আর ফরম ঠিক করে বেবিচক, প্রতিরক্ষা মন্ত্রণালয় আর BTRC।</p></div>'''

g=dict(slug='drone-registration-flying-policy-2020',icon='drone',color='--accent',
 title_en='Drone rules in Bangladesh: Drone Registration and Flying Policy 2020',
 title_bn='বাংলাদেশে ড্রোনের নিয়ম: ড্রোন নিবন্ধন ও উড্ডয়ন নীতিমালা ২০২০',
 sum_en='When you can fly a drone without permission, the green, yellow and red zones, registration with CAAB, the BTRC certificate, and import rules.',
 sum_bn='কখন অনুমতি ছাড়া ড্রোন ওড়ানো যায়, গ্রিন-ইয়েলো-রেড জোন, বেবিচকে নিবন্ধন, BTRC এর প্রত্যয়নপত্র আর আমদানির নিয়ম।',
 sources=[['Bangladesh Gazette, Extraordinary, 5 October 2020: Drone Registration and Flying Policy 2020 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(4,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
