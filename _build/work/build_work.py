"""Builds the three field case study pages in /work/<slug>/.

Reuses the look of /churn/ (styles, header, contact footer) so every case study
page feels like part of the same site. Slides are pre-rendered to
/work/<slug>/slides/NN.webp from the LinkedIn carousel PDFs.

Run from the repo root:  python3 _build/work/build_work.py
"""
import glob, html, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
churn = open(os.path.join(ROOT, 'churn', 'index.html'), encoding='utf-8').read()

BASE_CSS = re.search(r'<style>(.*?)</style>', churn, re.S).group(1)
MARK = re.search(r'(<a class="mark".*?</a>)', churn, re.S).group(1)
SCRIPT = re.search(r'(<script>\s*var CONTACT.*?</script>)', churn, re.S).group(1)
ICON = '<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">'

EXTRA_CSS = """
.hero-photo{margin-top:30px;border-radius:16px;overflow:hidden;border:1px solid var(--line);max-width:var(--read)}
.hero-photo img{width:100%;height:auto}
.story p{font-size:1.08rem}
.steps{list-style:none;margin:18px 0 0;padding:0;counter-reset:s;border-top:1px solid var(--line);max-width:var(--read)}
.steps li{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:16px 0;border-bottom:1px solid var(--line);counter-increment:s}
.steps li::before{content:counter(s,decimal-leading-zero);font-family:var(--display);font-weight:700;font-size:1.3rem;color:var(--amber-deep);line-height:1.3}
.steps b{font-family:var(--display);font-weight:600;display:block}
.steps span{color:var(--muted)}

/* slide viewer: swipe on a phone, arrows or keys on a laptop */
.deck{margin-top:22px;max-width:620px}
.deck-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;border-radius:14px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.deck-track::-webkit-scrollbar{display:none}
.deck-track figure{flex:0 0 100%;margin:0;scroll-snap-align:center;background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.deck-track img{width:100%;height:auto}
.deck-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}
.deck-bar button{font:600 .95rem var(--display);width:44px;height:44px;border-radius:10px;border:1.5px solid var(--ink);background:var(--surface);color:var(--ink);cursor:pointer}
.deck-bar button:disabled{opacity:.3;cursor:default}
.deck-bar button:not(:disabled):hover{border-color:var(--teal);color:var(--teal-deep)}
.deck-count{font-family:var(--display);font-weight:600;color:var(--muted);font-size:.95rem}
.dots{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.dots i{width:7px;height:7px;border-radius:50%;background:var(--line)}
.dots i.on{background:var(--teal)}
.lessons{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:12px;max-width:var(--read)}
.lessons li{padding:16px 18px;border-radius:12px;background:var(--surface);border:1px solid var(--line)}
.lessons b{font-family:var(--display);font-weight:600;display:block;margin-bottom:4px}
.lessons span{color:var(--muted)}
.more{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:18px;max-width:var(--read)}
.more a{display:block;padding:16px 18px;border-radius:12px;background:var(--surface);border:1px solid var(--line);text-decoration:none;color:var(--ink)}
.more a:hover{border-color:var(--teal)}
.more b{font-family:var(--display);font-weight:600;display:block}
.more span{color:var(--muted);font-size:.92rem}
@media (max-width:600px){.more{grid-template-columns:1fr}}
"""

DECK_JS = """<script>
document.querySelectorAll('.deck').forEach(function(d){
  var t=d.querySelector('.deck-track'),f=t.children,n=f.length,c=d.querySelector('.deck-count'),
      p=d.querySelector('[data-dir="-1"]'),x=d.querySelector('[data-dir="1"]'),dots=d.querySelectorAll('.dots i');
  function cur(){return Math.round(t.scrollLeft/(f[0].offsetWidth+12))}
  function upd(){var i=cur();c.textContent=(i+1)+' / '+n;p.disabled=i<=0;x.disabled=i>=n-1;
    dots.forEach(function(e,k){e.classList.toggle('on',k===i)})}
  function go(i){i=Math.max(0,Math.min(n-1,i));t.scrollTo({left:i*(f[0].offsetWidth+12),behavior:'smooth'})}
  p.onclick=function(){go(cur()-1)};x.onclick=function(){go(cur()+1)};
  t.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  t.tabIndex=0;t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur()+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur()-1)}});
  addEventListener('resize',upd);upd();
});
</script>"""

