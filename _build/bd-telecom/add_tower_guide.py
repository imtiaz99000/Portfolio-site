import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/tower-sharing-licensing-guidelines-2018.pdf'
LIST='/bd-telecom/docs/tower-sharing-licensees-2024-12.pdf'
lic_en=[['edotco Bangladesh Co. Limited','14.32.0000.702.44.205.18.01','31 Oct 2033'],['Summit Towers Limited','14.32.0000.702.44.204.18.02','31 Oct 2033'],['Kirtonkhola Tower Bangladesh Limited','14.32.0000.702.44.203.18.03','31 Oct 2033'],['Frontier Towers Bangladesh Ltd.','14.32.0000.702.44.206.18.04','31 Oct 2033']]
lic_bn=[['edotco Bangladesh Co. Limited','১৪.৩২.০০০০.৭০২.৪৪.২০৫.১৮.০১','৩১ অক্টোবর ২০৩৩'],['Summit Towers Limited','১৪.৩২.০০০০.৭০২.৪৪.২০৪.১৮.০২','৩১ অক্টোবর ২০৩৩'],['Kirtonkhola Tower Bangladesh Limited','১৪.৩২.০০০০.৭০২.৪৪.২০৩.১৮.০৩','৩১ অক্টোবর ২০৩৩'],['Frontier Towers Bangladesh Ltd.','১৪.৩২.০০০০.৭০২.৪৪.২০৬.১৮.০৪','৩১ অক্টোবর ২০৩৩']]
DS='https://www.thedailystar.net/business/news/four-firms-get-tower-licences-1655044'
fees_en=[['Application / processing fee','Tk 5 lakh'],['Licence acquisition fee (one time, within 30 days of the award)','Tk 25 crore'],['Annual licence fee (from the 2nd year)','Tk 5 crore'],['Gross revenue sharing','0% in the 1st year, 5.5% from the 2nd year'],['Social Obligation Fund','1% from the 2nd year'],['Performance bank guarantee (5-year validity)','Tk 20 crore'],['Offer security money','Tk 1 crore']]
fees_bn=[['আবেদন / প্রসেসিং ফি','৫ লাখ টাকা'],['লাইসেন্স অ্যাকুইজিশন ফি (একবার, নির্বাচনের ৩০ দিনের মধ্যে)','২৫ কোটি টাকা'],['বার্ষিক লাইসেন্স ফি (২য় বছর থেকে)','৫ কোটি টাকা'],['গ্রস রেভিনিউ শেয়ারিং','১ম বছরে ০%, ২য় বছর থেকে ৫.৫%'],['সোশ্যাল অবলিগেশন ফান্ড','২য় বছর থেকে ১%'],['পারফরম্যান্স ব্যাংক গ্যারান্টি (৫ বছর মেয়াদি)','২০ কোটি টাকা'],['অফার সিকিউরিটি মানি','১ কোটি টাকা']]
ro_en=[['Year 1','All divisional headquarters'],['Year 2','All district headquarters'],['Year 3','30% of all upazilas'],['Year 4','60% of all upazilas'],['Year 5','All upazilas']]
ro_bn=[['১ম বছর','সব বিভাগীয় সদর'],['২য় বছর','সব জেলা সদর'],['৩য় বছর','সব উপজেলার ৩০%'],['৪র্থ বছর','সব উপজেলার ৬০%'],['৫ম বছর','সব উপজেলা']]

