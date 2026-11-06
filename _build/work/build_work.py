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
ICON = re.search(r'(<link rel="icon"[^>]*>)', churn).group(1)

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
    seo='Building the RSSP network: 45 Robi Sales and Service Points in one year',
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
    seo='Robi WiFi FWA sales journey: zero to 1,500 customers in 11 months',
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
    seo='Superbike fleet productivity: Robi’s electric field sales fleet in Chandpur',
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
    url = 'https://imtiazkarim.com/work/%s/' % slug
    og = 'https://imtiazkarim.com/work/%s/slides/01.webp' % slug
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
                     for o in PAGES if o['slug'] != slug)
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


for p in PAGES:
    build(p)
