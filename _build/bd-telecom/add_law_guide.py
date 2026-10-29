import json
INFO='<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></span>'
WARN='<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/></svg></span>'
DL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'
PDF='/bd-telecom/docs/telecom-amendment-act-2026.pdf'
def table(h, rows):
    return '<div class="tablewrap"><table class="law"><thead><tr>'+''.join('<th>%s</th>'%x for x in h)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>%s</td>'%c for c in r)+'</tr>' for r in rows)+'</tbody></table></div>'

en = f'''<div class="callout">{INFO}<p><b>In short:</b> Act No. 51 of 2026 rewrites large parts of the Bangladesh Telecommunication Regulation Act, 2001. It was passed by Parliament, received the President's assent on 10 April 2026, and counts as in force from 5 February 2026. It replaces the 2026 ordinance on the same subject.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the gazette (PDF, Bangla)</span></a></div>
<h2>Five things that matter for ordinary users</h2>
<ol class="stepsv">
<li><b>No internet shutdowns.</b> Under no circumstances may telecom connections, services or the internet be shut down, obstructed or limited deliberately or in bad faith (section 97(2)).</li>
<li><b>Complaints get deadlines.</b> BTRC must run an online complaint system. A complaint must be acknowledged with initial action within 10 working days and finally resolved within 45 working days. If a complaint is not resolved and customers keep losing out, BTRC can fine the operator (section 59A).</li>
<li><b>Your SIM and device data is protected.</b> Using SIM or device registration data to watch or harass people is now an offence, punished like wiretapping: up to 2 years in prison, a fine of up to Tk 1.5 crore, or both (section 71).</li>
<li><b>Harassing calls and AI cloning are punished.</b> Calling someone again and again to annoy or harm them can bring a fine of up to Tk 1 lakh, or up to 6 months in prison if the fine is not paid. The same penalty applies to copying someone's voice, picture or biometric data with AI to harm them (section 70).</li>
<li><b>Fairer prices.</b> Operators must have every tariff approved, with a maximum and minimum rate, before they start charging. BTRC can approve lower tariffs for health, education and disaster-prone areas (sections 48 and 49).</li>
</ol>
<h2>Who the law now covers</h2>
<p>The law now applies to online social media, over-the-top (OTT) services such as streaming apps, and cell broadcasting services, along with the companies that provide them (section 3). It also covers offences committed from outside Bangladesh that would be punishable if done inside the country. New definitions cover OTT, content, intermediaries (online platforms that handle other people's data), intelligence agencies and spectrum.</p>
<p>The 2001 Act's name drops the word "Regulation" (নিয়ন্ত্রণ), and in Bangla the Commission's name changes from "নিয়ন্ত্রণ কমিশন" to "রেগুলেটরি কমিশন". If the Bangla and English texts disagree, the Bangla text now prevails (section 102).</p>
<h2>Lawful interception: the new rules</h2>
<p>The government or an authority it names can approve intercepting, monitoring, storing or analysing a user's messages, calls or data for a fixed period. This is allowed only for state security, public order or preventing serious crime, and the law requires necessity, proportionality and legality (section 97A).</p>
<ul>
<li>Interception needs prior approval from a court or from an authority the government sets up. In an emergency the approved authority can give temporary approval.</li>
<li>Only approved agencies can request it. Its time limit, scope and purpose must be set out, and it is allowed only when the information cannot be collected any other way.</li>
<li>Full logs and an audit trail must be kept. Data must be destroyed when the time limit ends, unless a court case needs it.</li>
<li>An independent review council will check legality, necessity and accountability from time to time. For these sections, "government" means the Ministry of Home Affairs.</li>
<li>Intercepted material is accepted as evidence in court only if it was approved lawfully, its chain of custody was kept, and its integrity is proved (section 97B).</li>
</ul>
<h2>Main penalties</h2>
{table(['Section','Offence','Maximum penalty'],[
['66','Deliberately sending false or fraudulent distress signals, messages or content','5 years, Tk 49 crore, or both'],
['66A','Harming national security or sovereignty; hate speech inciting violence; hacking or damaging fibre networks, data centres or operator servers; jamming signals; fake GPS location; bulk SMS or bulk AI-call fraud','5 years, Tk 99 crore, or both'],
['67','Obstructing radio or telecom communication, or diverting it without consent','3 years, Tk 3 crore, or both'],
['68','Operator staff collecting or disclosing callers’ information, or reading messages, without authority','5 years, Tk 35 lakh, or both'],
['70','Repeated harassing calls; AI copies of someone’s voice, picture or biometrics used to harm them','Tk 1 lakh fine; 6 months if unpaid'],
['71','Wiretapping two or more people; surveillance or harassment using SIM or device registration data','2 years, Tk 1.5 crore, or both'],
['72A','Running a network or disrupting service without approval; cyber attacks on networks; posing as someone else to get call records or user data','5 years, Tk 49 crore, or both'],
['40','An operator renting out its licensed network commercially without a BTRC permit','3 years or Tk 75 crore (5 years for repeat offences)'],
])}
<p>Most offences under the Act can be investigated without a warrant (cognizable). All except the national-security offence in section 66A(1)(a) are bailable and can be settled by compensation and an administrative fine (section 77). Mobile courts can also impose penalties (section 79).</p>
<h2>What changes for operators and BTRC</h2>
<ul>
<li><b>National-level important licences</b> (international connectivity, NTTN networks, spectrum-based access networks and national mobile operator licences) need government approval to issue, renew, cancel, transfer or merge. BTRC must decide applications within 6 months and publish its decisions online. It decides other licences on its own within 3 months (section 36).</li>
<li>Licensees must extend at least 10% of their service capacity to rural and less populated areas. They must not discriminate between customers, and they must make bills, prices and complaint details easy to find (section 37).</li>
<li>BTRC must decide a licence renewal within 30 days (section 38A).</li>
<li>Spectrum can be traded, shared, leased or surrendered with BTRC's approval, and BTRC can re-farm bands. Bands the ITU or WRC have identified for mobile (IMT) must be kept for commercial mobile use (sections 35 and 55).</li>
<li>Administrative fines have changed. The ceiling for a licence breach under section 63 drops from Tk 300 crore to Tk 99 crore, and the daily fine from Tk 1 crore to Tk 10 lakh. A new general fine of up to Tk 49 crore must be in proportion to the company's investment and turnover (sections 63 and 65).</li>
<li>A new appeal authority will hear challenges to fines, led by a retired High Court judge (section 82A).</li>
<li>BTRC must consult stakeholders before major decisions, publish them on its website and hold a public hearing at least every 4 months. Issues raised at hearings go on a public action tracker that is updated regularly (sections 30, 32A and 87).</li>
<li>Commissioners need at least 15 years of experience. They cannot join a licensee for 6 months after leaving BTRC (sections 10 and 20).</li>
<li>BTRC can collect and analyse network traffic data to support cyber security, and can declare networks to be critical telecom infrastructure (section 52A). It can also require tools for parental control and age checks for children (section 52A(6)).</li>
</ul>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the gazette, not legal advice. Many details will come in rules and regulations that are still to be issued. For anything that affects you directly, read the gazette or ask a lawyer.</p></div>'''