PAGES = [
  dict(
    slug='rssp-network',
    title='45 Robi service points in one year',
    seo='Building 45 Robi Sales and Service Points in one year',
    desc='How Mohd Imtiaz Karim built 45 Robi Sales and Service Points across 14 upazilas of Chandpur and Lakshmipur in one year: site selection, landlord deals, renovation, hiring and go-live.',
    kicker='Field case study · Channel build-out',
    photo=('/assets/logos/rssp-opening.jpg', 800, 600, 'Opening day of a Robi Sheba and Airtel Care service point with the team and partners'),
    lede='Robi needed customer-facing service points in places that had never had one. Over one year I walked the ground, closed the deals and opened 45 Robi Sales and Service Points across two districts, one location at a time.',
    tags=['Channel strategy', 'Site selection', 'Negotiation', 'Field operations', 'Team building'],
    linkedin='https://lnkd.in/p/gKRfCy7t',
    proof=[('45', 'Sales and Service Points opened'), ('2', 'districts, Chandpur and Lakshmipur'), ('14', 'upazilas covered'), ('45', 'unions reached')],
    story=[
      'This was not one flagship center. It was a network built union by union, so customers in a bazar far from the district town could get a SIM, fix a problem or recharge without travelling.',
      'Chandpur ended up with 25 points across 8 upazilas and Lakshmipur with 20 points across 6. Every point is plotted by its exact location, so the spread can be checked against where customers actually live.',
    ],
    steps_h='Five steps, forty-five times over',
    steps=[
      ('Site selection', 'Walking the ground, reading footfall and choosing the right corner of the bazar.'),
      ('Landlord negotiation', 'Rent, advance and agreement terms, closed one conversation at a time.'),
      ('Renovation', 'Turning an empty shop into a customer-ready Robi point.'),
      ('Recruitment and training', 'Putting the right people behind the counter, ready on day one.'),
      ('Go-live', 'Doors open. Then straight on to the next point.'),
    ],
    lessons=None,
  ),
  dict(
    slug='robi-wifi-fwa',
    title='Robi WiFi: zero to 1,500 homes in 11 months',
    seo='Robi WiFi: zero to 1,500 customers in 11 months',
    desc='How a brand-new fixed wireless product went from zero to 1,500+ customers across 20+ thanas of Chandpur and Lakshmipur, with the month by month numbers and a thana-level customer map. By Mohd Imtiaz Karim.',
    kicker='Field case study · New product launch',
    photo=('/assets/logos/fwa-handover.jpg', 800, 600, 'Handing a Robi WiFi router to a new customer at a retail shop'),
    lede='In August 2025 Robi WiFi was a brand-new product in a market that had never heard of it. The question was simple: can we sell home WiFi door to door in Chandpur and Lakshmipur? Eleven months later the answer was 1,500 homes.',
    tags=['Product launch', 'Sales tracking', 'Choropleth map', 'Retail channel', 'Data story'],
    linkedin='https://lnkd.in/p/gWKZJxze',
    proof=[('1,500+', 'customers connected'), ('20+', 'thanas reached'), ('2', 'districts'), ('11', 'months, Aug 2025 to Jun 2026')],
    story=[
      'There was no playbook. We sold at haat-bazaars, under umbrellas and in shops, and most of the families we met had never owned a router before. Customer education was the hardest part, so we taught, installed and stayed.',
      'I tracked every month from the first 33 customers in August 2025. Growth was slow for the first three months, then December 2025 brought a breakthrough of 279 new connections. May and June 2026 were the second and third best months of the whole run, which took the total past 1,500.',
      'To show where demand really came from, I mapped customers by thana on Bangladesh administrative boundaries. The deeper the red, the more homes connected.',
    ],
    steps_h=None, steps=None,
    lessons=[
      ('New products are sold on trust, not specs.', 'In semi-urban markets people buy from someone they believe. Every installation done right became our best advertisement.'),
      ('Momentum compounds when the channel believes.', 'The December jump came after months of retailer training and RSSP engagement, not from a single campaign.'),
      ('The best growth came last, not first.', 'Eleven months in, the run was still speeding up. If you launch something new in the field, play the long game.'),
    ],
  ),
  dict(
    slug='superbike-fleet',
    title='Running Bangladesh’s first electric telecom Superbike fleet',
    seo='Running Robi’s electric Superbike fleet in Chandpur',
    desc='How Mohd Imtiaz Karim leads Robi’s electric Superbike fleet in Chandpur: rider recruitment and training, route planning, maintenance and a daily productivity KPI for every bike.',
    kicker='Field case study · Fleet operations',
    photo=('/assets/logos/superbike-fleet.jpg', 800, 590, 'New Robi Superbikes handed over to field riders at a distributor point'),
    lede='No company in Bangladesh had deployed an electric Superbike fleet for telecom field sales and service before Robi did. I lead the fleet in the Chandpur Region from day one: the riders, the routes, the bikes and the numbers that show whether it is working.',
    tags=['KPI design', 'Fleet operations', 'GPS data', 'Team leadership', 'Dashboard'],
    linkedin='https://lnkd.in/p/g_9SNA5W',
    proof=[('73', 'electric Superbikes in the fleet this year'), ('Day 1', 'leading it since launch'), ('3 KM', 'daily run rule for every bike'), ('20', 'good days a month, the productivity KPI')],
    story=[
      'The fleet launched with 68 bikes and we added 5 more, so it now stands at 73, the locked number for this year. The slides below were made at the 68-bike stage.',
      'A Superbike is digital service on wheels. Zero-emission bikes carry SIMs, service and connectivity to the last mile, from bazaar to bazaar and union to union, so customers get served at their doorstep instead of travelling to us.',
      'My role covers the whole thing from A to Z: recruiting, onboarding and training the riders, daily fleet movement and route planning, maintenance, charging and vendor operations, and daily performance tracking.',
      'To keep the fleet honest I set a daily compliance rule, every bike runs 3 KM or more, and a monthly productivity KPI of 20 good days. Both are tracked per bike, per distributor and per supplier, with fault reports and flags for bikes that repeatedly show zero KM.',
    ],
    steps_h='What keeps it moving',
    steps=[
      ('Safety first', 'Certified helmets and protective gear for every rider, because people come before numbers.'),
      ('Service at the doorstep', 'Daily activations at bazaars, growth centers and union points.'),
      ('Every season, every road', 'Winter fog or monsoon rain, gear checks, route discipline and vendor coordination keep the bikes moving.'),
    ],
    lessons=None,
  ),
]

