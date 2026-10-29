import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/qos-directives-2025.pdf'
mob_en=[['Call setup success (2G)','≥ 99% network, ≥ 98% district and upazila'],['VoLTE call setup success','≥ 99% network'],['Call drop rate (2G)','≤ 1% network, ≤ 1.5% district and upazila'],['VoLTE drop rate','≤ 0.5% network'],['4G average download speed','≥ 3.5 Mbps network, ≥ 2.5 Mbps district'],['SMS completion rate','> 98%'],['Tower (BTS / eNodeB) downtime','< 1% a month']]
mob_bn=[['কল সেটআপ সাফল্য (2G)','নেটওয়ার্কে ≥ ৯৯%, জেলা ও উপজেলায় ≥ ৯৮%'],['VoLTE কল সেটআপ সাফল্য','নেটওয়ার্কে ≥ ৯৯%'],['কল ড্রপ হার (2G)','নেটওয়ার্কে ≤ ১%, জেলা ও উপজেলায় ≤ ১.৫%'],['VoLTE ড্রপ হার','নেটওয়ার্কে ≤ ০.৫%'],['4G গড় ডাউনলোড গতি','নেটওয়ার্কে ≥ ৩.৫ Mbps, জেলায় ≥ ২.৫ Mbps'],['SMS পৌঁছানোর হার','> ৯৮%'],['টাওয়ার (BTS / eNodeB) বন্ধ থাকার সময়','মাসে < ১%']]
drv_en=[['Call setup success','> 98%'],['Call drop rate','< 2%'],['Call setup time','< 7 sec (2G), < 8 sec (CSFB), < 3 sec (VoLTE)'],['Voice quality (MOS, VoLTE)','> 3.5 out of 5'],['4G speed','Download > 10 Mbps, upload > 2 Mbps'],['Latency','< 70 ms'],['4G signal (RSRP), 90% of samples','Outdoor > −110 dBm, indoor > −115 dBm']]
drv_bn=[['কল সেটআপ সাফল্য','> ৯৮%'],['কল ড্রপ হার','< ২%'],['কল সেটআপ সময়','< ৭ সেকেন্ড (2G), < ৮ সেকেন্ড (CSFB), < ৩ সেকেন্ড (VoLTE)'],['কণ্ঠের মান (MOS, VoLTE)','৫ এর মধ্যে > ৩.৫'],['4G গতি','ডাউনলোড > ১০ Mbps, আপলোড > ২ Mbps'],['ল্যাটেন্সি','< ৭০ মি.সে.'],['4G সিগন্যাল (RSRP), ৯০% নমুনায়','বাইরে > −১১০ dBm, ভেতরে > −১১৫ dBm']]
fix_en=[['Speed at your end (spot test)','> 95% of your package speed, download and upload'],['Speed in the network','> 100% of package speed'],['Ping to the national internet exchange','< 25 ms'],['Packet loss','< 1%'],['Web page load (Facebook, Google, YouTube)','< 3 sec'],['Repair time (MTTR)','Grade A < 4 h, B < 6 h, C < 8 h']]
fix_bn=[['আপনার প্রান্তে গতি (স্পট টেস্ট)','প্যাকেজের গতির > ৯৫%, ডাউনলোড ও আপলোড'],['নেটওয়ার্কে গতি','প্যাকেজের গতির > ১০০%'],['জাতীয় ইন্টারনেট এক্সচেঞ্জ পর্যন্ত পিং','< ২৫ মি.সে.'],['প্যাকেট লস','< ১%'],['ওয়েব পেজ লোড (ফেসবুক, গুগল, ইউটিউব)','< ৩ সেকেন্ড'],['মেরামতের সময় (MTTR)','গ্রেড A < ৪ ঘণ্টা, B < ৬ ঘণ্টা, C < ৮ ঘণ্টা']]
cc_en=[['Billing complaints resolved','100% within 28 days'],['Customer care calls answered by a person','90% within 40 sec, 100% within 90 sec'],['Complaints resolved','90% within 5 working days'],['Time in the IVR menu','< 15 sec']]
cc_bn=[['বিল সংক্রান্ত অভিযোগের সমাধান','২৮ দিনের মধ্যে ১০০%'],['কাস্টমার কেয়ারে মানুষের কল ধরা','৪০ সেকেন্ডে ৯০%, ৯০ সেকেন্ডে ১০০%'],['অভিযোগের সমাধান','৫ কার্যদিবসে ৯০%'],['IVR মেনুতে সময়','< ১৫ সেকেন্ড']]

