"""Telecom glossary: plain-language definitions in Bangla and English, linked from the data pages."""
import json

# (id, term_en, term_bn, def_en, def_bn, link)
GROUPS = [
 ('market', 'Subscribers and market', 'গ্রাহক ও বাজার', [
  ('subscriber', 'Subscriber (active subscription)', 'গ্রাহক (সক্রিয় সাবস্ক্রিপশন)',
   'BTRC counts a mobile subscriber as a biometrically verified SIM that was used at least once in the last 90 days for a call, SMS, data or another service. One person can hold several SIMs, so subscriptions are not the same as people.',
   'BTRC এর হিসাবে মোবাইল গ্রাহক মানে বায়োমেট্রিক যাচাই করা এমন SIM, যা গত ৯০ দিনে অন্তত একবার কল, SMS, ডেটা বা অন্য কোনো সেবায় ব্যবহার হয়েছে। একজন মানুষের একাধিক SIM থাকতে পারে, তাই সাবস্ক্রিপশন আর মানুষের সংখ্যা এক নয়।', 'kpi/mobile-subscribers/'),
  ('data-user', 'Data user', 'ডেটা ব্যবহারকারী',
   'A subscriber who used mobile internet within a set period. Each operator defines it its own way; Grameenphone, for example, counts a SIM that used at least 150 KB in the last three months.',
   'যে গ্রাহক নির্দিষ্ট সময়ের মধ্যে মোবাইল ইন্টারনেট ব্যবহার করেছেন। প্রতিটি অপারেটর নিজের মতো করে হিসাব করে; যেমন গ্রামীণফোন গত তিন মাসে অন্তত ১৫০ কেবি ব্যবহার হলে ডেটা ব্যবহারকারী ধরে।', 'kpi/finance/'),
  ('market-share', 'Market share', 'মার্কেট শেয়ার',
   'An operator’s share of all active mobile subscriptions in the country, in percent. It can also be measured by revenue, which gives a different picture.',
   'দেশের মোট সক্রিয় মোবাইল সাবস্ক্রিপশনের মধ্যে একটি অপারেটরের ভাগ, শতাংশে। রেভিনিউ দিয়েও মাপা যায়, তখন ছবিটা আলাদা হয়।', 'operators/'),
  ('teledensity', 'Teledensity', 'টেলিডেনসিটি',
   'Phone subscriptions per 100 people. Bangladesh is above 100 because many people use more than one SIM.',
   'প্রতি ১০০ জন মানুষের বিপরীতে ফোন সাবস্ক্রিপশনের সংখ্যা। অনেকে একাধিক SIM ব্যবহার করেন বলে বাংলাদেশে এটা ১০০ এর বেশি।', 'kpi/teledensity/'),
  ('internet-penetration', 'Internet penetration', 'ইন্টারনেট পেনেট্রেশন',
   'Internet subscriptions per 100 people, counting both mobile internet and fixed broadband.',
   'প্রতি ১০০ জন মানুষের বিপরীতে ইন্টারনেট সাবস্ক্রিপশন, মোবাইল ইন্টারনেট আর ফিক্সড ব্রডব্যান্ড মিলিয়ে।', 'kpi/teledensity/'),
  ('churn', 'Churn', 'চার্ন',
   'The share of customers who stop using an operator over a period. High churn means the operator has to win many new customers just to stand still.',
   'নির্দিষ্ট সময়ে কত শতাংশ গ্রাহক একটি অপারেটর ছেড়ে গেছেন। চার্ন বেশি হলে শুধু আগের জায়গায় থাকতেই অপারেটরকে অনেক নতুন গ্রাহক আনতে হয়।', 'kpi/finance/banglalink/'),
  ('mnp', 'MNP (mobile number portability)', 'MNP (নম্বর ঠিক রেখে অপারেটর বদল)',
   'A service that lets you move to another operator while keeping your mobile number. In Bangladesh it is run by a single BTRC-licensed company.',
   'নিজের মোবাইল নম্বর ঠিক রেখে অন্য অপারেটরে চলে যাওয়ার সেবা। বাংলাদেশে BTRC এর লাইসেন্সপ্রাপ্ত একটি প্রতিষ্ঠান এটা চালায়।', ''),
 ]),
 ('money', 'Money and results', 'আয় ও আর্থিক ফলাফল', [
  ('revenue', 'Revenue', 'রেভিনিউ',
   'All the money an operator earns from its services in a period, before any costs. Service revenue leaves out handset and device sales.',
   'নির্দিষ্ট সময়ে সেবা থেকে অপারেটরের মোট আয়, কোনো খরচ বাদ দেওয়ার আগে। সার্ভিস রেভিনিউতে হ্যান্ডসেট বা ডিভাইস বিক্রির আয় ধরা হয় না।', 'kpi/finance/'),
  ('interconnect', 'Interconnect revenue', 'ইন্টারকানেক্ট রেভিনিউ',
   'Money an operator receives from other operators when their customers call into its network.',
   'অন্য অপারেটরের গ্রাহক এই অপারেটরের নেটওয়ার্কে কল করলে সেই অপারেটরের কাছ থেকে যে টাকা পাওয়া যায়।', 'kpi/finance/robi/'),
  ('data-revenue', 'Data revenue', 'ডেটা রেভিনিউ',
   'Revenue from mobile internet. Operators count it differently: some include data inside combined voice and data bundles, others report bundles separately.',
   'মোবাইল ইন্টারনেট থেকে আয়। অপারেটররা আলাদাভাবে হিসাব করে: কেউ ভয়েস আর ডেটার বান্ডেলের ডেটা অংশও ধরে, কেউ বান্ডেল আলাদা দেখায়।', 'kpi/finance/'),
  ('digital-revenue', 'Digital revenue', 'ডিজিটাল রেভিনিউ',
   'Revenue from apps and services beyond calls and data, such as entertainment, self-care apps, advertising and financial services. VEON reports it separately for Banglalink.',
   'কল আর ডেটার বাইরে অ্যাপ ও সেবা থেকে আয়, যেমন বিনোদন, সেলফ-কেয়ার অ্যাপ, বিজ্ঞাপন আর আর্থিক সেবা। VEON বাংলালিংকের জন্য এটা আলাদা দেখায়।', 'kpi/finance/banglalink/'),
  ('arpu', 'ARPU', 'ARPU (গ্রাহকপ্রতি গড় আয়)',
   'Average revenue per user: the average amount a subscriber brings in each month. Robi, for example, divides service revenue by its average active subscribers over 90 days. Each operator calculates it its own way.',
   'Average Revenue Per User: একজন গ্রাহক মাসে গড়ে কত টাকা আয় দেন। যেমন রবি সার্ভিস রেভিনিউকে ৯০ দিনের গড় সক্রিয় গ্রাহক দিয়ে ভাগ করে। প্রতিটি অপারেটর নিজের পদ্ধতিতে হিসাব করে।', 'kpi/finance/'),
  ('ebitda', 'EBITDA', 'EBITDA',
   'Earnings before interest, taxes, depreciation and amortisation: revenue minus the costs of running the business, such as staff, network upkeep, power, marketing, commissions and regulatory revenue share. It shows how much the core business earns before financing, tax and accounting write-downs.',
   'Earnings Before Interest, Taxes, Depreciation and Amortization: রেভিনিউ থেকে ব্যবসা চালানোর খরচ (বেতন, নেটওয়ার্ক রক্ষণাবেক্ষণ, বিদ্যুৎ, মার্কেটিং, কমিশন, নিয়ন্ত্রকের রেভিনিউ শেয়ার) বাদ দিয়ে যা থাকে। ঋণ, কর আর হিসাবের অবচয়ের আগে মূল ব্যবসা কত আয় করছে, সেটা দেখায়।', 'kpi/finance/'),
  ('ebitda-margin', 'EBITDA margin', 'EBITDA মার্জিন',
   'EBITDA divided by revenue, in percent. A 50% margin means the operator keeps Tk 50 of every Tk 100 earned after its running costs. It is the most common way to compare how efficiently operators run.',
   'EBITDA কে রেভিনিউ দিয়ে ভাগ করে শতাংশে। ৫০% মার্জিন মানে প্রতি ১০০ টাকা আয় থেকে পরিচালন খরচের পর ৫০ টাকা থাকে। অপারেটরদের দক্ষতা তুলনার সবচেয়ে প্রচলিত উপায়।', 'kpi/finance/'),
  ('depreciation', 'Depreciation and amortisation', 'অবচয় ও অ্যামর্টাইজেশন',
   'The cost of towers, equipment and spectrum licences spread over the years they are used. It is an accounting cost rather than cash spent in that quarter, and in telecom it is large.',
   'টাওয়ার, যন্ত্রপাতি আর তরঙ্গ লাইসেন্সের দাম যত বছর ব্যবহার হবে, তত বছরে ভাগ করে খরচ দেখানো। এটা হিসাবের খরচ, ওই প্রান্তিকে নগদ খরচ নয়, আর টেলিকমে এর পরিমাণ অনেক।', ''),
  ('ebit', 'EBIT (operating profit)', 'EBIT (পরিচালন মুনাফা)',
   'EBITDA minus depreciation and amortisation. It is the profit from operations before interest and tax.',
   'EBITDA থেকে অবচয় ও অ্যামর্টাইজেশন বাদ দিলে যা থাকে। সুদ আর করের আগে পরিচালন থেকে মুনাফা।', ''),
  ('pat', 'Profit after tax (PAT)', 'কর-পরবর্তী মুনাফা (PAT)',
   'What is left for shareholders after every cost, interest and tax. Also called net profit.',
   'সব খরচ, সুদ আর কর দেওয়ার পর শেয়ারহোল্ডারদের জন্য যা থাকে। নেট প্রফিট নামেও পরিচিত।', 'kpi/finance/'),
  ('eps', 'Earnings per share (EPS)', 'শেয়ারপ্রতি আয় (EPS)',
   'Profit after tax divided by the number of shares. Listed companies such as Grameenphone and Robi report it every quarter.',
   'কর-পরবর্তী মুনাফাকে মোট শেয়ার সংখ্যা দিয়ে ভাগ করলে যা আসে। গ্রামীণফোন আর রবির মতো তালিকাভুক্ত কোম্পানি প্রতি প্রান্তিকে এটা জানায়।', 'kpi/finance/grameenphone/'),
  ('capex', 'Capex', 'ক্যাপেক্স (মূলধনী বিনিয়োগ)',
   'Capital expenditure: money spent on long-lasting assets such as new sites, radio equipment and IT systems. The figures on this site leave out spectrum and licence fees.',
   'Capital Expenditure: দীর্ঘদিন ব্যবহারের সম্পদে খরচ, যেমন নতুন সাইট, রেডিও যন্ত্রপাতি আর IT সিস্টেম। এই সাইটের সংখ্যায় তরঙ্গ আর লাইসেন্স ফি ধরা হয়নি।', 'kpi/finance/'),
  ('fcf', 'Operating cash flow (OCF) and free cash flow', 'অপারেটিং ক্যাশ ফ্লো (OCF) ও ফ্রি ক্যাশ ফ্লো',
   'In operator presentations this usually means EBITDA minus capex: the cash the business generates after investing in its network.',
   'অপারেটরদের প্রেজেন্টেশনে সাধারণত EBITDA থেকে ক্যাপেক্স বাদ দিয়ে হিসাব করা হয়: নেটওয়ার্কে বিনিয়োগের পর ব্যবসা থেকে কত নগদ টাকা আসছে।', ''),
  ('net-debt', 'Net debt', 'নিট ঋণ',
   'Loans and lease liabilities minus cash in hand. Net debt to EBITDA shows how many years of EBITDA it would take to pay it off.',
   'ঋণ আর লিজ দায় থেকে হাতে থাকা নগদ টাকা বাদ দিলে যা থাকে। নিট ঋণকে EBITDA দিয়ে ভাগ করলে বোঝা যায় কত বছরের EBITDA দিয়ে ঋণ শোধ করা যাবে।', ''),
  ('one-off', 'One-off item', 'এককালীন আয় বা খরচ',
   'A gain or cost that will not repeat, such as a provision being released or a legal settlement. It can make one quarter look much better or worse than the trend, as with Banglalink’s Q2 2025 EBITDA.',
   'যে আয় বা খরচ আর ফিরে আসবে না, যেমন কোনো প্রভিশন ফেরত আসা বা আইনি নিষ্পত্তি। এতে একটি প্রান্তিক স্বাভাবিকের চেয়ে অনেক ভালো বা খারাপ দেখাতে পারে, যেমন বাংলালিংকের ২০২৫ এর দ্বিতীয় প্রান্তিকের EBITDA।', 'kpi/finance/banglalink/'),
 ]),
 ('usage', 'Usage', 'ব্যবহার', [
  ('mou', 'MoU (minutes of use)', 'MoU (গ্রাহকপ্রতি মিনিট)',
   'Average call minutes per subscriber per month. It has been falling for years as people move to internet calling apps.',
   'গ্রাহকপ্রতি মাসে গড় কল মিনিট। মানুষ ইন্টারনেট কলিং অ্যাপে চলে যাওয়ায় বছরের পর বছর এটা কমছে।', 'kpi/finance/'),
  ('data-usage', 'Data usage per subscriber', 'গ্রাহকপ্রতি ডেটা ব্যবহার',
   'Average mobile data used per subscriber per month, shown on this site in GB. Operators publish it in MB (Grameenphone calls it AMBPU).',
   'গ্রাহকপ্রতি মাসে গড় মোবাইল ডেটা ব্যবহার, এই সাইটে GB তে দেখানো। অপারেটররা MB তে প্রকাশ করে (গ্রামীণফোন একে AMBPU বলে)।', 'kpi/finance/'),
 ]),
 ('quality', 'Network quality', 'নেটওয়ার্কের মান', [
  ('qos', 'QoS (quality of service)', 'QoS (সেবার মান)',
   'How well a network performs against BTRC’s minimum standards, such as call drops, call connection and 4G connection. BTRC publishes monthly results for each operator.',
   'BTRC এর ন্যূনতম মানের তুলনায় নেটওয়ার্ক কেমন কাজ করছে, যেমন কল ড্রপ, কল সংযোগ আর 4G সংযোগ। BTRC প্রতি মাসে প্রতিটি অপারেটরের ফল প্রকাশ করে।', 'kpi/qos/'),
  ('call-drop', 'Call drop rate', 'কল ড্রপ হার',
   'The share of calls cut off before either person hangs up. Lower is better.',
   'কথা শেষ হওয়ার আগেই কত শতাংশ কল কেটে যায়। যত কম, তত ভালো।', 'kpi/qos/area/'),
  ('cssr', 'Call setup success rate', 'কল সংযোগের সাফল্যের হার',
   'The share of call attempts that connect. Higher is better.',
   'যত কল করার চেষ্টা হয়, তার কত শতাংশ সংযোগ পায়। যত বেশি, তত ভালো।', 'kpi/qos/area/'),
  ('rrc', 'RRC success rate', 'RRC সাফল্যের হার',
   'The share of attempts in which a phone manages to connect to the 4G network. It is the first step before any 4G call or data session.',
   'ফোন কত শতাংশ চেষ্টায় 4G নেটওয়ার্কে যুক্ত হতে পারে। যেকোনো 4G কল বা ডেটা সেশনের প্রথম ধাপ এটাই।', 'kpi/qos/area/'),
  ('volte', 'VoLTE', 'VoLTE',
   'Voice over LTE: phone calls carried over the 4G network instead of 2G, which usually means clearer voice and faster call setup.',
   'Voice over LTE: 2G এর বদলে 4G নেটওয়ার্কে ফোন কল, এতে সাধারণত কথা পরিষ্কার শোনা যায় আর কল দ্রুত লাগে।', 'kpi/qos/'),
 ]),
 ('network', 'Network, spectrum and licences', 'নেটওয়ার্ক, তরঙ্গ ও লাইসেন্স', [
  ('site', 'Site, BTS and eNodeB', 'সাইট, BTS ও eNodeB',
   'A site is a location with radio equipment that serves nearby phones. BTS is the 2G equipment and eNodeB the 4G equipment; one site often has both.',
   'সাইট মানে রেডিও যন্ত্রপাতি বসানো একটি জায়গা, যা আশপাশের ফোনে সেবা দেয়। BTS হলো 2G যন্ত্র আর eNodeB হলো 4G যন্ত্র; একটি সাইটে প্রায়ই দুটোই থাকে।', 'kpi/towers/'),
  ('towerco', 'Tower company', 'টাওয়ার কোম্পানি',
   'A company licensed by BTRC to build towers and rent space on them to several operators, so that each operator does not need its own tower in every place.',
   'BTRC এর লাইসেন্সপ্রাপ্ত প্রতিষ্ঠান যারা টাওয়ার বানিয়ে একাধিক অপারেটরকে জায়গা ভাড়া দেয়, যাতে প্রতিটি অপারেটরকে সব জায়গায় নিজের টাওয়ার বানাতে না হয়।', 'kpi/towers/'),
  ('spectrum', 'Spectrum and bands', 'তরঙ্গ ও ব্যান্ড',
   'The radio frequencies an operator is allowed to use, bought from the government and measured in MHz. Lower bands such as 700 MHz travel further and reach indoors better; higher bands carry more data.',
   'অপারেটর যে রেডিও তরঙ্গ ব্যবহার করতে পারে, সরকারের কাছ থেকে কেনা, মেগাহার্জে (MHz) মাপা হয়। ৭০০ মেগাহার্জের মতো নিচের ব্যান্ড বেশি দূর যায় আর ঘরের ভেতরে ভালো পৌঁছায়; উঁচু ব্যান্ডে বেশি ডেটা যায়।', 'kpi/spectrum/'),
  ('4g-5g', '4G and 5G', '4G ও 5G',
   'Generations of mobile technology. 4G (LTE) carries most mobile internet in Bangladesh today; 5G is faster and handles more users, but needs compatible phones and new spectrum.',
   'মোবাইল প্রযুক্তির প্রজন্ম। বাংলাদেশে এখন বেশিরভাগ মোবাইল ইন্টারনেট চলে 4G (LTE) তে; 5G আরও দ্রুত আর বেশি ব্যবহারকারী সামলাতে পারে, কিন্তু এর জন্য উপযুক্ত ফোন আর নতুন তরঙ্গ লাগে।', 'kpi/handsets/'),
  ('fwa', 'FWA (fixed wireless access)', 'FWA (ফিক্সড ওয়্যারলেস অ্যাক্সেস)',
   'Home internet delivered over the mobile network to a router, instead of a cable to the house.',
   'বাসার ইন্টারনেট, তার টেনে না এনে মোবাইল নেটওয়ার্ক থেকে একটি রাউটারের মাধ্যমে।', ''),
  ('neir', 'NEIR and IMEI', 'NEIR ও IMEI',
   'IMEI is the unique number of every phone. NEIR is BTRC’s national register of IMEI numbers, used to check whether a handset is legal.',
   'IMEI হলো প্রতিটি ফোনের নিজস্ব নম্বর। NEIR হলো BTRC এর IMEI নম্বরের জাতীয় তালিকা, যা দিয়ে যাচাই করা হয় একটি হ্যান্ডসেট বৈধ কিনা।', 'guides/neir-phone-check/'),
  ('isp', 'ISP', 'ISP (ইন্টারনেট সেবাদাতা)',
   'Internet service provider: a company licensed to sell fixed internet connections, usually over cable or fibre.',
   'Internet Service Provider: ফিক্সড ইন্টারনেট সংযোগ বিক্রির লাইসেন্সপ্রাপ্ত প্রতিষ্ঠান, সাধারণত তার বা ফাইবারের মাধ্যমে।', 'licensees/isp-divisional/'),
  ('itc', 'ITC and IIG', 'ITC ও IIG',
   'International connectivity licences. ITC operators bring internet bandwidth across land borders by fibre cable; IIG operators connect the country’s internet to the rest of the world.',
   'আন্তর্জাতিক সংযোগের লাইসেন্স। ITC অপারেটররা স্থলসীমান্ত দিয়ে ফাইবার কেবলে ইন্টারনেট ব্যান্ডউইথ আনে; IIG অপারেটররা দেশের ইন্টারনেটকে বিশ্বের সাথে যুক্ত করে।', 'guides/itc-licensees/'),
 ]),
]