OTHER = {p['slug']: p for p in PAGES}


def esc(s):
    return html.escape(s, quote=True)


def deck(slug, alt_title):
    files = sorted(glob.glob(os.path.join(ROOT, 'work', slug, 'slides', '*.webp')))
    from PIL import Image
    figs, dots = [], []
    for i, f in enumerate(files, 1):
        w, h = Image.open(f).size
        name = os.path.basename(f)
        figs.append('<figure><img src="slides/%s" width="%d" height="%d" alt="Slide %d of %d, %s" %s></figure>'
                    % (name, w, h, i, len(files), esc(alt_title), 'fetchpriority="high"' if i == 1 else 'loading="lazy"'))
        dots.append('<i></i>')
    return ('<div class="deck" aria-roledescription="carousel" aria-label="Slides">'
            '<div class="deck-track">%s</div>'
            '<div class="deck-bar"><button type="button" data-dir="-1" aria-label="Previous slide">&larr;</button>'
            '<div><div class="deck-count" aria-live="polite">1 / %d</div><div class="dots" aria-hidden="true">%s</div></div>'
            '<button type="button" data-dir="1" aria-label="Next slide">&rarr;</button></div></div>'
            % (''.join(figs), len(files), ''.join(dots))), len(files)


def build(p):
    slug = p['slug']
    deck_html, n = deck(slug, p['title'])
    url = 'https://www.imtiazkarim.com/work/%s/' % slug
    og = 'https://www.imtiazkarim.com/work/%s/share.jpg' % slug
    proof = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (esc(a), esc(b)) for a, b in p['proof'])
    story = ''.join('<p>%s</p>' % esc(s) for s in p['story'])
    steps = ''
    if p['steps']:
        steps = ('<h3 style="margin-top:34px">%s</h3><ol class="steps">%s</ol>'
                 % (esc(p['steps_h']), ''.join('<li><div><b>%s</b><span>%s</span></div></li>' % (esc(a), esc(b)) for a, b in p['steps'])))
    lessons = ''
    if p['lessons']:
        lessons = ('<h3 style="margin-top:34px">Three things this journey taught me</h3><ul class="lessons">%s</ul>'
                   % ''.join('<li><b>%s</b><span>%s</span></li>' % (esc(a), esc(b)) for a, b in p['lessons']))
    others = ''.join('<a href="/work/%s/"><b>%s</b><span>Field case study</span></a>' % (o['slug'], esc(o['title']))
                     for o in PAGES if o['slug'] != slug) + '<a href="/work/taka-gelo-koi/"><b>Taka Gelo Koi?, a money app I built end to end</b><span>Product case study</span></a>'
    ph = p['photo']
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(p['seo'])} · Mohd Imtiaz Karim</title>
<meta name="description" content="{esc(p['desc'])}">
<meta property="og:title" content="{esc(p['title'])}">
<meta property="og:description" content="{esc(p['desc'])}">
<meta property="og:image" content="{og}">
<meta property="og:type" content="article">
<link rel="canonical" href="{url}">
{ICON}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<style>{BASE_CSS}{EXTRA_CSS}</style>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<header class="top" id="top">
  <div class="wrap">
    {MARK}
    <nav class="nav" aria-label="Sections">
      <a href="#story">Story</a><a href="#slides">Slides</a><a href="/#projects">All projects</a>
    </nav>
  </div>