en=f'''<div class="callout">{INFO}<p><b>In short:</b> BTRC issued these guidelines on 1 April 2018, with government approval. They created a separate licence for companies that build, buy and rent out mobile towers. Mobile operators then had to stop renting towers to each other and hand that business over to the tower companies, area by area, over five years.</p></div>
<div class="callout warn">{WARN}<p><b>Changing again.</b> Under the Telecommunications Network and Licensing Policy 2025, tower sharing licences can migrate to the new NICSP (National Infrastructure and Connectivity Service Provider) licence. Read the <a href="/bd-telecom/guides/telecom-network-licensing-policy-2025/">2025 policy guide</a> for what comes next.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the guidelines (PDF, English)</span></a></div>
<h2>Why tower sharing</h2>
<p>BTRC's aim was for two or more operators to use the same tower instead of each building its own. That saves land, power and money, cuts environmental harm, and lowers the cost of entry for new operators (sections 1.04 and 3). A tower company rents space on its towers to mobile operators and other licensed users, on equal terms for all.</p>
<h2>Who could get a licence</h2>
<ul>
<li>Bangladeshi companies, partnerships or consortiums. A foreign partner could hold up to <b>70%</b>, paid in foreign currency with no local bank loans during the rollout period. There was no limit for non-resident Bangladeshi partners (section 5).</li>
<li>The applicant or its foreign partner needed at least <b>3 years</b> of experience running at least <b>5,000 towers</b> (section 5.6).</li>
<li><b>Mobile and BWA operators were not eligible</b>. Any applicant holding their shares had to sell them before the award (sections 5.4 and 5.5).</li>
<li>A maximum of <b>4 licences</b>, one per company, all nationwide (sections 5.7 and 7). Each licence runs for <b>15 years</b>, then renews in 5-year terms with government approval (section 8).</li>
<li>Applications were scored out of 100. The biggest scores were for technical design (20), global footprint (15) and financial plan (15) (Appendix 5).</li>
</ul>
<h2>What a tower company can and cannot do</h2>
<ul>
<li>It can build, buy, own, rent, lease, operate and maintain towers anywhere in the country (section 14.01).</li>
<li>It cannot build optical or wired backbone networks, and cannot sell telecom services to end users (sections 13.02 and 13.04).</li>
<li>It must rent to all licensed operators without discrimination, under a service level agreement vetted by BTRC. Building towers in border areas needs BTRC permission (sections 14.03 and 14.04).</li>
<li>It must have its maximum tariff approved by BTRC before offering service (section 22).</li>
</ul>
<h2>Rollout: five years to cover the country</h2>
<p>Operation had to start within <b>6 months</b> of the licence, and the rollout clock started 180 days after issue. At least <b>10%</b> of the towers needed had to be newly built. The rest could be bought, leased or rented from existing operators (section 17).</p>
{table(['Year of rollout','Tower sharing service must cover'],ro_en)}
<h2>What changed for mobile operators</h2>
<ol class="stepsv">
<li><b>Roll back their own tower renting.</b> As the tower companies covered each area, operators had to stop sharing, leasing or renting towers to each other there, on the same five-year schedule (section 18.01).</li>
<li><b>No new shared towers where a tower company exists.</b> Operators cannot build, share, lease or rent towers with other operators where a tower company's towers are already available (section 18.02).</li>
<li><b>Ask first, build only if refused.</b> An operator asks the tower company for space and tells BTRC. The tower company must confirm within 30 days and provide it within 90 days. If it fails, the operator can build its own tower with BTRC approval, but only for its own use (sections 18.03 and 18.04).</li>
<li><b>Sell towers to tower companies.</b> Operators may sell, lease or rent their existing towers to tower companies (section 18.05).</li>
</ol>
<h2>Fees</h2>
{table(['Fee','Amount (excluding VAT)'],fees_en)}
<p>Late payment of the annual fee or revenue share costs 15% a year for up to 60 days. After that the licence can be cancelled (section 19.06). The bank guarantee is released 10% a year when that year's rollout target is met, or 10% is deducted if it is missed. The remaining 50% stays as security (section 24).</p>
<h2 id="licences">Who holds the licences</h2>
<p>BTRC's list of tower sharing licensees as of <b>23 December 2024</b> shows four companies. All four licences are dated 1 November 2018 and valid until 31 October 2033, the full 15-year term.</p>
{table(['Licensee','Licence number','Valid until'],lic_en)}
<div class="btns inprose"><a class="btn" href="{LIST}" download>{DL}<span>Download BTRC's licensee list (PDF)</span></a></div>
<p>When the licences were awarded in October 2018, news reports named <b>AB Hightech Consortium</b> as the fourth winner, alongside edotco, Summit and Kirtonkhola. BTRC's 2024 list shows <b>Frontier Towers Bangladesh Ltd.</b> in fourth place instead. By 2018 Robi had already sold most of its towers to edotco, its sister company (The Daily Star, 1 November 2018).</p>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the BTRC guidelines, not legal advice. BTRC can amend them at any time with 30 days' notice to licensees (section 35).</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> সরকারের অনুমোদন নিয়ে BTRC এই গাইডলাইন জারি করেছে ১ এপ্রিল ২০১৮ এ। এতে টাওয়ার বানানো, কেনা আর ভাড়া দেওয়ার জন্য আলাদা লাইসেন্স তৈরি হয়। মোবাইল অপারেটরদের নিজেদের মধ্যে টাওয়ার ভাড়া দেওয়া বন্ধ করে পাঁচ বছরে এলাকা ধরে ধরে সেই কাজ টাওয়ার কোম্পানির হাতে দিতে হয়।</p></div>
<div class="callout warn">{WARN}<p><b>আবার বদলাচ্ছে।</b> টেলিযোগাযোগ নেটওয়ার্ক ও লাইসেন্সিং নীতিমালা ২০২৫ অনুযায়ী টাওয়ার শেয়ারিং লাইসেন্স নতুন NICSP (জাতীয় অবকাঠামো ও সংযোগ সেবাদাতা) লাইসেন্সে স্থানান্তর হতে পারবে। সামনে কী আসছে, তা জানতে <a href="/bd-telecom/guides/telecom-network-licensing-policy-2025/">২০২৫ নীতিমালার গাইড</a> দেখুন।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গাইডলাইন ডাউনলোড (PDF, ইংরেজি)</span></a></div>
<h2>কেন টাওয়ার শেয়ারিং</h2>
<p>BTRC চেয়েছিল প্রত্যেক অপারেটর আলাদা টাওয়ার না বানিয়ে দুই বা তার বেশি অপারেটর একই টাওয়ার ব্যবহার করুক। এতে জমি, বিদ্যুৎ আর টাকা বাঁচে, পরিবেশের ক্ষতি কমে, আর নতুন অপারেটরের বাজারে ঢোকার খরচও কমে (অনুচ্ছেদ ১.০৪ ও ৩)। টাওয়ার কোম্পানি মোবাইল অপারেটর আর অন্য লাইসেন্সধারীদের কাছে সবার জন্য সমান শর্তে টাওয়ারের জায়গা ভাড়া দেয়।</p>
<h2>কারা লাইসেন্স পেতে পারত</h2>
<ul>
<li>বাংলাদেশি কোম্পানি, অংশীদারি প্রতিষ্ঠান বা কনসোর্টিয়াম। বিদেশি অংশীদারের সর্বোচ্চ <b>৭০%</b> শেয়ার থাকতে পারত, যা বৈদেশিক মুদ্রায় আনতে হবে, আর রোলআউটের সময়ে দেশি ব্যাংক থেকে ঋণ নেওয়া যাবে না। প্রবাসী বাংলাদেশি অংশীদারের ক্ষেত্রে কোনো সীমা ছিল না (অনুচ্ছেদ ৫)।</li>
<li>আবেদনকারী বা তার বিদেশি অংশীদারের অন্তত <b>৫,০০০ টাওয়ার</b> চালানোর অন্তত <b>৩ বছরের</b> অভিজ্ঞতা লাগবে (অনুচ্ছেদ ৫.৬)।</li>
<li><b>মোবাইল আর BWA অপারেটর আবেদন করতে পারবে না</b>। তাদের শেয়ার থাকলে লাইসেন্স পাওয়ার আগে বিক্রি করে দিতে হবে (অনুচ্ছেদ ৫.৪ ও ৫.৫)।</li>
<li>সর্বোচ্চ <b>৪টি লাইসেন্স</b>, প্রতি কোম্পানি একটি, সবই দেশব্যাপী (অনুচ্ছেদ ৫.৭ ও ৭)। মেয়াদ <b>১৫ বছর</b>, তারপর সরকারের অনুমোদনে ৫ বছর করে নবায়ন (অনুচ্ছেদ ৮)।</li>
<li>আবেদন মূল্যায়ন হয়েছে ১০০ নম্বরে। সবচেয়ে বেশি নম্বর ছিল কারিগরি নকশায় (২০), বৈশ্বিক অভিজ্ঞতায় (১৫) আর আর্থিক পরিকল্পনায় (১৫) (পরিশিষ্ট ৫)।</li>
</ul>
<h2>টাওয়ার কোম্পানি কী পারবে, কী পারবে না</h2>
<ul>
<li>দেশের যেকোনো জায়গায় টাওয়ার বানানো, কেনা, মালিকানা রাখা, ভাড়া নেওয়া বা দেওয়া, পরিচালনা আর রক্ষণাবেক্ষণ করতে পারবে (অনুচ্ছেদ ১৪.০১)।</li>
<li>অপটিক্যাল বা তারের ব্যাকবোন নেটওয়ার্ক বানাতে পারবে না, আর সরাসরি গ্রাহককে টেলিকম সেবা দিতে পারবে না (অনুচ্ছেদ ১৩.০২ ও ১৩.০৪)।</li>
<li>BTRC যাচাই করা সার্ভিস লেভেল এগ্রিমেন্টের অধীনে বৈষম্য ছাড়া সব লাইসেন্সধারী অপারেটরকে ভাড়া দিতে হবে। সীমান্ত এলাকায় টাওয়ার বানাতে BTRC এর অনুমতি লাগবে (অনুচ্ছেদ ১৪.০৩ ও ১৪.০৪)।</li>
<li>সেবা দেওয়ার আগে সর্বোচ্চ ট্যারিফ BTRC থেকে অনুমোদন করিয়ে নিতে হবে (অনুচ্ছেদ ২২)।</li>
</ul>
<h2>রোলআউট: পাঁচ বছরে সারা দেশ</h2>
<p>লাইসেন্স পাওয়ার <b>৬ মাসের</b> মধ্যে কাজ শুরু করতে হবে, আর রোলআউটের সময় গোনা শুরু হবে লাইসেন্স দেওয়ার ১৮০ দিন পর থেকে। দরকারি টাওয়ারের অন্তত <b>১০%</b> নতুন করে বানাতে হবে। বাকিগুলো বর্তমান অপারেটরদের কাছ থেকে কেনা, লিজ বা ভাড়া নেওয়া যাবে (অনুচ্ছেদ ১৭)।</p>
{table(['রোলআউটের বছর','টাওয়ার শেয়ারিং সেবার আওতা'],ro_bn)}
<h2>মোবাইল অপারেটরদের জন্য কী বদলেছে</h2>
<ol class="stepsv">
<li><b>নিজেদের টাওয়ার ভাড়া দেওয়া গুটিয়ে নেওয়া।</b> টাওয়ার কোম্পানি যে এলাকায় পৌঁছাবে, সেখানে অপারেটরদের একে অপরকে টাওয়ার শেয়ার, লিজ বা ভাড়া দেওয়া একই পাঁচ বছরের সূচিতে বন্ধ করতে হবে (অনুচ্ছেদ ১৮.০১)।</li>
<li><b>টাওয়ার কোম্পানি থাকলে নতুন শেয়ার্ড টাওয়ার নয়।</b> যেখানে টাওয়ার কোম্পানির টাওয়ার আছে, সেখানে অপারেটররা অন্য অপারেটরের সাথে টাওয়ার বানানো, শেয়ার, লিজ বা ভাড়া দিতে পারবে না (অনুচ্ছেদ ১৮.০২)।</li>
<li><b>আগে চাইতে হবে, না পেলে তবেই নিজে বানানো।</b> অপারেটর টাওয়ার কোম্পানির কাছে জায়গা চাইবে আর BTRC কে জানাবে। টাওয়ার কোম্পানিকে ৩০ দিনের মধ্যে নিশ্চিত করতে হবে আর ৯০ দিনের মধ্যে দিতে হবে। না পারলে BTRC এর অনুমোদন নিয়ে অপারেটর শুধু নিজের ব্যবহারের জন্য টাওয়ার বানাতে পারবে (অনুচ্ছেদ ১৮.০৩ ও ১৮.০৪)।</li>
<li><b>টাওয়ার কোম্পানির কাছে বিক্রি।</b> অপারেটররা তাদের বর্তমান টাওয়ার টাওয়ার কোম্পানির কাছে বিক্রি, লিজ বা ভাড়া দিতে পারবে (অনুচ্ছেদ ১৮.০৫)।</li>
</ol>
<h2>ফি</h2>
{table(['ফি','পরিমাণ (ভ্যাট ছাড়া)'],fees_bn)}
<p>বার্ষিক ফি বা রেভিনিউ শেয়ার দেরিতে দিলে ৬০ দিন পর্যন্ত বছরে ১৫% হারে বিলম্ব ফি। তারপরও না দিলে লাইসেন্স বাতিল হতে পারে (অনুচ্ছেদ ১৯.০৬)। প্রতি বছরের রোলআউট লক্ষ্য পূরণ হলে ব্যাংক গ্যারান্টির ১০% ফেরত দেওয়া হয়, আর না হলে ১০% কেটে নেওয়া হয়। বাকি ৫০% জামানত হিসেবে থাকে (অনুচ্ছেদ ২৪)।</p>
<h2 id="licences">কারা লাইসেন্স ধারণ করছে</h2>
<p><b>২৩ ডিসেম্বর ২০২৪</b> পর্যন্ত BTRC এর টাওয়ার শেয়ারিং লাইসেন্সধারীর তালিকায় চারটি প্রতিষ্ঠান আছে। চারটি লাইসেন্সই ১ নভেম্বর ২০১৮ তারিখের, আর পুরো ১৫ বছর মেয়াদে ৩১ অক্টোবর ২০৩৩ পর্যন্ত বৈধ।</p>
{table(['লাইসেন্সধারী','লাইসেন্স নম্বর','মেয়াদ'],lic_bn)}
<div class="btns inprose"><a class="btn" href="{LIST}" download>{DL}<span>BTRC এর লাইসেন্সধারী তালিকা ডাউনলোড (PDF)</span></a></div>
<p>অক্টোবর ২০১৮ এ লাইসেন্স দেওয়ার সময় সংবাদমাধ্যমে edotco, Summit আর Kirtonkhola এর পাশাপাশি চতুর্থ হিসেবে <b>AB Hightech Consortium</b> এর নাম এসেছিল। BTRC এর ২০২৪ এর তালিকায় চতুর্থ স্থানে আছে <b>Frontier Towers Bangladesh Ltd.</b>। ২০১৮ সালের মধ্যেই রবি তার বেশিরভাগ টাওয়ার সহযোগী প্রতিষ্ঠান edotco এর কাছে বিক্রি করে দিয়েছিল (দ্য ডেইলি স্টার, ১ নভেম্বর ২০১৮)।</p>
<div class="callout warn">{WARN}<p>এটা BTRC গাইডলাইনের সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। লাইসেন্সধারীদের ৩০ দিনের নোটিশ দিয়ে BTRC যেকোনো সময় এটি সংশোধন করতে পারে (অনুচ্ছেদ ৩৫)।</p></div>'''

g=dict(slug='tower-sharing-licensing-guidelines-2018',icon='tower',color='--amber',
 title_en='Tower sharing in Bangladesh: BTRC licensing guidelines 2018, explained',
 title_bn='বাংলাদেশে টাওয়ার শেয়ারিং: BTRC লাইসেন্সিং গাইডলাইন ২০১৮, সহজ ভাষায়',
 sum_en='How BTRC moved mobile towers to four tower companies: who could apply, what they can do, the five-year rollout, fees, and what changed for operators.',
 sum_bn='BTRC কীভাবে মোবাইল টাওয়ার চার টাওয়ার কোম্পানির হাতে দিল: কারা আবেদন করতে পারত, কী করতে পারে, পাঁচ বছরের রোলআউট, ফি আর অপারেটরদের যা বদলেছে।',
 sources=[['BTRC: Tower Sharing License List as on 23-12-2024 (PDF)',LIST],['BTRC: Regulatory and Licensing Guidelines for Issuing License for Tower Sharing in Bangladesh, 1 April 2018 (PDF)',PDF],['The Daily Star: Four firms get tower licences (1 November 2018)',DS]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(2,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
