import json
from add_law_guide import table, INFO, WARN, DL
PDF='/bd-telecom/docs/sim-recycle-directive-2024.pdf'
en=f'''<div class="callout">{INFO}<p><b>In short:</b> If a SIM stays inactive for <b>11 months</b>, the operator sends a notice. <b>30 days</b> later, 12 months in all, the number can be recycled and sold to someone else. To hold on to a number you are not using, operators may offer a paid extension of the SIM's registration for 2 or 3 years.</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>Download the BTRC directive (PDF, Bangla)</span></a></div>
<h2>What the directive is</h2>
<p>BTRC's Systems and Services Division sent this directive to Grameenphone, Robi, Banglalink and Teletalk on <b>17 November 2024</b> (memo 14.32.0000.600.53.003.21.3083). It updates BTRC's earlier instruction of 10 November 2015. The aim is to ease the shortage of mobile numbers by putting unused ones back into circulation (clause a).</p>
<h2>The basic timeline</h2>
{table(['Stage','When'],[['SIM inactive','11 months'],['Notice period, after the operator’s notice','30 days'],['Number can be recycled','After 12 months in total']])}
<h2>Keeping a number longer: paid registration extension</h2>
<p>Operators may let customers extend the registration of an inactive SIM by <b>2 or 3 years</b>, under these conditions (clause b):</p>
<ol class="stepsv">
<li><b>The extension starts after the normal 12 months.</b> The extended period is counted from the end of the standard 11 months plus 30 days.</li>
<li><b>If you pay for an extension and also recharge,</b> the SIM cannot be recycled until whichever is later: the end of the extension you paid for, or the recharge's minimum validity plus 11 months inactive plus the 30-day notice.</li>
<li><b>If you pay but have no recharge balance validity</b> during that time, the SIM can be recycled 30 days after a notice once the extension ends.</li>
<li><b>Unlimited packages</b> follow the new recycle rules from the day the package expires.</li>
<li><b>No bonus with the extension.</b> Operators cannot give data, talk time or SMS bonuses with a paid registration extension. VAT and tax apply as the law requires.</li>
<li><b>Operators must tell customers.</b> They must explain the rules through SMS, leaflets, their apps and online platforms such as Facebook.</li>
</ol>
<p>BTRC can change any of these conditions at any time (clause c).</p>
<h2>What to do about a number you rarely use</h2>
<ul>
<li>Read the operator's notice SMS. It is your 30-day warning before the number can go to someone else.</li>
<li>Ask your operator what keeps a SIM active and what a 2- or 3-year extension costs. The directive leaves the price and details to the operator.</li>
<li>Before you let a number go, change it in your bank, MFS, email and social media accounts. Once a number is recycled, the new owner gets any SMS sent to it, including one-time codes.</li>
</ul>
<div class="callout warn">{WARN}<p>This is a plain-language summary of the BTRC directive, not legal advice. Each operator sets its own process and fees within these rules.</p></div>'''
bn=f'''<div class="callout">{INFO}<p><b>সংক্ষেপে:</b> কোনো SIM <b>১১ মাস</b> নিষ্ক্রিয় থাকলে অপারেটর নোটিশ পাঠাবে। এর <b>৩০ দিন</b> পর, মানে মোট ১২ মাসে, নম্বরটি রিসাইকেল করে অন্য কারও কাছে বিক্রি করা যাবে। ব্যবহার না করা নম্বর ধরে রাখতে অপারেটর টাকার বিনিময়ে SIM এর রেজিস্ট্রেশন ২ বা ৩ বছর বাড়ানোর সুযোগ দিতে পারে।</p></div>
<div class="btns inprose"><a class="btn primary" href="{PDF}" download>{DL}<span>BTRC এর নির্দেশনা ডাউনলোড (PDF)</span></a></div>
<h2>নির্দেশনাটি কী</h2>
<p>BTRC এর সিস্টেমস এন্ড সার্ভিসেস বিভাগ <b>১৭ নভেম্বর ২০২৪</b> এ গ্রামীণফোন, রবি, বাংলালিংক আর টেলিটককে এই নির্দেশনা পাঠায় (স্মারক নং ১৪.৩২.০০০০.৬০০.৫৩.০০৩.২১.৩০৮৩)। এটি ১০ নভেম্বর ২০১৫ এর আগের নির্দেশনা হালনাগাদ করেছে। উদ্দেশ্য হলো অব্যবহৃত নম্বর আবার চালু করে মোবাইল নম্বরের স্বল্পতা দূর করা (অনুচ্ছেদ ক)।</p>
<h2>মূল সময়সূচি</h2>
{table(['ধাপ','কখন'],[['SIM নিষ্ক্রিয়','১১ মাস'],['অপারেটরের নোটিশের পর নোটিশ সময়কাল','৩০ দিন'],['নম্বর রিসাইকেল করা যাবে','মোট ১২ মাস পর']])}
<h2>নম্বর বেশিদিন রাখা: টাকা দিয়ে রেজিস্ট্রেশন বাড়ানো</h2>
<p>অপারেটর এই শর্তগুলো মেনে নিষ্ক্রিয় SIM এর রেজিস্ট্রেশন <b>২ বা ৩ বছর</b> বাড়াতে পারবে (অনুচ্ছেদ খ):</p>
<ol class="stepsv">
<li><b>বাড়তি মেয়াদ শুরু হবে সাধারণ ১২ মাসের পর।</b> স্বাভাবিক ১১ মাস আর ৩০ দিন শেষ হওয়ার পর থেকে বাড়ানো মেয়াদ গোনা হবে।</li>
<li><b>টাকা দিয়ে মেয়াদ বাড়ালে আর রিচার্জও করলে,</b> নিচের দুটির মধ্যে যেটি পরে শেষ হয়, তার আগে SIM রিসাইকেল করা যাবে না: টাকা দিয়ে বাড়ানো মেয়াদ, অথবা রিচার্জের ন্যূনতম মেয়াদ + ১১ মাস নিষ্ক্রিয় + ৩০ দিনের নোটিশ।</li>
<li><b>টাকা দিয়েছেন কিন্তু রিচার্জ ব্যালেন্সের মেয়াদ নেই,</b> এমন হলে বাড়ানো মেয়াদ শেষ হওয়ার পর ৩০ দিনের নোটিশ দিয়ে SIM রিসাইকেল করা যাবে।</li>
<li><b>আনলিমিটেড প্যাকেজ</b> কিনলে প্যাকেজের মেয়াদ শেষ হওয়ার দিন থেকে নতুন রিসাইকেল নিয়ম চলবে।</li>
<li><b>মেয়াদ বাড়ানোর সাথে বোনাস নয়।</b> টাকা দিয়ে রেজিস্ট্রেশন বাড়ালে অপারেটর ডেটা, টকটাইম বা SMS বোনাস দিতে পারবে না। আইন অনুযায়ী ভ্যাট আর ট্যাক্স দিতে হবে।</li>
<li><b>অপারেটরকে জানাতে হবে।</b> SMS, লিফলেট, অ্যাপ আর ফেসবুকের মতো অনলাইন প্ল্যাটফর্মে গ্রাহকদের এই নিয়ম জানাতে হবে।</li>
</ol>
<p>BTRC যেকোনো সময় এই শর্তগুলো বদলাতে পারবে (অনুচ্ছেদ গ)।</p>
<h2>কম ব্যবহার করা নম্বর নিয়ে যা করবেন</h2>
<ul>
<li>অপারেটরের নোটিশ SMS খেয়াল করে পড়ুন। নম্বর অন্য কারও কাছে যাওয়ার আগে এটাই আপনার ৩০ দিনের সতর্কবার্তা।</li>
<li>কী করলে SIM সক্রিয় থাকে আর ২ বা ৩ বছর বাড়াতে কত লাগে, তা অপারেটরের কাছে জেনে নিন। দাম আর খুঁটিনাটি নির্দেশনায় অপারেটরের ওপর ছেড়ে দেওয়া হয়েছে।</li>
<li>নম্বর ছেড়ে দেওয়ার আগে ব্যাংক, MFS, ইমেইল আর সোশ্যাল মিডিয়া অ্যাকাউন্টে নম্বর বদলে নিন। রিসাইকেল হওয়ার পর ওই নম্বরে আসা সব SMS, OTP সহ, নতুন মালিক পাবেন।</li>
</ul>
<div class="callout warn">{WARN}<p>এটা BTRC নির্দেশনার সহজ ভাষার সারাংশ, আইনি পরামর্শ নয়। এই নিয়মের মধ্যে থেকে প্রতিটি অপারেটর নিজের প্রক্রিয়া আর ফি ঠিক করে।</p></div>'''
g=dict(slug='sim-recycle-rules-2024',icon='sim',color='--tt',
 title_en='When does an unused SIM get recycled in Bangladesh?',
 title_bn='অব্যবহৃত SIM কতদিন পর রিসাইকেল হয়?',
 sum_en='BTRC’s 2024 directive: 11 months inactive plus a 30-day notice, then your number can go to someone else, and how a paid 2- or 3-year extension works.',
 sum_bn='BTRC এর ২০২৪ এর নির্দেশনা: ১১ মাস নিষ্ক্রিয় আর ৩০ দিনের নোটিশের পর নম্বর অন্যের কাছে যেতে পারে, আর টাকা দিয়ে ২ বা ৩ বছর বাড়ানোর নিয়ম।',
 sources=[['BTRC directive on the recycle period for unused SIMs, 17 November 2024 (PDF)',PDF]],
 body_en=en,body_bn=bn)
G=json.load(open('guides.json',encoding='utf8'))
G=[x for x in G if x['slug']!=g['slug']]
i=[x['slug'] for x in G].index('sim-limit'); G.insert(i,g)
json.dump(G,open('guides.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print([x['slug'] for x in G])