</header>

<main id="main">
<section class="intro">
  <div class="wrap">
    <a class="back" href="/#projects">&larr; Back to projects</a>
    <p class="kicker">{esc(p['kicker'])}</p>
    <h1>{esc(p['title'])}</h1>
    <p class="lede">{esc(p['lede'])}</p>
    <div class="meta">{''.join('<span>%s</span>' % esc(t) for t in p['tags'])}</div>
    <div class="cta">
      <a class="btn primary" href="#slides">See the {n} slides</a>
      <a class="btn" href="{p['linkedin']}" target="_blank" rel="noopener">Original post on LinkedIn</a>
    </div>
    <div class="hero-photo"><img src="{ph[0]}" width="{ph[1]}" height="{ph[2]}" alt="{esc(ph[3])}"></div>
  </div>
</section>

<section class="proof" aria-label="Headline numbers">
  <div class="wrap"><dl>{proof}</dl></div>
</section>

<section class="block story" id="story">
  <div class="wrap read">
    <span class="num">THE STORY</span>
    <h2>What happened on the ground</h2>
    {story}
    {steps}
    {lessons}
  </div>
</section>

<section class="block" id="slides">
  <div class="wrap">
    <span class="num">THE SLIDES</span>
    <h2>The full story in {n} slides</h2>
    <p>The same carousel I shared on LinkedIn. Swipe on a phone, or use the arrows and your keyboard on a laptop.</p>
    {deck_html}
    <div class="cta">
      <a class="btn primary" href="{slug}-slides.pdf" download>Download the slides (PDF)</a>
      <a class="btn" href="{p['linkedin']}" target="_blank" rel="noopener">See the post and comments on LinkedIn</a>
    </div>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <span class="num">MORE FROM THE FIELD</span>
    <h2>Other field case studies</h2>
    <div class="more">{others}</div>
    <p style="margin-top:22px"><a href="/#projects">See every project, including the data work</a></p>
  </div>
</section>
</main>

