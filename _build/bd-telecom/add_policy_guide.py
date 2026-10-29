import json
from add_law_guide import table, INFO, WARN, DL  # reuse helpers
PDF='/bd-telecom/docs/telecom-network-licensing-policy-2025.pdf'
def tx(x,y,en,bn,cls='',anchor='middle'):
    c=' class="%s"'%cls if cls else ''
    return '<text x="%d" y="%d" text-anchor="%s"%s><tspan data-en>%s</tspan><tspan data-bn>%s</tspan></text>'%(x,y,anchor,c,en,bn)
def box(x,y,w,h,col): return '<rect x="%d" y="%d" width="%d" height="%d" rx="12" style="fill:color-mix(in srgb,var(%s) 14%%,var(--surface));stroke:var(%s)" stroke-width="1.5"/>'%(x,y,w,h,col,col)
def arrow(x1,y1,x2,y2): return '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#ah)"/>'%(x1,y1,x2,y2)
svg=['<svg viewBox="0 0 640 430" role="img" aria-label="New licence structure: ICSP, NICSP, ANSP and TESP"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker></defs>',
 box(20,10,600,64,'--gp'), tx(320,36,'ICSP: International Connectivity','ICSP: আন্তর্জাতিক সংযোগ'), tx(320,58,'Submarine and land cables, IP transit, international calls and SMS','সাবমেরিন ও স্থল কেবল, IP ট্রানজিট, আন্তর্জাতিক কল ও SMS','s'),
 box(110,118,510,74,'--amber'), tx(365,145,'NICSP: National Infrastructure','NICSP: জাতীয় অবকাঠামো'), tx(365,166,'Fibre up to Union level, towers, leased to operators','ইউনিয়ন পর্যন্ত ফাইবার, টাওয়ার, অপারেটরদের কাছে লিজ','s'), tx(365,183,'Can also run voice interconnection and internet exchange','ভয়েস ইন্টারকানেকশন আর ইন্টারনেট এক্সচেঞ্জও চালাতে পারবে','s'),
 box(20,236,600,104,'--tt'), tx(320,260,'ANSP: Access Network (serves you)','ANSP: অ্যাক্সেস নেটওয়ার্ক (গ্রাহকের সেবাদাতা)'),
 box(40,274,270,52,'--tt'), tx(175,296,'Cellular Mobile','সেলুলার মোবাইল'), tx(175,315,'GP, Robi, Banglalink, Teletalk, MVNOs','জিপি, রবি, বাংলালিংক, টেলিটক, MVNO','s'),
 box(330,274,270,52,'--tt'), tx(465,296,'Fixed Telecom','ফিক্সড টেলিকম'), tx(465,315,'ISPs, PSTN; District licence for local ISPs','ISP, PSTN; লোকাল ISP এর জন্য জেলা লাইসেন্স','s'),
 box(170,374,300,46,'--accent'), tx(320,394,'TESP: Telecom-enabled services','TESP: টেলিকম-নির্ভর সেবা'), tx(320,411,'Enlistment only, e.g. SMS aggregators','শুধু তালিকাভুক্তি, যেমন SMS অ্যাগ্রিগেটর','s'),
 arrow(60,76,60,232), tx(68,104,'international','আন্তর্জাতিক','s','start'),
 arrow(365,194,365,232), arrow(320,342,320,370), '</svg>']
FIG_en='<figure class="figure">%s<figcaption>The new structure, drawn from Figure 1 of the policy. Satellite services (NTNSP) have their own separate licence.</figcaption></figure><p class="swipe">Swipe sideways to see the full diagram.</p>'
FIG_bn='<figure class="figure">%s<figcaption>নীতিমালার Figure 1 অনুযায়ী নতুন কাঠামো। স্যাটেলাইট সেবার (NTNSP) জন্য আলাদা লাইসেন্স।</figcaption></figure><p class="swipe">পুরো ছবি দেখতে পাশে সরান।</p>'
S=''.join(svg)

