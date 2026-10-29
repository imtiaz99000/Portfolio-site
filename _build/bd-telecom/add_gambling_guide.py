import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/gambling-prevention-act-2026.pdf'
pen_en=[['15','Gambling of any kind, offline (section 4)','2 years, Tk 2 lakh, or both'],
['16','Online or remote gambling: running sites, apps or social media groups, opening accounts, depositing or withdrawing money, acting as an agent for a foreign platform (section 5)','5 years, Tk 1 crore, or both'],
['17','Online betting: sports, live, exchange, casino, virtual, fantasy and e-sports betting (section 6)','7 years, Tk 5 crore, or both'],
['18','Running or renting out a gambling place, physical or online (section 7)','5 years, Tk 4 lakh, or both; the place can be confiscated'],
['19','Making, selling or using gambling equipment, software, apps or servers (section 8)','3 years, Tk 10 lakh, or both'],
['20','Working as a bookmaker (section 9)','7 years, Tk 5 crore, or both'],
['21','Match fixing / spot fixing (section 10)','7 years or Tk 1 crore / 5 years or Tk 50 lakh; can be banned from the sport'],
['22','Advertising, promotion, sponsorship, affiliate or referral campaigns for gambling, including by influencers, artists, players and celebrities (section 11)','3 years, Tk 50 lakh, or both'],
['23','Using a VPN, proxy, mirror site, hosting, domain, cloud or CDN to run or hide gambling (section 12)','7 years, Tk 5 crore, or both'],
['24','Gambling through a fake SIM, ghost SIM, fake MFS account, or someone else’s NID, fingerprints or face (section 13)','7 years or Tk 50 lakh; 10 years or Tk 5 crore if organised or for money laundering'],
['25','Moving gambling money through banks, MFS, wallets, hawala, hundi or crypto (section 14)','Punished as a money laundering offence under the 2012 Act']]
pen_bn=[['১৫','যেকোনো ধরনের জুয়া (ধারা ৪)','২ বছর, ২ লাখ টাকা, বা উভয়'],
['১৬','অনলাইন বা দূরবর্তী জুয়া: সাইট, অ্যাপ বা সামাজিক যোগাযোগ মাধ্যমে গ্রুপ চালানো, অ্যাকাউন্ট খোলা, টাকা জমা বা তোলা, বিদেশি প্ল্যাটফর্মের এজেন্ট হওয়া (ধারা ৫)','৫ বছর, ১ কোটি টাকা, বা উভয়'],
['১৭','অনলাইন বেটিং: স্পোর্টস, লাইভ, এক্সচেঞ্জ, ক্যাসিনো, ভার্চুয়াল, ফ্যান্টাসি ও ই-স্পোর্টস বেটিং (ধারা ৬)','৭ বছর, ৫ কোটি টাকা, বা উভয়'],
['১৮','বাস্তব বা অনলাইন জুয়ার স্থান পরিচালনা বা ভাড়া দেওয়া (ধারা ৭)','৫ বছর, ৪ লাখ টাকা, বা উভয়; স্থান বাজেয়াপ্ত হতে পারে'],
['১৯','জুয়ার সামগ্রী, সফটওয়্যার, অ্যাপ বা সার্ভার তৈরি, বিক্রি বা ব্যবহার (ধারা ৮)','৩ বছর, ১০ লাখ টাকা, বা উভয়'],
['২০','বাজিকর হিসেবে কাজ (ধারা ৯)','৭ বছর, ৫ কোটি টাকা, বা উভয়'],
['২১','ম্যাচ ফিক্সিং / স্পট ফিক্সিং (ধারা ১০)','৭ বছর বা ১ কোটি টাকা / ৫ বছর বা ৫০ লাখ টাকা; খেলা থেকে নিষিদ্ধ হতে পারে'],
['২২','ইনফ্লুয়েন্সার, শিল্পী, খেলোয়াড় বা সেলিব্রিটিসহ যে কারও জুয়ার বিজ্ঞাপন, প্রচার, স্পন্সরশিপ, অ্যাফিলিয়েট বা রেফারেল ক্যাম্পেইন (ধারা ১১)','৩ বছর, ৫০ লাখ টাকা, বা উভয়'],
['২৩','VPN, প্রক্সি, মিরর সাইট, হোস্টিং, ডোমেইন, ক্লাউড বা CDN দিয়ে জুয়া চালানো বা লুকানো (ধারা ১২)','৭ বছর, ৫ কোটি টাকা, বা উভয়'],
['২৪','ভুয়া SIM, ঘোস্ট SIM, ভুয়া MFS অ্যাকাউন্ট, বা অন্যের NID, আঙুলের ছাপ বা মুখমণ্ডল ব্যবহার করে জুয়া (ধারা ১৩)','৭ বছর বা ৫০ লাখ টাকা; সংঘবদ্ধভাবে বা অর্থপাচারের জন্য হলে ১০ বছর বা ৫ কোটি টাকা'],
['২৫','ব্যাংক, MFS, ওয়ালেট, হাওলা, হুন্ডি বা ক্রিপ্টো দিয়ে জুয়ার টাকা লেনদেন (ধারা ১৪)','২০১২ সালের মানি লন্ডারিং আইনের অপরাধ হিসেবে দণ্ড']]