<footer class="contact" id="contact">
  <div class="wrap">
    <h2>Looking for someone who knows both the field and the data?</h2>
    <p>I'm open to business analyst and analytics roles where operations experience counts. The quickest way to reach me is LinkedIn or WhatsApp.</p>
    <div class="cta">
      <a class="btn primary" data-link="linkedin" href="#">Message me on LinkedIn</a>
      <a class="btn" data-link="whatsapp" href="#">WhatsApp</a>
      <a class="btn" href="https://github.com/imtiaz99000" target="_blank" rel="noopener">GitHub</a>
    </div>
    <div class="foot"><span>© 2026 Mohd Imtiaz Karim, Chandpur, Bangladesh</span><span>Photos and slides from my own field work at Robi Axiata.</span></div>
  </div>
</footer>

{SCRIPT}
{DECK_JS}
</body>
</html>
"""
    with open(os.path.join(ROOT, 'work', slug, 'index.html'), 'w', encoding='utf-8') as fh:
        fh.write(page)
    print('wrote work/%s/index.html (%d slides)' % (slug, n))


TAKA = dict(
  title='Taka Gelo Koi? A full money app, built from my own records',
  seo='Taka Gelo Koi?: building a bilingual, encrypted money app',
  desc='Case study by Mohd Imtiaz Karim: how 25 months of personal spending records became Taka Gelo Koi?, a bilingual money app with payslip PDF reading, income tax, salary projection, Zakat and end-to-end encryption.',
  lede='I kept my household accounts in Excel for 25 months. Every month I fixed broken formulas, retyped payslip figures and guessed how much tax I owed. So I turned the spreadsheet into an app anyone in Bangladesh can use: log money in Bangla or English, read payslip PDFs, work out income tax, project salary against inflation, plan savings and calculate Zakat. Every entry is encrypted on the phone before it is saved.',
  tags=['Product design', 'JavaScript', 'Firebase', 'Web Crypto', 'pdf.js', 'SheetJS', 'Forecasting', 'Data privacy'],
  proof=[('25 months', 'of my own records it started from'), ('12', 'sections, from spending to tax and projection'), ('2 languages', 'full Bangla and English'), ('AES-256', 'encryption on the device before saving')],
  problem=['A spreadsheet is fine until it is not. Mine had one sheet per month, categories typed slightly differently each time, payslip figures copied by hand and a tax estimate I redid every June. I could see what I spent, but not where my salary was heading, whether a raise beat inflation, or when a savings goal would actually be reached.',
           'Most money apps in the market are built for other countries. They do not know a Bangladeshi payslip, the income tax slabs, Eid bonuses, PMS, provident fund or Zakat, and many of them want your data on their servers in plain text.'],
  built=[('Income and spending', 'Log entries in Bangla or English, with the category picked from the item name. Monthly budgets per category turn red when you go over. An existing Excel tracker imports in one step.'),
         ('Payslip reader', 'Upload payslip PDFs or a .zip of them. The app reads fixed pay, incentive, bonuses, provident fund and tax on the phone itself and never keeps bank account or TIN numbers. It then charts what each payslip paid and how incentive moves month to month.'),
         ('Income tax', 'Works out the year\'s tax the way an employer\'s tax card does: taxable income, each slab, the investment rebate, what has been deducted and what is still due, with a hint of how much more investment would lower the bill.'),
         ('Salary projection', 'Projects fixed and regular pay for the next five years from the latest payslip, with yearly increments, bonuses and a what-if-I\'m-promoted option, then shows it again in today\'s money using BBS inflation, so a raise can be judged against prices.'),
         ('Savings goal', 'Set a target and the money going in each month, and the app finds the month the goal is reached, the milestones on the way and an execution plan for each period.'),
         ('Zakat, loans and funds', 'A Zakat calculator with assets, debts, nisab and a record of payments, a register of money lent and borrowed with repayments, and separate funds for money held for others.')],
  safety=['Sign in with Google, or use it without an account and keep everything in the browser.',
          'Every document is compressed and encrypted in the browser with AES-256-GCM before it leaves the phone. The key is protected by your passphrase (600,000 rounds of PBKDF2) and a recovery code. Neither I nor Google can read anyone\'s entries.',
          'One encrypted copy is kept per day for 30 days, so a mistake can be rolled back. Full backups download as a file at any time.'],
  learned=[('Start from a real problem you have.', 'Every feature exists because I needed it in my own monthly routine first. That made it easy to say no to features nobody would use.'),
           ('Messy inputs are most of the work.', 'Payslips change layout, re-issued copies repeat months and Excel sheets are never consistent. Most of the code is cleaning and checking, the same as any analytics job.'),
           ('Trust is a feature.', 'People will not put their salary into an app they cannot trust, so encryption and a clear privacy policy came before any new screen.')],
  shots=[('overview', 'Overview: money in and out, savings rate, where it went against budget and the biggest spends'),
         ('payslips', 'Payslips: what each payslip paid, with bonuses marked, and incentive month by month against the average'),
         ('projection', 'Projection: where the salary is heading for five years, in taka and in today\'s money'),
         ('tax', 'Income tax: taxable income, each slab, the investment rebate and what is still due'),
         ('goal', 'Savings goal: the month the target is reached and the balance over time'),
         ('spending', 'Income and spending: monthly entries with category budgets'),
         ('zakat', 'Zakat: assets, nisab and payments made')],
)


def build_taka():
    p = TAKA; slug = 'taka-gelo-koi'
    from PIL import Image
    url = 'https://www.imtiazkarim.com/work/%s/' % slug
    def shot(k, cap, first=False):
        w, h = Image.open(os.path.join(ROOT, 'work', slug, 'shots', k + '.webp')).size
        return '<figure class="shot"><img src="shots/%s.webp" width="%d" height="%d" alt="%s" %s><figcaption>%s</figcaption></figure>' % (k, w, h, esc(cap), 'fetchpriority="high"' if first else 'loading="lazy"', esc(cap))
    hero = shot(*p['shots'][0], first=True)
    gallery = ''.join(shot(k, c) for k, c in p['shots'][1:])
    mob = ''.join('<figure class="mob"><img src="shots/mobile-bn-%s.webp" width="780" height="1688" alt="%s" loading="lazy"></figure>' % (k, a) for k, a in [('home', 'Overview in Bangla on a phone'), ('pay', 'Payslips in Bangla on a phone')])
    proof = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (esc(a), esc(b)) for a, b in p['proof'])
    built = ''.join('<li><div><b>%s</b><span>%s</span></div></li>' % (esc(a), esc(b)) for a, b in p['built'])
    learned = ''.join('<li><b>%s</b><span>%s</span></li>' % (esc(a), esc(b)) for a, b in p['learned'])
    others = ''.join('<a href="/work/%s/"><b>%s</b><span>Field case study</span></a>' % (o['slug'], esc(o['title'])) for o in PAGES)
    css = EXTRA_CSS + """