en=f'''<div class="callout">{INFO}<p><b>In short:</b> BTRC's Engineering and Operations Division issued these directives on <b>2 September 2025</b>, in force immediately (memo 14.32.0000.000.800.48.0001.25.1332). They set minimum standards for mobile, fixed internet, landline and NTTN networks, and for customer care. Operators must report every month and fix problems within set deadlines.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the directives (PDF, English)</span></a></div>
<h2>Mobile: measured inside the network</h2>
<p>Operators calculate these from their own network systems, averaged over the six busiest hours of each day, for one month (Schedule 1, Table 1). Up to 5 districts in the hill tracts, the Sundarbans and border areas can be exempted in a month. The upazila targets must be met in at least two-thirds of upazilas.</p>
{table(['Indicator','Benchmark'],mob_en)}
<h2>Mobile: measured on the road</h2>
<p>Every quarter, operators drive-test public roads and highways, railway routes, and busy places such as markets, malls, universities and bus and rail stations (section 7b). These are the averages they must hit (Table 2). Indoor results and one-off spot tests guide fixes but do not count as a breach.</p>
{table(['Indicator','Benchmark'],drv_en)}
<h2>Home and office internet</h2>
{table(['Indicator','Benchmark'],fix_en)}
<p>Spot tests at the user's end are done in good network conditions (Table 5). ISPs fall into grades A, B and C under BTRC's grade-of-service directives, with Grade A the best. The jitter limit is printed as "&lt; 15 sec" in the directive.</p>
<h2>Customer care</h2>
<p>These apply to every mobile, fixed and internet operator that serves customers directly (Table 7).</p>
{table(['Indicator','Benchmark'],cc_en)}
<h2>What happens when an operator falls short</h2>
<ol class="stepsv">
<li><b>Notice.</b> BTRC finds a shortfall through drive tests, reports or inspection and sends a notice or a show-cause (section 5a).</li>
<li><b>15 days:</b> the operator sends a root-cause analysis and a plan, naming the problem cells or areas (section 5c).</li>
<li><b>30 days:</b> the operator fixes the problem and sends a compliance report, or asks BTRC for more time within those 30 days (section 5b).</li>
<li><b>60 days:</b> where it applies, the operator confirms that all shortfalls are fixed (section 5c).</li>
<li><b>Repeat breach:</b> BTRC re-tests. A further breach brings another show-cause and can lead to an administrative fine under the 2001 Act. Sending false or incomplete reports is also a breach (sections 5d and 10).</li>
</ol>
<h2>Reports and publication</h2>
<ul>
<li>Monthly reports within 10 days of each month's end, and quarterly drive-test reports within 20 days of each quarter's end. Operators also report their worst 50 cells every month (section 7, Table 8).</li>
<li>Raw records are kept for at least one year after reporting (section 6).</li>
<li>Every operator must publish its own performance against these benchmarks. BTRC may publish compliance reports, test results, customer survey results, a ranking of operators and a Network Performance Score (section 8).</li>
<li>BTRC may use crowdsourced speed tests and encourage operators to build a shared speed-test app (section 4).</li>
</ul>
<h2>What you can do</h2>
<ul>
<li>Run a speed test on your home connection. Below 95% of your package speed is short of the user-end benchmark, so tell your ISP.</li>
<li>Note dropped calls, slow 4G and long waits at customer care, with dates and places. Complain to your operator first. If it is not fixed, call BTRC on 100.</li>
</ul>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the BTRC directives, not legal advice. BTRC can add clarifications or amend them by gazette notice (section 11).</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> BTRC এর ইঞ্জিনিয়ারিং এন্ড অপারেশনস বিভাগ এই নির্দেশিকা জারি করেছে <b>২ সেপ্টেম্বর ২০২৫</b> এ, আর তা তখনই কার্যকর (স্মারক নং ১৪.৩২.০০০০.০০০.৮০০.৪৮.০০০১.২৫.১৩৩২)। এতে মোবাইল, ফিক্সড ইন্টারনেট, ল্যান্ডফোন আর NTTN নেটওয়ার্ক এবং কাস্টমার কেয়ারের ন্যূনতম মান ঠিক করা হয়েছে। অপারেটরদের প্রতি মাসে রিপোর্ট দিতে হবে আর নির্দিষ্ট সময়ের মধ্যে সমস্যা ঠিক করতে হবে।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>নির্দেশিকা ডাউনলোড (PDF, ইংরেজি)</span></a></div>
<h2>মোবাইল: নেটওয়ার্কের ভেতরের হিসাব</h2>
<p>অপারেটররা নিজেদের নেটওয়ার্ক সিস্টেম থেকে এগুলো হিসাব করে। প্রতিদিনের সবচেয়ে ব্যস্ত ছয় ঘণ্টার গড় নেওয়া হয়, এক মাসের জন্য (শিডিউল ১, টেবিল ১)। পার্বত্য জেলা, সুন্দরবন আর সীমান্ত এলাকার সর্বোচ্চ ৫টি জেলা কোনো মাসে ছাড় পেতে পারে। উপজেলার লক্ষ্য অন্তত দুই-তৃতীয়াংশ উপজেলায় পূরণ করতে হবে।</p>
{table(['সূচক','মানদণ্ড'],mob_bn)}
<h2>মোবাইল: রাস্তায় পরীক্ষা</h2>
<p>প্রতি তিন মাসে অপারেটররা সড়ক ও মহাসড়ক, রেলপথ আর বাজার, শপিং মল, বিশ্ববিদ্যালয়, বাস ও রেল স্টেশনের মতো ব্যস্ত জায়গায় ড্রাইভ টেস্ট করবে (অনুচ্ছেদ ৭খ)। এই গড়গুলো পূরণ করতে হবে (টেবিল ২)। ঘরের ভেতরের ফল আর আলাদা স্পট টেস্ট দিয়ে সংশোধনের নির্দেশ দেওয়া হয়, তবে সেগুলো লঙ্ঘন হিসেবে গণ্য হয় না।</p>
{table(['সূচক','মানদণ্ড'],drv_bn)}
<h2>বাসা ও অফিসের ইন্টারনেট</h2>
{table(['সূচক','মানদণ্ড'],fix_bn)}
<p>গ্রাহক প্রান্তের স্পট টেস্ট হয় ভালো নেটওয়ার্ক অবস্থায় (টেবিল ৫)। BTRC এর গ্রেড অব সার্ভিস নির্দেশনায় ISP গুলো A, B আর C গ্রেডে ভাগ করা, A সবচেয়ে ভালো। নির্দেশিকায় জিটারের সীমা লেখা আছে "&lt; 15 sec"।</p>
<h2>কাস্টমার কেয়ার</h2>
<p>সরাসরি গ্রাহককে সেবা দেয় এমন সব মোবাইল, ফিক্সড আর ইন্টারনেট অপারেটরের জন্য প্রযোজ্য (টেবিল ৭)।</p>
{table(['সূচক','মানদণ্ড'],cc_bn)}
<h2>অপারেটর মান পূরণ না করলে</h2>
<ol class="stepsv">
<li><b>নোটিশ।</b> ড্রাইভ টেস্ট, রিপোর্ট বা পরিদর্শনে ঘাটতি পেলে BTRC নোটিশ বা কারণ দর্শানোর নোটিশ দেবে (অনুচ্ছেদ ৫ক)।</li>
<li><b>১৫ দিন:</b> সমস্যার সেল বা এলাকা চিহ্নিত করে অপারেটর মূল কারণের বিশ্লেষণ আর পরিকল্পনা জমা দেবে (অনুচ্ছেদ ৫গ)।</li>
<li><b>৩০ দিন:</b> সমস্যা ঠিক করে কমপ্লায়েন্স রিপোর্ট দেবে, অথবা এই ৩০ দিনের মধ্যেই BTRC এর কাছে বাড়তি সময় চাইবে (অনুচ্ছেদ ৫খ)।</li>
<li><b>৬০ দিন:</b> প্রযোজ্য ক্ষেত্রে সব ঘাটতি ঠিক হয়েছে বলে নিশ্চিত করবে (অনুচ্ছেদ ৫গ)।</li>
<li><b>আবার লঙ্ঘন:</b> BTRC আবার পরীক্ষা করবে। আবারও লঙ্ঘন হলে নতুন কারণ দর্শানোর নোটিশ, আর ২০০১ সালের আইনে প্রশাসনিক জরিমানা হতে পারে। মিথ্যা বা অসম্পূর্ণ রিপোর্ট দেওয়াও লঙ্ঘন (অনুচ্ছেদ ৫ঘ ও ১০)।</li>
</ol>
<h2>রিপোর্ট আর প্রকাশ</h2>
<ul>
<li>প্রতি মাস শেষের ১০ দিনের মধ্যে মাসিক রিপোর্ট, আর প্রতি তিন মাস শেষের ২০ দিনের মধ্যে ড্রাইভ টেস্টের রিপোর্ট। প্রতি মাসে সবচেয়ে খারাপ ৫০টি সেলের রিপোর্টও দিতে হবে (অনুচ্ছেদ ৭, টেবিল ৮)।</li>
<li>মূল রেকর্ড রিপোর্ট দেওয়ার পর অন্তত এক বছর রাখতে হবে (অনুচ্ছেদ ৬)।</li>
<li>প্রতিটি অপারেটরকে এই মানদণ্ডের তুলনায় নিজের পারফরম্যান্স প্রকাশ করতে হবে। BTRC কমপ্লায়েন্স রিপোর্ট, টেস্টের ফল, গ্রাহক জরিপের ফল, অপারেটরদের র‍্যাংকিং আর নেটওয়ার্ক পারফরম্যান্স স্কোর প্রকাশ করতে পারবে (অনুচ্ছেদ ৮)।</li>
<li>BTRC ক্রাউডসোর্সড স্পিড টেস্ট ব্যবহার করতে পারবে, আর অপারেটরদের একসাথে স্পিড টেস্ট অ্যাপ বানাতে উৎসাহ দিতে পারবে (অনুচ্ছেদ ৪)।</li>
</ul>
<h2>আপনি যা করতে পারেন</h2>
<ul>
<li>বাসার সংযোগে স্পিড টেস্ট করুন। প্যাকেজের গতির ৯৫% এর কম পেলে তা গ্রাহক প্রান্তের মানদণ্ডের নিচে, তাই ISP কে জানান।</li>
<li>কল ড্রপ, ধীর 4G আর কাস্টমার কেয়ারে দীর্ঘ অপেক্ষার তারিখ ও জায়গা লিখে রাখুন। আগে অপারেটরের কাছে অভিযোগ করুন। সমাধান না হলে BTRC এর ১০০ নম্বরে ফোন করুন।</li>
</ul>
<div class="callout warn">{WARN}<p>এটা BTRC নির্দেশিকার সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। BTRC ব্যাখ্যা যোগ করতে বা গেজেট প্রজ্ঞাপনে সংশোধন করতে পারে (অনুচ্ছেদ ১১)।</p></div>'''

g=dict(slug='qos-directives-2025',icon='signal',color='--gp',
 title_en='Mobile and internet quality standards: BTRC QoS Directives 2025',
 title_bn='মোবাইল ও ইন্টারনেটের মান: BTRC এর QoS নির্দেশিকা ২০২৫',
 sum_en='The minimum call, speed, coverage and customer care standards BTRC sets for operators, how they are tested, and what happens when they fall short.',
 sum_bn='কল, গতি, কভারেজ আর কাস্টমার কেয়ারে BTRC যে ন্যূনতম মান ঠিক করেছে, কীভাবে পরীক্ষা হয়, আর মান পূরণ না হলে কী হয়।',
 sources=[['BTRC: Directives on Quality of Service (QoS), 2 September 2025 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(3,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