def build_glossary(B):
    T, bn, ic, tint, page, write = B.T, B.bn, B.ic, B.tint, B.page, B.write
    n = sum(len(g[3]) for g in GROUPS)
    jump = ''.join('<a href="#%s">%s</a>' % (gid, T(en, bnn)) for gid, en, bnn, _ in GROUPS)
    secs = ''
    terms_ld = []
    for gid, en, bnn, items in GROUPS:
        dl = ''
        for tid, te, tb, de, db, link in items:
            more = ('<a class="gl-more" href="/bd-telecom/%s">%s</a>' % (link, T('See it in the data →', 'ডেটায় দেখুন →'))) if link else ''
            dl += '<div class="gl" id="%s" data-q="%s"><dt>%s</dt><dd>%s%s</dd></div>' % (tid, B.esc((te + ' ' + tb).lower()), T(te, tb), T(de, db, 'p'), more)
            terms_ld.append({'@type': 'DefinedTerm', 'name': te, 'alternateName': tb, 'description': de, 'url': 'https://www.imtiazkarim.com/bd-telecom/glossary/#' + tid})
        secs += '<section class="block" id="%s"><div class="sechead"><h2>%s</h2></div><dl class="card gls">%s</dl></section>' % (gid, T(en, bnn), dl)
    js = '''<script>(function(){var i=document.getElementById('gl-q');if(!i)return;i.addEventListener('input',function(){var q=i.value.trim().toLowerCase();
[].forEach.call(document.querySelectorAll('.gl'),function(e){e.hidden=q&&e.getAttribute('data-q').indexOf(q)<0&&e.textContent.toLowerCase().indexOf(q)<0});
[].forEach.call(document.querySelectorAll('.gls'),function(s){s.parentNode.hidden=!s.querySelector('.gl:not([hidden])')})})})();</script>'''
    body = ('<header class="pagehead"><h1>%s</h1><p class="dek">%s</p></header>'
            '<div class="card" style="margin:0 0 14px"><input id="gl-q" class="gl-q" type="search" placeholder="%s" aria-label="Search terms"></div>'
            '<nav class="jump" aria-label="Glossary groups">%s</nav>%s%s') % (
        T('Telecom glossary', 'টেলিকম শব্দকোষ'),
        T('%d terms used across this site, from ARPU and EBITDA to call drop rate and spectrum, explained in plain language.' % n,
          'এই সাইটে ব্যবহৃত %sটি শব্দ, ARPU আর EBITDA থেকে কল ড্রপ হার আর তরঙ্গ পর্যন্ত, সহজ ভাষায় ব্যাখ্যা করা।' % bn(n)),
        'খুঁজুন · Search, e.g. ARPU', jump, secs, js)
    html = page('glossary/', 'kpi', 'Telecom glossary: ARPU, EBITDA, churn, QoS and more, in Bangla and English | BD Telecom', 'টেলিকম শব্দকোষ: ARPU, EBITDA, চার্ন, QoS সহজ বাংলায় | BD Telecom',
                'Plain-language definitions of %d telecom and finance terms used in Bangladesh: ARPU, EBITDA margin, churn, teledensity, QoS, spectrum and more, in Bangla and English.' % n, body,
                crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')])
    ld = '<script type="application/ld+json">%s</script>' % json.dumps({'@context': 'https://schema.org', '@type': 'DefinedTermSet', 'name': 'BD Telecom glossary', 'url': 'https://www.imtiazkarim.com/bd-telecom/glossary/', 'hasDefinedTerm': terms_ld}, ensure_ascii=False, separators=(',', ':'))
    write('glossary/index.html', html.replace('</head>', ld + '</head>', 1))
    return ['bd-telecom/glossary/']