mig_en=[['Submarine cable; international terrestrial cable (ITC)','ICSP'],['International Gateway (IGW); International Internet Gateway (IIG); Interconnection Exchange (ICX)','Discontinued when current licence ends'],['National Internet Exchange (NIX)','Discontinued; operators keep equivalent peering'],['NTTN; tower sharing','NICSP'],['Cellular mobile operator','Cellular Mobile Service licence'],['PSTN; nationwide and divisional ISP','Fixed Telecom Service licence'],['District and Upazila/Thana ISP','District Fixed Telecom Service licence'],['IP telephony (IPTSP)','Merged into the matching ISP licence'],['Satellite operator; NGSO','Satellite Service licence (NTNSP)'],['VSAT','Special category of Fixed Telecom'],['Mobile Number Portability (MNP)','Continues until its term ends'],['Call centre; vehicle tracking; TVAS','No licence needed (deregulated)'],['SMS aggregator','Telecom Enabled Service enlistment']]
mig_bn=[['সাবমেরিন কেবল; আন্তর্জাতিক টেরেস্ট্রিয়াল কেবল (ITC)','ICSP'],['IGW; IIG; ICX','বর্তমান মেয়াদ শেষে বিলুপ্ত'],['ন্যাশনাল ইন্টারনেট এক্সচেঞ্জ (NIX)','বিলুপ্ত; অপারেটরদের সমতুল্য পিয়ারিং রাখতে হবে'],['NTTN; টাওয়ার শেয়ারিং','NICSP'],['সেলুলার মোবাইল অপারেটর','সেলুলার মোবাইল সার্ভিস লাইসেন্স'],['PSTN; দেশব্যাপী ও বিভাগীয় ISP','ফিক্সড টেলিকম সার্ভিস লাইসেন্স'],['জেলা ও উপজেলা/থানা ISP','জেলা ফিক্সড টেলিকম সার্ভিস লাইসেন্স'],['IP টেলিফোনি (IPTSP)','সংশ্লিষ্ট ISP লাইসেন্সের সাথে একীভূত'],['স্যাটেলাইট অপারেটর; NGSO','স্যাটেলাইট সার্ভিস লাইসেন্স (NTNSP)'],['VSAT','ফিক্সড টেলিকমের বিশেষ ক্যাটাগরি'],['মোবাইল নম্বর পোর্টেবিলিটি (MNP)','বর্তমান মেয়াদ পর্যন্ত চলবে'],['কল সেন্টার; ভেহিকল ট্র্যাকিং; TVAS','লাইসেন্স লাগবে না (ডিরেগুলেটেড)'],['SMS অ্যাগ্রিগেটর','টেলিকম এনাবলড সার্ভিস তালিকাভুক্তি']]

