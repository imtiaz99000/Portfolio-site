import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/personal-data-protection-act-2026.pdf'

en=f'''<div class="callout">{INFO}<p><b>In short:</b> Act No. 63 of 2026 treats your personal data as yours. Companies and government bodies may use it only with your consent or another lawful basis, must keep it secure, and must let you see, correct, move or delete it. It received the President's assent on 10 April 2026 and counts as in force from 6 November 2025. It replaces the 2025 ordinance and its 2026 amendment.</p></div>
<div class="callout warn">{WARN}<p><b>Not all of it is active yet.</b> The sections on complaints and fines (31 to 35) and on Chief Data Officers (23) start only after 18 months, on a date the government sets by gazette notice (section 1(3)). Until then your rights apply, but the fines cannot yet be imposed.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the gazette (PDF, Bangla)</span></a></div>
<h2>What counts as personal data</h2>
<p>Any information about you, such as your name, your parents' names, an ID number, your <b>mobile number</b>, financial data, <b>location</b> or an online identifier. It also covers physical, genetic, biometric and psychological data that can identify you (section 2(17)).</p>
<p><b>Sensitive personal data</b> gets stricter protection. It covers genetic and biometric data such as fingerprints, face and voice prints, along with ethnicity, political or religious beliefs, trade union membership, health, sexual orientation, criminal records and your <b>real-time location</b> (section 2(21)). Using it needs your specific consent or one of a few listed legal grounds (section 7).</p>
<h2>Consent comes first</h2>
<ul>
<li>Consent must be free, specific, clear and possible to withdraw. Before asking, the company must tell you why it wants your data, how long it will keep it, whether it will pass it on, and how you can withdraw (section 5).</li>
<li>If there is a dispute, the company must prove that you gave consent (section 5(4)).</li>
<li>Some uses do not need consent, such as carrying out a contract you signed, defending a legal claim, protecting someone's life, or employment law duties. Even then the use must be necessary and proportionate (section 5(3)).</li>
<li>For a child under 18, a parent or legal guardian must give consent (section 9).</li>
</ul>
<h2>Your rights</h2>
<ol class="stepsv">
<li><b>See your data and take a copy.</b> You can ask any company for the data it holds about you, in a short, readable form. The copy must say who it was shared with, and where possible the data can be moved directly to another company (section 11).</li>
<li><b>Correct it.</b> You can ask for wrong or incomplete data to be fixed. The company must tell you within 30 days once it makes the change, or give you written reasons if it refuses. You can then ask for the data to be marked as disputed and the Authority to be told (section 12).</li>
<li><b>Withdraw consent and have data deleted.</b> You can withdraw consent at any time. The company must delete your data when the purpose is over, when you withdraw consent or object, or when it was processed illegally. Records kept by legal duty and some other records can be exempt (section 13).</li>
<li><b>Know about automated decisions.</b> A company cannot take an automated decision about you without telling you (section 13(6)).</li>
<li><b>These rights cannot be signed away.</b> No contract or notice can cancel them (section 10(4)). You exercise them by applying in writing to the company (section 10(1)).</li>
</ol>
<h2>What companies must do</h2>
<ul>
<li>Tell people clearly what data they collect, why, and how to complain (section 15). They must not disclose data for any other purpose without consent (section 16).</li>
<li>Protect data with technical and organisational measures, including pseudonymisation and encryption, and test them regularly (section 17).</li>
<li>Keep data no longer than the set period (section 18). Keep processing records for at least 5 years (section 19).</li>
<li>Report a data breach that could cause people significant harm to the Authority, in the form and time set by regulations (section 20).</li>
<li>Large or high-risk companies ("significant data fiduciaries") must appoint a Chief Data Officer and can be audited by independent auditors (sections 21 and 23).</li>
<li>A company stays responsible for any contractor that processes data for it (section 8).</li>
</ul>
<h2>Sending data abroad</h2>
<p>Personal data can go abroad with your consent, under a contract you are part of, or for your own business, education, travel or immigration matters. It can go only to places that have adequate safeguards under the regulations (section 29). Bulk transfers of sensitive identifiers, such as NID, passport and TIN numbers, biometrics, genetic data or criminal records, must be reported to the Authority. The government can charge a fee on the yearly profit companies make from using Bangladeshi citizens' data (section 29(5)), and the Authority can stop data going to a foreign state or international body (section 26).</p>
<h2>What it means for mobile users</h2>
<p>Your mobile number, call and location records, NID details and the fingerprints taken at SIM registration are all personal data. Fingerprints and real-time location are sensitive data. Operators, apps and their agents may use them only for the purpose you were told about, must keep them secure, and must answer your requests to see or correct them. This sits alongside the 2026 telecom amendment, which separately makes it an offence to use SIM or device registration data to watch or harass people.</p>
<h2>Exemptions</h2>
<p>Consent is not needed for national security, defence and public order; court orders; preventing, investigating or prosecuting crime; tax enforcement; public health emergencies; investigating misuse of public funds; purely personal or household use; statistics and research; and journalism, archives, art or literature (section 24). Even then, the other rules on processing, security and storage still apply (section 24(2)).</p>
<h2>Complaints and penalties</h2>
{table(['Section','Breach','Maximum administrative fine'],[
['32(1)','Failing to respect a data subject’s rights','Tk 25 lakh'],
['32(2)','The same breach by a significant data fiduciary','Tk 50 lakh'],
['32(3)','Repeat breaches','An extra fine on top'],
['33','Failing to keep personal data safe and secure','Tk 25 lakh'],
],sec=True)}
<p>Anyone who believes their rights were breached can complain to the Authority, the National Data Management Authority set up under the National Data Management Act, 2026 (section 31). The Authority can also order compensation for the person harmed, on top of the fine (section 35). It can fine directors, managers or staff involved in a company's breach (section 36). Fines can be appealed within 30 days to the tribunal under section 68 of the ICT Act (section 37). Remember that sections 31 to 35 are not yet active.</p>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the gazette, not legal advice. Many details, including time limits and forms, will come in rules and regulations. If the Bangla and English texts differ, the Bangla text prevails (section 45).</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> ২০২৬ সনের ৬৩ নং আইন আপনার ব্যক্তিগত উপাত্তকে আপনার মালিকানাধীন হিসেবে গণ্য করে। কোম্পানি বা সরকারি প্রতিষ্ঠান আপনার সম্মতি বা অন্য বৈধ ভিত্তি ছাড়া তা ব্যবহার করতে পারবে না, সুরক্ষিত রাখতে হবে, আর আপনাকে তা দেখার, সংশোধনের, অন্যত্র নেওয়ার ও মুছে ফেলার সুযোগ দিতে হবে। ১০ এপ্রিল ২০২৬ এ রাষ্ট্রপতির সম্মতি পেয়েছে, আর ধরা হবে ৬ নভেম্বর ২০২৫ থেকে কার্যকর। এটি ২০২৫ এর অধ্যাদেশ আর তার ২০২৬ এর সংশোধনী বাতিল করেছে।</p></div>
<div class="callout warn">{WARN}<p><b>সব অংশ এখনো চালু হয়নি।</b> অভিযোগ ও জরিমানার ধারা (৩১ থেকে ৩৫) আর প্রধান উপাত্ত কর্মকর্তার ধারা (২৩) চালু হবে ১৮ মাস পর, সরকার গেজেট প্রজ্ঞাপনে যে তারিখ ঠিক করবে সেদিন থেকে (ধারা ১(৩))। ততদিন আপনার অধিকারগুলো বহাল, কিন্তু জরিমানা আরোপ করা যাবে না।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গেজেট ডাউনলোড (PDF)</span></a></div>
<h2>ব্যক্তিগত উপাত্ত কী</h2>
<p>আপনার সম্পর্কে যেকোনো তথ্য, যেমন নাম, পিতা-মাতার নাম, পরিচয় নম্বর, <b>মোবাইল নম্বর</b>, আর্থিক উপাত্ত, <b>অবস্থান</b> বা অনলাইনে শনাক্তকারী তথ্য। আপনাকে শনাক্ত করা যায় এমন শারীরিক, জেনেটিক, বায়োমেট্রিক আর মনস্তাত্ত্বিক উপাত্তও এর মধ্যে পড়ে (ধারা ২(১৭))।</p>
<p><b>সংবেদনশীল ব্যক্তিগত উপাত্ত</b> আরও কঠোরভাবে সুরক্ষিত। এর মধ্যে আছে জেনেটিক আর বায়োমেট্রিক উপাত্ত, যেমন আঙুলের ছাপ, মুখের ছবি ও কণ্ঠস্বরের ছাপ। আরও আছে নৃ-গোষ্ঠী, রাজনৈতিক বা ধর্মীয় বিশ্বাস, ট্রেড ইউনিয়নের সদস্যপদ, স্বাস্থ্য, যৌন অভিমুখিতা, অপরাধ সংক্রান্ত তথ্য আর আপনার <b>তাৎক্ষণিক অবস্থান</b> (ধারা ২(২১))। এগুলো ব্যবহারে আপনার সুনির্দিষ্ট সম্মতি বা কয়েকটি নির্দিষ্ট আইনি ভিত্তির একটি লাগবে (ধারা ৭)।</p>
<h2>আগে সম্মতি</h2>
<ul>
<li>সম্মতি হতে হবে স্বেচ্ছায়, সুনির্দিষ্ট, স্পষ্ট আর প্রত্যাহারযোগ্য। সম্মতি চাওয়ার আগে কোম্পানিকে জানাতে হবে উপাত্ত কেন নিচ্ছে, কতদিন রাখবে, অন্য কাউকে দেবে কিনা, আর কীভাবে সম্মতি প্রত্যাহার করা যায় (ধারা ৫)।</li>
<li>বিরোধ হলে আপনি যে সম্মতি দিয়েছিলেন, তা প্রমাণের দায় কোম্পানির (ধারা ৫(৪))।</li>
<li>কিছু ক্ষেত্রে সম্মতি লাগে না, যেমন আপনার করা চুক্তি পালন, আইনি দাবিতে আত্মরক্ষা, জীবন রক্ষা বা শ্রম আইনের দায়িত্ব। তবু ব্যবহার হতে হবে প্রয়োজনীয় আর সমানুপাতিক (ধারা ৫(৩))।</li>
<li>১৮ বছরের কম বয়সী শিশুর ক্ষেত্রে পিতামাতা বা আইনগত অভিভাবকের সম্মতি লাগবে (ধারা ৯)।</li>
</ul>
<h2>আপনার অধিকার</h2>
<ol class="stepsv">
<li><b>উপাত্ত দেখা আর কপি নেওয়া।</b> যেকোনো কোম্পানির কাছে আপনার সম্পর্কে রাখা উপাত্ত সংক্ষিপ্ত ও বোধগম্য আকারে চাইতে পারবেন। কার কার সাথে তা শেয়ার করা হয়েছে, সেটাও জানাতে হবে, আর সম্ভব হলে সরাসরি অন্য কোম্পানিতে উপাত্ত সরানো যাবে (ধারা ১১)।</li>
<li><b>সংশোধন।</b> ভুল বা অসম্পূর্ণ উপাত্ত ঠিক করতে বলতে পারবেন। সংশোধন করলে কোম্পানিকে ৩০ দিনের মধ্যে আপনাকে জানাতে হবে, আর না করলে লিখিত কারণ দিতে হবে। তখন আপনি উপাত্তটিকে বিরোধপূর্ণ হিসেবে চিহ্নিত করতে আর কর্তৃপক্ষকে জানাতে বলতে পারবেন (ধারা ১২)।</li>
<li><b>সম্মতি প্রত্যাহার আর উপাত্ত মুছে ফেলা।</b> যেকোনো সময় সম্মতি প্রত্যাহার করা যাবে। উদ্দেশ্য শেষ হলে, সম্মতি প্রত্যাহার বা আপত্তি জানালে, কিংবা বেআইনিভাবে প্রক্রিয়া হলে কোম্পানিকে উপাত্ত মুছে ফেলতে হবে। আইনি বাধ্যবাধকতায় রাখা রেকর্ডসহ কিছু উপাত্ত এর বাইরে থাকতে পারে (ধারা ১৩)।</li>
<li><b>স্বয়ংক্রিয় সিদ্ধান্ত জানা।</b> আপনাকে না জানিয়ে কোম্পানি আপনার বিষয়ে স্বয়ংক্রিয় সিদ্ধান্ত নিতে পারবে না (ধারা ১৩(৬))।</li>
<li><b>এই অধিকার ছেড়ে দেওয়া যায় না।</b> কোনো চুক্তি বা নোটিশ দিয়ে এগুলো বাতিল করা যাবে না (ধারা ১০(৪))। অধিকার প্রয়োগ করতে কোম্পানির কাছে লিখিত আবেদন করতে হবে (ধারা ১০(১))।</li>
</ol>
<h2>কোম্পানির যা করতে হবে</h2>
<ul>
<li>কী উপাত্ত নিচ্ছে, কেন নিচ্ছে আর কীভাবে অভিযোগ করা যায়, তা স্পষ্টভাবে জানাতে হবে (ধারা ১৫)। সম্মতি ছাড়া অন্য উদ্দেশ্যে উপাত্ত প্রকাশ করা যাবে না (ধারা ১৬)।</li>
<li>ছদ্মনামকরণ আর সাংকেতিকীকরণসহ কারিগরি ও প্রাতিষ্ঠানিক ব্যবস্থায় উপাত্ত সুরক্ষিত রাখতে হবে, আর নিয়মিত পরীক্ষা করতে হবে (ধারা ১৭)।</li>
<li>নির্ধারিত মেয়াদের বেশি উপাত্ত রাখা যাবে না (ধারা ১৮)। প্রক্রিয়াকরণের রেকর্ড অন্তত ৫ বছর রাখতে হবে (ধারা ১৯)।</li>
<li>যে উপাত্ত চ্যুতিতে মানুষের উল্লেখযোগ্য ক্ষতির সম্ভাবনা আছে, তা প্রবিধানে নির্ধারিত রূপ ও সময়ে কর্তৃপক্ষকে জানাতে হবে (ধারা ২০)।</li>
<li>বড় বা ঝুঁকিপূর্ণ প্রতিষ্ঠানকে ("গুরুত্বপূর্ণ উপাত্ত-জিম্মাদার") প্রধান উপাত্ত কর্মকর্তা নিয়োগ দিতে হবে, আর স্বতন্ত্র নিরীক্ষক দিয়ে তাদের নিরীক্ষা হতে পারে (ধারা ২১ ও ২৩)।</li>
<li>কোম্পানির হয়ে যে প্রক্রিয়াকারী উপাত্ত নিয়ে কাজ করে, তার কাজের দায়ও কোম্পানির (ধারা ৮)।</li>
</ul>
<h2>বিদেশে উপাত্ত পাঠানো</h2>
<p>আপনার সম্মতিতে, আপনি পক্ষ এমন চুক্তির অধীনে, কিংবা আপনার নিজের ব্যবসা, শিক্ষা, ভ্রমণ বা অভিবাসনের প্রয়োজনে ব্যক্তিগত উপাত্ত বিদেশে পাঠানো যাবে। তবে পাঠানো যাবে কেবল সেই দেশে, যেখানে প্রবিধান অনুযায়ী উপযুক্ত সুরক্ষা আছে (ধারা ২৯)। NID, পাসপোর্ট ও TIN নম্বর, বায়োমেট্রিক, জেনেটিক বা অপরাধ সংক্রান্ত তথ্যের মতো সংবেদনশীল উপাত্ত বিপুল পরিমাণে বিদেশে পাঠালে কর্তৃপক্ষকে জানাতে হবে। বাংলাদেশি নাগরিকদের উপাত্ত ব্যবহার করে কোম্পানি যে বার্ষিক মুনাফা করে, তার ওপর সরকার ফি ধার্য করতে পারবে (ধারা ২৯(৫))। কর্তৃপক্ষ বিদেশি রাষ্ট্র বা আন্তর্জাতিক সংস্থায় উপাত্ত সরবরাহ বন্ধও করতে পারবে (ধারা ২৬)।</p>
<h2>মোবাইল গ্রাহকের জন্য এর মানে</h2>
<p>আপনার মোবাইল নম্বর, কল ও অবস্থানের রেকর্ড, NID এর তথ্য আর SIM নিবন্ধনের সময় নেওয়া আঙুলের ছাপ, সবই ব্যক্তিগত উপাত্ত। আঙুলের ছাপ আর তাৎক্ষণিক অবস্থান সংবেদনশীল উপাত্ত। অপারেটর, অ্যাপ বা তাদের এজেন্ট এগুলো শুধু জানানো উদ্দেশ্যেই ব্যবহার করতে পারবে, সুরক্ষিত রাখতে হবে, আর দেখা বা সংশোধনের অনুরোধের জবাব দিতে হবে। এর পাশাপাশি ২০২৬ এর টেলিযোগাযোগ সংশোধনী আইনে SIM বা ডিভাইস নিবন্ধনের তথ্য দিয়ে নজরদারি বা হয়রানিকে আলাদাভাবে অপরাধ করা হয়েছে।</p>
<h2>যেখানে ছাড় আছে</h2>
<p>জাতীয় নিরাপত্তা, প্রতিরক্ষা ও জনশৃঙ্খলা; আদালতের আদেশ; অপরাধ প্রতিরোধ, তদন্ত বা বিচার; কর ফাঁকি রোধ; জনস্বাস্থ্যের জরুরি অবস্থা; সরকারি তহবিলের অপব্যবহারের তদন্ত; একান্ত ব্যক্তিগত বা গৃহস্থালি কাজ; পরিসংখ্যান ও গবেষণা; আর সাংবাদিকতা, সংরক্ষণাগার, শিল্পকর্ম বা সাহিত্য, এসব ক্ষেত্রে সম্মতি লাগবে না (ধারা ২৪)। তবু প্রক্রিয়াকরণ, সুরক্ষা আর সংরক্ষণের অন্য নিয়মগুলো মানতে হবে (ধারা ২৪(২))।</p>
<h2>অভিযোগ আর জরিমানা</h2>
{table(['ধারা','লঙ্ঘন','সর্বোচ্চ প্রশাসনিক জরিমানা'],[
['৩২(১)','উপাত্তধারীর অধিকার প্রতিপালনে ব্যর্থতা','২৫ লাখ টাকা'],
['৩২(২)','গুরুত্বপূর্ণ উপাত্ত-জিম্মাদারের একই লঙ্ঘন','৫০ লাখ টাকা'],
['৩২(৩)','বারবার লঙ্ঘন','এর ওপর অতিরিক্ত জরিমানা'],
['৩৩','ব্যক্তিগত উপাত্তের সুরক্ষা ও নিরাপত্তা দিতে ব্যর্থতা','২৫ লাখ টাকা'],
],sec=True)}
<p>অধিকার লঙ্ঘিত হয়েছে মনে করলে যে কেউ কর্তৃপক্ষের কাছে অভিযোগ করতে পারবেন। কর্তৃপক্ষ হলো জাতীয় উপাত্ত ব্যবস্থাপনা আইন, ২০২৬ এর অধীনে গঠিত জাতীয় উপাত্ত ব্যবস্থাপনা কর্তৃপক্ষ (ধারা ৩১)। জরিমানার পাশাপাশি কর্তৃপক্ষ ক্ষতিগ্রস্ত ব্যক্তিকে ক্ষতিপূরণ দেওয়ার আদেশও দিতে পারবে (ধারা ৩৫)। কোম্পানির লঙ্ঘনে জড়িত পরিচালক, ব্যবস্থাপক বা কর্মচারীকেও জরিমানা করা যাবে (ধারা ৩৬)। জরিমানার বিরুদ্ধে ৩০ দিনের মধ্যে তথ্য ও যোগাযোগ প্রযুক্তি আইনের ধারা ৬৮ এর ট্রাইব্যুনালে আপিল করা যাবে (ধারা ৩৭)। মনে রাখবেন, ধারা ৩১ থেকে ৩৫ এখনো চালু হয়নি।</p>
<div class="callout warn">{WARN}<p>এটা গেজেটের সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। সময়সীমা আর ফরমসহ অনেক খুঁটিনাটি বিধি ও প্রবিধানে আসবে। বাংলা আর ইংরেজি পাঠে অমিল হলে বাংলা পাঠ প্রাধান্য পাবে (ধারা ৪৫)।</p></div>'''

g=dict(slug='personal-data-protection-act-2026',icon='shield',color='--tt',
 title_en='Personal Data Protection Act 2026, explained',
 title_bn='ব্যক্তিগত উপাত্ত সুরক্ষা আইন ২০২৬: সহজ ভাষায়',
 sum_en='Your rights over your personal data, what companies and mobile operators must do, sending data abroad, and the fines that start later.',
 sum_bn='ব্যক্তিগত উপাত্তে আপনার অধিকার, কোম্পানি ও মোবাইল অপারেটরের দায়িত্ব, বিদেশে উপাত্ত পাঠানো, আর পরে চালু হবে এমন জরিমানা।',
 sources=[['Bangladesh Gazette, Extraordinary, 10 April 2026: Act No. 63 of 2026 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(2,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