en=f'''<div class="callout">{INFO}<p><b>In short:</b> Act No. 98 of 2026 replaces the 159-year-old Public Gambling Act, 1867. It makes online gambling, online betting, gambling promotion and the use of fake SIMs or MFS accounts for gambling serious crimes. It received the President's assent on 1 July 2026 and took effect immediately.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the gazette (PDF, Bangla)</span></a></div>
<h2>What the law covers</h2>
<p>Gambling means any bet or wager. It includes housie, bingo, lottery, roulette, dice, poker and card games played for money or anything of value (section 2(6)). <b>Online gambling</b> is anything done through the internet, phone, mobile network, satellite, social media, VPN or proxy. That covers running a gambling website or app, running a betting group or page, opening or using an account, depositing or withdrawing money, or working as an agent for a foreign platform (section 2(2)). A gambling place can be physical or virtual, from a house or cyber cafe to a server room, website, app or social media channel (section 2(7)).</p>
<div class="callout warn">{WARN}<p>Every offence under this Act is cognizable, non-bailable and non-compoundable (section 34). The police can act without a warrant, bail is not a right, and a case cannot be settled privately.</p></div>
<h2>Offences and maximum penalties</h2>
{table(['Section','Offence','Maximum penalty'],pen_en,sec=True)}
<p>Anyone who helps, funds, provides technology for or conspires in an offence gets the same penalty as the offender (section 27). A repeat offender can get up to twice the maximum (section 28). When a company, payment gateway, hosting provider or digital platform commits an offence, its directors and managers are treated as guilty. The exception is anyone who proves it happened without their knowledge and that they tried to stop it. A court can also suspend or cancel the company's licence (section 26).</p>
<h2>What it means for mobile and MFS users</h2>
<ol class="stepsv">
<li><b>Never let anyone use your NID or fingerprints.</b> The law defines a fake SIM as one registered with a forged, borrowed or cloned NID or someone else's biometrics (section 2(19)). Using a fake SIM, a ghost SIM or a fake MFS account for gambling can bring up to 7 years (section 24), and helping can bring the same penalty (section 27).</li>
<li><b>Do not join betting groups or click betting ads.</b> Opening an account or depositing money on a betting site is itself an offence (sections 5 and 6).</li>
<li><b>A VPN does not protect you.</b> Using a VPN, proxy or mirror site for gambling is a separate offence, punishable by up to 7 years (sections 12 and 23).</li>
<li><b>Accounts can be frozen and seized.</b> With court permission, investigators can freeze bank, MFS, digital wallet and crypto accounts. Courts can confiscate money, SIMs, devices, servers and domains used in an offence (sections 29, 31 and 39).</li>
</ol>
<h2>New tools against gambling</h2>
<ul>
<li><b>Blocking.</b> The government or an authority it names can block or remove gambling websites, apps, servers, domains, IP addresses, URLs and social media pages, groups or channels. Mirror and clone sites can be blocked the same way (section 38). BTRC is responsible for blocking (section 43).</li>
<li><b>National digital blacklist.</b> A database of offenders' NIDs, SIMs, MFS and bank accounts, wallets, devices, domains, IP addresses, websites and apps (section 40).</li>
<li><b>NID-SIM-MFS linking.</b> MFS accounts, wallets and other financial accounts can be checked against the NID the SIM is registered to. Biometric checks and facial recognition can be added (section 41).</li>
<li><b>AI monitoring.</b> The government can use AI monitoring, deep packet inspection (DPI), risk scoring and transaction monitoring to detect online gambling and betting (section 44).</li>
<li><b>Task force and roles.</b> An inter-agency task force can be set up (section 42). Bangladesh Bank and the BFIU track the money, the Election Commission helps verify NIDs, and the ministries of religious affairs, education and information run awareness campaigns (section 43).</li>
</ul>
<h2>How cases are handled</h2>
<p>A court takes up a case only on a complaint from an authorised officer of the court, the District Magistrate or the UNO, or from a police officer of at least Sub-Inspector rank (section 30). Online offences are tried in the Cyber Tribunal and others in the ordinary criminal courts. Mobile courts can also act (sections 32 and 33). Searches need a warrant from the Cyber Tribunal, except when evidence could be destroyed. Anyone arrested must be brought before a magistrate or the tribunal within 24 hours (section 36).</p>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the gazette, not legal advice. If the Bangla and English texts differ, the Bangla text prevails (section 50).</p></div>'''

bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> ২০২৬ সনের ৯৮ নং আইন ১৫৯ বছরের পুরনো Public Gambling Act, 1867 এর জায়গা নিয়েছে। অনলাইন জুয়া, অনলাইন বেটিং, জুয়ার প্রচার আর জুয়ায় ভুয়া SIM বা MFS অ্যাকাউন্টের ব্যবহারকে গুরুতর অপরাধ করা হয়েছে। ১ জুলাই ২০২৬ এ রাষ্ট্রপতির সম্মতি পেয়েছে, আর তখনই কার্যকর হয়েছে।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>গেজেট ডাউনলোড (PDF)</span></a></div>
<h2>আইনের আওতায় কী কী</h2>
<p>জুয়া মানে যেকোনো বাজি বা পণ ধরা। টাকা বা মূল্যবান কিছুর বিনিময়ে হাউজি, বিঙ্গো, লটারি, রুলেট, পাশা, পোকার বা কার্ড গেমও এর মধ্যে পড়ে (ধারা ২(৬))। ইন্টারনেট, টেলিফোন, মোবাইল নেটওয়ার্ক, স্যাটেলাইট, সামাজিক যোগাযোগ মাধ্যম, VPN বা প্রক্সি দিয়ে যা করা হয়, সবই <b>অনলাইন জুয়া</b>। এর মধ্যে আছে জুয়ার ওয়েবসাইট বা অ্যাপ চালানো, বেটিং গ্রুপ বা পেজ চালানো, অ্যাকাউন্ট খোলা বা ব্যবহার, টাকা জমা বা তোলা, কিংবা বিদেশি প্ল্যাটফর্মের এজেন্ট হিসেবে কাজ (ধারা ২(২))। জুয়ার স্থান বাস্তব বা ভার্চুয়াল দুটোই হতে পারে: বাড়ি বা সাইবার ক্যাফে থেকে শুরু করে সার্ভার রুম, ওয়েবসাইট, অ্যাপ বা সোশ্যাল মিডিয়া চ্যানেল পর্যন্ত (ধারা ২(৭))।</p>
<div class="callout warn">{WARN}<p>এই আইনের সব অপরাধ আমলযোগ্য, জামিন অযোগ্য আর আপস অযোগ্য (ধারা ৩৪)। পুলিশ পরোয়ানা ছাড়াই ব্যবস্থা নিতে পারবে, জামিন অধিকার হিসেবে মিলবে না, আর মামলা আপসে মেটানো যাবে না।</p></div>
<h2>অপরাধ আর সর্বোচ্চ শাস্তি</h2>
{table(['ধারা','অপরাধ','সর্বোচ্চ শাস্তি'],pen_bn,sec=True)}
<p>অপরাধে প্ররোচনা, সহায়তা, অর্থায়ন, প্রযুক্তি সহায়তা বা ষড়যন্ত্র করলে মূল অপরাধের সমান শাস্তি (ধারা ২৭)। আবার একই অপরাধ করলে সর্বোচ্চ শাস্তির দ্বিগুণ পর্যন্ত (ধারা ২৮)। কোনো কোম্পানি, পেমেন্ট গেটওয়ে, হোস্টিং প্রোভাইডার বা ডিজিটাল প্ল্যাটফর্ম অপরাধ করলে এর পরিচালক আর ব্যবস্থাপকরাও দোষী গণ্য হবেন। ব্যতিক্রম শুধু তিনি, যিনি প্রমাণ করতে পারবেন যে তার অজ্ঞাতে হয়েছে আর তিনি ঠেকাতে চেষ্টা করেছিলেন। আদালত প্রতিষ্ঠানের লাইসেন্সও স্থগিত বা বাতিল করতে পারবে (ধারা ২৬)।</p>
<h2>মোবাইল আর MFS গ্রাহকের জন্য এর মানে</h2>
<ol class="stepsv">
<li><b>নিজের NID বা আঙুলের ছাপ কাউকে ব্যবহার করতে দেবেন না।</b> আইনে ভুয়া SIM মানে জাল, ধার করা বা ক্লোন করা NID কিংবা অন্যের বায়োমেট্রিক দিয়ে নিবন্ধিত SIM (ধারা ২(১৯))। ভুয়া SIM, ঘোস্ট SIM বা ভুয়া MFS অ্যাকাউন্ট দিয়ে জুয়া খেললে ৭ বছর পর্যন্ত কারাদণ্ড হতে পারে (ধারা ২৪), আর সহায়তা করলেও একই শাস্তি (ধারা ২৭)।</li>
<li><b>বেটিং গ্রুপে যোগ দেবেন না, বেটিংয়ের বিজ্ঞাপনে ক্লিক করবেন না।</b> বেটিং সাইটে অ্যাকাউন্ট খোলা বা টাকা জমা দেওয়াই অপরাধ (ধারা ৫ ও ৬)।</li>
<li><b>VPN আপনাকে বাঁচাবে না।</b> জুয়ার জন্য VPN, প্রক্সি বা মিরর সাইট ব্যবহার আলাদা অপরাধ, শাস্তি ৭ বছর পর্যন্ত (ধারা ১২ ও ২৩)।</li>
<li><b>অ্যাকাউন্ট ফ্রিজ আর বাজেয়াপ্ত হতে পারে।</b> আদালতের অনুমতি নিয়ে তদন্তকারী ব্যাংক, MFS, ডিজিটাল ওয়ালেট আর ক্রিপ্টো অ্যাকাউন্ট ফ্রিজ করতে পারবেন। অপরাধে ব্যবহৃত টাকা, SIM, ডিভাইস, সার্ভার আর ডোমেইন আদালত বাজেয়াপ্ত করতে পারবে (ধারা ২৯, ৩১ ও ৩৯)।</li>
</ol>
<h2>জুয়া ঠেকাতে নতুন ব্যবস্থা</h2>
<ul>
<li><b>ব্লক করা।</b> সরকার বা তার নির্ধারিত কর্তৃপক্ষ জুয়ার ওয়েবসাইট, অ্যাপ, সার্ভার, ডোমেইন, IP ঠিকানা, URL আর সোশ্যাল মিডিয়ার পেজ, গ্রুপ বা চ্যানেল ব্লক বা অপসারণ করতে পারবে। মিরর আর ক্লোন সাইটও একইভাবে ব্লক হবে (ধারা ৩৮)। ব্লক করার দায়িত্ব BTRC এর (ধারা ৪৩)।</li>
<li><b>জাতীয় ডিজিটাল ব্ল্যাকলিস্ট।</b> অপরাধীদের NID, SIM, MFS ও ব্যাংক হিসাব, ওয়ালেট, ডিভাইস, ডোমেইন, IP ঠিকানা, ওয়েবসাইট আর অ্যাপের একটি ডেটাবেজ (ধারা ৪০)।</li>
<li><b>NID-SIM-MFS লিংকিং।</b> SIM যে NID তে নিবন্ধিত, সেই পরিচয়ের সাথে MFS অ্যাকাউন্ট, ওয়ালেট আর অন্য আর্থিক হিসাব মিলিয়ে যাচাই করা যাবে। প্রয়োজনে বায়োমেট্রিক আর ফেসিয়াল রিকগনিশন যাচাইও চালু হতে পারে (ধারা ৪১)।</li>
<li><b>AI নজরদারি।</b> অনলাইন জুয়া আর বেটিং শনাক্ত করতে সরকার AI মনিটরিং, ডিপ প্যাকেট ইন্সপেকশন (DPI), রিস্ক স্কোরিং আর লেনদেন পর্যবেক্ষণ ব্যবহার করতে পারবে (ধারা ৪৪)।</li>
<li><b>টাস্ক ফোর্স আর দায়িত্ব ভাগ।</b> একটি আন্তঃসংস্থা টাস্ক ফোর্স গঠন করা যাবে (ধারা ৪২)। বাংলাদেশ ব্যাংক আর BFIU টাকার লেনদেন দেখবে, নির্বাচন কমিশন NID যাচাইয়ে সহযোগিতা করবে, আর ধর্ম, শিক্ষা ও তথ্য মন্ত্রণালয় সচেতনতা কার্যক্রম চালাবে (ধারা ৪৩)।</li>
</ul>
<h2>মামলা কীভাবে চলবে</h2>
<p>আদালত, জেলা ম্যাজিস্ট্রেট বা UNO এর ক্ষমতাপ্রাপ্ত কর্মকর্তা, কিংবা অন্তত সাব-ইন্সপেক্টর পদের পুলিশ কর্মকর্তার অভিযোগ ছাড়া আদালত মামলা নেবে না (ধারা ৩০)। অনলাইন অপরাধের বিচার হবে সাইবার ট্রাইব্যুনালে, বাকিগুলোর ফৌজদারি আদালতে। মোবাইল কোর্টও দণ্ড দিতে পারবে (ধারা ৩২ ও ৩৩)। তল্লাশির জন্য সাইবার ট্রাইব্যুনালের পরোয়ানা লাগবে, তবে প্রমাণ নষ্টের আশঙ্কা থাকলে লাগবে না। গ্রেপ্তারের ২৪ ঘণ্টার মধ্যে ম্যাজিস্ট্রেট বা ট্রাইব্যুনালে হাজির করতে হবে (ধারা ৩৬)।</p>
<div class="callout warn">{WARN}<p>এটা গেজেটের সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। বাংলা আর ইংরেজি পাঠে অমিল হলে বাংলা পাঠ প্রাধান্য পাবে (ধারা ৫০)।</p></div>'''

g=dict(slug='gambling-prevention-act-2026',icon='ban',color='--robi',
 title_en='Gambling Prevention Act 2026, explained',
 title_bn='জুয়া প্রতিরোধ আইন ২০২৬: সহজ ভাষায়',
 sum_en='Online gambling and betting, fake SIMs and MFS accounts, VPNs and gambling ads: the offences, the penalties and what mobile users should know.',
 sum_bn='অনলাইন জুয়া ও বেটিং, ভুয়া SIM ও MFS অ্যাকাউন্ট, VPN আর জুয়ার বিজ্ঞাপন: অপরাধ, শাস্তি আর মোবাইল গ্রাহকের যা জানা দরকার।',
 sources=[['Bangladesh Gazette, Extraordinary, 1 July 2026: Act No. 98 of 2026 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]; G.insert(3,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