en=f'''<div class="callout">{INFO}<p><b>In short:</b> The government approved this policy on 18 September 2025 and published it in the gazette on 22 September 2025, in effect immediately. It replaces the ILDTS Policy 2010 and its many layers of licences (IGW, ICX, IIG and others) with four licence types and one enlistment. Existing licences stay valid until they expire.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the gazette (PDF, English)</span></a></div>
<h2>Why it changed</h2>
<p>The 2010 policy split international and domestic traffic across many separate licences, each one a toll gate. The policy itself says this raised costs, cut service quality, made it hard for new and smaller companies to enter, and sent some traffic abroad. The new framework is technology-neutral: a licensee can offer any service within its licence, whatever the technology.</p>
<h2>The new structure</h2>
{FIG_en % S}
<ul>
<li><b>ICSP (International Connectivity Service Provider)</b> carries all international voice, internet and data. Companies can get one without owning cables. Foreign ownership is capped at 49%.</li>
<li><b>NICSP (National Infrastructure and Connectivity Service Provider)</b> builds and leases fibre and towers across the country, with fibre reaching every Union. It can also run voice interconnection and internet exchange for operators.</li>
<li><b>ANSP (Access Network Service Provider)</b> is the company that serves you. It comes as two separate licences: Cellular Mobile (limited in number, because spectrum is limited) and Fixed Telecom (open to anyone eligible). A mobile operator cannot also hold a fixed licence.</li>
<li><b>NTNSP</b> covers satellite services, including VSAT, satellite internet and high-altitude platforms. Lawful interception is mandatory for this licence.</li>
<li><b>TESP</b> is a simple enlistment for telecom-enabled services such as SMS aggregation.</li>
</ul>
<p>A company in one layer cannot hold a licence in another. ANSP, NICSP and ICSP are kept separate, although state-owned companies can be exempted (clauses 7.2.12, 7.7.11, 7.8.10 and 13.2).</p>
<h2>What it means for mobile and internet users</h2>
<ol class="stepsv">
<li><b>New mobile brands (MVNOs).</b> Mobile Virtual Network Operators, which sell service on another operator's network, will get their own licence. BTRC will set the rules separately (clauses 7.2.10.5 and 7.3.5).</li>
<li><b>Better coverage and speed.</b> Within 3 years every mobile operator must run at least one nationwide coverage layer and two capacity layers per technology. That includes schools, ports, highways, railways and waterways. Operators must connect 50% of towers to fibre within 18 months and 80% within 3 years (clause 11.2).</li>
<li><b>No city-only launches.</b> A nationwide licensee cannot launch a service only in cities and leave out rural or poorer areas (clause 11.6).</li>
<li><b>Public quality data.</b> BTRC will publish a National QoS and Performance Dashboard with anonymised network data, and will measure speed, dropped calls and coverage (clause 11.3).</li>
<li><b>Notice before upgrades, and disaster alerts.</b> Upgrades that affect service need a scheduled window and advance notice to customers. All licensees must connect to the national emergency alert system (clause 11.4).</li>
<li><b>Number portability stays.</b> All mobile operators must allow quick, seamless number porting (clause 13.1).</li>
</ol>
<h2>Rules for operators</h2>
<ul>
<li><b>Foreign ownership.</b> Up to 85% for mobile operators, with at least 15% held locally, for example through a local partner or a stock market listing. Companies licensed under the Foreign Private Investment Act, 1980 get 3 years to comply. Fully local ownership is always allowed (clause 7.2.11). The cap is 65% for NICSPs, or 85% for those covered by the 1980 Act or GATS (clause 7.7.12), and 49% for ICSPs.</li>
<li><b>Shared infrastructure.</b> Operators lease fibre and towers from NICSPs, and build their own only where NICSPs cannot supply. They may share core networks, radio networks and spectrum, but spectrum sharing needs BTRC approval (clause 7.2).</li>
<li><b>Spectrum discounts.</b> A 10% discount on the spectrum fee for using at least 50% of new spectrum within 2 years, rising to 20% for 70% use within 3 years (clause 11.2.1).</li>
<li><b>Deadlines.</b> Rollout obligations must be met within 2 years of getting a licence, and KPIs within 1 year. Penalties range from fines to spectrum claw-back, suspension or cancellation (clause 11.7).</li>
<li><b>Network rules.</b> Fixed wireless (FWA) needs at least three frequency layers per technology. Diesel generators are required at 25% of towers in disaster-prone areas. New and renewing licensees must move to IPv6. Mobile operators must keep a 1:4 ratio between international internet traffic and locally cached content (clause 11.3).</li>
<li><b>Market power (SMP).</b> BTRC can impose remedies on dominant operators, such as price rules, sharing duties and separate accounts, through a new SMP Monitoring Unit. Success alone is not to be penalised (clause 11.8).</li>
<li><b>Interception.</b> Lawful interception only with valid legal authority under a judicial or quasi-judicial mandate, following necessity and proportionality. Every request is logged for independent audit (clause 12).</li>
</ul>
<h2>What happens to existing licences</h2>
{table(['Current licence','Under the new regime'],mig_en)}
<h2>Timeline</h2>
<ol class="stepsv">
<li><b>Stage 1, from approval (September 2025):</b> BTRC drafts guidelines for the new licences and updates existing ones.</li>
<li><b>Stage 2:</b> New licences open. Renewals and new applications are accepted only in the new categories, and existing licensees can migrate.</li>
<li><b>Stage 3, by 30 June 2027 (soft cut-off):</b> Most licensees will have moved over, and each old category gets its own firm cut-off date. Licensees that move early keep the time left on their old licence. The government gives no subsidy for migrating (clause 10).</li>
</ol>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the gazette, not legal or investment advice. Many details depend on BTRC guidelines that are still to be issued.</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> সরকার ১৮ সেপ্টেম্বর ২০২৫ এ এই নীতিমালা অনুমোদন করেছে, গেজেটে প্রকাশ হয়েছে ২২ সেপ্টেম্বর ২০২৫, আর তা অবিলম্বে কার্যকর। এটি ILDTS নীতিমালা ২০১০ বাতিল করে বহু স্তরের লাইসেন্সের (IGW, ICX, IIG ইত্যাদি) জায়গায় চার ধরনের লাইসেন্স আর একটি তালিকাভুক্তি এনেছে। বর্তমান লাইসেন্সগুলো মেয়াদ শেষ পর্যন্ত বৈধ থাকবে।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গেজেট ডাউনলোড (PDF, ইংরেজি)</span></a></div>
<h2>কেন বদলানো হলো</h2>
<p>২০১০ এর নীতিমালায় আন্তর্জাতিক আর দেশীয় ট্রাফিক অনেকগুলো আলাদা লাইসেন্সে ভাগ ছিল, প্রতিটা যেন একেকটা টোল গেট। নীতিমালাতেই বলা হয়েছে, এতে খরচ বেড়েছে, সেবার মান কমেছে, নতুন ও ছোট প্রতিষ্ঠানের ঢোকা কঠিন হয়েছে, আর কিছু ট্রাফিক বিদেশে চলে গেছে। নতুন কাঠামো প্রযুক্তি-নিরপেক্ষ: লাইসেন্সের আওতায় যেকোনো প্রযুক্তিতে যেকোনো সেবা দেওয়া যাবে।</p>
<h2>নতুন কাঠামো</h2>
{FIG_bn % S}
<ul>
<li><b>ICSP (আন্তর্জাতিক সংযোগ সেবাদাতা)</b> সব আন্তর্জাতিক ভয়েস, ইন্টারনেট আর ডেটা বহন করবে। নিজের কেবল না থাকলেও এই লাইসেন্স নেওয়া যাবে। বিদেশি মালিকানা সর্বোচ্চ ৪৯%।</li>
<li><b>NICSP (জাতীয় অবকাঠামো ও সংযোগ সেবাদাতা)</b> সারা দেশে ফাইবার আর টাওয়ার বানিয়ে লিজ দেবে, ফাইবার যাবে প্রতিটা ইউনিয়ন পর্যন্ত। অপারেটরদের জন্য ভয়েস ইন্টারকানেকশন আর ইন্টারনেট এক্সচেঞ্জও চালাতে পারবে।</li>
<li><b>ANSP (অ্যাক্সেস নেটওয়ার্ক সেবাদাতা)</b> সেই প্রতিষ্ঠান, যারা সরাসরি গ্রাহককে সেবা দেয়। দুটো আলাদা লাইসেন্স: সেলুলার মোবাইল (তরঙ্গ সীমিত বলে সংখ্যাও সীমিত) আর ফিক্সড টেলিকম (যোগ্য যে কারও জন্য খোলা)। মোবাইল অপারেটর ফিক্সড লাইসেন্স নিতে পারবে না।</li>
<li><b>NTNSP</b> হলো স্যাটেলাইট সেবার লাইসেন্স, এর মধ্যে VSAT, স্যাটেলাইট ইন্টারনেট আর হাই-অল্টিচিউড প্ল্যাটফর্ম আছে। এই লাইসেন্সে আইনানুগ ইন্টারসেপশনের ব্যবস্থা বাধ্যতামূলক।</li>
<li><b>TESP</b> হলো SMS অ্যাগ্রিগেশনের মতো টেলিকম-নির্ভর সেবার সহজ তালিকাভুক্তি।</li>
</ul>
<p>এক স্তরের প্রতিষ্ঠান অন্য স্তরের লাইসেন্স নিতে পারবে না। ANSP, NICSP আর ICSP আলাদা থাকবে, তবে সরকারি প্রতিষ্ঠানকে ছাড় দেওয়া যেতে পারে (ধারা ৭.২.১২, ৭.৭.১১, ৭.৮.১০ ও ১৩.২)।</p>
<h2>মোবাইল ও ইন্টারনেট গ্রাহকের জন্য কী বদলাবে</h2>
<ol class="stepsv">
<li><b>নতুন মোবাইল ব্র্যান্ড (MVNO)।</b> অন্য অপারেটরের নেটওয়ার্কে সেবা বিক্রি করা মোবাইল ভার্চুয়াল নেটওয়ার্ক অপারেটরদের জন্য আলাদা লাইসেন্স আসবে। নিয়মকানুন BTRC আলাদাভাবে ঠিক করবে (ধারা ৭.২.১০.৫ ও ৭.৩.৫)।</li>
<li><b>ভালো কভারেজ আর গতি।</b> ৩ বছরের মধ্যে প্রতিটা মোবাইল অপারেটরকে প্রতি প্রযুক্তিতে অন্তত একটি দেশব্যাপী কভারেজ লেয়ার আর দুটি ক্যাপাসিটি লেয়ার চালু রাখতে হবে। এর মধ্যে স্কুল, বন্দর, মহাসড়ক, রেলপথ আর নৌপথও আছে। ১৮ মাসে ৫০% আর ৩ বছরে ৮০% টাওয়ার ফাইবারে যুক্ত করতে হবে (ধারা ১১.২)।</li>
<li><b>শুধু শহরে সেবা চালু নয়।</b> দেশব্যাপী লাইসেন্সধারী শুধু শহরে কোনো সেবা চালু করে গ্রাম বা দরিদ্র এলাকা বাদ রাখতে পারবে না (ধারা ১১.৬)।</li>
<li><b>মানের তথ্য প্রকাশ্যে।</b> BTRC নাম-পরিচয়হীন নেটওয়ার্ক ডেটা দিয়ে একটি জাতীয় QoS ও পারফরম্যান্স ড্যাশবোর্ড চালু করবে, আর গতি, কল ড্রপ ও কভারেজ মাপবে (ধারা ১১.৩)।</li>
<li><b>আপগ্রেডের আগে নোটিশ, দুর্যোগে সতর্কবার্তা।</b> সেবায় প্রভাব ফেলা আপগ্রেডের জন্য নির্ধারিত সময় আর গ্রাহককে আগাম নোটিশ লাগবে। সব লাইসেন্সধারীকে জাতীয় জরুরি সতর্কবার্তা ব্যবস্থায় যুক্ত থাকতে হবে (ধারা ১১.৪)।</li>
<li><b>নম্বর পোর্টেবিলিটি থাকছে।</b> সব মোবাইল অপারেটরকে দ্রুত আর ঝামেলাহীনভাবে নম্বর পোর্ট করতে দিতে হবে (ধারা ১৩.১)।</li>
</ol>
<h2>অপারেটরদের জন্য নিয়ম</h2>
<ul>
<li><b>বিদেশি মালিকানা।</b> মোবাইল অপারেটরে সর্বোচ্চ ৮৫%, আর অন্তত ১৫% দেশীয় মালিকানা, যেমন স্থানীয় অংশীদার বা শেয়ারবাজারে তালিকাভুক্তির মাধ্যমে। বৈদেশিক বেসরকারি বিনিয়োগ আইন, ১৯৮০ এর অধীনে লাইসেন্স পাওয়া প্রতিষ্ঠান মানতে ৩ বছর সময় পাবে। পুরো দেশীয় মালিকানা সবসময় চলবে (ধারা ৭.২.১১)। NICSP তে সীমা ৬৫%, ১৯৮০ এর আইন বা GATS এর আওতাভুক্ত হলে ৮৫% (ধারা ৭.৭.১২), আর ICSP তে ৪৯%।</li>
<li><b>অবকাঠামো ভাগাভাগি।</b> অপারেটররা NICSP থেকে ফাইবার আর টাওয়ার লিজ নেবে, NICSP দিতে না পারলে তবেই নিজে বানাবে। কোর নেটওয়ার্ক, রেডিও নেটওয়ার্ক আর তরঙ্গ শেয়ার করা যাবে, তবে তরঙ্গ শেয়ারে BTRC এর অনুমোদন লাগবে (ধারা ৭.২)।</li>
<li><b>তরঙ্গে ছাড়।</b> নতুন তরঙ্গের অন্তত ৫০% দুই বছরে কাজে লাগালে তরঙ্গ ফিতে ১০% ছাড়, আর তিন বছরে ৭০% হলে ২০% (ধারা ১১.২.১)।</li>
<li><b>সময়সীমা।</b> লাইসেন্স পাওয়ার ২ বছরের মধ্যে রোলআউটের শর্ত আর ১ বছরের মধ্যে KPI পূরণ করতে হবে। না পারলে জরিমানা থেকে শুরু করে তরঙ্গ ফেরত নেওয়া, স্থগিত বা বাতিল পর্যন্ত হতে পারে (ধারা ১১.৭)।</li>
<li><b>নেটওয়ার্কের নিয়ম।</b> ফিক্সড ওয়্যারলেস (FWA) এর জন্য প্রতি প্রযুক্তিতে অন্তত তিনটি ফ্রিকোয়েন্সি লেয়ার লাগবে। দুর্যোগপ্রবণ এলাকার ২৫% টাওয়ারে ডিজেল জেনারেটর রাখতে হবে। নতুন ও নবায়নকারী লাইসেন্সধারীকে IPv6 এ যেতে হবে। মোবাইল অপারেটরকে আন্তর্জাতিক ইন্টারনেট ট্রাফিক আর লোকাল ক্যাশ কনটেন্টের অনুপাত ১:৪ রাখতে হবে (ধারা ১১.৩)।</li>
<li><b>বাজার আধিপত্য (SMP)।</b> নতুন SMP মনিটরিং ইউনিটের মাধ্যমে BTRC প্রভাবশালী অপারেটরের ওপর দামের নিয়ম, শেয়ারিংয়ের দায়িত্ব বা আলাদা হিসাবের মতো প্রতিকার আরোপ করতে পারবে। শুধু সফল হওয়ার জন্য কাউকে শাস্তি দেওয়া যাবে না (ধারা ১১.৮)।</li>
<li><b>ইন্টারসেপশন।</b> বৈধ আইনি অনুমোদন আর বিচারিক বা আধা-বিচারিক নির্দেশ থাকলেই কেবল আইনানুগ ইন্টারসেপশন, প্রয়োজনীয়তা ও আনুপাতিকতা মেনে। প্রতিটা অনুরোধ স্বাধীন নিরীক্ষার জন্য লগ করা থাকবে (ধারা ১২)।</li>
</ul>
<h2>বর্তমান লাইসেন্সের কী হবে</h2>
{table(['বর্তমান লাইসেন্স','নতুন ব্যবস্থায়'],mig_bn)}
<h2>সময়রেখা</h2>
<ol class="stepsv">
<li><b>ধাপ ১, অনুমোদন থেকে (সেপ্টেম্বর ২০২৫):</b> BTRC নতুন লাইসেন্সের গাইডলাইন তৈরি করবে আর পুরনোগুলো হালনাগাদ করবে।</li>
<li><b>ধাপ ২:</b> নতুন লাইসেন্স চালু হবে। নবায়ন আর নতুন আবেদন শুধু নতুন ক্যাটাগরিতে গ্রহণ করা হবে, আর বর্তমান লাইসেন্সধারীরা স্থানান্তর হতে পারবে।</li>
<li><b>ধাপ ৩, ৩০ জুন ২০২৭ এর মধ্যে (সফট কাট-অফ):</b> বেশিরভাগ লাইসেন্সধারী নতুন ব্যবস্থায় চলে যাবে, আর প্রতিটা পুরনো ক্যাটাগরির জন্য আলাদা চূড়ান্ত কাট-অফ তারিখ থাকবে। আগে স্থানান্তর হলে পুরনো লাইসেন্সের বাকি মেয়াদ নতুনটায় যোগ হবে। স্থানান্তরের জন্য সরকার কোনো ভর্তুকি দেবে না (ধারা ১০)।</li>
</ol>
<div class="callout warn">{WARN}<p>এটা গেজেটের সহজ ভাষার সারাংশ, আইনি বা বিনিয়োগ পরামর্শ নয়। অনেক খুঁটিনাটি BTRC এর গাইডলাইনের ওপর নির্ভর করবে, যা এখনো আসা বাকি।</p></div>'''

g=dict(slug='telecom-network-licensing-policy-2025',icon='layers',color='--amber',
 title_en='Telecommunications Network and Licensing Policy 2025, explained',
 title_bn='টেলিযোগাযোগ নেটওয়ার্ক ও লাইসেন্সিং নীতিমালা ২০২৫: সহজ ভাষায়',
 sum_en='The policy that replaces IGW, ICX and IIG with four licence types: what changes for users, operators and ISPs, and the timeline to June 2027.',
 sum_bn='IGW, ICX আর IIG এর বদলে চার ধরনের লাইসেন্স: গ্রাহক, অপারেটর আর ISP এর জন্য কী বদলাচ্ছে, আর জুন ২০২৭ পর্যন্ত সময়রেখা।',
 sources=[['Bangladesh Gazette, Extraordinary, 22 September 2025: Telecommunications Network and Licensing Policy 2025 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(1,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(G))