.shot{margin:0 0 22px;max-width:var(--read)}
.shot img{width:100%;height:auto;border-radius:14px;border:1px solid var(--line);box-shadow:10px 12px 0 var(--mist);background:#fff}
.shot figcaption{font-size:.92rem;color:var(--muted);margin-top:10px}
.intro .shot{margin-top:30px;max-width:900px}
.mobs{display:flex;gap:16px;margin:8px 0 0;flex-wrap:wrap}
.mob{margin:0;width:min(240px,46%)}.mob img{width:100%;height:auto;border-radius:18px;border:6px solid var(--ink)}
.note-sample{font-size:.9rem;color:var(--muted);background:#FDF1DC;border-radius:10px;padding:10px 14px;max-width:var(--read)}
"""
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(p['seo'])} · Mohd Imtiaz Karim</title>
<meta name="description" content="{esc(p['desc'])}">
<meta property="og:title" content="{esc(p['title'])}">
<meta property="og:description" content="{esc(p['desc'])}">
<meta property="og:image" content="https://www.imtiazkarim.com/work/{slug}/share.jpg">
<meta property="og:type" content="article">
<link rel="canonical" href="{url}">
{ICON}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<style>{BASE_CSS}{css}</style>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<header class="top" id="top">
  <div class="wrap">
    {MARK}
    <nav class="nav" aria-label="Sections">
      <a href="#problem">Problem</a><a href="#built">What I built</a><a href="#screens">Screens</a><a href="/#projects">All projects</a>
    </nav>
  </div>
</header>

<main id="main">
<section class="intro">
  <div class="wrap">
    <a class="back" href="/#projects">&larr; Back to projects</a>
    <p class="kicker">Product case study · Personal finance app</p>
    <h1>{esc(p['title'])}</h1>
    <p class="lede">{esc(p['lede'])}</p>
    <div class="meta">{''.join('<span>%s</span>' % esc(t) for t in p['tags'])}</div>
    <div class="cta">
      <a class="btn primary" href="https://taka.imtiazkarim.com/" target="_blank" rel="noopener">Open the app</a>
      <a class="btn" href="#screens">See the screens</a>
    </div>
    {hero}
    <p class="note-sample">Every screen on this page shows the app's built-in sample data for a made-up household. None of it is my own money.</p>
  </div>
</section>

<section class="proof" aria-label="Headline numbers">
  <div class="wrap"><dl>{proof}</dl></div>
</section>

<section class="block story" id="problem">
  <div class="wrap read">
    <span class="num">01 · THE PROBLEM</span>
    <h2>Why a spreadsheet was not enough</h2>
    {''.join('<p>%s</p>' % esc(x) for x in p['problem'])}
  </div>
</section>

<section class="block" id="built">
  <div class="wrap read">
    <span class="num">02 · WHAT I BUILT</span>
    <h2>Six parts, one app</h2>
    <ol class="steps">{built}</ol>
  </div>
</section>

<section class="block" id="screens">
  <div class="wrap">
    <span class="num">03 · THE SCREENS</span>
    <h2>What it looks like</h2>
    {gallery}
    <h3 style="margin-top:30px">Fully in Bangla, made for a phone</h3>
    <p>Every label, number and month switches to Bangla with one tap.</p>
    <div class="mobs">{mob}</div>
  </div>
</section>

<section class="block" id="privacy">
  <div class="wrap read">
    <span class="num">04 · KEEPING IT PRIVATE</span>
    <h2>Only you can read your entries</h2>
    {''.join('<p>%s</p>' % esc(x) for x in p['safety'])}
  </div>
</section>

<section class="block">
  <div class="wrap read">
    <span class="num">05 · WHAT I LEARNED</span>
    <h2>Three lessons from building it</h2>
    <ul class="lessons">{learned}</ul>
    <div class="cta"><a class="btn primary" href="https://taka.imtiazkarim.com/" target="_blank" rel="noopener">Try Taka Gelo Koi?</a></div>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <span class="num">MORE WORK</span>
    <h2>Field case studies</h2>
    <div class="more">{others}</div>
    <p style="margin-top:22px"><a href="/#projects">See every project, including the data work</a></p>
  </div>
</section>
</main>

<footer class="contact" id="contact">
  <div class="wrap">
    <h2>Looking for someone who knows both the field and the data?</h2>
    <p>I'm open to business analyst and analytics roles where operations experience counts. The quickest way to reach me is LinkedIn or WhatsApp.</p>
    <div class="cta">
      <a class="btn primary" data-link="linkedin" href="#">Message me on LinkedIn</a>
      <a class="btn" data-link="whatsapp" href="#">WhatsApp</a>
      <a class="btn" href="https://github.com/imtiaz99000" target="_blank" rel="noopener">GitHub</a>
    </div>
    <div class="foot"><span>© 2026 Mohd Imtiaz Karim, Chandpur, Bangladesh</span><span>Screens show the app's sample data, not real figures.</span></div>
  </div>
</footer>

{SCRIPT}
</body>
</html>
"""
    open(os.path.join(ROOT, 'work', slug, 'index.html'), 'w', encoding='utf-8').write(page)
    print('wrote work/%s/index.html' % slug)


for p in PAGES:
    build(p)
build_taka()
