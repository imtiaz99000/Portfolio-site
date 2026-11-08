"""Methodology case study: where the numbers come from and how they were checked."""


def build_methodology(B):
    T, ic, page, write = B.T, B.ic, B.page, B.write

    def sec(h_en, h_bn, body_en, body_bn):
        return '<section class="block"><div class="sechead"><h2>%s</h2></div><article class="prose card">%s</article></section>' % (T(h_en, h_bn), T(body_en, body_bn, 'div'))

    def rows(items):
        return ''.join('<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>' % (T(a, b), T(c, d), T(e, f)) for a, b, c, d, e, f in items)

    sources = rows([
        ('Mobile and internet subscribers', 'মোবাইল ও ইন্টারনেট গ্রাহক', 'BTRC monthly subscriber reports', 'BTRC এর মাসিক গ্রাহক প্রতিবেদন', 'Monthly', 'মাসিক'),
        ('Network quality by upazila', 'উপজেলাভিত্তিক নেটওয়ার্কের মান', 'BTRC drive test reports, one PDF per operator', 'BTRC এর ড্রাইভ টেস্ট প্রতিবেদন, প্রতি অপারেটরের আলাদা PDF', 'Periodic', 'নির্দিষ্ট সময় পরপর'),
        ('Grameenphone finances', 'গ্রামীণফোনের আর্থিক তথ্য', 'Quarterly investor presentations, analytical workbooks and audited annual reports', 'ত্রৈমাসিক বিনিয়োগকারী প্রেজেন্টেশন, বিশ্লেষণী ওয়ার্কবুক আর অডিট করা বার্ষিক প্রতিবেদন', 'Quarterly', 'ত্রৈমাসিক'),
        ('Robi finances', 'রবির আর্থিক তথ্য', 'Quarterly investor presentations and Robi’s multi-year summaries', 'ত্রৈমাসিক বিনিয়োগকারী প্রেজেন্টেশন আর রবির কয়েক বছরের সারসংক্ষেপ', 'Quarterly', 'ত্রৈমাসিক'),
        ('Banglalink finances', 'বাংলালিংকের আর্থিক তথ্য', 'Bangladesh pages of VEON’s quarterly factbooks and annual report', 'VEON এর ত্রৈমাসিক ফ্যাক্টবুক আর বার্ষিক প্রতিবেদনের বাংলাদেশ অংশ', 'Quarterly', 'ত্রৈমাসিক'),
        ('Recharge tax', 'রিচার্জে কর', 'National budget announcements and NBR orders, as reported by the press', 'জাতীয় বাজেট আর NBR এর আদেশ, সংবাদমাধ্যমের প্রতিবেদন অনুযায়ী', 'After each budget', 'প্রতিটি বাজেটের পর'),
    ])

    found = rows([
        ('Robi, Q3 2024', 'রবি, ২০২৪ এর তৃতীয় প্রান্তিক', 'An older five-year summary repeats Q2’s balance sheet in the Q3 column.', 'পুরনো পাঁচ বছরের সারসংক্ষেপে তৃতীয় প্রান্তিকের ঘরে দ্বিতীয় প্রান্তিকের ব্যালেন্স শিট আবার লেখা।', 'Used Robi’s newer 2024 to 2025 summary, where liabilities plus equity equal total assets.', 'রবির নতুন ২০২৪-২০২৫ সারসংক্ষেপ ব্যবহার, যেখানে দায় আর ইকুইটির যোগফল মোট সম্পদের সমান।'),
        ('Robi, ARPU', 'রবি, ARPU', 'Different reports give different ARPU for the same quarter, for example 125 Tk and 138 Tk for Q1 2025.', 'একই প্রান্তিকের ARPU বিভিন্ন প্রতিবেদনে আলাদা, যেমন ২০২৫ এর প্রথম প্রান্তিকে ১২৫ আর ১৩৮ টাকা।', 'Used the series in Robi’s latest presentations and noted the break on the page.', 'রবির সর্বশেষ প্রেজেন্টেশনের সিরিজ ব্যবহার, আর পেজে ছেদটির কথা উল্লেখ।'),
        ('Grameenphone, 2020', 'গ্রামীণফোন, ২০২০', 'In the newest analytical workbook, the 2020 subscriber and ARPU cells are misaligned.', 'সর্বশেষ বিশ্লেষণী ওয়ার্কবুকে ২০২০ এর গ্রাহক আর ARPU এর ঘরগুলো এলোমেলো।', 'Took those figures from the 2021 workbook. Quarterly profit was rebuilt from earnings per share and matches the audited Tk 37,187 million exactly.', 'সেগুলো ২০২১ এর ওয়ার্কবুক থেকে নেওয়া। প্রান্তিক মুনাফা শেয়ারপ্রতি আয় থেকে বের করা, যা অডিট করা ৩৭,১৮৭ মিলিয়ন টাকার সাথে হুবহু মেলে।'),
        ('Banglalink, Q2 2025', 'বাংলালিংক, ২০২৫ এর দ্বিতীয় প্রান্তিক', 'EBITDA margin of 75.6% looks impossible for a mobile operator.', '৭৫.৬% EBITDA মার্জিন একটি মোবাইল অপারেটরের জন্য অস্বাভাবিক।', 'VEON’s notes show a one-off release of a USD 45 million provision. The figure is kept and flagged on the chart.', 'VEON এর নোটে দেখা যায় ৪৫ মিলিয়ন ডলারের একটি প্রভিশন একবারের জন্য ফেরত এসেছে। সংখ্যাটি রাখা হয়েছে, চার্টে চিহ্নিত।'),
        ('Banglalink, ARPU 2023', 'বাংলালিংক, ARPU ২০২৩', 'VEON recalculated ARPU from 2023, lowering it by about 3%.', '২০২৩ থেকে VEON নতুনভাবে ARPU হিসাব করেছে, এতে প্রায় ৩% কমেছে।', 'Kept as published and noted the break.', 'প্রকাশিত অবস্থায় রাখা, ছেদের কথা উল্লেখ।'),
        ('Data revenue', 'ডেটা রেভিনিউ', 'Grameenphone stopped publishing it after 2023 and VEON after 2024, and each operator defines it differently.', '২০২৩ এর পর গ্রামীণফোন আর ২০২৪ এর পর VEON এটি প্রকাশ বন্ধ করেছে, আর প্রতিটি অপারেটরের সংজ্ঞা আলাদা।', 'The series stop where the source stops. Nothing is estimated to fill the gap.', 'সূত্র যেখানে থেমেছে, সিরিজও সেখানে থেমেছে। ফাঁক পূরণে কোনো অনুমান নেই।'),
    ])
    th3 = lambda a, b, c, d, e, f: '<thead><tr><th>%s</th><th>%s</th><th>%s</th></tr></thead>' % (T(a, b), T(c, d), T(e, f))

    body = '''<header class="pagehead"><h1>%s</h1><p class="dek">%s</p><span class="updated">%s</span></header>
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="stack">%s<tbody>%s</tbody></table></div></div></section>
%s
<section class="block"><div class="sechead"><h2>%s</h2></div><div class="card"><div class="tablewrap"><table class="stack">%s<tbody>%s</tbody></table></div></div></section>
%s%s''' % (
        T('How this data is built', 'এই ডেটা যেভাবে তৈরি'),
        T('Where every number on this site comes from, how each one was checked, and what was done when the sources disagreed.',
          'এই সাইটের প্রতিটি সংখ্যা কোথা থেকে এসেছে, কীভাবে যাচাই করা হয়েছে, আর সূত্রগুলো না মিললে কী করা হয়েছে।'),
        T('By Mohd Imtiaz Karim · November 2026', 'মোহাম্মদ ইমতিয়াজ করিম · নভেম্বর ২০২৬'),
        T('Sources', 'সূত্র'), th3('Data', 'ডেটা', 'Source', 'সূত্র', 'Updated', 'হালনাগাদ'), sources,
        sec('Four checks on every quarter', 'প্রতিটি প্রান্তিকে চারটি যাচাই',
            '<p>Operator reports are long, and numbers get copied between columns and editions. Every quarter of operator data on this site passes four checks before it is published.</p>'
            '<ol><li><b>The parts add up.</b> Revenue lines add up to total revenue, EBITDA minus depreciation equals operating profit, and liabilities plus equity equal total assets.</li>'
            '<li><b>The quarters add up to the year.</b> Four quarters of revenue and profit match the audited annual report.</li>'
            '<li><b>Editions agree.</b> Where a quarter appears in more than one report, the values are compared. A difference means a restatement or an error, and the newer audited figure is used.</li>'
            '<li><b>Outliers are explained.</b> A spike or drop is kept only after the reason is found in the operator’s own notes, and the reason is shown next to the chart.</li></ol>',
            '<p>অপারেটরদের প্রতিবেদন দীর্ঘ, আর সংখ্যা এক কলাম থেকে আরেক কলামে, এক সংস্করণ থেকে আরেক সংস্করণে কপি হতে গিয়ে ভুল হয়। তাই এই সাইটে অপারেটরদের প্রতিটি প্রান্তিকের ডেটা প্রকাশের আগে চারটি যাচাই পার হয়।</p>'
            '<ol><li><b>অংশগুলো যোগ মেলে।</b> রেভিনিউর খাতগুলো যোগ করলে মোট রেভিনিউ হয়, EBITDA থেকে অবচয় বাদ দিলে পরিচালন মুনাফা হয়, আর দায় ও ইকুইটি মিলে মোট সম্পদ হয়।</li>'
            '<li><b>প্রান্তিক মিলে বছর।</b> চার প্রান্তিকের রেভিনিউ আর মুনাফা অডিট করা বার্ষিক প্রতিবেদনের সাথে মেলে।</li>'
            '<li><b>সংস্করণগুলো একমত।</b> একই প্রান্তিক একাধিক প্রতিবেদনে থাকলে সংখ্যাগুলো মিলিয়ে দেখা হয়। পার্থক্য থাকলে তা সংশোধন বা ভুল, আর তখন নতুন অডিট করা সংখ্যা নেওয়া হয়।</li>'
            '<li><b>অস্বাভাবিক সংখ্যার ব্যাখ্যা।</b> হঠাৎ বাড়া বা কমা সংখ্যা রাখা হয় কেবল অপারেটরের নিজের নোটে কারণ পাওয়ার পর, আর সেই কারণ চার্টের পাশে লেখা থাকে।</li></ol>'),
        T('What the checks found', 'যাচাইয়ে যা পাওয়া গেছে'), th3('Where', 'কোথায়', 'Problem', 'সমস্যা', 'What was done', 'যা করা হয়েছে'), found,
        sec('Network quality by upazila', 'উপজেলাভিত্তিক নেটওয়ার্কের মান',
            '<p>BTRC publishes its drive test results as one PDF per operator, with a long table of upazilas and city thanas. The tables were read into data for 516 areas, five quality measures per operator. District names sometimes appear in the middle of a block of rows, so each block was split and matched again by hand where needed. The result was checked against BTRC’s own list of areas where operators missed the benchmark, and every area on that list matched. Bangla names were added from a public gazetteer, and about 80 were written by hand. Teletalk was not assessed in this round, and the page says so instead of showing blanks.</p>',
            '<p>BTRC ড্রাইভ টেস্টের ফল প্রকাশ করে প্রতি অপারেটরের আলাদা PDF এ, উপজেলা আর সিটি থানার দীর্ঘ টেবিলে। সেই টেবিল থেকে ৫১৬টি এলাকার ডেটা নেওয়া হয়েছে, প্রতি অপারেটরের পাঁচটি মানদণ্ড। কোথাও কোথাও জেলার নাম সারির মাঝখানে আসে, তাই প্রতিটি অংশ আলাদা করে প্রয়োজনে হাতে মেলানো হয়েছে। এরপর ফলটি BTRC এর নিজের মান পূরণ না করা এলাকার তালিকার সাথে মেলানো হয়েছে, আর সেই তালিকার প্রতিটি এলাকা মিলেছে। বাংলা নাম নেওয়া হয়েছে একটি উন্মুক্ত তালিকা থেকে, আর প্রায় ৮০টি হাতে লেখা। এই দফায় টেলিটক মূল্যায়িত হয়নি, তাই পেজে ফাঁকা ঘর না রেখে সে কথাই লেখা আছে।</p>'),
        sec('Rules this site follows', 'এই সাইটের নিয়ম',
            '<ul><li>Every number shows its month or quarter and its source.</li><li>Nothing is estimated to fill a gap. If a source stops publishing a series, the chart stops too.</li>'
            '<li>Where an operator’s definition differs, such as data revenue or ARPU, the page says so before you compare.</li>'
            '<li>Daily-changing commercial data, such as internet pack prices, is left out because it cannot be kept accurate.</li>'
            '<li>The CSV behind each finance page can be downloaded, so anyone can redo the checks.</li></ul>',
            '<ul><li>প্রতিটি সংখ্যার সাথে তার মাস বা প্রান্তিক আর সূত্র দেখানো থাকে।</li><li>ফাঁক পূরণে কোনো অনুমান নেই। কোনো সূত্র একটি সিরিজ প্রকাশ বন্ধ করলে চার্টও সেখানে থামে।</li>'
            '<li>অপারেটরদের সংজ্ঞা আলাদা হলে, যেমন ডেটা রেভিনিউ বা ARPU, তুলনার আগেই পেজে তা বলা থাকে।</li>'
            '<li>প্রতিদিন বদলায় এমন বাণিজ্যিক তথ্য, যেমন ইন্টারনেট প্যাকের দাম, রাখা হয়নি, কারণ তা নির্ভুল রাখা সম্ভব নয়।</li>'
            '<li>প্রতিটি আর্থিক পেজের পেছনের CSV ডাউনলোড করা যায়, তাই যে কেউ যাচাইগুলো নিজে করে দেখতে পারেন।</li></ul>'))
    write('methodology/index.html', page('methodology/', 'data', 'How this data is built: sources and checks | BD Telecom', 'এই ডেটা যেভাবে তৈরি: সূত্র আর যাচাই | BD Telecom',
          'Where the Bangladesh telecom data on this site comes from, the four checks every operator quarter passes, and the errors those checks found in published reports.', body,
          crumbs=[('/bd-telecom/', 'BD Telecom', 'BD Telecom')]))
    return ['bd-telecom/methodology/']