bn = f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> ২০২৬ সনের ৫১ নং আইন। এটি বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ আইন, ২০০১ এর বড় অংশ নতুন করে লিখেছে। সংসদে পাস হওয়ার পর ১০ এপ্রিল ২০২৬ এ রাষ্ট্রপতির সম্মতি পেয়েছে, আর ধরা হবে ৫ ফেব্রুয়ারি ২০২৬ থেকে কার্যকর। একই বিষয়ের ২০২৬ সালের অধ্যাদেশ এর মাধ্যমে বাতিল হয়েছে।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গেজেট ডাউনলোড (PDF)</span></a></div>
<h2>সাধারণ গ্রাহকের জন্য পাঁচটি জরুরি বিষয়</h2>
<ol class="stepsv">
<li><b>ইন্টারনেট বন্ধ করা যাবে না।</b> কোনো অবস্থাতেই ইচ্ছাকৃতভাবে বা অসৎ উদ্দেশ্যে টেলিযোগাযোগ সংযোগ, সেবা বা ইন্টারনেট বন্ধ, বাধাগ্রস্ত বা সীমিত করা যাবে না (ধারা ৯৭(২))।</li>
<li><b>অভিযোগের নির্দিষ্ট সময়সীমা।</b> BTRC কে অনলাইনে অভিযোগ গ্রহণ ও নিষ্পত্তির ব্যবস্থা চালাতে হবে। অভিযোগ দেওয়ার ১০ কার্যদিবসের মধ্যে তা গ্রহণ করে প্রাথমিক ব্যবস্থা নিতে হবে, আর ৪৫ কার্যদিবসের মধ্যে চূড়ান্ত নিষ্পত্তি করতে হবে। সমাধান না হলে এবং গ্রাহক বারবার ক্ষতির মুখে পড়লে BTRC অপারেটরকে জরিমানা করতে পারবে (ধারা ৫৯ক)।</li>
<li><b>SIM আর ডিভাইসের তথ্য সুরক্ষিত।</b> SIM বা ডিভাইস রেজিস্ট্রেশনের তথ্য দিয়ে কারও ওপর নজরদারি বা হয়রানি করা এখন অপরাধ। শাস্তি আড়িপাতার মতোই: সর্বোচ্চ ২ বছর কারাদণ্ড, দেড় কোটি টাকা অর্থদণ্ড, বা উভয় (ধারা ৭১)।</li>
<li><b>বিরক্তিকর কল আর AI দিয়ে নকলের শাস্তি।</b> বিরক্ত বা ক্ষতি করার জন্য কাউকে বারবার কল করলে সর্বোচ্চ ১ লাখ টাকা অর্থদণ্ড, না দিলে সর্বোচ্চ ৬ মাস কারাদণ্ড। কারও কণ্ঠস্বর, ছবি বা বায়োমেট্রিক তথ্য AI দিয়ে নকল করে ক্ষতি করলেও একই শাস্তি (ধারা ৭০)।</li>
<li><b>দামে স্বচ্ছতা।</b> সেবা চালুর আগেই অপারেটরকে সর্বোচ্চ ও সর্বনিম্ন হার সহ ট্যারিফ অনুমোদন নিতে হবে। স্বাস্থ্য, শিক্ষা আর দুর্যোগপ্রবণ এলাকার জন্য BTRC কম ট্যারিফ অনুমোদন করতে পারবে (ধারা ৪৮ ও ৪৯)।</li>
</ol>
<h2>আইন এখন কাদের ওপর প্রযোজ্য</h2>
<p>অনলাইন সামাজিক যোগাযোগ মাধ্যম, স্ট্রিমিং অ্যাপের মতো ওভার দ্য টপ (OTT) সেবা, সেল ব্রডকাস্টিং সেবা এবং এসব সেবাদাতা প্রতিষ্ঠানও এখন এই আইনের আওতায় (ধারা ৩)। বাংলাদেশের বাইরে থেকে করা এমন অপরাধও আওতায় আসবে, যা দেশে করলে শাস্তিযোগ্য হতো। OTT, কনটেন্ট, মধ্যস্থ সেবা প্রদানকারী (অন্যের তথ্য আদান-প্রদান করা অনলাইন প্ল্যাটফর্ম), গোয়েন্দা সংস্থা আর স্পেকট্রামের নতুন সংজ্ঞা যোগ হয়েছে।</p>
<p>২০০১ সালের আইনের নাম থেকে "নিয়ন্ত্রণ" শব্দটি বাদ পড়েছে, আর কমিশনের নামে "নিয়ন্ত্রণ" এর জায়গায় এসেছে "রেগুলেটরি"। বাংলা আর ইংরেজি পাঠে অমিল হলে এখন বাংলা পাঠ প্রাধান্য পাবে (ধারা ১০২)।</p>
<h2>আইনানুগ ইন্টারসেপশন: নতুন নিয়ম</h2>
<p>রাষ্ট্রের নিরাপত্তা, জনশৃঙ্খলা বা গুরুতর অপরাধ প্রতিরোধের জন্য সরকার বা তার নির্ধারিত কর্তৃপক্ষ নির্দিষ্ট সময়ের জন্য কোনো ব্যবহারকারীর বার্তা, কথোপকথন বা তথ্য প্রতিহত, পর্যবেক্ষণ, সংরক্ষণ বা বিশ্লেষণের অনুমোদন দিতে পারবে। তবে প্রয়োজনীয়তা, আনুপাতিকতা আর আইনি বৈধতা নিশ্চিত করতে হবে (ধারা ৯৭ক)।</p>
<ul>
<li>আদালত বা সরকার গঠিত কর্তৃপক্ষের পূর্বানুমোদন লাগবে। জরুরি অবস্থায় অনুমোদিত কর্তৃপক্ষ অস্থায়ী অনুমোদন দিতে পারবে।</li>
<li>শুধু অনুমোদিত সংস্থা অনুরোধ করতে পারবে। সময়সীমা, পরিধি আর উদ্দেশ্য নির্দিষ্ট থাকতে হবে, আর অন্য কোনো উপায়ে তথ্য পাওয়া সম্ভব না হলেই কেবল অনুমোদন মিলবে।</li>
<li>পূর্ণাঙ্গ লগ আর নিরীক্ষা ট্রেইল রাখতে হবে। সময়সীমা শেষ হলে তথ্য ধ্বংস করতে হবে, যদি না তা বিচারাধীন মামলায় লাগে।</li>
<li>একটি স্বাধীন রিভিউ কাউন্সিল নির্দিষ্ট সময় পরপর বৈধতা, প্রয়োজনীয়তা আর জবাবদিহিতা যাচাই করবে। এই ধারাগুলোতে "সরকার" মানে স্বরাষ্ট্র মন্ত্রণালয়।</li>
<li>ইন্টারসেপশনে পাওয়া তথ্য আদালতে সাক্ষ্য হিসেবে গ্রহণযোগ্য হবে কেবল তখনই, যখন তা আইনানুগভাবে অনুমোদিত, chain of custody বজায় ছিল, আর তথ্যের অখণ্ডতা প্রমাণিত (ধারা ৯৭খ)।</li>
</ul>
<h2>প্রধান শাস্তিগুলো</h2>
{table(['ধারা','অপরাধ','সর্বোচ্চ শাস্তি'],[
['৬৬','ইচ্ছাকৃতভাবে মিথ্যা বা প্রতারণামূলক বিপদ সংকেত, বার্তা বা কনটেন্ট পাঠানো','৫ বছর, ৪৯ কোটি টাকা, বা উভয়'],
['৬৬ক','জাতীয় নিরাপত্তা বা সার্বভৌমত্বের ক্ষতি; সহিংসতায় উসকানিমূলক ঘৃণার বক্তব্য; ফাইবার নেটওয়ার্ক, ডেটা সেন্টার বা অপারেটরের সার্ভারে হ্যাকিং বা ক্ষতি; সিগন্যাল জ্যাম করা; ভুয়া GPS লোকেশন; বাল্ক SMS বা বাল্ক AI কল দিয়ে প্রতারণা','৫ বছর, ৯৯ কোটি টাকা, বা উভয়'],
['৬৭','বেতার বা টেলিযোগাযোগে বাধা দেওয়া, বা সম্মতি ছাড়া অন্য পথে সরানো','৩ বছর, ৩ কোটি টাকা, বা উভয়'],
['৬৮','অনুমোদন ছাড়া অপারেটরের কর্মীর গ্রাহকের তথ্য সংগ্রহ বা প্রকাশ, বা বার্তার বিষয়বস্তু জানা','৫ বছর, ৩৫ লাখ টাকা, বা উভয়'],
['৭০','বারবার বিরক্তিকর কল; কারও কণ্ঠস্বর, ছবি বা বায়োমেট্রিক AI দিয়ে নকল করে ক্ষতি','১ লাখ টাকা; না দিলে ৬ মাস'],
['৭১','দুই বা ততোধিক ব্যক্তির আলাপে আড়ি পাতা; SIM বা ডিভাইস রেজিস্ট্রেশনের তথ্য দিয়ে নজরদারি বা হয়রানি','২ বছর, দেড় কোটি টাকা, বা উভয়'],
['৭২ক','অনুমোদন ছাড়া নেটওয়ার্ক চালানো বা সেবায় বিঘ্ন; নেটওয়ার্কে সাইবার হামলা; ছদ্মবেশে কল রেকর্ড বা গ্রাহকের তথ্য সংগ্রহ','৫ বছর, ৪৯ কোটি টাকা, বা উভয়'],
['৪০','BTRC এর পারমিট ছাড়া অপারেটরের লাইসেন্সকৃত নেটওয়ার্ক বাণিজ্যিকভাবে অন্যকে ব্যবহার করতে দেওয়া','৩ বছর বা ৭৫ কোটি টাকা (পুনরায় করলে ৫ বছর)'],
])}
<p>এই আইনের বেশিরভাগ অপরাধ আমলযোগ্য। ধারা ৬৬ক(১)(ক) এর জাতীয় নিরাপত্তা সংক্রান্ত অপরাধ ছাড়া সব অপরাধ জামিনযোগ্য, আর ক্ষতিপূরণ ও প্রশাসনিক জরিমানা দিয়ে আপোষযোগ্য (ধারা ৭৭)। মোবাইল কোর্টও দণ্ড দিতে পারবে (ধারা ৭৯)।</p>
<h2>অপারেটর আর BTRC এর জন্য কী বদলেছে</h2>
<ul>
<li><b>জাতীয় পর্যায়ে গুরুত্বপূর্ণ লাইসেন্স</b> (আন্তর্জাতিক সংযোগ, NTTN নেটওয়ার্ক, তরঙ্গভিত্তিক অ্যাক্সেস নেটওয়ার্ক আর জাতীয় মোবাইল অপারেটরের লাইসেন্স) দেওয়া, নবায়ন, বাতিল, হস্তান্তর বা একীভূতকরণে সরকারের পূর্বানুমোদন লাগবে। এমন আবেদন BTRC কে ৬ মাসের মধ্যে নিষ্পত্তি করে অনলাইনে প্রকাশ করতে হবে। অন্য লাইসেন্স BTRC নিজেই ৩ মাসের মধ্যে দেবে (ধারা ৩৬)।</li>
<li>লাইসেন্সধারীকে সেবা-ক্ষমতার অন্তত ১০% পল্লী ও কম জনবসতিপূর্ণ এলাকায় সম্প্রসারণ করতে হবে। গ্রাহকদের মধ্যে বৈষম্য করা যাবে না, আর বিল, মূল্য ও অভিযোগের তথ্য সহজে পাওয়ার ব্যবস্থা রাখতে হবে (ধারা ৩৭)।</li>
<li>লাইসেন্স নবায়নের সিদ্ধান্ত BTRC কে ৩০ দিনের মধ্যে দিতে হবে (ধারা ৩৮ক)।</li>
<li>BTRC এর অনুমোদন নিয়ে তরঙ্গ বিক্রয়, শেয়ারিং, লিজিং আর সমর্পণ করা যাবে, আর BTRC তরঙ্গ ব্যান্ড রি-ফার্ম করতে পারবে। ITU বা WRC যেসব ব্যান্ড মোবাইলের (IMT) জন্য চিহ্নিত করেছে, সেগুলো বাণিজ্যিক মোবাইল ব্যবহারের জন্য রাখতে হবে (ধারা ৩৫ ও ৫৫)।</li>
<li>প্রশাসনিক জরিমানা বদলেছে। ধারা ৬৩ তে লাইসেন্স লঙ্ঘনের সর্বোচ্চ জরিমানা ৩০০ কোটি থেকে কমে ৯৯ কোটি টাকা, আর দৈনিক জরিমানা ১ কোটি থেকে ১০ লাখ টাকা। সাধারণ লঙ্ঘনে সর্বোচ্চ ৪৯ কোটি টাকার নতুন জরিমানা কোম্পানির বিনিয়োগ ও টার্নওভারের সাথে সামঞ্জস্য রেখে আরোপ করতে হবে (ধারা ৬৩ ও ৬৫)।</li>
<li>জরিমানার বিরুদ্ধে আপিলের জন্য একটি নতুন আপিল কর্তৃপক্ষ হবে, যার নেতৃত্বে থাকবেন হাইকোর্টের একজন অবসরপ্রাপ্ত বিচারক (ধারা ৮২ক)।</li>
<li>গুরুত্বপূর্ণ সিদ্ধান্তের আগে BTRC কে অংশীজনের মতামত নিতে হবে, সিদ্ধান্ত ওয়েবসাইটে প্রকাশ করতে হবে, আর অন্তত প্রতি ৪ মাসে একবার গণশুনানি করতে হবে। শুনানিতে ওঠা বিষয় একটি প্রকাশ্য কার্যপর্যবেক্ষণ তালিকায় থাকবে, যা নিয়মিত হালনাগাদ হবে (ধারা ৩০, ৩২ক ও ৮৭)।</li>
<li>কমিশনারদের অন্তত ১৫ বছরের অভিজ্ঞতা লাগবে। চাকরি শেষের ৬ মাসের মধ্যে তারা কোনো লাইসেন্সধারী প্রতিষ্ঠানে যোগ দিতে পারবেন না (ধারা ১০ ও ২০)।</li>
<li>সাইবার নিরাপত্তার জন্য BTRC নেটওয়ার্কের ট্রাফিক ডেটা সংগ্রহ ও বিশ্লেষণ করতে পারবে, আর কোনো নেটওয়ার্ককে গুরুত্বপূর্ণ টেলিযোগাযোগ পরিকাঠামো ঘোষণা করতে পারবে (ধারা ৫২ক)। শিশুদের জন্য প্যারেন্টাল কন্ট্রোল আর বয়স যাচাইয়ের ব্যবস্থাও নিশ্চিত করতে পারবে (ধারা ৫২ক(৬))।</li>
</ul>
<div class="callout warn">{WARN}<p>এটা গেজেটের সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। অনেক খুঁটিনাটি পরে বিধি ও প্রবিধানে আসবে। আপনার সাথে সরাসরি সম্পর্কিত বিষয়ে মূল গেজেট পড়ুন বা আইনজীবীর পরামর্শ নিন।</p></div>'''

g = dict(slug='telecom-amendment-act-2026', icon='book', color='--gp',
  title_en='Bangladesh Telecommunication (Amendment) Act, 2026, explained',
  title_bn='বাংলাদেশ টেলিযোগাযোগ (সংশোধন) আইন, ২০২৬: সহজ ভাষায়',
  sum_en='What the 2026 amendment changes for users, operators and BTRC: no internet shutdowns, complaint deadlines, interception rules, new penalties and licensing.',
  sum_bn='২০২৬ এর সংশোধনী গ্রাহক, অপারেটর আর BTRC এর জন্য কী বদলেছে: ইন্টারনেট বন্ধে নিষেধাজ্ঞা, অভিযোগের সময়সীমা, ইন্টারসেপশনের নিয়ম, নতুন শাস্তি ও লাইসেন্স।',
  sources=[['Bangladesh Gazette, Extraordinary, 10 April 2026: Act No. 51 of 2026 (PDF)', PDF]],
  body_en=en, body_bn=bn)
G = json.load(open('guides.json', encoding='utf8'))
G = [x for x in G if x['slug'] != g['slug']]; G.insert(0, g)
json.dump(G, open('guides.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print(len(G), 'guides')
