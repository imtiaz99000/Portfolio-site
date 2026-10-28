
(function(){
'use strict';
function tryLS0(k){try{return localStorage.getItem(k)||''}catch(e){return ''}}
var S={asOf:'',bAsOf:'',bmonth:null,prev:null,openA:{},waText:'',bpRole:'All',api:true,err:null,needPin:false,adminKey:tryLS0('adminKey'),viewKey:tryLS0('viewKey'),canEdit:false,months:[],month:null,meta:null,docs:{},master:{rssps:{},weights:{ga:50,active:25,quality:25}},area:'All',tab:'overview',sel:null,sort:{key:'score',dir:-1},trend:'ga',showAllAlerts:false,unsub:[],loaded:{meta:false,docs:false,master:false}};
var $=function(id){return document.getElementById(id)};
var main=$('main');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(n){return n==null||!isFinite(n)?'–':Math.round(n).toLocaleString('en-US')}
function pct(n,d){return n==null||!isFinite(n)?'–':(n*100).toFixed(d==null?0:d)+'%'}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dlabel(d){var p=d.split('-');return (+p[2])+' '+MON[+p[1]-1]}
function tryLS(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
/* ---------- Bangla language toggle: English stays the source; Bangla wording is swapped in on screen. Numbers and names are left as they are. ---------- */
var LANG=(tryLS('lang')==='bn')?'bn':'en',BN=null,I18N_MO=null;
var I18N_RX=/\b(January|February|March|April|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\d+(?:,\d{3})*(?:\.\d+)?/g;
function i18nStr(s){
  if(!BN||!s)return null;var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/),core=m[2];if(!core||!/[A-Za-z]/.test(core))return null;
  var hit=BN[core];if(hit!=null)return m[1]+hit+m[3];
  var nums=[],mons=[],t=core.replace(I18N_RX,function(x,mo){if(mo){mons.push(mo);return '~'}nums.push(x);return '#'});
  hit=BN[t];if(hit!=null){var a=0,b=0;return m[1]+hit.replace(/([#~])(\d?)/g,function(x,c,d){if(c==='#')return d?(nums[d-1]||''):(nums[a++]||'');var mo=d?mons[d-1]:mons[b++];return (BN_MON&&BN_MON[mo])||mo||''})+m[3]}
  if(core.indexOf(' · ')>0){var ch=false,parts=core.split(' · ').map(function(p){var r=i18nStr(p);if(r!=null){ch=true;return r}return p});if(ch)return m[1]+parts.join(' · ')+m[3]}
  return null}
var I18N_SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,CANVAS:1};
function i18nNode(n){
  if(n.nodeType===3){var p=n.parentNode;if(!p||I18N_SKIP[p.nodeName]||(p.closest&&p.closest('[data-noi18n]')))return;var v=n.nodeValue;if(v===n.__bn)return;
    if(LANG!=='bn'){if(n.__en!=null&&v===n.__bn)n.nodeValue=n.__en;return}
    var r=i18nStr(v);n.__en=v;if(r!=null&&r!==v){n.__bn=r;n.nodeValue=r}else n.__bn=null;return}
  if(n.nodeType!==1||I18N_SKIP[n.nodeName]||n.hasAttribute('data-noi18n'))return;
  ['placeholder','aria-label','title'].forEach(function(a){var v=n.getAttribute(a);if(!v)return;n.__ea=n.__ea||{};
    if(LANG!=='bn'){if(n.__ea[a]!=null&&n.__eb&&v===n.__eb[a])n.setAttribute(a,n.__ea[a]);return}
    if(n.__eb&&v===n.__eb[a])return;var r=i18nStr(v);n.__ea[a]=v;n.__eb=n.__eb||{};if(r!=null&&r!==v){n.__eb[a]=r;n.setAttribute(a,r)}});
  for(var c=n.firstChild;c;c=c.nextSibling)i18nNode(c)}
function i18nRestore(n){if(n.nodeType===3){if(n.__en!=null&&n.nodeValue===n.__bn)n.nodeValue=n.__en;n.__bn=null;return}if(n.nodeType!==1)return;
  if(n.__ea&&n.__eb)Object.keys(n.__eb).forEach(function(a){if(n.getAttribute(a)===n.__eb[a])n.setAttribute(a,n.__ea[a])});n.__eb=null;for(var c=n.firstChild;c;c=c.nextSibling)i18nRestore(c)}
var i18nObs=null;
function i18nStart(){if(i18nObs)return;i18nNode(document.body);i18nObs=new MutationObserver(function(ms){if(LANG!=='bn')return;ms.forEach(function(m){if(m.type==='characterData')i18nNode(m.target);else if(m.type==='attributes')i18nNode(m.target);else m.addedNodes.forEach(i18nNode)})});
  i18nObs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']})}
function loadBn(){return new Promise(function(res,rej){if(window.BN)return res();var s=document.createElement('script');s.src='bn.js?v=0fca3c9f';s.onload=function(){res()};s.onerror=function(){rej(new Error('Bangla could not load. Check your connection.'))};document.head.appendChild(s);
  if(!document.getElementById('bnFont')){var l=document.createElement('link');l.id='bnFont';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap';document.head.appendChild(l)}})}
function setLang(l){var b=document.getElementById('langBtn');
  if(l==='bn'){if(b)b.disabled=true;loadBn().then(function(){BN=window.BN;BN_MON=window.BN_MON;LANG='bn';tryLS('lang','bn');document.documentElement.lang='bn';document.documentElement.classList.add('bn');i18nStart();i18nNode(document.body);langLabel()}).catch(function(e){alert(e.message)}).then(function(){if(b)b.disabled=false})}
  else{LANG='en';tryLS('lang','en');document.documentElement.lang='en';document.documentElement.classList.remove('bn');i18nRestore(document.body);langLabel()}}
var BN_MON=null;
function langLabel(){var b=document.getElementById('langBtn');if(b){b.textContent=LANG==='bn'?'EN':'বাংলা';b.setAttribute('aria-label',LANG==='bn'?'Switch to English':'বাংলায় দেখুন');b.setAttribute('data-noi18n','')}}


/* ---------- metrics ---------- */
function calendar(){
  var m=S.meta;if(!m||!m.asOf)return null;
  var end=m.asOf;if(S.asOf&&S.asOf<end&&S.asOf.slice(0,7)===m.month)end=S.asOf;
  var elapsed=+end.slice(8,10),dim=m.daysInMonth||31,dates=[];
  for(var i=1;i<=elapsed;i++)dates.push(m.month+'-'+(i<10?'0':'')+i);
  return {elapsed:elapsed,dim:dim,remaining:Math.max(0,dim-elapsed),dates:dates,tg:elapsed/dim,end:end,full:end===m.asOf};
}
function mlabel(m){return m?MON[+m.slice(5,7)-1]+' '+m.slice(0,4):''}
/* region totals from the daily region series, so they follow the as-of day */
function regionTotal(cal,idx){
  if(S.area==='All'){var t=0,rd=S.meta.regionDaily||{};cal.dates.forEach(function(d){t+=(rd[d]||[])[idx]||0});return t}
  if(!cal.full)return null;var ai=idx===0?0:4,t2=0;Object.keys(S.meta.areas||{}).forEach(function(a){if(normArea(a)===S.area)t2+=S.meta.areas[a][ai]||0});return t2}
/* LMTD: the same number of days in the previous month */
function lmtdDates(cal){var P=S.prev;if(!P||!P.meta||!cal)return null;var pm=P.meta.month,dim=P.meta.daysInMonth||31,n=Math.min(cal.elapsed,dim),out=[];for(var i=1;i<=n;i++)out.push(pm+'-'+(i<10?'0':'')+i);return out}
function lmtdOf(code,dates){var d=S.prev.rssp[code],o={ga:0,rep:0,wifi:0};if(!d||!d.days)return o;dates.forEach(function(x){var a=d.days[x];if(a){o.ga+=a[0]+a[1];o.rep+=a[2]+a[3];o.wifi+=a[6]||0}});return o}
function grBadge(cur,prev){if(prev==null)return '';if(!prev)return cur?'<span class="gr up">New vs LMTD 0</span>':'';var g=cur/prev-1;return '<span class="gr '+(g>=0?'up':'down')+'">'+(g>=0?'▲ ':'▼ ')+Math.abs(g*100).toFixed(0)+'% vs LMTD '+fmt(prev)+'</span>'}
function grCell(cur,prev){if(prev==null)return '–';if(!prev)return cur?'<span class="gr up">New</span>':'–';var g=cur/prev-1;return '<span class="gr '+(g>=0?'up':'down')+'">'+(g>=0?'▲ ':'▼ ')+Math.abs(g*100).toFixed(0)+'%</span>'}
function alertCard(g,chips){
  var k=g.title.replace(/ on .*/,'').replace(/\W+/g,''),open=!!S.openA[k];
  if(!g.list.length)return '<div class="alert '+g.sev+'"><div class="stripe"></div><div class="body"><div class="ahead"><b>'+g.title+'</b><span class="acount">0</span></div><div class="note">'+g.why+'</div><div class="aok">None</div></div></div>';
  return '<details class="alert '+g.sev+'" data-ak="'+k+'"'+(open?' open':'')+'><summary><div class="stripe"></div><div class="body"><div class="ahead"><b>'+g.title+'</b><span class="acount">'+g.list.length+'</span></div><div class="note">'+g.why+'</div><span class="atoggle">'+(open?'Hide names ▴':'Show names ▾')+'</span></div></summary><div class="achips adet">'+chips+'</div></details>'}
/* Chat link that opens WhatsApp Business on Android (falls back to wa.me, which opens normal WhatsApp) */
function waChatUrl(phone){var n=String(phone||'').replace(/\D/g,'');if(n.length===11&&n[0]==='0')n='88'+n;var web='https://wa.me/'+n;
  return /Android/i.test(navigator.userAgent)?'intent://send?phone='+n+'#Intent;scheme=whatsapp;package=com.whatsapp.w4b;S.browser_fallback_url='+encodeURIComponent(web)+';end':web}
var WA_ICON='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
function waButton(){return '<div class="sharerow"><details class="sharemenu"><summary class="imgbtn"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7c0 .3 0 .5.1.8L8.4 11.2a3 3 0 1 0 0 3.6l6.7 3.4A3 3 0 1 0 18 16Z"/></svg> Share ▾</summary><div class="sharepop"><button class="imgbtn" id="imgBtn" type="button"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2v8.6l4-4 3 3 4-4 3 3V7H5Zm4 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg> Share as image</button><button class="wabtn" id="waBtn" type="button">'+WA_ICON+' Share on WhatsApp Business</button></div></details></div>'}
/* 4K (2160 x 3840) summary card for WhatsApp groups */
var SHARE_HDR='navy';
/* header colours: [top, bottom, light text] */
var SHARE_PAL={A:['#D11F35','#B3192C','#FFD6DC'],green:['#16A36F','#0E8558','#CFF5E3'],teal:['#0FA3A8','#0B8287','#CCF4F5'],blue:['#1F6FE0','#1556B8','#D6E6FF'],purple:['#6C4FE0','#5338C2','#E2DCFF'],navy:['#1E2A3B','#141C28','#C9D3E0']};
function drawShareImage(spec){
  var W=2160,H=3840,P=130,K8=2,c=document.createElement('canvas');c.width=W*K8;c.height=H*K8;var x=c.getContext('2d');x.scale(K8,K8);x.imageSmoothingQuality='high';
  var F='"Barlow Semi Condensed","Arial Narrow",system-ui,sans-serif',B='"Source Sans 3",system-ui,-apple-system,"Segoe UI",sans-serif';
  var rr=function(X,Y,w,h,r,fill,stroke){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=3;x.stroke()}};
  var fit=function(t,w){t=String(t);if(x.measureText(t).width<=w)return t;while(t.length>1&&x.measureText(t+'…').width>w)t=t.slice(0,-1);return t+'…'};
  x.fillStyle='#F4F7FB';x.fillRect(0,0,W,H);
  /* header: calm brand look (A = solid Robi red, B = clean white) with a thin accent strip and the Robi logo */
  var HS=window.__hdr||SHARE_HDR,lg=document.querySelector('img.logo'),acc=x.createLinearGradient(0,0,W,0);acc.addColorStop(0,'#E4002B');acc.addColorStop(.55,'#F0447A');acc.addColorStop(1,'#FFA62B');
  var dev='Developed by Mohd Imtiaz Karim, Direct Channel Manager, Robi Axiata PLC.';
  if(HS==='B'){x.fillStyle='#FFFFFF';x.fillRect(0,0,W,470);x.fillStyle=acc;x.fillRect(0,0,W,18);x.fillStyle='#E9EEF4';x.fillRect(0,468,W,3);
    if(lg&&lg.complete&&lg.naturalWidth){var lh=150,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,70,lw,lh)}
    x.fillStyle='#C62832';x.font='700 44px '+B;x.fillText('ROBI AXIATA · CHANDPUR REGION',P,140);
    x.fillStyle='#141C24';x.font='800 132px '+F;x.fillText(spec.title,P,285);
    x.fillStyle='#3B4652';x.font='600 50px '+B;x.fillText(fit(spec.sub,W-2*P),P,365);
    x.fillStyle='#7A8591';x.font='400 40px '+B;x.fillText(dev,P,428)}
  else{var HP=SHARE_PAL[HS]||SHARE_PAL.A,gr=x.createLinearGradient(0,0,0,470);gr.addColorStop(0,HP[0]);gr.addColorStop(1,HP[1]);x.fillStyle=gr;x.fillRect(0,0,W,470);x.fillStyle=acc;x.fillRect(0,458,W,14);
    if(lg&&lg.complete&&lg.naturalWidth){var lh2=150,lw2=lh2*lg.naturalWidth/lg.naturalHeight,bx=W-P-lw2-36;rr(bx,58,lw2+72,lh2+44,30,'#FFFFFF');x.drawImage(lg,bx+36,80,lw2,lh2)}
    x.fillStyle=HP[2];x.font='700 44px '+B;x.fillText('ROBI AXIATA · CHANDPUR REGION',P,140);
    x.fillStyle='#FFFFFF';x.font='800 132px '+F;x.fillText(spec.title,P,285);
    x.fillStyle='#FFFFFF';x.font='600 50px '+B;x.fillText(fit(spec.sub,W-2*P),P,365);
    x.fillStyle=HP[2];x.font='400 40px '+B;x.fillText(dev,P,428)}
  var T=[['#D6ECFF','#1E8EF0','#0A5BA3'],['#FFEDB8','#FFA800','#7A4E00'],['#C9F5E0','#12B877','#0B6E48'],['#FFD7E6','#EE3C7E','#9E1747'],['#E2DDFF','#7B68F2','#4733C0'],['#FFDCC8','#FF7A2F','#9C3D0F']];
  var y=510,cw=(W-2*P-50)/2,nRows=Math.ceil(spec.kpis.length/2),cmp=nRows>3,ch=cmp?262:330,gp=cmp?32:44;
  spec.kpis.forEach(function(k,i){var cx=P+(i%2)*(cw+50),cy=y+Math.floor(i/2)*(ch+gp),t={info:T[0],warn:T[1],good:T[2],bad:['#FFDAD6','#E5483B','#B42318']}[k.tone||kpiTone(k.l,k.v)]||T[0];
    rr(cx,cy,cw,ch,36,t[0],t[1]+'99');x.fillStyle=t[1];x.fillRect(cx+36,cy,cw-72,16);
    x.fillStyle=t[2];x.font='700 '+(cmp?42:46)+'px '+B;x.fillText(fit(k.l,cw-90),cx+48,cy+(cmp?80:92));
    x.fillStyle='#141C24';x.font='800 '+(cmp?(String(k.v).length>9?78:100):(String(k.v).length>9?92:124))+'px '+F;x.fillText(fit(k.v,cw-90),cx+48,cy+(cmp?172:218));
    x.fillStyle='#5A6570';x.font='400 '+(cmp?36:40)+'px '+B;x.fillText(fit(k.s||'',cw-90),cx+48,cy+(cmp?226:278));
    if(k.g){x.font='700 36px '+B;var gw=x.measureText(k.g).width+40;rr(cx+cw-gw-36,cy+(cmp?116:148),gw,64,32,k.up?'#C9F5E0':'#FFD7E6');x.fillStyle=k.up?'#0B6E48':'#9E1747';x.fillText(k.g,cx+cw-gw-16,cy+(cmp?160:192))}});
  y+=nRows*(ch+gp)+30;
  if(spec.tables){/* price list style tables, like the website */
    var footT=H-170,TB=spec.tables,nr=TB.reduce(function(q,t){return q+t.rows.length},0),bar=104,hd=78,tg=40,rh=Math.max(64,Math.min(106,Math.floor((footT-y-10-TB.length*(bar+hd+tg))/Math.max(1,nr))));
    TB.forEach(function(T){var tw=W-2*P,th=bar+hd+T.rows.length*rh;rr(P,y,tw,th,30,'#FFFFFF','#DCE3EA');
      var bg=x.createLinearGradient(P,0,P+tw,0);bg.addColorStop(0,T.c[0]);bg.addColorStop(1,T.c[1]);x.save();x.beginPath();x.moveTo(P+30,y);x.arcTo(P+tw,y,P+tw,y+bar,30);x.lineTo(P+tw,y+bar);x.lineTo(P,y+bar);x.arcTo(P,y,P+30,y,30);x.closePath();x.fillStyle=bg;x.fill();x.restore();
      x.fillStyle='#FFFFFF';x.font='800 60px '+F;x.fillText(T.name,P+44,y+70);x.font='600 40px '+B;var lb=T.label||'';x.fillText(lb,P+tw-44-x.measureText(lb).width,y+66);
      var cw=T.cols.length,nameW=tw*(T.nw||(cw>3?.34:.46)),cwid=(tw-nameW)/(cw-1),cx=function(i){return P+nameW+(i-1)*cwid};
      var yy=y+bar;T.cols.forEach(function(cn,i){if(i&&T.hl&&T.hl.indexOf(i)>=0){x.fillStyle='#FFF7DD';x.fillRect(cx(i),yy,cwid,hd+T.rows.length*rh-(i===cw-1?2:0))}if(i&&T.pf===i){x.fillStyle='#E9FBF2';x.fillRect(cx(i),yy,cwid,hd+T.rows.length*rh-2)}});
      x.fillStyle='#5A6570';x.font='700 34px '+B;T.cols.forEach(function(cn,i){var t=cn.toUpperCase();if(!i)x.fillText(t,P+44,yy+52);else x.fillText(fit(t,cwid-16),cx(i)+(cwid-Math.min(x.measureText(t).width,cwid-16))/2,yy+52)});
      x.fillStyle='#E3E8EE';x.fillRect(P,yy+hd-3,tw,3);yy+=hd;
      T.rows.forEach(function(r,ri){if(ri){x.fillStyle='#EDF1F5';x.fillRect(P+20,yy,tw-40,2)}
        x.fillStyle='#8A949E';x.font='500 40px '+B;x.fillText(String(ri+1),P+44,yy+rh/2+14);x.fillStyle='#141C24';x.font='500 46px '+B;x.fillText(fit(r[0],nameW-130),P+110,yy+rh/2+16);
        for(var i=1;i<cw;i++){var v=String(r[i]);x.font=(T.hl&&T.hl.indexOf(i)>=0||T.pf===i?'800 ':'500 ')+'48px '+B;x.fillStyle=T.pf===i?'#0B6E48':'#141C24';x.fillText(v,cx(i)+(cwid-x.measureText(v).width)/2,yy+rh/2+16)}
        yy+=rh});
      y+=th+tg});
    spec.sections=[]}
  var secs=spec.sections.filter(function(sx){return sx.items.length}),foot=H-170,line=62,head=96,gap=34;
  var need=secs.reduce(function(a,sx){return a+head+sx.items.length*line+gap},0),avail=foot-y,cap=99;
  if(need>avail){for(cap=12;cap>1;cap--){var n2=secs.reduce(function(a,sx){var m=Math.min(sx.items.length,cap);return a+head+m*line+(sx.items.length>cap?line:0)+gap},0);if(n2<=avail)break}}
  var SC={crit:['#C21D12','#FFD9D4'],warn:['#9A5B00','#FFEAB0'],info:['#0A5BA3','#D6ECFF'],good:['#0B6E48','#C9F5E0']};
  secs.forEach(function(sx){var col=SC[sx.sev]||SC.info,m=Math.min(sx.items.length,cap),more=sx.items.length-m,hh=head+m*line+(more?line:0)+16;
    if(y+hh>foot)return;rr(P,y,W-2*P,hh,28,'#FFFFFF',col[1]);x.fillStyle=col[1];x.fillRect(P+3,y+3,W-2*P-6,head-14);x.fillStyle=col[0];x.fillRect(P,y+20,14,hh-40);
    x.font='800 54px '+F;x.fillStyle=col[0];x.fillText(fit(sx.t,W-2*P-260),P+50,y+70);
    x.font='800 54px '+F;var cnt=String(sx.items.length);x.fillText(cnt,W-P-50-x.measureText(cnt).width,y+70);
    x.font='400 44px '+B;x.fillStyle='#141C24';sx.items.slice(0,m).forEach(function(it,i){x.fillText(fit((i+1)+'. '+it,W-2*P-100),P+50,y+head+i*line+40)});
    if(more){x.fillStyle='#5A6570';x.font='italic 400 42px '+B;x.fillText('+ '+more+' more on the dashboard',P+50,y+head+m*line+40)}
    y+=hh+gap});
  x.fillStyle='#DBE0E5';x.fillRect(P,foot,W-2*P,3);x.fillStyle='#5A6570';x.font='400 40px '+B;
  var nd=new Date(Date.now()+6*3600000);x.fillText('Full dashboard: '+location.host,P,foot+80);
  var ts='Generated '+nd.getUTCDate()+' '+MON[nd.getUTCMonth()]+' '+nd.getUTCFullYear()+', '+(nd.getUTCHours()%12||12)+':'+(nd.getUTCMinutes()<10?'0':'')+nd.getUTCMinutes()+' '+(nd.getUTCHours()<12?'AM':'PM');x.fillText(ts,W-P-x.measureText(ts).width,foot+80);
  return c;
}
function shareImage(){var sp=S.imgSpec;if(!sp)return;var btn=$('imgBtn');if(btn){btn.disabled=true;btn.lastChild.textContent=' Preparing…'}
  var done=function(){if(btn){btn.disabled=false;btn.lastChild.textContent=' Share as image'}};
  var go=function(){var c=drawShareImage(sp);c.toBlob(function(b){var name=sp.file+'.png',file=new File([b],name,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:sp.title}).catch(function(){}).then(done)}
    else{var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);done()}},'image/png')};
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else go()}
function allCodes(){var o={};Object.keys(S.master.rssps||{}).forEach(function(c){o[c]=1});Object.keys(S.docs).forEach(function(c){o[c]=1});return Object.keys(o)}
function infoFor(code){var d=S.docs[code]||{},m=(S.master.rssps||{})[code]||{};
  return {code:code,name:m.name||d.name||code,area:normArea(m.area||d.area),territory:m.territory||d.territory||'',distributor:d.distributor||'',dsr:d.dsr||''}}
function computeRows(){
  var cal=calendar();if(!cal)return [];
  var rows=allCodes().map(function(code){
    var I=infoFor(code),doc=S.docs[code],days=(doc&&doc.days)||{},m=(S.master.rssps||{})[code]||{};
    var gaR=0,gaA=0,rep=0,esim=0,mnp=0,wifi=0,active=0,daily=[],P={esimPre:0,esimRep:0,post:0,mnpSim:0,mnpRep:0};
    cal.dates.forEach(function(d){var a=days[d]||[0,0,0,0,0,0,0],wf=a[6]||0;gaR+=a[0];gaA+=a[1];rep+=a[2]+a[3];esim+=a[4];mnp+=a[5];wifi+=wf;P.esimPre+=a[7]||0;P.esimRep+=a[8]||0;P.post+=a[9]||0;P.mnpSim+=a[10]||0;P.mnpRep+=a[11]||0;var t=a[0]+a[1]+a[2]+a[3]+wf;if(t>0)active++;daily.push({pn:a[14]||0,pr:a[15]||0,hasP:a.length>14,d:d,robi:a[0],airtel:a[1],rep:a[2]+a[3],repR:a[2],repA:a[3],wifi:wf,rfo:a[12]||0,agent:a[13]||0,t:t})});
    var ga=gaR+gaA,streak=0;for(var i=daily.length-1;i>=0&&daily[i].t===0;i--)streak++;
    var TG=hqTarget(code),tgt=TG?TG.ga:(+m.gaTarget||0),repT=+m.repTarget||0,wifiT=TG?TG.fwa:(+m.wifiTarget||0),exp=tgt*cal.tg;
    var total=doc?doc.total||0:0,fl=(doc&&doc.flags)||{};
    return Object.assign(I,{hq:TG,rfoT:TG?TG.rfo:0,agT:TG?TG.agent:0,prod:P,simRep:rep-P.mnpRep-P.esimRep,gaR:gaR,gaA:gaA,ga:ga,rep:rep,esim:esim,mnp:mnp,wifi:wifi,wifiT:wifiT,wifiPace:wifiT?wifi/(wifiT*cal.tg):null,wifiDrr:wifiT?Math.max(0,wifiT-wifi)/Math.max(1,cal.remaining):null,wifiProj:wifi/cal.elapsed*cal.dim,active:active,daily:daily,streak:streak,total:total,
      tgt:tgt,repT:repT,pace:tgt?ga/exp:null,ach:tgt?ga/tgt:null,gap:tgt?tgt-ga:null,drr:tgt?Math.max(0,tgt-ga)/Math.max(1,cal.remaining):null,
      repPace:repT?rep/(repT*cal.tg):null,proj:ga/cal.elapsed*cal.dim,
      flags:fl,fake:fl.fake||0,flagShare:total?(fl.fake||0)/total:null,last:daily.length?daily[daily.length-1]:{t:0,robi:0,airtel:0,rep:0},
      bps:(doc&&doc.bps)||[],hours:(doc&&doc.hours)||[],silent:!doc});
  });
  var LD=lmtdDates(cal);rows.forEach(function(r){if(LD){var o=lmtdOf(r.code,LD);r.lmGa=o.ga;r.lmRep=o.rep;r.lmWifi=o.wifi;r.gr=o.ga?r.ga/o.ga-1:null}else{r.lmGa=r.lmRep=r.lmWifi=r.gr=null}});
  var w=scoreWeights(),ws=(+w.ga||0)+(+w.active||0)+(+w.quality||0)||1;
  var maxGA=Math.max.apply(null,rows.map(function(r){return r.ga}).concat([1]));
  rows.forEach(function(r){
    var g=r.tgt?Math.min(r.pace,1.2)/1.2:r.ga/maxGA,a=r.active/cal.elapsed,q=r.total?1-r.flagShare:0;
    r.parts={ga:g,active:a,quality:q};
    r.score=100*((+w.ga||0)*g+(+w.active||0)*a+(+w.quality||0)*q)/ws;
  });
  rows.sort(function(a,b){return b.score-a.score||b.ga-a.ga});
  rows.forEach(function(r,i){r.rank=i+1});
  return rows;
}
function scoreWeights(){var w=S.master.weights||{};return ((+w.ga||0)+(+w.active||0)+(+w.quality||0))>0?w:{ga:50,active:25,quality:25}}
function filtered(rows){return S.area==='All'?rows:rows.filter(function(r){return r.area===S.area})}
function paceClass(p){return p==null?'none':p>=1?'good':p>=.85?'warn':'crit'}
function pacePill(p){return '<span class="pill '+paceClass(p)+'">'+(p==null?'No target':pct(p))+'</span>'}

function buildAlerts(rows,cal){
  var last=dlabel(cal.dates[cal.dates.length-1]);
  var avg=rows.length?rows.reduce(function(a,r){return a+r.ga},0)/rows.length:0;
  var lowRule=function(r){return r.ga>0&&(r.tgt?r.pace<.85:r.ga<avg*0.5)};
  var lastGA=function(r){return (r.last.robi||0)+(r.last.airtel||0)};
  var by=function(a,b){return a.ga-b.ga||a.name.localeCompare(b.name)};
  var hasRole=rows.some(function(r){return r.daily.some(function(d){return (d.rfo||0)+(d.agent||0)>0})});
  return [
    {sev:'crit',title:'Zero GA MTD',why:'No GA this month',list:rows.filter(function(r){return r.ga===0}).sort(by),val:function(){return ''}},
    {sev:'crit',title:'Zero GA on '+last,why:'No GA on the latest day in the file',list:rows.filter(function(r){return r.ga>0&&lastGA(r)===0}).sort(by),val:function(r){return fmt(r.ga)+' MTD'}},
    {sev:'crit',title:'Zero GA RFO on '+last,why:'RFO made no GA on the latest day in the file',list:hasRole?rows.filter(function(r){return r.ga>0&&(r.last.rfo||0)===0}).sort(by):[],val:function(r){var ag=r.last.agent||0;return ag?'Agent '+fmt(ag)+' GA':'RSSP zero'}},
    {sev:'warn',title:'Low GA MTD',why:S.canEdit?'Below 85% of target pace, or under half the RSSP average ('+fmt(avg)+') where no target is set':'Under half the RSSP average ('+fmt(avg)+') GA so far this month',list:rows.filter(lowRule).sort(by),val:function(r){return r.tgt?pct(r.pace)+' pace':fmt(r.ga)+' GA'}},
    {sev:'warn',title:'Zero FWA sales MTD',why:'No FWA (WiFi SIM) sold this month',list:rows.filter(function(r){return !r.wifi}).sort(by),val:function(){return ''}}
  ];
}

/* ---------- charts ---------- */
var tip=$('tip');
function showTip(e,html){tip.innerHTML=html;tip.hidden=false;var x=(e.touches?e.touches[0].clientX:e.clientX),y=(e.touches?e.touches[0].clientY:e.clientY);var w=tip.offsetWidth,h=tip.offsetHeight;var L=Math.min(window.innerWidth-w-8,Math.max(8,x+12)),T=y-h-12<8?y+14:y-h-12;tip.style.left=L+'px';tip.style.top=T+'px'}
function hideTip(){tip.hidden=true}
document.addEventListener('scroll',hideTip,{passive:true});
function niceMax(v){var raw=Math.max(v,4)/4,p=Math.pow(10,Math.floor(Math.log10(raw))),n=raw/p;var st=(n<=1?1:n<=2?2:n<=5?5:10)*p;if(st<1)st=1;return st*4}
function topRounded(x,y,w,h,r){r=Math.min(r,w/2,h);if(h<=0)return '';return 'M'+x+','+(y+h)+'V'+(y+r)+'Q'+x+','+y+' '+(x+r)+','+y+'H'+(x+w-r)+'Q'+(x+w)+','+y+' '+(x+w)+','+(y+r)+'V'+(y+h)+'Z'}
/* stacked bar chart: items [{label, segs:[{v,cls,name}], tip}] */
function barChart(el,items,opts){
  opts=opts||{};var W=Math.max(260,el.clientWidth||600),H=opts.h||210,pl=36,pr=8,pt=(opts.labels?30:10)+(opts.bands?14:0),pb=24;
  var iw=W-pl-pr,ih=H-pt-pb,n=items.length||1;
  var max=niceMax(Math.max.apply(null,items.map(function(it){return it.segs.reduce(function(s,g){return s+g.v},0)}).concat([1,opts.ref?opts.ref.v*1.5:0])));
  var step=iw/n,bw=Math.max(3,Math.min(26,step*.68));
  var s='<svg width="'+W+'" height="'+H+'" role="img" aria-label="'+esc(opts.aria||'Bar chart')+'"><defs><linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B42318"/><stop offset="0.55" stop-color="#E5483B"/><stop offset="1" stop-color="#FDA29B"/></linearGradient></defs>';
  for(var g=0;g<=4;g++){var v=max*g/4,y=pt+ih-ih*g/4;s+='<line class="grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end">'+fmt(v)+'</text>'}
  if(opts.ref&&opts.ref.v<=max){var yr=pt+ih-ih*opts.ref.v/max;s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yr+'" y2="'+yr+'" style="stroke:#E5483B;stroke-width:1.5;stroke-dasharray:4 3"/><rect x="'+(pl+2)+'" y="'+(yr-15)+'" width="34" height="13" rx="3" style="fill:#FFFFFF;opacity:.9"/><text x="'+(pl+5)+'" y="'+(yr-5)+'" style="fill:#B42318;font-weight:700;font-size:10px">'+esc(opts.ref.label)+'</text>'}
  (opts.bands||[]).forEach(function(b,bi){if(b.to<=0||b.from>=n)return;var x0=pl+step*Math.max(0,b.from),x1=pl+step*Math.min(n,b.to);
    if(bi%2===0)s+='<rect x="'+x0+'" y="'+pt+'" width="'+(x1-x0)+'" height="'+ih+'" style="fill:var(--sunk);opacity:.6"/>';
    s+='<text x="'+((x0+x1)/2)+'" y="'+(pt-14)+'" text-anchor="middle" style="fill:var(--muted);font-weight:600;font-size:10px;letter-spacing:.04em">'+b.label.toUpperCase()+'</text>'});
  var every=Math.ceil(n/(W<480?7:14));
  items.forEach(function(it,i){
    var x=pl+step*i+(step-bw)/2,base=pt+ih,tot=it.segs.reduce(function(a,b){return a+b.v},0);
    var visible=it.segs.filter(function(sg){return sg.v>0});
    visible.forEach(function(sg,j){var h=ih*sg.v/max,gap=j>0?2:0,y=base-h;
      var cls=sg.cls==='gred'?'fill:url(#gRed)':'fill:var(--'+sg.cls+')';
      if(j===visible.length-1)s+='<path d="'+topRounded(x,y,bw,h-gap,Math.min(4,bw/2))+'" style="'+cls+'"/>';
      else s+='<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+Math.max(0,h-gap)+'" style="'+cls+'"/>';
      if(sg.lc&&h-gap>=(bw<16?18:14)){var cx=x+bw/2,cy=y+(h-gap)/2;s+=bw<16?'<text x="'+(cx+3.5)+'" y="'+cy+'" transform="rotate(-90 '+(cx+3.5)+' '+cy+')" text-anchor="middle" style="fill:'+sg.lc+';font-size:10px;font-weight:700">'+fmt(sg.v)+'</text>':'<text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" style="fill:'+sg.lc+';font-size:10px;font-weight:700">'+fmt(sg.v)+'</text>'}
      base=y;});
    if(opts.labels&&(tot>0||it.lbl)){var lx=x+bw/2,ly=base-5,lc=it.lblc?' style="fill:'+it.lblc+'"':'';s+=step>=24?'<text class="dl"'+lc+' x="'+lx+'" y="'+ly+'" text-anchor="middle">'+(it.lbl!=null?it.lbl:fmt(tot))+'</text>':'<text class="dl"'+lc+' transform="translate('+(lx+3.5)+','+ly+') rotate(-90)" text-anchor="start">'+(it.lbl!=null?it.lbl:fmt(tot))+'</text>'}
    if(i%every===0||(i===n-1&&(n-1)%every>=Math.max(2,every*0.6)))s+='<text x="'+(x+bw/2)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(it.label)+'</text>';
    s+='<rect class="hit" data-i="'+i+'" x="'+(pl+step*i)+'" y="'+pt+'" width="'+step+'" height="'+ih+'" fill="transparent"/>';
  });
  s+='</svg>';el.innerHTML=s;
  el.querySelectorAll('.hit').forEach(function(h){var it=items[+h.getAttribute('data-i')];
    var on=function(e){showTip(e,it.tip)};h.addEventListener('mousemove',on);h.addEventListener('touchstart',on,{passive:true});h.addEventListener('mouseleave',hideTip)});
}
/* cumulative line vs target pace */
function burnChart(el,dates,cum,target,dim){
  var W=Math.max(260,el.clientWidth||600),H=260,pl=44,pr=14,pt=26,pb=26,iw=W-pl-pr,ih=H-pt-pb;
  var n=cum.length,last=n-1,now=n?cum[last]:0,projEnd=n?now/n*dim:0,mon=dates.length?dates[0].slice(0,8):'';
  var max=niceMax(Math.max(target||0,projEnd,1)*1.05);
  var X=function(i){return pl+iw*i/(dim-1)},Y=function(v){return pt+ih-ih*v/max};
  var lab=function(day){return day+' '+MON[+mon.slice(5,7)-1]};
  var s='<svg width="'+W+'" height="'+H+'" role="img" aria-label="Cumulative GA through the month">';
  for(var g=0;g<=4;g++){var v=max*g/4,y=Y(v);s+='<line class="grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end">'+fmt(v)+'</text>'}
  var ticks=W<480?[1,8,15,22,dim]:[1,5,10,15,20,25,dim];
  ticks.forEach(function(d){s+='<line x1="'+X(d-1)+'" x2="'+X(d-1)+'" y1="'+(pt+ih)+'" y2="'+(pt+ih+4)+'" style="stroke:var(--faint)"/><text x="'+X(d-1)+'" y="'+(H-6)+'" text-anchor="'+(d===1?'start':d===dim?'end':'middle')+'">'+lab(d)+'</text>'});
  if(n){
    // today marker
    s+='<line x1="'+X(last)+'" x2="'+X(last)+'" y1="'+pt+'" y2="'+(pt+ih)+'" style="stroke:var(--faint);stroke-dasharray:3 3"/><text x="'+X(last)+'" y="'+(pt-10)+'" text-anchor="middle" style="fill:var(--muted);font-weight:600">'+lab(n)+'</text>';
  }
  if(target){
    s+='<line x1="'+X(0)+'" y1="'+Y(target/dim)+'" x2="'+X(dim-1)+'" y2="'+Y(target)+'" style="stroke:var(--faint);stroke-width:2;stroke-dasharray:6 4"/>';
    s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(target)+'" y2="'+Y(target)+'" style="stroke:var(--good);stroke-width:1.5;opacity:.7"/><text x="'+(pl+4)+'" y="'+(Y(target)-6)+'" style="fill:var(--good);font-weight:600">Target '+fmt(target)+'</text>';
    if(n&&now<target)s+='<line x1="'+X(last)+'" y1="'+Y(now)+'" x2="'+X(dim-1)+'" y2="'+Y(target)+'" style="stroke:var(--crit);stroke-width:1.5;stroke-dasharray:2 3"/>';
  }
  if(n){
    s+='<line x1="'+X(last)+'" y1="'+Y(now)+'" x2="'+X(dim-1)+'" y2="'+Y(projEnd)+'" style="stroke:var(--bar-sky);stroke-width:2;stroke-dasharray:2 4;opacity:.85"/>';
    var dpath=cum.map(function(v,i){return (i?'L':'M')+X(i)+','+Y(v)}).join('');
    s+='<path d="'+dpath+'L'+X(last)+','+Y(0)+'L'+X(0)+','+Y(0)+'Z" style="fill:var(--bar-sky);opacity:.12"/>';
    s+='<path d="'+dpath+'" style="fill:none;stroke:var(--bar-sky);stroke-width:2.5"/>';
    // milestone labels every 5 days + latest
    cum.forEach(function(v,i){var day=i+1;if((day%5===0&&last-i>=2)||i===last){var big=i===last;
      s+='<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="'+(big?5:3)+'" style="fill:var(--bar-sky);stroke:var(--surface);stroke-width:2"/>';
      s+='<text x="'+(X(i)-(big?8:0))+'" y="'+(Y(v)-9)+'" text-anchor="'+(big?'end':'middle')+'" style="fill:var(--ink);font-weight:'+(big?700:600)+';font-size:'+(big?12:11)+'px">'+fmt(v)+'</text>'}});
    s+='<circle cx="'+X(dim-1)+'" cy="'+Y(projEnd)+'" r="4" style="fill:var(--surface);stroke:var(--bar-sky);stroke-width:2"/>';
    s+='<text x="'+(X(dim-1)-6)+'" y="'+(Y(projEnd)+(target&&Math.abs(Y(projEnd)-Y(target))<16?18:-8))+'" text-anchor="end" style="fill:var(--ink);font-weight:700">Projected '+fmt(projEnd)+'</text>';
    cum.forEach(function(v,i){var w=iw/(dim-1);s+='<rect class="hit" data-i="'+i+'" x="'+(X(i)-w/2)+'" y="'+pt+'" width="'+w+'" height="'+ih+'" fill="transparent"/>'});
  }
  s+='</svg>';el.innerHTML=s;
  el.querySelectorAll('.hit').forEach(function(h){var i=+h.getAttribute('data-i');var on=function(e){var day=cum[i]-(i?cum[i-1]:0),exp=target?target*(i+1)/dim:null;showTip(e,'<b>'+dlabel(dates[i])+'</b><br>GA that day '+fmt(day)+'<br>Cumulative '+fmt(cum[i])+(exp?'<br>Target pace '+fmt(exp)+' ('+pct(cum[i]/exp)+')':''))};h.addEventListener('mousemove',on);h.addEventListener('touchstart',on,{passive:true});h.addEventListener('mouseleave',hideTip)});
}
function spark(daily){var last=daily.slice(-7),max=Math.max.apply(null,last.map(function(d){return d.robi+d.airtel}).concat([1]));
  var s='<svg width="64" height="20" aria-hidden="true">';last.forEach(function(d,i){var v=d.robi+d.airtel,h=v?Math.max(2,18*v/max):1;s+='<rect x="'+(i*9+1)+'" y="'+(19-h)+'" width="7" height="'+h+'" rx="1.5" style="fill:'+(v?'var(--bar-sky)':'var(--line)')+'"/>'});return s+'</svg>'}

/* ---------- render ---------- */
var chartJobs=[];
/* ---------- motion: entrance on tab change, count-up numbers (skipped when the phone asks for reduced motion) ---------- */
var MOTION_OK=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- grouped navigation: section buttons on top, that section's tabs below ---------- */
var NAV_GRP={brief:['brief'],sales:['overview','board','rssp','wifi','quality','live'],field:['sup','rfo','agent'],stock:['stock'],bikes:['bike','bikestat','bikes','faulty'],res:['camp','prices','download'],dev:['dev'],admin:['dcm','bank','iddb','visits','setup']};
function grpOf(t){for(var g in NAV_GRP)if(NAV_GRP[g].indexOf(t)>=0)return g;return 'sales'}
function navSync(){var g=grpOf(S.tab),gb=$('grpbar');if(!gb)return;S.grpLast=S.grpLast||{};S.grpLast[g]=S.tab;
  var ga=$('grpAdmin');if(ga)ga.hidden=!S.canEdit;
  gb.querySelectorAll('[data-grp]').forEach(function(b){var on=b.getAttribute('data-grp')===g;b.setAttribute('aria-pressed',String(on));if(on&&b.scrollIntoView&&gb.scrollWidth>gb.clientWidth)b.scrollIntoView({block:'nearest',inline:'nearest'})});
  var vis=0;document.querySelectorAll('#tabs .tab').forEach(function(t){var inG=NAV_GRP[g].indexOf(t.getAttribute('data-tab'))>=0;t.classList.toggle('offgrp',!inG);if(inG&&!t.hidden)vis++});
  $('tabs').classList.toggle('single',vis<=1);
  var cur=document.querySelector('#tabs .tab[aria-selected="true"]');if(cur&&cur.scrollIntoView&&vis>1)cur.scrollIntoView({block:'nearest',inline:'nearest'})}
/* jump chips on long tabs: one chip per section heading */
function addJump(){var M=main;if(!M||M.querySelector('.jump'))return;
  var hs=[].slice.call(M.querySelectorAll('.section > .sechead > h2')).filter(function(h){return h.offsetParent!==null});
  if(hs.length<4)return;
  var nav=document.createElement('nav');nav.className='jump';nav.setAttribute('aria-label','Jump to section');
  hs.forEach(function(h,i){var sec=h.closest('.section'),b=document.createElement('button');b.type='button';var t=h.textContent.replace(/\s+/g,' ').trim();b.textContent=t.length>28?t.slice(0,27)+'…':t;
    b.addEventListener('click',function(){var tb=document.querySelector('.tabbar');if(tb)tb.classList.add('gbhide');sec.scrollIntoView({behavior:MOTION_OK?'smooth':'auto',block:'start'})});nav.appendChild(b)});
  var first=M.querySelector('.sharerow');if(first&&first.parentNode===M){nav.classList.add('inrow');first.insertBefore(nav,first.firstChild)}else M.insertBefore(nav,M.firstChild)}
document.addEventListener('click',function(e){[].forEach.call(document.querySelectorAll('details.sharemenu[open]'),function(d){if(!d.contains(e.target)||e.target.closest('.sharepop button'))d.removeAttribute('open')})});
function render(){var key=S.tab+'|'+!!(S.loaded&&S.loaded.meta&&S.meta),ch=key!==S._animTab;S._animTab=key;renderCore();addJump();navSync();trkTab(S.tab);if(ch&&MOTION_OK)animateView()}
function animateView(){
  main.classList.remove('anim');void main.offsetWidth;main.classList.add('anim');clearTimeout(S._animT);S._animT=setTimeout(function(){main.classList.remove('anim')},1400);
  main.querySelectorAll('.pcard>b, .kpi .v, .campsum b, .devfacts b').forEach(function(el,i){if(el.children.length)return;var t=el.textContent,m=t.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);if(!m)return;
    var end=parseFloat(m[2].replace(/,/g,'')),dec=(m[2].split('.')[1]||'').length,com=m[2].indexOf(',')>=0||end>=10000,t0=null,dur=700+Math.min(i,6)*60;if(!isFinite(end)||end===0)return;
    var fmtN=function(v){var x=v.toFixed(dec);return com?(+x).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}):x};
    var step=function(ts){if(!el.isConnected)return;if(t0==null)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=m[1]+fmtN(end*e)+m[3];if(p<1)requestAnimationFrame(step);else el.textContent=t};
    el.textContent=m[1]+fmtN(0)+m[3];requestAnimationFrame(step)})}
function renderCore(){
  hideTip();chartJobs=[];
  var cal=calendar();
  renderBand(cal);
  if(GATE.need&&!S.canEdit){main.innerHTML=gateView();bindGate();return}
  if(S.needPin){main.innerHTML='<div class="panel empty"><h2>Enter the viewer PIN</h2><p class="note">Ask Mohd Imtiaz Karim for the PIN to see the RSSP numbers.</p><div class="addrow" style="max-width:360px;width:100%"><input id="pinIn" type="password" placeholder="Viewer PIN" aria-label="Viewer PIN"><button class="btn" id="pinBtn">Open</button></div></div>';$('pinBtn').addEventListener('click',function(){S.viewKey=$('pinIn').value.trim();tryLS('viewKey',S.viewKey);S.needPin=false;loadData()});return}
  if(S.err){main.innerHTML='<div class="panel empty"><h2>Could not load the data</h2><p class="note">'+esc(S.err)+'</p><button class="btn" id="retryBtn">Try again</button></div>';$('retryBtn').addEventListener('click',loadData);return}
  if(!(S.loaded.meta&&S.loaded.master)){return}
  if(S.tab==='dev'){main.innerHTML=viewDev();var ti=$('teamImg');if(ti)ti.addEventListener('click',function(){var O=openOverlay('Elite force of Chandpur RSSP','team.jpg','elite-force-chandpur-rssp.jpg');O.body.innerHTML='<div class="lbimg pvcenter"><img src="team.jpg" alt="Elite force of Chandpur RSSP"></div>'});return}
  if(S.tab==='download'){main.innerHTML=viewDownload();bindDownload();return}
  if(S.tab==='camp'){main.innerHTML=viewCamps();bindCommon();bindCamps();return}
  if(S.tab==='prices'){main.innerHTML=viewPrices();bindCommon();bindPrices();return}
  if(S.tab==='iddb'){main.innerHTML=viewIddb();bindCommon();bindIddb();return}
  if(S.tab==='visits'){main.innerHTML=viewVisits();bindCommon();loadVisits();return}
  if(S.tab==='bank'){main.innerHTML=viewBank();bindCommon();chartJobs.forEach(function(j){j()});return}
  if(S.tab==='bike'){main.innerHTML=viewBike();bindCommon();bindBike();chartJobs.forEach(function(j){j()});return}
  if(S.tab==='stock'){main.innerHTML=viewStock();bindCommon();chartJobs.forEach(function(j){j()});return}
  if(S.tab==='faulty'){main.innerHTML=viewFaulty();bindCommon();bindBike();return}
  if(S.tab==='bikestat'){main.innerHTML=viewBikeStatus();bindCommon();bindBike();return}
  if(S.tab==='bikes'){main.innerHTML=viewBikes();bindCommon();bindBike();chartJobs.forEach(function(j){j()});return}
  if(!cal&&S.tab!=='setup'){main.innerHTML=emptyState();bindCommon();return}
  var rows=computeRows(),f=filtered(rows);
  var html={brief:viewBrief,overview:viewOverview,board:viewBoard,rssp:viewDetail,wifi:viewWifi,sup:viewSup,dcm:viewDcm,rfo:function(a,b,c){return viewBp(a,b,c,'RFO')},agent:function(a,b,c){return viewBp(a,b,c,'Agent')},quality:viewQuality,live:viewLive,dev:viewDev,setup:viewSetup}[S.tab](rows,f,cal);
  main.innerHTML=html;bindCommon();
  chartJobs.forEach(function(j){j()});
}
function renderPickers(cal){
  var el=$('pickers');if(!el)return;var h='',today=dhakaToday();
  var sel=function(id,opts,cur,lbl){return '<label class="pick"><span>'+lbl+'</span><select id="'+id+'">'+opts.map(function(o){return '<option value="'+esc(o[0])+'"'+(o[0]===cur?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select></label>'};
  if(S.tab==='stock'){var sk2=S.stock&&S.stock.latest,ag=sk2?daysBetween(sk2.date,today):0;if(sk2&&ag>7)h+=S.canEdit?'<div class="stale">⚠ Stock data is '+ag+' days old (as of '+dlabel(sk2.date)+'). Upload a fresh SIM Stock Details file.</div>':'<div class="stalev">Stock data as of '+dlabel(sk2.date)+'</div>'}
  else if(S.tab==='bike'||S.tab==='bikestat'||S.tab==='bikes'||S.tab==='faulty'){var B=S.bike||{},bd=B.data;
    if(bd){var bms=(B.months||[]).slice().reverse();if(!bms.length)bms=[bd.month];
      h+=sel('pkBMonth',bms.map(function(m){return [m,mlabel(m)]}),S.bmonth||bd.month,'Month');
      h+=sel('pkBDay',bd.dates.slice().reverse().map(function(d,i){return [d,dlabel(d)+(i===0?' (latest)':'')]}),S.bAsOf&&S.bAsOf<bd.through?S.bAsOf:bd.through,'As of');
      if(S.bAsOf&&S.bAsOf<bd.through)h+='<button class="pastchip" data-reset="b">Viewing '+dlabel(S.bAsOf)+' · back to latest</button>';
      var latestB=(B.months||[]).slice(-1)[0]||bd.month,ageB=daysBetween(bd.through,today);
      if(bd.month===latestB&&ageB>2)h+=S.canEdit?'<div class="stale">⚠ Bike data is '+ageB+' days old (last day '+dlabel(bd.through)+'). Upload today\'s Monthly Distance Report.</div>':'<div class="stalev">Bike data up to '+dlabel(bd.through)+'</div>';}
  }else if(S.meta&&cal){var m=S.meta,ms=(S.months||[]).slice().reverse();if(!ms.length)ms=[m.month];
    var ds=[];for(var i=+m.asOf.slice(8,10);i>=1;i--)ds.push(m.month+'-'+(i<10?'0':'')+i);
    h+=sel('pkMonth',ms.map(function(x){return [x,mlabel(x)]}),S.month||m.month,'Month');
    h+=sel('pkDay',ds.map(function(d,i){return [d,dlabel(d)+(i===0?' (latest)':'')]}),cal.end,'As of');
    if(!cal.full)h+='<button class="pastchip" data-reset="r">Viewing '+dlabel(cal.end)+' · back to latest</button>';
    var latest=(S.months||[]).slice(-1)[0]||m.month,age=daysBetween(m.asOf,today);
    if(m.month===latest&&age>2)h+=S.canEdit?'<div class="stale">⚠ Data is '+age+' days old (last day '+dlabel(m.asOf)+'). Upload today\'s Activation Details file.</div>':'<div class="stalev">Sales data up to '+dlabel(m.asOf)+'</div>';}
  el.innerHTML=h;
}
function emptyState(){return '<div class="panel empty"><h2>No data uploaded yet</h2><p class="note">'+(S.canEdit?'Open <b>Upload &amp; Targets</b> and drop in the raw Activation Details file. Every view fills in from it.':'The tracker owner has not uploaded this month\'s raw file yet. Check back after the morning update.')+'</p>'+(S.canEdit?'<button class="btn" data-goto="setup">Upload the raw file</button>':'')+'</div>'}
function renderBand(cal){
  var m=S.meta;
  if(S.tab==='stock'){var sk=S.stock&&S.stock.latest;$('pacebar').hidden=true;
    if(sk){var su=sk.uploadedAt?new Date(new Date(sk.uploadedAt).getTime()+6*3600000):null;$('dataline').innerHTML='<div class="dbox"><span class="dlbl">Stock as of</span><b>'+dlabel(sk.date)+' '+sk.date.slice(0,4)+'</b></div>'+(su?'<div class="dbox"><span class="dlbl">Last updated</span><b>'+su.getUTCDate()+' '+MON[su.getUTCMonth()]+' '+su.getUTCFullYear()+', '+(su.getUTCHours()%12||12)+':'+(su.getUTCMinutes()<10?'0':'')+su.getUTCMinutes()+' '+(su.getUTCHours()<12?'AM':'PM')+'</b></div>':'')}else $('dataline').textContent='SIM stock not uploaded yet'}
  else if(S.tab==='bike'||S.tab==='bikestat'||S.tab==='bikes'||S.tab==='faulty'){var bd=S.bike&&S.bike.data;$('pacebar').hidden=true;
    if(bd){var bu=bd.uploadedAt?new Date(new Date(bd.uploadedAt).getTime()+6*3600000):null;$('dataline').innerHTML=(bu?'<div class="dbox"><span class="dlbl">Last updated</span><b>'+bu.getUTCDate()+' '+MON[bu.getUTCMonth()]+' '+bu.getUTCFullYear()+', '+(bu.getUTCHours()%12||12)+':'+(bu.getUTCMinutes()<10?'0':'')+bu.getUTCMinutes()+' '+(bu.getUTCHours()<12?'AM':'PM')+'</b></div>':'')}else $('dataline').textContent='Bike data not uploaded yet'}
  else if(cal){$('pacebar').hidden=false;$('dayno').textContent=cal.elapsed+' of '+cal.dim;$('tg').textContent=pct(cal.tg,1);$('fill').style.width=(cal.tg*100)+'%';$('track').setAttribute('aria-label','Time gone '+pct(cal.tg,1));
    var up=m.uploadedAt?new Date(m.uploadedAt):null;
    var yr=m.month.slice(0,4);
    $('dataline').innerHTML=
      (up?(function(){var dk=new Date(up.getTime()+6*3600000);var h=dk.getUTCHours(),mi=dk.getUTCMinutes();return '<div class="dbox"><span class="dlbl">Last updated</span><b>'+dk.getUTCDate()+' '+MON[dk.getUTCMonth()]+' '+dk.getUTCFullYear()+', '+(h%12||12)+':'+(mi<10?'0':'')+mi+' '+(h<12?'AM':'PM')+'</b></div>'})():'');
  }else{$('pacebar').hidden=true;$('dataline').textContent=S.loaded.meta?'Waiting for the first upload':'Loading data…'}
  var areas=['All'];allCodes().forEach(function(c){var a=infoFor(c).area;if(areas.indexOf(a)<0)areas.push(a)});
  areas=[areas[0]].concat(areas.slice(1).sort());
  if(areas.indexOf(S.area)<0)S.area='All';
  $('chips').innerHTML=areas.length>2?areas.map(function(a){return '<button class="chip" data-area="'+esc(a)+'" aria-pressed="'+(a===S.area)+'">'+esc(a==='All'?'All areas':a)+'</button>'}).join(''):'';
  $('chips').hidden=areas.length<=2;
  $('setupTab').hidden=!S.canEdit;$('dcmTab').hidden=!S.canEdit;$('bankTab').hidden=!S.canEdit;var it=$('iddbTab');if(it)it.hidden=!S.canEdit;var vt=$('visTab');if(vt)vt.hidden=!S.canEdit;if((S.tab==='dcm'||S.tab==='bank'||S.tab==='iddb'||S.tab==='visits')&&!S.canEdit)S.tab='overview';
  renderPickers(cal);
  document.querySelectorAll('.tab').forEach(function(t){t.setAttribute('aria-selected',String(t.getAttribute('data-tab')===S.tab))});
}

function viewOverview(rows,f,cal){
  var sum=function(k){return f.reduce(function(a,r){return a+r[k]},0)};
  var ga=sum('ga'),gaR=sum('gaR'),gaA=sum('gaA'),rep=sum('rep'),tgt=sum('tgt'),esim=sum('esim'),mnp=sum('mnp');
  var withT=f.filter(function(r){return r.tgt}).length;
  var activeLast=f.filter(function(r){return r.last.t>0}).length;
  var regionGA=regionTotal(cal,0),LD=lmtdDates(cal),lmGA=LD?sum('lmGa'):null,lmRep=LD?sum('lmRep'):null;
  var proj=ga/cal.elapsed*cal.dim,pace=tgt?ga/(tgt*cal.tg):null;
  var alerts=buildAlerts(f,cal);
  var ps=function(k){return f.reduce(function(a,r){return a+(r.prod[k]||0)},0)};
  var simRep=f.reduce(function(a,r){return a+r.simRep},0),opRssp=f.filter(function(r){return r.total>0}).length,wifiT=f.reduce(function(a,r){return a+r.wifi},0);
  var pc=function(l,v){return '<div class="pcard"><span>'+l+'</span><b>'+v+'</b></div>'};
  var h=waButton()+'<section class="section"><div class="pcards">'+pc('Operational RSSP',fmt(opRssp))+pc('Activation',fmt(ga))+pc('SIM Replacement',fmt(simRep))+pc('Postpaid SIM',fmt(ps('post')))+pc('eSIM Prepaid',fmt(ps('esimPre')))+pc('eSIM Replacement',fmt(ps('esimRep')))+pc('MNP SIM',fmt(ps('mnpSim')))+pc('MNP Replacement',fmt(ps('mnpRep')))+pc('WiFi SIM',fmt(wifiT))+'</div></section>';
  h+='<section class="section"><div class="kpis">'+
   kpi('RSSP GA, month to date',fmt(ga),'<div class="split"><span><i class="sw robi"></i>Robi '+fmt(gaR)+'</span><span><i class="sw airtel"></i>Airtel '+fmt(gaA)+'</span></div>'+grBadge(ga,lmGA)+(S.canEdit&&!S.prev?'<span class="note">Upload last month\'s file to see LMTD growth</span>':''))+
   (tgt?kpi('Pace vs target',pct(pace),'Target '+fmt(tgt)+' · needs '+fmt(Math.ceil(Math.max(0,tgt-ga)/Math.max(1,cal.remaining)))+'/day'):kpi('GA per day',fmt(ga/cal.elapsed),'Last day '+fmt(f.reduce(function(a,r){return a+(r.last.robi||0)+(r.last.airtel||0)},0))+' · per RSSP '+(f.length?(ga/cal.elapsed/f.length).toFixed(1):'–')))+
   kpi('Projected month-end GA',fmt(proj),'At the current daily rate of '+fmt(ga/cal.elapsed)+'/day')+
   kpi('SIM replacements',fmt(rep),'eSIM '+fmt(esim)+' · MNP '+fmt(mnp)+grBadge(rep,lmRep))+
   kpi('RSSPs active on '+dlabel(cal.dates[cal.dates.length-1]),activeLast+'<span style="font-size:1.1rem;color:var(--muted)"> / '+f.length+'</span>',f.length-activeLast?(f.length-activeLast)+' had no transactions':'Every point transacted')+
   kpi('RSSP share of region GA',regionGA?pct(ga/regionGA,1):'–',fmt(regionGA)+' GA across all retailers')+
  '</div></section>';
  var nflag=alerts.reduce(function(a,g){return a+g.list.length},0);
  h+='<section class="section"><div class="sechead"><h2>Needs attention</h2><span class="note">'+nflag+' flag'+(nflag===1?'':'s')+'</span></div><div class="agroups">'+
    alerts.map(function(g){return alertCard(g,g.list.map(function(r){var v=g.val(r);return '<button class="achip" data-open="'+esc(r.code)+'">'+esc(r.name)+(v?' <span>'+v+'</span>':'')+'</button>'}).join(''))}).join('')+'</div></section>';
  h+='<section class="section"><div class="sechead"><h2>Daily trend</h2><div class="seg" role="group" aria-label="Metric"><button data-trend="ga" aria-pressed="'+(S.trend==='ga')+'">New SIM (GA)</button><button data-trend="rep" aria-pressed="'+(S.trend==='rep')+'">Replacements</button></div></div><div class="panel"><div class="legend">'+(S.trend==='ga'?'<span><i class="sw robi"></i>Robi GA</span><span><i class="sw airtel"></i>Airtel GA</span>':'<span><i class="sw" style="background:var(--rep-robi)"></i>Robi replacements</span><span><i class="sw" style="background:var(--rep-airtel)"></i>Airtel replacements</span>')+'</div><div class="chart" id="trendChart"></div></div></section>';
  h+='<section class="section"><div class="sechead"><h2>Zero GA RFO, day wise</h2><span class="note">RSSPs whose RFO had no GA that day, out of '+f.length+'</span></div><div class="panel"><div class="chart" id="zChart"></div></div></section>';
  h+='<section class="section"><div class="sechead"><h2>Month burn-up</h2><span class="note">'+(tgt?'Solid line is actual GA, dashed line is the target pace'+(withT<f.length?' ('+withT+' of '+f.length+' RSSPs have targets)':''):(S.canEdit?'Add targets to compare against pace':'Cumulative GA this month'))+'</span></div><div class="panel" style="display:grid;gap:10px"><div class="bstats" id="bstats"></div><div class="chart" id="burnChart"></div><div class="legend"><span><i class="sw" style="background:var(--bar-sky)"></i>Actual GA (cumulative)</span><span><i class="sw" style="background:var(--bar-sky);opacity:.5"></i>Projection at current rate</span>'+(tgt?'<span><i class="sw" style="background:var(--faint)"></i>Target pace</span><span><i class="sw" style="background:var(--crit)"></i>Required path to target</span>':'')+'</div></div></section>';
  // area table
  (function(){var L=cal.dates[cal.dates.length-1],t=['*RSSP Business Update · '+(S.area==='All'?'Chandpur Region':S.area+' area')+'*','Data: 1 '+MON[+L.slice(5,7)-1]+' to '+dlabel(L)+' '+L.slice(0,4)+' (day '+cal.elapsed+' of '+cal.dim+')',''];
    t.push('*GA MTD:* '+fmt(ga)+' (Robi '+fmt(gaR)+' · Airtel '+fmt(gaA)+')'+(lmGA?' · '+(ga>=lmGA?'▲ ':'▼ ')+Math.abs((ga/lmGA-1)*100).toFixed(0)+'% vs LMTD':''));
    /* targets stay private: never included in shared messages */
    t.push('*Projected month end:* '+fmt(proj),'*Replacements:* '+fmt(rep)+' · *WiFi SIM:* '+fmt(wifiT),'*Active RSSPs on '+dlabel(L)+':* '+activeLast+'/'+f.length,'');
    alerts.forEach(function(g){if(g.list.length){t.push('⚠️ *'+g.title+' ('+g.list.length+'):*');g.list.forEach(function(r,i){var v=g.val(r);t.push((i+1)+'. '+r.name+(v?' · '+v.replace(/<[^>]+>/g,''):''))});t.push('')}});
    var top=f.slice().sort(function(a,b){return b.ga-a.ga}).slice(0,3);t.push('🏆 *Top GA:*');top.forEach(function(r,i){t.push((i+1)+'. '+r.name+' · '+fmt(r.ga)+' GA')});t.push('','Dashboard: '+location.origin);
    S.waText=t.join('\n');
    var g0=lmGA?(ga>=lmGA?'▲ ':'▼ ')+Math.abs((ga/lmGA-1)*100).toFixed(0)+'% vs LMTD':'';
    S.imgSpec={file:'rssp-update-'+L,title:'RSSP Business Update',sub:(S.area==='All'?'Chandpur Region':S.area+' area')+' · 1 '+MON[+L.slice(5,7)-1]+' to '+dlabel(L)+' '+L.slice(0,4)+' · day '+cal.elapsed+' of '+cal.dim,
      kpis:[{l:'GA month to date',v:fmt(ga),s:'Robi '+fmt(gaR)+' · Airtel '+fmt(gaA),g:g0,up:ga>=(lmGA||0)},{l:'Projected month end',v:fmt(proj),s:fmt(ga/cal.elapsed)+' GA a day'},{l:'SIM replacements',v:fmt(rep),s:'eSIM '+fmt(esim)+' · MNP '+fmt(mnp)},
        {l:'WiFi SIM',v:fmt(wifiT),s:'Not counted in GA'},{l:'RSSPs active on '+dlabel(L),v:activeLast+' / '+f.length,s:(f.length-activeLast)+' had no transactions'},{l:'Operational RSSPs',v:fmt(f.filter(function(r){return r.total>0}).length),s:'with at least one transaction'}],
      sections:alerts.map(function(g){return {t:g.title,sev:g.sev,items:g.list.map(function(r){var v=g.val(r);return r.name+(v?'  ·  '+String(v).replace(/<[^>]+>/g,''):'')})}}).concat([{t:'Top GA',sev:'good',items:f.slice().sort(function(a,b){return b.ga-a.ga}).slice(0,3).map(function(r){return r.name+'  ·  '+fmt(r.ga)+' GA'})}])};
  })();
  var areas={};f.forEach(function(r){var a=areas[r.area]||(areas[r.area]={n:0,ga:0,rep:0,tgt:0,active:0,lm:0});a.n++;a.ga+=r.ga;a.rep+=r.rep;a.tgt+=r.tgt;a.lm+=r.lmGa||0;if(r.last.t>0)a.active++});
  h+='<section class="section"><div class="sechead"><h2>By area</h2></div><div class="tablebox"><table class="compact"><thead><tr><th class="l">Area</th><th>RSSPs</th><th>Active '+dlabel(cal.dates[cal.dates.length-1])+'</th><th>GA</th>'+(LD?'<th>LMTD</th><th>Growth</th>':'')+(tgt?'<th>Target</th><th>Pace</th>':'')+'<th>Replacements</th><th>GA / RSSP / day</th></tr></thead><tbody>'+
   Object.keys(areas).sort().map(function(k){var a=areas[k];return '<tr><td class="l"><b>'+esc(k)+'</b></td><td>'+a.n+'</td><td>'+a.active+'</td><td>'+fmt(a.ga)+'</td>'+(LD?'<td>'+fmt(a.lm)+'</td><td>'+grCell(a.ga,a.lm)+'</td>':'')+(tgt?'<td>'+(a.tgt?fmt(a.tgt):'–')+'</td><td>'+pacePill(a.tgt?a.ga/(a.tgt*cal.tg):null)+'</td>':'')+'<td>'+fmt(a.rep)+'</td><td>'+(a.ga/a.n/cal.elapsed).toFixed(1)+'</td></tr>'}).join('')+
   '</tbody></table></div></section>';
  chartJobs.push(function(){
    var items=cal.dates.map(function(d){var R=0,A=0,PR=0,PA=0,k=cal.dates.indexOf(d);f.forEach(function(r){var x=r.daily[k];R+=x.robi;A+=x.airtel;PR+=x.repR||0;PA+=x.repA||0});
      return S.trend==='ga'?{label:String(+d.slice(8)),segs:[{v:R,cls:'robi'},{v:A,cls:'airtel'}],tip:'<b>'+dlabel(d)+'</b><br>GA '+fmt(R+A)+'<br>Robi '+fmt(R)+' · Airtel '+fmt(A)}
        :{label:String(+d.slice(8)),segs:[{v:PR,cls:'rep-robi'},{v:PA,cls:'rep-airtel'}],tip:'<b>'+dlabel(d)+'</b><br>Replacements '+fmt(PR+PA)+'<br>Robi '+fmt(PR)+' · Airtel '+fmt(PA)}});
    barChart($('trendChart'),items,{labels:true,aria:'Daily RSSP '+(S.trend==='ga'?'GA':'replacements')});
    barChart($('zChart'),cal.dates.map(function(d,i){var z=f.filter(function(r){return r.daily[i].rfo===0}).length;return {label:String(+d.slice(8)),segs:[{v:z,cls:'gred'}],tip:'<b>'+dlabel(d)+'</b><br>Zero GA RFO '+z+' of '+f.length}}),{labels:true,aria:'Zero GA RFO by day'});
    var c=0,cum=cal.dates.map(function(d,i){f.forEach(function(r){c+=r.daily[i].robi+r.daily[i].airtel});return c});
    burnChart($('burnChart'),cal.dates,cum,tgt,cal.dim);
    var dly=cum.map(function(v,i){return v-(i?cum[i-1]:0)}),n=dly.length,best=0;dly.forEach(function(v,i){if(v>dly[best])best=i});
    var l7=dly.slice(-7),p7=dly.slice(-14,-7),a7=l7.reduce(function(a,v){return a+v},0)/Math.max(1,l7.length),ap7=p7.length?p7.reduce(function(a,v){return a+v},0)/p7.length:null;
    var tr=ap7?(a7-ap7)/ap7:null,now=cum[n-1]||0;
    var st=function(l,v,sub,cls){return '<div class="bstat"><span>'+l+'</span><b'+(cls?' class="'+cls+'"':'')+'>'+v+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>'};
    $('bstats').innerHTML=st('GA MTD',fmt(now),dlabel(cal.dates[n-1]))+st('Avg per day',fmt(now/n),n+' days')+st('Best day',fmt(dly[best]),dlabel(cal.dates[best]))+
      st('Last 7 days avg',fmt(a7),tr==null?'':(tr>=0?'▲ ':'▼ ')+pct(Math.abs(tr))+' vs prior 7',tr==null?'':tr>=0?'up':'down')+
      st('Projected',fmt(now/n*cal.dim),'month end')+
      (tgt?st('Need per day',fmt(Math.ceil(Math.max(0,tgt-now)/Math.max(1,cal.remaining))),'to hit '+fmt(tgt)):st('Days left',cal.remaining,'in the month'));
  });
  return h;
}
/* KPI card colour follows meaning: red = a problem to fix, amber = watch, green = on track or nothing wrong, blue = plain volume */
function kpiTone(l,v){var t=String(l).replace(/<[^>]*>/g,'').toLowerCase(),vs=String(v==null?'':v).replace(/<[^>]*>/g,' ').replace(/,/g,''),m=vs.match(/-?\d+(\.\d+)?/),n=m?+m[0]:null,
    r=vs.match(/(\d+(?:\.\d+)?)\s*(?:\/|of)\s*(\d+(?:\.\d+)?)/),ratio=r&&+r[2]?r[1]/r[2]:null,pc=/%/.test(vs)&&n!=null?n/100:null,band=function(p,g,a){return p==null?'info':p>=g?'good':p>=a?'warn':'bad'};
  if(/resolved/.test(t))return 'good';
  if(/average days open/.test(t))return n==null?'info':n>7?'bad':n>3?'warn':'good';
  if(/aged|over 1 year/.test(t))return n?'warn':'good';
  if(/after 10:00 am this month/.test(t))return pc==null?'info':pc>.1?'bad':pc>.03?'warn':'good';
  if(/^km on /.test(t))return n==null?'info':n>=3?'good':n>0?'warn':'bad';
  if(/faulty|fake|stock-out|zero (stock|km)|below|no check-in|after 10:00|not available|missed/.test(t))return n?'bad':'good';
  if(/pace/.test(t))return band(pc,1,.85);
  if(/compliance|≥3 km|checked in|active|days at|selling|score/.test(t))return band(ratio!=null?ratio:pc!=null?pc:(/score/.test(t)&&n!=null?n/100:null),.9,.75);
  return 'info'}
function kpi(l,v,s,tone){return '<div class="kpi t-'+(tone||kpiTone(l,v))+'"><div class="l">'+l+'</div><div class="v">'+v+'</div><div class="s">'+s+'</div></div>'}
/* achievement against the full month target, judged against time gone */
function achTone(a,tg){return a==null||!tg?'info':a>=tg?'good':a>=tg*.85?'warn':'bad'}

var COLS=[
 {k:'rank',t:'#'},{k:'name',t:'RSSP',l:1},{k:'ga',t:'GA'},{k:'gr',t:'vs LMTD'},{k:'tgt',t:'Target'},{k:'ach',t:'Achieved'},{k:'gap',t:'Gap'},{k:'drr',t:'Need / day'},{k:'proj',t:'Projected'}];
function viewBoard(rows,f,cal){
  var list=f.slice(),k=S.sort.key,d=S.sort.dir,LDB=!!lmtdDates(cal),HT=f.some(function(r){return r.tgt});
  if(k!=='rank')list.sort(function(a,b){var x=a[k],y=b[k];if(k==='name')return d*String(x).localeCompare(String(y));x=x==null?-1:x;y=y==null?-1:y;return d*(x-y)});
  var w=scoreWeights(),D5=cal.dates.slice(-5);
  var h='<section class="section"><div class="sechead"><h2>Leaderboard</h2><span class="note">'+f.length+' RSSPs · ranked by GA, active days and quality · tap a name for detail</span></div>';
  h+='<div class="tablebox"><table class="compact lb"><thead><tr>'+COLS.filter(function(c){return (c.k!=='gr'||LDB)&&(HT||['tgt','ach','gap','drr'].indexOf(c.k)<0)}).map(function(c){var cls=(c.l?'l ':'')+(c.k==='name'?'name':'');return '<th class="'+cls+'">'+(c.ns?c.t:'<button class="sortbtn" data-sort="'+c.k+'"'+(S.sort.key===c.k?' aria-sort="'+(d>0?'ascending':'descending')+'"':'')+'>'+c.t+(S.sort.key===c.k?(d>0?' ↑':' ↓'):'')+'</button>')+'</th>'}).join('')+D5.map(function(dd){return '<th class="d5">'+dlabel(dd)+'</th>'}).join('')+'</tr></thead><tbody>';
  var THEAD=h.slice(h.indexOf('<thead>'),h.indexOf('<tbody>'));
  var rowH=function(r){
    var gaBar='<div class="bar" title="Robi '+r.gaR+', Airtel '+r.gaA+'"><i style="width:'+(r.ga?100*r.gaR/r.ga:0)+'%;background:var(--robi)"></i><i style="width:'+(r.ga?100*r.gaA/r.ga:0)+'%;background:var(--airtel)"></i></div>';
    return '<tr class="'+(r.silent?'zero':'')+'"><td class="rank">'+r.rank+'</td><td class="name"><button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button>'+starTag('rssp',r.code)+'<small>'+esc(r.territory||r.area)+'</small></td>'+
      '<td><div class="gacell"><span>'+fmt(r.ga)+'</span>'+gaBar+'</div></td>'+(LDB?'<td>'+grCell(r.ga,r.lmGa)+'<small class="note">'+fmt(r.lmGa)+'</small></td>':'')+(HT?'<td>'+(r.tgt?fmt(r.tgt):'–')+'</td><td>'+(r.ach==null?'–':'<span class="pill '+paceClass(r.pace)+'">'+pct(r.ach)+'</span>')+'</td><td>'+(r.gap==null?'–':r.gap>0?'<b class="gapn">'+fmt(r.gap)+'</b>':'<span class="gac g">+'+fmt(-r.gap)+'</span>')+'</td><td>'+(r.drr==null?'–':fmt(Math.ceil(r.drr)))+'</td>':'')+'<td>'+fmt(r.proj)+'</td>'+r.daily.slice(-5).map(function(x){var v=(x.robi||0)+(x.airtel||0);return '<td class="d5">'+(v?'<b>'+v+'</b>':'<span class="pill crit">0</span>')+'</td>'}).join('')+'</tr>'};
  h+=list.map(rowH).join('');
  h+='</tbody></table></div>';
  h+='<details class="panel"><summary>How the score works</summary><p>Each RSSP gets a score out of 100 from three parts, weighted '+(+w.ga)+' / '+(+w.active)+' / '+(+w.quality)+'.</p><p><b>GA</b>: GA achieved against target pace for today, capped at 120% of pace. Where a point has no target yet, its GA is compared with the best RSSP instead.</p><p><b>Active days</b>: days with at least one transaction, out of the '+cal.elapsed+' days so far.</p><p><b>Quality</b>: share of transactions without a fake location detected.</p><p>WiFi SIMs are not counted as GA; they are tracked on the WiFi tab.</p></details>';
  h+='</section>';
  /* Non performing RSSPs: pace under 100% of target (admin only, since targets are admin only) */
  if(HT){var NP=f.filter(function(r){return r.tgt&&r.pace!=null&&r.pace<1}).sort(function(a,b){return a.pace-b.pace});
    S.npRssp={cal:cal,LDB:LDB,rows:NP};
    h+='<section class="section"><div class="sechead"><h2>Non performing RSSPs</h2><span class="note">'+NP.length+' of '+f.length+' RSSPs behind target · achievement under time gone ('+pct(cal.tg)+') · lowest first</span>'+(NP.length?'<button class="imgbtn" type="button" id="npRsspShare"><span aria-hidden="true">🖼️</span> Share as picture</button>':'')+'</div>'+
      (NP.length?'<div class="tablebox"><table class="compact lb">'+THEAD.replace(/<button class="sortbtn"[^>]*>([^<]*)<\/button>/g,function(m,t){return t.replace(/ [↑↓]$/,'')})+'<tbody>'+NP.map(rowH).join('')+'</tbody></table></div><p class="note">Achieved = GA MTD ÷ month target. Green at or above time gone ('+pct(cal.tg)+'), yellow within 85% of it, red behind. Gap = GA still needed to reach the month target. Visible to admin only.</p><p class="status" id="npRsspStatus"></p>':'<div class="panel"><p class="note">Every RSSP is at or above time gone on target achievement.</p></div>')+'</section>'}
  return h;
}

function viewDetail(rows,f,cal){
  if(!f.length)return '<div class="panel empty"><h2>No RSSPs in this area</h2></div>';
  if(!S.sel||!f.some(function(r){return r.code===S.sel}))S.sel=f[0].code;
  var r=f.filter(function(x){return x.code===S.sel})[0];
  var opts=f.slice().sort(function(a,b){return a.name.localeCompare(b.name)}).map(function(x){return '<option value="'+esc(x.code)+'"'+(x.code===S.sel?' selected':'')+'>'+esc(x.name)+' · '+esc(x.territory||x.area)+'</option>'}).join('');
  var h='<section class="section"><div class="detailhead"><div style="display:grid;gap:6px;min-width:0"><label class="eyebrow" for="selR">RSSP</label><select id="selR">'+opts+'</select></div><div class="note">Rank <b>'+r.rank+'</b> of '+rows.length+' · score <b>'+r.score.toFixed(0)+'</b></div></div>';
  h+='<div class="facts"><span>Area <b>'+esc(r.area)+'</b></span><span>Territory <b>'+esc(r.territory||'–')+'</b></span><span>Distributor <b>'+esc(r.distributor||'–')+'</b></span><span>DSR <b>'+esc(r.dsr||'–')+'</b></span><span>Code <b>'+esc(r.code)+'</b></span></div></section>';
  h+=rsspIdentity(r);
  if(r.silent)return h+'<div class="panel empty"><h2>No transactions this month</h2><p class="note">This RSSP is on your master list but does not appear in the latest raw file.</p></div>';
  h+='<section class="section"><div class="kpis">'+
    kpi('GA, month to date',fmt(r.ga),'<div class="split"><span><i class="sw robi"></i>Robi '+fmt(r.gaR)+'</span><span><i class="sw airtel"></i>Airtel '+fmt(r.gaA)+'</span></div>')+
    (r.tgt?kpi('Pace vs target',pct(r.pace),'Target '+fmt(r.tgt)+' · needs '+fmt(Math.ceil(r.drr))+'/day'):kpi('Projected month-end GA',fmt(r.proj),'At '+(r.ga/cal.elapsed).toFixed(1)+' a day'))+
    kpi('Replacements',fmt(r.rep),r.repT?'Target '+fmt(r.repT)+' · pace '+pct(r.repPace):'eSIM '+fmt(r.esim)+' · MNP '+fmt(r.mnp))+
    kpi('Active days',r.active+'<span style="font-size:1.1rem;color:var(--muted)"> / '+cal.elapsed+'</span>',r.streak?'Silent for the last '+r.streak+' day'+(r.streak>1?'s':''):'Transacted on '+dlabel(cal.dates[cal.dates.length-1]))+
    kpi('WiFi SIM',fmt(r.wifi),r.wifiT?'Target '+fmt(r.wifiT)+' · pace '+pct(r.wifiPace):'Not counted in GA')+
    kpi('Fake location',fmt(r.fake),r.fake?'Verify each one':'None this month')+
  '</div></section>';
  h+='<section class="section"><div class="sechead"><h2>Daily GA</h2><div class="legend"><span><i class="sw robi"></i>Robi GA</span><span><i class="sw airtel"></i>Airtel GA</span></div></div><div class="panel"><div class="chart" id="dChart"></div></div></section>';
  h+='<section class="section"><div class="sechead"><h2>Busiest hours</h2><span class="note">All transactions this month by hour of day</span></div><div class="panel" style="display:grid;gap:10px"><div class="bstats" id="hstats"></div><div class="chart" id="hChart" style="min-height:220px"></div><div class="legend"><span><i class="sw" style="background:var(--robi)"></i>Peak hour</span><span><i class="sw" style="background:var(--bar-sky)"></i>Other hours</span><span><i class="sw" style="background:var(--sunk);border:1px solid var(--line)"></i>Morning · Afternoon · Evening bands</span></div></div></section>';
  chartJobs.push(function(){
    barChart($('dChart'),r.daily.map(function(d){return {label:String(+d.d.slice(8)),segs:[{v:d.robi,cls:'robi'},{v:d.airtel,cls:'airtel'}],tip:'<b>'+dlabel(d.d)+'</b><br>GA '+(d.robi+d.airtel)+' (Robi '+d.robi+' · Airtel '+d.airtel+')<br>Replacements '+d.rep+(d.wifi?'<br>WiFi SIM '+d.wifi:'')}}),{labels:true,aria:'Daily GA'});
    var hrs=[];for(var q=0;q<24;q++)hrs.push((r.hours||[])[q]||0);
    var tot=hrs.reduce(function(a,v){return a+v},0)||1,peak=0;hrs.forEach(function(v,i){if(v>hrs[peak])peak=i});
    var hl=function(i){i=i%24;return (i%12||12)+(i<12?' AM':' PM')},rng=function(a,b){return hl(a).replace(' ','')+'–'+hl(b).replace(' ','')};
    var bw=0,bs=7;for(var a=0;a<22;a++){var w=hrs[a]+hrs[a+1]+hrs[a+2];if(w>bw){bw=w;bs=a}}
    var first=hrs.findIndex(function(v){return v>0}),last=23;while(last>0&&!hrs[last])last--;
    var band=function(a,b){var t=0;for(var i=a;i<b;i++)t+=hrs[i];return t};
    var mo=band(0,12),af=band(12,17),ev=band(17,24);
    var st=function(l,v,sub){return '<div class="bstat"><span>'+l+'</span><b>'+v+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>'};
    $('hstats').innerHTML=st('Peak hour',hl(peak),fmt(hrs[peak])+' txns · '+pct(hrs[peak]/tot))+st('Busiest 3 hours',rng(bs,bs+3),pct(bw/tot)+' of the day')+
      st('Morning',pct(mo/tot),'before 12 PM')+st('Afternoon',pct(af/tot),'12 PM to 5 PM')+st('Evening',pct(ev/tot),'after 5 PM')+
      st('Active window',first<0?'–':hl(first)+' to '+hl(last),'first to last sale hour');
    var start=Math.min(7,first<0?7:first),items=[];
    for(var i=start;i<=23;i++)items.push({label:(i%12||12)+(i<12?'a':'p'),segs:[{v:hrs[i],cls:i===peak?'robi':'bar-sky'}],tip:'<b>'+hl(i).replace(' ',':00 ')+' to '+hl(i+1).replace(' ',':00 ')+'</b><br>'+fmt(hrs[i])+' transactions ('+pct(hrs[i]/tot,1)+')<br>About '+(hrs[i]/Math.max(1,r.active)).toFixed(1)+' per active day'+(i===peak?'<br><b>Peak hour</b>':'')});
    var early=0;for(var j=0;j<start;j++)early+=hrs[j];
    var off=start;
    barChart($('hChart'),items,{h:220,labels:true,aria:'Transactions by hour',bands:[{from:0,to:12-off,label:'Morning'},{from:12-off,to:17-off,label:'Afternoon'},{from:17-off,to:items.length,label:'Evening'}]});
  });
  h+=attForRssp(r.code);
  return h;
}


function npRsspImage(){
  var E=S.npRssp;if(!E||!E.rows.length)return;var cal=E.cal,L=E.rows.slice(0,38),d=cal.dates[cal.dates.length-1],d5=cal.dates.slice(-5);
  var W=2400,P=60,RH=118,top=300,H=top+105+L.length*RH+130,K=Math.min(7680/W,16000/H),c=document.createElement('canvas');c.width=Math.round(W*K);c.height=Math.round(H*K);var x=c.getContext('2d');x.scale(K,K);x.imageSmoothingQuality='high';
  var F="'Barlow Condensed','Segoe UI',Arial,sans-serif",B="'Source Sans 3','Segoe UI',Arial,sans-serif";
  x.fillStyle='#F4F7FA';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#E4002B');g.addColorStop(.55,'#F0447A');g.addColorStop(1,'#FFA62B');x.fillStyle=g;x.fillRect(0,0,W,14);
  var lg=document.querySelector('img.logo');if(lg&&lg.complete&&lg.naturalWidth){var lh=120,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,50,lw,lh)}
  x.fillStyle='#141C24';x.font='800 72px '+F;x.fillText('Non performing RSSPs',P,120);
  x.fillStyle='#5A6570';x.font='500 34px '+B;x.fillText((S.area==='All'?'Chandpur Region':S.area)+' · MTD till '+dlabel(d)+' '+d.slice(0,4)+' · '+E.rows.length+' RSSPs behind target · Time gone '+pct(cal.tg),P,175);
  var cols=[['GA',1.5]];if(E.LDB)cols.push(['vs\nLMTD',1.3]);cols.push(['Target',1],['Achieved',1.2],['Gap',1],['Need\n/ day',1],['Projected',1.1]);d5.forEach(function(dd){cols.push([dlabel(dd),.75])});
  var nameX=P+90,nameW=500,x0=nameX+nameW+20,tw=cols.reduce(function(a,c){return a+c[1]},0),uw=(W-P-20-x0)/tw,cx=[],acc=x0;cols.forEach(function(cl){cx.push(acc+cl[1]*uw/2);acc+=cl[1]*uw});
  x.fillStyle='#FFFFFF';x.strokeStyle='#DCE3EA';x.lineWidth=2;x.beginPath();if(x.roundRect)x.roundRect(P,top-56,W-2*P,115+L.length*RH,24);else x.rect(P,top-56,W-2*P,115+L.length*RH);x.fill();x.stroke();
  var ctr=function(t,cxx,y){x.textAlign='center';x.fillText(t,cxx,y);x.textAlign='left'};
  x.fillStyle='#5A6570';x.font='700 26px '+B;ctr('#',P+45,top);x.fillText('RSSP',nameX,top);cols.forEach(function(cl,i){var ls=cl[0].toUpperCase().split('\n');if(ls.length>1){ctr(ls[0],cx[i],top-15);ctr(ls[1],cx[i],top+15)}else ctr(ls[0],cx[i],top)});x.fillStyle='#E3E8EE';x.fillRect(P,top+30,W-2*P,3);
  var fit=function(s,w){s=String(s==null?'':s);if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s+'…'};
  var pill=function(t,cxx,y,bg,fg,fs){x.font='700 '+(fs||30)+'px '+B;var w=Math.max(x.measureText(t).width+34,52);x.fillStyle=bg;x.beginPath();if(x.roundRect)x.roundRect(cxx-w/2,y-30,w,48,24);else x.rect(cxx-w/2,y-30,w,48);x.fill();x.fillStyle=fg;ctr(t,cxx,y+4)};
  L.forEach(function(r,i){var y=top+85+i*RH,k=0;if(i){x.fillStyle='#EDF1F5';x.fillRect(P+16,y-56,W-2*P-32,2)}
    x.fillStyle='#8A949E';x.font='700 32px '+B;ctr(String(r.rank),P+45,y+4);
    x.fillStyle='#141C24';x.font='700 38px '+B;x.fillText(fit(r.name,nameW),nameX,y-4);x.fillStyle='#6A7682';x.font='500 26px '+B;x.fillText(fit(r.territory||r.area||'',nameW),nameX,y+32);
    var num=function(t,bold,col){x.fillStyle=col||'#141C24';x.font=(bold?'700':'500')+' 34px '+B;ctr(t,cx[k],y+6);k++};
    /* GA with Robi / Airtel bar */
    x.fillStyle='#141C24';x.font='600 34px '+B;var gx=cx[k]-uw*0.62;x.textAlign='right';x.fillText(fmt(r.ga),gx+50,y+6);x.textAlign='left';var bx=gx+64,bw=uw*0.9;
    x.fillStyle='#EEF2F6';x.fillRect(bx,y-8,bw,16);if(r.ga){x.fillStyle='#C62832';x.fillRect(bx,y-8,bw*r.gaR/r.ga,16);x.fillStyle='#5B57C4';x.fillRect(bx+bw*r.gaR/r.ga,y-8,bw*r.gaA/r.ga,16)}k++;
    if(E.LDB){if(r.lmGa==null)num('–');else if(!r.lmGa)num(r.ga?'New':'–');else{var gr=r.ga/r.lmGa-1;pill((gr>=0?'▲ ':'▼ ')+Math.abs(gr*100).toFixed(0)+'%',cx[k]-34,y,gr>=0?'#D7F7E8':'#FDE2E0',gr>=0?'#0E7A52':'#B42318',28);x.fillStyle='#8A949E';x.font='500 26px '+B;x.fillText(fmt(r.lmGa),cx[k]+42,y+4);k++}}
    num(fmt(r.tgt));var pc=paceClass(r.pace),T={good:['#D7F7E8','#0E7A52'],warn:['#FFF1CC','#8A5A00'],crit:['#FDE2E0','#B42318']}[pc]||['#EEF2F6','#5A6570'];pill(pct(r.ach),cx[k],y,T[0],T[1]);k++;if(r.gap>0)num(fmt(r.gap),1,'#B42318');else{pill('+'+fmt(-r.gap),cx[k],y,'#D7F7E8','#0E7A52',28);k++}
    num(r.drr==null?'–':fmt(Math.ceil(r.drr)));num(fmt(r.proj));
    r.daily.slice(-5).forEach(function(q){var v=(q.robi||0)+(q.airtel||0);if(v)num(String(v),1);else{pill('0',cx[k],y,'#FDE2E0','#B42318',28);k++}})});
  x.fillStyle='#8A949E';x.font='500 28px '+B;x.fillText('Achieved = GA MTD ÷ month target. Green at or above time gone, yellow within 85% of it, red behind. Gap = GA still needed for the month target. GA bar: Robi red, Airtel purple.',P,H-80);x.fillText('RSSP Business Tracker · '+location.host,P,H-40);
  setStatus('npRsspStatus','Preparing the picture…');
  c.toBlob(function(b){var name='non-performing-rssp-'+d+'.png',file=new File([b],name,{type:'image/png'});
    var down=function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);setStatus('npRsspStatus','Picture downloaded.','ok')};
    if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Non performing RSSPs'}).then(function(){setStatus('npRsspStatus','Picture shared.','ok')}).catch(function(e){if(e&&e.name==='AbortError')setStatus('npRsspStatus','Sharing cancelled.','');else down()});
    else down()},'image/png');
}
/* ---------- RSSP Detail: codes, EL numbers and the field force of one RSSP ---------- */
function dfull(d){var p=String(d||'').split('-');return p.length<3?'–':(+p[2])+' '+MON[+p[1]-1]+' '+p[0]}
function staffOfRssp(code){
  var St=S.staff;if(!St||!St.ppl)return null;
  var L=St.ppl.filter(function(e){return e.rc===code&&(e.r==='RFO'||e.r==='Agent')}),viaCode=L.length>0;
  if(!L.length){var bps=(S.meta&&S.meta.bps)||{},seen={};Object.keys(bps).forEach(function(id){if(topKey(bps[id].rssp)!==code)return;var e=staffFor(id);if(e&&(e.r==='RFO'||e.r==='Agent')&&!seen[e.h]){seen[e.h]=1;L.push(e)}})}
  var out=[];['Agent','RFO'].forEach(function(role){
    var M=L.filter(function(e){return e.r===role}).sort(function(a,b){return (b.a||0)-(a.a||0)||(b.j>a.j?1:-1)});
    var act=M.filter(function(e){return e.a});
    (act.length?act:M.slice(0,1)).forEach(function(e){out.push(e)});
    if(!M.length)out.push({r:role,none:1})});
  return {list:out,viaCode:viaCode};
}
var BASE_G=[
 ['Codes and EL numbers',[['RSSP CODE RB','Robi code'],['RSSP EL RB','Robi EL number'],['RSSP CODE AT','Airtel code'],['RSSP EL AT','Airtel EL number'],['DEFAULT RSSP CODE NAME IN RDMS','RDMS name'],['RB DH NAME','Robi DH name'],['RB DH CODE','Robi DH code'],['RB DH MSISDN','Robi DH number','tel']]],
 ['Location and shop',[['Union','Union'],['Upazilla','Upazila'],['Area','Area'],['LATITUDE','Location','map'],['Shop Size (Sq FT)','Shop size (sq ft)'],['Agency Name','Agency'],['RENOVATION AGENCY','Renovation agency'],['INFO. SHARED DATE','Info shared on']]],
 ['Shop contact person',[['NAME','Name'],['Contact No','Contact number','tel'],['Address','Address']]],
 ['Rent and advance',[['MONTHLY RENT (AMOUNT)','Monthly rent','tk'],['ADVANCE AMOUNT (IF ANY)','Advance','tk'],['REMARKS (MODE OF ADVANCE SETTLEMENT)','Settlement remarks']]],
 ['Territory supervisor',[['Territory SUP Name','Name'],['Territory SUP Mobile','Mobile','tel'],['RDMS FF Code - TS','RDMS FF code']]],
 ['Devices and bike',[['Agent Scanner IMEI','Agent scanner IMEI'],['RFO Scanner IMEI','RFO scanner IMEI'],['Bike Chassis','Bike chassis'],['Agent WiFi IMEI','Agent WiFi IMEI'],['Agent WiFi SIM','Agent WiFi SIM'],['RFO WiFi IMEI','RFO WiFi IMEI'],['RFO WiFi SIM','RFO WiFi SIM']]]
];
function contactBtns(num){return '<div class="cbtns"><a class="callbtn sm" href="tel:'+esc(num)+'">📞 Call</a><a class="callbtn wa sm" href="'+esc(waChatUrl(num))+'"'+(/Android/i.test(navigator.userAgent)?'':' target="_blank" rel="noopener"')+'>WhatsApp</a></div>'}
function baseGroups(code){
  var B=S.base;if(!B||!B.rows||!B.rows[code])return '';
  var row=B.rows[code],used={'LONGITUDE':1,'Region':1,'RSSP CODE RB':0,'AT DH NAME':1,'AT DH CODE':1,'AT DH MSISDN':1,'Distance from location (Meter)':1,'Joining Date':1},h='';
  var kv=function(l,v,k){var x=esc(v);if(k==='tk'&&/^\d+(\.\d+)?$/.test(v))x='৳ '+(+v).toLocaleString('en-US');
    var extra=k==='tel'?contactBtns(v):'';
    if(k==='map'){var la=row['LATITUDE'],lo=row['LONGITUDE'];if(!la||!lo)return '';x=esc(la+', '+lo);extra='<div class="cbtns"><a class="callbtn sm" target="_blank" rel="noopener" href="https://www.google.com/maps?q='+encodeURIComponent(la+','+lo)+'">📍 Open map</a></div>'}
    return '<div class="bstat"><span>'+esc(l)+'</span><b style="font-size:1.02rem;overflow-wrap:anywhere">'+x+'</b>'+extra+'</div>'};
  var grid='display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px';
  BASE_G.forEach(function(g){
    var cells=g[1].map(function(f){used[f[0]]=1;var v=row[f[0]];if(f[2]==='map'){if(row['LATITUDE']&&row['LONGITUDE'])return kv(f[1],'',f[2]);return ''}return v?kv(f[1],v,f[2]):''}).join('');
    if(cells)h+='<section class="section"><div class="sechead"><h2>'+g[0]+'</h2><span class="note">Base master file</span></div><div class="panel"><div style="'+grid+'">'+cells+'</div></div></section>'});
  var rest=(B.cols||[]).filter(function(c){return !used[c]&&row[c]});
  if(rest.length)h+='<section class="section"><div class="sechead"><h2>More details</h2><span class="note">Other columns in the base master file</span></div><div class="panel"><div style="'+grid+'">'+rest.map(function(c){return kv(c,row[c])}).join('')+'</div></div></section>';
  return h;
}
function rsspIdentity(r){
  var doc=S.docs[r.code]||{},ids=doc.ids||{},has=Object.keys(ids).length>0,h='',bg=baseGroups(r.code);
  var cell=function(l,v){return '<div class="bstat"><span>'+l+'</span><b style="font-size:1.05rem;overflow-wrap:anywhere">'+(v?esc(v):'–')+'</b></div>'},grid='display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px';
  if(bg)h+=bg;
  else if(has){
    h+='<section class="section"><div class="sechead"><h2>Codes and EL numbers</h2><span class="note">From the Activation file</span></div><div class="panel" style="display:grid;gap:10px">'+
      '<div style="'+grid+'">'+cell('Robi code',r.code)+cell('Robi EL number',ids.re)+cell('Airtel EL number',ids.ae)+'</div>'+
      '<div style="'+grid+'">'+cell('Distributor Robi code',ids.dr)+cell('Distributor Airtel code',ids.da)+cell('Distributor Robi EL',ids.dre)+cell('Distributor Airtel EL',ids.dae)+'</div>'+
      '<p class="note">The Activation file carries the Airtel code for the distributor only, not for the RSSP itself.</p></div></section>';
  }else if(S.canEdit){
    h+='<section class="section"><div class="sechead"><h2>Codes and EL numbers</h2></div><div class="panel"><p class="note">Upload the RSSP base master file, or the Activation file again to fill the Robi and Airtel codes and EL numbers.</p></div></section>'}
  return h+agentRfoTable(r);
}

function viewQuality(rows,f,cal){
  var list=f.filter(function(r){return r.fake>0}).sort(function(a,b){return b.fake-a.fake||(b.flagShare||0)-(a.flagShare||0)});
  var tot=f.reduce(function(a,r){a.t+=r.total;a.f+=r.fake;return a},{t:0,f:0});
  var h='<section class="section"><div class="kpis">'+kpi('Fake location activations',fmt(tot.f),pct(tot.t?tot.f/tot.t:null,2)+' of '+fmt(tot.t)+' RSSP transactions')+kpi('RSSPs with fake location',list.length+'<span style="font-size:1.1rem;color:var(--muted)"> / '+f.length+'</span>',list.length?'Verify each case with the BP':'All clear this month')+'</div></section>';
  h+='<section class="section"><div class="sechead"><h2>Fake location by RSSP</h2><span class="note">A mock-location app was detected on the BP device at activation</span></div>';
  h+=list.length?'<div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">RSSP</th><th>Fake location</th><th>Transactions</th><th>Share</th></tr></thead><tbody>'+
   list.map(function(r){return '<tr><td class="name"><button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button><small>'+esc(r.territory)+'</small></td><td><span class="pill crit">'+r.fake+'</span></td><td>'+fmt(r.total)+'</td><td>'+pct(r.flagShare,1)+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="panel note">No fake location detected at any RSSP this month.</div>';
  return h+'</section>';
}


/* RSSP Detail: the Agent and RFO with their contact details and this month's numbers, in one table */
function agentRfoTable(r){
  var T=S.preview?null:staffOfRssp(r.code),bps=(r.bps||[]).slice(),bpNew=bps.length&&bps[0].length>3,nk=function(x){return String(x||'').toLowerCase().replace(/[^a-z]/g,'').replace(/^md/,'')};
  /* one person can appear under several spellings of the same name: add those rows together */
  (function(){var M={},out=[],el=(r.daily||[]).length;bps.forEach(function(b){var k=nk(rsspCleanBp(b[0]))+'|'+(b[5]||'');if(!M[k]){M[k]=b.slice();out.push(M[k]);return}var m=M[k];m[1]+=b[1]||0;m[2]=Math.min(el||99,(m[2]||0)+(b[2]||0));if(b.length>3){m[3]=(m[3]||0)+(b[3]||0);m[4]=(m[4]||0)+(b[4]||0)}});bps=out})();
  var used={},rows=[];
  var pick=function(role,name){var n=nk(name),k=-1;
    bps.forEach(function(b,i){if(used[i]||k>=0)return;var bn=nk(rsspCleanBp(b[0]));if(n&&bn&&(bn===n||bn.indexOf(n)>=0||n.indexOf(bn)>=0))k=i});
    if(k<0){var same=bps.map(function(b,i){return i}).filter(function(i){return !used[i]&&bps[i][5]===role});if(same.length===1)k=same[0]}
    if(k>=0){used[k]=1;return bps[k]}return null};
  if(T)T.list.forEach(function(e){rows.push({role:e.r,e:e,b:e.none?null:pick(e.r,e.n)})});
  bps.forEach(function(b,i){if(!used[i])rows.push({role:b[5]||'',b:b,extra:!!T})});
  if(!rows.length)return '';
  rows.sort(function(a,b){var o={Agent:0,RFO:1};return (o[a.role]==null?2:o[a.role])-(o[b.role]==null?2:o[b.role])||((b.b?b.b[3]:0)-(a.b?a.b[3]:0))});
  var showPh=!!T&&T.list.some(function(e){return e.p}),showSt=!!T,elapsed=(r.daily||[]).length;
  var rp=function(x){return x?'<span class="rpill '+(x==='Agent'?'ag':'rf')+'">'+x+'</span>':''};
  var tGA=0,tRep=0;rows.forEach(function(x){if(x.b&&bpNew){tGA+=x.b[3]||0;tRep+=x.b[4]||0}});
  var h='<section class="section"><div class="sechead"><h2>Agent and RFO</h2><span class="note">'+(T?'Staff list of '+dlabel(S.staff.date)+' · ':'')+'GA and replacements this month</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="l">Role</th><th class="name l">Name</th>'+(showPh?'<th>Phone</th>':'')+(showSt?'<th>Joined</th><th>AON</th>':'')+'<th>GA</th><th>Repl.</th><th>Active days</th></tr></thead><tbody>'+
    rows.map(function(x){var e=x.e,b=x.b,nm=e&&!e.none?e.n:(b?rsspCleanBp(b[0]):''),sub=e&&e.none?'<small>Not found in the staff list</small>':(e&&!e.a?'<small>Inactive</small>':(x.extra?'<small>Also sold here this month</small>':''));
      var d=e&&!e.none?Math.max(0,daysBetween(e.j,dhakaToday())):null;
      return '<tr><td class="l">'+rp(x.role)+'</td><td class="name"><b>'+(nm?esc(nm):'<span class="note">–</span>')+'</b>'+sub+'</td>'+
        (showPh?'<td>'+(e&&e.p?esc(e.p)+'<div class="cbtns"><a class="callbtn sm" href="tel:'+esc(e.p)+'">📞 Call</a><a class="callbtn wa sm" href="'+esc(waChatUrl(e.p))+'"'+(/Android/i.test(navigator.userAgent)?'':' target="_blank" rel="noopener"')+'>WhatsApp</a></div>':'–')+'</td>':'')+
        (showSt?'<td>'+(d!=null?esc(dfull(e.j)):'–')+'</td><td>'+(d!=null?aonPill(d,e.j):'–')+'</td>':'')+
        '<td><b>'+(b&&bpNew?fmt(b[3]):(b?'–':'0'))+'</b></td><td>'+(b&&bpNew?fmt(b[4]):(b?'–':'0'))+'</td><td>'+(b?b[2]+'<span class="note">/'+elapsed+'</span>':'0')+'</td></tr>'}).join('')+
    (bpNew&&rows.length>1?'<tr class="tot"><td class="l"><b>Total</b></td><td class="name"></td>'+(showPh?'<td></td>':'')+(showSt?'<td></td><td></td>':'')+'<td><b>'+fmt(tGA)+'</b></td><td><b>'+fmt(tRep)+'</b></td><td></td></tr>':'')+
    '</tbody></table></div>'+(bps.length&&!bpNew?'<p class="note" style="margin-top:6px">Re-upload today\'s raw file to see GA and replacements per person.</p>':'')+(!T&&!S.preview&&S.canEdit?'<p class="note" style="margin-top:6px">Upload the <b>DH All Staff</b> report to add phone, joining date and AON.</p>':'')+'</section>';
  return h;
}
/* ---------- RFO & Agent ---------- */
function topKey(o){var k=null,m=-1;Object.keys(o||{}).forEach(function(x){if(o[x]>m){m=o[x];k=x}});return k}
function computeBps(cal){
  var src=(S.meta&&S.meta.bps)||{},out=[];
  Object.keys(src).forEach(function(id){var b=src[id];if(!b.names)return;
    var role=b.role||topKey(b.roles)||'Other',main=topKey(b.rssp)||topKey(b.rr||{}),I=main?infoFor(main):{name:'–',area:'Unassigned',territory:''};
    if(S.area!=='All'&&I.area!==S.area)return;
    var daily=cal.dates.map(function(d){return (b.days||{})[d]||0}),ga=daily.reduce(function(a,v){return a+v},0),act=daily.filter(function(v){return v>0}).length;
    var low2=daily.filter(function(v){return v>=2}).length,LDp=lmtdDates(cal),pb=LDp&&S.prev.meta.bps?S.prev.meta.bps[id]:null,lm=LDp?(pb?LDp.reduce(function(a,d){return a+((pb.days||{})[d]||0)},0):0):null;
    var repM=b.rd?cal.dates.reduce(function(a,d){return a+(b.rd[d]||0)},0):(S.meta&&S.meta.bpRep?0:null);
    var sf=staffFor(id),aon=sf?Math.max(0,daysBetween(sf.j,dhakaToday())):null;
    out.push({rep:repM,aon:aon,join:sf?sf.j:'',sf:sf,low2:low2,lm:lm,id:id,name:rsspCleanBp(topKey(b.names)),role:role,rssp:I.name,code:main,ga:ga,active:act,perDay:act?ga/act:0,last:daily[daily.length-1]||0,daily:daily});
  });
  out.sort(function(a,b){return b.ga-a.ga||a.name.localeCompare(b.name)});
  return out;
}
function bpSpark(daily){var last=daily.slice(-7),max=Math.max.apply(null,last.concat([1]));var s='<svg width="64" height="20" aria-hidden="true">';last.forEach(function(v,i){var h=v?Math.max(2,18*v/max):1;s+='<rect x="'+(i*9+1)+'" y="'+(19-h)+'" width="7" height="'+h+'" rx="1.5" style="fill:'+(v?'var(--bar-sky)':'var(--line)')+'"/>'});return s+'</svg>'}
function viewBp(rows,f,cal,role){
  var isR=role==='RFO',all=computeBps(cal),mine=all.filter(function(b){return b.role===role});
  if(!all.length)return '<div class="panel empty"><h2>No BP data yet</h2><p class="note">Upload the raw file again to fill this tab.</p></div>';
  var slots=f.map(function(r){var rf=0,ag=0;r.daily.forEach(function(d){rf+=d.rfo;ag+=d.agent});return {r:r,rfo:rf,agent:ag}});
  var rfoGA=slots.reduce(function(a,x){return a+x.rfo},0),agGA=slots.reduce(function(a,x){return a+x.agent},0);
  var ppl=function(role){return all.filter(function(b){return b.role===role}).length};
  var box=function(title,rowsH){return '<div class="panel perf '+(/^RFO/.test(title)?'rf':'ag')+'"><h3>'+title+'</h3>'+rowsH+'</div>'};
  var line=function(l,v,warn){return '<div class="pline"><span>'+l+'</span><b class="'+(warn&&v>0?'bad':'')+'">'+fmt(v)+'</b></div>'};
  /* targets (admin only: viewers never receive them) are columns of the leaderboard below */
  var tgtOn=slots.some(function(x){return isR?x.r.rfoT:x.r.agT}),slotBy={},tT=0,ach=function(v,t){return t?'<span class="gac '+(v/t>=cal.tg?'g':v/t>=cal.tg*.85?'a':'r')+'">'+pct(v/t)+'</span>':'–'};
  slots.forEach(function(x){slotBy[x.r.code]=x;tT+=isR?x.r.rfoT:x.r.agT});
  var nd=function(v,t){return t?Math.ceil(Math.max(0,t-v)/Math.max(1,cal.remaining)):'–'};
  var rfo=slots;
  var h='<section class="section"><div class="cols2">'+
    (isR?box('RFO Performance',line('RFO count',slots.length)+line('GA count',rfoGA)+line('Zero GA RFO',slots.filter(function(x){return x.rfo===0}).length,1)+line('&lt;10 GA RFO',slots.filter(function(x){return x.rfo<10}).length,1)+(tgtOn?line('Target',tT)+'<div class="pline"><span>Achieved</span><b>'+ach(rfoGA,tT)+'</b></div>':'')):'')+
    (!isR?box('Agent Performance',line('Agent count',slots.length)+line('GA count',agGA)+line('Zero GA Agent',slots.filter(function(x){return x.agent===0}).length,1)+line('&lt;5 GA Agent',slots.filter(function(x){return x.agent<5}).length,1)+(tgtOn?line('Target',tT)+'<div class="pline"><span>Achieved</span><b>'+ach(agGA,tT)+'</b></div>':'')):'')+
  '</div><p class="note">One RFO and one Agent per RSSP, read from the Profile Code in the raw file. A BP who changed role during the month counts under their latest role. '+ppl('RFO')+' RFOs and '+ppl('Agent')+' Agents worked this month because some RSSPs changed BP mid-month.</p></section>';
  var shown=mine;
  /* AON */
  if(S.preview||!isR){}else if(!S.staff)h+='<section class="section"><div class="sechead"><h2>Performance by AON</h2></div><div class="panel"><p class="note">Upload the <b>DH All Staff</b> report to add each RFO and Agent’s age on network (from the joining date).</p></div></section>';
  else{var bk=AON_B.map(function(x){return {l:x[0],rfo:0,ag:0,n:0,ga:0,act:0,low2:0}}).concat([{l:'Not in staff list',rfo:0,ag:0,n:0,ga:0,act:0,low2:0}]);
    mine.forEach(function(b){var x=bk[b.aon==null?AON_B.length:aonBucket(b.aon)];x.n++;if(b.role==='RFO')x.rfo++;else x.ag++;x.ga+=b.ga;x.act+=b.active;x.low2+=b.low2});
    var withA=mine.filter(function(b){return b.aon!=null}),avg=function(role){var L=withA.filter(function(b){return b.role===role});return L.length?L.reduce(function(a,b){return a+b.aon},0)/L.length:null},nj=withA.filter(function(b){return b.aon<30});
    h+='<section class="section"><div class="sechead"><h2>Performance by AON</h2><span class="note">AON = days since joining, as of today · staff list of '+dlabel(S.staff.date)+'</span></div>'+
      '<div class="kpis">'+(isR?kpi('Average AON · RFO',aonFmt(avg('RFO')==null?null:Math.round(avg('RFO'))),withA.length+' RFOs matched'):kpi('Average AON · Agent',aonFmt(avg('Agent')==null?null:Math.round(avg('Agent'))),withA.length+' Agents matched'))+kpi('New joiners',String(nj.length),'Joined in the last 30 days')+'</div>'+
      '<div class="tablebox" style="margin-top:10px"><table class="compact lb"><thead><tr><th class="name l">AON</th><th>'+(isR?'RFOs':'Agents')+'</th><th>GA MTD</th><th>GA per BP</th><th>GA per active day</th><th>Days ≥2 GA</th></tr></thead><tbody>'+
      bk.filter(function(x){return x.n}).map(function(x){return '<tr><td class="name"><b>'+x.l+'</b></td><td>'+x.n+'</td><td><b>'+fmt(x.ga)+'</b></td><td>'+(x.ga/x.n).toFixed(1)+'</td><td>'+(x.act?(x.ga/x.act).toFixed(1):'–')+'</td><td>'+(x.act?pct(x.low2/x.act):'–')+'</td></tr>'}).join('')+
      '</tbody></table></div><p class="note">Matched by the BP User ID (phone) in the raw file. GA per active day counts only the days the BP sold. Days ≥2 GA is the share of their active days with 2 or more GA.</p></section>'}
  var roles=['All','RFO','Agent'],LDb=!!lmtdDates(cal);
  /* Non performing Agents: slot Agent GA achievement under time gone (admin only, since targets are admin only) */
  if(!isR&&tgtOn){
    var npa=mine.map(function(b){var x=slotBy[b.code],t=x?x.r.agT:0,g=x?x.agent:0;return {b:b,t:t,g:g,a:t?g/t:null}}).filter(function(o){return o.t&&o.a<cal.tg}).sort(function(p,q){return p.a-q.a});
    S.npAgent={cal:cal,LDb:LDb,rows:npa.map(function(o){var b=o.b;return {name:b.name,rssp:b.rssp,aon:b.aon,ga:b.ga,t:o.t,g:o.g,a:o.a,gap:o.t-o.g,nd:nd(o.g,o.t),lm:b.lm,d5:b.daily.slice(-5)}})};
    var THL='<thead><tr><th>#</th><th class="name l">BP</th><th>AON</th><th>GA MTD</th><th>Target</th><th>Achieved</th><th>Gap</th><th>Needs / day</th>'+(LDb?'<th>LMTD</th><th>vs LMTD</th>':'')+cal.dates.slice(-5).map(function(d){return '<th class="d5">'+dlabel(d)+'</th>'}).join('')+'</tr></thead>';
    var rowL=function(o,i){var b=o.b,low=b.ga<5,gp=o.t-o.g;return '<tr class="'+(b.ga?'':'zero')+'"><td class="rank">'+(i+1)+'</td><td class="name"><b>'+esc(b.name)+'</b>'+starTag('bp',b.id)+'<small>'+(b.code?'<button class="linkbtn" data-open="'+esc(b.code)+'">'+esc(b.rssp)+'</button>':'–')+'</small></td><td>'+aonPill(b.aon,b.join)+'</td><td>'+(low?'<span class="pill crit">'+fmt(b.ga)+'</span>':'<b>'+fmt(b.ga)+'</b>')+'</td>'+
      '<td>'+fmt(o.t)+'</td><td>'+ach(o.g,o.t)+'</td><td>'+(gp>0?'<b class="gapn">'+fmt(gp)+'</b>':'<span class="gac g">+'+fmt(-gp)+'</span>')+'</td><td>'+nd(o.g,o.t)+'</td>'+(LDb?'<td>'+(b.lm?fmt(b.lm):'–')+'</td><td>'+grCell(b.ga,b.lm)+'</td>':'')+b.daily.slice(-5).map(function(v){return '<td class="d5"><span class="gac '+(v>=2?'g':v===1?'a':'r')+'">'+v+'</span></td>'}).join('')+'</tr>'};
    h+='<section class="section"><div class="sechead"><h2>Non performing Agents</h2><span class="note">'+npa.length+' of '+mine.length+' Agents behind target · achievement under time gone ('+pct(cal.tg)+') · lowest first</span>'+(npa.length?'<button class="imgbtn" type="button" id="npAgShare"><span aria-hidden="true">🖼️</span> Share as picture</button>':'')+'</div>'+
      (npa.length?'<div class="tablebox"><table class="compact lb">'+THL+'<tbody>'+npa.map(rowL).join('')+'</tbody></table></div><p class="note">Achieved = RSSP slot Agent GA ÷ month target. Green at or above time gone, yellow within 85% of it, red behind. Gap = GA still needed for the month target. Visible to admin only.</p><p class="status" id="npAgStatus"></p>':'<div class="panel"><p class="note">Every Agent is at or above time gone on target achievement.</p></div>')+'</section>';
  }
  h+='<section class="section"><div class="sechead"><h2>'+(isR?'BP leaderboard':'Agent Leaderboard')+'</h2></div>';
  var THEAD='<thead><tr><th>#</th><th class="name l">BP</th><th>AON</th><th>GA MTD</th><th>SIM Repl.</th>'+(tgtOn?'<th>Target</th><th>Achieved</th><th>Needs / day</th>':'')+(LDb?'<th>LMTD</th><th>vs LMTD</th>':'')+'<th>Days ≥2 GA</th><th>Active days</th><th>GA / day</th>'+cal.dates.slice(-5).map(function(d){return '<th class="d5">'+dlabel(d)+'</th>'}).join('')+'</tr></thead>';
  var rowH=function(b,i){var low=(b.role==='RFO'&&b.ga<10)||(b.role==='Agent'&&b.ga<5);return '<tr class="'+(b.ga?'':'zero')+'"><td class="rank">'+(i+1)+'</td><td class="name"><b>'+esc(b.name)+'</b>'+starTag('bp',b.id)+'<small>'+(b.code?'<button class="linkbtn" data-open="'+esc(b.code)+'">'+esc(b.rssp)+'</button>':'–')+'</small></td><td>'+aonPill(b.aon,b.join)+'</td><td>'+(low?'<span class="pill crit">'+fmt(b.ga)+'</span>':'<b>'+fmt(b.ga)+'</b>')+'</td><td>'+(b.rep==null?'–':fmt(b.rep))+'</td>'+(tgtOn?(function(){var x=slotBy[b.code],t=x?(isR?x.r.rfoT:x.r.agT):0,g=x?(isR?x.rfo:x.agent):0;return '<td>'+(t?fmt(t):'–')+'</td><td>'+ach(g,t)+'</td><td>'+nd(g,t)+'</td>'})():'')+(LDb?'<td>'+(b.lm?fmt(b.lm):'–')+'</td><td>'+grCell(b.ga,b.lm)+'</td>':'')+'<td><span class="pill '+(b.low2>=cal.elapsed*.75?'good':b.low2>=cal.elapsed/2?'warn':'crit')+'">'+b.low2+'</span><span class="note">/'+cal.elapsed+'</span></td><td>'+b.active+'<span class="note">/'+cal.elapsed+'</span></td><td>'+b.perDay.toFixed(1)+'</td>'+b.daily.slice(-5).map(function(v){return '<td class="d5"><span class="gac '+(v>=2?'g':v===1?'a':'r')+'">'+v+'</span></td>'}).join('')+'</tr>'};
  h+='<div class="tablebox"><table class="compact lb">'+THEAD+'<tbody>'+shown.map(rowH).join('')+
  '</tbody></table></div>'+(tgtOn?'<p class="note">Target, Achieved and Needs / day are for the RSSP slot and visible to admin only. Green = achievement at or above time gone ('+pct(cal.tg)+'), yellow = within 85% of it, red = behind. Needs / day = GA per remaining day to reach target.</p>':'')+'<p class="note">Red GA marks an RFO under 10 or an Agent under 5 GA this month. Days ≥2 GA counts days this month with 2 or more GA: green at 75% of days or more, yellow from 50%, red below half. The last 5 days show daily GA: green 2 or more, yellow 1, red 0. AON: red under 1 month, yellow under 6 months, green 6 months or more.</p></section>';
  /* Non performing RFO: RSSP slot RFO GA below 80% of its MTD target (admin only, since targets are admin only) */
  if(isR&&tgtOn){
    var np=mine.map(function(b){var x=slotBy[b.code],t=x?x.r.rfoT:0,g=x?x.rfo:0;return {b:b,t:t,g:g,a:t?g/t:null}}).filter(function(o){return o.t&&o.a<0.8}).sort(function(p,q){return p.a-q.a});
    S.npExport={cal:cal,LDb:LDb,rows:np.map(function(o){var b=o.b;return {name:b.name,rssp:b.rssp,aon:b.aon,ga:b.ga,t:o.t,g:o.g,a:o.a,nd:nd(o.g,o.t),lm:b.lm,low2:b.low2,active:b.active,perDay:b.perDay,d5:b.daily.slice(-5)}})};
    h+='<section class="section"><div class="sechead"><h2>Non performing RFO</h2><span class="note">'+np.length+' RFO'+(np.length===1?'':'s')+' below 80% of MTD GA target</span>'+(np.length?'<button class="imgbtn" type="button" id="npShare"><span aria-hidden="true">🖼️</span> Share as picture</button>':'')+'</div>'+
      (np.length?'<div class="tablebox"><table class="compact lb">'+THEAD+'<tbody>'+np.map(function(o,i){return rowH(o.b,i)}).join('')+'</tbody></table></div><p class="note">Sorted from the lowest achievement. Same columns as the BP leaderboard. The picture is 8K (7680 px wide).</p><p class="status" id="npStatus"></p>':'<div class="panel"><p class="note">Every RFO is at or above 80% of their MTD GA target.</p></div>')+'</section>';
  }
  chartJobs.push(function(){
  });
  if(!isR)h+=attSection(['Agent'],'Agent attendance sheet',{id:'attAg'});
  return h;
}


function npExportImage(kind){
  var AG=kind==='agent',E=AG?S.npAgent:S.npExport,ST=AG?'npAgStatus':'npStatus',TT=AG?'Non performing Agents':'Non performing RFO';if(!E||!E.rows.length)return;var cal=E.cal,L=E.rows.slice(0,40),d=cal.dates[cal.dates.length-1],d5=cal.dates.slice(-5);
  var W=2400,P=60,RH=118,top=300,H=top+105+L.length*RH+130,K=Math.min(7680/W,16000/H),c=document.createElement('canvas');c.width=Math.round(W*K);c.height=Math.round(H*K);var x=c.getContext('2d');x.scale(K,K);x.imageSmoothingQuality='high';
  var F="'Barlow Condensed','Segoe UI',Arial,sans-serif",B="'Source Sans 3','Segoe UI',Arial,sans-serif";
  x.fillStyle='#F4F7FA';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#E4002B');g.addColorStop(.55,'#F0447A');g.addColorStop(1,'#FFA62B');x.fillStyle=g;x.fillRect(0,0,W,14);
  var lg=document.querySelector('img.logo');if(lg&&lg.complete&&lg.naturalWidth){var lh=120,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,50,lw,lh)}
  x.fillStyle='#141C24';x.font='800 72px '+F;x.fillText(TT,P,120);
  x.fillStyle='#5A6570';x.font='500 34px '+B;x.fillText((S.area==='All'?'Chandpur Region':S.area)+' · MTD till '+dlabel(d)+' '+d.slice(0,4)+' · '+(AG?E.rows.length+' Agent'+(E.rows.length===1?'':'s')+' behind target':E.rows.length+' RFO'+(E.rows.length===1?'':'s')+' below 80% of GA target')+' · Time gone '+pct(cal.tg),P,175);
  var cols=[['AON',1],['GA\nMTD',1],['Target',1],['Achieved',1.2]];if(AG)cols.push(['Gap',1]);cols.push(['Needs\n/ day',1]);if(E.LDb)cols.push(['LMTD',1],['vs\nLMTD',1.1]);if(!AG)cols.push(['Days\n≥2 GA',1.2],['Active\ndays',1.1],['GA /\nday',1]);d5.forEach(function(dd){cols.push([dlabel(dd),.75])});
  var nameX=P+90,nameW=560,x0=nameX+nameW+20,tw=cols.reduce(function(a,c){return a+c[1]},0),uw=(W-P-20-x0)/tw,cx=[],acc=x0;cols.forEach(function(cl){cx.push(acc+cl[1]*uw/2);acc+=cl[1]*uw});
  x.fillStyle='#FFFFFF';x.strokeStyle='#DCE3EA';x.lineWidth=2;x.beginPath();if(x.roundRect)x.roundRect(P,top-56,W-2*P,115+L.length*RH,24);else x.rect(P,top-56,W-2*P,115+L.length*RH);x.fill();x.stroke();
  var ctr=function(t,cxx,y){x.textAlign='center';x.fillText(t,cxx,y);x.textAlign='left'};
  x.fillStyle='#5A6570';x.font='700 26px '+B;ctr('#',P+45,top);x.fillText('BP',nameX,top);cols.forEach(function(cl,i){var ls=cl[0].toUpperCase().split('\n');if(ls.length>1){ctr(ls[0],cx[i],top-15);ctr(ls[1],cx[i],top+15)}else ctr(ls[0],cx[i],top)});x.fillStyle='#E3E8EE';x.fillRect(P,top+30,W-2*P,3);
  var fit=function(s,w){s=String(s==null?'':s);if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s+'…'};
  var pill=function(t,cxx,y,bg,fg,fs){x.font='700 '+(fs||30)+'px '+B;var w=x.measureText(t).width+34;x.fillStyle=bg;x.beginPath();if(x.roundRect)x.roundRect(cxx-w/2,y-30,w,48,24);else x.rect(cxx-w/2,y-30,w,48);x.fill();x.fillStyle=fg;ctr(t,cxx,y+4)};
  var TONE={g:['#D7F7E8','#0E7A52'],a:['#FFF1CC','#8A5A00'],r:['#FDE2E0','#B42318']};
  L.forEach(function(r,i){var y=top+85+i*RH,k=0;if(i){x.fillStyle='#EDF1F5';x.fillRect(P+16,y-56,W-2*P-32,2)}
    x.fillStyle='#8A949E';x.font='700 32px '+B;ctr(String(i+1),P+45,y+4);
    x.fillStyle='#141C24';x.font='700 38px '+B;x.fillText(fit(r.name,nameW),nameX,y-4);x.fillStyle='#0B5FA8';x.font='600 28px '+B;x.fillText(fit(r.rssp||'–',nameW),nameX,y+34);
    var num=function(t,bold,col){x.fillStyle=col||'#141C24';x.font=(bold?'700':'500')+' 34px '+B;ctr(t,cx[k],y+6);k++};
    if(r.aon==null)num('–');else{var at=r.aon<30?'r':r.aon<182?'a':'g';pill(aonFmt(r.aon),cx[k],y,TONE[at][0],TONE[at][1],28);k++}
    if(r.ga<(AG?5:10)){pill(fmt(r.ga),cx[k],y,TONE.r[0],TONE.r[1]);k++}else num(fmt(r.ga),1);
    num(fmt(r.t));var tn=r.a>=cal.tg?'g':r.a>=cal.tg*.85?'a':'r';pill(pct(r.a),cx[k],y,TONE[tn][0],TONE[tn][1]);k++;if(AG){if(r.gap>0)num(fmt(r.gap),1,'#B42318');else{pill('+'+fmt(-r.gap),cx[k],y,TONE.g[0],TONE.g[1],28);k++}}num(String(r.nd),1);
    if(E.LDb){num(r.lm?fmt(r.lm):'–');if(r.lm==null||!r.lm)num(r.lm===0&&r.ga?'New':'–');else{var gr=r.ga/r.lm-1;num((gr>=0?'▲ ':'▼ ')+Math.abs(gr*100).toFixed(0)+'%',1,gr>=0?'#0E7A52':'#B42318')}}
    if(!AG){var dt=r.low2>=cal.elapsed*.75?'g':r.low2>=cal.elapsed/2?'a':'r';pill(r.low2+'/'+cal.elapsed,cx[k],y,TONE[dt][0],TONE[dt][1]);k++;
    num(r.active+'/'+cal.elapsed);num(r.perDay.toFixed(1));}
    r.d5.forEach(function(v){var t=v>=2?'g':v===1?'a':'r';pill(String(v),cx[k],y,TONE[t][0],TONE[t][1],28);k++})});
  x.fillStyle='#8A949E';x.font='500 28px '+B;x.fillText(AG?'Achieved = RSSP slot Agent GA vs month target. Green at or above time gone, yellow within 85% of it, red behind. Gap = GA still needed for the month target.':'Achieved = RSSP slot RFO GA vs MTD target. Green at or above time gone, yellow within 85% of it, red behind.',P,H-80);x.fillText('RSSP Business Tracker · '+location.host,P,H-40);
  setStatus(ST,'Preparing the picture…');
  c.toBlob(function(b){var name=(AG?'non-performing-agents-':'non-performing-rfo-')+d+'.png',file=new File([b],name,{type:'image/png'});
    var down=function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);setStatus(ST,'Picture downloaded.','ok')};
    if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:TT}).then(function(){setStatus(ST,'Picture shared.','ok')}).catch(function(e){if(e&&e.name==='AbortError')setStatus(ST,'Sharing cancelled.','');else down()});
    else down()},'image/png');
}
/* ---------- WiFi ---------- */
function viewWifi(rows,f,cal){
  var wifi=f.reduce(function(a,r){return a+r.wifi},0),tgt=f.reduce(function(a,r){return a+r.wifiT},0);
  var withT=f.filter(function(r){return r.wifiT}).length,active=f.filter(function(r){return r.wifi>0}).length;
  var regionW=regionTotal(cal,2),LDW=lmtdDates(cal);
  var pace=tgt?wifi/(tgt*cal.tg):null;
  var h=waButton()+'<section class="section"><div class="kpis">'+
   kpi('RSSP WiFi SIM, month to date',fmt(wifi),'Not counted in GA'+grBadge(wifi,LDW?f.reduce(function(a,r){return a+(r.lmWifi||0)},0):null))+
   (tgt?kpi('Pace vs target',pct(pace),'Target '+fmt(tgt)+' · needs '+fmt(Math.ceil(Math.max(0,tgt-wifi)/Math.max(1,cal.remaining)))+'/day'):kpi('WiFi per day',(wifi/cal.elapsed).toFixed(1),'RSSP average over '+cal.elapsed+' days'))+
   kpi('Projected month-end',fmt(wifi/cal.elapsed*cal.dim),'At '+(wifi/cal.elapsed).toFixed(1)+' a day')+
   kpi('RSSPs selling WiFi',active+'<span style="font-size:1.1rem;color:var(--muted)"> / '+f.length+'</span>',regionW?pct(wifi/regionW)+' of region WiFi ('+fmt(regionW)+')':'')+
  '</div></section>';
  var dhAll=S.meta.dh||{},hasDh=Object.keys(dhAll).length>0,lastD=cal.dates[cal.dates.length-1];
  var DT=S.canEdit&&hasDh?hqDhTargets(Object.keys(dhAll).sort()):null;if(DT&&!Object.keys(DT).length)DT=null;
  var dhs=Object.keys(dhAll).map(function(n){var X=dhAll[n],r0=0,o0=0;cal.dates.forEach(function(d){var q=X.d[d];if(q){r0+=q[0];o0+=q[1]}});var ld=(X.d[lastD]||[0,0]);return {name:n,area:normArea(X.area),n:X.n,w:[r0,o0,0,0],t:r0+o0,ld:ld[0]+ld[1],d:X.d,tg:DT&&DT[n]||null}})
    .filter(function(x){return (S.area==='All'||x.area===S.area)&&(x.t>0||x.n>=20||x.tg)}).sort(function(a,b){return b.t-a.t||a.name.localeCompare(b.name)});
  var pdh=(S.prev&&S.prev.meta&&S.prev.meta.dh)||{},dhLm=function(n){var X=pdh[n];if(!X||!X.d||!LDW)return 0;var t=0;LDW.forEach(function(d){var q=X.d[d];if(q)t+=q[0]+q[1]});return t};
  (function(){var L7=function(r){return r.daily.slice(-7).reduce(function(a,d){return a+d.wifi},0)},byW=function(a,b){return a.wifi-b.wifi||a.name.localeCompare(b.name)};
    var wal=[
      {sev:'crit',title:'Zero FWA sales MTD',why:'RSSPs with no WiFi SIM sold this month',list:f.filter(function(r){return !r.wifi}).sort(byW),val:function(r){return r.territory||r.area}},
      {sev:'warn',title:'No FWA in the last 7 days',why:'Sold WiFi earlier this month, but none in the last 7 days',list:f.filter(function(r){return r.wifi&&!L7(r)}).sort(byW),val:function(r){return fmt(r.wifi)+' MTD'}},
      {sev:'warn',title:'Below LMTD',why:'Fewer WiFi SIMs than the same days last month',list:LDW?f.filter(function(r){return (r.lmWifi||0)>r.wifi}).sort(function(a,b){return (a.wifi-a.lmWifi)-(b.wifi-b.lmWifi)}):[],val:function(r){return fmt(r.wifi)+' vs '+fmt(r.lmWifi)}},
      {sev:'info',title:'DHs with zero WiFi MTD',why:'Distribution houses with no WiFi sale from any channel',list:dhs.filter(function(x){return !x.t}).map(function(x){return {name:x.name,code:'',dh:1}}),val:function(){return ''}}];
    var nf=wal.reduce(function(a,g){return a+g.list.length},0);
    h+='<section class="section"><div class="sechead"><h2>Needs attention</h2><span class="note">'+nf+' flag'+(nf===1?'':'s')+'</span></div><div class="agroups">'+
      wal.map(function(g){return alertCard(g,g.list.map(function(r){var v=g.val(r);return r.dh?'<span class="achip">'+esc(r.name)+'</span>':'<button class="achip" data-open="'+esc(r.code)+'">'+esc(r.name)+(v?' <span>'+esc(v)+'</span>':'')+'</button>'}).join(''))}).join('')+'</div></section>';
    var Lw=cal.dates[cal.dates.length-1],T=hasDh?dhs.reduce(function(a,x){return a+x.t},0):regionW,R0=hasDh?dhs.reduce(function(a,x){return a+x.w[0]},0):wifi,lm=LDW?f.reduce(function(a,r){return a+(r.lmWifi||0)},0):null;
    var top=f.slice().sort(function(a,b){return b.wifi-a.wifi}).filter(function(r){return r.wifi}).slice(0,5);
    var t=['*WiFi (FWA) Update · '+(S.area==='All'?'Chandpur Region':S.area+' area')+'*','Data: 1 '+MON[+Lw.slice(5,7)-1]+' to '+dlabel(Lw)+' '+Lw.slice(0,4),'',
      '*RSSP WiFi MTD:* '+fmt(wifi)+(lm?' · '+(wifi>=lm?'▲ ':'▼ ')+Math.abs((wifi/lm-1)*100).toFixed(0)+'% vs LMTD':''),'*Region WiFi:* '+fmt(T)+' (RSSP '+fmt(R0)+' · DH Sale '+fmt(T-R0)+')','*RSSPs selling WiFi:* '+active+'/'+f.length,''];
    wal.forEach(function(g){if(g.list.length){t.push('⚠️ *'+g.title+' ('+g.list.length+'):*');g.list.forEach(function(r,i){var v=g.val(r);t.push((i+1)+'. '+r.name+(v?' · '+v:''))});t.push('')}});
    t.push('🏆 *Top WiFi RSSPs:*');top.forEach(function(r,i){t.push((i+1)+'. '+r.name+' · '+fmt(r.wifi))});t.push('','Dashboard: '+location.origin);S.waText=t.join('\n');
    S.imgSpec={file:'wifi-update-'+Lw,title:'WiFi (FWA) Update',sub:(S.area==='All'?'Chandpur Region':S.area+' area')+' · 1 '+MON[+Lw.slice(5,7)-1]+' to '+dlabel(Lw)+' '+Lw.slice(0,4),
      kpis:[{l:'RSSP WiFi month to date',v:fmt(wifi),s:'Not counted in GA',g:lm?(wifi>=lm?'▲ ':'▼ ')+Math.abs((wifi/lm-1)*100).toFixed(0)+'% vs LMTD':'',up:wifi>=(lm||0)},{l:'Region WiFi (RSSP + Assist)',v:fmt(T),s:'Projected '+fmt(T/cal.elapsed*cal.dim)+' by month end'},
        {l:'RSSP share',v:T?pct(R0/T):'–',s:fmt(R0)+' from RSSPs'},{l:'DH Sale',v:fmt(T-R0),s:T?pct((T-R0)/T)+' of region WiFi':''},{l:'RSSPs selling WiFi',v:active+' / '+f.length,s:(f.length-active)+' with zero this month'},{l:'WiFi per day',v:(wifi/cal.elapsed).toFixed(1),s:'RSSP average over '+cal.elapsed+' days'}],
      sections:wal.map(function(g){return {t:g.title,sev:g.sev,items:g.list.map(function(r){var v=g.val(r);return r.name+(v?'  ·  '+v:'')})}}).concat([{t:'Top WiFi RSSPs',sev:'good',items:top.map(function(r){return r.name+'  ·  '+fmt(r.wifi)+' WiFi SIM'})}])};
  })();
  if(hasDh){
    var tot=[0,0,0,0],T=0,LD=0;dhs.forEach(function(x){x.w.forEach(function(v,i){tot[i]+=v});T+=x.t;LD+=x.ld});
    var oth=T-tot[0];
    /* DH FWA targets (admin only, from the HQ Target Breakdown file) */
    var TG={fwa:0,rssp:0,dh:0};if(DT)dhs.forEach(function(x){if(x.tg){TG.fwa+=x.tg.fwa;TG.rssp+=x.tg.rssp;TG.dh+=x.tg.dh}});
    var tgHead=DT?'<th>Target</th><th>Ach.</th><th>Pace</th><th>Need / day</th>':'';
    var tgCells=function(ach,t,sub){if(!DT)return '';if(!t)return '<td>–</td><td>–</td><td>'+pacePill(null)+'</td><td>–</td>';
      return '<td>'+fmt(t)+(sub?'<small style="display:block;color:var(--muted);white-space:nowrap">'+sub+'</small>':'')+'</td><td><b>'+pct(ach/t)+'</b></td><td>'+pacePill(ach/(t*cal.tg))+'</td><td>'+fmt(Math.ceil(Math.max(0,t-ach)/Math.max(1,cal.remaining)))+'</td>'};
    h+='<section class="section"><div class="sechead"><h2>Region WiFi sales</h2><span class="note">RSSP and Assist retailers'+(S.area==='All'?' in the region':' in '+esc(S.area))+', month to date · Regular retailers left out</span></div><div class="kpis">'+
      kpi('Region WiFi SIM',fmt(T),'Last day ('+dlabel(lastD)+') '+fmt(LD))+
      kpi('Projected month-end',fmt(T/cal.elapsed*cal.dim),'At '+(T/cal.elapsed).toFixed(1)+' a day')+
      kpi('RSSP',fmt(tot[0]),(T?pct(tot[0]/T):'–')+' of region WiFi')+
      kpi('DH Sale',fmt(oth),(T?pct(oth/T):'–')+' of region WiFi')+
      (DT&&TG.fwa?kpi('FWA target (DH wise)',pct(T/TG.fwa),fmt(T)+' of '+fmt(TG.fwa)+' · pace '+pct(T/(TG.fwa*cal.tg))+' · needs '+fmt(Math.ceil(Math.max(0,TG.fwa-T)/Math.max(1,cal.remaining)))+'/day · only you see this',achTone(T/TG.fwa,cal.tg)):'')+
    '</div></section>';
    // area summary
    var areas={};dhs.forEach(function(x){var A=areas[x.area]||(areas[x.area]={w:[0,0,0,0],t:0,ld:0,dh:0,z:0,tg:0});x.w.forEach(function(v,i){A.w[i]+=v});A.t+=x.t;A.ld+=x.ld;A.dh++;if(!x.t)A.z++;if(x.tg)A.tg+=x.tg.fwa});
    var an=Object.keys(areas).sort(function(a,b){return areas[b].t-areas[a].t||a.localeCompare(b)});
    var row=function(lbl,X,extra){return '<td>'+extra+'</td><td><b>'+fmt(X.t)+'</b></td><td>'+fmt(X.w[0])+'</td><td>'+fmt(X.t-X.w[0])+'</td><td>'+(X.t?pct(X.w[0]/X.t):'–')+'</td><td>'+fmt(X.ld)+'</td><td>'+(T?pct(X.t/T):'–')+'</td>'};
    h+='<section class="section"><div class="sechead"><h2>Area WiFi summary</h2><span class="note">By channel, month to date</span></div><div class="tablebox"><table class="compact"><thead><tr><th class="name l">Area</th><th>DHs</th><th>Total</th><th>RSSP</th><th>DH Sale</th><th>RSSP share</th><th>Last day</th><th>Share of region</th>'+tgHead+'</tr></thead><tbody>'+
      an.map(function(n){var A=areas[n];return '<tr class="'+(A.t?'':'zero')+'"><td class="name">'+esc(n)+'</td>'+row(n,A,A.dh+(A.z?' <small style="display:inline;color:var(--crit)">('+A.z+' zero)</small>':''))+tgCells(A.t,A.tg)+'</tr>'}).join('')+
      (an.length>1?'<tr class="tot"><td class="name"><b>Total</b></td><td><b>'+dhs.length+'</b></td><td><b>'+fmt(T)+'</b></td><td><b>'+fmt(tot[0])+'</b></td><td><b>'+fmt(oth)+'</b></td><td><b>'+(T?pct(tot[0]/T):'–')+'</b></td><td><b>'+fmt(LD)+'</b></td><td><b>100%</b></td>'+tgCells(T,TG.fwa)+'</tr>':'')+
      '</tbody></table></div></section>';
    // DH table
    var dhSorted=DT?dhs.slice().sort(function(a,b){var x=a.tg&&a.tg.fwa?a.t/a.tg.fwa:-1,y=b.tg&&b.tg.fwa?b.t/b.tg.fwa:-1;return (y-x)||(b.t-a.t)||a.name.localeCompare(b.name)}):dhs;
    var dhOn=DT?dhs.filter(function(x){return x.tg&&x.tg.fwa&&x.t>=x.tg.fwa*cal.tg}).length:0;
    h+='<section class="section"><div class="sechead"><h2>DH wise WiFi sales</h2><span class="note">'+dhs.length+' distribution houses · '+dhs.filter(function(x){return !x.t}).length+' with zero WiFi'+(DT?' · '+dhOn+' on pace for target · targets visible to you only':'')+'</span></div><div class="tablebox"><table class="compact"><thead><tr><th class="name l">DH</th><th>Total</th>'+tgHead+(LDW?'<th>LMTD</th><th>vs LMTD</th>':'')+'<th>RSSP</th><th>DH Sale</th><th>Last day</th></tr></thead><tbody>'+
      dhSorted.map(function(x){var l7=cal.dates.slice(-7).map(function(d){var v=x.d[d]||[0,0];return v[0]+v[1]});return '<tr class="'+(x.t?'':'zero')+'"><td class="name">'+esc(x.name)+'</td><td><b>'+fmt(x.t)+'</b></td>'+tgCells(x.t,x.tg&&x.tg.fwa,x.tg?'RSSP '+fmt(x.tg.rssp)+' · DH '+fmt(x.tg.dh):'')+(LDW?'<td>'+fmt(dhLm(x.name))+'</td><td>'+grCell(x.t,dhLm(x.name))+'</td>':'')+'<td>'+fmt(x.w[0])+'</td><td>'+fmt(x.t-x.w[0])+'</td><td>'+fmt(x.ld)+'</td></tr>'}).join('')+
      (DT?'<tr class="tot"><td class="name"><b>Total</b></td><td><b>'+fmt(T)+'</b></td>'+tgCells(T,TG.fwa,'RSSP '+fmt(TG.rssp)+' · DH '+fmt(TG.dh))+(LDW?'<td><b>'+fmt(dhs.reduce(function(a,x){return a+dhLm(x.name)},0))+'</b></td><td>'+grCell(T,dhs.reduce(function(a,x){return a+dhLm(x.name)},0))+'</td>':'')+'<td><b>'+fmt(tot[0])+'</b></td><td><b>'+fmt(oth)+'</b></td><td><b>'+fmt(LD)+'</b></td></tr>':'')+
      '</tbody></table></div></section>';
  } else {
    h+='<section class="section"><div class="panel note">Re-upload today\'s raw file to see region, area and DH wise WiFi sales.</div></section>';
  }
  h+='<section class="section"><div class="sechead"><h2>Daily WiFi SIM</h2>'+(hasDh?'<div class="legend"><span><i class="sw" style="background:var(--bar-sky)"></i>RSSP</span><span><i class="sw" style="background:var(--bar-sun)"></i>DH Sale</span></div>':'')+'</div><div class="panel"><div class="chart" id="wChart"></div></div></section>';
  var list=f.slice().sort(function(a,b){var x=a.wifiT?a.wifi/a.wifiT:-1,y=b.wifiT?b.wifi/b.wifiT:-1;return (y-x)||(b.wifi-a.wifi)||a.name.localeCompare(b.name)});
  h+='<section class="section"><div class="sechead"><h2>WiFi achievement by RSSP</h2><span class="note">'+(withT?withT+' of '+f.length+' RSSPs have WiFi targets':'Sorted by WiFi sold')+'</span></div><div class="tablebox short"><table class="compact"><thead><tr><th class="name l">RSSP</th><th>WiFi MTD</th>'+(LDW?'<th>LMTD</th><th>vs LMTD</th>':'')+(withT?'<th>Target</th><th>Achievement</th><th>Pace</th><th>Need / day</th>':'')+'<th>Last 7 days</th></tr></thead><tbody>'+
   list.map(function(r){var last=r.daily.slice(-7).reduce(function(a,d){return a+d.wifi},0);return '<tr class="'+(r.wifi?'':'zero')+'"><td class="name"><button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button><small>'+esc(r.territory||r.area)+'</small></td><td><b>'+fmt(r.wifi)+'</b></td>'+(LDW?'<td>'+fmt(r.lmWifi||0)+'</td><td>'+grCell(r.wifi,r.lmWifi||0)+'</td>':'')+(withT?'<td>'+(r.wifiT?fmt(r.wifiT):'–')+'</td><td>'+(r.wifiT?pct(r.wifi/r.wifiT):'–')+'</td><td>'+pacePill(r.wifiPace)+'</td><td>'+(r.wifiDrr==null?'–':fmt(Math.ceil(r.wifiDrr)))+'</td>':'')+'<td>'+fmt(last)+'</td></tr>'}).join('')+
   '</tbody></table></div></section>';
  chartJobs.push(function(){
    var items=cal.dates.map(function(d,i){var v=0;f.forEach(function(r){v+=r.daily[i].wifi});
      if(!hasDh)return {label:String(+d.slice(8)),segs:[{v:v,cls:'bar-sky'}],tip:'<b>'+dlabel(d)+'</b><br>WiFi SIM '+fmt(v)};
      var o=0;dhs.forEach(function(x){var q=x.d[d];if(q)o+=q[1]});
      return {label:String(+d.slice(8)),segs:[{v:v,cls:'bar-sky'},{v:o,cls:'bar-sun'}],tip:'<b>'+dlabel(d)+'</b><br>Total '+fmt(v+o)+'<br>RSSP '+fmt(v)+' · DH Sale '+fmt(o)}});
    barChart($('wChart'),items,{labels:true,aria:'Daily WiFi SIM'});
  });
  return h;
}

var CHANGELOG=[
  ['2026-10-28','Supervisor','Activation and replacement: removed the Zero-GA days column'],
  ['2026-10-28','Supervisor','Needs attention: removed the stock-out risk and bike compliance cards'],
  ['2026-10-28','RSSP Detail','Agent and RFO table and Brand promoters merged: one table with contact, joining date, AON, GA, replacements and active days'],
  ['2026-10-28','Morning Brief','Weekly digest: removed the zero GA days and late check-in card and lists'],
  ['2026-10-28','Morning Brief','Weekly digest redesigned: coloured cards with week-on-week change, GA day by day against the week before, top, most improved, biggest drop and needs a push, and a SUP table'],
  ['2026-10-28','Morning Brief','Zero SIM stock RSSPs card replaces the 10 + 5 stock card'],
  ['2026-10-28','Morning Brief','Action list: removed Zero SIM stock, Checked in after 10:00 AM, No IEMB check-in and Campaigns ending soon (also left out of the WhatsApp brief)'],
  ['2026-10-28','Download','Apps and documents open the phone\'s Files app straight away; audio and video have their own picker'],
  ['2026-10-27','All tabs','Tables are shorter on screen (about 60% of the screen) and the page keeps scrolling when a table reaches its end'],
  ['2026-10-27','Morning Brief','Data status removed from the Brief; it stays in Upload & Targets'],
  ['2026-10-26','Live GA','RFO and Agent GA gap (month) columns: HQ monthly target minus GA so far this month, today included (admin). The fixed 15 target columns were removed'],
  ['2026-10-26','Live GA','New tab under Sales: upload today\'s Activation Details file any time of day for live GA by RSSP (RFO, Agent, replacement, FWA, last GA time), with an 8K picture share. It never changes the month data'],
  ['2026-10-26','WiFi','Regular retailers left out of WiFi counts: DH Sale is now Assist only, and region and DH achievement count RSSP and Assist (fills after the next raw file upload)'],
  ['2026-10-26','Upload & Targets','Removed the RSSP list and manual targets table, the add RSSP form and the score weights box'],
  ['2026-10-26','All tabs','KPI cards are coloured by meaning: red for a problem, amber to watch, green when on track or nothing is wrong, blue for plain volume'],
  ['2026-10-26','SIM Stock','Stock trend: RSSP aged column renamed RSSP SIMs over 1 year'],
  ['2026-10-26','Developer','First time visitors land on the Developer page; later visits open on Morning Brief'],
  ['2026-10-26','Developer','Developer now has its own button in the main menu, right after Resources'],
  ['2026-10-26','DCM KPI','Removed the vs target column from the KPI scorecard'],
  ['2026-10-26','Admin','ID Database tab (admin only): upload the Service ID Database each month, search across every sheet, tap a cell to copy'],
  ['2026-10-26','Overview','eSIM and replacement counts now follow the Event Type only: Activation is a sale, Replacement is a replacement, whatever the material name says (fills after the next raw file upload)'],
  ['2026-10-26','Agent','Removed the Performance by AON section from the Agent tab'],
  ['2026-10-25','Morning Brief','Action list: Zero SIM stock card (which products are at zero at each RSSP) replaces the 10 Prepaid + 5 Kit card'],
  ['2026-10-25','Bike Status','Functional bikes under 3 KM on the last working day, with chassis and a call button'],
  ['2026-10-25','Bike Status','New tab after Bike Operation: the bike wise status table with filters, sort and find'],
  ['2026-10-25','Bike Detail','Bike wise status: sorted by Area then DH with group rows, Excel style filters (Area, DH, Role, Supplier, Health), sort choice and a find box'],
  ['2026-10-25','Supervisor','RSSPs by SUP: Agent GA, RFO GA and RFO active days added; Zero-GA days, 10 Prepaid & 5 Kit and Cover risk removed'],
  ['2026-10-25','Supervisor','Removed the Team check-in by SUP, Team AON and SIM stock tables'],
  ['2026-10-25','Supervisor','RSSPs achieved target column in Target achievement: RSSPs that reached the full monthly GA target, per SUP'],
  ['2026-10-25','RFO · Agent','SIM Repl. column in the BP leaderboards: SIM replacements each BP did this month (fills after the next raw file upload)'],
  ['2026-10-25','Agent','Non performing Agents table above the BP leaderboard, with Gap and an 8K picture share, admin only'],
  ['2026-10-25','Leaderboard','Removed the Repl. and Active days columns'],
  ['2026-10-25','Leaderboard','Gap column (GA still needed for the month target) after Achieved'],
  ['2026-10-25','Leaderboard','Pace column replaced by Achieved % (GA MTD vs month target), in the leaderboard, the non performing table and its picture'],
  ['2026-10-25','Leaderboard','Non performing RSSPs table (below 100% of target pace) with an 8K picture share, admin only'],
  ['2026-10-25','SIM Stock','Removed the Area and SUP summary table'],
  ['2026-10-25','SIM Stock','Zero stock report in the stock tracker format, only RSSPs with a product at zero, shareable as an 8K picture'],
  ['2026-10-25','SIM Stock','Removed the Overstock card and the stock and days of cover table'],
  ['2026-10-25','RFO','Non performing RFO table (below 80% of MTD GA target) with an 8K picture share'],
 ['2026-10-25','WiFi','DH wise FWA targets from the HQ Target Breakdown file (Unique DH sheet): target, achievement, pace and need per day in the DH and area tables (admin only)'],
 ['2026-10-24','Leaderboard','Last 7 days bars and Score replaced by day-wise GA for the last 5 days'],
 ['2026-10-24','Faulty Bike','New tab under Bikes: open complaints, faulty but running, the register and exports (8K picture; Excel opens the share menu where the phone allows)'],
 ['2026-10-24','Bike Operation','Export the faulty bikes register as text, picture or Excel'],
 ['2026-10-24','Bike Detail','Log a bike or GPS complaint right from Bike Detail, and mark it resolved there (admin)'],
 ['2026-10-24','Site','Team PIN with a 10-minute preview for visitors (twice a day per phone, numbers only); the admin sets or changes the PIN in Upload & Targets'],
 ['2026-10-24','Admin','Visitors tab: anonymous visits, unique phones, reading time per tab, peak hours, actions, most viewed RSSPs, device, network, city and page errors'],
 ['2026-10-24','Site','Fewer storage operations: uploads update only the changed part of the data, keeping the site inside the free plan limits'],
 ['2026-10-24','Attendance','RFO attendance removed everywhere; attendance now covers Agents and RSSP Supervisors only (salary). RFO of the week is picked on numbers only'],
 ['2026-10-24','Site','Code split into smaller files (page, styles, app parts) so updates are safer and the page loads from cache faster'],
 ['2026-10-24','Morning Brief','Weekly digest (admin): week vs the week before, stars, most improved, needs a push, zero GA days and late check-ins, one tap to send on WhatsApp'],
 ['2026-10-24','Site','Jump chips on long tabs, one Share button, a quiet data date for the team, clearer Leaderboard order, bigger tap targets in tables on the phone'],
 ['2026-10-24','Admin','Data status strip: which upload is fresh and which one is stale, on Upload & Targets and Morning Brief (admin only)'],
 ['2026-10-24','Site','Slimmer header on the phone: smaller title, pickers and banner; section buttons hide while scrolling down'],
 ['2026-10-24','Field force','Target, Achieved and Needs per day moved into the RFO and Agent leaderboards (admin only), one table instead of two'],
 ['2026-10-24','Field force','RFO and Agent are now separate tabs, each with its own performance, targets, AON, leaderboard and attendance sheet'],
 ['2026-10-24','RSSP Detail','Base details trimmed: Airtel DH and distance removed; Info shared date replaces joining date'],
 ['2026-10-24','RSSP Detail','RSSP base master file: codes, location with map, shop contact, rent, territory supervisor, devices and bike, with Call and WhatsApp (admin only)'],
 ['2026-10-24','RSSP Detail','Call and WhatsApp buttons beside the Agent and RFO phone numbers (admin only)'],
 ['2026-10-24','RSSP Detail','Codes and EL numbers panel, plus the Agent and RFO of the RSSP with joining date and AON; phone numbers and EL numbers are admin-only'],
 ['2026-10-24','Site','Simpler navigation: six sections (Brief, Sales, Field force, Stock, Bikes, Resources); the team lands on Morning Brief'],
 ['2026-10-24','Stars of the week','RFO and Agent stars now need good attendance: no check-in after 10:00 AM and no missed day that week'],
 ['2026-10-24','Attendance','IEMB check-in log for Agents, RFOs and RSSP Supervisors, with after-10:00 AM flags in RFO & Agent, Supervisor, RSSP Detail and Morning Brief'],
 ['2026-10-24','Morning Brief','New tab: yesterday at a glance, top and bottom RSSPs, action list, one-tap share to WhatsApp'],
 ['2026-10-24','Stars of the week','RSSP, RFO, Agent and rider of the week, picked from the data, with a ⭐ next to their names'],
 ['2026-10-24','Month report','One-tap printable month report (PDF) with KPIs, RSSP ranking, SUP scorecard and trends (admin)'],
 ['2026-10-23','Site','Bangla version: tap বাংলা at the top right; the phone remembers the choice'],
 ['2026-10-23','Site','Smooth animations: sections slide in, numbers count up, progress bars fill, cards lift on touch'],
 ['2026-10-23','Site','Cleaner header'],
 ['2026-10-23','Developer','Team photo: Elite force of Chandpur RSSP'],
 ['2026-10-23','Download','Up to 15 photos or files in one item, e.g. all the photos of an event, with swipe-through viewer and Download all'],
 ['2026-10-23','Download','Preview pictures, PDFs, Excel sheets, audio and video before downloading; pictures, documents and media can now be added'],
 ['2026-10-23','Ongoing Campaigns','Several pictures or PDFs per campaign, with swipe-through full screen view and Download all'],
 ['2026-10-23','Ongoing Campaigns','Circulars open full screen with a Download button; ended campaigns are flagged as outdated'],
 ['2026-10-23','Developer','Change log added to this tab'],
 ['2026-10-23','Ongoing Campaigns','New tab: running, upcoming and recently ended campaigns with countdown, circulars, filters and WhatsApp share'],
 ['2026-10-23','Product Price List','New tab with quarterly versions and change markers; WhatsApp text and image match the website table'],
 ['2026-10-23','Data Bank','Month-on-month achievement history per RSSP (admin)'],
 ['2026-10-23','GA rules','EL and Easyload materials excluded from GA and replacement counts'],
 ['2026-10-23','Share image','Header restyled to dark navy'],
 ['2026-10-23','Site','Robi icon and installable app on the phone home screen'],
 ['2026-10-23','Download','New tab for work apps and files up to 500 MB'],
 ['2026-10-21','Share image','Cards no longer overlap when a view has many KPIs'],
 ['2026-10-21','DCM KPI','Seven KPI scorecard: GA, FWA, Super Bike, RFO, Agent, Gift card, RSSPs on target (admin)'],
 ['2026-10-21','Bike Detail','WhatsApp button opens WhatsApp Business'],
 ['2026-10-21','Targets','HQ RSSP-wise target file used across GA, FWA, RFO and Agent views (admin)'],
 ['2026-10-21','RFO & Agent','Age on network (AON) for Agents and RFOs from joining dates'],
 ['2026-10-21','Supervisor','New tab: SUP-wise RSSP activation, replacement, FWA, SIM stock and bike running'],
 ['2026-10-21','SIM Stock','New tab: stock tracker, 10 Prepaid + 5 Single SIM Kit rule, Zero Stock, area and SUP summary, FIFO list'],
 ['2026-10-20','Bike Detail','New tab: rider-wise daily KM and supplier view'],
 ['2026-10-20','Overview','Friday off day, Thana from territory, multi-file upload, 8K share images'],
 ['2026-10-20','Overview','Month picker, as-of day, LMTD comparison, WhatsApp share, collapsible alerts'],
 ['2026-10-20','Bike Operation','New tab: Super Bike 3 KM compliance, GPS status, faulty bike register'],
 ['2026-10-20','WiFi','Region, area and DH tables; brighter colours'],
 ['2026-10-20','Overview','Busiest hours, frozen table headers, BP roles in RSSP Detail'],
 ['2026-10-19','Overview','Burn-up chart, last-updated stamp, visit counter, needs-attention alerts'],
 ['2026-10-19','RFO & Agent','New tab: BP leaderboard with roles'],
 ['2026-10-19','Developer','Developer tab and Robi branding'],
 ['2026-10-19','WiFi','New tab: FWA sales, kept out of GA'],
 ['2026-10-19','Site','Launch: RSSP dashboard, daily upload and cloud storage']];
function viewChangelog(){var g={},ds=[];CHANGELOG.forEach(function(c){if(!g[c[0]]){g[c[0]]=[];ds.push(c[0])}g[c[0]].push(c)});
  return '<section class="section"><div class="sechead"><h2>Change log</h2><span class="note">'+CHANGELOG.length+' updates since launch on '+dlabel(ds[ds.length-1])+' '+ds[ds.length-1].slice(0,4)+'</span></div><div class="panel clog">'+
    ds.map(function(d,i){return '<div class="clday"><div class="cldate"><b>'+dlabel(d)+'</b><span>'+d.slice(0,4)+(i===0?' · latest':'')+'</span></div><ul>'+g[d].map(function(c){return '<li><span class="clarea">'+esc(c[1])+'</span>'+esc(c[2])+'</li>'}).join('')+'</ul></div>'}).join('')+'</div></section>'}
function viewDev(){
  return '<section class="section"><div class="panel devcard">'+
   '<div class="devphoto"><img src="developer.jpg" alt="Mohd Imtiaz Karim" onerror="this.remove()"><span aria-hidden="true">MIK</span></div>'+
   '<div class="devbody"><div class="eyebrow">Developer</div><h2 class="devname">Mohd Imtiaz Karim</h2><div class="devrole">Direct Channel Manager<br>Robi Axiata PLC. · Chandpur Region</div>'+
   '<p class="devbrief">Mohd Imtiaz Karim leads Robi\'s direct channel across the Chandpur Region, managing a 104 member field team and 45 Robi Sales and Service Points he built from the ground up. His region serves more than 50,000 customers a year, and he was named National Best Regional Operation Manager for Q2 2025. With a BBA in Marketing from East West University and a career spanning PepsiCo, Banglalink and Robi, he now pairs field experience with data analytics, building tools like this tracker to turn daily numbers into faster decisions.</p>'+
   '<div class="devfacts"><div><b>45</b><span>RSSPs built</span></div><div><b>104</b><span>Field team</span></div><div><b>50K+</b><span>Customers a year</span></div><div><b>Q2\'25</b><span>National Best Regional Operation Manager</span></div></div>'+
   '</div></div></section>'+
   '<section class="section"><figure class="teamfig"><button type="button" class="teamimg" id="teamImg" aria-label="View the team photo full screen"><img src="team.jpg" alt="Elite force of Chandpur RSSP: the RSSP Supervisor team with Mohd Imtiaz Karim" loading="lazy" width="1800" height="1450"></button>'+
   '<figcaption><b>Elite force of Chandpur RSSP</b><span>The core RSSP Supervisor team, working directly under the supervision of Mohd Imtiaz Karim</span></figcaption></figure></section>'+viewChangelog();
}

/* ---------- Live GA (Sales, last tab): today's GA by RSSP from a same-day Activation Details file ---------- */
var LIVE_SUP_ORDER=function(a,b){return (a.area||'').localeCompare(b.area||'')||(a.sup||'').localeCompare(b.sup||'')};
function liveTime(t){if(!t)return '–';var p=t.split(':'),h=+p[0],m=p[1]||'00';return (h%12||12)+':'+m+' '+(h<12?'AM':'PM')}
/* the RFO of the slot: today's last RFO seller, else the RFO who sold there most recently this month */
function liveRfo(code,L){
  var id=L&&L.rfoId||'',nm=L&&L.rfoName||'';
  if(!id){var B=(S.meta&&S.meta.bps)||{},best='';Object.keys(B).forEach(function(k){var b=B[k];if(b.role!=='RFO'||!b.rssp||topKey(b.rssp)!==code)return;var t=b.lastTs||'';if(t>=best){best=t;id=k;nm=rsspCleanBp(topKey(b.names||{}))}})}
  var sf=id?staffFor(id):null;return {name:nm||'–',ten:sf&&sf.j?Math.max(0,daysBetween(sf.j,dhakaToday())):null};
}
function liveRows(f){
  var LV=S.live,R=LV&&LV.rssp||{},day=LV&&LV.date||'',same=!!(S.meta&&S.meta.month&&day.slice(0,7)===S.meta.month);
  return f.map(function(r){var L=R[r.code]||{ga:0,rfo:0,ag:0,rep:0,fwa:0,last:''},rf=liveRfo(r.code,R[r.code]),mR=0,mA=0;
    /* month to date before today, from the month data, plus today's live numbers */
    if(same)(r.daily||[]).forEach(function(d){if(d.d<day){mR+=d.rfo||0;mA+=d.agent||0}});
    var rT=same&&r.rfoT?r.rfoT:null,aT=same&&r.agT?r.agT:null;
    return {code:r.code,name:r.name,area:r.area,sup:supOfDh(r.distributor),rfo:rf.name,ten:rf.ten,ga:L.ga,rg:L.rfo,ag:L.ag,rep:L.rep,fwa:L.fwa,last:L.last,
      rT:rT,aT:aT,rgap:rT==null?null:rT-(mR+L.rfo),agap:aT==null?null:aT-(mA+L.ag)}}).sort(function(a,b){return LIVE_SUP_ORDER(a,b)||b.ga-a.ga||a.name.localeCompare(b.name)});
}
function viewLive(rows,f){
  var LV=S.live,adm=S.canEdit,today=dhakaToday();
  if(!LV)return '<section class="section"><div class="sechead"><h2>Live GA</h2></div><div class="panel"><p class="note">'+(adm?'No live file yet. In Upload &amp; Targets, upload today\'s Activation Details file (only today\'s date in it). It lands here and does not change the month data.':'Today\'s live GA has not been uploaded yet.')+'</p></div></section>';
  var L=liveRows(f),T={ga:0,rg:0,ag:0,rep:0,fwa:0,rgap:null,agap:null,rT:0,aT:0};
  L.forEach(function(x){['ga','rg','ag','rep','fwa'].forEach(function(k){T[k]+=x[k]});if(x.rgap!=null){T.rgap=(T.rgap||0)+Math.max(0,x.rgap);T.rT+=x.rT}if(x.agap!=null){T.agap=(T.agap||0)+Math.max(0,x.agap);T.aT+=x.aT}});
  var n=L.length,zr=L.filter(function(x){return !x.rg}).length,zg=L.filter(function(x){return !x.ga}).length,old=LV.date!==today,hasG=adm&&(T.rgap!=null||T.agap!=null);
  var gapH=function(v,t){return v==null?'–':(v>0?'<b class="gapn">'+fmt(v)+'</b>':'<span class="gac g">'+(v<0?'+'+fmt(Math.abs(v)):'0')+'</span>')+(t?'<span class="note"> of '+fmt(t)+'</span>':'')},zp=function(v){return v?fmt(v):'<span class="gac r">0</span>'};
  S.liveExport={rows:L,T:T,n:n,zr:zr,zg:zg,date:LV.date,asOf:LV.asOf,adm:hasG};
  var h='<section class="section"><div class="sechead"><h2>Live GA · '+dlabel(LV.date)+' '+LV.date.slice(0,4)+'</h2><span class="note">Data till '+liveTime(LV.asOf)+'</span><button class="imgbtn" type="button" id="liveShare"><span aria-hidden="true">🖼️</span> Share as picture</button></div>'+
    (old?'<div class="stale">⚠ This is the live file of '+dlabel(LV.date)+'. Upload today\'s file for a fresh view.</div>':'')+
    '<div class="kpis">'+kpi('Live GA',fmt(T.ga),n+' RSSPs · '+zg+' with zero','info')+kpi('RFO GA',fmt(T.rg),zr+' RFO'+(zr===1?'':'s')+' with zero',zr?'bad':'good')+
    kpi('Agent GA',fmt(T.ag),T.ga?pct(T.ag/T.ga)+' of RSSP GA':'','info')+kpi('Replacement',fmt(T.rep),'SIM and eSIM, today','info')+kpi('FWA',fmt(T.fwa),'RSSP WiFi SIM today','info')+'</div></section>';
  h+='<section class="section"><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">Territory SUP</th><th class="name l">RSSP</th><th class="l">RFO</th><th>RFO tenure (days)</th><th>Live GA</th><th>Live RFO GA</th><th>Live Agent GA</th><th>Repl.</th><th>FWA</th><th>Last GA</th>'+(hasG?'<th>RFO GA gap (month)</th><th>Agent GA gap (month)</th>':'')+'</tr></thead><tbody>'+
    L.map(function(x){return '<tr class="'+(x.ga?'':'zero')+'"><td class="l">'+esc(x.sup)+'</td><td class="name"><button class="linkbtn" data-open="'+esc(x.code)+'">'+esc(x.name)+'</button></td><td class="l">'+esc(x.rfo)+'</td><td>'+(x.ten==null?'–':x.ten)+'</td><td><b>'+zp(x.ga)+'</b></td><td>'+zp(x.rg)+'</td><td>'+zp(x.ag)+'</td><td>'+fmt(x.rep)+'</td><td>'+fmt(x.fwa)+'</td><td>'+(x.last?liveTime(x.last):'–')+'</td>'+(hasG?'<td>'+gapH(x.rgap,x.rT)+'</td><td>'+gapH(x.agap,x.aT)+'</td>':'')+'</tr>'}).join('')+
    '<tr class="tot"><td class="l"><b>Total</b></td><td class="name"><b>'+n+' RSSPs</b></td><td></td><td></td><td><b>'+fmt(T.ga)+'</b></td><td><b>'+fmt(T.rg)+'</b></td><td><b>'+fmt(T.ag)+'</b></td><td><b>'+fmt(T.rep)+'</b></td><td><b>'+fmt(T.fwa)+'</b></td><td></td>'+(hasG?'<td><b>'+gapH(T.rgap,T.rT)+'</b></td><td><b>'+gapH(T.agap,T.aT)+'</b></td>':'')+'</tr></tbody></table></div>'+
    '<p class="note">From today\'s Activation Details file. RSSP retailers only; WiFi and Easyload SIMs are not GA. RFO and Agent are split by the Profile Code. RFO tenure comes from the DH All Staff report.'+(hasG?' Gap (month) = HQ monthly target − GA so far this month, today\'s live GA included. Green + means the month target is already passed. Visible to admin only.':'')+'</p><p class="status" id="liveStatus"></p></section>';
  return h;
}
function liveImage(){
  var E=S.liveExport;if(!E)return;var adm=E.adm,L=E.rows;
  var W=2400,P=60,RH=84,top=500,H=top+60+(L.length+1)*RH+130,K=Math.min(7680/W,16000/H),c=document.createElement('canvas');c.width=Math.round(W*K);c.height=Math.round(H*K);var x=c.getContext('2d');x.scale(K,K);x.imageSmoothingQuality='high';
  var F="'Barlow Condensed','Segoe UI',Arial,sans-serif",B="'Source Sans 3','Segoe UI',Arial,sans-serif";
  x.fillStyle='#F4F7FA';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#E4002B');g.addColorStop(.55,'#F0447A');g.addColorStop(1,'#FFA62B');x.fillStyle=g;x.fillRect(0,0,W,14);
  var lg=document.querySelector('img.logo');if(lg&&lg.complete&&lg.naturalWidth){var lh=120,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,40,lw,lh)}
  x.fillStyle='#141C24';x.font='800 72px '+F;x.fillText('Live GA Report · '+dlabel(E.date)+' '+E.date.slice(0,4),P,115);
  x.fillStyle='#5A6570';x.font='500 32px '+B;x.fillText((S.area==='All'?'Chandpur Region':S.area)+' · RSSP · data till '+liveTime(E.asOf),P,165);
  var rr=function(X,Y,w,h,r,fill,stroke){x.beginPath();if(x.roundRect)x.roundRect(X,Y,w,h,r);else x.rect(X,Y,w,h);x.fillStyle=fill;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=2;x.stroke()}};
  var TT={info:['#E6F3FF','#2E9CF4','#0B5FA8'],good:['#E0F8EE','#1DBF84','#0E7A52'],warn:['#FFF5D9','#FFB627','#8A5A00'],bad:['#FDE7E5','#E5483B','#B42318']};
  var T=E.T,cards=[['Live GA',fmt(T.ga),E.n+' RSSPs · '+E.zg+' with zero','info'],['RFO GA',fmt(T.rg),E.zr+' RFOs with zero',E.zr?'bad':'good'],['Agent GA',fmt(T.ag),T.ga?pct(T.ag/T.ga)+' of RSSP GA':'','info'],['Replacement',fmt(T.rep),'today','info'],['FWA',fmt(T.fwa),'RSSP WiFi SIM today','info']];
  var cw=(W-2*P-4*24)/5;cards.forEach(function(cd,i){var t=TT[cd[3]],X=P+i*(cw+24),Y=200;rr(X,Y,cw,200,22,t[0],t[1]+'66');x.fillStyle=t[1];x.fillRect(X+22,Y,cw-44,8);x.fillStyle=t[2];x.font='700 30px '+B;x.fillText(cd[0],X+28,Y+56);x.fillStyle='#141C24';x.font='800 70px '+F;x.fillText(cd[1],X+28,Y+130);x.fillStyle='#5A6570';x.font='500 26px '+B;x.fillText(cd[2],X+28,Y+176)});
  var cols=[['Territory SUP',300,'l'],['RSSP',330,'l'],['RFO',360,'l'],['RFO tenure',150],['Live GA',140],['Live RFO GA',160],['Live Agent GA',170],['Repl.',110],['FWA',100],['Last GA',150]];if(adm)cols.push(['RFO gap month',170],['Agent gap month',180]);
  var tw=cols.reduce(function(a,c){return a+c[1]},0),sc=(W-2*P)/tw,xs=[],acc=P;cols.forEach(function(cl){var w=cl[1]*sc;xs.push({x:acc,w:w,l:cl[2]==='l'});acc+=w});
  rr(P,top-84,W-2*P,84+(L.length+1)*RH+10,22,'#FFFFFF','#DCE3EA');
  x.fillStyle='#6B3F12';x.fillRect(P,top-84,W-2*P,84);
  var put=function(t,i,y,font,col){var c2=xs[i];x.font=font;x.fillStyle=col;if(c2.l){x.textAlign='left';x.fillText(t,c2.x+16,y)}else{x.textAlign='center';x.fillText(t,c2.x+c2.w/2,y)}x.textAlign='left'};
  var fit=function(s,w){s=String(s==null?'':s);if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s+'…'};
  cols.forEach(function(cl,i){var w=cl[0].toUpperCase().split(' ');if(w.length>1&&!xs[i].l){var cut=w.length>2?w.length-1:1;put(w.slice(0,cut).join(' '),i,top-50,'700 23px '+B,'#FFFFFF');put(w.slice(cut).join(' '),i,top-20,'700 23px '+B,'#FFFFFF')}else put(cl[0].toUpperCase(),i,top-34,'700 23px '+B,'#FFFFFF')});
  var pill=function(t,i,y,bg,fg){var c2=xs[i];x.font='700 30px '+B;var w=Math.max(x.measureText(t).width+30,56);rr(c2.x+c2.w/2-w/2,y-30,w,44,22,bg);x.fillStyle=fg;x.textAlign='center';x.fillText(t,c2.x+c2.w/2,y+3);x.textAlign='left'};
  var Z=['#FDE2E0','#B42318'];
  var gapD=function(v,k,y,f1,fb,ink){if(v==null)put('–',k,y,f1,ink);else if(v>0)put(fmt(v),k,y,fb,'#B42318');else pill(v<0?'+'+fmt(Math.abs(v)):'0',k,y,'#D7F7E8','#0E7A52')};
  var body=L.concat([{tot:1}]);
  body.forEach(function(r,i){var y=top+i*RH+RH/2+10,k=0;
    if(r.tot){x.fillStyle='#EEF2F6';x.fillRect(P+2,top+i*RH,W-2*P-4,RH)}else if(i%2){x.fillStyle='#FBFCFD';x.fillRect(P+2,top+i*RH,W-2*P-4,RH)}
    var f1='500 30px '+B,fb='700 30px '+B,ink='#141C24';
    if(r.tot){put('Total',k++,y,fb,ink);put(E.n+' RSSPs',k++,y,fb,ink);k+=2;put(fmt(T.ga),k++,y,fb,ink);put(fmt(T.rg),k++,y,fb,ink);put(fmt(T.ag),k++,y,fb,ink);put(fmt(T.rep),k++,y,fb,ink);put(fmt(T.fwa),k++,y,fb,ink);k++;if(adm){gapD(T.rgap,k++,y,f1,fb,ink);gapD(T.agap,k++,y,f1,fb,ink)}return}
    x.font=f1;put(fit(r.sup,xs[0].w-24),k++,y,f1,'#4A5561');x.font=fb;put(fit(r.name,xs[1].w-24),k++,y,fb,ink);x.font=f1;put(fit(r.rfo,xs[2].w-24),k++,y,f1,ink);put(r.ten==null?'–':String(r.ten),k++,y,f1,ink);
    [r.ga,r.rg,r.ag].forEach(function(v,j){if(v)put(fmt(v),k,y,j?f1:fb,ink);else pill('0',k,y,Z[0],Z[1]);k++});
    put(fmt(r.rep),k++,y,f1,ink);put(fmt(r.fwa),k++,y,f1,ink);put(r.last?liveTime(r.last):'–',k++,y,f1,ink);
    if(adm){gapD(r.rgap,k++,y,f1,fb,ink);gapD(r.agap,k++,y,f1,fb,ink)}});
  x.fillStyle='#8A949E';x.font='500 26px '+B;x.fillText('RSSP retailers only; WiFi and Easyload SIMs are not GA. RFO and Agent split by the Profile Code.'+(adm?' Gap (month) = HQ monthly target minus GA so far this month, today included.':''),P,H-78);x.fillText('RSSP Business Tracker · '+location.host,P,H-38);
  setStatus('liveStatus','Preparing the picture…');
  c.toBlob(function(b){var name='live-ga-'+E.date+'.png',file=new File([b],name,{type:'image/png'});
    var down=function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);setStatus('liveStatus','Picture downloaded.','ok')};
    if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Live GA'}).then(function(){setStatus('liveStatus','Picture shared.','ok')}).catch(function(e){if(e&&e.name==='AbortError')setStatus('liveStatus','Sharing cancelled.','');else down()});
    else down()},'image/png');
}
/* ---------- data status strip (admin): which file is fresh, which one is stale ---------- */
function agoText(iso){if(!iso)return '';var d=new Date(new Date(iso).getTime()+6*3600000);if(isNaN(d))return '';var dd=d.getUTCFullYear()+'-'+rsspPad(d.getUTCMonth()+1)+'-'+rsspPad(d.getUTCDate()),n=daysBetween(dd,dhakaToday()),t=(d.getUTCHours()%12||12)+':'+rsspPad(d.getUTCMinutes())+' '+(d.getUTCHours()<12?'AM':'PM');
  return 'Uploaded '+(n<=0?'today':n===1?'yesterday':n+' days ago')+', '+t}
function dataStatus(){
  var today=dhakaToday(),I=[];
  var add=function(label,date,maxAge,up,missing){I.push({l:label,d:date,max:maxAge,up:up,miss:missing})};
  add('Activation',S.meta&&S.meta.asOf,2,S.meta&&S.meta.uploadedAt,!S.meta);
  var bmu=S.bike&&S.bike.map&&S.bike.map.updatedAt;
  add('Bike status',bmu&&new Date(new Date(bmu).getTime()+6*3600000).toISOString().slice(0,10),7,bmu,!(S.bike&&S.bike.map&&S.bike.map.bikes));
  add('Distance report',S.bike&&S.bike.data&&S.bike.data.through,2,S.bike&&S.bike.data&&S.bike.data.uploadedAt,!(S.bike&&S.bike.data));
  add('SIM stock',S.stock&&S.stock.latest&&S.stock.latest.date,7,S.stock&&S.stock.latest&&S.stock.latest.uploadedAt,!(S.stock&&S.stock.latest));
  add('IEMB attendance',S.att&&S.att.to,2,S.att&&S.att.uploadedAt,!S.att);
  add('Staff list',S.staff&&S.staff.date,30,S.staff&&S.staff.uploadedAt,!S.staff);
  add('Base master file',S.base&&S.base.uploadedAt&&S.base.uploadedAt.slice(0,10),null,S.base&&S.base.uploadedAt,!S.base);
  var late=0;
  var cards=I.map(function(x){var age=x.d?daysBetween(x.d,today):null,st=x.miss?'miss':(x.max!=null&&age!=null&&age>x.max?'old':'ok');if(st==='old')late++;
    var main=x.miss?'Not uploaded':(x.max==null?agoText(x.up).replace('Uploaded ','').replace(/, .*$/,''):dlabel(x.d));
    var sub=x.miss?'':(x.max==null?'':(st==='old'?'⚠ '+age+' days old':'✓ Up to date'));
    return '<div class="dst '+st+'"><span>'+x.l+'</span><b>'+esc(main)+'</b><small>'+esc(sub)+'</small>'+(x.up&&!x.miss?'<small class="upd">'+esc(agoText(x.up))+'</small>':'')+'</div>'}).join('');
  return {late:late,html:'<div class="dstat">'+cards+'</div>'};
}
function viewSetup(rows,f,cal){
  if(!S.canEdit)return '<div class="panel empty"><h2>Only editors can upload</h2></div>';
  var DS=dataStatus(),h='<section class="section"><div class="sechead"><h2>Data status</h2><span class="note">'+(DS.late?DS.late+' file'+(DS.late>1?'s need':' needs')+' a fresh upload':'Everything is up to date')+'</span></div>'+DS.html+'</section><section class="section"><div class="sechead"><h2>Morning upload</h2><span class="note">Pick one or several files together: Activation Details (.xlsx), Bike mapping (bike-status .csv), Monthly Distance Report (.csv), SIM Stock Details (.xlsx, best from a laptop), DH All Staff report (.xlsx), IEMB Attendance Report (.xlsx), HQ RSSP-wise target file (.xlsx, month read from the file name). Each file type is detected automatically.</span></div>'+
   '<label class="drop" id="drop" for="file"><b>Drop the files here</b><span class="note">or tap to choose them. On the phone, long-press to select 2 or 3 files at once. Files are read on this device; only summaries are saved.</span><span class="btn" aria-hidden="true">Choose file</span></label><input type="file" id="file" multiple accept=".csv,.xlsx,.xls,.xlsb,.txt,text/csv,text/plain,text/comma-separated-values,text/x-csv,application/csv,application/x-csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream" hidden><div class="status" id="upStatus" role="status"></div></section>';
  /* the RSSP list, manual targets, add-RSSP form and score weights were removed; HQ target files stay listed here */
  (function(){var T=S.master.targets||{},ks=Object.keys(T).sort().reverse();if(ks.length)h+='<section class="section"><div class="panel"><p class="note"><b>HQ target files loaded:</b> '+ks.map(function(k){return esc(mlabel(k))+' ('+[T[k].rssp?Object.keys(T[k].rssp).length+' RSSPs':'',T[k].dh&&T[k].dh.rows?Object.keys(T[k].dh.rows).length+' DHs FWA':''].filter(Boolean).join(' · ')+')'}).join(', ')+'. Only you see targets.</p></div></section>'})();
  return h+gateAdminSection();
}

/* ================= Phase 2: Bike Operation ================= */
var BIKE_MIN=3;
function dhakaToday(){return new Date(Date.now()+6*3600000).toISOString().slice(0,10)}
function addDays(d,n){var t=new Date(d+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)}
function daysBetween(a,b){return Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/86400000)}
function parseCSV(text){
  var rows=[],row=[],f='',q=false,i,c;text=text.replace(/^﻿/,'');
  for(i=0;i<text.length;i++){c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'){row.push(f);rows.push(row);row=[];f=''}else if(c!=='\r')f+=c}
  if(f!==''||row.length){row.push(f);rows.push(row)}
  return rows.map(function(r){return r.map(function(x){return x.trim()})});
}
function bikeCleanUser(n){return String(n||'').replace(/\s*(RSSPDSO|RSSP DSO|BP)_[\w]+$/i,'').replace(/\s+RSSP\s*DSO$/i,'').replace(/\s+/g,' ').trim()}
/* bike_identifier mapping file */
function parseBikeMap(rows){
  var H=rows[0].map(function(h){return h.toLowerCase()}),ix=function(n){return H.indexOf(n)};
  var need=['bike_identifier','dh_name','area_name','bike_status'];need.forEach(function(n){if(ix(n)<0)throw new Error('Bike mapping file is missing the column '+n+'.')});
  var thanaI=H.findIndex(function(h){return /thana/.test(h)}),body=rows.slice(1).filter(function(r){return r[ix('bike_identifier')]});
  var codeName={};body.forEach(function(r){var n=r[ix('dh_name')];if(n&&!/^RSSP_/i.test(n))codeName[r[ix('robi_dh_code')]]=n});
  var bikes={},n=0;
  body.forEach(function(r){var g=function(k){var j=ix(k);return j<0?'':r[j]};
    if(!/^active$/i.test(g('bike_status')))return;
    var dhRaw=g('dh_name'),rssp='',dh=dhRaw;
    if(/^RSSP_/i.test(dhRaw)){rssp=dhRaw.replace(/^RSSP_/i,'').replace(/_[^_]*$/,'');dh=codeName[g('robi_dh_code')]||''}
    bikes[g('bike_identifier')]={dh:dh,dhCode:g('robi_dh_code'),rssp:rssp,area:normArea(g('area_name')),sub:g('area_name'),assigned:/^assigned$/i.test(g('assignment_status')),
      user:bikeCleanUser(g('ff_name')),phone:g('ff_phone'),desig:g('designation'),thana:thanaI>=0?r[thanaI]:''};n++});
  if(!n)throw new Error('No active bikes were found in the mapping file.');
  return {bikes:bikes,updatedAt:new Date().toISOString()};
}
/* Monthly Distance Report */
function parseBikeDistance(rows){
  var H=rows[0],vi=H.indexOf('VRN'),bi=H.indexOf('BSTID'),ui=H.indexOf('User Name'),cols=[];
  if(vi<0)throw new Error('Distance report is missing the VRN column.');
  H.forEach(function(h,i){var m=/^(\d{1,2}) ([A-Za-z]{3}) (\d{2})$/.exec(h);if(m){var mo=MON.indexOf(m[2].slice(0,1).toUpperCase()+m[2].slice(1,3).toLowerCase());if(mo>=0)cols.push({i:i,d:'20'+m[3]+'-'+(mo<9?'0':'')+(mo+1)+'-'+(m[1].length<2?'0':'')+m[1]})}});
  if(!cols.length)throw new Error('No date columns were found in the distance report.');
  var km={},names={},trk={};
  rows.slice(1).forEach(function(r){var v=r[vi];if(!v||!/^\d+$/.test(r[0]||''))return;
    var a=km[v]||(km[v]=cols.map(function(){return 0}));cols.forEach(function(c,j){var x=parseFloat(r[c.i])||0;if(x>a[j])a[j]=x});
    if(ui>=0&&r[ui])names[v]=r[ui];(trk[v]=trk[v]||[]).push(bi>=0?r[bi]:'')});
  var today=dhakaToday(),lastMove=-1;
  cols.forEach(function(c,j){if(c.d<today&&Object.keys(km).some(function(v){return km[v][j]>0}))lastMove=j});
  if(lastMove<0)throw new Error('The distance report has no completed day with movement yet.');
  var months={};
  cols.forEach(function(c,j){if(j>lastMove)return;var mk=c.d.slice(0,7),M=months[mk]||(months[mk]={month:mk,dates:[],idx:[]});M.dates.push(c.d);M.idx.push(j)});
  var now=new Date().toISOString();
  return Object.keys(months).map(function(mk){var M=months[mk],o={};Object.keys(km).forEach(function(v){o[v]=M.idx.map(function(j){return Math.round(km[v][j]*100)/100})});
    return {month:mk,dates:M.dates,through:M.dates[M.dates.length-1],km:o,names:names,trackers:trk,uploadedAt:now}});
}
/* supplier from the chassis prefix: LTWT = Walton, LR = Runner */
function bikeSupplier(id){id=String(id||'').toUpperCase();return /^LTWT/.test(id)?'Walton':/^LR/.test(id)?'Runner':'Other'}
/* Friday is the weekly off day; admin can add holidays. Off days are left out of the 3 KM rule. */
/* Thana fixes where the system Territory differs from the real Thana (by DH Robi Code) */
var DH_THANA={};
function bikeHolidays(){return (S.bike&&S.bike.faults&&S.bike.faults.holidays)||[]}
function isOffDay(d){return new Date(d+'T00:00:00Z').getUTCDay()===5||bikeHolidays().indexOf(d)>=0}
function bikeLastIdx(dates){for(var i=dates.length-1;i>=0;i--)if(!isOffDay(dates[i]))return i;return dates.length-1}
function bikeDates(){var D=S.bike.data.dates;if(S.bAsOf){var i=D.indexOf(S.bAsOf);if(i>=0)return D.slice(0,i+1)}return D}
/* compliance over the first n days of last month's bike data, same rules as this month */
function bikePrevComp(n,sup){var P=S.bike&&S.bike.prev,M=S.bike&&S.bike.map;if(!P||!P.km||!M)return null;var E=0,O=0,faults=(S.bike.faults&&S.bike.faults.list)||[];
  Object.keys(P.km).forEach(function(id){var I=M.bikes[id];if(!I||(S.area!=='All'&&I.area!==S.area)||(sup&&bikeSupplier(id)!==sup))return;var k=P.km[id].slice(0,n),fm=-1;for(var i=0;i<k.length;i++)if(k[i]>0){fm=i;break}
    k.forEach(function(v,i){if(fm>0&&i<fm)return;var d=P.dates[i];if(isOffDay(d))return;if(faults.some(function(f){return f.bike===id&&faultOpenOn(f,d)}))return;E++;if(v>=BIKE_MIN)O++})});
  return E?O/E:null}
function ptsBadge(cur,prev){if(prev==null||cur==null)return '';var g=(cur-prev)*100;return '<span class="gr '+(g>=0?'up':'down')+'">'+(g>=0?'▲ ':'▼ ')+Math.abs(g).toFixed(0)+(Math.abs(g).toFixed(0)==='1'?' pt':' pts')+' vs LMTD '+pct(prev)+'</span>'}
function faultOpenOn(f,d){return f.raised<=d&&(!f.resolved||f.resolved>d)}
function bikeRows(){
  var B=S.bike;if(!B||!B.map||!B.data)return null;
  var dates=bikeDates(),last=bikeLastIdx(dates),faults=(B.faults&&B.faults.list)||[],today=dhakaToday();
  var rs=Object.keys(B.data.km).reduce(function(o,k){o[k]=1;return o},{});
  var docsByName={},thByName={},thBP=(S.meta&&S.meta.thBP)||{},thDH=(S.meta&&S.meta.thDH)||{},thDSR=(S.meta&&S.meta.thDSR)||{};Object.keys(S.docs||{}).forEach(function(c){var d=S.docs[c];if(d&&d.name){docsByName[d.name.toLowerCase()]=d.distributor||'';var tt=terrThana(d.territory)||d.thana;if(tt)thByName[d.name.toLowerCase()]=tt}});
  return Object.keys(B.map.bikes).map(function(id){
    var I=B.map.bikes[id],km=B.data.km[id]?B.data.km[id].slice(0,dates.length):null,fl=faults.filter(function(f){return f.bike===id});
    var open=fl.filter(function(f){return f.status!=='Resolved'});
    var dh=I.dh||docsByName[(I.rssp||'').toLowerCase()]||(I.dhCode?'DH '+I.dhCode:'Unknown DH');
    var fm=-1;if(km)for(var i=0;i<km.length;i++)if(km[i]>0){fm=i;break}
    var st=dates.map(function(d,i){var v=km?km[i]:0;if(fl.some(function(f){return faultOpenOn(f,d)}))return 'fault';if(isOffDay(d))return 'off';if(!km)return 'nodata';if(fm>0&&i<fm)return 'pre';return v>=BIKE_MIN?'ok':v>0?'low':'zero'});
    var elig=0,ok=0,zero=0,low=0,tot=0,run=0;st.forEach(function(s,i){if(s==='ok'||s==='low'||s==='zero'){elig++;if(s==='ok')ok++;if(s==='zero')zero++;if(s==='low')low++;tot+=km[i];run++}});
    var zs=0;for(var k=last;k>=0;k--){if(st[k]==='off')continue;if(st[k]==='zero'||st[k]==='nodata')zs++;else break}
    var comp=elig?ok/elig:null,lk=km?km[last]:null,health;
    if(open.length)health={k:'fault',t:open[0].type==='GPS'?'GPS faulty':'Bike faulty',o:0};
    else if(!km)health={k:'crit',t:'No GPS data',o:1};
    else if(zs>=2)health={k:'crit',t:'Check GPS / bike',o:2};
    else if(comp==null)health={k:'pre',t:'Not started',o:6};
    else if(comp>=.9)health={k:'good',t:'Good',o:5};
    else if(comp>=.7)health={k:'warn',t:'Fair',o:4};
    else health={k:'poor',t:'Poor',o:3};
    var uk=thanaKey(I.user),thana=I.thana||DH_THANA[String(I.dhCode||'')]||thDH[String(I.dhCode||'')]||thByName[(I.rssp||'').toLowerCase()]||thBP[uk]||thDSR[uk]||'';
    return {id:id,phone:I.phone||'',sup:bikeSupplier(id),thana:thana,user:I.user||'Unassigned',assigned:I.assigned,desig:I.desig||'',area:I.area,sub:I.sub,dh:dh,rssp:I.rssp,
      loc:I.thana||I.rssp||B.data.names[id]||'',km:km,st:st,elig:elig,ok:ok,zero:zero,low:low,total:tot,avg:run?tot/run:0,comp:comp,lastKm:lk,lastSt:st[last],zs:zs,
      started:fm>0?dates[fm]:null,faults:fl,open:open,health:health,trackers:(B.data.trackers||{})[id]||[]};
  });
}
function bikeFiltered(rows){return S.area==='All'?rows:rows.filter(function(r){return r.area===S.area})}
function desigPill(d){var c=/agent/i.test(d)?'ag':/dso/i.test(d)?'rf':/dsr/i.test(d)?'ds':'bp';return d?'<span class="dpill '+c+'">'+esc(d)+'</span>':''}
function kmFmt(v){return v==null?'–':v>=10?String(Math.round(v)):v>0?v.toFixed(1):'0'}
/* ---------- Faulty Bike tab: open faults for everyone, the register and exports for the admin ---------- */
function viewFaulty(){
  var B=S.bike||{};
  if(!B.map||!B.data)return '<div class="panel empty"><h2>Faulty Bike needs the bike files</h2><p class="note">Upload the Bike Status and Monthly Distance Report files first.</p></div>';
  var all=bikeRows(),rows=bikeFiltered(all),dates=bikeDates(),L=bikeLastIdx(dates),lastD=dlabel(dates[L]),today=dhakaToday();
  var openF=rows.filter(function(r){return r.open.length}).sort(function(a,b){return a.open[0].raised.localeCompare(b.open[0].raised)});
  var gps=openF.filter(function(r){return r.open[0].type==='GPS'}).length,days=openF.map(function(r){return daysBetween(r.open[0].raised,today)});
  var avg=days.length?days.reduce(function(a,v){return a+v},0)/days.length:null,old=days.filter(function(v){return v>7}).length;
  var running=openF.filter(function(r){return r.lastKm!=null&&r.lastKm>=BIKE_MIN});
  var ids={};rows.forEach(function(r){ids[r.id]=1});
  var res=((B.faults&&B.faults.list)||[]).filter(function(f){return f.status==='Resolved'&&ids[f.bike]&&String(f.resolved||'').slice(0,7)===today.slice(0,7)}).length;
  var h=waButton()+'<section class="section"><div class="kpis">'+
    kpi('Faulty bikes open',fmt(openF.length),'GPS '+gps+' · Bike '+(openF.length-gps))+
    kpi('Average days open',avg==null?'–':avg.toFixed(1),old?old+' open for more than 7 days':'None older than 7 days')+
    kpi('Faulty but running',fmt(running.length),'Ran 3 KM or more on '+lastD)+
    kpi('Resolved this month',fmt(res),'Complaints closed in '+MON[+today.slice(5,7)-1])+
  '</div></section>';
  if(running.length)h+='<section class="section"><div class="sechead"><h2>Faulty but running</h2><span class="note">Marked faulty, yet ran 3 KM or more on '+lastD+'. Close the complaint, or check why it is still open</span></div><div class="panel"><div class="achips">'+
    running.map(function(r){return '<button class="achip" data-bike="'+esc(r.id)+'">'+esc(r.user)+' <span>'+kmFmt(r.lastKm)+' KM · '+(r.open[0].type==='GPS'?'GPS':'Bike')+'</span></button>'}).join('')+'</div></div></section>';
  h+=faultRegister(all);
  var t=['*Faulty bikes · '+(S.area==='All'?'Chandpur Region':S.area)+' · '+dlabel(today)+'*',openF.length+' open (GPS '+gps+', Bike '+(openF.length-gps)+')'+(avg!=null?' · average '+avg.toFixed(1)+' days open':''),''];
  openF.forEach(function(r,i){var f=r.open[0];t.push((i+1)+'. '+r.user+' ('+r.dh+') · '+(f.type==='GPS'?'GPS':'Bike')+' · '+daysBetween(f.raised,today)+' days'+(f.sr?' · SR '+f.sr:' · no SR')+(f.issue?' · '+f.issue:''))});
  t.push('','Dashboard: '+location.origin);S.waText=t.join('\n');
  S.imgSpec={file:'faulty-bikes-'+today,title:'Faulty Bikes',sub:(S.area==='All'?'Chandpur Region':S.area)+' · '+dlabel(today)+' '+today.slice(0,4),
    kpis:[{l:'Faulty bikes open',v:String(openF.length),s:'GPS '+gps+' · Bike '+(openF.length-gps)},{l:'Average days open',v:avg==null?'–':avg.toFixed(1),s:old+' over 7 days'},{l:'Faulty but running',v:String(running.length),s:'on '+lastD},{l:'Resolved this month',v:String(res),s:''}],
    sections:[{t:'Open complaints',sev:'crit',items:openF.map(function(r){var f=r.open[0];return r.user+'  ·  '+r.dh+'  ·  '+(f.type==='GPS'?'GPS':'Bike')+'  ·  '+daysBetween(f.raised,today)+' days'+(f.sr?'  ·  SR '+f.sr:'')})}]};
  return h;
}
function viewBike(){
  var B=S.bike||{},adm=S.canEdit;
  if(!B.map||!B.data){
    return '<div class="panel empty"><h2>Bike Operation needs two files</h2><p class="note">'+(B.map?'✓ Bike mapping is loaded.':'• Bike mapping (bike-status .csv) is not uploaded yet.')+'<br>'+(B.data?'✓ Distance report is loaded.':'• Monthly Distance Report (.csv) is not uploaded yet.')+'</p>'+(adm?'<button class="btn" data-goto="setup">Upload in Upload &amp; Targets</button>':'<p class="note">The owner uploads these each morning.</p>')+'</div>'+(adm?faultRegister([]):'');
  }
  var all=bikeRows(),rows=bikeFiltered(all),dates=bikeDates(),L=bikeLastIdx(dates),lastD=dlabel(dates[L]),today=dhakaToday();
  var c={ok:0,low:0,zero:0,fault:0,pre:0};rows.forEach(function(r){var k=r.lastSt==='nodata'?'zero':r.lastSt;c[k]=(c[k]||0)+1});
  var elig=c.ok+c.low+c.zero,openF=rows.filter(function(r){return r.open.length}),gpsF=openF.filter(function(r){return r.open[0].type==='GPS'}).length;
  var E=0,O=0,K=0,R=0;rows.forEach(function(r){E+=r.elig;O+=r.ok;K+=r.total;R+=r.elig});
  var h=waButton()+'<section class="section"><div class="kpis">'+
    kpi('Bikes',fmt(rows.length),rows.filter(function(r){return !r.assigned}).length+' unassigned · '+rows.filter(function(r){return r.trackers.length>1}).length+' with 2 trackers')+
    kpi('Ran ≥3 KM on '+lastD,fmt(c.ok)+'<span style="font-size:1.1rem;color:var(--muted)"> / '+elig+'</span>',elig?pct(c.ok/elig)+' compliant':'')+
    kpi('Below 3 KM on '+lastD,fmt(c.low+c.zero),'Zero KM '+fmt(c.zero)+' · under 3 KM '+fmt(c.low))+
    kpi('Faulty bikes (open)',fmt(openF.length),'GPS '+gpsF+' · Bike '+(openF.length-gpsF))+
    kpi('Compliance MTD',E?pct(O/E):'–',fmt(O)+' of '+fmt(E)+' bike days at ≥3 KM'+ptsBadge(E?O/E:null,bikePrevComp(dates.length)))+
    kpi('Avg KM per bike a day',R?(K/R).toFixed(1):'–','Total '+fmt(K)+' KM this month')+
  '</div></section>';
  var by=function(a,b){return (a.comp==null?2:a.comp)-(b.comp==null?2:b.comp)||a.user.localeCompare(b.user)};
  var al=[
    {sev:'crit',title:'New zero KM on '+lastD,why:'Moved on the previous working day, but not on '+lastD,list:rows.filter(function(r){return r.lastSt==='zero'&&r.zs===1}).sort(by),val:function(r){return r.dh}},
    {sev:'warn',title:'Below 3 KM on '+lastD,why:'Moved, but less than the mandatory 3 KM',list:rows.filter(function(r){return r.lastSt==='low'}).sort(by),val:function(r){return kmFmt(r.lastKm)+' KM'}},
    {sev:'crit',title:'Continuing zero KM · check GPS or bike',why:'Zero KM for 2 or more working days in a row, or no GPS data, and not reported faulty',list:rows.filter(function(r){return r.health.k==='crit'}).sort(function(a,b){return b.zs-a.zs}),val:function(r){return r.km?r.zs+' days in a row':'no GPS data'}},
    {sev:'warn',title:'Low compliance MTD',why:'Under 70% of days at ≥3 KM this month',list:rows.filter(function(r){return r.health.k==='poor'}).sort(by),val:function(r){return pct(r.comp)},wa:function(r){return r.ok+' of '+r.elig+' days ≥3 KM'}}
  ];
  var nflag=al.reduce(function(a,g){return a+g.list.length},0);
  h+='<section class="section"><div class="sechead"><h2>Needs attention</h2><span class="note">'+nflag+' flag'+(nflag===1?'':'s')+'</span></div><div class="agroups">'+
    al.map(function(g){return alertCard(g,g.list.map(function(r){var v=g.val(r);return '<button class="achip" data-bike="'+esc(r.id)+'">'+esc(r.user)+(v?' <span>'+esc(v)+'</span>':'')+'</button>'}).join(''))}).join('')+'</div></section>';
  (function(){var t=['*Bike Operation Update · '+(S.area==='All'?'Chandpur Region':S.area+' area')+'*','Data: '+dlabel(dates[0])+' to '+lastD+' '+dates[L].slice(0,4),'',
    '*Ran ≥3 KM on '+lastD+':* '+c.ok+'/'+elig+(elig?' ('+pct(c.ok/elig)+')':''),'*Below 3 KM:* '+(c.low+c.zero)+' (zero KM '+c.zero+')','*Compliance MTD:* '+(E?pct(O/E):'–')+' · *Avg KM/bike/day:* '+(R?(K/R).toFixed(1):'–'),'*Faulty bikes open:* '+openF.length];
    (function(){var g={};rows.forEach(function(r){var x=g[r.sup]||(g[r.sup]={n:0,E:0,O:0,f:0});x.n++;x.E+=r.elig;x.O+=r.ok;if(r.open.length)x.f++});t.push('*By supplier:* '+Object.keys(g).sort().map(function(k){var x=g[k];return k+' '+(x.E?pct(x.O/x.E):'–')+' ('+x.n+' bikes'+(x.f?', '+x.f+' faulty':'')+')'}).join(' · '),'')})();
    al.forEach(function(g){if(g.list.length){t.push('⚠️ *'+g.title+' ('+g.list.length+'):*');g.list.forEach(function(r,i){var v=g.wa?g.wa(r):g.val(r);t.push((i+1)+'. '+r.user+' · '+r.id+(v&&v!==r.dh?' · '+v:'')+' · '+r.dh)});t.push('')}});
    t.push('Dashboard: '+location.origin);S.waText=t.join('\n');
    var sg={};rows.forEach(function(r){var x=sg[r.sup]||(sg[r.sup]={n:0,E:0,O:0,f:0});x.n++;x.E+=r.elig;x.O+=r.ok;if(r.open.length)x.f++});
    var lmc=bikePrevComp(dates.length),cc=E?O/E:null;
    S.imgSpec={file:'bike-update-'+dates[L],title:'Bike Operation Update',sub:(S.area==='All'?'Chandpur Region':S.area+' area')+' · '+dlabel(dates[0])+' to '+lastD+' '+dates[L].slice(0,4)+' · 3 KM daily rule, Fridays off',
      kpis:[{l:'Ran ≥3 KM on '+lastD,v:c.ok+' / '+elig,s:elig?pct(c.ok/elig)+' compliant':''},{l:'Below 3 KM on '+lastD,v:String(c.low+c.zero),s:'Zero KM '+c.zero+' · under 3 KM '+c.low},{l:'Compliance MTD',v:pct(cc),s:fmt(O)+' of '+fmt(E)+' bike days',g:lmc!=null&&cc!=null?(cc>=lmc?'▲ ':'▼ ')+Math.abs((cc-lmc)*100).toFixed(0)+' pts vs LMTD':'',up:cc>=(lmc||0)},
        {l:'Avg KM per bike a day',v:R?(K/R).toFixed(1):'–',s:'Total '+fmt(K)+' KM'},{l:'Faulty bikes open',v:String(openF.length),s:'GPS '+gpsF+' · Bike '+(openF.length-gpsF)},{l:'By supplier',v:Object.keys(sg).sort().map(function(k){return k[0]+' '+(sg[k].E?pct(sg[k].O/sg[k].E):'–')}).join('  '),s:Object.keys(sg).sort().map(function(k){return k+' '+sg[k].n+' bikes'}).join(' · ')}],
      sections:al.map(function(g){return {t:g.title,sev:g.sev,items:g.list.map(function(r){var v=g.wa?g.wa(r):g.val(r);return r.user+'  ·  '+r.id+(v&&v!==r.dh?'  ·  '+v:'')+'  ·  '+r.dh})}})};
  })();
  h+='<section class="section"><div class="sechead"><h2>Daily bike status</h2><div class="legend"><span><i class="sw" style="background:var(--bk-ok)"></i>≥3 KM</span><span><i class="sw" style="background:var(--bk-low)"></i>Under 3 KM</span><span><i class="sw" style="background:linear-gradient(#B42318,#FDA29B)"></i>Zero KM (no movement)</span><span><i class="sw" style="background:var(--bk-fault)"></i>Faulty</span><span><i class="sw" style="background:var(--bk-off)"></i>Off day</span></div></div><div class="panel" style="display:grid;gap:10px"><div class="bstats" id="bkstats"></div><div class="note">Numbers inside bars: bikes at ≥3 KM (green) and bikes that did not move (red). Top of each bar: compliance % for the day.</div><div class="chart" id="bkChart"></div></div></section>';
  var sumTable=function(title,key,note){
    var g={};rows.forEach(function(r){var k=r[key]||(key==='thana'?'Not matched':'–'),x=g[k]||(g[k]={n:0,ok:0,low:0,zero:0,fault:0,E:0,O:0,K:0});x.n++;if(r.lastSt==='ok')x.ok++;if(r.lastSt==='low')x.low++;if(r.lastSt==='zero'||r.lastSt==='nodata')x.zero++;if(r.open.length)x.fault++;x.E+=r.elig;x.O+=r.ok;x.K+=r.total});
    var rk=key==='dh',cp=function(k){return g[k].E?g[k].O/g[k].E:0};
    var ks=Object.keys(g).sort(function(a,b){return rk?(cp(b)-cp(a)||g[b].K/Math.max(1,g[b].E)-g[a].K/Math.max(1,g[a].E)):(cp(a)-cp(b)||a.localeCompare(b))});
    var tr=function(k,x,tot,i){var cp=x.E?x.O/x.E:null;return '<tr'+(tot?' class="tot"':'')+'>'+(rk?'<td class="rank">'+(tot?'':i<0?'<span class="note">–</span>':'<span class="medal m'+(i<3?i+1:0)+'">'+(i+1)+'</span>')+'</td>':'')+'<td class="name">'+(tot?'<b>Total</b>':esc(k))+'</td><td>'+x.n+'</td><td>'+x.ok+'</td><td>'+(x.low?'<span class="pill warn">'+x.low+'</span>':'0')+'</td><td>'+(x.zero?'<span class="pill crit">'+x.zero+'</span>':'0')+'</td><td>'+(x.fault?'<span class="rpill ag">'+x.fault+'</span>':'0')+'</td><td><b class="cpc '+(cp==null?'':cp>=.9?'g':cp>=.7?'a':'r')+'">'+pct(cp)+'</b></td><td>'+(x.E?(x.K/x.E).toFixed(1):'–')+'</td></tr>'};
    var T={n:0,ok:0,low:0,zero:0,fault:0,E:0,O:0,K:0};ks.forEach(function(k){for(var q in T)T[q]+=g[k][q]});
    return '<section class="section"><div class="sechead"><h2>'+title+'</h2><span class="note">'+note+'</span></div><div class="tablebox"><table class="ctr compact"><thead><tr>'+(rk?'<th>#</th>':'')+'<th class="name l">'+(key==='area'?'Area':key==='thana'?'Thana':key==='sup'?'Supplier':'DH')+'</th><th>Bikes</th><th>≥3 KM '+lastD+'</th><th>Under 3</th><th>Zero</th><th>Faulty</th><th>Compliance MTD</th><th>Avg KM / day</th></tr></thead><tbody>'+
      (rk?(function(){var big=ks.filter(function(k){return g[k].n>=3}),small=ks.filter(function(k){return g[k].n<3});
        return big.map(function(k,i){return tr(k,g[k],0,i)}).join('')+(small.length?'<tr class="subhead"><td class="l" colspan="9" style="text-align:left;position:sticky;left:0">Fewer than 3 bikes · not ranked</td></tr>'+small.map(function(k){return tr(k,g[k],0,-1)}).join(''):'')})()
        :ks.map(function(k,i){return tr(k,g[k],0,i)}).join(''))+(ks.length>1?tr('',T,1):'')+'</tbody></table></div></section>';
  };
  h+=sumTable('Area summary','area','Latest day and month to date');
  h+=sumTable('DH bike leaderboard','dh','Best compliance first · DHs need 3 or more bikes to be ranked');
  /* supplier wise analysis */
  (function(){var SUP=['Walton','Runner'].concat(rows.some(function(r){return r.sup==='Other'})?['Other']:[]),g={};
    SUP.forEach(function(k){g[k]={n:0,E:0,O:0,K:0,ok:0,low:0,zero:0,fg:0,fb:0,full:0,never:0,zd:0,daily:dates.map(function(){return {E:0,O:0}})}});
    rows.forEach(function(r){var x=g[r.sup];if(!x)return;x.n++;x.E+=r.elig;x.O+=r.ok;x.K+=r.total;x.zd+=r.zero;
      if(r.lastSt==='ok')x.ok++;else if(r.lastSt==='low')x.low++;else if(r.lastSt==='zero'||r.lastSt==='nodata')x.zero++;
      if(r.open.length){if(r.open[0].type==='GPS')x.fg++;else x.fb++}
      if(r.elig&&r.ok===r.elig)x.full++;if(r.km&&r.total===0&&!r.open.length)x.never++;
      r.st.forEach(function(st,i){if(st==='ok'||st==='low'||st==='zero'){x.daily[i].E++;if(st==='ok')x.daily[i].O++}})});
    var card=function(k){var x=g[k],cp=x.E?x.O/x.E:null,lm=bikePrevComp(dates.length,k),last=x.ok+x.low+x.zero;
      var line=function(l,v,cls){return '<div class="pline"><span>'+l+'</span><b'+(cls?' class="'+cls+'"':'')+'>'+v+'</b></div>'};
      return '<div class="panel perf sup-'+k.toLowerCase()+'"><h3>'+k+' <span class="note">'+x.n+' bikes · chassis '+(k==='Walton'?'LTWT…':k==='Runner'?'LR…':'other')+'</span></h3>'+
        '<div class="supbig"><b>'+pct(cp)+'</b><span>compliance MTD</span>'+ptsBadge(cp,lm)+'</div>'+
        line('Ran ≥3 KM on '+lastD,x.ok+' / '+last)+line('Below 3 KM on '+lastD,x.low+x.zero,(x.low+x.zero)?'bad':'')+line('Avg KM per bike a day',x.E?(x.K/x.E).toFixed(1):'–')+
        line('Zero KM bike days',fmt(x.zd)+(x.E?' ('+pct(x.zd/x.E)+')':''))+line('Faulty open',(x.fg+x.fb)+(x.fg+x.fb?' · GPS '+x.fg+' · Bike '+x.fb:''),(x.fg+x.fb)?'bad':'')+
        line('Fault rate',x.n?pct((x.fg+x.fb)/x.n):'–')+line('100% compliant bikes',x.full)+line('No movement MTD',x.never,x.never?'bad':'')+'</div>'};
    h+='<section class="section"><div class="sechead"><h2>Supplier wise analysis</h2><span class="note">Walton vs Runner, month to date</span></div><div class="cols2">'+SUP.filter(function(k){return g[k].n}).map(card).join('')+'</div>'+
      '<div class="panel" style="margin-top:10px"><div class="legend"><span><i class="sw" style="background:#1DBF84"></i>Walton</span><span><i class="sw" style="background:#FF8A4C"></i>Runner</span><span class="note">Daily compliance: share of bikes at ≥3 KM</span></div><div class="chart" id="supChart"></div></div></section>';
    chartJobs.push(function(){var el=$('supChart');if(!el)return;var W=Math.max(260,el.clientWidth||600),H=220,pl=36,pr=10,pt=16,pb=24,iw=W-pl-pr,ih=H-pt-pb,n=dates.length;
      var X=function(i){return pl+(n<2?iw/2:iw*i/(n-1))},Y=function(v){return pt+ih-ih*v};
      var sv='<svg width="'+W+'" height="'+H+'" role="img" aria-label="Daily compliance by supplier">';
      [0,.25,.5,.75,1].forEach(function(v){sv+='<line class="grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="'+(pl-6)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+(v*100)+'%</text>'});
      var every=Math.ceil(n/(W<480?7:14));dates.forEach(function(d,i){if(i%every===0||i===n-1)sv+='<text x="'+X(i)+'" y="'+(H-6)+'" text-anchor="middle">'+(+d.slice(8))+'</text>'});
      [['Walton','#1DBF84'],['Runner','#FF8A4C']].forEach(function(c){var x=g[c[0]];if(!x||!x.n)return;var pts=x.daily.map(function(o,i){return o.E?[X(i),Y(o.O/o.E),o.O/o.E]:null}).filter(Boolean);
        sv+='<path d="'+pts.map(function(p,i){return (i?'L':'M')+p[0]+','+p[1]}).join('')+'" style="fill:none;stroke:'+c[1]+';stroke-width:2.5"/>';
        pts.forEach(function(p,i){sv+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" style="fill:'+c[1]+';stroke:#fff;stroke-width:1.5"/>';if(i===pts.length-1)sv+='<text x="'+(p[0]-6)+'" y="'+(p[1]+(c[0]==='Walton'?14:-8))+'" text-anchor="end" style="fill:'+c[1]+';font-weight:800;font-size:11px">'+pct(p[2])+'</text>'})});
      el.innerHTML=sv+'</svg>'});
  })();
  h+=sumTable('Supplier summary','sup','Walton (chassis LTWT…) vs Runner (chassis LR…) · lowest compliance first');
  /* weekly compliance by DH */
  (function(){var W=[],wk={};dates.forEach(function(d,j){var dow=new Date(d+'T00:00:00Z').getUTCDay(),st=addDays(d,-((dow+1)%7));if(!wk[st]){wk[st]={idx:[],first:d,last:d};W.push(wk[st])}wk[st].idx.push(j);wk[st].last=d});
    W.forEach(function(w,i){var full=new Date(w.last+'T00:00:00Z').getUTCDay()===5;w.lbl='W'+(i+1)+(full?'':' so far');w.rng=dlabel(w.first)+'–'+dlabel(w.last)});
    if(!W.length)return;var g={},T=W.map(function(){return {E:0,O:0}});
    rows.forEach(function(r){var x=g[r.dh]||(g[r.dh]=W.map(function(){return {E:0,O:0}}));W.forEach(function(w,wi){w.idx.forEach(function(j){var st=r.st[j];if(st==='ok'||st==='low'||st==='zero'){x[wi].E++;T[wi].E++;if(st==='ok'){x[wi].O++;T[wi].O++}}})})});
    var cell=function(o){if(!o.E)return '<td>–</td>';var c=o.O/o.E;return '<td><span class="wk '+(c>=.9?'g':c>=.7?'a':'r')+'">'+pct(c)+'</span></td>'};
    var trend=function(a){var v=a.filter(function(o){return o.E}).map(function(o){return o.O/o.E});if(v.length<2)return '<td>–</td>';var d=(v[v.length-1]-v[v.length-2])*100;return '<td><span class="gr '+(d>=0?'up':'down')+'">'+(d>=0?'▲ ':'▼ ')+Math.abs(d).toFixed(0)+' pts</span></td>'};
    h+='<section class="section"><div class="sechead"><h2>Weekly compliance by DH</h2><span class="note">Saturday to Friday weeks, Fridays excluded · trend compares the last two weeks</span></div><div class="tablebox"><table class="ctr compact"><thead><tr><th class="name l">DH</th>'+W.map(function(w){return '<th>'+w.lbl+'<small class="note">'+w.rng+'</small></th>'}).join('')+'<th>Trend</th></tr></thead><tbody>'+
      Object.keys(g).sort().map(function(k){return '<tr><td class="name">'+esc(k)+'</td>'+g[k].map(cell).join('')+trend(g[k])+'</tr>'}).join('')+
      '<tr class="tot"><td class="name"><b>Region</b></td>'+T.map(cell).join('')+trend(T)+'</tr></tbody></table></div></section>';})();
  h+='<section class="section"><div class="panel linkcard"><div><b>Bike wise status</b><span class="note">Every bike with its daily KM grid, filters by Area and DH, and a find box. Tap a bike to see its full analysis.</span></div><button class="btn" data-goto="bikestat">Open Bike Status</button></div></section>';
  h+='<section class="section"><div class="panel linkcard"><div><b>Faulty bikes</b><span class="note">'+openF.length+' open now. The faulty bike list, complaints and the register are in the Faulty Bike tab.</span></div><button class="btn" data-goto="faulty">Open Faulty Bike</button></div></section>';
  chartJobs.push(function(){
    var items=dates.map(function(d,i){var o={ok:0,low:0,zero:0,fault:0,off:0},km=0,n=0;rows.forEach(function(r){var s=r.st[i];if(s==='nodata')s='zero';if(o[s]!=null)o[s]++;if(r.km&&(s==='ok'||s==='low'||s==='zero')){km+=r.km[i];n++}});var e=o.ok+o.low+o.zero;
      if(isOffDay(d))return {label:String(+d.slice(8)),lbl:'Off',segs:[{v:o.off+o.fault,cls:'bk-off'}],tip:'<b>'+dlabel(d)+'</b><br>Friday, weekly off day. Not counted in compliance.',_c:null,_k:0};
      return {label:String(+d.slice(8)),lbl:e?pct(o.ok/e):'',segs:[{v:o.ok,cls:'bk-ok',lc:'#0B5A3B'},{v:o.low,cls:'bk-low'},{v:o.zero,cls:'gred',lc:'#FFFFFF'},{v:o.fault,cls:'bk-fault'}],tip:'<b>'+dlabel(d)+'</b><br>≥3 KM '+o.ok+' of '+e+(e?' ('+pct(o.ok/e)+')':'')+'<br>Under 3 KM '+o.low+' · Zero '+o.zero+(o.fault?'<br>Faulty '+o.fault:'')+'<br>Avg '+(n?(km/n).toFixed(1):'–')+' KM a bike',_c:e?o.ok/e:null,_k:n?km/n:0}});
    barChart($('bkChart'),items,{labels:true,h:250,aria:'Bikes by daily KM status'});
    var cs=items.filter(function(x){return x._c!=null}),best=cs.slice().sort(function(a,b){return b._c-a._c})[0],worst=cs.slice().sort(function(a,b){return a._c-b._c})[0];
    var full=rows.filter(function(r){return r.elig&&r.ok===r.elig}).length,never=rows.filter(function(r){return r.km&&r.total===0&&!r.open.length}).length;
    var bs=$('bkstats');if(bs)bs.innerHTML=[['Compliance MTD',E?pct(O/E):'–',''],['Best day',best?pct(best._c):'–',best?best.label+' '+MON[+dates[0].slice(5,7)-1]:''],['Worst day',worst?pct(worst._c):'–',worst?worst.label+' '+MON[+dates[0].slice(5,7)-1]:''],['100% compliant bikes',fmt(full),'every day ≥3 KM'],['No movement MTD',fmt(never),'0 KM all month'],['Total KM MTD',fmt(K),'']].map(function(x){return '<div class="bstat"><span>'+x[0]+'</span><b>'+x[1]+'</b>'+(x[2]?'<small>'+x[2]+'</small>':'')+'</div>'}).join('');
  });
  return h;
}
function viewBikes(){
  var B=S.bike||{},adm=S.canEdit;
  if(!B.map||!B.data)return viewBike();
  var all=bikeRows(),rows=bikeFiltered(all),dates=bikeDates(),L=bikeLastIdx(dates),lastD=dlabel(dates[L]);
  var openF=rows.filter(function(r){return r.open.length});
  var worst=rows.slice().sort(function(a,b){return a.health.o-b.health.o||(a.comp==null?2:a.comp)-(b.comp==null?2:b.comp)});
  if(!S.bikeSel||!rows.some(function(r){return r.id===S.bikeSel}))S.bikeSel=worst.length?worst[0].id:null;
  var h='<section class="section"><div class="searchbar"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/></svg><input id="bikeQ" type="search" autocomplete="off" placeholder="Search name, chassis, DH, location, Walton, Runner, poor…" value="'+esc(S.bikeQ||'')+'" aria-label="Search bikes"></div><div id="bikeQres" class="qres"></div></section>';
  h+=S.bikeSel?bikeDetail(rows.filter(function(r){return r.id===S.bikeSel})[0],dates,all,rows):'';
  S._bikeIdx=rows.map(function(r){return {id:r.id,q:[r.user,r.id,r.dh,r.loc,r.sub,r.sup,r.desig,r.thana,r.trackers.join(' '),r.health.t].join(' ').toLowerCase(),u:r.user,dh:r.dh,sup:r.sup,h:r.health}});
  h+='<section class="section"><div class="panel linkcard"><div><b>Bike Status</b><span class="note">Every bike with filters by Area, DH, Role, Supplier and Health</span></div><button class="btn" type="button" data-goto="bikestat">Open Bike Status</button></div></section>';
  return h;
}
function viewBikeStatus(){
  var B=S.bike||{},adm=S.canEdit;
  if(!B.map||!B.data)return viewBike();
  var all=bikeRows(),rows=bikeFiltered(all),dates=bikeDates(),L=bikeLastIdx(dates),lastD=dlabel(dates[L]);
  var openF=rows.filter(function(r){return r.open.length});
  var h='';
  var F=S.bikeF||'all',fl={all:rows,check:rows.filter(function(r){return !r.open.length&&(r.lastSt==='low'||r.lastSt==='zero'||r.lastSt==='nodata'||r.health.k==='crit'||r.health.k==='poor')}),fault:openF,good:rows.filter(function(r){return r.health.k==='good'})};
  /* Excel style filters (Area, DH, Role, Supplier, Health) and sort; Area then DH is the default order */
  var BF=S.bkFlt||(S.bkFlt={}),ar=function(r){return r.area||r.sub||'–'},fv={area:ar,dh:function(r){return r.dh||'–'},role:function(r){return r.desig||'–'},sup:function(r){return r.sup||'–'},health:function(r){return r.health.t}};
  var base=fl[F],pass=function(r,skip){return Object.keys(fv).every(function(k){return k===skip||!BF[k]||fv[k](r)===BF[k]})};
  var list=base.filter(function(r){return pass(r)});
  if(!S.bkSort)S.bkSort=tryLS('bkSort')||'area';var srt=S.bkSort,byH=function(a,b){return a.health.o-b.health.o||(a.comp==null?2:a.comp)-(b.comp==null?2:b.comp)};
  list.sort(srt==='health'?function(a,b){return byH(a,b)||a.user.localeCompare(b.user)}:srt==='dh'?function(a,b){return (a.dh||'').localeCompare(b.dh||'')||a.user.localeCompare(b.user)}:srt==='user'?function(a,b){return a.user.localeCompare(b.user)}:srt==='comp'?function(a,b){return (a.comp==null?2:a.comp)-(b.comp==null?2:b.comp)||a.user.localeCompare(b.user)}:function(a,b){return ar(a).localeCompare(ar(b))||(a.dh||'').localeCompare(b.dh||'')||a.user.localeCompare(b.user)});
  var fsel=function(k,lbl){var cnt={};base.filter(function(r){return pass(r,k)}).forEach(function(r){var v=fv[k](r);cnt[v]=(cnt[v]||0)+1});var vals=Object.keys(cnt).sort();if(BF[k]&&!cnt[BF[k]])vals.unshift(BF[k]);
    return '<label class="pick"><span>'+lbl+'</span><select data-bkflt="'+k+'"><option value="">All</option>'+vals.map(function(v){return '<option value="'+esc(v)+'"'+(BF[k]===v?' selected':'')+'>'+esc(v)+' ('+(cnt[v]||0)+')</option>'}).join('')+'</select></label>'};
  var nOn=Object.keys(fv).filter(function(k){return BF[k]}).length;
  var fbar='<div class="bkfilters">'+fsel('area','Area')+fsel('dh','DH')+fsel('role','Role')+fsel('sup','Supplier')+fsel('health','Health')+
    '<label class="pick"><span>Sort by</span><select id="bkSort">'+[['area','Area, then DH'],['dh','DH name'],['user','User name'],['health','Health, worst first'],['comp','Compliance, lowest first']].map(function(o){return '<option value="'+o[0]+'"'+(srt===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'+
    '<label class="pick bkfind"><span>Find in table</span><input id="bkFind" type="search" autocomplete="off" placeholder="Name, chassis, DH…" value="'+esc(S.bkFind||'')+'"></label>'+
    (nOn?'<button class="pastchip" type="button" id="bkClear">Clear '+nOn+' filter'+(nOn>1?'s':'')+'</button>':'')+'</div>'+
    '<p class="note" id="bkCount" style="margin:2px 0 8px">Showing '+list.length+' of '+base.length+' bikes</p>';
  var grpRow=function(r,i){if(srt!=='area'&&srt!=='dh')return '';var k=srt==='area'?ar(r)+'|'+(r.dh||''):(r.dh||''),pk=i?(srt==='area'?ar(list[i-1])+'|'+(list[i-1].dh||''):(list[i-1].dh||'')):null;if(k===pk)return '';var n=list.filter(function(x){return (srt==='area'?ar(x)+'|'+(x.dh||''):(x.dh||''))===k}).length;
    return '<tr class="subhead bkgrp"><td colspan="'+(6+dates.length)+'"><span style="position:sticky;left:8px">'+esc(srt==='area'?ar(r)+' · '+(r.dh||'–'):(r.dh||'–'))+' · '+n+' bike'+(n>1?'s':'')+'</span></td></tr>'};
  h+='<section class="section"><div class="sechead"><h2>Bike wise status</h2><div class="seg" role="group" aria-label="Filter bikes">'+
    [['all','All '+rows.length],['check','Needs check '+fl.check.length],['fault','Faulty '+openF.length],['good','Good '+fl.good.length]].map(function(x){return '<button data-bikef="'+x[0]+'" aria-pressed="'+(F===x[0])+'">'+x[1]+'</button>'}).join('')+'</div></div>'+
    '<div class="legend" style="margin-bottom:8px"><span><i class="sw" style="background:var(--bk-ok-t)"></i>≥3 KM</span><span><i class="sw" style="background:var(--bk-low-t)"></i>Under 3</span><span><i class="sw" style="background:#FFD5D1"></i>Zero</span><span><i class="sw" style="background:var(--bk-fault-t)"></i>Faulty</span><span><i class="sw" style="background:var(--bk-off-t)"></i>Off day</span><span><i class="sw" style="background:var(--sunk)"></i>Not started</span></div>'+
    fbar+'<div class="tablebox"><table class="bktable ctr"><thead><tr><th class="name l">User</th><th class="l">Health</th><th>'+lastD+'</th><th>Avg KM</th><th>Compliance</th><th>Zero days</th>'+dates.map(function(d){return '<th class="dcol">'+(+d.slice(8))+'</th>'}).join('')+'</tr></thead><tbody>'+
    list.map(function(r,i){return grpRow(r,i)+'<tr id="bk-'+esc(r.id)+'" data-q="'+esc([r.user,r.id,r.dh,r.loc,r.sub,r.sup,r.desig,r.thana,r.trackers.join(' '),r.health.t].join(' ').toLowerCase())+'"'+(r.id===S.bikeSel?' class="selrow"':'')+'><td class="name bkname"><button class="linkbtn bkopen" data-bikesel="'+esc(r.id)+'">'+esc(r.user)+'</button>'+starTag('rider',r.id)+'<small>'+desigPill(r.desig)+esc(r.dh)+'</small><small class="vrn"><span class="sup '+r.sup.toLowerCase()+'">'+r.sup+'</span> '+esc(r.loc?r.loc+' · ':'')+esc(r.id.slice(-6))+(r.trackers.length>1?' · 2 trackers':'')+(r.phone?' · <a class="linkbtn sm" href="tel:'+esc(r.phone.replace(/[^+\d]/g,''))+'">📞 Call</a>':'')+(adm?' · <button class="linkbtn sm" data-report="'+esc(r.id)+'">Report fault</button>':'')+'</small></td><td class="l"><span class="hpill '+r.health.k+'">'+r.health.t+'</span>'+(r.open.length&&r.open[0].sr?'<small>SR '+esc(r.open[0].sr)+'</small>':'')+(r.started?'<small>On road from '+dlabel(r.started)+'</small>':'')+'</td><td><b>'+kmFmt(r.lastKm)+'</b></td><td>'+(r.elig?r.avg.toFixed(1):'–')+'</td><td>'+pct(r.comp)+'</td><td>'+r.zero+'</td>'+
      r.st.map(function(s,i){return '<td class="hc '+s+'" title="'+dlabel(dates[i])+': '+(r.km?kmFmt(r.km[i])+' KM':'no data')+'">'+(s==='pre'||s==='nodata'?'':s==='off'?(r.km&&r.km[i]?kmFmt(r.km[i]):'Off'):s==='fault'&&!(r.km&&r.km[i])?'F':kmFmt(r.km[i]))+'</td>'}).join('')+'</tr>'}).join('')+
    '</tbody></table></div></section>';
  /* functional bikes (not reported faulty) that missed 3 KM on the last working day */
  var miss=rows.filter(function(r){return !r.open.length&&(r.lastSt==='low'||r.lastSt==='zero'||r.lastSt==='nodata')}).sort(function(a,b){return ar(a).localeCompare(ar(b))||(a.dh||'').localeCompare(b.dh||'')||(a.lastKm||0)-(b.lastKm||0)||a.user.localeCompare(b.user)});
  h+='<section class="section"><div class="sechead"><h2>Functional bikes under 3 KM on '+lastD+'</h2><span class="note">'+miss.length+' of '+rows.filter(function(r){return !r.open.length&&r.lastSt!=='pre'}).length+' running bikes · not reported faulty</span></div>'+
    (miss.length?'<div class="tablebox"><table class="compact lb"><thead><tr><th>#</th><th class="name l">User</th><th class="l">Chassis</th><th class="l">Area · DH</th><th>KM on '+lastD+'</th><th>Avg KM</th><th>Compliance</th><th>Zero days</th><th>Call</th></tr></thead><tbody>'+
      miss.map(function(r,i){return '<tr><td class="rank">'+(i+1)+'</td><td class="name"><button class="linkbtn" data-bikesel="'+esc(r.id)+'">'+esc(r.user)+'</button><small>'+desigPill(r.desig)+'<span class="sup '+r.sup.toLowerCase()+'">'+r.sup+'</span></small></td><td class="l"><b>'+esc(r.id)+'</b></td><td class="l">'+esc(ar(r))+'<small style="display:block;color:var(--muted)">'+esc(r.dh||'–')+'</small></td><td><span class="gac '+(r.lastSt==='low'?'a':'r')+'">'+(r.lastSt==='nodata'?'No data':kmFmt(r.lastKm))+'</span></td><td>'+(r.elig?r.avg.toFixed(1):'–')+'</td><td>'+pct(r.comp)+'</td><td>'+(r.zero?'<span class="gac r">'+r.zero+'</span>':'0')+'</td><td>'+(r.phone?'<a class="linkbtn sm" href="tel:'+esc(r.phone.replace(/[^+\d]/g,''))+'">📞 Call</a>':'–')+'</td></tr>'}).join('')+'</tbody></table></div><p class="note">Yellow = under 3 KM, red = zero or no GPS data. Bikes with an open complaint are left out. Tap a name for the full bike detail.</p>':
      '<div class="panel"><p class="note">Every functional bike ran 3 KM or more on '+lastD+'.</p></div>')+'</section>';
  return h;
}
function bikeDetail(r,dates,all,rows){
  var L=bikeLastIdx(dates),today=dhakaToday(),WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var opts=rows.slice().sort(function(a,b){return a.user.localeCompare(b.user)}).map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===r.id?' selected':'')+'>'+esc(x.user)+' · '+esc(x.dh)+' · '+esc(x.id.slice(-6))+'</option>'}).join('');
  var dhE=0,dhK=0,dhO=0;all.forEach(function(x){if(x.dh===r.dh){dhE+=x.elig;dhK+=x.total;dhO+=x.ok}});
  var best=-1,bi=-1,longest=0,run=0,cum=0;
  r.st.forEach(function(st,i){var v=r.km?r.km[i]:0;if(v>best){best=v;bi=i}if(st==='off')return;if(st==='zero'||st==='nodata'){run++;if(run>longest)longest=run}else run=0});
  var wk=[0,0,0,0,0,0,0],wn=[0,0,0,0,0,0,0];r.st.forEach(function(st,i){if(st==='ok'||st==='low'||st==='zero'){var w=new Date(dates[i]+'T00:00:00Z').getUTCDay();wk[w]+=r.km[i];wn[w]++}});
  var stLbl={off:['off','Off day'],ok:['good','≥3 KM'],low:['warn','Under 3 KM'],zero:['crit','Zero KM'],fault:['fault','Faulty'],pre:['pre','Not started'],nodata:['crit','No GPS data']};
  var h='<section class="section" id="bikeDetail"><div class="sechead"><h2>Bike detail</h2><span class="note">Pick a bike, or tap a name in the table below</span></div>'+
    '<label class="pick wide"><span>Bike</span><select id="selBike">'+opts+'</select></label>'+
    '<div class="facts" style="margin-top:10px"><span>User <b>'+esc(r.user)+'</b></span><span>Role <b>'+esc(r.desig||'–')+'</b></span><span>DH <b>'+esc(r.dh)+'</b></span><span>Area <b>'+esc(r.sub||r.area)+'</b></span>'+(r.loc?'<span>Location <b>'+esc(r.loc)+'</b></span>':'')+(r.thana?'<span>Thana <b>'+esc(r.thana)+'</b></span>':'')+(r.phone?'<span class="callrow"><a class="callbtn" href="tel:'+esc(r.phone.replace(/[^+\d]/g,''))+'">📞 Call '+esc(r.phone)+'</a><a class="callbtn wa" href="'+esc(waChatUrl(r.phone))+'"'+(/Android/i.test(navigator.userAgent)?'':' target="_blank" rel="noopener"')+'>WhatsApp</a></span>':'')+'<span>Supplier <span class="sup '+r.sup.toLowerCase()+'">'+r.sup+'</span></span><span>Chassis <b>'+esc(r.id)+'</b></span><span>GPS tracker <b>'+esc(r.trackers.join(', ')||'–')+'</b></span>'+(r.started?'<span>On road from <b>'+dlabel(r.started)+'</b></span>':'')+'<span>Health <span class="hpill '+r.health.k+'">'+r.health.t+'</span></span></div>'+bikeQuickFault(r)+'</section>';
  h+='<section class="section"><div class="kpis">'+
    kpi('KM this month',r.km?fmt(r.km.reduce(function(x,v){return x+v},0)):'–',r.km?r.elig+' day'+(r.elig===1?'':'s')+' count for the 3 KM rule':'No GPS data for this bike')+
    kpi('Avg KM a day',r.elig?r.avg.toFixed(1):'–',dhE?'DH average '+(dhK/dhE).toFixed(1):'')+
    kpi('Days at ≥3 KM',r.ok+'<span style="font-size:1.1rem;color:var(--muted)"> / '+r.elig+'</span>',r.elig?pct(r.comp)+' compliance · DH '+(dhE?pct(dhO/dhE):'–'):'')+
    kpi('KM on '+dlabel(dates[L]),kmFmt(r.lastKm),stLbl[r.lastSt]?stLbl[r.lastSt][1]:'')+
    kpi('Zero KM days',fmt(r.zero),'Longest run '+longest+' day'+(longest===1?'':'s')+(r.zs?' · now '+r.zs+' in a row':''))+
    kpi('Best day',best>0?kmFmt(best)+' KM':'–',best>0?dlabel(dates[bi]):'')+
  '</div></section>';
  h+='<section class="section"><div class="sechead"><h2>Daily KM</h2><div class="legend"><span><i class="sw" style="background:var(--bk-ok)"></i>≥3 KM</span><span><i class="sw" style="background:var(--bk-low)"></i>Under 3</span><span><i class="sw" style="background:#E5483B"></i>Zero</span><span><i class="sw" style="background:var(--bk-fault)"></i>Faulty</span><span><i class="sw" style="background:var(--bk-off)"></i>Off day</span></div></div><div class="panel" style="display:grid;gap:10px"><div class="chart" id="bkOne"></div>'+
    '<div class="bstats">'+[1,2,3,4,5,6,0].map(function(w){return '<div class="bstat"><span>'+WD[w]+'</span><b>'+(wn[w]?(wk[w]/wn[w]).toFixed(1):'–')+'</b><small>avg KM · '+wn[w]+' day'+(wn[w]===1?'':'s')+'</small></div>'}).join('')+'</div></div></section>';
  var rowsH=[];r.st.forEach(function(st,i){var v=r.km?r.km[i]:0;cum+=(st==='pre'||st==='nodata')?0:v;var lb=stLbl[st]||['pre',st],f=r.faults.filter(function(x){return faultOpenOn(x,dates[i])})[0];
    rowsH.push('<tr><td class="l"><b>'+dlabel(dates[i])+'</b> <span class="note">'+WD[new Date(dates[i]+'T00:00:00Z').getUTCDay()]+'</span></td><td><b>'+(st==='pre'||st==='nodata'?'–':kmFmt(v))+'</b></td><td><span class="hpill '+lb[0]+'">'+lb[1]+'</span>'+(f?'<small>'+(f.type==='GPS'?'GPS':'Bike')+' fault'+(f.sr?' · SR '+esc(f.sr):'')+'</small>':'')+'</td><td>'+fmt(cum)+'</td></tr>')});
  h+='<section class="section"><div class="sechead"><h2>Day wise</h2><span class="note">Latest day first · cumulative KM in the last column</span></div><div class="tablebox"><table class="ctr compact"><thead><tr><th class="l">Date</th><th>KM</th><th>Status</th><th>Cumulative</th></tr></thead><tbody>'+rowsH.reverse().join('')+'</tbody></table></div></section>';
  if(r.faults.length)h+='<section class="section"><div class="sechead"><h2>Fault history</h2></div><div class="tablebox"><table class="ctr compact"><thead><tr><th class="l">Type</th><th class="l">Issue</th><th>Raised</th><th>SR</th><th>Days</th><th>Status</th></tr></thead><tbody>'+
    r.faults.map(function(f){return '<tr><td class="l"><span class="hpill '+(f.type==='GPS'?'fault':'poor')+'">'+f.type+'</span></td><td class="l">'+esc(f.issue||'–')+'</td><td>'+dlabel(f.raised)+'</td><td>'+esc(f.sr||'–')+'</td><td>'+daysBetween(f.raised,f.resolved||today)+'</td><td>'+(f.status==='Resolved'?'Resolved '+dlabel(f.resolved):'<b style="color:var(--crit)">Open</b>')+'</td></tr>'}).join('')+'</tbody></table></div></section>';
  chartJobs.push(function(){var el=$('bkOne');if(!el)return;
    barChart(el,dates.map(function(d,i){var st=r.st[i],v=r.km?r.km[i]:0,cls=st==='ok'?'bk-ok':st==='low'?'bk-low':st==='fault'?'bk-fault':st==='off'?'bk-off':'gred';
      return {label:String(+d.slice(8)),segs:[{v:(st==='pre'||st==='nodata')?0:v,cls:cls}],lbl:st==='pre'?'':st==='nodata'?'–':st==='off'&&!v?'Off':st==='fault'&&!v?'F':kmFmt(v),lblc:st==='zero'?'#B42318':null,tip:'<b>'+dlabel(d)+'</b><br>'+(st==='pre'?'Not on the road yet':st==='nodata'?'No GPS data':kmFmt(v)+' KM · '+(stLbl[st]||['',''])[1])}}),{labels:true,h:230,ref:{v:BIKE_MIN,label:'3 KM'},aria:'Daily KM for this bike'})});
  return h;
}
function faultRegister(all){
  if(!S.canEdit)return '';
  var B=S.bike||{},list=((B.faults&&B.faults.list)||[]).slice(),adm=S.canEdit,today=dhakaToday();
  var byId={};(all||[]).forEach(function(r){byId[r.id]=r});
  var mapB=(B.map&&B.map.bikes)||{};
  var who=function(id){var r=byId[id]||mapB[id]||{};return {u:r.user||bikeCleanUser(r.user)||id,dh:r.dh||''}};
  list.sort(function(a,b){return (a.status==='Resolved')-(b.status==='Resolved')||a.raised.localeCompare(b.raised)});
  var vis=list.filter(function(f){var r=byId[f.bike];return S.area==='All'||!r||r.area===S.area});
  S.faultExport=vis.map(function(f){var r=byId[f.bike]||{},m=mapB[f.bike]||{},w=who(f.bike),end=f.resolved||today;return {user:w.u,dh:w.dh||r.dh||'',area:r.sub||r.area||'',role:r.desig||m.desig||'',bike:f.bike,sup:r.sup||'',type:f.type==='GPS'?'GPS':'Bike',issue:f.issue||'',raised:f.raised,sr:f.sr||'',status:f.status==='Resolved'?'Resolved':'Open',resolved:f.resolved||'',days:daysBetween(f.raised,end)}});
  var h='<section class="section" id="faultReg"><div class="sechead"><h2>Faulty bikes register</h2><span class="note">'+vis.filter(function(f){return f.status!=='Resolved'}).length+' open · '+vis.filter(function(f){return f.status==='Resolved'}).length+' resolved</span>'+
    (vis.length?'<details class="sharemenu fexp"><summary class="imgbtn">⤓ Export ▾</summary><div class="sharepop"><button class="imgbtn" type="button" data-fexp="text">📝 As text (WhatsApp or copy)</button><button class="imgbtn" type="button" data-fexp="img">🖼️ As picture</button><button class="imgbtn" type="button" data-fexp="xlsx">📊 As Excel file</button></div></details>':'')+'</div>';
  if(adm){
    var E=S.faultEdit?list.filter(function(f){return f.id===S.faultEdit})[0]:null;if(!E)S.faultEdit=null;
    var hol=bikeHolidays().slice().sort();
    var opts=Object.keys(mapB).map(function(id){var w=who(id);return {id:id,t:w.u+' · '+(byId[id]?byId[id].dh:'')+' · '+id.slice(-6)}}).sort(function(a,b){return a.t.localeCompare(b.t)});
    var selB=E?E.bike:S.faultBike;
    h+='<div class="panel'+(E?' editing':'')+'" style="display:grid;gap:8px;margin-bottom:10px"><b>'+(E?'Edit fault for '+esc(who(E.bike).u):'Report a faulty bike')+'</b><div class="faultform">'+
      '<select id="fBike" aria-label="Bike"'+(E?' disabled':'')+'><option value="">Choose bike</option>'+opts.map(function(o){return '<option value="'+esc(o.id)+'"'+(selB===o.id?' selected':'')+'>'+esc(o.t)+'</option>'}).join('')+'</select>'+
      '<select id="fType" aria-label="Fault type"><option value="Bike"'+(E&&E.type==='Bike'?' selected':'')+'>Bike faulty</option><option value="GPS"'+(E&&E.type==='GPS'?' selected':'')+'>GPS faulty</option></select>'+
      '<input id="fIssue" placeholder="Issue, e.g. engine not starting" aria-label="Issue" value="'+esc(E?E.issue:'')+'">'+
      '<label class="flab">Raised on<input id="fRaised" type="date" value="'+(E?E.raised:today)+'" aria-label="Issue raised on"></label>'+
      '<input id="fSr" placeholder="SR number" aria-label="SR number" value="'+esc(E?E.sr:'')+'">'+
      (E&&E.status==='Resolved'?'<label class="flab">Resolved on<input id="fResolved" type="date" value="'+E.resolved+'"></label>':'')+
      '<button class="btn" id="fAdd">'+(E?'Save changes':'Add to register')+'</button>'+(E?'<button class="btn ghost" id="fCancel">Cancel</button>':'')+'</div><div class="status" id="fStatus" role="status"></div></div>';
  }
  if(!vis.length)return h+'<div class="panel note">No faulty bikes reported'+(adm?' yet. Use the form above when a bike or its GPS fails.':'.')+'</div></section>';
  h+='<div class="tablebox"><table><thead><tr><th class="name l">Bike user</th><th class="l">Type</th><th class="l">Issue</th><th class="l">Raised</th><th class="l">SR number</th><th>Days open</th><th class="l">Status</th>'+(adm?'<th></th>':'')+'</tr></thead><tbody>'+
    vis.map(function(f){var w=who(f.bike),end=f.resolved||today,dOpen=daysBetween(f.raised,end);
      return '<tr class="'+(f.status==='Resolved'?'zero':'')+'"><td class="name"><b>'+esc(w.u)+'</b><small>'+esc(w.dh)+'</small><small class="vrn">'+esc(f.bike)+'</small></td><td class="l"><span class="hpill '+(f.type==='GPS'?'fault':'poor')+'">'+(f.type==='GPS'?'GPS':'Bike')+'</span></td><td class="l">'+esc(f.issue||'–')+'</td><td class="l">'+dlabel(f.raised)+'</td><td class="l"><b>'+esc(f.sr||'–')+'</b></td><td>'+(f.status==='Resolved'?dOpen:'<span class="pill '+(dOpen>7?'crit':dOpen>3?'warn':'none')+'">'+dOpen+'</span>')+'</td><td class="l">'+(f.status==='Resolved'?'Resolved '+dlabel(f.resolved):'<b style="color:var(--crit)">Open</b>')+'</td>'+
      (adm?'<td class="l factions">'+(f.status!=='Resolved'?'<span class="resgrp"><input type="date" class="fresd" id="rd-'+esc(f.id)+'" value="'+today+'" min="'+f.raised+'" max="'+today+'" aria-label="Resolved on"><button class="btn ghost sm" data-fres="'+esc(f.id)+'">Resolved</button></span> ':'')+'<button class="btn ghost sm" data-fedit="'+esc(f.id)+'">Edit</button> <button class="btn ghost sm" data-fdel="'+esc(f.id)+'">Delete</button></td>':'')+'</tr>'}).join('')+'</tbody></table></div></section>';
  return h;
}
function saveHolidays(h,msg){
  var data={list:((S.bike.faults&&S.bike.faults.list)||[]),holidays:h,updatedAt:new Date().toISOString()};
  setStatus('fStatus','Saving…');
  return apiSave({kind:'bikefaults',data:data}).then(function(){S.bike.faults=data;render();setStatus('fStatus',msg,'ok')}).catch(function(e){setStatus('fStatus','Could not save: '+(e&&e.message||e),'err')});
}
function saveFaults(list,msg){
  var data={list:list,holidays:bikeHolidays(),updatedAt:new Date().toISOString()};
  setStatus('fStatus','Saving…');
  return apiSave({kind:'bikefaults',data:data}).then(function(){S.bike.faults=data;render();setStatus('fStatus',msg,'ok')}).catch(function(e){setStatus('fStatus','Could not save: '+(e&&e.message||e),'err')});
}
/* Bike Detail: log a complaint for this bike on the spot (admin), straight into the faulty bikes register */
function bikeQuickFault(r){
  if(!S.canEdit)return '';
  var L=((S.bike&&S.bike.faults&&S.bike.faults.list)||[]),open=L.filter(function(f){return f.bike===r.id&&f.status!=='Resolved'})[0],today=dhakaToday();
  if(open)return '<div class="qfault open"><div><b>Open '+(open.type==='GPS'?'GPS':'bike')+' complaint</b> since '+dlabel(open.raised)+(open.sr?' · SR '+esc(open.sr):'')+(open.issue?'<br><span class="note">'+esc(open.issue)+'</span>':'')+'</div>'+
    '<div class="qrow"><input type="date" id="qResD" value="'+today+'" min="'+open.raised+'" max="'+today+'" aria-label="Resolved on"><button class="btn ghost sm" type="button" data-qres="'+esc(open.id)+'">Mark resolved</button></div><div class="status" id="qStatus" role="status"></div></div>';
  if(!S.qFaultOpen)return '<div class="qfault"><button class="btn sm" type="button" id="qOpen">⚠ Log a complaint for this bike</button><div class="status" id="qStatus" role="status"></div></div>';
  return '<div class="qfault form"><b>Log a complaint for '+esc(r.user)+'</b>'+
    '<div class="qgrid"><select id="qType" aria-label="Complaint type"><option value="Bike">Bike faulty</option><option value="GPS">GPS faulty</option></select>'+
    '<input id="qIssue" placeholder="Issue, e.g. engine not starting" aria-label="Issue">'+
    '<label class="flab">Raised on<input id="qRaised" type="date" value="'+today+'" max="'+today+'"></label>'+
    '<input id="qSr" placeholder="SR number (optional)" aria-label="SR number"></div>'+
    '<div class="qrow"><button class="btn" type="button" id="qSave" data-bike="'+esc(r.id)+'">Save complaint</button><button class="btn ghost" type="button" id="qCancel">Cancel</button></div><div class="status" id="qStatus" role="status"></div></div>';
}
/* Faulty bikes register: export as text, picture or Excel (what is on screen, area filter applied) */
function faultExportText(){var L=S.faultExport||[],op=L.filter(function(x){return x.status==='Open'}).sort(function(a,b){return b.days-a.days}),rs=L.filter(function(x){return x.status==='Resolved'}),d=dhakaToday();
  var t=['*Faulty bikes register · '+dlabel(d)+' '+d.slice(0,4)+'*',(S.area==='All'?'Chandpur Region':S.area)+' · '+op.length+' open · '+rs.length+' resolved',''];
  if(op.length){t.push('*Open*');op.forEach(function(x,i){t.push((i+1)+'. '+x.user+(x.dh?' ('+x.dh+')':'')+'\n    Chassis '+x.bike+'\n    '+x.type+' · since '+dlabel(x.raised)+', '+x.days+' day'+(x.days===1?'':'s')+(x.sr?' · SR '+x.sr:' · no SR yet')+(x.issue?'\n    '+x.issue:''))})}
  if(rs.length){t.push('','*Resolved*');rs.slice(-10).forEach(function(x,i){t.push((i+1)+'. '+x.user+(x.dh?' ('+x.dh+')':'')+' · Chassis '+x.bike+' · '+x.type+' · '+dlabel(x.raised)+' to '+dlabel(x.resolved)+' ('+x.days+' days)'+(x.sr?' · SR '+x.sr:''))})}
  t.push('','Dashboard: '+location.origin);return t.join('\n')}
function faultExportImage(){
  var L=(S.faultExport||[]).slice().sort(function(a,b){return (a.status==='Resolved')-(b.status==='Resolved')||b.days-a.days}).slice(0,40),d=dhakaToday();
  var W=1600,P=60,RH=150,top=260,H=top+110+L.length*RH+120,K=7680/W,c=document.createElement('canvas');c.width=Math.round(W*K);c.height=Math.round(H*K);var x=c.getContext('2d');x.scale(K,K);x.imageSmoothingQuality='high';var F="'Barlow Condensed','Segoe UI',Arial,sans-serif",B="'Source Sans 3','Segoe UI',Arial,sans-serif";
  x.fillStyle='#F4F7FA';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#E4002B');g.addColorStop(.55,'#F0447A');g.addColorStop(1,'#FFA62B');x.fillStyle=g;x.fillRect(0,0,W,14);
  var lg=document.querySelector('img.logo');if(lg&&lg.complete&&lg.naturalWidth){var lh=110,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,48,lw,lh)}
  var op=L.filter(function(r){return r.status==='Open'}).length;
  x.fillStyle='#141C24';x.font='800 64px '+F;x.fillText('Faulty bikes register',P,110);x.fillStyle='#5A6570';x.font='500 32px '+B;x.fillText((S.area==='All'?'Chandpur Region':S.area)+' · '+dlabel(d)+' '+d.slice(0,4)+' · '+op+' open · '+(L.length-op)+' resolved',P,160);
  var cols=[['Bike user',P+20],['Type',P+600],['Raised',P+760],['SR number',P+950],['Days',P+1180],['Status',P+1310]];
  x.fillStyle='#FFFFFF';x.strokeStyle='#DCE3EA';x.lineWidth=2;x.beginPath();if(x.roundRect)x.roundRect(P,top-50,W-2*P,110+L.length*RH,24);else x.rect(P,top-50,W-2*P,110+L.length*RH);x.fill();x.stroke();
  x.fillStyle='#5A6570';x.font='700 26px '+B;cols.forEach(function(cl){x.fillText(cl[0].toUpperCase(),cl[1],top)});x.fillStyle='#E3E8EE';x.fillRect(P,top+22,W-2*P,3);
  var fit=function(s,w){s=String(s);if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s+'…'};
  L.forEach(function(r,i){var y=top+60+i*RH;if(i){x.fillStyle='#EDF1F5';x.fillRect(P+16,y-40,W-2*P-32,2)}
    x.fillStyle='#141C24';x.font='700 36px '+B;x.fillText(fit(r.user,560),cols[0][1],y+4);x.fillStyle='#0B5FA8';x.font='700 26px '+B;x.fillText(fit('Chassis '+r.bike,560),cols[0][1],y+40);x.fillStyle='#6A7682';x.font='400 26px '+B;x.fillText(fit((r.dh||'')+(r.issue?' · '+r.issue:''),560),cols[0][1],y+74);
    var pill=function(t,bx,bg,fg){x.font='700 26px '+B;var w=x.measureText(t).width+36;x.fillStyle=bg;x.beginPath();if(x.roundRect)x.roundRect(bx,y-26,w,44,22);else x.rect(bx,y-26,w,44);x.fill();x.fillStyle=fg;x.fillText(t,bx+18,y+5)};
    pill(r.type,cols[1][1],r.type==='GPS'?'#FFE3EC':'#FFF1CC',r.type==='GPS'?'#B42354':'#8A5A00');
    x.fillStyle='#141C24';x.font='500 32px '+B;x.fillText(dlabel(r.raised),cols[2][1],y+6);x.font='700 32px '+B;x.fillText(fit(r.sr||'–',210),cols[3][1],y+6);
    x.fillStyle=r.status==='Open'&&r.days>7?'#B42318':'#141C24';x.font='800 34px '+B;x.fillText(String(r.days),cols[4][1],y+6);
    pill(r.status==='Open'?'Open':'Resolved '+dlabel(r.resolved),cols[5][1],r.status==='Open'?'#FDE2E0':'#D7F7E8',r.status==='Open'?'#B42318':'#0E7A52')});
  x.fillStyle='#8A949E';x.font='500 26px '+B;x.fillText('RSSP Business Tracker · '+location.host,P,H-50);
  c.toBlob(function(b){var name='faulty-bikes-'+d+'.png',file=new File([b],name,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Faulty bikes register'}).catch(function(){});
    else{var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000)}},'image/png');
}
function faultExportXlsx(){var L=S.faultExport||[],d=dhakaToday();
  /* build and share inside the tap itself: phones refuse the share menu once the tap is a few seconds old,
     so the Excel library is loaded in advance when this tab opens */
  var build=function(X){var rows=[['Bike user','Chassis number','Role','DH','Area','Supplier','Type','Issue','Raised on','SR number','Status','Resolved on','Days open']].concat(L.map(function(r){return [r.user,r.bike,r.role,r.dh,r.area,r.sup,r.type,r.issue,r.raised,r.sr,r.status,r.resolved,r.days]}));
    var ws=X.utils.aoa_to_sheet(rows);ws['!cols']=[22,22,10,24,14,10,8,36,12,14,10,12,10].map(function(w){return {wch:w}});
    var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,'Faulty bikes');
    var name='faulty-bikes-'+d,xf=new File([X.write(wb,{bookType:'xlsx',type:'array'})],name+'.xlsx',{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    var cf=new File(['﻿'+X.utils.sheet_to_csv(ws)],name+'.csv',{type:'text/csv'}),can=function(f){try{return !!(navigator.canShare&&navigator.canShare({files:[f]}))}catch(e){return false}};
    var down=function(){var a=document.createElement('a');a.href=URL.createObjectURL(xf);a.download=xf.name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000);setStatus('fStatus','Excel file downloaded. Find it in your Downloads to open or share it.','ok')};
    var share=function(file,msg){navigator.share({files:[file],title:'Faulty bikes register'}).then(function(){setStatus('fStatus',msg,'ok')}).catch(function(e){if(e&&e.name==='AbortError'){setStatus('fStatus','Sharing cancelled.','');return}down()})};
    if(can(xf))share(xf,'Excel file shared.');else if(can(cf))share(cf,'Shared as a spreadsheet file (CSV), which opens in Excel and Google Sheets.');else down()};
  if(window.XLSX){try{build(window.XLSX)}catch(e){setStatus('fStatus','Could not make the Excel file: '+(e&&e.message||e),'err')}return}
  setStatus('fStatus','Preparing the Excel file…');
  loadXLSX().then(function(X){try{build(X)}catch(e){setStatus('fStatus','Could not make the Excel file: '+(e&&e.message||e),'err')}}).catch(function(e){setStatus('fStatus','Could not make the Excel file: '+(e&&e.message||e),'err')})}
function bindQuickFault(){
  var list=function(){return ((S.bike.faults&&S.bike.faults.list)||[]).slice()};
  var save=function(l,msg){var data={list:l,holidays:bikeHolidays(),updatedAt:new Date().toISOString()};setStatus('qStatus','Saving…');
    return apiSave({kind:'bikefaults',data:data}).then(function(){S.bike.faults=data;S.qFaultOpen=false;render();setStatus('qStatus',msg,'ok')}).catch(function(e){setStatus('qStatus','Could not save: '+(e&&e.message||e),'err')})};
  var o=$('qOpen');if(o)o.addEventListener('click',function(){S.qFaultOpen=true;render();var i=$('qIssue');if(i)i.focus()});
  var c=$('qCancel');if(c)c.addEventListener('click',function(){S.qFaultOpen=false;render()});
  var sv=$('qSave');if(sv)sv.addEventListener('click',function(){var bike=sv.getAttribute('data-bike'),raised=$('qRaised').value;if(!raised){setStatus('qStatus','Enter the date the issue was raised.','err');return}
    var l=list();if(l.some(function(f){return f.bike===bike&&f.status!=='Resolved'})){setStatus('qStatus','This bike already has an open complaint.','err');return}
    l.push({id:Date.now().toString(36),bike:bike,type:$('qType').value,issue:$('qIssue').value.trim(),raised:raised,sr:$('qSr').value.trim(),status:'Open',resolved:''});
    save(l,'Saved. The bike is flagged as faulty and left out of the 3 KM compliance until resolved.')});
  var rs=main.querySelector('[data-qres]');if(rs)rs.addEventListener('click',function(){var id=rs.getAttribute('data-qres'),d=$('qResD').value||dhakaToday(),l=list();
    l.forEach(function(f){if(f.id===id){if(d<f.raised)d=f.raised;f.status='Resolved';f.resolved=d}});save(l,'Marked resolved. The bike counts for compliance again.')});
}
function bindBike(){
  bindQuickFault();
  if(main.querySelector('[data-fexp]')&&!window.XLSX)loadXLSX().catch(function(){});
  [].forEach.call(main.querySelectorAll('[data-fexp]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-fexp'),dm=b.closest('details');if(dm)dm.removeAttribute('open');
    if(k==='img')faultExportImage();else if(k==='xlsx')faultExportXlsx();
    else{var t=faultExportText();if(navigator.share&&/Android|iPhone|iPad/i.test(navigator.userAgent)){navigator.share({text:t}).catch(function(){})}
      else{try{navigator.clipboard.writeText(t).then(function(){setStatus('fStatus','Copied. Paste it into WhatsApp or anywhere.','ok')})}catch(e){}}}})});
  var q=function(sel,fn){main.querySelectorAll(sel).forEach(fn)};
  q('[data-bikef]',function(b){b.addEventListener('click',function(){S.bikeF=b.getAttribute('data-bikef');render()})});
  q('[data-bkflt]',function(el){el.addEventListener('change',function(){S.bkFlt=S.bkFlt||{};S.bkFlt[el.getAttribute('data-bkflt')]=el.value;render()})});
  var bks=$('bkSort');if(bks)bks.addEventListener('change',function(){S.bkSort=bks.value;tryLS('bkSort',bks.value);render()});
  var bkc=$('bkClear');if(bkc)bkc.addEventListener('click',function(){S.bkFlt={};render()});
  var bkf=$('bkFind');if(bkf){var run=function(){var v=(bkf.value||'').trim().toLowerCase();S.bkFind=bkf.value;var shown=0,tot=0;main.querySelectorAll('.bktable tbody tr').forEach(function(tr){if(tr.classList.contains('bkgrp'))return;tot++;var ok=!v||(tr.getAttribute('data-q')||'').indexOf(v)>=0;tr.style.display=ok?'':'none';if(ok)shown++});
      main.querySelectorAll('.bktable tbody tr.bkgrp').forEach(function(g){var n=g.nextElementSibling,any=false;while(n&&!n.classList.contains('bkgrp')){if(n.style.display!=='none')any=true;n=n.nextElementSibling}g.style.display=any?'':'none'});
      var c=$('bkCount');if(c)c.textContent=c.textContent.replace(/^Showing \d+/,'Showing '+shown)};bkf.addEventListener('input',run);if(bkf.value)run()}
  var openBike=function(id){S.bikeSel=id;S.tab='bikes';tryLS('tab','bikes');render();var d=$('bikeDetail');if(d)d.scrollIntoView({behavior:'smooth'})};
  q('[data-bike]',function(b){b.addEventListener('click',function(){openBike(b.getAttribute('data-bike'))})});
  q('[data-bikesel]',function(b){b.addEventListener('click',function(){openBike(b.getAttribute('data-bikesel'))})});
  var sb=$('selBike');if(sb)sb.addEventListener('change',function(){openBike(sb.value)});
  var bq=$('bikeQ');if(bq){var runQ=function(){var v=bq.value.trim().toLowerCase();S.bikeQ=bq.value;var terms=v.split(/\s+/).filter(Boolean);
      var hit=function(q){return terms.every(function(t){return q.indexOf(t)>=0})};
      main.querySelectorAll('tr[data-q]').forEach(function(tr){tr.style.display=!terms.length||hit(tr.getAttribute('data-q'))?'':'none'});
      var res=$('bikeQres');if(!res)return;if(!terms.length){res.innerHTML='';return}
      var m=(S._bikeIdx||[]).filter(function(x){return hit(x.q)});
      res.innerHTML=m.length?'<div class="note">'+m.length+' bike'+(m.length===1?'':'s')+' found'+(m.length>8?' · showing 8':'')+'</div>'+m.slice(0,8).map(function(x){return '<button class="qitem" data-bikesel="'+esc(x.id)+'"><b>'+esc(x.u)+'</b><span>'+esc(x.dh)+' · <span class="sup '+x.sup.toLowerCase()+'">'+x.sup+'</span> · '+esc(x.id)+'</span><span class="hpill '+x.h.k+'">'+x.h.t+'</span></button>'}).join(''):'<div class="note">No bike matches “'+esc(bq.value)+'”</div>';
      res.querySelectorAll('[data-bikesel]').forEach(function(b){b.addEventListener('click',function(){S.bikeQ='';openBike(b.getAttribute('data-bikesel'))})})};
    bq.addEventListener('input',runQ);bq.addEventListener('keydown',function(e){if(e.key==='Enter'){var f=$('bikeQres')&&$('bikeQres').querySelector('[data-bikesel]');if(f)f.click()}});if(bq.value)runQ()}
  q('[data-report]',function(b){b.addEventListener('click',function(){S.faultBike=b.getAttribute('data-report');S.tab='faulty';render();var fr=$('faultReg');if(fr)fr.scrollIntoView({behavior:'smooth'});var s=$('fIssue');if(s)setTimeout(function(){s.focus()},400)})});
  var list=function(){return ((S.bike.faults&&S.bike.faults.list)||[]).slice()};
  var add=$('fAdd');if(add)add.addEventListener('click',function(){
    var bike=$('fBike').value,raised=$('fRaised').value;if(!bike){setStatus('fStatus','Choose the bike first.','err');return}if(!raised){setStatus('fStatus','Enter the date the issue was raised.','err');return}
    var l=list();
    if(S.faultEdit){var rv=$('fResolved')?$('fResolved').value:null;if(rv&&rv<raised){setStatus('fStatus','Resolved date cannot be before the raised date.','err');return}
      l.forEach(function(f){if(f.id===S.faultEdit){f.type=$('fType').value;f.issue=$('fIssue').value.trim();f.raised=raised;f.sr=$('fSr').value.trim();if(rv)f.resolved=rv}});
      S.faultEdit=null;saveFaults(l,'Changes saved.');return}
    if(l.some(function(f){return f.bike===bike&&f.status!=='Resolved'})){setStatus('fStatus','This bike already has an open fault. Edit that entry, or mark it resolved first.','err');return}
    l.push({id:Date.now().toString(36),bike:bike,type:$('fType').value,issue:$('fIssue').value.trim(),raised:raised,sr:$('fSr').value.trim(),status:'Open',resolved:''});
    S.faultBike='';saveFaults(l,'Added. The bike is now flagged as faulty and left out of the 3 KM compliance until resolved.')});
  var fc=$('fCancel');if(fc)fc.addEventListener('click',function(){S.faultEdit=null;render()});
  q('[data-fedit]',function(b){b.addEventListener('click',function(){S.faultEdit=b.getAttribute('data-fedit');render();var fr=$('faultReg');if(fr)fr.scrollIntoView({behavior:'smooth'})})});
  var ha=$('holAdd');if(ha)ha.addEventListener('click',function(){var d=$('holIn').value;if(!d){setStatus('fStatus','Pick the holiday date first.','err');return}var h=bikeHolidays().slice();if(h.indexOf(d)<0)h.push(d);saveHolidays(h.sort(),'Holiday added. '+dlabel(d)+' is now left out of the 3 KM rule.')});
  q('[data-holdel]',function(b){b.addEventListener('click',function(){var d=b.getAttribute('data-holdel');saveHolidays(bikeHolidays().filter(function(x){return x!==d}),'Holiday removed.')})});
  q('[data-fres]',function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-fres'),l=list();var rdi=$('rd-'+id),rd=rdi&&rdi.value?rdi.value:dhakaToday();l.forEach(function(f){if(f.id===id){if(rd<f.raised)rd=f.raised;f.status='Resolved';f.resolved=rd}});saveFaults(l,'Marked resolved on '+dlabel(rd)+'. From that day the bike counts in compliance again.')})});
  q('[data-fdel]',function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-fdel');saveFaults(list().filter(function(f){return f.id!==id}),'Deleted from the register.')})});
}
function handleBikeCsv(file,text){
  var rows=parseCSV(text),head=(rows[0]||[]).join(',');
  if(/bike_identifier/i.test(head)){
    var map=parseBikeMap(rows),n=Object.keys(map.bikes).length;setStatus('upStatus','Saving '+n+' bikes…');
    return apiSave({kind:'bikemap',data:map}).then(loadData).then(function(){return 'Bike mapping saved: '+n+' active bikes. Open Bike Operation to see them.'});
  }
  if(/\bVRN\b/.test(head)){
    var ms=parseBikeDistance(rows),chain=Promise.resolve();
    ms.forEach(function(M){chain=chain.then(function(){setStatus('upStatus','Saving distance for '+M.month+'…');return apiSave({kind:'bikemonth',month:M.month,data:M})})});
    var L=ms[ms.length-1];
    return chain.then(loadData).then(function(){return 'Distance report saved. Bike data now runs through '+dlabel(L.through)+' for '+Object.keys(L.km).length+' bikes. Today is left out because it is still in progress.'});
  }
  return null;
}

/* ================= Phase 4: SIM Stock ================= */
var STK_LOW=3,STK_HIGH=30,STK_AGED=365;
var STK_BK=['0–7 days','8–30 days','31–90 days','91–365 days','Over 1 year'];
function stkBucket(a){return a<=7?0:a<=30?1:a<=90?2:a<=365?3:4}
function stkGroup(p){p=String(p||'');return /replacement/i.test(p)?'rep':/e_?sim/i.test(p)?'esim':'new'}
/* Same columns as the RSSP stock tracker sheet. Prepaid SIM = prepaid SIMKit only; postpaid kits sit in Postpaid */
var STK_CATS=[['kit','Single SIM Kit'],['pre','Prepaid SIM'],['mnp','MNP Prepaid'],['hlr','MNP HLR'],['post','Postpaid']];
var STK_LVL={kit:10,pre:10,mnp:5,hlr:5,post:5},STK_NORM={pre:10,kit:5};
var STK_FIFO='2023-01-01';
var RSSP_ALIAS={};
var DH_SUP={"DH9101":"Arif Hossain","DH9102":"Tanvir Ahmed","DH9103":"Tanvir Ahmed","DH9104":"Nusrat Jahan","DH9105":"Sabbir Rahman","DH9106":"Mehedi Hasan","DH9107":"Mehedi Hasan"};
function stkCat(p){p=String(p||'');return /^replacementsim$/i.test(p)?'kit':/^simkit$/i.test(p)?'pre':/^mnp_?replacement$/i.test(p)?'hlr':/^mnp$/i.test(p)?'mnp':'oth'}
function stkPc(){var o={};STK_CATS.concat([['oth']]).forEach(function(c){o[c[0]]={r:0,a:0}});return o}
function stkAdd(pc,pt,ch,isR,isA){var k=isR?'r':isA?'a':'';if(!k)return;var c=stkCat(pt);if(c==='pre'&&/post/i.test(String(ch||'')))c='post';pc[c][k]++}
function stkV3(K){K=JSON.parse(JSON.stringify(K));var f=function(pc){if(pc&&pc.pre&&pc.post){pc.pre.r-=pc.post.r;pc.pre.a-=pc.post.a}};Object.keys(K.dh).forEach(function(k){f(K.dh[k].pc)});Object.keys(K.rssp).forEach(function(k){f(K.rssp[k].pc)});K.v=4;return K}
function stkSum(pc,k){return ['kit','pre','post','mnp','hlr','oth'].reduce(function(a,c){return a+(k?pc[c][k]:pc[c].r+pc[c].a)},0)}
/* SIM Stock Details export -> small summary (RSSP analysis + DH/DSR product mix) */
function stockAggregate(rows,fileName){
  var H=rows[0].map(function(h){return String(h==null?'':h).trim()}),ix=function(n){return H.indexOf(n)};
  ['Status','Product Type','Distributor Name','Retailer RDMS Code'].forEach(function(n){if(ix(n)<0)throw new Error('The stock file is missing the column '+n+'.')});
  var I={sn:ix('Product SL No'),od:ix('Dist OD Rcv Date'),st:ix('Status'),pt:ix('Product Type'),ch:ix('Charging Type'),br:ix('Brand'),ar:ix('Area Name'),te:ix('Territory Name'),dn:ix('Distributor Name'),dc:ix('Distributor RDMS Code'),rn:ix('Retailer Name'),rc:ix('Retailer RDMS Code'),dl:ix('Distributor Lifting Date'),sl:ix('DSR Lifting Date'),rl:ix('Retailer Lifting Date')};
  var snap=dhakaToday(),known={};Object.keys(S.docs||{}).forEach(function(c){known[c]=1});Object.keys((S.master&&S.master.rssps)||{}).forEach(function(c){known[c]=1});
  var O={v:4,date:snap,fileName:fileName||'',uploadedAt:new Date().toISOString(),total:0,st:{D:0,S:0,R:0},dh:{},rssp:{},fifo:[]};
  var v=function(r,k){return I[k]<0?'':r[I[k]]},str=function(x){return x==null?'':String(x).trim()};
  for(var i=1;i<rows.length;i++){var r=rows[i];if(!r)continue;var stt=str(v(r,'st'));if(!stt)continue;
    var h=/distributor/i.test(stt)?'D':/dsr/i.test(stt)?'S':'R';O.total++;O.st[h]++;
    var pt=str(v(r,'pt')),brand=str(v(r,'br')),isR=/robi/i.test(brand),isA=/airtel|cirkle/i.test(brand),dc=str(v(r,'dc'))||str(v(r,'dn'));
    if(h!=='R'){if(!dc)continue;
      var D=O.dh[dc]||(O.dh[dc]={name:str(v(r,'dn')),terr:str(v(r,'te')),area:normArea(str(v(r,'ar'))),D:0,S:0,pc:stkPc()});D[h]++;stkAdd(D.pc,pt,v(r,'ch'),isR,isA);continue}
    var rc=str(v(r,'rc')),rn=str(v(r,'rn'));if(!rc||!(known[rc]||/^RSSP_/i.test(rn)))continue;
    var lift=rsspNormDate(v(r,'rl'))||rsspNormDate(v(r,'sl'))||rsspNormDate(v(r,'dl')),age=lift?Math.max(0,daysBetween(lift,snap)):0;
    var X=O.rssp[rc]||(O.rssp[rc]={name:rn.replace(/^RSSP_/i,'').replace(/_Chandpur( Outer)?$/i,'').replace(/^Union_/i,'').trim(),area:normArea(str(v(r,'ar'))),dc:dc,dh:str(v(r,'dn')),new:0,rep:0,esim:0,aged:0,oldest:0,ab:[0,0,0,0,0],pc:stkPc()});
    var dl0=rsspNormDate(v(r,'dl'))||rsspNormDate(v(r,'od'));if(dl0&&dl0<STK_FIFO)O.fifo.push([str(v(r,'sn')),rc,pt,isR?'R':isA?'C':'',dl0,lift||'']);
    X[stkGroup(pt)]++;stkAdd(X.pc,pt,v(r,'ch'),isR,isA);if(age>STK_AGED)X.aged++;if(age>X.oldest)X.oldest=age;X.ab[stkBucket(age)]++;
  }
  if(!O.total)throw new Error('No SIM rows were found in the stock file.');
  return O;
}
function handleStockRows(rows,fileName){
  setStatus('upStatus','Summarising '+fmt(rows.length-1)+' SIMs…');
  var O=stockAggregate(rows,fileName);
  var rs=0,rr=0,ra=0,re=0;Object.keys(O.rssp).forEach(function(k){rs+=O.rssp[k].new;rr+=O.rssp[k].rep;re+=O.rssp[k].esim;ra+=O.rssp[k].aged});
  var hist={total:O.total,D:O.st.D,S:O.st.S,R:O.st.R,rsspNew:rs,rsspRep:rr,rsspAged:ra};
  setStatus('upStatus','Saving stock summary…');
  return apiSave({kind:'stock',data:O,hist:hist}).then(loadData).then(function(){return 'SIM stock saved: '+Object.keys(O.rssp).length+' RSSPs holding '+fmt(rs+rr+re)+' SIMs · DH + DSR stock '+fmt(O.st.D+O.st.S)+'. Open the SIM Stock tab.'});
}
function stkLive(K,rows,byCode){
  var supOf=function(dc,dn){return DH_SUP[dc]||''};
  /* RSSPs: everyone in the stock file, plus RSSPs that sold in the last 7 days but hold nothing */
  /* one RSSP can sit under two retailer codes in the stock file: merge by name, keep the code the sales data uses */
  var KR={},nk=function(n){return String(n||'').toLowerCase().replace(/[^a-z]/g,'')},byName={};
  Object.keys(K.rssp||{}).forEach(function(c){var X=K.rssp[c],k=nk(X.name),c0=byName[k];if(!c0){byName[k]=c;KR[c]=JSON.parse(JSON.stringify(X));return}
    var M=KR[c0];if(byCode[c]&&!byCode[c0]){KR[c]=M;delete KR[c0];byName[k]=c;c0=c}
    ['new','rep','esim','aged'].forEach(function(f){M[f]+=X[f]});M.oldest=Math.max(M.oldest,X.oldest);X.ab.forEach(function(v,i){M.ab[i]+=v});Object.keys(M.pc).forEach(function(q){M.pc[q].r+=X.pc[q].r;M.pc[q].a+=X.pc[q].a})});
  /* live RSSPs only: the ones in the activation data (Retailer Type RSSP); stock matched by code, then by name */
  var RS=rows.map(function(R){var c=R.code;if(!KR[c]&&byName[nk(R.name)])KR[c]=KR[byName[nk(R.name)]];var X=KR[c]||{name:'',dc:'',dh:'',new:0,rep:0,esim:0,aged:0,oldest:0,ab:[0,0,0,0,0],pc:stkPc()},R=byCode[c],n7=0,r7=0,dd=R?R.daily.slice(-7):[];var byType=dd.some(function(d){return d.hasP});dd.forEach(function(d){if(byType){n7+=d.pn;r7+=d.pr}else{n7+=(d.robi||0)+(d.airtel||0);r7+=d.rep||0}});var nd=dd.length?n7/dd.length:0,rd=dd.length?r7/dd.length:0;
      var pc=X.pc,fail=[],zero=[];['r','a'].forEach(function(b){var bn=b==='r'?'Robi':'Cirkle';if(pc.pre[b]<STK_NORM.pre)fail.push(bn+' Prepaid '+pc.pre[b]);if(pc.kit[b]<STK_NORM.kit)fail.push(bn+' Kit '+pc.kit[b]);STK_CATS.forEach(function(k){if(b==='a'&&k[0]==='post')return;if(!pc[k[0]][b])zero.push(bn+' '+k[1].replace('Single SIM ','').replace(' Prepaid','').replace(' SIM',''))})});
      return {code:c,name:RSSP_ALIAS[c]?RSSP_ALIAS[c]+' ('+(R?R.name:X.name)+')':(R?R.name:X.name),terr:R?(R.territory||R.area):'',area:R?R.area:(X.area||''),dc:X.dc,dh:X.dh||(R&&R.dh)||'',sup:supOf(X.dc),pc:pc,newS:X.new,rep:X.rep,esim:X.esim,nd:nd,rd:rd,nc:nd?X.new/nd:null,rc:rd?X.rep/rd:null,oldest:X.oldest,aged:X.aged,ab:X.ab||[0,0,0,0,0],t:X.new+X.rep+X.esim,ok:!fail.length,fail:fail,zero:zero}});
  return {RS:RS,nk:nk,byName:byName,KR:KR};
}
function viewStock(){
  var K=S.stock&&S.stock.latest;
  if(!K)return '<div class="panel empty"><h2>SIM stock not uploaded yet</h2><p class="note">Upload the <b>SIM Stock Details</b> export in Upload &amp; Targets, from a laptop if possible (the file is large).</p>'+(S.canEdit?'<button class="btn" data-goto="setup">Upload the stock file</button>':'')+'</div>';
  if(K.v===3)K=stkV3(K);
  var old=K.v!==4;
  if(old)return '<div class="panel empty"><h2>Upload the SIM stock file once more</h2><p class="note">The SIM Stock tab now uses the RSSP stock tracker format. Upload today’s <b>SIM Stock Details</b> file once and everything fills in.</p>'+(S.canEdit?'<button class="btn" data-goto="setup">Upload the stock file</button>':'')+'</div>';
  var cal=calendar(),rows=cal?computeRows():[],byCode={};rows.forEach(function(r){byCode[r.code]=r});
  var inArea=function(a){return S.area==='All'||!a||a===S.area};
  var sd=dlabel(K.date)+' '+K.date.slice(0,4);
  var supOf=function(dc){return DH_SUP[dc]||''},LV=stkLive(K,rows,byCode),nk=LV.nk,RS=LV.RS.filter(function(x){return inArea(x.area)});
  var DH=Object.keys(K.dh).map(function(k){var x=K.dh[k];return {code:k,name:x.name,terr:x.terr,area:x.area,D:x.D,S:x.S,pc:x.pc,sup:supOf(k)}}).filter(function(x){return inArea(x.area)&&(x.D+x.S)});
  var rN=0,rR=0,rE=0,rA=0;RS.forEach(function(x){rN+=x.newS;rR+=x.rep;rE+=x.esim;rA+=x.aged});var rT=rN+rR+rE;
  var dT=DH.reduce(function(a,x){return a+x.D+x.S},0),dD=DH.reduce(function(a,x){return a+x.D},0);
  var bt=stkPc();DH.forEach(function(x){Object.keys(bt).forEach(function(c){bt[c].r+=x.pc[c].r;bt[c].a+=x.pc[c].a})});var bR=stkSum(bt,'r'),bA=stkSum(bt,'a');
  var low=RS.filter(function(x){return (x.nc!=null&&x.nc<STK_LOW)||(x.rc!=null&&x.rc<STK_LOW)}),high=RS.filter(function(x){return (x.nc!=null&&x.nc>STK_HIGH)||(x.rc!=null&&x.rc>STK_HIGH)}),agedL=RS.filter(function(x){return x.aged}),bad=RS.filter(function(x){return !x.ok});
  var zL=RS.filter(function(x){return x.zero.length}),zc={};zL.forEach(function(x){x.zero.forEach(function(z){zc[z]=(zc[z]||0)+1})});var zTop=Object.keys(zc).sort(function(a,b){return zc[b]-zc[a]}).map(function(k){return [k,zc[k]]})[0];
  var cv=function(v){return v==null?'–':v>=100?'99+':v.toFixed(1)};
  var h=waButton()+'<section class="section"><div class="kpis">'+
    kpi('RSSP stock',fmt(rT),'New '+fmt(rN)+' · Replacement '+fmt(rR)+(rE?' · eSIM '+fmt(rE):''))+
    kpi('Below 10 Prepaid &amp; 5 Kit',bad.length+' of '+RS.length,'RSSPs short on Robi or Cirkle')+
    kpi('Stock-out risk',fmt(low.length)+' RSSPs','Under '+STK_LOW+' days of cover')+
    kpi('RSSP SIMs aged over 1 year',fmt(rA),rT?pct(rA/rT)+' of RSSP stock':'')+
    kpi('Zero stock',zL.length+' of '+RS.length,zTop?'Most common gap: '+zTop[0]+' ('+zTop[1]+' RSSPs)':'No RSSP has a zero item')+
  '</div></section>';
  var al=[
    {sev:'crit',title:'RSSP stock-out risk',why:'Under '+STK_LOW+' days of cover at the last 7 days’ sales rate',list:low.sort(function(a,b){return Math.min(a.nc==null?99:a.nc,a.rc==null?99:a.rc)-Math.min(b.nc==null?99:b.nc,b.rc==null?99:b.rc)}),val:function(x){return 'New '+cv(x.nc)+' d · Repl '+cv(x.rc)+' d'}},
    {sev:'crit',title:'Below 10 Prepaid & 5 Single SIM Kit',why:'Each brand needs at least '+STK_NORM.pre+' Prepaid SIMs and '+STK_NORM.kit+' Single SIM Kits',list:bad.sort(function(a,b){return b.fail.length-a.fail.length}),val:function(x){return x.fail.join(' · ')}},
    {sev:'info',title:'Top 10 RSSPs holding SIMs over 1 year',why:agedL.length+' of '+RS.length+' RSSPs hold some SIMs over 1 year (counted from the day the RSSP received them)',list:agedL.sort(function(a,b){return b.aged-a.aged}).slice(0,10),val:function(x){return fmt(x.aged)+' aged · oldest '+Math.round(x.oldest/365*10)/10+' yr'}}];
  /* FIFO: SIMs lifted by the DH before 2023, sitting at live RSSPs, oldest first */
  var FL=null;if(K.fifo){var rsBy={};RS.forEach(function(x){rsBy[x.code]=x;if(K.rssp[x.code])rsBy['n:'+nk(K.rssp[x.code].name)]=x});
    FL=K.fifo.map(function(f){var x=rsBy[f[1]]||(K.rssp[f[1]]&&rsBy['n:'+nk(K.rssp[f[1]].name)]);if(!x)return null;var c=stkCat(f[2]),lb={kit:'Single SIM Kit',pre:'Prepaid SIM',mnp:'MNP Prepaid',hlr:'MNP HLR'}[c]||String(f[2]).replace(/_/g,' ');
      return {sn:f[0],x:x,prod:lb,br:f[3]==='R'?'Robi':f[3]==='C'?'Cirkle':'',dl:f[4],rl:f[5],age:daysBetween(f[4],K.date)}}).filter(Boolean).sort(function(a,b){return a.dl<b.dl?-1:a.dl>b.dl?1:a.sn<b.sn?-1:1});
    S._fifoCsv=[['#','SIM serial','RSSP','SUP','DH','Brand','Product','DH lifting date','RSSP received','Age (years)']].concat(FL.map(function(f,i){return [i+1,'="'+f.sn+'"',f.x.name,f.x.sup,f.x.dh,f.br,f.prod,f.dl,f.rl,(f.age/365).toFixed(1)]}));
    al.push({sev:'info',title:'Sell first (FIFO): SIMs lifted before 2023',why:FL.length+' SIMs at '+Object.keys(FL.reduce(function(a,f){a[f.x.code]=1;return a},{})).length+' RSSPs. Serial list at the bottom of this tab',list:(function(){var m={};FL.forEach(function(f){var q=m[f.x.code]||(m[f.x.code]={code:f.x.code,name:f.x.name,n:0,old:f.dl});q.n++});return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return b.n-a.n})})(),val:function(q){return q.n+' SIMs · oldest '+q.old.slice(0,4)}});}
  var nf=al.reduce(function(a,g){return a+g.list.length},0);
  h+='<section class="section"><div class="sechead"><h2>Needs attention</h2><span class="note">'+nf+' flag'+(nf===1?'':'s')+'</span></div><div class="agroups">'+
    al.map(function(g){return alertCard(g,g.list.map(function(x){var vv=g.val(x);return byCode[x.code]?'<button class="achip" data-open="'+esc(x.code)+'">'+esc(x.name)+' <span>'+esc(vv)+'</span></button>':'<span class="achip">'+esc(x.name)+' <span>'+esc(vv)+'</span></span>'}).join(''))}).join('')+'</div></section>';
  /* RSSP stock tracker, same layout as the Excel sheet */
  var F=S.stkF||'all',cell=function(n,k){return '<td>'+(n===0?'<span class="gac r">0</span>':n<STK_LVL[k]?'<span class="gac a">'+n+'</span>':fmt(n))+'</td>'};
  var rc=STK_CATS.length,ac=STK_CATS.length-1,trkSort=function(a,b){return (a.area||'').localeCompare(b.area||'')||(a.sup||'~').localeCompare(b.sup||'~')||(a.dh||'').localeCompare(b.dh||'')||a.name.localeCompare(b.name)};
  var trkTable=function(TR){return '<div class="tablebox short"><table class="compact lb trk"><thead><tr><th class="name l" rowspan="2">RSSP</th><th rowspan="2">10 Prepaid &amp; 5 Kit</th><th colspan="'+rc+'" class="brh robi">Robi SIM stock</th><th colspan="'+ac+'" class="brh cirkle">Cirkle SIM stock</th><th rowspan="2" class="l">Zero stock</th></tr><tr>'+
    STK_CATS.map(function(c){return '<th class="sub">'+c[1]+'</th>'}).join('')+STK_CATS.slice(0,ac).map(function(c){return '<th class="sub">'+c[1]+'</th>'}).join('')+'</tr></thead><tbody>'+
    TR.map(function(x,i){var A=x.area||'Unassigned',sh='';if(!i||(TR[i-1].area||'Unassigned')!==A){var G=TR.filter(function(y){return (y.area||'Unassigned')===A});sh='<tr class="subhead"><td colspan="'+(rc+ac+3)+'" style="position:sticky;left:0">'+esc(A)+' area · '+G.length+' RSSPs · '+G.filter(function(y){return y.ok}).length+' available · '+G.filter(function(y){return y.zero.length}).length+' zero stock</td></tr>'}return sh+'<tr><td class="name">'+(byCode[x.code]?'<button class="linkbtn" data-open="'+esc(x.code)+'">'+esc(x.name)+'</button>':'<b>'+esc(x.name)+'</b>')+'<small>'+esc([x.sup,x.dh].filter(Boolean).join(' · '))+'</small></td><td>'+(x.ok?'<span class="gac g">Available</span>':'<span class="gac r">Not Available</span>')+'</td>'+
      STK_CATS.map(function(c){return cell(x.pc[c[0]].r,c[0])}).join('')+STK_CATS.slice(0,ac).map(function(c){return cell(x.pc[c[0]].a,c[0])}).join('')+
      '<td class="l">'+(x.zero.length?'<span class="gac r">Zero Stock</span> <span class="zl">'+esc(x.zero.join(', '))+'</span>':'<span class="gac g">No zero</span>')+'</td></tr>'}).join('')+
    '<tr class="tot"><td class="name"><b>Total</b></td><td><b>'+TR.filter(function(x){return x.ok}).length+' / '+TR.length+'</b></td>'+STK_CATS.map(function(c){return '<td><b>'+fmt(TR.reduce(function(a,x){return a+x.pc[c[0]].r},0))+'</b></td>'}).join('')+STK_CATS.slice(0,ac).map(function(c){return '<td><b>'+fmt(TR.reduce(function(a,x){return a+x.pc[c[0]].a},0))+'</b></td>'}).join('')+'<td></td></tr></tbody></table></div>'};
  /* Zero stock report: the tracker table with only the RSSPs that have a product at zero */
  var ZR=RS.filter(function(x){return x.zero.length}).sort(trkSort);
  S.zeroExport={rows:ZR,date:K.date,sd:sd,total:RS.length};
  h+='<section class="section"><div class="sechead"><h2>Zero stock report</h2><span class="note">'+ZR.length+' of '+RS.length+' RSSPs have a product at zero</span>'+(ZR.length?'<button class="imgbtn" type="button" id="zeroShare"><span aria-hidden="true">🖼️</span> Share as picture</button>':'')+'</div>'+
    (ZR.length?trkTable(ZR)+'<p class="status" id="zeroStatus"></p>':'<div class="panel"><p class="note">No RSSP has any product at zero.</p></div>')+'</section>';
  var TR=RS.filter(function(x){return F==='all'||(F==='bad'&&!x.ok)||(F==='zero'&&x.zero.length)}).sort(trkSort);
  h+='<section class="section"><div class="sechead"><h2>RSSP stock tracker</h2><div class="seg" role="group" aria-label="Filter">'+[['all','All '+RS.length],['bad','Not available '+bad.length],['zero','Zero stock '+RS.filter(function(x){return x.zero.length}).length]].map(function(x){return '<button data-stkf="'+x[0]+'" aria-pressed="'+(F===x[0])+'">'+x[1]+'</button>'}).join('')+'</div></div>'+
    '<p class="note" style="margin:0 0 6px">'+RS.length+' live RSSPs. Available = at least '+STK_NORM.pre+' Prepaid SIMs and '+STK_NORM.kit+' Single SIM Kits in both Robi and Cirkle. Yellow is below '+STK_LVL.pre+' for Kit and Prepaid, below '+STK_LVL.mnp+' for MNP and Postpaid; red is zero.</p>'+
    trkTable(TR)+'</section>';
  /* RSSP stock age */
  h+='<section class="section"><div class="sechead"><h2>RSSP stock age</h2></div><div class="panel"><div class="chart" id="stkAge"></div><div class="note">Age counts from the day the RSSP received the SIM.</div></div></section>';
  /* DH + DSR stock by product and brand */
  var B=S.stkB||'All',bk=B==='Robi'?'r':B==='Cirkle'?'a':'',bv=function(o){return bk?o[bk]:o.r+o.a};
  var cols=STK_CATS.concat([['oth','Other']]),ct={};cols.forEach(function(c){ct[c[0]]=0});
  var DR=DH.map(function(x){cols.forEach(function(c){ct[c[0]]+=bv(x.pc[c[0]])});x.bt=stkSum(x.pc,bk);return x}).sort(function(a,b){return b.bt-a.bt});
  var gt=DR.reduce(function(a,x){return a+x.bt},0);
  h+='<section class="section"><div class="sechead"><h2>DH wise stock by product</h2><div class="seg" role="group" aria-label="Brand">'+['All','Robi','Cirkle'].map(function(b){return '<button data-stkb="'+b+'" aria-pressed="'+(B===b)+'">'+b+'</button>'}).join('')+'</div></div>'+
    '<p class="note" style="margin:0 0 6px">Stock at the distributor and its DSRs'+(bk?', '+B+' only':', Robi and Cirkle together')+'. Other is recycled, counter-attack and eSIM.</p><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">DH</th>'+cols.map(function(c){return '<th>'+c[1]+'</th>'}).join('')+'<th>Total</th></tr></thead><tbody>'+
    DR.map(function(x){return '<tr><td class="name"><b>'+esc(x.name)+'</b><small>'+esc([x.terr,x.sup].filter(Boolean).join(' · '))+'</small></td>'+cols.map(function(c){var n=bv(x.pc[c[0]]);return '<td>'+(n?fmt(n):'<span class="gac r">0</span>')+'</td>'}).join('')+'<td><b>'+fmt(x.bt)+'</b></td></tr>'}).join('')+
    '<tr class="tot"><td class="name"><b>Total</b></td>'+cols.map(function(c){return '<td><b>'+fmt(ct[c[0]])+'</b></td>'}).join('')+'<td><b>'+fmt(gt)+'</b></td></tr></tbody></table></div></section>';
  /* trend */
  var hd=S.stock.history||{},hk=Object.keys(hd).sort().slice(-7);
  if(hk.length>1)h+='<section class="section"><div class="sechead"><h2>Stock trend</h2><span class="note">Last '+hk.length+' uploads · whole region</span></div><div class="tablebox"><table class="compact"><thead><tr><th class="l">Date</th><th>RSSP new</th><th>RSSP repl.</th><th>RSSP SIMs over 1 year</th><th>DH + DSR</th></tr></thead><tbody>'+
    hk.slice().reverse().map(function(d){var x=hd[d];return '<tr><td class="l"><b>'+dlabel(d)+'</b></td><td>'+fmt(x.rsspNew)+'</td><td>'+fmt(x.rsspRep)+'</td><td>'+(x.rsspAged==null?'–':fmt(x.rsspAged))+'</td><td>'+fmt((x.D||0)+(x.S||0))+'</td></tr>'}).join('')+'</tbody></table></div></section>';
  /* share */
  (function(){var where=S.area==='All'?'Chandpur Region':S.area+' area',t=['*RSSP SIM Stock Update · '+where+'*','Stock as of '+sd,'',
      '*RSSP stock:* '+fmt(rT)+' (new '+fmt(rN)+' · replacement '+fmt(rR)+')','*10 Prepaid & 5 Kit available:* '+(RS.length-bad.length)+' of '+RS.length+' RSSPs','*Aged over 1 year:* '+fmt(rA),'*Zero stock:* '+zL.length+' of '+RS.length+' RSSPs'+(zTop?' (most common: '+zTop[0]+')':''),''];
    al.forEach(function(g){if(g.list.length){t.push('⚠️ *'+g.title+' ('+g.list.length+'):*');g.list.forEach(function(x,i){t.push((i+1)+'. '+x.name+' · '+g.val(x))});t.push('')}});
    t.push('Dashboard: '+location.origin);S.waText=t.join('\n');
    S.imgSpec={file:'rssp-sim-stock-'+K.date,title:'RSSP SIM Stock',sub:where+' · stock as of '+sd+' · cover from last 7 days’ sales',
      kpis:[{l:'RSSP stock',v:fmt(rT),s:'New '+fmt(rN)+' · Repl '+fmt(rR)},{l:'10 Prepaid & 5 Kit',v:(RS.length-bad.length)+' of '+RS.length,s:bad.length+' RSSPs not available'},{l:'Stock-out risk',v:low.length+' RSSPs',s:'Under '+STK_LOW+' days of cover'},{l:'RSSP aged over 1 year',v:fmt(rA),s:rT?pct(rA/rT)+' of RSSP stock':''},{l:'Zero stock',v:zL.length+' of '+RS.length,s:zTop?'Most common: '+zTop[0]:'No zero items'}],
      sections:al.map(function(g){return {t:g.title,sev:g.sev,items:g.list.map(function(x){return x.name+'  ·  '+g.val(x)})}})};})();
  chartJobs.push(function(){var el=$('stkAge');if(!el)return;var A=[0,0,0,0,0];RS.forEach(function(x){x.ab.forEach(function(v,i){A[i]+=v})});
    barChart(el,STK_BK.map(function(lb,i){return {label:lb.replace(' days','d').replace('Over 1 year','>1 yr'),segs:[{v:A[i],cls:i===4?'gred':'stk-d'}],tip:'<b>'+lb+'</b><br>'+fmt(A[i])+' SIMs at RSSPs'}}),{labels:true,h:220,aria:'RSSP SIM stock by age'})});
  if(!FL)h+='<section class="section"><div class="sechead"><h2>FIFO list: SIMs lifted before 2023</h2></div><div class="panel"><p class="note">Upload today’s SIM Stock Details file once more to build the serial list.</p></div></section>';
  else h+='<section class="section"><div class="sechead"><h2>FIFO list: SIMs lifted before 2023</h2><button class="btn" id="fifoCsv" style="padding:6px 12px">Download list</button></div><p class="note" style="margin:0 0 6px">'+FL.length+' SIMs at live RSSPs that the DH lifted before 1 Jan 2023. Sell these first, oldest at the top.</p><div class="tablebox short"><table class="compact lb"><thead><tr><th>#</th><th class="name l">SIM serial</th><th class="l">RSSP</th><th>Brand</th><th class="l">Product</th><th>DH lifted</th><th>Age</th><th>RSSP received</th></tr></thead><tbody>'+
    (FL.length?FL.map(function(f,i){return '<tr><td>'+(i+1)+'</td><td class="name"><b style="font-variant-numeric:tabular-nums">'+esc(f.sn)+'</b></td><td class="l">'+(byCode[f.x.code]?'<button class="linkbtn" data-open="'+esc(f.x.code)+'">'+esc(f.x.name)+'</button>':esc(f.x.name))+'<small style="display:block;color:var(--muted)">'+esc(f.x.sup||f.x.dh)+'</small></td><td>'+(f.br==='Robi'?'<span class="gac r">Robi</span>':'<span class="gac a">'+esc(f.br)+'</span>')+'</td><td class="l">'+esc(f.prod)+'</td><td>'+dlabel(f.dl)+' '+f.dl.slice(0,4)+'</td><td><span class="gac r">'+(f.age/365).toFixed(1)+' yr</span></td><td>'+(f.rl?dlabel(f.rl)+' '+f.rl.slice(0,4):'–')+'</td></tr>'}).join(''):'<tr><td colspan="8" class="note">No SIMs lifted before 2023 at live RSSPs.</td></tr>')+'</tbody></table></div></section>';
  return h;
}

function zeroExportImage(){
  var E=S.zeroExport;if(!E||!E.rows.length)return;var R=E.rows,items=[];
  R.forEach(function(x,i){var A=x.area||'Unassigned';if(!i||(R[i-1].area||'Unassigned')!==A){var G=R.filter(function(y){return (y.area||'Unassigned')===A});items.push({sub:A+' area · '+G.length+' RSSPs · '+G.filter(function(y){return y.ok}).length+' available · '+G.length+' zero stock'})}items.push({x:x})});
  items.push({tot:1});
  var W=2400,P=50,RH=100,SH=60,top=330,body=items.reduce(function(a,it){return a+(it.sub?SH:RH)},0),H=top+70+body+140,K=Math.min(7680/W,16000/H),c=document.createElement('canvas');c.width=Math.round(W*K);c.height=Math.round(H*K);var x=c.getContext('2d');x.scale(K,K);x.imageSmoothingQuality='high';
  var F="'Barlow Condensed','Segoe UI',Arial,sans-serif",B="'Source Sans 3','Segoe UI',Arial,sans-serif";
  x.fillStyle='#F4F7FA';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#E4002B');g.addColorStop(.55,'#F0447A');g.addColorStop(1,'#FFA62B');x.fillStyle=g;x.fillRect(0,0,W,14);
  var lg=document.querySelector('img.logo');if(lg&&lg.complete&&lg.naturalWidth){var lh=120,lw=lh*lg.naturalWidth/lg.naturalHeight;x.drawImage(lg,W-P-lw,44,lw,lh)}
  x.fillStyle='#141C24';x.font='800 72px '+F;x.fillText('Zero stock report',P,115);
  x.fillStyle='#5A6570';x.font='500 34px '+B;x.fillText((S.area==='All'?'Chandpur Region':S.area+' area')+' · stock as of '+E.sd+' · '+R.length+' of '+E.total+' RSSPs have a product at zero',P,168);
  var nameX=P+20,nameW=440,avX=P+560,c0=P+660,cw=122,ac=STK_CATS.length-1,rob=[],cir=[],zX=c0+cw*(STK_CATS.length+ac)+30,zW=W-P-20-zX;
  STK_CATS.forEach(function(k,i){rob.push(c0+cw*i+cw/2)});STK_CATS.slice(0,ac).forEach(function(k,i){cir.push(c0+cw*(STK_CATS.length+i)+cw/2)});
  var ctr=function(t,cx,y){x.textAlign='center';x.fillText(t,cx,y);x.textAlign='left'};
  var fit=function(s,w){s=String(s==null?'':s);if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s+'…'};
  var pill=function(t,cx,y,bg,fg,fs){x.font='700 '+(fs||30)+'px '+B;var w=Math.max(x.measureText(t).width+30,52);x.fillStyle=bg;x.beginPath();if(x.roundRect)x.roundRect(cx-w/2,y-30,w,46,23);else x.rect(cx-w/2,y-30,w,46);x.fill();x.fillStyle=fg;ctr(t,cx,y+3)};
  var tY=top-110;x.fillStyle='#FFFFFF';x.strokeStyle='#DCE3EA';x.lineWidth=2;x.beginPath();if(x.roundRect)x.roundRect(P,tY,W-2*P,H-tY-120,24);else x.rect(P,tY,W-2*P,H-tY-120);x.fill();x.stroke();
  x.fillStyle='#F04438';x.fillRect(c0,tY+2,cw*STK_CATS.length,48);x.fillStyle='#E0368F';x.fillRect(c0+cw*STK_CATS.length,tY+2,cw*ac,48);
  x.fillStyle='#FFFFFF';x.font='800 28px '+B;ctr('ROBI SIM STOCK',c0+cw*STK_CATS.length/2,tY+36);ctr('CIRKLE SIM STOCK',c0+cw*(STK_CATS.length+ac/2),tY+36);
  x.fillStyle='#5A6570';x.font='700 24px '+B;x.fillText('RSSP',nameX,top-20);ctr('10 PREPAID',avX,top-36);ctr('& 5 KIT',avX,top-8);x.fillText('ZERO STOCK',zX,top-20);
  var hl=function(lbl,cx){x.font='700 22px '+B;var w=lbl.toUpperCase().split(' ');if(w.length>1){ctr(w[0],cx,top-36);ctr(w.slice(1).join(' '),cx,top-8)}else ctr(w[0],cx,top-20)};
  STK_CATS.forEach(function(k,i){hl(k[1],rob[i])});STK_CATS.slice(0,ac).forEach(function(k,i){hl(k[1],cir[i])});
  x.fillStyle='#E3E8EE';x.fillRect(P,top+10,W-2*P,3);
  var num=function(n,lvl,cx,y){if(n===0)pill('0',cx,y,'#FDE2E0','#B42318');else if(n<lvl)pill(String(n),cx,y,'#FFF1CC','#8A5A00');else{x.fillStyle='#141C24';x.font='500 32px '+B;ctr(fmt(n),cx,y+3)}};
  var y=top+12;
  items.forEach(function(it){
    if(it.sub){x.fillStyle='#EEF1F5';x.fillRect(P+2,y,W-2*P-4,SH);x.fillStyle='#4A5561';x.font='800 28px '+B;x.fillText(it.sub.toUpperCase(),nameX,y+40);y+=SH;return}
    var cy=y+RH/2+8;x.fillStyle='#EDF1F5';x.fillRect(P+16,y+RH-1,W-2*P-32,2);
    if(it.tot){x.fillStyle='#141C24';x.font='800 34px '+B;x.fillText('Total',nameX,cy+4);x.font='800 32px '+B;ctr(R.filter(function(r){return r.ok}).length+' / '+R.length,avX,cy+4);
      STK_CATS.forEach(function(k,i){ctr(fmt(R.reduce(function(a,r){return a+r.pc[k[0]].r},0)),rob[i],cy+4)});STK_CATS.slice(0,ac).forEach(function(k,i){ctr(fmt(R.reduce(function(a,r){return a+r.pc[k[0]].a},0)),cir[i],cy+4)});y+=RH;return}
    var r=it.x;x.fillStyle='#141C24';x.font='700 36px '+B;x.fillText(fit(r.name,nameW),nameX,cy-8);x.fillStyle='#6A7682';x.font='500 24px '+B;x.fillText(fit([r.sup,r.dh].filter(Boolean).join(' · '),nameW),nameX,cy+26);
    if(r.ok)pill('Available',avX,cy,'#D7F7E8','#0E7A52',26);else pill('Not Available',avX,cy,'#FDE2E0','#B42318',26);
    STK_CATS.forEach(function(k,i){num(r.pc[k[0]].r,STK_LVL[k[0]],rob[i],cy)});STK_CATS.slice(0,ac).forEach(function(k,i){num(r.pc[k[0]].a,STK_LVL[k[0]],cir[i],cy)});
    x.font='700 26px '+B;var zw=x.measureText('Zero Stock').width+28;x.fillStyle='#FDE2E0';x.beginPath();if(x.roundRect)x.roundRect(zX,cy-30,zw,46,23);else x.rect(zX,cy-30,zw,46);x.fill();x.fillStyle='#B42318';x.fillText('Zero Stock',zX+14,cy+2);
    x.font='600 26px '+B;var words=r.zero.join(', ').split(' '),lines=[''],mx=zW-zw-16;words.forEach(function(w){var t=lines[lines.length-1]?lines[lines.length-1]+' '+w:w;if(x.measureText(t).width>mx&&lines[lines.length-1])lines.push(w);else lines[lines.length-1]=t});lines=lines.slice(0,2);
    x.fillStyle='#B42318';lines.forEach(function(l,li){x.fillText(l,zX+zw+14,cy+2+(li-(lines.length-1)/2)*30)});
    y+=RH});
  x.fillStyle='#8A949E';x.font='500 26px '+B;x.fillText('Available = at least '+STK_NORM.pre+' Prepaid SIMs and '+STK_NORM.kit+' Single SIM Kits in both Robi and Cirkle. Yellow is below '+STK_LVL.pre+' for Kit and Prepaid, below '+STK_LVL.mnp+' for MNP and Postpaid; red is zero.',P,H-72);x.fillText('RSSP Business Tracker · '+location.host,P,H-34);
  setStatus('zeroStatus','Preparing the picture…');
  c.toBlob(function(b){var name='zero-stock-'+E.date+'.png',file=new File([b],name,{type:'image/png'});
    var down=function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);setStatus('zeroStatus','Picture downloaded.','ok')};
    if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Zero stock report'}).then(function(){setStatus('zeroStatus','Picture shared.','ok')}).catch(function(e){if(e&&e.name==='AbortError')setStatus('zeroStatus','Sharing cancelled.','');else down()});
    else down()},'image/png');
}
/* ---------- HQ targets (admin only): month-wise, read from the RSSP Wise sheet ---------- */
var TGT_COLS={name:'RSSP Name',code:'Robi SIM POS',ga:'Total GA Target',rfo:'DSO GA TGT',agent:'Agent GA TGT',fwa:'FWA TGT',el:'EL Sales',redeem:'Dhonnobad card redemption tgt',card:'Card Distribution Tgt'};
function hqTarget(code){var T=S.master&&S.master.targets,m=S.meta&&S.meta.month;var x=T&&m&&T[m];return x&&x.rssp?x.rssp[code]||null:null}
function hqMonthTargets(){var T=S.master&&S.master.targets,m=S.meta&&S.meta.month;return T&&m?T[m]||null:null}
function findTargetSheet(wb,X){for(var i=0;i<wb.SheetNames.length;i++){var rows=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]],{header:1,raw:true,defval:null});
  for(var r=0;r<Math.min(6,rows.length);r++){var h=(rows[r]||[]).map(function(x){return String(x==null?'':x).trim()});if(h.indexOf('Robi SIM POS')>=0&&h.indexOf('Total GA Target')>=0)return {rows:rows,hi:r,sheet:wb.SheetNames[i]}}}return null}
function handleTargetRows(ts,fileName){
  if(!S.canEdit)return Promise.reject(new Error('Sign in as admin to upload targets.'));
  var go=function(){
    if(S.masterRedacted)throw new Error('Could not load your private targets. Sign in as admin again and re-upload.');
    var H=ts.rows[ts.hi].map(function(x){return String(x==null?'':x).trim()}),I={};Object.keys(TGT_COLS).forEach(function(k){I[k]=H.indexOf(TGT_COLS[k])});
    var mk=targetFileMonth(fileName);
    var known={};allCodes().forEach(function(c){known[c]=1});var nk=function(n){return String(n||'').toLowerCase().replace(/^rssp_/,'').replace(/_[^_]*$/,'').replace(/[^a-z]/g,'')},byName={};allCodes().forEach(function(c){byName[nk('RSSP_'+infoFor(c).name+'_x')]=c});
    var num=function(v){var n=+v;return isFinite(n)?Math.round(n*100)/100:0},out={},n=0;
    for(var i=ts.hi+1;i<ts.rows.length;i++){var r=ts.rows[i];if(!r)continue;var code=String(r[I.code]==null?'':r[I.code]).trim(),c=known[code]?code:byName[nk(r[I.name])];if(!c)continue;
      var o={};['ga','rfo','agent','fwa','el','redeem','card'].forEach(function(k){o[k]=I[k]>=0?num(r[I[k]]):0});out[c]=o;n++}
    if(!n)throw new Error('None of the RSSPs in '+fileName+' match your RSSP list. Check that it is the RSSP-wise target file.');
    var miss=allCodes().filter(function(c){return !out[c]&&(S.docs[c])}).map(function(c){return infoFor(c).name});
    var m=Object.assign({},S.master);delete m.redacted;m.targets=Object.assign({},m.targets||{});m.targets[mk]=Object.assign({},m.targets[mk]||{},{file:fileName||'',at:new Date().toISOString(),rssp:out});m.updatedAt=new Date().toISOString();
    setStatus('upStatus','Saving targets for '+mlabel(mk)+'…');
    var sum=function(k){return Object.keys(out).reduce(function(a,c){return a+out[c][k]},0)};
    return apiSave({kind:'master',data:m}).then(loadData).then(function(){return 'Targets for '+mlabel(mk)+' saved for '+n+' RSSPs: GA '+fmt(sum('ga'))+' (RFO '+fmt(sum('rfo'))+' · Agent '+fmt(sum('agent'))+') · FWA '+fmt(sum('fwa'))+'. Only you see them.'+(miss.length?' No target for: '+miss.join(', ')+'.':'')});
  };
  return (S.masterRedacted?loadData():Promise.resolve()).then(go);
}


/* Target month from the file name: "Oct 2026", "October_2026" or "Oct26"; otherwise the data month */
function targetFileMonth(fileName){var mm=String(fileName||'').match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s_.-]*(20\d\d|\d\d)(?!\d)/i);
  if(mm)return (mm[2].length===2?'20'+mm[2]:mm[2])+'-'+rsspPad(['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(mm[1].toLowerCase())+1);
  return (S.meta&&S.meta.month)||dhakaToday().slice(0,7)}

/* ---------- DH-wise FWA targets (admin only): HQ Target Breakdown file, "Unique DH" sheet, column AR "TTL FWA TGT" ---------- */
var DHT_COLS={code:'Distributor RDMS Code',region:'Region',area:'Area',name:'Robi DISTRIBUTOR_NAME',fwa:'TTL FWA TGT',rssp:'RSSP FWA TGT',dh:'DH FWA'};
function findDhTargetSheet(wb,X){var order=wb.SheetNames.slice().sort(function(a,b){return (/unique\s*dh/i.test(b)?1:0)-(/unique\s*dh/i.test(a)?1:0)});
  for(var i=0;i<order.length;i++){var rows=X.utils.sheet_to_json(wb.Sheets[order[i]],{header:1,raw:true,defval:null});
    for(var r=0;r<Math.min(10,rows.length);r++){var h=(rows[r]||[]).map(function(x){return String(x==null?'':x).trim()});if(h.indexOf(DHT_COLS.fwa)>=0&&h.indexOf(DHT_COLS.code)>=0&&h.indexOf(DHT_COLS.name)>=0)return {rows:rows,hi:r,sheet:order[i]}}}return null}
/* DH names differ slightly between the target file and the Activation file (M/S, Robi, RB, Sheba/Shaba), so match on a cleaned key, then on a close spelling with the same number at the end */
function dhKey(n){return String(n||'').toLowerCase().replace(/m\s*\/\s*s\.?/g,' ').replace(/\b(robi|rb|at)\b/g,' ').replace(/[^a-z0-9]/g,'')}
function dhLev(a,b){if(a===b)return 0;var p=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;for(i=1;i<=a.length;i++){var c=[i];for(j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[b.length]}
function dhMatch(names,rows){var out={},used={},ids=Object.keys(rows),tail=function(k){var m=k.match(/\d+$/);return m?m[0]:''};
  var K={};ids.forEach(function(id){K[id]=dhKey(rows[id].name)});
  names.forEach(function(n){var k=dhKey(n);for(var i=0;i<ids.length;i++)if(K[ids[i]]===k&&!used[ids[i]]){out[n]=ids[i];used[ids[i]]=1;return}});
  names.forEach(function(n){if(out[n])return;var k=dhKey(n),best=null,bd=1e9;ids.forEach(function(id){if(used[id]||tail(K[id])!==tail(k))return;var d=dhLev(k,K[id]);if(d<bd){bd=d;best=id}});
    if(best&&bd<=Math.max(2,Math.floor(k.length*0.2))){out[n]=best;used[best]=1}});
  return out}
function dhDataNames(){var o={};[S.meta,S.prev&&S.prev.meta].forEach(function(M){Object.keys((M&&M.dh)||{}).forEach(function(n){o[n]=1})});return Object.keys(o)}
/* name in the Activation file -> {fwa,rssp,dh,code,name}, for the month on screen; null for viewers (targets never reach them) */
function hqDhTargets(names){var T=hqMonthTargets();if(!T||!T.dh||!T.dh.rows)return null;var R=T.dh.rows,ck=T.dh.at+'|'+names.join('|');
  if(S._dhtCache&&S._dhtCache.k===ck)return S._dhtCache.v;
  var m=dhMatch(names,R),v={};Object.keys(m).forEach(function(n){v[n]=Object.assign({code:m[n]},R[m[n]])});S._dhtCache={k:ck,v:v};return v}
function handleDhTargetRows(ts,fileName){
  if(!S.canEdit)return Promise.reject(new Error('Sign in as admin to upload targets.'));
  var go=function(){
    if(S.masterRedacted)throw new Error('Could not load your private targets. Sign in as admin again and re-upload.');
    var H=ts.rows[ts.hi].map(function(x){return String(x==null?'':x).trim()}),I={};Object.keys(DHT_COLS).forEach(function(k){I[k]=H.indexOf(DHT_COLS[k])});
    var mk=targetFileMonth(fileName),num=function(v){var n=+v;return isFinite(n)?Math.round(n):0},all={};
    for(var i=ts.hi+1;i<ts.rows.length;i++){var r=ts.rows[i];if(!r)continue;var code=String(r[I.code]==null?'':r[I.code]).trim(),name=String(r[I.name]==null?'':r[I.name]).trim();if(!/^DH/i.test(code)||!name)continue;
      all[code]={name:name,region:I.region>=0?String(r[I.region]||'').trim():'',area:I.area>=0?String(r[I.area]||'').trim():'',fwa:num(r[I.fwa]),rssp:I.rssp>=0?num(r[I.rssp]):0,dh:I.dh>=0?num(r[I.dh]):0}}
    if(!Object.keys(all).length)throw new Error('No DH rows were found in the '+ts.sheet+' sheet of '+fileName+'.');
    /* keep only your region: the region most of your Activation-data DHs match, else Chandpur */
    var names=dhDataNames(),hit=dhMatch(names,all),cnt={},regs={};Object.keys(hit).forEach(function(n){var g=all[hit[n]].region;cnt[g]=(cnt[g]||0)+1});var top=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]})[0];if(top)regs[top]=1;
    if(!Object.keys(regs).length)Object.keys(all).forEach(function(c){if(/chandpur/i.test(all[c].region))regs[all[c].region]=1});
    var rows={};Object.keys(all).forEach(function(c){if(regs[all[c].region])rows[c]=all[c]});var ids=Object.keys(rows);
    if(!ids.length)throw new Error('None of the DHs in '+fileName+' match your region. Check that it is the Target Breakdown file.');
    var m=Object.assign({},S.master);delete m.redacted;m.targets=Object.assign({},m.targets||{});
    m.targets[mk]=Object.assign({},m.targets[mk]||{},{dh:{file:fileName||'',sheet:ts.sheet,at:new Date().toISOString(),rows:rows}});m.updatedAt=new Date().toISOString();
    setStatus('upStatus','Saving DH FWA targets for '+mlabel(mk)+'…');
    var sum=function(k){return ids.reduce(function(a,c){return a+rows[c][k]},0)};
    var mHit=dhMatch(names,rows),matched={};Object.keys(mHit).forEach(function(n){matched[mHit[n]]=1});
    var noData=ids.filter(function(c){return !matched[c]}).map(function(c){return rows[c].name});
    return apiSave({kind:'master',data:m}).then(loadData).then(function(){return 'DH FWA targets for '+mlabel(mk)+' saved for '+ids.length+' DHs: total '+fmt(sum('fwa'))+' (RSSP '+fmt(sum('rssp'))+' · DH Sale '+fmt(sum('dh'))+'). Shown in WiFi → DH wise table. Only you see them.'+(names.length&&noData.length?' Not yet matched to sales data: '+noData.join(', ')+'.':'')});
  };
  return (S.masterRedacted?loadData():Promise.resolve()).then(go);
}
/* ---------- AON (age on network) of RFOs and Agents, from the DH All Staff report ---------- */
function idHash(s){s=String(s||'');var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return ('0000000'+h.toString(16)).slice(-8)}
function phone10(v){var d=String(v==null?'':v).replace(/\.0+$/,'').replace(/\D/g,'');return d.length>=10?d.slice(-10):''}
var AON_B=[['Under 1 month',0,30],['1–3 months',30,91],['3–6 months',91,182],['6–12 months',182,365],['Over 1 year',365,1e9]];
function aonBucket(d){for(var i=0;i<AON_B.length;i++)if(d<AON_B[i][2])return i;return AON_B.length-1}
function aonFmt(d){return d==null?'–':d<30?d+' d':d<365?(d/30.44).toFixed(1)+' mo':(d/365.25).toFixed(1)+' yr'}
function aonPill(d,j){if(d==null)return '<span class="note" title="Not in the staff list">–</span>';return '<span class="gac '+(d<30?'r':d<182?'a':'g')+'" title="Joined '+esc(j)+'">'+aonFmt(d)+'</span>'}
function handleStaffRows(rows,fileName){
  var H=rows[0].map(function(h){return String(h==null?'':h).trim()}),ix=function(n){return H.indexOf(n)};
  ['FF Designation','FF Name','FF Joining Date','FF Phone Number'].forEach(function(n){if(ix(n)<0)throw new Error('The staff file is missing the column '+n+'.')});
  var I={ds:ix('FF Designation'),n:ix('FF Name'),pc:ix('FF Profile Code'),ph:ix('FF Phone Number'),j:ix('FF Joining Date'),a:ix('Is Active'),dc:ix('Distributor Rdms Code'),rc:ix('FF Assist Code'),dump:ix('Dump Date')};
  var v=function(r,k){var x=I[k]<0?'':r[I[k]];return (x instanceof Date&&!isNaN(x))?new Date(x.getTime()+12*3600000):x},str=function(x){return x==null?'':String(x).trim()},P={},dump='';
  for(var i=1;i<rows.length;i++){var r=rows[i];if(!r)continue;var ds=str(v(r,'ds')),pc=str(v(r,'pc'));if(!/rssp/i.test(ds)&&!/^rssp/i.test(pc))continue;
    var ph=phone10(v(r,'ph')),j=rsspNormDate(v(r,'j'));if(!ph||!j)continue;if(!dump)dump=rsspNormDate(v(r,'dump'));
    var role=/agent/i.test(ds+' '+pc)?'Agent':/supervisor/i.test(ds+' '+pc)?'Supervisor':'RFO',act=/^y/i.test(str(v(r,'a'))),k=idHash(ph);
    var e={h:k,n:str(v(r,'n')).replace(/\s*RSSP(AG|DSO)_[\w]+$/i,'').replace(/\s+RSSP DSO$/i,'').trim(),r:role,j:j,a:act?1:0,dc:str(v(r,'dc')),pc:pc,rc:str(v(r,'rc')),p:'0'+ph};
    if(!P[k]||(act&&!P[k].a)||(act===!!P[k].a&&j>P[k].j))P[k]=e}
  var ppl=Object.keys(P).map(function(k){return P[k]});
  if(!ppl.length)throw new Error('No RSSP Agent, RSSP BP or RSSP supervisor rows with a phone number and joining date were found.');
  var act=ppl.filter(function(e){return e.a});
  setStatus('upStatus','Saving staff list…');
  return apiSave({kind:'staff',data:{date:dump||dhakaToday(),fileName:fileName||'',uploadedAt:new Date().toISOString(),ppl:ppl}}).then(loadData).then(function(){
    return 'Staff list saved: '+act.filter(function(e){return e.r==='RFO'}).length+' RFOs and '+act.filter(function(e){return e.r==='Agent'}).length+' Agents active (joining dates and phones kept for admin only; ID and birth date left out). Open the RFO and Agent tabs to see AON.'});
}
function staffIdx(){var St=S.staff;if(!St||!St.ppl)return null;if(S._stIdx&&S._stIdx.src===St)return S._stIdx.m;var m={};St.ppl.forEach(function(e){m[e.h]=e});S._stIdx={src:St,m:m};return m}
function staffFor(bid){var m=staffIdx();if(!m)return null;var p=phone10(bid);return p?m[idHash(p)]||null:null}
/* ---------- Ongoing Campaigns ---------- */
var CAMP_TYPES=['Customer offer','Trade offer','Sales contest','Activity'],CAMP_AUD=['Customer','Retailer','RSSP','Agent','RFO','DH'];
function campList(){return (S.camps&&S.camps.list)||[]}
function campState(c,today){if(today<c.start)return {k:'up',to:daysBetween(today,c.start)};if(today>c.end)return {k:'end',ago:daysBetween(c.end,today)};
  var len=daysBetween(c.start,c.end)+1,day=daysBetween(c.start,today)+1;return {k:'run',left:daysBetween(today,c.end),day:day,len:len,tg:Math.min(1,day/len)}}
function campRange(c){var ys=c.start.slice(0,4),ye=c.end.slice(0,4);return dlabel(c.start)+(ys!==ye?' '+ys:'')+' to '+dlabel(c.end)+' '+ye}
function campLeft(st){return st.k==='up'?'Starts in '+st.to+' day'+(st.to===1?'':'s'):st.k==='end'?'Ended':st.left===0?'Ends today':st.left+' day'+(st.left===1?'':'s')+' left'}
function campBrand(c){return c.brand==='Both'?'Robi + Cirkle':c.brand}
function campFiles(c){return c.files&&c.files.length?c.files:c.file?[c.file]:[]}
function campUrl(c,i){return '/api/apps?cid='+encodeURIComponent(c.id)+'&f='+i}
function campAttach(c){var F=campFiles(c),id=esc(c.id);if(!F.length)return '';
  var imgs=[],docs=[],h='';F.forEach(function(f,i){(/^image\//.test(f.type||'')?imgs:docs).push(i)});
  if(imgs.length){var show=imgs.slice(0,4),more=imgs.length-show.length;
    h+='<div class="campgal n'+show.length+'">'+show.map(function(i,k){return '<button type="button" class="campimg" data-cview="'+id+'" data-ci="'+i+'" aria-label="View picture '+(k+1)+' of '+imgs.length+' full screen"><img loading="lazy" src="'+campUrl(c,i)+'" alt="">'+(k===show.length-1&&more?'<span class="campmore">+'+more+'</span>':'')+'</button>'}).join('')+'</div>'+
      '<div class="campnote">⤢ Tap a picture to view full screen'+(imgs.length>1?' · '+imgs.length+' pictures, swipe to see all':'')+'</div>'}
  if(docs.length)h+='<div class="campdocs">'+docs.map(function(i){var f=F[i];return '<div class="campdoc"><span>📄 '+esc(f.name||'file')+' <small>'+fmtBytes(f.size)+'</small></span><a class="linkbtn" href="'+campUrl(c,i)+'" target="_blank" rel="noopener">View</a><a class="linkbtn" href="'+campUrl(c,i)+'&dl=1" download="'+esc(f.name||'file')+'">⬇ Download</a></div>'}).join('')+'</div>';
  var tot=F.reduce(function(a,f){return a+(+f.size||0)},0);
  h+='<div class="campfiles">'+(F.length===1?'<a class="btn campfile" href="'+campUrl(c,0)+'&dl=1" download="'+esc(F[0].name||'circular')+'">⬇ Download <small>'+fmtBytes(tot)+'</small></a>':'<button type="button" class="btn campfile" data-cdlall="'+id+'">⬇ Download all '+F.length+' files <small>'+fmtBytes(tot)+'</small></button>')+'</div>';
  return h}
function campCard(c,st,ad){
  var cl=c.brand==='Cirkle'?'cirkle':c.brand==='Robi'?'robi':'both',id=esc(c.id);
  var pc=st.k==='run'?(st.left<=1?'crit':st.left<=3?'warn':'good'):'none';
  var ago=st.k==='end'?(st.ago===1?'yesterday':st.ago+' days ago'):'';
  return '<article class="campcard '+cl+(st.k==='end'?' ended':'')+'">'+(st.k==='end'?'<div class="campout" role="note">⚠ OUTDATED<span>This campaign ended on '+dlabel(c.end)+' '+c.end.slice(0,4)+' ('+ago+'). Do not use it.</span></div>':'')+'<div class="camptop"><span>'+esc(campBrand(c))+'</span>'+(c.type?'<span class="camptype">'+esc(c.type)+'</span>':'')+'</div><div class="campbody">'+
    '<div class="camphead"><h3>'+esc(c.title)+'</h3><span class="pill '+pc+'">'+campLeft(st)+'</span></div>'+
    '<div class="campdates">'+campRange(c)+(st.k==='run'?' · day '+st.day+' of '+st.len:'')+'</div>'+
    (st.k==='run'?'<div class="camptrack"><div style="width:'+(st.tg*100).toFixed(1)+'%"></div></div>':'')+
    ((c.aud||[]).length?'<div class="camptags"><em>For</em>'+c.aud.map(function(a){return '<span>'+esc(a)+'</span>'}).join('')+'</div>':'')+
    (c.offer?'<div class="campoffer">'+esc(c.offer)+'</div>':'')+
    (c.reward?'<div class="campline rw"><b>Reward</b>'+esc(c.reward)+'</div>':'')+
    (c.rule?'<div class="campline"><b>Who qualifies</b>'+esc(c.rule)+'</div>':'')+
    campAttach(c)+
    (ad?'<div class="appadmin"><button class="linkbtn" data-cedit="'+id+'">Edit</button><button class="linkbtn" data-ccopy="'+id+'">Copy</button>'+(st.k==='run'?'<button class="linkbtn" data-cstop="'+id+'">Stop now</button>':'')+'<button class="linkbtn bad" data-cdel="'+id+'">Delete</button></div>':'')+
    '</div></article>'}
function viewCamps(){
  var L=campList(),ad=S.canEdit,today=dhakaToday(),fb=S.campBrand||'All',fa=S.campAud||'All';
  var ok=function(c){return (fb==='All'||c.brand===fb||c.brand==='Both')&&(fa==='All'||(c.aud||[]).indexOf(fa)>=0)};
  var X=L.map(function(c){return {c:c,s:campState(c,today)}}).filter(function(x){return ok(x.c)});
  var run=X.filter(function(x){return x.s.k==='run'}).sort(function(a,b){return a.s.left-b.s.left}),
      up=X.filter(function(x){return x.s.k==='up'}).sort(function(a,b){return a.c.start<b.c.start?-1:1}),
      end=X.filter(function(x){return x.s.k==='end'&&x.s.ago<=90}).sort(function(a,b){return a.c.end<b.c.end?1:-1});
  var soon=run.filter(function(x){return x.s.left<=3}).length;
  var h='<section class="section"><div class="sechead"><h2>Ongoing Campaigns</h2><span class="note">As of '+dlabel(today)+' '+today.slice(0,4)+'</span></div>';
  h+='<div class="campsum"><div><b>'+run.length+'</b><span>Running now</span></div><div class="'+(soon?'warn':'')+'"><b>'+soon+'</b><span>Ending in 3 days</span></div><div><b>'+up.length+'</b><span>Coming up</span></div>'+(end.length?'<div class="out"><b>'+end.length+'</b><span>Outdated</span></div>':'')+'</div>';
  var auds=CAMP_AUD.filter(function(a){return L.some(function(c){return (c.aud||[]).indexOf(a)>=0})});
  if(L.length)h+='<div class="campfilt"><div class="seg" role="group" aria-label="Brand">'+['All','Robi','Cirkle'].map(function(b){return '<button data-cbrand="'+b+'" aria-pressed="'+(fb===b)+'">'+(b==='All'?'All brands':b)+'</button>'}).join('')+'</div>'+
    (auds.length>1?'<div class="seg" role="group" aria-label="For" style="flex-wrap:wrap">'+['All'].concat(auds).map(function(a){return '<button data-caud="'+a+'" aria-pressed="'+(fa===a)+'">'+(a==='All'?'Everyone':a)+'</button>'}).join('')+'</div>':'')+'</div>';
  h+='</section>';
  h+='<section class="section"><div class="sechead"><h2>Running now</h2><span class="note">Ending soonest first</span></div>'+(run.length?'<div class="campgrid">'+run.map(function(x){return campCard(x.c,x.s,ad)}).join('')+'</div>':'<div class="panel empty"><p class="note">'+(L.length?'No campaign is running for this selection.':ad?'No campaigns yet. Add the first one with the form below.':'No campaigns are running right now.')+'</p></div>')+'</section>';
  if(up.length)h+='<section class="section"><div class="sechead"><h2>Coming up</h2></div><div class="campgrid">'+up.map(function(x){return campCard(x.c,x.s,ad)}).join('')+'</div></section>';
  if(end.length)h+='<section class="section"><div class="sechead"><h2>Outdated campaigns</h2><span class="note">Ended in the last 90 days · for reference only</span></div><div class="campgrid">'+end.map(function(x){return campCard(x.c,x.s,ad)}).join('')+'</div></section>';
  S.waText='';S.imgSpec=null;
  if(ad)h+=campForm(L);
  return h}
function campForm(L){
  var src=S.campEdit||S.campCopy,E0=src?L.filter(function(c){return c.id===src})[0]:null,E=E0?JSON.parse(JSON.stringify(E0)):{brand:'Robi',type:CAMP_TYPES[0],aud:[],start:dhakaToday(),end:''};
  if(S.campCopy&&E0){E.title=E0.title;if(E.end<dhakaToday()){E.start=dhakaToday();E.end=''}}
  var editing=!!(S.campEdit&&E0),opt=function(arr,cur){return arr.map(function(o){return '<option'+(o===cur?' selected':'')+'>'+esc(o)+'</option>'}).join('')};
  return '<section class="section" id="campForm"><div class="sechead"><h2>'+(editing?'Edit '+esc(E.title):S.campCopy?'New campaign from a copy':'Add a campaign')+'</h2><span class="note">Only you see this form</span></div><div class="panel appform">'+
    '<label class="wide">Campaign name<input id="cTitle" maxlength="80" value="'+esc(E.title||'')+'" placeholder="e.g. Puja GA Booster"></label>'+
    '<label>Brand<select id="cBrand">'+['Robi','Cirkle','Both'].map(function(b){return '<option value="'+b+'"'+(E.brand===b?' selected':'')+'>'+(b==='Both'?'Robi + Cirkle':b)+'</option>'}).join('')+'</select></label>'+
    '<label>Type<select id="cType">'+opt(CAMP_TYPES,E.type)+'</select></label>'+
    '<label>Starts<input type="date" id="cStart" value="'+esc(E.start||'')+'"></label><label>Ends<input type="date" id="cEnd" value="'+esc(E.end||'')+'"></label>'+
    '<div class="wide campaud"><span>For</span>'+CAMP_AUD.map(function(a){return '<label><input type="checkbox" data-caudin="'+a+'"'+((E.aud||[]).indexOf(a)>=0?' checked':'')+'> '+a+'</label>'}).join('')+'</div>'+
    '<label class="wide">Offer details<textarea id="cOffer" rows="4" maxlength="1500" placeholder="What the offer is and how it works">'+esc(E.offer||'')+'</textarea></label>'+
    '<label class="wide">Reward<input id="cReward" maxlength="200" value="'+esc(E.reward||'')+'" placeholder="e.g. Tk 20 per GA above target"></label>'+
    '<label class="wide">Who qualifies<input id="cRule" maxlength="200" value="'+esc(E.rule||'')+'" placeholder="e.g. RSSPs reaching 110% of GA target"></label>'+
    '<label class="wide">Pictures or PDF circulars (optional · select several at once · up to 12 files, 25 MB each)<input type="file" id="cFile" multiple accept="image/*,.pdf,application/pdf"></label>'+
    (src&&campFiles(E0||{}).length?'<div class="wide campkeep"><span>'+(editing?'Current attachments · untick to remove':'Attachments from the original · untick any you don\'t want')+'</span>'+campFiles(E0).map(function(f,i){return '<label><input type="checkbox" data-ckeep="'+i+'" checked> '+esc(f.name||('File '+(i+1)))+' <small>'+fmtBytes(f.size)+'</small></label>'}).join('')+'</div>':'')+
    '<div class="apbtns"><button class="btn" id="cSave">'+(editing?'Save changes':'Add campaign')+'</button>'+(src?'<button class="linkbtn" id="cCancel">Cancel</button>':'')+'</div>'+
    '<div class="approg" id="cProg" hidden><div class="track"><div class="fill" id="cFill"></div></div><span id="cPct">0%</span></div><div class="status" id="cStatus"></div></div></section>'}
function fileKind(f){var e=String(f.name||f.file||'').split('.').pop().toLowerCase(),t=f.type||'';
  return /^image\//.test(t)||/^(png|jpe?g|gif|webp|bmp|heic)$/.test(e)?'img':e==='pdf'||t==='application/pdf'?'pdf':/^video\//.test(t)||/^(mp4|webm|3gp|mov|mkv)$/.test(e)?'video':/^audio\//.test(t)||/^(mp3|m4a|wav|ogg|opus|aac|amr)$/.test(e)?'audio':/^(xlsx|xls|csv)$/.test(e)?'sheet':e==='txt'?'text':''}
function galleryLightbox(title,F,urlFn,start){
  var imgs=[];F.forEach(function(f,i){if(fileKind(f)==='img')imgs.push(i)});if(!imgs.length)return;var k=Math.max(0,imgs.indexOf(start));
  var d=document.createElement('div');d.className='lightbox';d.setAttribute('role','dialog');d.setAttribute('aria-label',title);
  d.innerHTML='<div class="lbbar"><b>'+esc(title)+'</b><span class="lbcount"></span><a class="btn lbdl">⬇ Download</a><button type="button" class="lbclose" aria-label="Close">✕</button></div><div class="lbimg"><img alt="'+esc(title)+'"></div>'+
    (imgs.length>1?'<button type="button" class="lbnav prev" aria-label="Previous picture">‹</button><button type="button" class="lbnav next" aria-label="Next picture">›</button>':'');
  var img=d.querySelector('.lbimg img'),dl=d.querySelector('.lbdl'),cnt=d.querySelector('.lbcount');
  var show=function(n){k=(n+imgs.length)%imgs.length;var i=imgs[k];img.src=urlFn(i);dl.href=urlFn(i)+'&dl=1';dl.setAttribute('download',F[i].name||F[i].file||'picture');cnt.textContent=imgs.length>1?(k+1)+' / '+imgs.length:''};
  var close=function(fromPop){if(!d.parentNode)return;d.remove();document.body.style.overflow='';window.removeEventListener('popstate',onPop);document.removeEventListener('keydown',onKey);if(!fromPop&&history.state&&history.state.lb)history.back()},
      onPop=function(){close(true)},onKey=function(e){if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(k-1);else if(e.key==='ArrowRight')show(k+1)};
  d.addEventListener('click',function(e){var nv=e.target.closest('.lbnav');if(nv){show(k+(nv.classList.contains('prev')?-1:1));return}if(e.target===d||e.target.classList.contains('lbimg')||e.target.closest('.lbclose'))close()});
  var sx=null,box=d.querySelector('.lbimg');
  box.addEventListener('touchstart',function(e){sx=e.touches.length===1&&(!window.visualViewport||window.visualViewport.scale<=1.01)?e.touches[0].clientX:null},{passive:true});
  box.addEventListener('touchend',function(e){if(sx==null||imgs.length<2)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)show(k+(dx<0?1:-1))},{passive:true});
  show(k);document.body.appendChild(d);document.body.style.overflow='hidden';
  try{history.pushState({lb:1},'')}catch(e){}window.addEventListener('popstate',onPop);document.addEventListener('keydown',onKey);
}
function campLightbox(c,start){galleryLightbox(c.title,campFiles(c),function(i){return campUrl(c,i)},start)}
function dlAll(F,urlFn){F.forEach(function(f,i){setTimeout(function(){var a=document.createElement('a');a.href=urlFn(i)+((f.size||0)<4*1024*1024?'&dl=1':'');a.download=f.name||f.file||'file';document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1000)},i*900)})}
function campSave(list){return apiSave({kind:'campaigns',data:{list:list}}).then(function(){S.camps={list:list};S.campEdit=S.campCopy=null;render()})}
function bindCamps(){
  var q=function(sel,fn){main.querySelectorAll(sel).forEach(fn)},L=campList(),find=function(id){return L.filter(function(c){return c.id===id})[0]},fail=function(e){var el=$('cStatus');if(el)setStatus('cStatus',(e&&e.message)||String(e),'err');else alert((e&&e.message)||e)};
  q('[data-cview]',function(b){b.addEventListener('click',function(){var c=find(b.getAttribute('data-cview'));if(c)campLightbox(c,+b.getAttribute('data-ci')||0)})});
  q('[data-cdlall]',function(b){b.addEventListener('click',function(){var c=find(b.getAttribute('data-cdlall'));if(!c)return;campFiles(c).forEach(function(f,i){setTimeout(function(){var a=document.createElement('a');a.href=campUrl(c,i)+'&dl=1';a.download=f.name||'file';document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1000)},i*900)})})});
  q('[data-cbrand]',function(b){b.addEventListener('click',function(){S.campBrand=b.getAttribute('data-cbrand');render()})});
  q('[data-caud]',function(b){b.addEventListener('click',function(){S.campAud=b.getAttribute('data-caud');render()})});
  var toForm=function(){var f=$('campForm');if(f)f.scrollIntoView({behavior:'smooth'})};
  q('[data-cedit]',function(b){b.addEventListener('click',function(){S.campEdit=b.getAttribute('data-cedit');S.campCopy=null;render();toForm()})});
  q('[data-ccopy]',function(b){b.addEventListener('click',function(){S.campCopy=b.getAttribute('data-ccopy');S.campEdit=null;render();toForm()})});
  q('[data-cstop]',function(b){b.addEventListener('click',function(){var c=find(b.getAttribute('data-cstop'));if(!c||!confirm('Stop '+c.title+' now? It will be marked as outdated.'))return;
    var y=new Date(Date.parse(dhakaToday()+'T00:00:00Z')-86400000).toISOString().slice(0,10);campSave(L.map(function(x){return x.id===c.id?Object.assign({},x,{end:y<x.start?x.start:y}):x})).catch(fail)})});
  q('[data-cdel]',function(b){b.addEventListener('click',function(){var c=find(b.getAttribute('data-cdel'));if(!c||!confirm('Delete '+c.title+'? This also removes its circular.'))return;campSave(L.filter(function(x){return x.id!==c.id})).catch(fail)})});
  var cc=$('cCancel');if(cc)cc.addEventListener('click',function(){S.campEdit=S.campCopy=null;render()});
  var sv=$('cSave');if(!sv)return;
  sv.addEventListener('click',function(){
    var g=function(id){return $(id).value.trim()},c={title:g('cTitle'),brand:g('cBrand'),type:g('cType'),start:g('cStart'),end:g('cEnd'),offer:$('cOffer').value.trim(),reward:g('cReward'),rule:g('cRule'),
      aud:CAMP_AUD.filter(function(a){var i=main.querySelector('[data-caudin="'+a+'"]');return i&&i.checked})};
    if(!c.title){setStatus('cStatus','Give the campaign a name.','err');return}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(c.start)||!/^\d{4}-\d{2}-\d{2}$/.test(c.end)){setStatus('cStatus','Pick the start and end dates.','err');return}
    if(c.end<c.start){setStatus('cStatus','The end date is before the start date.','err');return}
    var old=S.campEdit?find(S.campEdit):null;c.id=old?old.id:Date.now().toString(36)+Math.random().toString(36).slice(2,6);c.at=new Date().toISOString();
    var src=old||(S.campCopy?find(S.campCopy):null),keep=src?campFiles(src).filter(function(f,i){var x=main.querySelector('[data-ckeep="'+i+'"]');return !x||x.checked}):[];c.files=keep.slice();
    var put=function(){var list=old?L.map(function(x){return x.id===old.id?c:x}):L.concat([c]);setStatus('cStatus','Saving…');return campSave(list)};
    var fl=[].slice.call($('cFile').files||[]);
    if(keep.length+fl.length>12){setStatus('cStatus','Up to 12 attachments per campaign. You have '+(keep.length+fl.length)+'.','err');return}
    var big=fl.filter(function(f){return f.size>25*1024*1024})[0];if(big){setStatus('cStatus',big.name+' is over 25 MB.','err');return}
    sv.disabled=true;
    if(!fl.length){put().catch(function(e){sv.disabled=false;fail(e)});return}
    var safe=c.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'campaign',B;
    $('cProg').hidden=false;
    appsPost({kind:'check'}).then(function(ck){if(!ck.ok)throw new Error('the server cannot sign uploads ('+ck.error+')');return import('/vendor/blob-client.js')})
      .then(function(mod){B=mod;return fl.reduce(function(p,f,n){return p.then(function(){
        var ext=(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'')||'bin';
        setStatus('cStatus','Uploading '+(n+1)+' of '+fl.length+': '+f.name+' ('+fmtBytes(f.size)+')…');
        return B.uploadPresigned('rssp-data/campaigns/'+safe+'-'+Date.now().toString(36)+'-'+(n+1)+'.'+ext,f,{access:'private',handleUploadUrl:'/api/apps',headers:{'x-admin-key':S.adminKey||''},contentType:f.type||(ext==='pdf'?'application/pdf':'application/octet-stream'),
          onUploadProgress:function(pr){var v=Math.round(((n+(pr.percentage||0)/100)/fl.length)*100);$('cFill').style.width=v+'%';$('cPct').textContent=v+'%'}})
          .then(function(r){c.files.push({pathname:r.pathname,name:f.name,size:f.size,type:r.contentType||f.type||''})})})},Promise.resolve())})
      .then(put)
      .catch(function(e){sv.disabled=false;setStatus('cStatus','Could not save: '+((e&&e.message)||e),'err')});
  });
}
/* ---------- Attendance (IEMB app): RSSP Agents, RFOs and RSSP Supervisors ---------- */
var ATT_LATE=600,ATT_WARN=570;/* after 10:00 AM is flagged; 9:30 to 10:00 is amber */
function attSupName(n){var k=String(n||'').toLowerCase().replace(/[^a-z]/g,''),best='';Object.keys(DH_SUP).forEach(function(c){var s=DH_SUP[c],ks=s.toLowerCase().replace(/[^a-z]/g,'');if(k.indexOf(ks)===0||(k.length>6&&ks.indexOf(k)===0))best=s});return best}
function attMins(v){if(v==null||v==='')return null;if(v instanceof Date&&!isNaN(v))return v.getHours()*60+v.getMinutes();if(typeof v==='number')return v<1?Math.round(v*1440):null;var m=String(v).match(/(\d{1,2}):(\d{2})/);if(!m)return null;var h=+m[1];if(/pm/i.test(v)&&h<12)h+=12;if(/am/i.test(v)&&h===12)h=0;return h*60+(+m[2])}
function handleAttRows(rows,fileName){
  var H=rows[0].map(function(h){return String(h==null?'':h).trim()}),ix=function(n){return H.indexOf(n)};
  ['Designation','Employee Name','Primary Number','Date','Time','Status'].forEach(function(n){if(ix(n)<0)throw new Error('The attendance file is missing the column '+n+'.')});
  var I={ds:ix('Designation'),n:ix('Employee Name'),ph:ix('Primary Number'),d:ix('Date'),t:ix('Time'),st:ix('Status'),dh:ix('DH Name'),f:ix('Face Status'),sp:ix('Spoof Status'),lo:ix('Location Status'),di:ix('Distance')};
  var str=function(x){return x==null?'':String(x).trim()},P={},from='',to='';
  for(var i=1;i<rows.length;i++){var r=rows[i];if(!r)continue;var ds=str(r[I.ds]),n=str(r[I.n]).replace(/\s+RSSP(AG|DSO)_[\w]+$/i,'').replace(/\s{2,}/g,' ').trim(),role='',sup='';
    if(/^rssp agent$/i.test(ds))role='Agent';else if(/^rssp dso$/i.test(ds))role='RFO';else if(/territory supervisor,\s*rssp/i.test(ds)){role='SUP';sup=n}else if(/^supervisor$/i.test(ds)){sup=attSupName(n);if(sup)role='SUP'}
    if(!role)continue;var ph=phone10(r[I.ph]);if(!ph)continue;var h=idHash(ph),dh=str(r[I.dh]),rs=(dh.match(/^RSSP_(.+?)_[A-Za-z]+$/)||[])[1]||'';
    var p=P[h]||(P[h]={h:h,n:sup||n,r:role,dh:rs?'':dh,rs:rs,d:{}});if(rs&&!p.rs)p.rs=rs;
    var st=str(r[I.st]);if(/absent/i.test(st))continue;var dv=r[I.d],d=(dv instanceof Date)?rsspNormDate(new Date(dv.getTime()+12*3600000)):rsspNormDate(dv);if(!d||!/^\d{4}-\d{2}-\d{2}$/.test(d))continue;
    var mi=attMins(r[I.t]);if(mi==null)continue;var fl=(/not ok/i.test(str(r[I.lo]))?1:0)|(/not ok/i.test(str(r[I.sp]))?2:0)|(/not ok/i.test(str(r[I.f]))?4:0),km=(fl&1)&&I.di>=0?Math.round((+r[I.di]||0)/100)/10:0;
    if(!p.d[d]||mi<p.d[d][0])p.d[d]=[mi,fl,km];if(!from||d<from)from=d;if(!to||d>to)to=d}
  var ppl=Object.keys(P).map(function(k){return P[k]});if(!ppl.length)throw new Error('No RSSP Agent, RSSP DSO or RSSP Supervisor rows were found in this attendance file.');
  var cnt=function(r){return ppl.filter(function(p){return p.r===r}).length},lw=to;while(lw&&isOffDay(lw))lw=new Date(Date.parse(lw+'T00:00:00Z')-86400000).toISOString().slice(0,10);var late=ppl.filter(function(p){return p.d[lw]&&p.d[lw][0]>ATT_LATE}).length;
  setStatus('upStatus','Saving attendance…');
  return apiSave({kind:'attendance',data:{from:from,to:to,file:fileName||'',uploadedAt:new Date().toISOString(),ppl:ppl}}).then(loadData).then(function(){
    return 'Attendance saved for '+dlabel(from)+' to '+dlabel(to)+': '+cnt('Agent')+' Agents, '+cnt('RFO')+' RFOs, '+cnt('SUP')+' RSSP Supervisors. '+late+' checked in after 10:00 AM on '+dlabel(lw)+'. See the RFO, Agent and Supervisor.'})}
function attTime(m){if(m==null)return '–';var h=Math.floor(m/60),mi=m%60;return (h%12||12)+':'+(mi<10?'0':'')+mi+(h<12?' AM':' PM')}
function attCls(m){return m==null?'ab':m>ATT_LATE?'late':m>ATT_WARN?'warn':'ok'}
/* working days of the attendance file (Fridays off) */
function attDays(){var A=S.att;if(!A||!A.to)return [];var m=A.to.slice(0,7),out=[];for(var i=1;i<=+A.to.slice(8,10);i++){var d=m+'-'+(i<10?'0':'')+i;if(!isOffDay(d))out.push(d)}return out}
function attRsspMap(){var M={},nk=function(s){return String(s||'').toLowerCase().replace(/[^a-z]/g,'')},byName={};allCodes().forEach(function(c){var I=infoFor(c);byName[nk(I.name)]=c;if(RSSP_ALIAS[c])byName[nk(RSSP_ALIAS[c])]=c});
  var src=(S.meta&&S.meta.bps)||{};Object.keys(src).forEach(function(id){var p=phone10(id);if(p)M[idHash(p)]=topKey(src[id].rssp)});return {byHash:M,byName:byName,nk:nk}}
function attPeople(){var A=S.att;if(!A||!A.ppl)return null;if(S._attP&&S._attP.src===A&&S._attP.meta===S.meta)return S._attP.v;var RM=attRsspMap(),days=attDays(),last=days[days.length-1];
  var v=A.ppl.map(function(p){var code=(p.r!=='SUP'&&(RM.byName[RM.nk(p.rs)]||RM.byHash[p.h]))||'',I=code?infoFor(code):null,recs=days.map(function(d){return p.d[d]||null});
    var pres=recs.filter(Boolean),late=pres.filter(function(x){return x[0]>ATT_LATE}).length,warn=pres.filter(function(x){return x[0]>ATT_WARN&&x[0]<=ATT_LATE}).length,loc=pres.filter(function(x){return x[1]&1}).length,sp=pres.filter(function(x){return x[1]&6}).length;
    var ms=pres.map(function(x){return x[0]}).sort(function(a,b){return a-b}),med=ms.length?ms[Math.floor(ms.length/2)]:null;
    var sup=p.r==='SUP'?p.n:(I?supOfDh(I.distributor):'');
    return {h:p.h,name:p.n,role:p.r,code:code,rssp:I?I.name:(p.rs||p.dh||''),area:I?I.area:'',sup:sup,recs:recs,pres:pres.length,late:late,warn:warn,loc:loc,spoof:sp,med:med,last:p.d[last]||null}});
  v=v.filter(function(p){return p.pres>0&&p.r!=='RFO'&&p.role!=='RFO'});/* RFO attendance has no impact anywhere: only Agents (salary) and RSSP Supervisors (salary) are tracked */S._attP={src:A,meta:S.meta,v:v};return v}
function attForBp(bid){var P=attPeople();if(!P)return null;var p=phone10(bid);if(!p)return null;var h=idHash(p);for(var i=0;i<P.length;i++)if(P[i].h===h)return P[i];return null}
function attChip(x,d){return '<span class="attc '+attCls(x?x[0]:null)+'" title="'+dlabel(d)+(x?': '+attTime(x[0])+((x[1]&1)?' · location not OK'+(x[2]?' ('+x[2]+' km away)':''):'')+((x[1]&2)?' · spoof flag':'')+((x[1]&4)?' · face not matched':''):': no check-in')+'">'+(x?attTime(x[0]).replace(' AM','').replace(' PM','p'):'–')+((x&&(x[1]&6))?'!':'')+'</span>'}
function attLegend(){return '<div class="attleg"><span class="attc ok">9:05</span> by 9:30 AM <span class="attc warn">9:45</span> 9:30 to 10:00 <span class="attc late">10:20</span> after 10:00 AM <span class="attc ab">–</span> no check-in <span class="note">! = spoof or face flag</span></div>'}
/* the shared log section: people of one or more roles */
function attSection(roles,title,opts){if(S.preview)return '';
  opts=opts||{};var P=attPeople(),A=S.att;if(!P)return '<section class="section"><div class="sechead"><h2>'+title+'</h2></div><div class="panel empty"><p class="note">'+(S.canEdit?'Upload the IEMB Attendance Report in Upload &amp; Targets to see check-in times.':'Attendance has not been uploaded yet.')+'</p></div></section>';
  var days=attDays(),last=days[days.length-1],L=P.filter(function(p){return roles.indexOf(p.role)>=0&&(S.area==='All'||!p.area||p.area===S.area)});if(opts.filter)L=L.filter(opts.filter);
  if(!L.length)return '';var W=days.length;
  var lateNow=L.filter(function(p){return p.last&&p.last[0]>ATT_LATE}).sort(function(a,b){return b.last[0]-a.last[0]}),none=L.filter(function(p){return !p.last}),onT=L.filter(function(p){return p.last&&p.last[0]<=ATT_LATE});
  var allPres=L.reduce(function(a,p){return a+p.pres},0),allLate=L.reduce(function(a,p){return a+p.late},0);
  var h='<section class="section" id="'+(opts.id||'')+'"><div class="sechead"><h2>'+title+'</h2><span class="note">IEMB check-in · '+dlabel(days[0])+' to '+dlabel(last)+' · '+W+' working days · after 10:00 AM is flagged</span></div>';
  h+='<div class="kpis">'+kpi('Checked in by 10:00 AM on '+dlabel(last),fmt(onT.length)+'<span style="font-size:1.1rem;color:var(--muted)"> / '+L.length+'</span>',pct(L.length?onT.length/L.length:null)+' on time')+
    kpi('After 10:00 AM on '+dlabel(last),'<span style="color:#B42318">'+fmt(lateNow.length)+'</span>',lateNow.length?'Flagged below':'Nobody late')+
    kpi('No check-in on '+dlabel(last),fmt(none.length),none.length?'Absent or forgot to punch':'Everyone checked in')+
    kpi('After 10:00 AM this month',pct(allPres?allLate/allPres:null),fmt(allLate)+' of '+fmt(allPres)+' check-ins')+'</div>';
  var who=function(p){return '<span class="rpill '+(p.role==='RFO'?'rf':p.role==='Agent'?'ag':'')+'">'+(p.role==='SUP'?'SUP':p.role)+'</span> '+esc(p.name)+(p.role!=='SUP'&&p.rssp?' <small>'+esc(p.rssp)+'</small>':'')};
  if(lateNow.length||none.length)h+='<div class="attflags">'+
    (lateNow.length?'<div class="actbox crit"><div class="actt"><b>⏰ Checked in after 10:00 AM on '+dlabel(last)+'</b><span class="acount">'+lateNow.length+'</span></div><div class="achips">'+lateNow.map(function(p){return '<span class="achip">'+who(p)+' <b class="attlate">'+attTime(p.last[0])+'</b></span>'}).join('')+'</div></div>':'')+
    (none.length?'<div class="actbox warn"><div class="actt"><b>No check-in on '+dlabel(last)+'</b><span class="acount">'+none.length+'</span></div><div class="achips">'+none.map(function(p){return '<span class="achip">'+who(p)+'</span>'}).join('')+'</div></div>':'')+'</div>';
  var ord=L.slice().sort(function(a,b){return b.late-a.late||(b.med||0)-(a.med||0)||a.name.localeCompare(b.name)}),n7=Math.min(7,W),d7=days.slice(-n7);
  h+='<div class="tablebox"><table class="compact lb ctr"><thead><tr><th class="name l">Name</th>'+(roles.length>1?'<th>Role</th>':'')+(opts.noRssp?'':'<th class="l">RSSP</th>')+'<th>Present</th><th>After 10 AM</th><th>Typical check-in</th><th>Location not OK</th>'+d7.map(function(d){return '<th class="d5">'+dlabel(d)+'</th>'}).join('')+'</tr></thead><tbody>'+
    ord.map(function(p){return '<tr><td class="name l"><b>'+esc(p.name)+'</b></td>'+(roles.length>1?'<td><span class="rpill '+(p.role==='RFO'?'rf':p.role==='Agent'?'ag':'')+'">'+p.role+'</span></td>':'')+(opts.noRssp?'':'<td class="l">'+(p.code?'<button class="linkbtn" data-open="'+esc(p.code)+'">'+esc(p.rssp)+'</button>':esc(p.rssp||'–'))+'</td>')+
      '<td><span class="pill '+(p.pres/W>=.9?'good':p.pres/W>=.75?'warn':'crit')+'">'+p.pres+' / '+W+'</span></td><td>'+(p.late?'<span class="pill crit">'+p.late+'</span>':'<span class="pill good">0</span>')+'</td><td>'+(p.med!=null?'<span class="attc '+attCls(p.med)+'">'+attTime(p.med)+'</span>':'–')+'</td><td>'+(p.loc?p.loc:'–')+'</td>'+
      d7.map(function(d){return '<td class="d5">'+attChip(p.recs[days.indexOf(d)],d)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
  /* full day by day log */
  h+='<details class="attlog"><summary>Day-by-day log · all '+W+' working days</summary><div class="tablebox"><table class="compact lb ctr attgrid"><thead><tr><th class="name l">Name</th>'+days.map(function(d){return '<th class="d5">'+(+d.slice(8,10))+'</th>'}).join('')+'</tr></thead><tbody>'+
    ord.map(function(p){return '<tr><td class="name l">'+esc(p.name)+'</td>'+p.recs.map(function(x,i){return '<td class="d5">'+attChip(x,days[i])+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div></details>';
  h+=attLegend()+'<p class="note"><span>Time is the first check-in of the day in the IEMB app. “Location not OK” = the app placed them away from their assigned point. Fridays are off and not counted.</span> <span>Attendance file:</span> '+esc(A.file||'')+'</p></section>';
  return h}
/* team check-in by SUP (Agents and RFOs of each SUP's RSSPs) */
function attTeamBySup(){var P=attPeople();if(!P)return '';var days=attDays(),last=days[days.length-1],T={};
  P.forEach(function(p){if(p.role==='SUP'||!p.sup||p.sup===NO_SUP)return;if(S.area!=='All'&&p.area&&p.area!==S.area)return;var t=T[p.sup]||(T[p.sup]={n:0,pres:0,late:0,lateNow:0,none:0});t.n++;t.pres+=p.pres;t.late+=p.late;if(p.last&&p.last[0]>ATT_LATE)t.lateNow++;if(!p.last)t.none++});
  var ks=Object.keys(T).sort(function(a,b){return (T[b].late/Math.max(1,T[b].pres))-(T[a].late/Math.max(1,T[a].pres))});if(!ks.length)return '';
  return '<section class="section"><div class="sechead"><h2>Team check-in by SUP</h2><span class="note">Agents at each SUP’s RSSPs · worst first</span></div><div class="tablebox"><table class="compact lb ctr"><thead><tr><th class="name l">SUP</th><th>Team</th><th>After 10 AM on '+dlabel(last)+'</th><th>No check-in on '+dlabel(last)+'</th><th>After 10 AM this month</th><th>Attendance</th></tr></thead><tbody>'+
    ks.map(function(k){var t=T[k],r=t.pres?t.late/t.pres:0;return '<tr><td class="name l"><b>'+esc(k)+'</b></td><td>'+t.n+'</td><td>'+(t.lateNow?'<span class="pill crit">'+t.lateNow+'</span>':'0')+'</td><td>'+(t.none?'<span class="pill warn">'+t.none+'</span>':'0')+'</td><td><span class="pill '+(r<=.1?'good':r<=.25?'warn':'crit')+'">'+pct(r)+'</span></td><td>'+pct(t.pres/Math.max(1,t.n*days.length))+'</td></tr>'}).join('')+'</tbody></table></div></section>'}
/* RSSP detail: this RSSP's Agent and RFO */
function attForRssp(code){var P=attPeople();if(!P)return '';var L=P.filter(function(p){return p.code===code&&p.role!=='SUP'});if(!L.length)return '';var days=attDays(),d10=days.slice(-10);
  return '<section class="section"><div class="sechead"><h2>Attendance</h2><span class="note">IEMB check-in, last '+d10.length+' working days · after 10:00 AM in red</span></div><div class="tablebox"><table class="compact lb ctr"><thead><tr><th class="name l">Name</th><th>Role</th><th>Present</th><th>After 10 AM</th>'+d10.map(function(d){return '<th class="d5">'+dlabel(d)+'</th>'}).join('')+'</tr></thead><tbody>'+
    L.map(function(p){return '<tr><td class="name l"><b>'+esc(p.name)+'</b></td><td><span class="rpill '+(p.role==='RFO'?'rf':'ag')+'">'+p.role+'</span></td><td>'+p.pres+' / '+days.length+'</td><td>'+(p.late?'<span class="pill crit">'+p.late+'</span>':'0')+'</td>'+d10.map(function(d){return '<td class="d5">'+attChip(p.recs[days.indexOf(d)],d)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'+attLegend()+'</section>'}
/* ---------- Morning Brief, Stars of the week, Month report ---------- */
function briefLastGA(r){return (r.last.robi||0)+(r.last.airtel||0)}
function sumDays(arr,fn){return arr.reduce(function(a,d){return a+fn(d)},0)}
/* Stars of the week: last 7 days of data, whole region */
function computeStars(rows,cal){
  if(!cal||!rows.length)return null;var win=cal.dates.slice(-7),n=win.length,first=win[0],last=win[n-1];
  var gaOf=function(d){return (d.robi||0)+(d.airtel||0)};
  var R=rows.map(function(r){var w=r.daily.slice(-n),p=r.daily.slice(-2*n,-n);return {code:r.code,name:r.name,area:r.area,v:sumDays(w,gaOf),prev:p.length===n?sumDays(p,gaOf):null}}).filter(function(x){return x.v>0}).sort(function(a,b){return b.v-a.v||a.name.localeCompare(b.name)});
  var src=(S.meta&&S.meta.bps)||{},BP=[];Object.keys(src).forEach(function(id){var b=src[id];if(!b.names)return;var role=b.role||topKey(b.roles)||'Other',v=win.reduce(function(a,d){return a+((b.days||{})[d]||0)},0),act=win.filter(function(d){return ((b.days||{})[d]||0)>0}).length;if(!v)return;var main=topKey(b.rssp);
    BP.push({id:id,name:topKey(b.names),role:role,rssp:main?infoFor(main).name:'',code:main,v:v,act:act})});
  BP.sort(function(a,b){return b.v-a.v||b.act-a.act||a.name.localeCompare(b.name)});
  /* attendance rule: an RFO or Agent can only win with no check-in after 10:00 AM and no missed check-in on the week's working days */
  var AT=(typeof attPeople==='function')?attPeople():null,aw=[];if(AT&&S.att){var ad=attDays();aw=win.filter(function(d){return !isOffDay(d)&&ad.indexOf(d)>=0})}
  var rule=AT&&aw.length>0,skip={RFO:[],Agent:[]};
  if(rule)BP.forEach(function(b){if(b.role!=='Agent')return;var p=attForBp(b.id);if(!p){b.why='not in the attendance file';return}var ad=attDays(),late=0,miss=0;aw.forEach(function(d){var x=p.recs[ad.indexOf(d)];if(!x)miss++;else if(x[0]>ATT_LATE)late++});b.late=late;b.miss=miss;
    if(late||miss)b.why=[late?late+' check-in'+(late>1?'s':'')+' after 10:00 AM':'',miss?miss+' day'+(miss>1?'s':'')+' without check-in':''].filter(Boolean).join(' and ')});
  var okB=function(b){return !rule||!b.why};
  var RF=[],AG=[];BP.forEach(function(b){if((b.role==='RFO'||b.role==='Agent')&&okB(b))(b.role==='RFO'?RF:AG).push(b)});
  if(rule)['Agent'].forEach(function(ro){var L=ro==='RFO'?RF:AG,thr=L.length?L[Math.min(2,L.length-1)].v:0;skip[ro]=BP.filter(function(b){return b.role===ro&&b.why&&b.v>thr}).slice(0,3)});
  var RD=[],bw=null;if(S.bike&&S.bike.map&&S.bike.data){var br=bikeRows()||[],bd=bikeDates(),L=bikeLastIdx(bd),idx=[];for(var i=L;i>=0&&idx.length<7;i--)idx.unshift(i);
    bw={from:bd[idx[0]],to:bd[L]};
    br.forEach(function(r){if(!r.km||!r.assigned||/unassigned/i.test(r.user))return;var km=0,ok=0,el=0;idx.forEach(function(i){var s=r.st[i];if(s==='off'||s==='fault'||s==='pre')return;el++;km+=r.km[i]||0;if(s==='ok')ok++});if(!el||!km)return;RD.push({id:r.id,name:r.user,dh:r.dh,v:km,ok:ok,el:el,all:ok===el})});
    RD.sort(function(a,b){return (b.all-a.all)||b.v-a.v})}
  return {rule:rule,aw:aw,skip:skip,from:first,to:last,days:n,rssp:R.slice(0,3),rfo:RF.slice(0,3),agent:AG.slice(0,3),rider:RD.slice(0,3),bw:bw,
    ids:{rssp:R[0]&&R[0].code,rfo:RF[0]&&RF[0].id,agent:AG[0]&&AG[0].id,rider:RD[0]&&RD[0].id}}}
function starsNow(){var cal=calendar();if(!cal)return null;var k=S.month+'|'+cal.end+'|'+(S.bike&&S.bike.data&&S.bike.data.through)+'|'+(S.meta&&S.meta.uploadedAt)+'|'+(S.att&&S.att.uploadedAt);if(S._stars&&S._stars.k===k)return S._stars.v;var v=computeStars(computeRows(),cal);S._stars={k:k,v:v};return v}
function starTag(kind,id){var s=starsNow();if(!s||!id)return '';var on=kind==='bp'?(s.ids.rfo===id||s.ids.agent===id):s.ids[kind]===id;return on?' <span class="startag" title="Star of the week">⭐</span>':''}
function starsSection(s){
  if(!s)return '';var rng=dlabel(s.from)+' to '+dlabel(s.to);
  var card=function(icon,title,list,unit,sub){if(!list.length)return '';var w=list[0];
    return '<div class="starcard"><div class="starhead"><span class="staricon" aria-hidden="true">'+icon+'</span><span>'+title+'</span></div><div class="starname">'+esc(w.name)+'</div><div class="starsub">'+sub(w)+'</div><div class="starval"><b>'+fmt(w.v)+'</b> '+unit+'</div>'+
      (list.length>1?'<ol class="starrun" start="2">'+list.slice(1).map(function(x){return '<li>'+esc(x.name)+' <span>'+fmt(x.v)+' '+unit+'</span></li>'}).join('')+'</ol>':'')+'</div>'};
  var h='<section class="section"><div class="sechead"><h2>Stars of the week</h2><span class="note">Last 7 days · '+rng+' · picked automatically from the data</span></div><div class="stargrid">'+
    card('🏆','RSSP of the week',s.rssp,'GA',function(w){return esc(w.area)+(w.prev!=null&&w.prev?' · '+(w.v>=w.prev?'▲ ':'▼ ')+Math.abs(Math.round((w.v/w.prev-1)*100))+'% vs the week before':'')})+
    card('⭐','RFO of the week',s.rfo,'GA',function(w){return esc(w.rssp)+' · sold on '+w.act+' of '+s.days+' days'})+
    card('⭐','Agent of the week',s.agent,'GA',function(w){return esc(w.rssp)+' · sold on '+w.act+' of '+s.days+' days'+(s.rule?' · on time every working day':'')})+
    card('🏍️','Rider of the week',s.rider,'KM',function(w){return esc(w.dh)+' · '+(w.all?'every working day ≥3 KM':w.ok+' of '+w.el+' days ≥3 KM')})+
    '</div>'+(s.rule?'<p class="note"><span>Attendance rule for Agents: an Agent wins only with no check-in after 10:00 AM and no missed check-in on the '+s.aw.length+' working days of the week (IEMB). RFOs are picked on numbers only.</span>'+(s.skip.RFO.concat(s.skip.Agent).length?' <span>Higher sellers skipped this week:</span> '+s.skip.RFO.concat(s.skip.Agent).map(function(b){return esc(b.role)+' '+esc(b.name)+' ('+fmt(b.v)+' GA, '+esc(b.why)+')'}).join('; ')+'.':'')+'</p>':'<p class="note">Upload the IEMB attendance file to apply the on-time rule to RFO and Agent stars.</p>')+'<p class="note">The ⭐ also shows next to their names in Leaderboard, RFO &amp; Agent and Bike Detail.</p></section>';
  return h}
/* Weekly digest (admin): last 7 days of data against the 7 days before, ready to send on WhatsApp */
function weeklyDigest(f,cal,st){
  if(!cal||cal.dates.length<2)return null;var n=Math.min(7,cal.dates.length),win=cal.dates.slice(-n),from=win[0],to=win[n-1];
  var gaOf=function(d){return (d.robi||0)+(d.airtel||0)},hasPrev=cal.dates.length>=2*n;
  var live=f.filter(function(r){return !r.silent});
  var W=live.map(function(r){var w=r.daily.slice(-n),pv=r.daily.slice(-2*n,-n);return {code:r.code,name:r.name,v:sumDays(w,gaOf),p:hasPrev?sumDays(pv,gaOf):null,rep:sumDays(w,function(d){return d.rep||0}),fwa:sumDays(w,function(d){return d.wifi||0}),zero:w.filter(function(d){return gaOf(d)===0}).length}});
  var ga=W.reduce(function(a,x){return a+x.v},0),gp=hasPrev?W.reduce(function(a,x){return a+x.p},0):null,rep=W.reduce(function(a,x){return a+x.rep},0),fwa=W.reduce(function(a,x){return a+x.fwa},0);
  var weak=W.slice().sort(function(a,b){return a.v-b.v||a.name.localeCompare(b.name)}).slice(0,3);
  var imp=hasPrev?W.filter(function(x){return x.p>=10}).map(function(x){x.g=x.v/x.p-1;return x}).sort(function(a,b){return b.g-a.g})[0]:null;
  var zd=W.filter(function(x){return x.zero>=2}).sort(function(a,b){return b.zero-a.zero});
  /* late check-ins in the week */
  var LT=null,AP=attPeople();if(AP){var ad=attDays(),idx=win.map(function(d){return ad.indexOf(d)}).filter(function(i){return i>=0&&!isOffDay(ad[i])});
    if(idx.length){var tot=0,rep2=[];AP.forEach(function(p){if(S.area!=='All'&&p.area&&p.area!==S.area)return;var c=0;idx.forEach(function(i){var x=p.recs[i];if(x&&x[0]>ATT_LATE)c++});tot+=c;if(c>=2)rep2.push({p:p,c:c})});rep2.sort(function(a,b){return b.c-a.c});LT={days:idx.length,tot:tot,rep:rep2}}}
  /* bikes: share of bike-days at 3 KM or more */
  var BK=null;if(S.bike&&S.bike.map&&S.bike.data){var br=bikeFiltered(bikeRows()||[]),bd=bikeDates(),L=bikeLastIdx(bd),ix=[];for(var i=L;i>=0&&ix.length<7;i--)ix.unshift(i);var ok=0,el=0;
    br.forEach(function(r){if(!r.assigned)return;ix.forEach(function(i){var s2=r.st[i];if(s2==='ok'||s2==='low'||s2==='zero'||s2==='nodata'){el++;if(s2==='ok')ok++}})});if(el)BK={ok:ok,el:el,from:bd[ix[0]],to:bd[L]}}
  var tg=f.reduce(function(a,r){return a+(r.tgt||0)},0),gaM=f.reduce(function(a,r){return a+r.ga},0);
  var gr=function(v,p){return p?(v>=p?'▲ ':'▼ ')+Math.abs(Math.round((v/p-1)*100))+'%':''};
  var t=['*Weekly digest · '+dlabel(from)+' to '+dlabel(to)+'*','RSSP · '+(S.area==='All'?'Chandpur Region':S.area),'',
    '*GA:* '+fmt(ga)+(gp!=null?' ('+gr(ga,gp)+' vs the week before, '+fmt(gp)+')':''),'*Replacement:* '+fmt(rep)+' · *FWA:* '+fmt(fwa),'*GA month to date:* '+fmt(gaM)];/* targets stay private: never in the shared text */
  if(BK)t.push('*Bikes ≥3 KM:* '+pct(BK.ok/BK.el)+' of bike days');
  if(st){t.push('','*Stars of the week*');if(st.rssp[0])t.push('🏆 RSSP: '+st.rssp[0].name+' · '+fmt(st.rssp[0].v)+' GA');if(st.rfo[0])t.push('⭐ RFO: '+st.rfo[0].name+' ('+st.rfo[0].rssp+') · '+fmt(st.rfo[0].v)+' GA');if(st.agent[0])t.push('⭐ Agent: '+st.agent[0].name+' ('+st.agent[0].rssp+') · '+fmt(st.agent[0].v)+' GA');if(st.rider[0])t.push('🏍️ Rider: '+st.rider[0].name+' · '+fmt(st.rider[0].v)+' KM')}
  if(imp)t.push('','*Most improved:* '+imp.name+' · '+fmt(imp.v)+' GA ('+gr(imp.v,imp.p)+')');
  t.push('','*Needs a push:*');weak.forEach(function(x,i){t.push((i+1)+'. '+x.name+' · '+fmt(x.v)+' GA'+(x.p!=null?' ('+gr(x.v,x.p)+')':''))});
  t.push('','Dashboard: '+location.origin);
  /* ---- page view: coloured cards, day by day bars, four ranked lists, SUP table ---- */
  var gpill=function(v,p){if(p==null)return '';if(!p)return v?'<span class="gr up">New</span>':'';var g=Math.round((v/p-1)*100);return g===0?'<span class="gr flat">0%</span>':'<span class="gr '+(g>0?'up':'down')+'">'+(g>0?'▲ ':'▼ ')+Math.abs(g)+'%</span>'};
  var gtone=function(v,p){return p==null||!p?'info':v>=p?'good':v>=p*.9?'warn':'bad'};
  var pv=function(fn){return hasPrev?live.reduce(function(a,r){return a+sumDays(r.daily.slice(-2*n,-n),fn)},0):null};
  var repP=pv(function(d){return d.rep||0}),fwaP=pv(function(d){return d.wifi||0});
  var zdays=W.reduce(function(a,x){return a+x.zero},0);
  var cards='<div class="kpis">'+
    kpi('GA this week',fmt(ga),(gp!=null?gpill(ga,gp)+' vs '+fmt(gp)+' the week before':'First week of data'),gtone(ga,gp))+
    kpi('GA per day',(ga/n).toFixed(0),gp!=null?'Week before '+(gp/n).toFixed(0)+' a day':n+' days',gtone(ga,gp))+
    kpi('Replacement',fmt(rep),repP!=null?gpill(rep,repP)+' vs '+fmt(repP):'',gtone(rep,repP))+
    kpi('FWA',fmt(fwa),fwaP!=null?gpill(fwa,fwaP)+' vs '+fmt(fwaP):'',gtone(fwa,fwaP))+
    (BK?kpi('Bikes ≥3 KM',pct(BK.ok/BK.el),fmt(BK.ok)+' of '+fmt(BK.el)+' bike days',BK.ok/BK.el>=.9?'good':BK.ok/BK.el>=.75?'warn':'bad'):'')+
    '</div>';
  /* day by day: this week against the same weekday a week earlier */
  var dayV=function(i){return live.reduce(function(a,r){var d=r.daily[r.daily.length-n+i];return a+(d?gaOf(d):0)},0)},dayP=function(i){if(!hasPrev)return null;return live.reduce(function(a,r){var d=r.daily[r.daily.length-2*n+i];return a+(d?gaOf(d):0)},0)};
  var DV=[],mx=1;for(var q=0;q<n;q++){var a1=dayV(q),b1=dayP(q);DV.push([a1,b1]);mx=Math.max(mx,a1,b1||0)}
  var WDN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var bars='<div class="wkbars">'+DV.map(function(x,q){var d=win[q],wd=WDN[new Date(d+'T00:00:00Z').getUTCDay()],off=isOffDay(d);return '<div class="wkday'+(off?' off':'')+'"><div class="wkcol"><i class="pv" style="height:'+(x[1]==null?0:Math.round(x[1]/mx*100))+'%" title="Week before: '+(x[1]==null?'–':fmt(x[1]))+'"></i><i class="cv" style="height:'+Math.round(x[0]/mx*100)+'%" title="'+dlabel(d)+': '+fmt(x[0])+' GA"></i></div><b>'+fmt(x[0])+'</b><span>'+wd+' '+(+d.slice(8))+'</span></div>'}).join('')+'</div>'+
    '<div class="legend" style="margin-top:4px"><span><i class="sw" style="background:#2E9CF4"></i>This week</span>'+(hasPrev?'<span><i class="sw" style="background:#C9D5E2"></i>Same day a week before</span>':'')+'</div>';
  /* four ranked lists */
  var withP=hasPrev?W.filter(function(x){return x.p>=10}).map(function(x){x.g=x.v/x.p-1;return x}):[];
  var top=W.slice().sort(function(a,b){return b.v-a.v}).slice(0,3),up=withP.slice().sort(function(a,b){return b.g-a.g}).filter(function(x){return x.g>0}).slice(0,3),down=withP.slice().sort(function(a,b){return a.g-b.g}).filter(function(x){return x.g<0}).slice(0,3);
  var item=function(x){return '<li><button class="linkbtn" data-open="'+esc(x.code)+'">'+esc(x.name)+'</button><span><b>'+fmt(x.v)+'</b> GA '+gpill(x.v,x.p)+'</span></li>'};
  var box=function(title,cls,L,empty){return '<div class="panel briefbox '+cls+'"><h3>'+title+'</h3>'+(L.length?'<ol class="brieflist">'+L.map(item).join('')+'</ol>':'<p class="note">'+empty+'</p>')+'</div>'};
  var lists='<div class="wklists">'+box('🏆 Top this week','good',top,'No sales yet')+box('📈 Most improved','good',up,hasPrev?'Nobody grew this week':'Needs two full weeks of data')+box('📉 Biggest drop','crit',down,hasPrev?'Nobody dropped this week':'Needs two full weeks of data')+box('📣 Needs a push','crit',weak,'None')+'</div>';
  /* SUP view */
  var SG={};live.forEach(function(r){var u=supOfDh(r.distributor),x=SG[u]||(SG[u]={n:0,v:0,p:0,z:0});var w=W.filter(function(y){return y.code===r.code})[0];x.n++;x.v+=w.v;x.p+=w.p||0;x.z+=w.zero});
  var sups=Object.keys(SG).sort(function(a,b){return SG[b].v-SG[a].v});
  var supT='<div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>RSSPs</th><th>GA this week</th>'+(hasPrev?'<th>Week before</th><th>Growth</th>':'')+'<th>GA per RSSP</th></tr></thead><tbody>'+
    sups.map(function(u){var x=SG[u];return '<tr><td class="name"><b>'+esc(u)+'</b></td><td>'+x.n+'</td><td><b>'+fmt(x.v)+'</b></td>'+(hasPrev?'<td>'+fmt(x.p)+'</td><td>'+gpill(x.v,x.p)+'</td>':'')+'<td>'+(x.v/x.n).toFixed(1)+'</td></tr>'}).join('')+
    '<tr class="tot"><td class="name"><b>Total</b></td><td>'+live.length+'</td><td><b>'+fmt(ga)+'</b></td>'+(hasPrev?'<td>'+fmt(gp)+'</td><td>'+gpill(ga,gp)+'</td>':'')+'<td>'+(live.length?(ga/live.length).toFixed(1):'–')+'</td></tr></tbody></table></div>';
  var chips=function(L,fm,cls){return '<div class="achips">'+L.map(function(x){return '<span class="achip '+cls+'">'+fm(x)+'</span>'}).join('')+'</div>'};
  var h='<section class="section" id="wkDigest"><div class="sechead"><h2>Weekly digest</h2><span class="note">'+dlabel(from)+' to '+dlabel(to)+' vs the 7 days before · only you see this</span></div>'+cards+'</section>'+
    '<section class="section"><div class="sechead"><h2 style="font-size:1.05rem">GA day by day</h2></div><div class="panel">'+bars+'</div></section>'+
    '<section class="section">'+lists+'</section>'+
    '<section class="section"><div class="sechead"><h2 style="font-size:1.05rem">SUP this week</h2></div>'+supT+'</section>'+
    '<section class="section"><div class="sharerow" style="justify-content:flex-start;margin:0"><button class="wabtn" type="button" data-wkshare>'+WA_ICON+' Send weekly digest</button><button class="imgbtn" type="button" data-wkcopy>Copy text</button></div></section>';
  /* the WhatsApp text gets the top three and the SUP lines too */
  var add=['','*Top this week:*'].concat(top.map(function(x,k){return (k+1)+'. '+x.name+' · '+fmt(x.v)+' GA'+(x.p!=null&&x.p?' ('+gr(x.v,x.p)+')':'')}));
  add.push('','*SUP this week:*');sups.forEach(function(u){var x=SG[u];add.push(u+' · '+fmt(x.v)+' GA'+(hasPrev&&x.p?' ('+gr(x.v,x.p)+')':''))});
  var tail=t.splice(t.length-2,2);t=t.concat(add,tail);
  return {html:h,text:t.join('\n')};
}
function viewBrief(rows,f,cal){
  var ad=S.canEdit,day=cal.end,dl=dlabel(day),ago=daysBetween(day,dhakaToday());
  var gaL=f.reduce(function(a,r){return a+briefLastGA(r)},0),gaM=f.reduce(function(a,r){return a+r.ga},0);
  var prevD=f.reduce(function(a,r){var d=r.daily[r.daily.length-2];return a+(d?(d.robi||0)+(d.airtel||0):0)},0),avg7=f.reduce(function(a,r){return a+sumDays(r.daily.slice(-7),function(d){return (d.robi||0)+(d.airtel||0)})},0)/Math.min(7,cal.elapsed);
  var repL=f.reduce(function(a,r){return a+(r.last.rep||0)},0),repM=f.reduce(function(a,r){return a+r.rep},0),fwL=f.reduce(function(a,r){return a+(r.last.wifi||0)},0),fwM=f.reduce(function(a,r){return a+r.wifi},0);
  var act=f.filter(function(r){return r.last.t>0}).length,lmG=f.every(function(r){return r.lmGa!=null})?f.reduce(function(a,r){return a+r.lmGa},0):null;
  var tg=f.reduce(function(a,r){return a+(r.tgt||0)},0),need=tg?Math.max(0,tg-gaM)/Math.max(1,cal.remaining):null,proj=gaM/cal.elapsed*cal.dim;
  /* bikes */
  var BK=null;if(S.bike&&S.bike.map&&S.bike.data){var br=bikeFiltered(bikeRows()||[]),bd=bikeDates(),bl=bikeLastIdx(bd),ok=0,el=0,zero=[];
    br.forEach(function(r){var s=r.st[bl];if(s==='ok'||s==='low'||s==='zero'||s==='nodata'){el++;if(s==='ok')ok++}if((s==='zero'||s==='nodata')&&r.assigned)zero.push(r)});BK={day:bd[bl],ok:ok,el:el,zero:zero}}
  /* stock */
  var SK=null,K=S.stock&&S.stock.latest;if(K&&(K.v===3||K.v===4)){if(K.v===3)K=stkV3(K);var byC={};rows.forEach(function(r){byC[r.code]=r});var LV=stkLive(K,rows,byC),RS=LV.RS.filter(function(x){return S.area==='All'||x.area===S.area});SK={date:K.date,all:RS.length,fail:RS.filter(function(x){return !x.ok}),zero:RS.filter(function(x){return x.zero.length})}}
  /* campaigns ending within 3 days */
  var today=dhakaToday(),CE=campList().map(function(c){return {c:c,s:campState(c,today)}}).filter(function(x){return x.s.k==='run'&&x.s.left<=3}).sort(function(a,b){return a.s.left-b.s.left});
  var hasRole=f.some(function(r){return r.daily.some(function(d){return (d.rfo||0)+(d.agent||0)>0})});
  var zGA=f.filter(function(r){return briefLastGA(r)===0}).sort(function(a,b){return a.ga-b.ga}),zRFO=hasRole?f.filter(function(r){return briefLastGA(r)>0&&(r.last.rfo||0)===0}):[];
  var live=f.filter(function(r){return !r.silent}),top=live.slice().sort(function(a,b){return briefLastGA(b)-briefLastGA(a)||b.ga-a.ga}).slice(0,3),bot=live.slice().sort(function(a,b){return briefLastGA(a)-briefLastGA(b)||(a.pace!=null&&b.pace!=null?a.pace-b.pace:a.ga-b.ga)}).slice(0,3);
  var DSb=null,h=(DSb?'<section class="section"><div class="sechead"><h2>Data status</h2><span class="note">'+(DSb.late?DSb.late+' file'+(DSb.late>1?'s need':' needs')+' a fresh upload':'Everything is up to date')+' · <button class="linkbtn" data-goto="setup">Upload</button></span></div>'+DSb.html+'</section>':'')+'<section class="section"><div class="sechead"><h2>Morning brief · '+dl+'</h2><span class="note">'+(ago<=1?'Yesterday\'s numbers':'Latest day in the file')+' and what needs action today</span></div>'+waButton()+'<div class="kpis">'+
    kpi('GA on '+dl,fmt(gaL),'Day before '+fmt(prevD)+' · 7-day avg '+fmt(avg7))+
    kpi('RSSP GA, month to date',fmt(gaM),(lmG!=null?grBadge(gaM,lmG):'Day '+cal.elapsed+' of '+cal.dim))+
    (ad&&tg?kpi('Target achievement',pct(gaM/tg),'Target '+fmt(tg)+' · needs '+fmt(need)+'/day',achTone(gaM/tg,cal.tg)):kpi('Projected month-end',fmt(proj),'At '+fmt(gaM/cal.elapsed)+' a day'))+
    kpi('Active RSSPs on '+dl,fmt(act)+'<span style="font-size:1.1rem;color:var(--muted)"> / '+f.length+'</span>',fmt(f.length-act)+' with no transaction')+
    kpi('Replacement on '+dl,fmt(repL),fmt(repM)+' month to date')+
    kpi('FWA on '+dl,fmt(fwL),fmt(fwM)+' month to date')+
    (BK?kpi('Bikes ≥3 KM on '+dlabel(BK.day),fmt(BK.ok)+'<span style="font-size:1.1rem;color:var(--muted)"> / '+BK.el+'</span>',BK.el?pct(BK.ok/BK.el)+' compliant · '+BK.zero.length+' zero KM':''):'')+
    (SK?kpi('Zero SIM stock RSSPs',fmt(SK.zero.length)+'<span style="font-size:1.1rem;color:var(--muted)"> / '+SK.all+'</span>','Stock as of '+dlabel(SK.date)+' · at least one product at zero',SK.zero.length?'bad':'good'):'')+
    '</div></section>';
  var rlist=function(L,cls){return '<ol class="brieflist '+cls+'">'+L.map(function(r){return '<li><button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button><span><b>'+fmt(briefLastGA(r))+'</b> GA · MTD '+fmt(r.ga)+(r.lmGa!=null?' '+grCell(r.ga,r.lmGa):'')+'</span></li>'}).join('')+'</ol>'};
  h+='<section class="section"><div class="briefduo"><div class="panel briefbox good"><h3>🏅 Top 3 on '+dl+'</h3>'+rlist(top,'')+'</div><div class="panel briefbox crit"><h3>📣 Needs a push today</h3>'+rlist(bot,'')+'</div></div></section>';
  var act2=[],chip=function(t,sub,attr){return '<span class="achip"'+(attr||'')+'>'+esc(t)+(sub?' <small>'+esc(sub)+'</small>':'')+'</span>'};
  if(zGA.length)act2.push({sev:'crit',t:'RSSPs with zero GA on '+dl,items:zGA.map(function(r){return chip(r.name,fmt(r.ga)+' MTD')}),txt:zGA.map(function(r){return r.name})});
  if(zRFO.length)act2.push({sev:'crit',t:'RFO made no GA on '+dl,items:zRFO.map(function(r){return chip(r.name,(r.last.agent||0)?'Agent '+r.last.agent+' GA':'')}),txt:zRFO.map(function(r){return r.name})});
  if(BK&&BK.zero.length)act2.push({sev:'crit',t:'Zero KM bikes on '+dlabel(BK.day),items:BK.zero.map(function(r){return chip(r.user,r.dh)}),txt:BK.zero.map(function(r){return r.user+' ('+r.dh+')'})});
  h+='<section class="section"><div class="sechead"><h2>Action list for today</h2><span class="note">'+(act2.length?act2.reduce(function(a,g){return a+g.items.length},0)+' items':'Nothing urgent')+'</span></div>'+
    (act2.length?'<div class="actgrid">'+act2.map(function(g){return '<div class="actbox '+g.sev+'"><div class="actt"><b>'+g.t+'</b><span class="acount">'+g.items.length+'</span></div><div class="achips">'+g.items.join('')+'</div></div>'}).join('')+'</div>':'<div class="panel empty"><p class="note">No zero GA, RFOs without GA or zero KM bikes. Good start to the day.</p></div>')+'</section>';
  var st=starsNow();h+=starsSection(st);
  if(ad){var WD=weeklyDigest(f,cal,st);if(WD){h+=WD.html;S.wkText=WD.text}}
  if(ad)h+='<section class="section"><div class="sechead"><h2>Month report</h2><span class="note">Only you see this</span></div><div class="panel reportbox"><div><b>'+(cal.full&&cal.elapsed===cal.dim?'Month-end report':'Month-to-date report')+' · '+mlabel(S.month||S.meta.month)+'</b><p class="note">A printable report through '+dl+': headline KPIs, RSSP ranking, SUP scorecard, RFO and Agent, bikes, stock and month-on-month trend. Opens in a new tab; choose <b>Save as PDF</b> in the print window.</p></div><button class="btn" id="monthReport">📄 Create PDF report</button></div></section>';
  /* share */
  var t=['*Morning brief · '+dl+'*','RSSP · '+(S.area==='All'?'Chandpur Region':S.area),'','*GA on '+dl+':* '+fmt(gaL)+' (day before '+fmt(prevD)+')','*GA MTD:* '+fmt(gaM)+(lmG?' ('+(gaM>=lmG?'▲ ':'▼ ')+Math.abs(Math.round((gaM/lmG-1)*100))+'% vs LMTD)':''),'*Active RSSPs:* '+act+' of '+f.length,'*Replacement:* '+fmt(repL)+' · *FWA:* '+fmt(fwL)];
  if(BK)t.push('*Bikes ≥3 KM:* '+BK.ok+' of '+BK.el);t.push('','*Top 3:* '+top.map(function(r){return r.name+' '+briefLastGA(r)}).join(', '),'*Needs a push:* '+bot.map(function(r){return r.name+' '+briefLastGA(r)}).join(', '));
  act2.forEach(function(g){t.push('','*'+g.t+' ('+g.items.length+')*');g.txt.slice(0,12).forEach(function(x,i){t.push((i+1)+'. '+x)});if(g.txt.length>12)t.push('+ '+(g.txt.length-12)+' more on the dashboard')});
  if(st){t.push('','*Stars of the week ('+dlabel(st.from)+' to '+dlabel(st.to)+')*');if(st.rssp[0])t.push('🏆 RSSP: '+st.rssp[0].name+' · '+fmt(st.rssp[0].v)+' GA');if(st.rfo[0])t.push('⭐ RFO: '+st.rfo[0].name+' ('+st.rfo[0].rssp+') · '+fmt(st.rfo[0].v)+' GA');if(st.agent[0])t.push('⭐ Agent: '+st.agent[0].name+' ('+st.agent[0].rssp+') · '+fmt(st.agent[0].v)+' GA');if(st.rider[0])t.push('🏍️ Rider: '+st.rider[0].name+' · '+fmt(st.rider[0].v)+' KM')}
  t.push('','Dashboard: '+location.origin);S.waText=t.join('\n');
  var K2=[{l:'GA on '+dl,v:fmt(gaL),s:'Day before '+fmt(prevD)},{l:'RSSP GA MTD',v:fmt(gaM),s:lmG?'LMTD '+fmt(lmG):'',g:lmG?(gaM>=lmG?'▲ ':'▼ ')+Math.abs(Math.round((gaM/lmG-1)*100))+'%':'',up:gaM>=(lmG||0)},{l:'Active RSSPs',v:act+' / '+f.length,s:'on '+dl},{l:'Replacement · FWA',v:fmt(repL)+' · '+fmt(fwL),s:'on '+dl}];
  if(BK)K2.push({l:'Bikes ≥3 KM',v:BK.ok+' / '+BK.el,s:'on '+dlabel(BK.day)});if(SK)K2.push({l:'Below 10 + 5 stock',v:SK.fail.length+' / '+SK.all,s:'RSSPs, as of '+dlabel(SK.date)});
  var secs=[{t:'Top 3 on '+dl,sev:'good',items:top.map(function(r){return r.name+' · '+briefLastGA(r)+' GA'})},{t:'Needs a push today',sev:'warn',items:bot.map(function(r){return r.name+' · '+briefLastGA(r)+' GA'})}].concat(act2.map(function(g){return {t:g.t,sev:g.sev,items:g.txt}}));
  if(st)secs.push({t:'Stars of the week',sev:'info',items:[st.rssp[0]&&('RSSP: '+st.rssp[0].name+' · '+fmt(st.rssp[0].v)+' GA'),st.rfo[0]&&('RFO: '+st.rfo[0].name+' · '+fmt(st.rfo[0].v)+' GA'),st.agent[0]&&('Agent: '+st.agent[0].name+' · '+fmt(st.agent[0].v)+' GA'),st.rider[0]&&('Rider: '+st.rider[0].name+' · '+fmt(st.rider[0].v)+' KM')].filter(Boolean)});
  S.imgSpec={file:'morning-brief-'+day,title:'Morning Brief',sub:'RSSP · '+dl+' '+day.slice(0,4)+(S.area==='All'?'':' · '+S.area),kpis:K2,sections:secs};
  return h}
/* Printable month report (admin): opens a new tab and the print dialog, where the phone can save it as a PDF */
function monthReport(){
  var cal=calendar();if(!cal)return;var rows=computeRows(),mo=mlabel(S.month||S.meta.month),thru=dlabel(cal.end)+' '+cal.end.slice(0,4),full=cal.elapsed===cal.dim;
  var ga=rows.reduce(function(a,r){return a+r.ga},0),rep=rows.reduce(function(a,r){return a+r.rep},0),fw=rows.reduce(function(a,r){return a+r.wifi},0),tg=rows.reduce(function(a,r){return a+(r.tgt||0)},0),fwT=rows.reduce(function(a,r){return a+(r.wifiT||0)},0);
  var lm=rows.every(function(r){return r.lmGa!=null})?rows.reduce(function(a,r){return a+r.lmGa},0):null,lmR=lm!=null?rows.reduce(function(a,r){return a+(r.lmRep||0)},0):null,lmW=lm!=null?rows.reduce(function(a,r){return a+(r.lmWifi||0)},0):null;
  var onT=rows.filter(function(r){return r.tgt&&(r.ga>=r.tgt||r.pace>=1)}).length,withT=rows.filter(function(r){return r.tgt}).length;
  var g=function(c,p){return p?((c>=p?'▲ ':'▼ ')+Math.abs(Math.round((c/p-1)*100))+'%'):'–'};
  var E=function(s){return esc(s)},P=function(v){return v==null||!isFinite(v)?'–':Math.round(v*100)+'%'};
  /* SUP scorecard */
  var SU={};rows.forEach(function(r){var s=supOfDh(r.distributor);var u=SU[s]||(SU[s]={n:0,ga:0,tg:0,lm:0,rep:0,fw:0,fwT:0,bo:0,be:0});u.n++;u.ga+=r.ga;u.tg+=r.tgt||0;u.lm+=r.lmGa||0;u.rep+=r.rep;u.fw+=r.wifi;u.fwT+=r.wifiT||0});
  var BR=(S.bike&&S.bike.map&&S.bike.data)?bikeRows()||[]:[],bo=0,be=0,bz=0;BR.forEach(function(r){bo+=r.ok;be+=r.elig;bz+=r.zero;var s=supOfDh(r.dh),u=SU[s];if(u){u.bo+=r.ok;u.be+=r.elig}});
  var sups=Object.keys(SU).filter(function(s){return SU[s].n}).sort(function(a,b){return SU[b].ga-SU[a].ga});
  /* BPs */
  var bps=computeBps(cal),rf=bps.filter(function(b){return b.role==='RFO'}),ag=bps.filter(function(b){return b.role==='Agent'});
  /* stock */
  var stk='';var K=S.stock&&S.stock.latest;if(K&&(K.v===3||K.v===4)){if(K.v===3)K=stkV3(K);var byC={};rows.forEach(function(r){byC[r.code]=r});var RS=stkLive(K,rows,byC).RS,fl=RS.filter(function(x){return !x.ok});
    stk='<h2>SIM stock at RSSPs</h2><p>As of '+dlabel(K.date)+' '+K.date.slice(0,4)+': <b>'+(RS.length-fl.length)+' of '+RS.length+'</b> live RSSPs meet the 10 Prepaid + 5 Single SIM Kit rule; '+RS.filter(function(x){return x.zero.length}).length+' have at least one product at zero.</p>'+
      (fl.length?'<table><thead><tr><th class="l">RSSP below the rule</th><th class="l">Short on</th></tr></thead><tbody>'+fl.map(function(x){return '<tr><td class="l">'+E(x.name)+'</td><td class="l">'+E(x.fail.join(', '))+'</td></tr>'}).join('')+'</tbody></table>':'')}
  /* month on month (data bank) */
  var mom='';var D=S.bank?bankData():null;if(D&&D.months.length){var ms=D.months.slice(-6),tot=ms.map(function(m){return D.rows.reduce(function(a,r){var v=r.m[m];return a+(v&&v.ga||0)},0)}),totR=ms.map(function(m){return D.rows.reduce(function(a,r){var v=r.m[m];return a+(v&&v.rep||0)},0)});
    var mx=Math.max.apply(null,tot.concat([1]));
    mom='<h2>Month on month</h2><table><thead><tr><th class="l">Month</th><th>Total GA</th><th class="l" style="width:45%"></th><th>Growth</th><th>SIM replacement</th></tr></thead><tbody>'+ms.map(function(m,i){return '<tr><td class="l">'+mlabel(m)+(D.src[m]==='p'?' *':'')+'</td><td><b>'+fmt(tot[i])+'</b></td><td class="l"><span class="bar" style="width:'+(tot[i]/mx*100).toFixed(1)+'%"></span></td><td>'+(i?(D.src[m]==='p'?'<span class="small">in progress</span>':g(tot[i],tot[i-1])):'–')+'</td><td>'+fmt(totR[i])+'</td></tr>'}).join('')+'</tbody></table><p class="small">* month in progress</p>'}
  /* auto summary */
  var byG=rows.slice().sort(function(a,b){return b.ga-a.ga}),grw=rows.filter(function(r){return r.lmGa>=20}).sort(function(a,b){return (b.ga/b.lmGa)-(a.ga/a.lmGa)}),lowP=rows.filter(function(r){return r.tgt}).sort(function(a,b){return a.pace-b.pace});
  var pts=[];
  pts.push('RSSP GA reached <b>'+fmt(ga)+'</b>'+(tg?', '+P(ga/tg)+' of the '+fmt(tg)+' target':'')+(lm!=null?' and '+(ga>=lm?'up':'down')+' '+Math.abs(Math.round((ga/lm-1)*100))+'% on the same days last month':'')+'.');
  if(withT)pts.push('<b>'+onT+' of '+withT+'</b> RSSPs are on or above their GA target pace.');
  if(byG[0])pts.push('Highest GA: <b>'+E(byG[0].name)+'</b> with '+fmt(byG[0].ga)+(byG[1]?', followed by '+E(byG[1].name)+' ('+fmt(byG[1].ga)+')':'')+'.');
  if(grw[0])pts.push('Fastest growth vs last month: <b>'+E(grw[0].name)+'</b> ('+g(grw[0].ga,grw[0].lmGa)+').');
  if(lowP[0]&&lowP[0].pace<.85)pts.push('Furthest behind target pace: <b>'+E(lowP[0].name)+'</b> at '+P(lowP[0].pace)+(lowP[1]&&lowP[1].pace<.85?' and '+E(lowP[1].name)+' at '+P(lowP[1].pace):'')+'.');
  if(be)pts.push('Super Bike compliance (≥3 KM a working day) was <b>'+P(bo/be)+'</b>, with '+fmt(bz)+' zero KM bike-days.');
  var st=computeStars(rows,cal);
  var kp=function(l,v,s){return '<div class="k"><div class="kl">'+l+'</div><div class="kv">'+v+'</div><div class="ks">'+s+'</div></div>'};
  var html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RSSP '+(full?'Month-end':'Month-to-date')+' Report · '+mo+'</title>'+
   '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap"><style>'+
   '@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:"Source Sans 3",Arial,sans-serif;color:#141C24;margin:0;font-size:10.5pt;background:#fff}.wrap{max-width:900px;margin:0 auto;padding:18px}'+
   '.hd{background:linear-gradient(180deg,#1E2A3B,#141C28);color:#fff;border-radius:12px;padding:18px 22px;position:relative;-webkit-print-color-adjust:exact;print-color-adjust:exact}.hd:after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;border-radius:0 0 12px 12px;background:linear-gradient(90deg,#E4002B,#F0447A 55%,#FFA62B)}'+
   '.hd h1{font:700 22pt "Barlow Semi Condensed",Arial;margin:0}.hd p{margin:4px 0 0;color:#C9D3E0}h2{page-break-after:avoid;break-after:avoid;font:700 14pt "Barlow Semi Condensed",Arial;margin:22px 0 8px;padding-bottom:4px;border-bottom:2px solid #E4002B}'+
   '.ks4{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.k{border:1px solid #DCE3EA;border-radius:10px;padding:10px 12px;border-top:4px solid #1E8EF0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.k:nth-child(2){border-top-color:#FFA800}.k:nth-child(3){border-top-color:#12B877}.k:nth-child(4){border-top-color:#EE3C7E}.k:nth-child(5){border-top-color:#7B68F2}.k:nth-child(6){border-top-color:#FF7A2F}'+
   '.kl{font-size:9pt;color:#5A6570;font-weight:700}.kv{font:700 20pt "Barlow Semi Condensed",Arial}.ks{font-size:9pt;color:#5A6570}ul{margin:6px 0;padding-left:18px}li{margin:3px 0}'+
   'table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:6px}th{background:#1E2A3B;color:#fff;padding:5px 6px;font-weight:700;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}td{padding:4px 6px;border-bottom:1px solid #E6EBF0;text-align:center}.l{text-align:left}tr:nth-child(even) td{background:#F7F9FB;-webkit-print-color-adjust:exact;print-color-adjust:exact}tr{page-break-inside:avoid}'+
   '.up{color:#0B6E48;font-weight:700}.dn{color:#B42318;font-weight:700}.bar{display:inline-block;height:10px;border-radius:5px;background:linear-gradient(90deg,#1E8EF0,#EE3C7E);-webkit-print-color-adjust:exact;print-color-adjust:exact}.small{font-size:8.5pt;color:#5A6570}'+
   '.stars{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.star{border:1px solid #F3D38A;background:#FFF9E6;border-radius:10px;padding:8px 10px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.star b{display:block}.ft{margin-top:24px;padding-top:8px;border-top:1px solid #DCE3EA;font-size:8.5pt;color:#5A6570;display:flex;justify-content:space-between}'+
   '.pbar{position:sticky;top:0;background:#FFF7DD;border-bottom:1px solid #F3D38A;padding:10px 18px;text-align:center;font-size:11pt}.pbar button{font:700 11pt Arial;background:#1E2A3B;color:#fff;border:0;border-radius:8px;padding:8px 14px;margin-left:8px}@media print{.pbar{display:none}}@media (max-width:640px){.ks4{grid-template-columns:1fr 1fr}.stars{grid-template-columns:1fr 1fr}}'+
   '</style></head><body><div class="pbar">Save this report: tap <b>Print / Save as PDF</b>, then choose <b>Save as PDF</b>.<button onclick="window.print()">Print / Save as PDF</button></div><div class="wrap">'+
   '<div class="hd"><h1>RSSP '+(full?'Month-end':'Month-to-date')+' Report · '+mo+'</h1><p>Robi Axiata PLC. · Chandpur Region · data through '+thru+' ('+cal.elapsed+' of '+cal.dim+' days)</p><p>Prepared by Mohd Imtiaz Karim, Direct Channel Manager</p></div>'+
   '<div class="ks4">'+kp('RSSP GA',fmt(ga),(tg?P(ga/tg)+' of target '+fmt(tg):'')+(lm!=null?' · LMTD '+fmt(lm)+' ('+g(ga,lm)+')':''))+kp('SIM replacement',fmt(rep),lmR!=null?'LMTD '+fmt(lmR)+' ('+g(rep,lmR)+')':'')+kp('FWA (WiFi) sales',fmt(fw),(fwT?P(fw/fwT)+' of target '+fmt(fwT):'')+(lmW!=null?' · LMTD '+fmt(lmW):''))+
     kp('RSSPs on GA target pace',withT?onT+' / '+withT:'–','Live RSSPs: '+rows.length)+kp('Super Bike compliance',be?P(bo/be):'–',be?fmt(bo)+' of '+fmt(be)+' bike-days ≥3 KM':'No bike data')+kp('GA per RSSP per day',(ga/Math.max(1,rows.length)/cal.elapsed).toFixed(1),'Projected month-end '+fmt(ga/cal.elapsed*cal.dim))+'</div>'+
   '<h2>Summary</h2><ul>'+pts.map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul>'+
   (st?'<h2>Stars of the week</h2><div class="stars">'+[['🏆 RSSP',st.rssp[0],'GA'],['⭐ RFO',st.rfo[0],'GA'],['⭐ Agent',st.agent[0],'GA'],['🏍️ Rider',st.rider[0],'KM']].filter(function(x){return x[1]}).map(function(x){return '<div class="star">'+x[0]+'<b>'+E(x[1].name)+'</b>'+fmt(x[1].v)+' '+x[2]+' · '+dlabel(st.from)+' to '+dlabel(st.to)+'</div>'}).join('')+'</div>':'')+
   '<h2>SUP scorecard</h2><table><thead><tr><th class="l">SUP</th><th>RSSPs</th><th>GA</th><th>Target</th><th>Ach.</th><th>vs LMTD</th><th>Repl.</th><th>FWA</th><th>Bike ≥3 KM</th></tr></thead><tbody>'+
     sups.map(function(s){var u=SU[s];return '<tr><td class="l">'+E(s)+'</td><td>'+u.n+'</td><td><b>'+fmt(u.ga)+'</b></td><td>'+(u.tg?fmt(u.tg):'–')+'</td><td>'+(u.tg?P(u.ga/u.tg):'–')+'</td><td class="'+(u.ga>=u.lm?'up':'dn')+'">'+(lm!=null?g(u.ga,u.lm):'–')+'</td><td>'+fmt(u.rep)+'</td><td>'+fmt(u.fw)+(u.fwT?' / '+fmt(u.fwT):'')+'</td><td>'+(u.be?P(u.bo/u.be):'–')+'</td></tr>'}).join('')+'</tbody></table>'+
   '<h2>RSSP ranking</h2><table><thead><tr><th>#</th><th class="l">RSSP</th><th class="l">Area</th><th>GA</th><th>Target</th><th>Ach.</th><th>Pace</th><th>vs LMTD</th><th>Repl.</th><th>FWA</th><th>Active days</th></tr></thead><tbody>'+
     byG.map(function(r,i){return '<tr><td>'+(i+1)+'</td><td class="l">'+E(r.name)+'</td><td class="l">'+E(r.area)+'</td><td><b>'+fmt(r.ga)+'</b></td><td>'+(r.tgt?fmt(r.tgt):'–')+'</td><td>'+(r.tgt?P(r.ach):'–')+'</td><td class="'+(r.pace==null?'':r.pace>=1?'up':r.pace<.85?'dn':'')+'">'+(r.pace!=null?P(r.pace):'–')+'</td><td class="'+(r.lmGa&&r.ga>=r.lmGa?'up':'dn')+'">'+(r.lmGa!=null?g(r.ga,r.lmGa):'–')+'</td><td>'+fmt(r.rep)+'</td><td>'+fmt(r.wifi)+'</td><td>'+r.active+' / '+cal.elapsed+'</td></tr>'}).join('')+'</tbody></table>'+
   '<h2>RFO and Agent</h2><p>'+rf.length+' RFOs sold '+fmt(rf.reduce(function(a,b){return a+b.ga},0))+' GA and '+ag.length+' Agents sold '+fmt(ag.reduce(function(a,b){return a+b.ga},0))+' GA this month. Top ten by GA:</p><table><thead><tr><th>#</th><th class="l">Name</th><th>Role</th><th class="l">RSSP</th><th>GA</th><th>Active days</th><th>GA / active day</th></tr></thead><tbody>'+
     bps.slice(0,10).map(function(b,i){return '<tr><td>'+(i+1)+'</td><td class="l">'+E(b.name)+'</td><td>'+E(b.role)+'</td><td class="l">'+E(b.rssp)+'</td><td><b>'+fmt(b.ga)+'</b></td><td>'+b.active+'</td><td>'+b.perDay.toFixed(1)+'</td></tr>'}).join('')+'</tbody></table>'+
   (be?'<h2>Super Bike</h2><p>'+BR.length+' bikes · compliance '+P(bo/be)+' ('+fmt(bo)+' of '+fmt(be)+' working bike-days at ≥3 KM) · '+fmt(bz)+' zero KM bike-days · '+BR.filter(function(r){return r.open.length}).length+' bikes with an open fault.</p>':'')+
   stk+mom+
   '<div class="ft"><span>RSSP Business Tracker · '+location.host+'</span><span>Generated '+dlabel(dhakaToday())+' '+dhakaToday().slice(0,4)+'</span></div></div>'+
   '<script>window.onload=function(){setTimeout(function(){try{window.print()}catch(e){}},700)}<\/script></body></html>';
  var w=window.open('','_blank');if(!w){var b=new Blob([html],{type:'text/html'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='rssp-report-'+(S.month||'month')+'.html';document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1000);return}
  w.document.open();w.document.write(html);w.document.close()}
/* ---------- Product Price List ---------- */
var PRICE_SEED={label:'Demo',showDH:false,brands:[{name:'Robi',items:[['Prepaid SIM',0,0,200,200]]}]};
function priceSeed(){return {label:PRICE_SEED.label,showDH:true,brands:PRICE_SEED.brands.map(function(b){return {name:b.name,items:b.items.map(function(x){return {n:x[0],lift:x[1],com:x[2],cust:x[3],agent:x[4]}})}})}}
function priceCur(){return (S.prices&&S.prices.current)||priceSeed()}
function tk(v){if(v==null||v==='')return '–';v=+v;return (Math.round(v*100)/100).toLocaleString('en-US',{maximumFractionDigits:2})}
function profitOf(it){return it.lift==null?null:(+it.cust||0)-(+it.lift||0)+(+it.com||0)}
function viewPrices(){
  var P=priceCur(),H=(S.prices&&S.prices.history)||[],ad=S.canEdit,ed=ad&&S.priceEdit,showDH=ad||P.showDH!==false,saved=!!(S.prices&&S.prices.current);
  var V=S.priceVer!=null&&H[S.priceVer]?H[S.priceVer]:null,L=V||P,prev=V?H[S.priceVer+1]:H[0];
  var prevMap={};if(prev)(prev.brands||[]).forEach(function(b){(b.items||[]).forEach(function(it){prevMap[b.name+'|'+it.n]=it})});
  var chg=function(b,it,k){var o=prevMap[b+'|'+it.n];if(!o||o[k]==null||it[k]==null||+o[k]===+it[k])return '';return ' <span class="gr '+(+it[k]>+o[k]?'up':'down')+'" title="Was '+tk(o[k])+'">'+(+it[k]>+o[k]?'▲':'▼')+'</span>'};
  var h='<section class="section"><div class="sechead"><h2>Product Price List</h2><span class="note">'+(ed?'Editing':'Prices effective '+esc(L.label||''))+(V?' · earlier version':'')+(!saved&&ad?' · sample from your sheet, not saved yet':'')+'</span></div>';
  if(!ed){h+=waButton();
    if(H.length)h+='<div class="seg" role="group" aria-label="Version" style="flex-wrap:wrap;max-width:100%;margin-bottom:10px"><button data-pver="cur" aria-pressed="'+(!V)+'">'+esc(P.label||'Current')+' (current)</button>'+H.map(function(v,i){return '<button data-pver="'+i+'" aria-pressed="'+(S.priceVer===i)+'">'+esc(v.label||('Version '+(i+1)))+'</button>'}).join('')+'</div>';
    h+=(L.brands||[]).map(function(b){var cl=/cirkle|airtel/i.test(b.name)?'cirkle':'robi';return '<div class="pricebox '+cl+'"><div class="pricehead"><b>'+esc(b.name)+'</b><span>'+esc(L.label||'')+'</span></div><div class="tablebox"><table class="compact pricetbl"><thead><tr><th class="l">Product</th><th class="hl">Customer price</th><th class="hl">Agent lifting</th>'+(showDH?'<th>DH lifting</th><th>Commission</th><th class="pf">DH net profit</th>':'')+'</tr></thead><tbody>'+
      (b.items||[]).map(function(it,i){var pf=profitOf(it);return '<tr><td class="l"><span class="pnum">'+(i+1)+'</span>'+esc(it.n)+'</td><td class="hl"><b>'+tk(it.cust)+'</b>'+chg(b.name,it,'cust')+'</td><td class="hl"><b>'+tk(it.agent)+'</b>'+chg(b.name,it,'agent')+'</td>'+(showDH?'<td>'+tk(it.lift)+chg(b.name,it,'lift')+'</td><td>'+tk(it.com)+chg(b.name,it,'com')+'</td><td class="pf"><b>'+tk(pf)+'</b></td>':'')+'</tr>'}).join('')+'</tbody></table></div></div>'}).join('');
    h+='<p class="note">All prices in Taka (Tk) per unit.'+(showDH?' DH net profit = customer price − DH lifting + commission.':'')+(prev?' ▲▼ marks a change from '+esc(prev.label||'the previous list')+'.':'')+'</p>';
    if(ad)h+='<div class="apbtns" style="margin-top:10px"><button class="btn" id="pEdit">Edit prices</button><span class="note">'+(P.showDH===false?'Team sees customer and agent prices only.':'Team sees all columns, including DH lifting and profit.')+'</span></div>';
    h+='</section>';
    var shareDH=L.showDH!==false,cols=shareDH?['Product','Customer','Agent','DH lifting','Comm.','DH profit']:['Product','Customer price','Agent lifting'];
    var pad=function(v,n,left){v=String(v);if(v.length>n)v=v.slice(0,n-1)+'…';return left?v+Array(n-v.length+1).join(' '):Array(n-v.length+1).join(' ')+v};
    var t=['*RSSP Product Price List*','Effective '+(L.label||'')+' · prices in Tk',''];
    (L.brands||[]).forEach(function(b){t.push('*'+b.name+'*');t.push('```');t.push(pad('#',2)+' '+pad('Product',20,1)+pad('Cust',6)+pad('Agent',6));
      (b.items||[]).forEach(function(it,i){t.push(pad(i+1,2)+' '+pad(it.n,20,1)+pad(tk(it.cust),6)+pad(tk(it.agent),6))});t.push('```');t.push('')});
    t.push('Dashboard: '+location.origin);S.waText=t.join('\n');
    S.imgSpec={file:'price-list-'+String(L.label||'').replace(/\s+/g,'-').toLowerCase(),title:'Product Price List',sub:'RSSP · effective '+(L.label||'')+' · all prices in Tk per unit',kpis:[],sections:[],
      tables:(L.brands||[]).map(function(b){var cir=/cirkle|airtel/i.test(b.name);return {name:b.name,label:L.label||'',c:cir?['#0E9F8E','#2DC3A6']:['#E4002B','#F0447A'],cols:cols,hl:[1,2],pf:shareDH?5:-1,
        rows:(b.items||[]).map(function(it){var r=[it.n,tk(it.cust),tk(it.agent)];if(shareDH)r.push(tk(it.lift),tk(it.com),tk(profitOf(it)));return r})}})};
    return h}
  /* edit mode (admin) */
  var D=S.priceDraft||(S.priceDraft=JSON.parse(JSON.stringify(P)));
  h+='<div class="panel appform"><label>Effective month<input id="pLabel" value="'+esc(D.label||'')+'" placeholder="e.g. December 2026"></label><label class="chk"><input type="checkbox" id="pShow"'+(D.showDH!==false?' checked':'')+'> Team can see DH lifting, commission and profit</label></div>';
  h+=D.brands.map(function(b,bi){return '<div class="pricebox '+(/cirkle|airtel/i.test(b.name)?'cirkle':'robi')+'"><div class="pricehead"><b>'+esc(b.name)+'</b></div><div class="tablebox"><table class="compact pricetbl pedit"><thead><tr><th class="l">Product</th><th>DH lifting</th><th>Commission</th><th>Customer price</th><th>Agent lifting</th><th>DH net profit</th><th></th></tr></thead><tbody>'+
    b.items.map(function(it,i){var f=function(k,w){return '<input data-pb="'+bi+'" data-pi="'+i+'" data-pk="'+k+'" value="'+esc(it[k]==null?'':it[k])+'"'+(k==='n'?' class="pn"':' inputmode="decimal"')+'>'};return '<tr><td class="l">'+f('n')+'</td><td>'+f('lift')+'</td><td>'+f('com')+'</td><td>'+f('cust')+'</td><td>'+f('agent')+'</td><td><b data-pf="'+bi+'-'+i+'">'+tk(profitOf(it))+'</b></td><td><button class="linkbtn bad" data-pdel="'+bi+'-'+i+'" title="Remove">✕</button></td></tr>'}).join('')+
    '</tbody></table></div><button class="linkbtn" data-padd="'+bi+'" style="margin:8px 0">+ Add a product</button></div>'}).join('');
  h+='<div class="apbtns"><button class="btn" id="pSaveNew">Save as new price list</button><button class="btn ghost" id="pSaveFix">Save as a correction</button><button class="linkbtn" id="pCancel">Cancel</button></div><p class="note">“New price list” keeps the current one in the history (use it for each quarterly revision). “Correction” fixes the current list without keeping a copy.</p><div class="status" id="pStatus"></div></section>';
  return h;
}
function bindPrices(){
  var q=function(sel,fn){main.querySelectorAll(sel).forEach(fn)};
  q('[data-pver]',function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-pver');S.priceVer=v==='cur'?null:+v;render()})});
  var e=$('pEdit');if(e)e.addEventListener('click',function(){S.priceEdit=true;S.priceDraft=null;S.priceVer=null;render()});
  var c=$('pCancel');if(c)c.addEventListener('click',function(){S.priceEdit=false;S.priceDraft=null;render()});
  var D=S.priceDraft;if(!D)return;
  var keep=function(){var l=$('pLabel');if(l)D.label=l.value.trim();var sh=$('pShow');if(sh)D.showDH=sh.checked};
  q('input[data-pk]',function(inp){inp.addEventListener('input',function(){var bi=+inp.getAttribute('data-pb'),i=+inp.getAttribute('data-pi'),k=inp.getAttribute('data-pk'),it=D.brands[bi].items[i];it[k]=k==='n'?inp.value:(inp.value.trim()===''?null:+inp.value);var pf=main.querySelector('[data-pf="'+bi+'-'+i+'"]');if(pf)pf.textContent=tk(profitOf(it))})});
  q('[data-padd]',function(b){b.addEventListener('click',function(){keep();D.brands[+b.getAttribute('data-padd')].items.push({n:'',lift:null,com:0,cust:null,agent:null});render()})});
  q('[data-pdel]',function(b){b.addEventListener('click',function(){keep();var p=b.getAttribute('data-pdel').split('-');D.brands[+p[0]].items.splice(+p[1],1);render()})});
  var save=function(asNew){keep();if(!D.label){setStatus('pStatus','Add the effective month, e.g. December 2026.','err');return}
    D.brands.forEach(function(b){b.items=b.items.filter(function(it){return String(it.n||'').trim()})});
    var cur=D,hist=((S.prices&&S.prices.history)||[]).slice();if(asNew&&S.prices&&S.prices.current)hist.unshift(S.prices.current);cur.at=new Date().toISOString();
    setStatus('pStatus','Saving…');apiSave({kind:'prices',data:{current:cur,history:hist}}).then(function(){S.prices={current:cur,history:hist};S.priceEdit=false;S.priceDraft=null;render()}).catch(function(err){setStatus('pStatus','Could not save: '+((err&&err.message)||err),'err')})};
  var n=$('pSaveNew');if(n)n.addEventListener('click',function(){save(true)});var f=$('pSaveFix');if(f)f.addEventListener('click',function(){save(false)});
}
/* ---------- Download tab: work apps ---------- */
function fmtBytes(n){n=+n||0;return n>=1048576?(n/1048576).toFixed(n>=104857600?0:1)+' MB':n>=1024?Math.round(n/1024)+' KB':n+' B'}
var APP_MAXF=15;
function appFiles(a){return a.files&&a.files.length?a.files:a.pathname?[{pathname:a.pathname,name:a.file,size:a.size,type:a.type}]:[]}
function appUrl(a,i){return '/api/apps?id='+encodeURIComponent(a.id)+'&f='+(i||0)}
function appIcon(a){var F=appFiles(a),f=F[0]||{},e=String(f.name||'').split('.').pop().toLowerCase(),k=fileKind(f);if(k==='img')return '<img src="'+appUrl(a,0)+'" alt="" loading="lazy">';
  return e==='apk'||e==='xapk'?'🤖':k==='pdf'?'📄':k==='sheet'?'📊':k==='video'?'🎬':k==='audio'?'🎵':/docx?$/.test(e)?'📝':/pptx?$/.test(e)?'📽️':/zip|rar|7z/.test(e)?'🗜️':'📦'}
function appCard(a,i,ad){
  var F=appFiles(a),id=esc(a.id),tot=F.reduce(function(t,f){return t+(+f.size||0)},0),imgs=[],docs=[];F.forEach(function(f,n){(fileKind(f)==='img'?imgs:docs).push(n)});
  var cnt=F.length>1?(imgs.length===F.length?F.length+' photos':F.length+' files')+' · ':'';
  var h='<div class="appcard'+(F.length>1?' multi':'')+'"><div class="apptop"><div class="appicon" aria-hidden="true">'+appIcon(a)+'</div><div class="appbody"><div class="appname">'+esc(a.name)+(a.ver?' <span class="appver">v'+esc(a.ver.replace(/^v/i,''))+'</span>':'')+'</div>'+
    (a.desc?'<div class="appdesc">'+esc(a.desc)+'</div>':'')+'<div class="appmeta">'+cnt+fmtBytes(tot)+' · updated '+dlabel(String(a.at).slice(0,10))+' '+String(a.at).slice(0,4)+'</div>'+
    (ad?'<div class="appadmin"><button class="linkbtn" data-appedit="'+id+'">Edit / add files</button>'+(i?'<button class="linkbtn" data-appmove="'+id+'" data-dir="-1">Move up</button>':'')+'<button class="linkbtn bad" data-appdel="'+id+'">Delete</button></div>':'')+'</div></div>';
  if(F.length===1)h+='<div class="appbtns"><a class="btn appdl" href="'+appUrl(a,0)+((F[0].size||0)<4*1024*1024?'&dl=1':'')+'" download="'+esc(F[0].name||a.name)+'" rel="noopener">Download</a>'+(fileKind(F[0])?'<button type="button" class="btn ghost appdl" data-appview="'+id+'" data-fi="0">👁 Preview</button>':'')+'</div>';
  if(F.length>1){
    if(imgs.length){var show=imgs.slice(0,8),more=imgs.length-show.length;h+='<div class="appthumbs">'+show.map(function(n,k){return '<button type="button" data-appview="'+id+'" data-fi="'+n+'" aria-label="View photo '+(k+1)+'"><img loading="lazy" src="'+appUrl(a,n)+'" alt="">'+(k===show.length-1&&more?'<span>+'+more+'</span>':'')+'</button>'}).join('')+'</div>'}
    if(docs.length)h+='<div class="campdocs">'+docs.map(function(n){var f=F[n];return '<div class="campdoc"><span>'+esc(f.name||'file')+' <small>'+fmtBytes(f.size)+'</small></span>'+(fileKind(f)?'<button type="button" class="linkbtn" data-appview="'+id+'" data-fi="'+n+'">Preview</button>':'')+'<a class="linkbtn" href="'+appUrl(a,n)+((f.size||0)<4*1024*1024?'&dl=1':'')+'" download="'+esc(f.name||'file')+'">⬇ Download</a></div>'}).join('')+'</div>';
    h+='<div class="appbtns row"><button type="button" class="btn appdl" data-appdlall="'+id+'">⬇ Download all '+F.length+'</button>'+(imgs.length?'<button type="button" class="btn ghost appdl" data-appview="'+id+'" data-fi="'+imgs[0]+'">👁 View photos</button>':'')+'</div>'}
  return h+'</div>'}
function viewDownload(){
  var L=(S.apps&&S.apps.list)||[],ad=S.canEdit;
  var h='<section class="section"><div class="sechead"><h2>Download</h2><span class="note">Apps and files for daily work · tap Preview to look, Download to save</span></div>';
  if(!L.length)h+='<div class="panel empty"><h2>Nothing here yet</h2><p class="note">'+(ad?'Add the first app or file with the form below.':'The admin has not added any files yet.')+'</p></div>';
  else h+='<div class="applist">'+L.map(function(a,i){return appCard(a,i,ad)}).join('')+'</div>';
  h+='</section>';
  if(ad){var E=S.appEdit?L.filter(function(a){return a.id===S.appEdit})[0]:null,EF=E?appFiles(E):[];
    h+='<section class="section" id="appForm"><div class="sechead"><h2>'+(E?'Edit '+esc(E.name):'Add an app or files')+'</h2><span class="note">Only you see this form</span></div><div class="panel appform">'+
      '<label>Name<input id="apName" maxlength="60" value="'+esc(E?E.name:'')+'" placeholder="e.g. RedCube or Puja event photos"></label>'+
      '<label>Version<input id="apVer" maxlength="30" value="'+esc(E?E.ver:'')+'" placeholder="Optional, e.g. 4.2.1"></label>'+
      '<label class="wide">What it is for<input id="apDesc" maxlength="300" value="'+esc(E?E.desc:'')+'" placeholder="One line for your team"></label>'+
      (EF.length?'<div class="wide campkeep"><span>Current files · untick to remove</span>'+EF.map(function(f,n){return '<label><input type="checkbox" data-apkeep="'+n+'" checked> '+esc(f.name||('File '+(n+1)))+' <small>'+fmtBytes(f.size)+'</small></label>'}).join('')+'</div>':'')+
      '<label class="wide">'+(E?'Add more photos':'Photos')+' (select several at once)<input type="file" id="apPic" multiple accept="image/*"></label>'+
      '<label class="wide">'+(E?'Add more apps or documents':'Apps or documents')+' (APK, PDF, Excel, Word, PowerPoint, ZIP · up to 500 MB each)<input type="file" id="apFile" multiple accept="application/*,text/*,.apk,.xapk,.zip,.rar,.7z,.pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx,.txt"></label>'+
      '<label class="wide">'+(E?'Add more audio or video':'Audio or video')+' (optional · up to 500 MB each)<input type="file" id="apMedia" multiple accept="audio/*,video/*"></label>'+
      '<p class="note wide" style="margin:0">Up to '+APP_MAXF+' files in one item, e.g. all the photos of one event.</p>'+
      '<div class="apbtns"><button class="btn" id="apSave">'+(E?'Save changes':'Upload')+'</button>'+(E?'<button class="linkbtn" id="apCancel">Cancel</button>':'')+'</div>'+
      '<div class="approg" id="apProg" hidden><div class="track"><div class="fill" id="apFill"></div></div><span id="apPct">0%</span></div><div class="status" id="apStatus"></div></div></section>'}
  return h;
}
/* Full-screen preview for Download tab files */
function openOverlay(title,dlHref,dlName){
  var d=document.createElement('div');d.className='lightbox';d.setAttribute('role','dialog');d.setAttribute('aria-label',title);
  d.innerHTML='<div class="lbbar"><b>'+esc(title)+'</b><a class="btn" href="'+dlHref+'" download="'+esc(dlName||'file')+'">⬇ Download</a><button type="button" class="lbclose" aria-label="Close">✕</button></div><div class="pvbody"></div>';
  var close=function(fromPop){if(!d.parentNode)return;d.querySelectorAll('video,audio').forEach(function(m){try{m.pause()}catch(e){}});d.remove();document.body.style.overflow='';window.removeEventListener('popstate',onPop);document.removeEventListener('keydown',onKey);if(!fromPop&&history.state&&history.state.lb)history.back()},
      onPop=function(){close(true)},onKey=function(e){if(e.key==='Escape')close()};
  d.addEventListener('click',function(e){if(e.target.closest('.lbclose')||e.target.classList.contains('pvcenter'))close()});
  document.body.appendChild(d);document.body.style.overflow='hidden';try{history.pushState({lb:1},'')}catch(e){}window.addEventListener('popstate',onPop);document.addEventListener('keydown',onKey);
  return {el:d,body:d.querySelector('.pvbody'),close:close}}
function loadPdfJs(){return new Promise(function(res,rej){if(window.pdfjsLib)return res(window.pdfjsLib);var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';s.onload=function(){window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';res(window.pdfjsLib)};s.onerror=function(){rej(new Error('The PDF viewer could not load. Check your connection.'))};document.head.appendChild(s)})}
function previewApp(a,fi){
  var F=appFiles(a),f=F[fi||0]||{},k=fileKind(f);
  if(k==='img'){galleryLightbox(a.name,F,function(i){return appUrl(a,i)},fi||0);return}
  var url=appUrl(a,fi),O=openOverlay(F.length>1?(f.name||a.name):a.name+(a.ver?' v'+a.ver.replace(/^v/i,''):''),url+((f.size||0)<4*1024*1024?'&dl=1':''),f.name||a.name),B=O.body;
  var fail=function(e){B.innerHTML='<div class="pvcenter"><div class="pvmsg"><b>Preview is not available for this file.</b><span>'+esc((e&&e.message)||'')+'</span><span>Use Download to open it on your phone.</span></div></div>'};
  var raw=function(){return fetch(url+'&raw=1',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('Could not load the file ('+r.status+').');return r})};
  if(k==='video'){B.innerHTML='<div class="pvcenter"><video src="'+url+'" controls playsinline preload="metadata"></video></div>';B.querySelector('video').onerror=function(){fail(new Error('This video format cannot play in the browser.'))};return}
  if(k==='audio'){B.innerHTML='<div class="pvcenter"><div class="pvaudio"><div class="pvicon">🎵</div><b>'+esc(f.name||a.name)+'</b><audio src="'+url+'" controls preload="metadata"></audio></div></div>';return}
  B.innerHTML='<div class="pvcenter"><div class="pvmsg"><b>Loading preview…</b></div></div>';
  if(k==='pdf'){Promise.all([loadPdfJs(),raw().then(function(r){return r.arrayBuffer()})]).then(function(x){return x[0].getDocument({data:x[1]}).promise}).then(function(pdf){
      B.innerHTML='<div class="pvpages"><div class="pvnote">'+pdf.numPages+' page'+(pdf.numPages>1?'s':'')+' · pinch to zoom</div></div>';var box=B.firstChild,w=Math.min(box.clientWidth-16,1000),dpr=Math.min(window.devicePixelRatio||1,2);
      var page=function(n){if(n>pdf.numPages||!O.el.parentNode)return;return pdf.getPage(n).then(function(p){var v0=p.getViewport({scale:1}),sc=w/v0.width,v=p.getViewport({scale:sc*dpr}),c=document.createElement('canvas');c.width=v.width;c.height=v.height;c.style.width=(v.width/dpr)+'px';box.appendChild(c);return p.render({canvasContext:c.getContext('2d'),viewport:v}).promise}).then(function(){return page(n+1)})};
      return page(1)}).catch(fail);return}
  if(k==='sheet'){Promise.all([loadXLSX(),raw().then(function(r){return r.arrayBuffer()})]).then(function(x){var X=x[0],wb=X.read(x[1],{type:'array',dense:true}),cur=0;
      var draw=function(){var rows=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[cur]],{header:1,raw:false,defval:''}),n=rows.length,cols=Math.min(30,rows.reduce(function(m,r){return Math.max(m,r.length)},0));rows=rows.slice(0,300);
        B.innerHTML='<div class="pvsheet">'+(wb.SheetNames.length>1?'<div class="seg pvtabs">'+wb.SheetNames.map(function(nm,i){return '<button data-pvs="'+i+'" aria-pressed="'+(i===cur)+'">'+esc(nm)+'</button>'}).join('')+'</div>':'')+'<div class="pvnote">'+(n>300?'First 300 of '+n+' rows':n+' rows')+(cols===30?' · first 30 columns':'')+'</div><div class="tablebox"><table class="compact"><tbody>'+
          rows.map(function(r,i){var c='';for(var j=0;j<cols;j++)c+=(i?'<td>':'<th>')+esc(r[j]==null?'':r[j])+(i?'</td>':'</th>');return '<tr>'+c+'</tr>'}).join('')+'</tbody></table></div></div>';
        B.querySelectorAll('[data-pvs]').forEach(function(b){b.addEventListener('click',function(){cur=+b.getAttribute('data-pvs');draw()})})};draw()}).catch(fail);return}
  if(k==='text'){raw().then(function(r){return r.text()}).then(function(t){B.innerHTML='<pre class="pvtext">'+esc(t.slice(0,200000))+'</pre>'}).catch(fail);return}
  fail()}
function appsPost(body){return fetchRetry('/api/apps',{method:'POST',headers:{'content-type':'application/json','x-admin-key':S.adminKey||''},body:JSON.stringify(body)}).then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok)throw new Error(j.error||('Request failed ('+r.status+')'));return j})})}
function bindDownload(){
  var q=function(sel,fn){main.querySelectorAll(sel).forEach(fn)},done=function(j){S.apps=j.apps||S.apps;S.appEdit=null;render()},L=(S.apps&&S.apps.list)||[],find=function(id){return L.filter(function(x){return x.id===id})[0]};
  q('[data-appedit]',function(b){b.addEventListener('click',function(){S.appEdit=b.getAttribute('data-appedit');render();var f=$('appForm');if(f)f.scrollIntoView({behavior:'smooth'})})});
  q('[data-appview]',function(b){b.addEventListener('click',function(){var a=find(b.getAttribute('data-appview'));if(a)previewApp(a,+b.getAttribute('data-fi')||0)})});
  q('[data-appdlall]',function(b){b.addEventListener('click',function(){var a=find(b.getAttribute('data-appdlall'));if(a)dlAll(appFiles(a),function(i){return appUrl(a,i)})})});
  q('[data-appmove]',function(b){b.addEventListener('click',function(){appsPost({kind:'move',id:b.getAttribute('data-appmove'),dir:-1}).then(done).catch(function(e){alertMsg(e)})})});
  q('[data-appdel]',function(b){b.addEventListener('click',function(){var a=find(b.getAttribute('data-appdel'));if(!a||!confirm('Delete '+a.name+'? Your team will no longer be able to download it.'))return;b.disabled=true;appsPost({kind:'delete',id:a.id}).then(done).catch(function(e){b.disabled=false;alertMsg(e)})})});
  var c=$('apCancel');if(c)c.addEventListener('click',function(){S.appEdit=null;render()});
  var sv=$('apSave');if(!sv)return;
  sv.addEventListener('click',function(){
    var name=$('apName').value.trim(),ver=$('apVer').value.trim(),desc=$('apDesc').value.trim(),E=S.appEdit?find(S.appEdit):null;
    if(!name){setStatus('apStatus','Give it a name.','err');return}
    var keep=E?appFiles(E).filter(function(f,n){var x=main.querySelector('[data-apkeep="'+n+'"]');return !x||x.checked}):[];
    var fl=[].slice.call($('apPic').files||[]).concat([].slice.call($('apFile').files||[])).concat([].slice.call(($('apMedia')&&$('apMedia').files)||[]));
    if(!E&&!fl.length){setStatus('apStatus','Choose the photos or files to upload.','err');return}
    if(keep.length+fl.length>APP_MAXF){setStatus('apStatus','Up to '+APP_MAXF+' files in one item. You chose '+(keep.length+fl.length)+'.','err');return}
    if(E&&!keep.length&&!fl.length){setStatus('apStatus','Keep at least one file, or delete the item instead.','err');return}
    var big=fl.filter(function(f){return f.size>500*1024*1024})[0];if(big){setStatus('apStatus',big.name+' is over 500 MB.','err');return}
    var safe=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'file',files=keep.slice(),totB=fl.reduce(function(t,f){return t+f.size},0),doneB=0,B;
    var save=function(){setStatus('apStatus','Saving to the Download list…');return appsPost({kind:'save',id:E?E.id:'',name:name,ver:ver,desc:desc,files:files})};
    sv.disabled=true;
    if(!fl.length){save().then(done).catch(function(e){sv.disabled=false;setStatus('apStatus',(e&&e.message)||String(e),'err')});return}
    $('apProg').hidden=false;
    appsPost({kind:'check'}).then(function(ck){if(!ck.ok)throw new Error('the server cannot sign uploads ('+ck.error+'; storage key '+(ck.env&&ck.env.readWriteToken?'yes':'no')+', OIDC '+(ck.env&&ck.env.oidc?'yes':'no')+', store id '+(ck.env&&ck.env.storeId?'yes':'no')+')');return import('/vendor/blob-client.js')})
      .then(function(mod){B=mod;return fl.reduce(function(p,f,n){return p.then(function(){
        var ext=(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'')||'bin';
        setStatus('apStatus','Uploading '+(n+1)+' of '+fl.length+': '+f.name+' ('+fmtBytes(f.size)+')… keep this page open.');
        return B.uploadPresigned('rssp-data/apps/'+safe+'-'+Date.now().toString(36)+'-'+(n+1)+'.'+ext,f,{access:'private',handleUploadUrl:'/api/apps',headers:{'x-admin-key':S.adminKey||''},multipart:f.size>50*1024*1024,contentType:f.type||(ext==='apk'?'application/vnd.android.package-archive':'application/octet-stream'),
          onUploadProgress:function(pr){var v=Math.round((doneB+f.size*(pr.percentage||0)/100)/Math.max(1,totB)*100);$('apFill').style.width=v+'%';$('apPct').textContent=v+'%'}})
          .then(function(r){doneB+=f.size;files.push({pathname:r.pathname,name:f.name,size:f.size,type:r.contentType||f.type||''})})})},Promise.resolve())})
      .then(save).then(done).catch(function(e){sv.disabled=false;setStatus('apStatus','Upload failed: '+((e&&e.message)||e)+'. Try again on a steady connection.','err')});
  });
}
function alertMsg(e){var el=$('apStatus');if(el)setStatus('apStatus',(e&&e.message)||String(e),'err');else alert((e&&e.message)||e)}
/* ---------- Achievement Data Bank (admin only) ---------- */
var BANK_MET=[['ga','Total GA'],['rfo','RFO GA'],['ag','Agent GA'],['rep','SIM replacement'],['wms','WMS token'],['c2s','Mco C2S']];
var BANK_LBL={'agent ga':'ag','rfo ga count':'rfo','rfo ga':'rfo','sim replacement (all types)':'rep','sim replacement':'rep','wms token':'wms','mco c2s ach.':'c2s','mco c2s ach':'c2s','c2s ach.':'c2s'};
var BANK_ALIAS={};
function bankNk(s){return String(s||'').toLowerCase().replace(/[^a-z]/g,'')}
function lev(a,b){var p=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;for(i=1;i<=a.length;i++){var c=[i];for(j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[b.length]}
function bankMonthKey(v){if(v instanceof Date&&!isNaN(v))return v.getFullYear()+'-'+rsspPad(v.getMonth()+1);var m=String(v||'').trim().match(/^([A-Za-z]{3})[a-z]*[\s'’_-]*(\d{2,4})$/);if(!m)return '';var i=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[1].toLowerCase());if(i<0)return '';var y=+m[2];if(y<100)y+=2000;return y+'-'+rsspPad(i+1)}
/* ---------- RSSP base master file (admin only): every column is kept, so new columns show up on their own ---------- */
function baseLbl(x){return String(x==null?'':x).replace(/\s+/g,' ').trim()}
function baseNorm(x){return baseLbl(x).toUpperCase().replace(/[^A-Z0-9]/g,'')}
function baseCanon(){if(baseCanon.m)return baseCanon.m;var m={LONGITUDE:'LONGITUDE'};BASE_G.forEach(function(g){g[1].forEach(function(f){m[baseNorm(f[0])]=f[0]})});return baseCanon.m=m}
function findBaseHeader(rows){for(var r=0;r<Math.min(12,rows.length);r++){var h=(rows[r]||[]).map(baseNorm);if(h.indexOf('RSSPCODERB')>=0&&(h.indexOf('RSSPELRB')>=0||h.indexOf('RSSPCODEAT')>=0||h.indexOf('RDMSFFCODETS')>=0))return r}return -1}
function handleBaseRows(rows,hr,fileName){
  if(!S.canEdit)return Promise.reject(new Error('Sign in as admin to import the base master file.'));
  var CM=baseCanon(),H=rows[hr].map(function(x){var l=baseLbl(x);return CM[baseNorm(l)]||l}),ci=H.indexOf('RSSP CODE RB'),cols=[],out={},n=0;
  H.forEach(function(h,i){if(h&&h!==','&&cols.indexOf(h)<0)cols.push(h)});
  var isPh=function(h){return /mobile|contact no|msisdn/i.test(h)};
  for(var i=hr+1;i<rows.length;i++){var r=rows[i];if(!r)continue;var code=baseLbl(r[ci]);if(!/^[A-Z]{1,2}\d{4,}$/i.test(code))continue;
    var o={};H.forEach(function(h,j){if(!h||h===',')return;var v=r[j];if(v==null||v==='')return;
      if(v instanceof Date&&!isNaN(v)){v=dfull(rsspNormDate(new Date(v.getTime()+12*3600000)))}
      else if(typeof v==='number'){v=String(v);if(isPh(h)&&v.length===10)v='0'+v}
      else{v=baseLbl(v);if(isPh(h)&&/^\d{10}$/.test(v))v='0'+v}
      if(v!=='')o[h]=v});
    out[code]=o;n++}
  if(!n)throw new Error('No RSSP rows with a code were found in '+fileName+'.');
  setStatus('upStatus','Saving the base master file…');
  return apiSave({kind:'base',data:{fileName:fileName||'',uploadedAt:new Date().toISOString(),cols:cols,rows:out}}).then(loadData).then(function(){return 'Base master file saved: '+n+' RSSPs and '+cols.length+' columns. Open RSSP Detail to see them (admin only).'});
}
function findBankHeader(rows){for(var r=1;r<Math.min(8,rows.length);r++){var h=(rows[r]||[]).map(function(x){return String(x==null?'':x).trim()});if(h.indexOf('RSSP Name')>=0&&h.some(function(x){return BANK_LBL[x.toLowerCase()]}))return r}return -1}
function handleBankRows(rows,hr,fileName){
  if(!S.canEdit)return Promise.reject(new Error('Sign in as admin to import the data bank.'));
  var H=rows[hr].map(function(x){return String(x==null?'':x).trim()}),MR=rows[hr-1]||[],col=function(n){return H.indexOf(n)};
  var C={start:col('Operation Start Date'),area:col('Area'),sup:col('Territory SUP Name'),upz:col('Upazilla'),agent:col('Agent Name'),name:col('RSSP Name')};
  var cols=[],months={};H.forEach(function(h,i){var k=BANK_LBL[h.toLowerCase()],m=bankMonthKey(MR[i]);if(k&&m){cols.push([i,k,m]);months[m]=1}});
  if(!cols.length)throw new Error('No month columns were found in '+fileName+'.');
  var site={};allCodes().forEach(function(c){site[c]=bankNk(infoFor(c).name)});
  var match=function(n){var k=bankNk(n);if(BANK_ALIAS[k])return BANK_ALIAS[k];var best=null,bd=99,nd=99;Object.keys(site).forEach(function(c){var d=lev(k,site[c]);if(d<bd){nd=bd;bd=d;best=c}else if(d<nd)nd=d});return best&&(bd<=2||(bd<=4&&nd-bd>=2))?best:null};
  var out={},miss=[];
  for(var r=hr+1;r<rows.length;r++){var row=rows[r];if(!row)continue;var n=String(row[C.name]==null?'':row[C.name]).trim();if(!n)continue;
    var code=match(n);if(!code){miss.push(n);code='name:'+bankNk(n)}
    var o=out[code]||(out[code]={name:n,area:C.area>=0?String(row[C.area]||''):'',sup:C.sup>=0?String(row[C.sup]||''):'',upz:C.upz>=0?String(row[C.upz]||''):'',agent:C.agent>=0?String(row[C.agent]||'').replace(/\s*RSSP(AG|DSO)_[\w]+$/i,'').trim():'',start:C.start>=0?rsspNormDate(row[C.start]):'',m:{}});
    cols.forEach(function(x){var v=row[x[0]];if(v==null||v==='')return;v=+v;if(!isFinite(v))return;var mm=o.m[x[2]]||(o.m[x[2]]={});mm[x[1]]=Math.round(v*100)/100})}
  var ms=Object.keys(months).sort(),n=Object.keys(out).length;
  setStatus('upStatus','Saving the data bank…');
  return apiSave({kind:'bank',data:{file:fileName||'',at:new Date().toISOString(),months:ms,rssp:out}}).then(loadData).then(function(){
    return 'Data bank saved: '+n+' RSSPs, '+mlabel(ms[0])+' to '+mlabel(ms[ms.length-1])+' ('+ms.length+' months). Only you see it, in the Data Bank tab.'+(miss.length?' Not matched to a site RSSP: '+miss.join(', ')+'.':'')});
}
/* month totals per RSSP from an Activation upload, kept for the data bank */
function bankAutoFrom(M){var o={};Object.keys(M.rssp).forEach(function(c){var R=M.rssp[c],t={ga:0,rfo:0,ag:0,rep:0};Object.keys(R.days||{}).forEach(function(d){var a=R.days[d];t.ga+=a[0]+a[1];t.rep+=a[2]+a[3];t.rfo+=a[12]||0;t.ag+=a[13]||0});o[c]=t});return o}
function bankData(){
  var B=S.bank;if(!B)return null;var ms={},rs={};(B.months||[]).forEach(function(m){ms[m]='x'});
  Object.keys(B.rssp||{}).forEach(function(c){var X=B.rssp[c];rs[c]={code:c,name:X.name,area:X.area,sup:X.sup,agent:X.agent,start:X.start,m:{}};Object.keys(X.m||{}).forEach(function(m){var v=Object.assign({},X.m[m]);if(v.ga==null&&(v.ag!=null||v.rfo!=null))v.ga=(v.ag||0)+(v.rfo||0);rs[c].m[m]=v})});
  var A=B.auto||{};Object.keys(A).forEach(function(m){if(ms[m]==='x')return;ms[m]=A[m].full?'s':'p';Object.keys(A[m].rssp||{}).forEach(function(c){var I=infoFor(c),r=rs[c]||(rs[c]={code:c,name:I.name,area:I.area,sup:supOfDh(I.distributor),m:{}});r.m[m]=Object.assign({},r.m[m]||{},A[m].rssp[c])})});
  /* the month on screen right now, if newer than anything stored */
  if(S.meta&&S.meta.month&&!ms[S.meta.month]){var cm=S.meta.month;ms[cm]='p';Object.keys(S.docs||{}).forEach(function(c){var R=S.docs[c],t={ga:0,rfo:0,ag:0,rep:0};Object.keys(R.days||{}).forEach(function(d){var a=R.days[d];t.ga+=a[0]+a[1];t.rep+=a[2]+a[3];t.rfo+=a[12]||0;t.ag+=a[13]||0});var I=infoFor(c),r=rs[c]||(rs[c]={code:c,name:I.name,area:I.area,sup:supOfDh(I.distributor),m:{}});r.m[cm]=t})}
  Object.keys(rs).forEach(function(c){var r=rs[c];if(!r.sup||r.sup===NO_SUP){var I=infoFor(c);if(I.distributor)r.sup=supOfDh(I.distributor)}if(!r.area){r.area=infoFor(c).area}});
  return {months:Object.keys(ms).sort(),src:ms,rows:Object.keys(rs).map(function(c){return rs[c]}),B:B};
}
function viewBank(){
  if(!S.canEdit)return '<div class="panel empty"><h2>Admin only</h2></div>';
  var D=bankData();
  if(!D)return '<div class="panel empty"><h2>No data bank yet</h2><p class="note">Upload your <b>RSSP Achievement Data Bank</b> Excel in Upload &amp; Targets. Every month column in it is read; months after it fill in from each Activation upload.</p><button class="btn" data-goto="setup">Upload the file</button></div>';
  var K=S.bankMet||'ga',span=S.bankSpan||12,MS=D.months.slice(span==='all'?0:-span),inA=function(r){return S.area==='All'||r.area===S.area||(S.area==='Chandpur'&&/chandpur/i.test(r.area))};
  var R=D.rows.filter(inA).sort(function(a,b){return String(a.area).localeCompare(String(b.area))||String(a.sup).localeCompare(String(b.sup))||String(a.name).localeCompare(String(b.name))});
  var val=function(r,m){var x=r.m[m];return x&&x[K]!=null?x[K]:null},has=MS.filter(function(m){return R.some(function(r){return val(r,m)!=null})});
  var lab=function(m){return MON[+m.slice(5,7)-1]+"'"+m.slice(2,4)+(D.src[m]==='p'?'*':'')};
  var tot=function(m,list){var t=0,n=0;list.forEach(function(r){var v=val(r,m);if(v!=null){t+=v;n++}});return n?t:null};
  var fmtv=function(v){return v==null?'–':K==='c2s'?fmt(Math.round(v)):fmt(v)};
  var h='<section class="section"><div class="sechead"><h2>Achievement Data Bank</h2><span class="note">Only you see this · '+(D.B.file?'Excel '+esc(D.B.file):'Excel import')+(D.B.at?' (imported '+dlabel(String(D.B.at).slice(0,10))+')':'')+' · later months from Activation uploads · * = month in progress</span></div>'+
    '<div class="seg" role="group" aria-label="Metric" style="flex-wrap:wrap;max-width:100%">'+BANK_MET.map(function(x){return '<button data-bankmet="'+x[0]+'" aria-pressed="'+(K===x[0])+'">'+x[1]+'</button>'}).join('')+'</div> '+
    '<div class="seg" role="group" aria-label="Months" style="margin-top:8px">'+[[6,'6 months'],[12,'12 months'],['all','All']].map(function(x){return '<button data-bankspan="'+x[0]+'" aria-pressed="'+(String(span)===String(x[0]))+'">'+x[1]+'</button>'}).join('')+'</div></section>';
  if(!has.length)return h+'<div class="panel empty"><p class="note">No '+esc(BANK_MET.filter(function(x){return x[0]===K})[0][1])+' figures in these months.'+(K==='wms'||K==='c2s'?' These come only from your Excel.':'')+'</p></div>';
  /* region trend */
  h+='<section class="section"><div class="sechead"><h2>'+(S.area==='All'?'Region':esc(S.area))+' month on month</h2></div><div class="panel"><div class="chart" id="bankChart"></div></div></section>';
  chartJobs.push(function(){var el=$('bankChart');if(!el)return;barChart(el,has.map(function(m){var v=tot(m,R)||0;return {label:lab(m),segs:[{v:v,cls:D.src[m]==='p'?'bar-sun':'bar-sky'}],tip:'<b>'+lab(m)+'</b><br>'+fmtv(v)}}),{labels:true,h:230,aria:'Month on month'})});
  /* SUP x month */
  var sups={};R.forEach(function(r){var k=r.sup||NO_SUP;(sups[k]=sups[k]||[]).push(r)});
  var growth=function(a,b){return a==null||!b?'–':grCell(a,b)};
  var lastFull=has.filter(function(m){return D.src[m]!=='p'}),LM=lastFull[lastFull.length-1],PM=lastFull[lastFull.length-2];
  h+='<section class="section"><div class="sechead"><h2>By SUP</h2><span class="note">'+(LM?'Growth: '+lab(LM)+' vs '+(PM?lab(PM):'–'):'')+'</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th>'+has.map(function(m){return '<th>'+lab(m)+'</th>'}).join('')+'<th>Growth</th></tr></thead><tbody>'+
    Object.keys(sups).sort().map(function(k){var L=sups[k];return '<tr><td class="name"><b>'+esc(k)+'</b><small>'+L.length+' RSSPs</small></td>'+has.map(function(m){return '<td>'+fmtv(tot(m,L))+'</td>'}).join('')+'<td>'+growth(LM&&tot(LM,L),PM&&tot(PM,L))+'</td></tr>'}).join('')+
    '<tr class="tot"><td class="name"><b>Total</b></td>'+has.map(function(m){return '<td><b>'+fmtv(tot(m,R))+'</b></td>'}).join('')+'<td>'+growth(LM&&tot(LM,R),PM&&tot(PM,R))+'</td></tr></tbody></table></div></section>';
  /* RSSP x month with heat tint + target helpers */
  var stats=function(r){var v=lastFull.map(function(m){return val(r,m)}).filter(function(x){return x!=null}),l3=v.slice(-3),a3=l3.length?l3.reduce(function(a,b){return a+b},0)/l3.length:null,mx3=l3.length?Math.max.apply(null,l3):null,all=Object.keys(r.m).map(function(m){return val(r,m)}).filter(function(x){return x!=null&&D.src[Object.keys(r.m)[0]]!==undefined});
    var allMax=Object.keys(r.m).filter(function(m){return D.src[m]!=='p'}).map(function(m){return val(r,m)}).filter(function(x){return x!=null});return {a3:a3,mx3:mx3,lm:v.length?v[v.length-1]:null,amax:allMax.length?Math.max.apply(null,allMax):null,sug:a3==null?null:Math.round((a3+mx3)/2)}};
  S._bankCsv=[['RSSP','SUP','Area'].concat(has.map(lab)).concat(['3M avg','LM','3M max','All-time max','Suggested (3M avg + max)/2'])];
  h+='<section class="section"><div class="sechead"><h2>RSSP month on month</h2><button class="btn" id="bankCsv" style="padding:6px 12px">Download</button></div><div class="tablebox short"><table class="compact lb"><thead><tr><th class="name l">RSSP</th>'+has.map(function(m){return '<th>'+lab(m)+'</th>'}).join('')+'<th>3M avg</th><th>LM</th><th>3M max</th><th>All-time max</th><th>Suggested target</th></tr></thead><tbody>'+
    Object.keys(sups).sort().map(function(k){var L=sups[k];return '<tr class="subhead"><td colspan="'+(has.length+6)+'" style="position:sticky;left:0">'+esc(k)+'</td></tr>'+L.map(function(r){var vs=has.map(function(m){return val(r,m)}),mx=Math.max.apply(null,vs.filter(function(x){return x!=null}).concat([1])),st=stats(r);
      S._bankCsv.push([r.name,r.sup,r.area].concat(vs.map(function(v){return v==null?'':v})).concat([st.a3==null?'':Math.round(st.a3),st.lm==null?'':st.lm,st.mx3==null?'':st.mx3,st.amax==null?'':st.amax,st.sug==null?'':st.sug]));
      return '<tr><td class="name">'+(S.docs[r.code]?'<button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button>':'<b>'+esc(r.name)+'</b>')+'<small>'+esc(r.agent||r.area||'')+'</small></td>'+vs.map(function(v){return '<td'+(v!=null&&mx?' style="background:rgba(46,156,244,'+(0.06+0.34*v/mx).toFixed(2)+')"':'')+'>'+fmtv(v)+'</td>'}).join('')+
        '<td>'+fmtv(st.a3==null?null:Math.round(st.a3))+'</td><td>'+fmtv(st.lm)+'</td><td>'+fmtv(st.mx3)+'</td><td>'+fmtv(st.amax)+'</td><td><b>'+fmtv(st.sug)+'</b></td></tr>'}).join('')}).join('')+'</tbody></table></div><p class="note">Darker cells = the RSSP’s stronger months. Helpers use completed months only: 3M avg and 3M max are the last three completed months; Suggested target = (3M avg + 3M max) ÷ 2, as in your sheet. Total GA = Agent GA + RFO GA for Excel months.</p></section>';
  return h;
}
/* ---------- Phase 6: DCM KPI dashboard (admin only) ----------
   1 RSSP GA vs HQ target · 2 FWA vs HQ target (both scored on pace vs time gone)
   3 Super Bike: every bike must run >=3 KM on 20 days of the month (share of bikes on track)
   4 RFO: 90% of RFOs must sell >=1 GA on 85% of working days; a new joiner this month needs 5 such days */
var DCM_DEF={w:{ga:20,fwa:20,bike:20,rfo:20,agent:20,gift:20,rsspT:20},rsspN:18,agPct:.9,bikeDays:20,rfoWD:23,rfoDayShare:.85,rfoPct:.9,njDays:5,cap:1.2};
function dcmCfg(){var c=(S.master&&S.master.dcm)||{},w=c.w||{},d=DCM_DEF.w,g=function(k){return +(w[k]!=null?w[k]:d[k])};return {man:c.man||{},rsspN:+(c.rsspN||DCM_DEF.rsspN),w:{ga:g('ga'),fwa:g('fwa'),bike:g('bike'),rfo:g('rfo'),agent:g('agent'),gift:g('gift'),rsspT:g('rsspT')},bikeDays:+(c.bikeDays||DCM_DEF.bikeDays),rfoWD:+(c.rfoWD||DCM_DEF.rfoWD),rfoDayShare:DCM_DEF.rfoDayShare,rfoPct:DCM_DEF.rfoPct,njDays:DCM_DEF.njDays,cap:DCM_DEF.cap}}
function viewDcm(rows,f,cal){
  if(!S.canEdit)return '<div class="panel empty"><h2>Admin only</h2><p class="note">Sign in as admin to see the DCM KPI dashboard.</p></div>';
  var C=dcmCfg(),tg=cal.tg,inA=function(a){return S.area==='All'||a===S.area},R=f;
  var pc=function(v){return v==null?'–':pct(v)},col=function(p){return p==null?'':p>=1?'g':p>=.85?'a':'r'},capd=function(v){return v==null?null:Math.min(v,C.cap)};
  /* 1. RSSP GA */
  var gaT=R.reduce(function(a,r){return a+(r.tgt||0)},0),ga=R.reduce(function(a,r){return a+r.ga},0),lm=R.some(function(r){return r.lmGa!=null})?R.reduce(function(a,r){return a+(r.lmGa||0)},0):null;
  var needGa=gaT?Math.max(0,gaT-ga)/Math.max(1,cal.remaining):0;
  var K1={k:'ga',name:'RSSP GA',p:gaT?capd(ga/gaT/tg):null,big:fmt(ga)+(gaT?'<span class="kd"> / '+fmt(gaT)+'</span>':''),sub:gaT?'Achieved '+pct(ga/gaT):'No HQ target',
    tgtTxt:gaT?fmt(gaT)+' GA':'–',actTxt:fmt(ga)+' GA',achTxt:gaT?pct(ga/gaT):'–',needTxt:gaT?fmt(Math.ceil(needGa))+' GA a day':'–',projTxt:fmt(Math.round(ga/cal.elapsed*cal.dim))+' GA',rule:'HQ Total GA target · scored on pace vs time gone',lm:lm,act:ga};
  /* 2. FWA */
  var fT=R.reduce(function(a,r){return a+(r.wifiT||0)},0),fw=R.reduce(function(a,r){return a+r.wifi},0),flm=R.some(function(r){return r.lmWifi!=null})?R.reduce(function(a,r){return a+(r.lmWifi||0)},0):null;
  var K2={k:'fwa',name:'FWA sales',p:fT?capd(fw/fT/tg):null,big:fmt(fw)+(fT?'<span class="kd"> / '+fmt(fT)+'</span>':''),sub:fT?'Achieved '+pct(fw/fT):'No HQ target',
    tgtTxt:fT?fmt(fT)+' FWA':'–',actTxt:fmt(fw)+' FWA',achTxt:fT?pct(fw/fT):'–',needTxt:fT?fmt(Math.ceil(Math.max(0,fT-fw)/Math.max(1,cal.remaining)))+' a day':'–',projTxt:fmt(Math.round(fw/cal.elapsed*cal.dim))+' FWA',rule:'HQ FWA target · scored on pace vs time gone',lm:flm,act:fw};
  /* 3. Super Bike: >=3 KM on 20 days */
  var BK=[],bDates=[],bWD=0,bWDall=0,bRem=0;
  try{var br=bikeRows();if(br){bDates=bikeDates();var bm=S.bike.data.month||bDates[0].slice(0,7),dimB=new Date(+bm.slice(0,4),+bm.slice(5,7),0).getDate();
    bWD=bDates.filter(function(d){return !isOffDay(d)}).length;for(var i=1;i<=dimB;i++){var dd=bm+'-'+(i<10?'0':'')+i;if(!isOffDay(dd))bWDall++}bRem=Math.max(0,bWDall-bWD);var bRemAll=Math.max(0,dimB-bDates.length);
    var need=Math.floor(C.bikeDays*bWD/Math.max(1,bWDall));
    BK=br.filter(function(b){return inA(b.area)}).map(function(b){/* any day counts, Fridays included, unless the bike is marked faulty that day */var fri=0,ok=(b.km||[]).reduce(function(a,v,i){var g=v>=BIKE_MIN&&b.st[i]!=='fault';if(g&&b.st[i]==='off')fri++;return a+(g?1:0)},0),st=ok>=C.bikeDays?'met':ok>=need?'track':ok+bRemAll>=C.bikeDays?'behind':'lost';return {b:b,ok:ok,fri:fri,st:st,sup:supOfDh(b.dh,ROBI2RDMS[String((S.bike.map.bikes[b.id]||{}).dhCode||'')]),gap:Math.max(0,C.bikeDays-ok)}})}}catch(e){}
  var bOn=BK.filter(function(x){return x.st==='met'||x.st==='track'}).length,bLost=BK.filter(function(x){return x.st==='lost'}).length,bNeed=Math.floor(C.bikeDays*bWD/Math.max(1,bWDall));
  var K3={k:'bike',name:'Super Bike productivity',p:BK.length?capd(bOn/BK.length):null,big:bOn+'<span class="kd"> / '+BK.length+' bikes</span>',sub:'On track for '+C.bikeDays+' days at ≥3 KM'+(bLost?' · '+bLost+' can’t reach it':''),
    tgtTxt:'Every bike '+C.bikeDays+' days ≥3 KM',actTxt:bOn+' of '+BK.length+' on track',achTxt:BK.length?pct(bOn/BK.length):'–',needTxt:bNeed+' good days by now ('+bWD+' of '+bWDall+' working days)',projTxt:BK.filter(function(x){return x.st!=='lost'}).length+' can still reach 20',rule:'≥3 KM on '+C.bikeDays+' days each · target 100% of bikes'};
  /* 4. RFO: >=1 GA on 85% of working days; new joiner this month 5 days */
  var wdE=Math.min(C.rfoWD,Math.round(C.rfoWD*cal.elapsed/cal.dim)),wdR=Math.max(0,C.rfoWD-wdE),reqFull=Math.ceil(C.rfoWD*C.rfoDayShare),reqNow=Math.ceil(wdE*C.rfoDayShare);
  var mStart=S.meta.month+'-01',RF=computeBps(cal).filter(function(b){return b.role==='RFO'&&!(b.sf&&!b.sf.a)}).map(function(b){var nj=!!(b.join&&b.join>=mStart),req=nj?C.njDays:reqFull,
      reqN=nj?Math.min(C.njDays,Math.ceil(Math.max(0,daysBetween(b.join,cal.end))*C.rfoDayShare*C.rfoWD/cal.dim)):reqNow,d=b.active,st=d>=req?'met':d>=reqN?'track':d+wdR>=req?'behind':'lost';
      var r=R.filter(function(x){return x.code===b.code})[0];return {b:b,nj:nj,req:req,reqN:reqN,d:d,st:st,sup:r?supOfDh(r.distributor):NO_SUP}});
  var rOn=RF.filter(function(x){return x.st==='met'||x.st==='track'}).length,rShare=RF.length?rOn/RF.length:null;
  var K4={k:'rfo',name:'RFO productivity',p:rShare==null?null:capd(rShare/C.rfoPct),big:rOn+'<span class="kd"> / '+RF.length+' RFOs</span>',sub:'On track · '+pc(rShare)+' vs '+pct(C.rfoPct)+' needed',
    tgtTxt:pct(C.rfoPct)+' of RFOs: 1 GA on '+reqFull+' of '+C.rfoWD+' days',actTxt:rOn+' of '+RF.length+' on track ('+pc(rShare)+')',achTxt:pc(rShare),needTxt:reqNow+' selling days by now ('+wdE+' of '+C.rfoWD+' working days)',projTxt:RF.filter(function(x){return x.st!=='lost'}).length+' can still qualify',rule:'New joiners this month need '+C.njDays+' selling days'};
  /* 5 & 6: manual KPIs typed from the Excel tracker (WMS footfall and gift card data are not uploaded yet) */
  var MN=C.man[S.meta.month]||{},agAll=computeBps(cal).filter(function(b){return b.role==='Agent'&&!(b.sf&&!b.sf.a)}).length,agN=+(MN.agN||agAll),agT=+(MN.agT||DCM_DEF.agPct*100)/100,agQ=MN.agQ==null||MN.agQ===''?null:+MN.agQ;
  var K5={k:'agent',man:1,name:'Agent productivity',p:agQ==null||!agN?null:capd(agQ/agN/agT),big:agQ==null?'<span class="kd">Not entered</span>':agQ+'<span class="kd"> / '+agN+' Agents</span>',sub:agQ==null?'Type it in below from your Excel':'Qualified or on track · '+pct(agQ/agN)+' vs '+pct(agT)+' needed',
    tgtTxt:pct(agT)+' of Agents: 1 WMS token on '+C.rfoWD+' days',actTxt:agQ==null?'Not entered':agQ+' of '+agN+' Agents',achTxt:agQ==null||!agN?'–':pct(agQ/agN),needTxt:'New joiners this month: '+C.njDays+' days',projTxt:MN.at?'Entered '+dlabel(MN.at.slice(0,10)):'From your Excel',rule:'Manual entry · WMS footfall'};
  var gT=R.reduce(function(a,r){return a+((r.hq&&r.hq.redeem)||0)},0),gA=MN.gift==null||MN.gift===''?null:+MN.gift;
  var K6={k:'gift',man:1,name:'Gift card redemption',p:gA==null||!gT?null:capd(gA/gT/tg),big:gA==null?'<span class="kd">Not entered</span>':fmt(gA)+(gT?'<span class="kd"> / '+fmt(gT)+'</span>':''),sub:gA==null?'Type it in below from your Excel':(gT?'Achieved '+pct(gA/gT):'No HQ target'),
    tgtTxt:gT?fmt(gT)+' (HQ Dhonnobad card)':'–',actTxt:gA==null?'Not entered':fmt(gA)+' redeemed',achTxt:gA==null||!gT?'–':pct(gA/gT),needTxt:gA==null||!gT?'–':fmt(Math.ceil(Math.max(0,gT-gA)/Math.max(1,cal.remaining)))+' a day',projTxt:gA==null?'–':fmt(Math.round(gA/cal.elapsed*cal.dim))+' at this rate',rule:'Manual entry · scored on pace vs time gone'};
  /* 7. RSSPs achieving their own GA target (goal: C.rsspN RSSPs) */
  var RT=R.filter(function(r){return r.tgt}).map(function(r){var a=r.ga/r.tgt,p=a/tg,proj=r.ga/cal.elapsed*cal.dim,st=a>=1?'met':p>=1?'track':proj>=r.tgt*.95?'close':'behind';return {r:r,a:a,p:p,proj:proj,st:st,need:Math.max(0,r.tgt-r.ga)/Math.max(1,cal.remaining)}});
  var rtOn=RT.filter(function(x){return x.st==='met'||x.st==='track'}).length,rtMet=RT.filter(function(x){return x.st==='met'}).length,rtGoal=S.area==='All'?C.rsspN:Math.max(1,Math.round(C.rsspN*R.length/Math.max(1,rows.length)));
  var K7={k:'rsspT',name:'RSSPs on GA target',p:RT.length?capd(rtOn/rtGoal):null,big:rtOn+'<span class="kd"> / '+rtGoal+' needed</span>',sub:RT.length?rtMet+' already achieved · '+(rtOn-rtMet)+' on pace · of '+RT.length+' RSSPs':'No HQ targets loaded',
    tgtTxt:rtGoal+' RSSPs at 100% of their GA target',actTxt:rtOn+' on pace or achieved',achTxt:RT.length?pct(rtOn/rtGoal):'–',needTxt:RT.filter(function(x){return x.st==='close'}).length+' close (projected ≥95%)',projTxt:RT.filter(function(x){return x.proj>=x.r.tgt}).length+' projected to achieve',rule:'Each RSSP vs its own HQ Total GA target'};
  var KS=[K1,K2,K3,K4,K5,K6,K7],wSum=KS.reduce(function(a,k){return a+(k.p!=null?C.w[k.k]:0)},0)||1,wTot=KS.reduce(function(a,k){return a+C.w[k.k]},0)||1,wp=function(k){return Math.round(C.w[k]/wTot*100)},score=KS.reduce(function(a,k){return a+(k.p!=null?k.p*C.w[k.k]:0)},0)/wSum*100;
  var where=S.area==='All'?'Chandpur Region':S.area+' area',asof=dlabel(cal.end)+' '+cal.end.slice(0,4);
  var h=waButton()+'<section class="section"><div class="kpis">'+
    kpi('DCM KPI score',Math.round(score)+'<span class="kd"> pts</span>','100 = every KPI on target · max '+Math.round(C.cap*100))+
    KS.map(function(k){return kpi(esc(k.name)+' · '+wp(k.k)+'%',k.big,k.sub+(k.p!=null?' · <span class="gac '+col(k.p)+'">'+pct(k.p)+'</span>':'')+(k.lm!=null?grBadge(k.act,k.lm):''),k.p==null?'info':{g:'good',a:'warn',r:'bad'}[col(k.p)])}).join('')+'</div></section>';
  h+='<section class="section"><div class="sechead"><h2>KPI scorecard</h2><span class="note">'+cal.elapsed+' of '+cal.dim+' days · '+pct(tg)+' time gone</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">KPI</th><th>Weight</th><th class="l">Target</th><th class="l">MTD</th><th>Achieved</th><th>Score</th><th class="l">Needed</th><th class="l">Outlook</th></tr></thead><tbody>'+
    KS.map(function(k){return '<tr><td class="name"><b>'+esc(k.name)+'</b><small>'+esc(k.rule)+'</small></td><td>'+wp(k.k)+'%</td><td class="l">'+esc(k.tgtTxt)+'</td><td class="l"><b>'+esc(k.actTxt)+'</b></td><td>'+k.achTxt+'</td><td><b>'+(k.p==null?'–':(k.p*C.w[k.k]/wSum*100).toFixed(1))+'</b></td><td class="l">'+esc(k.needTxt)+'</td><td class="l">'+esc(k.projTxt)+'</td></tr>'}).join('')+
    '<tr class="tot"><td class="name"><b>DCM score</b></td><td>100%</td><td></td><td></td><td></td><td><b>'+Math.round(score)+'</b></td><td></td><td></td></tr></tbody></table></div><p class="note">RSSP GA and FWA: achievement ÷ time gone. Super Bike: share of bikes on track for '+C.bikeDays+' days at ≥3 KM (target 100%). RFO: share of RFOs on track ÷ '+pct(C.rfoPct)+'. Each KPI is capped at '+Math.round(C.cap*100)+'%; a KPI with no target is left out.</p></section>';
  h+='<section class="section"><div class="sechead"><h2>RSSP GA by day</h2><span class="note">'+(gaT?'Red line: '+fmt(Math.ceil(needGa))+' a day needed for the rest of the month':'')+'</span></div><div class="panel"><div class="chart" id="dcmGa"></div></div></section>';
  chartJobs.push(function(){var el=$('dcmGa');if(!el)return;barChart(el,cal.dates.map(function(d,i){var v=R.reduce(function(a,r){var x=r.daily[i];return a+(x?x.robi+x.airtel:0)},0);return {label:String(+d.slice(8)),segs:[{v:v,cls:'bar-sky'}],tip:'<b>'+dlabel(d)+'</b><br>'+fmt(v)+' GA'}}),{labels:true,h:220,ref:gaT?{v:Math.ceil(needGa),label:'Need'}:null,aria:'RSSP GA by day'})});
  /* by SUP */
  var SU={},su=function(n){return SU[n]||(SU[n]={name:n,n:0,ga:0,tgt:0,fw:0,fT:0,bOn:0,bN:0,rOn:0,rN:0})};
  R.forEach(function(r){var u=su(supOfDh(r.distributor));u.n++;u.ga+=r.ga;u.tgt+=r.tgt||0;u.fw+=r.wifi;u.fT+=r.wifiT||0});
  BK.forEach(function(x){var u=su(x.sup);u.bN++;if(x.st==='met'||x.st==='track')u.bOn++});RF.forEach(function(x){var u=su(x.sup);u.rN++;if(x.st==='met'||x.st==='track')u.rOn++});
  var SL=Object.keys(SU).map(function(k){return SU[k]}).filter(function(u){return u.n||u.bN}).sort(function(a,b){return (b.tgt?b.ga/b.tgt:0)-(a.tgt?a.ga/a.tgt:0)});
  var pace=function(v,t){var p=t?v/t/tg:null;return '<td>'+fmt(v)+(t?' <small class="note">/ '+fmt(t)+'</small>':'')+'</td><td>'+(p==null?'–':'<span class="gac '+col(p)+'">'+pct(p)+'</span>')+'</td>'},share=function(a,n,goal){var p=n?a/n/goal:null;return '<td>'+a+' / '+n+'</td><td>'+(p==null?'–':'<span class="gac '+col(p)+'">'+pct(a/n)+'</span>')+'</td>'};
  h+='<section class="section"><div class="sechead"><h2>KPIs by SUP</h2></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>RSSP GA</th><th>Pace</th><th>FWA</th><th>Pace</th><th>Bikes on track</th><th>Share</th><th>RFOs on track</th><th>Share</th></tr></thead><tbody>'+
    SL.map(function(u){return '<tr><td class="name"><b>'+esc(u.name)+'</b><small>'+u.n+' RSSPs</small></td>'+pace(u.ga,u.tgt)+pace(u.fw,u.fT)+share(u.bOn,u.bN,1)+share(u.rOn,u.rN,C.rfoPct)+'</tr>'}).join('')+'</tbody></table></div></section>';
  /* RSSP target list */
  if(RT.length){var sp=function(st){return st==='met'?'<span class="gac g">Achieved</span>':st==='track'?'<span class="gac g">On pace</span>':st==='close'?'<span class="gac a">Close</span>':'<span class="gac r">Behind</span>'},o2={behind:0,close:1,track:2,met:3};
    h+='<section class="section"><div class="sechead"><h2>RSSPs vs their GA target</h2><span class="note">'+rtOn+' on pace or achieved · goal '+rtGoal+' RSSPs</span></div><div class="tablebox short"><table class="compact lb"><thead><tr><th class="name l">RSSP</th><th>GA MTD</th><th>Target</th><th>Achieved</th><th>Pace</th><th>Needs / day</th><th>Projected</th><th class="l">Status</th></tr></thead><tbody>'+
      RT.slice().sort(function(a,b){return o2[b.st]-o2[a.st]||b.p-a.p}).map(function(x,i){return (i===rtGoal?'<tr class="subhead"><td colspan="8" style="position:sticky;left:0">Below this line: outside the top '+rtGoal+'</td></tr>':'')+'<tr><td class="name"><button class="linkbtn" data-open="'+esc(x.r.code)+'">'+esc(x.r.name)+'</button><small>'+esc(supOfDh(x.r.distributor))+'</small></td><td><b>'+fmt(x.r.ga)+'</b></td><td>'+fmt(x.r.tgt)+'</td><td>'+pct(x.a)+'</td><td><span class="gac '+col(x.p)+'">'+pct(x.p)+'</span></td><td>'+fmt(Math.ceil(x.need))+'</td><td>'+fmt(Math.round(x.proj))+'</td><td class="l">'+sp(x.st)+'</td></tr>'}).join('')+'</tbody></table></div><p class="note">On pace = GA at or above the share of target for time gone. Close = not on pace yet, but projected at 95% or more of target at the current daily rate. Needs / day = GA per remaining day to reach target.</p></section>'}
  /* bike detail */
  var stP=function(st){return st==='met'?'<span class="gac g">Done</span>':st==='track'?'<span class="gac g">On track</span>':st==='behind'?'<span class="gac a">Behind</span>':'<span class="gac r">Can’t reach</span>'},ord={lost:0,behind:1,track:2,met:3};
  h+='<section class="section"><div class="sechead"><h2>Super Bike: days at ≥3 KM</h2><span class="note">Need '+C.bikeDays+' days · '+bNeed+' by now · '+bRem+' working days left in the bike month</span></div><div class="tablebox short"><table class="compact lb"><thead><tr><th class="name l">Bike rider</th><th>Days ≥3 KM</th><th>Still needed</th><th class="l">Status</th><th>On Friday</th><th>Faulty days</th></tr></thead><tbody>'+
    BK.slice().sort(function(a,b){return ord[a.st]-ord[b.st]||a.ok-b.ok}).map(function(x){var b=x.b,fd=b.st.filter(function(s){return s==='fault'}).length;return '<tr><td class="name"><b>'+esc(b.user)+'</b><small>'+esc((b.desig?b.desig+' · ':'')+b.dh)+'</small></td><td><b>'+x.ok+'</b> / '+C.bikeDays+'</td><td>'+x.gap+'</td><td class="l">'+stP(x.st)+'</td><td>'+(x.fri?'<span class="gac g">+'+x.fri+'</span>':'0')+'</td><td>'+(fd?'<span class="gac a">'+fd+'</span>':'0')+'</td></tr>'}).join('')+'</tbody></table></div><p class="note">On track = at least '+bNeed+' good days by now ('+C.bikeDays+' × '+bWD+' of '+bWDall+' working days). Any day at ≥3 KM counts, Fridays included (On Friday shows how many). Behind = can still reach '+C.bikeDays+' if it runs every remaining day. Days marked faulty in the fault register do not count as good days.</p></section>';
  /* RFO detail */
  h+='<section class="section"><div class="sechead"><h2>RFO: selling days</h2><span class="note">Need 1 GA on '+reqFull+' of '+C.rfoWD+' working days ('+reqNow+' by now) · new joiners '+C.njDays+' days</span></div><div class="tablebox short"><table class="compact lb"><thead><tr><th class="name l">RFO</th><th>AON</th><th>Selling days</th><th>Needed</th><th class="l">Status</th><th>GA MTD</th></tr></thead><tbody>'+
    RF.slice().sort(function(a,b){return ord[a.st]-ord[b.st]||a.d-b.d}).map(function(x){var b=x.b;return '<tr><td class="name"><b>'+esc(b.name)+'</b><small>'+esc(b.rssp)+(x.nj?' · new joiner':'')+'</small></td><td>'+aonPill(b.aon,b.join)+'</td><td><b>'+x.d+'</b></td><td>'+x.req+(x.st==='track'||x.st==='behind'?' <small class="note">('+x.reqN+' by now)</small>':'')+'</td><td class="l">'+stP(x.st)+'</td><td>'+fmt(b.ga)+'</td></tr>'}).join('')+'</tbody></table></div><p class="note">Selling day = a day with at least 1 GA. Working days so far are prorated from the '+C.rfoWD+' working days you set for this month. RFOs who left (inactive in the staff list) are not counted.</p></section>';
  /* settings */
  h+='<section class="section"><div class="sechead"><h2>Weights and month settings</h2><span class="note">Only you see this page</span></div><div class="panel weights">'+
    [['ga','RSSP GA'],['fwa','FWA'],['bike','Super Bike'],['rfo','RFO'],['agent','Agent'],['gift','Gift card'],['rsspT','RSSPs on target']].map(function(x){return '<label>'+x[1]+' weight<input type="number" min="0" id="dw_'+x[0]+'" value="'+C.w[x[0]]+'"></label>'}).join('')+
    '<label>RSSPs that must achieve target<input type="number" min="1" max="60" id="dw_rn" value="'+C.rsspN+'"></label><label>RFO and Agent working days<input type="number" min="1" max="31" id="dw_wd" value="'+C.rfoWD+'"></label><label>Bike days at ≥3 KM<input type="number" min="1" max="31" id="dw_bd" value="'+C.bikeDays+'"></label><button class="btn" id="dcmSave">Save</button></div><p class="note">Weights are relative: each KPI’s share is its weight ÷ the total, shown as % in the scorecard.</p><div class="status" id="dcmStatus"></div></section>';
  h+='<section class="section"><div class="sechead"><h2>Manual KPIs from your Excel</h2><span class="note">'+esc(mlabel(S.meta.month))+(MN.at?' · last entered '+dlabel(MN.at.slice(0,10)):'')+'</span></div><div class="panel weights">'+
    '<label>Agents qualified or on track<input type="number" min="0" id="dm_agQ" value="'+(agQ==null?'':agQ)+'"></label><label>Total Agents<input type="number" min="0" id="dm_agN" value="'+agN+'"></label><label>Agent target %<input type="number" min="0" max="100" id="dm_agT" value="'+Math.round(agT*100)+'"></label>'+
    '<label>Gift cards redeemed MTD<input type="number" min="0" id="dm_gift" value="'+(gA==null?'':gA)+'"></label><button class="btn" id="dcmManSave">Save</button></div><p class="note">Agent rule: at least 1 WMS token on '+C.rfoWD+' days (new Agents this month: '+C.njDays+' days). Gift card target is the HQ Dhonnobad card redemption target ('+fmt(gT)+'). Leave a box empty to keep that KPI out of the score.</p><div class="status" id="dmStatus"></div></section>';
  /* share */
  var t=['*DCM KPI Dashboard · '+where+'*','MTD to '+asof+' · '+pct(tg)+' time gone','','*Score:* '+Math.round(score)+' pts (100 = on target)',''];
  KS.forEach(function(k,i){t.push('*'+(i+1)+'. '+k.name+'* ('+wp(k.k)+'%)');t.push(k.actTxt+' · target '+k.tgtTxt+(k.p!=null?' · '+pct(k.p)+' of target':''));t.push('')});
  var lostB=BK.filter(function(x){return x.st==='lost'}),behindR=RF.filter(function(x){return x.st==='behind'||x.st==='lost'});
  t.push('Dashboard: '+location.origin);S.waText=t.join('\n');
  S.imgSpec={file:'dcm-kpi-'+cal.end,title:'DCM KPI Dashboard',sub:where+' · MTD to '+asof+' · '+pct(tg)+' time gone',
    kpis:[{l:'DCM KPI score',v:Math.round(score)+' pts',s:'100 = every KPI on target'}].concat(KS.map(function(k){return {l:k.name+' · '+wp(k.k)+'%',v:String(k.big).replace(/<[^>]+>/g,''),s:k.sub+(k.p!=null?' · '+pct(k.p):'')}})).concat([{l:'Projected RSSP GA',v:fmt(Math.round(ga/cal.elapsed*cal.dim)),s:gaT?'Needs '+fmt(Math.ceil(needGa))+' a day':''}]),
    sections:[{t:'RFOs behind on selling days',sev:'crit',items:behindR.sort(function(a,b){return a.d-b.d}).map(function(x){return x.b.name+' · '+x.b.rssp+'  ·  '+x.d+' of '+x.req+' days'+(x.st==='lost'?' (can’t reach)':'')})},{t:'Bikes that can’t reach '+C.bikeDays+' days',sev:'warn',items:lostB.map(function(x){return x.b.user+' · '+x.b.dh+'  ·  '+x.ok+' days'})}]};
  return h;
}
/* ---------- ID Database (admin only): service IDs, user names, eApproval / case IDs of agents and supervisors ---------- */
/* The file never goes into the shared snapshot. It is saved through /api/save (kind iddb) and read through /api/iddb with the admin key. */
var IDDB_LEFT=/name|e-?mail|domain|gmail|rssp|thana|union|district|area|region|cluster|vendor|remark|feedback|status|resign/i;
function iddbFmt(h,v){
  if(v==null)return '';
  if(v instanceof Date&&!isNaN(v)){var y=v.getFullYear(),m=v.getMonth(),d=v.getDate();return d+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]+' '+y}
  if(typeof v==='number'){var s=Number.isInteger(v)?String(v):String(v);
    /* phone and EL numbers lose their leading zero in Excel */
    if(/mobile|phone|\bEL\b|EL number/i.test(h)&&/^1\d{9}$/.test(s))s='0'+s;return s}
  return String(v).trim();
}
function iddbParse(X,wb,fileName){
  var sheets=[];
  wb.SheetNames.forEach(function(sn){
    var A=X.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null,blankrows:false});
    if(!A.length)return;
    var hdr=A[0].map(function(x){return x==null?'':String(x).replace(/\s+/g,' ').trim()}),n=Math.max.apply(null,A.map(function(r){return r.length}));
    var body=A.slice(1).filter(function(r){return r.some(function(v){return v!=null&&String(v).trim()!==''})});
    /* columns: keep only those with data; never keep a password column */
    var keep=[],names=[],used={},prevBase='';
    for(var j=0;j<n;j++){
      var h=hdr[j]||'',has=body.some(function(r){return r[j]!=null&&String(r[j]).trim()!==''});
      if(/password/i.test(h)||(/@/.test(h)&&/[$#!]/.test(h)&&!/\s/.test(h))){continue}
      if(!has)continue;
      var nm=h||'Note';
      if(/^e-?approval( id)?$/i.test(h)){nm='eApproval · '+(prevBase||'ID')}else if(h)prevBase=h;
      if(used[nm]){used[nm]++;nm=nm+' ('+used[nm]+')'}else used[nm]=1;
      keep.push(j);names.push(nm);
    }
    var rows=body.map(function(r){return keep.map(function(j,k){return iddbFmt(names[k],r[j])})});
    if(rows.length)sheets.push({name:sn,cols:names,rows:rows});
  });
  return {file:fileName||'',at:new Date().toISOString(),sheets:sheets};
}
function iddbUpload(file){
  setStatus('iddbStatus','Reading the file…');
  return loadXLSX().then(function(X){return file.arrayBuffer().then(function(buf){return iddbParse(X,X.read(buf,{type:'array',cellDates:true}),file.name)})})
    .then(function(d){if(!d.sheets.length)throw new Error('No sheet with data was found.');setStatus('iddbStatus','Saving…');
      return apiSave({kind:'iddb',data:d}).then(function(){S.iddb=d;render();setStatus('iddbStatus','Saved: '+d.sheets.map(function(s){return s.name+' ('+s.rows.length+')'}).join(' · ')+'.','ok')})})
    .catch(function(e){setStatus('iddbStatus','Could not save: '+(e&&e.message||e),'err')});
}
function loadIddb(force){
  if(S.iddb&&!force)return;
  S.iddbLoading=true;
  fetchRetry('/api/iddb',{headers:{'x-admin-key':S.adminKey||''},cache:'no-store'},1).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||r.status);return j})})
    .then(function(d){S.iddb=d;S.iddbLoading=false;if(S.tab==='iddb')render()})
    .catch(function(e){S.iddbLoading=false;S.iddbErr=String(e&&e.message||e);if(S.tab==='iddb')render()});
}
function viewIddb(){
  if(!S.canEdit)return '<div class="panel empty"><h2>Admin only</h2></div>';
  var D=S.iddb,up='<div class="panel" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><label class="btn" style="cursor:pointer">⤒ Upload Service ID Database<input type="file" id="iddbFile" accept=".xlsx,.xls" hidden></label><span class="note">Update once a month. The new file replaces the old one. Password columns are never saved.</span><p class="status" id="iddbStatus" style="flex-basis:100%;margin:0"></p></div>';
  var h='<section class="section"><div class="sechead"><h2>ID Database</h2><span class="note">Admin only'+(D&&D.at?' · '+esc(D.file||'')+' · uploaded '+dlabel(D.at.slice(0,10))+' '+D.at.slice(0,4):'')+'</span></div>'+up+'</section>';
  if(!D){loadIddb();return h+'<section class="section"><div class="panel note">'+(S.iddbErr?'Could not load: '+esc(S.iddbErr):'Loading…')+'</div></section>'}
  if(!D.sheets||!D.sheets.length)return h+'<section class="section"><div class="panel note">Nothing uploaded yet. Upload the Service ID Database Excel file above.</div></section>';
  var si=Math.min(S.iddbSheet||0,D.sheets.length-1),sh=D.sheets[si],q=(S.iddbQ||'').trim().toLowerCase();
  var nidCol=sh.cols.map(function(c){return /^nid$/i.test(c)});
  h+='<section class="section"><div class="seg" role="group" aria-label="Sheet" style="flex-wrap:wrap">'+D.sheets.map(function(s,i){return '<button data-iddbsheet="'+i+'" aria-pressed="'+(i===si)+'">'+esc(s.name)+' '+s.rows.length+'</button>'}).join('')+'</div>'+
    '<div class="searchbar" style="margin-top:10px"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/></svg><input id="iddbQ" type="search" autocomplete="off" placeholder="Search name, RSSP, user name, email, any ID…" value="'+esc(S.iddbQ||'')+'" aria-label="Search the ID database"></div>'+
    '<p class="note" id="iddbCount" style="margin:6px 0">'+sh.rows.length+' rows · tap any cell to copy it'+(nidCol.some(Boolean)?' · NID is hidden until you tap it':'')+'</p>'+
    '<div class="tablebox iddb"><table class="compact lb"><thead><tr>'+sh.cols.map(function(c){return '<th class="'+(IDDB_LEFT.test(c)?'l':'')+'">'+esc(c)+'</th>'}).join('')+'</tr></thead><tbody>'+
    sh.rows.map(function(r){return '<tr data-q="'+esc(r.join(' ').toLowerCase())+'">'+r.map(function(v,j){if(!v)return '<td class="'+(IDDB_LEFT.test(sh.cols[j])?'l':'')+'"></td>';
      var shown=nidCol[j]?'••••'+esc(v.slice(-4)):esc(v);return '<td class="'+(IDDB_LEFT.test(sh.cols[j])?'l':'')+'"><button type="button" class="idcell'+(nidCol[j]?' nid':'')+'" data-v="'+esc(v)+'">'+shown+'</button></td>'}).join('')+'</tr>'}).join('')+
    '</tbody></table></div></section>';
  return h;
}
function bindIddb(){
  var f=$('iddbFile');if(f)f.addEventListener('change',function(){if(f.files&&f.files[0])iddbUpload(f.files[0])});
  if(!window.XLSX)loadXLSX().catch(function(){});
  main.querySelectorAll('[data-iddbsheet]').forEach(function(b){b.addEventListener('click',function(){S.iddbSheet=+b.getAttribute('data-iddbsheet');render()})});
  var qi=$('iddbQ');if(qi){var run=function(){var v=(qi.value||'').trim().toLowerCase();S.iddbQ=qi.value;var n=0,t=0;main.querySelectorAll('.iddb tbody tr').forEach(function(tr){t++;var ok=!v||tr.getAttribute('data-q').indexOf(v)>=0;tr.style.display=ok?'':'none';if(ok)n++});var c=$('iddbCount');if(c)c.firstChild.nodeValue=(v?n+' of '+t:t)+' rows · tap any cell to copy it'+(c.firstChild.nodeValue.indexOf('NID')>=0?' · NID is hidden until you tap it':'')};qi.addEventListener('input',run);if(qi.value)run()}
  main.querySelectorAll('.idcell').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-v');
    if(b.classList.contains('nid')&&!b.classList.contains('open')){b.classList.add('open');b.textContent=v;return}
    var ok=function(){b.classList.add('copied');setTimeout(function(){b.classList.remove('copied')},1200)};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(ok).catch(function(){});else{var t=document.createElement('textarea');t.value=v;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}t.remove()}})});
}
/* ---------- Phase 5: Supervisor (SUP) performance, RSSP scope only ---------- */
var ROBI2RDMS={"90101":"DH9101","90102":"DH9102","90103":"DH9103","90104":"DH9104","90105":"DH9105","90106":"DH9106","90107":"DH9107"};
var DH_NAME2RDMS={"meghna telecom":"DH9101","dakatia traders":"DH9102","padma distribution":"DH9103","riverside telecom":"DH9104","green valley enterprise":"DH9105","coastal link traders":"DH9106","sonali telecom":"DH9107"};
var BIKE_GOOD=.8,NO_SUP='SUP not set';
function supOfDh(name,code){var dc=code||DH_NAME2RDMS[String(name||'').trim().toLowerCase()];return (dc&&DH_SUP[dc])||NO_SUP}
function viewSup(rows,f,cal){
  var inArea=function(a){return S.area==='All'||a===S.area};
  var LD=lmtdDates(cal),hasL=!!LD,dates=cal.dates;
  /* RSSPs (live) with their SUP */
  var RR=rows.filter(function(r){return inArea(r.area)}).map(function(r){var zd=r.daily.filter(function(d){return !(d.robi+d.airtel)}).length;
    return {tgt:r.tgt||0,fwaT:r.wifiT||0,rfoT:r.rfoT||0,agT:r.agT||0,rfo:r.daily.reduce(function(a,d){return a+d.rfo},0),agent:r.daily.reduce(function(a,d){return a+d.agent},0),code:r.code,name:r.name,area:r.area,dh:r.distributor,sup:supOfDh(r.distributor),ga:r.ga,gaR:r.gaR,gaA:r.gaA,rep:r.rep,wifi:r.wifi,lmGa:r.lmGa,lmRep:r.lmRep,lmWifi:r.lmWifi,zd:zd,last:r.last,daily:r.daily}});
  /* stock (latest SIM stock upload) */
  var ST=null,K=S.stock&&S.stock.latest;
  if(K&&(K.v===3||K.v===4)){if(K.v===3)K=stkV3(K);var byC={};rows.forEach(function(r){byC[r.code]=r});var LV=stkLive(K,rows,byC),fc={};
    (K.fifo||[]).forEach(function(fx){var X=K.rssp[fx[1]],c=byC[fx[1]]?fx[1]:(X&&LV.byName[LV.nk(X.name)]);if(c)fc[c]=(fc[c]||0)+1});
    ST={};LV.RS.forEach(function(x){ST[x.code]={ok:x.ok,zero:x.zero.length>0,fifo:fc[x.code]||0,t:x.t,low:(x.nc!=null&&x.nc<STK_LOW)||(x.rc!=null&&x.rc<STK_LOW),high:(x.nc!=null&&x.nc>STK_HIGH)||(x.rc!=null&&x.rc>STK_HIGH),fail:x.fail}})}
  /* bikes (current bike month) */
  var BK=[],bLast='';try{var br=bikeRows();if(br){var bd=bikeDates();bLast=bd[bikeLastIdx(bd)];BK=br.map(function(b){var I=S.bike.map.bikes[b.id]||{};return {sup:supOfDh(b.dh,ROBI2RDMS[String(I.dhCode||'')]),area:b.area,ok:b.ok,elig:b.elig,lastSt:b.lastSt,open:b.open.length}}).filter(function(b){return inArea(b.area)})}}catch(e){}
  /* roll up by SUP */
  var SU={},mk=function(n){return SU[n]||(SU[n]={name:n,ar:{},rs:[],n:0,ga:0,gaR:0,gaA:0,rep:0,wifi:0,lmGa:hasL?0:null,lmRep:hasL?0:null,lmWifi:hasL?0:null,zd:0,zeroWifi:0,sN:0,sOk:0,sZ:0,sLow:0,sHigh:0,fifo:0,stock:0,bikes:0,bOk:0,bEl:0,bZero:0,bLow:0,bFault:0,g7:dates.slice(-7).map(function(){return 0})})};
  RR.forEach(function(r){var u=mk(r.sup);u.rs.push(r);u.n++;u.ar[r.area]=(u.ar[r.area]||0)+1;['ga','gaR','gaA','rep','wifi','zd'].forEach(function(k){u[k]+=r[k]});if(hasL){u.lmGa+=r.lmGa||0;u.lmRep+=r.lmRep||0;u.lmWifi+=r.lmWifi||0}if(!r.wifi)u.zeroWifi++;
    r.daily.slice(-7).forEach(function(d,i){u.g7[u.g7.length-Math.min(7,r.daily.length)+i]+=d.robi+d.airtel});
    var s=ST&&ST[r.code];if(s){r.st=s;u.sN++;if(s.ok)u.sOk++;if(s.zero)u.sZ++;if(s.low)u.sLow++;if(s.high)u.sHigh++;u.fifo+=s.fifo;u.stock+=s.t}});
  BK.forEach(function(b){var u=mk(b.sup);u.bikes++;u.bOk+=b.ok;u.bEl+=b.elig;if(b.lastSt==='zero'||b.lastSt==='nodata')u.bZero++;if(b.lastSt==='low')u.bLow++;if(b.lastSt==='fault'||b.open)u.bFault++});
  var SUPS=Object.keys(SU).map(function(k){var u=SU[k];u.area=Object.keys(u.ar).sort(function(a,b){return u.ar[b]-u.ar[a]})[0]||'';return u}).filter(function(u){return u.n||u.bikes});
  SUPS.sort(function(a,b){return (a.name===NO_SUP)-(b.name===NO_SUP)||a.area.localeCompare(b.area)||b.ga-a.ga});
  var gp=function(c,p){return p?c/p-1:null},bc=function(u){return u.bEl?u.bOk/u.bEl:null},perDay=function(u){return u.n?u.ga/u.n/cal.elapsed:0};
  var where=S.area==='All'?'Chandpur Region':S.area+' area',asof=dlabel(cal.end)+' '+cal.end.slice(0,4);
  /* cards */
  var h=waButton()+'<section class="section"><div class="kpis">'+SUPS.map(function(u){var b=bc(u);
    return kpi(esc(u.name)+' · '+u.n+' RSSPs',fmt(u.ga)+' <span style="font-size:.9rem;font-weight:600">GA</span>',grBadge(u.ga,u.lmGa)+'<br>Repl '+fmt(u.rep)+' · FWA '+fmt(u.wifi)+'<br>Bike ≥3 KM '+(b==null?'–':pct(b))+(ST?'<br>10 Prepaid &amp; 5 Kit '+u.sOk+'/'+u.sN+' · Zero stock '+u.sZ:''))}).join('')+'</div></section>';
  /* alerts */
  var al=[
    {sev:'crit',title:'SUPs below LMTD RSSP GA',why:hasL?'RSSP GA lower than the same days last month':'Needs last month’s Activation file',list:hasL?SUPS.filter(function(u){return u.lmGa&&u.ga<u.lmGa}).sort(function(a,b){return gp(a.ga,a.lmGa)-gp(b.ga,b.lmGa)}):[],val:function(u){return '▼ '+Math.abs(gp(u.ga,u.lmGa)*100).toFixed(0)+'% · '+fmt(u.ga)+' vs '+fmt(u.lmGa)}},
    {sev:'warn',title:'Zero KM bikes on '+(bLast?dlabel(bLast):'the last day'),why:'Bikes that did not move on the last working day, by SUP',list:SUPS.filter(function(u){return u.bZero}).sort(function(a,b){return b.bZero-a.bZero}),val:function(u){return u.bZero+' of '+u.bikes+' bikes'}},
    {sev:'info',title:'SUPs with RSSPs at zero FWA MTD',why:'Live RSSPs with no FWA (WiFi) sale this month',list:SUPS.filter(function(u){return u.zeroWifi}).sort(function(a,b){return b.zeroWifi-a.zeroWifi}),val:function(u){return u.zeroWifi+' of '+u.n+' RSSPs'}}];
  var nf=al.reduce(function(a,g){return a+g.list.length},0);
  h+='<section class="section"><div class="sechead"><h2>Needs attention</h2><span class="note">'+nf+' flag'+(nf===1?'':'s')+'</span></div><div class="agroups">'+al.map(function(g){return alertCard(g,g.list.map(function(x){return '<span class="achip">'+esc(x.name)+' <span>'+esc(g.val(x))+'</span></span>'}).join(''))}).join('')+'</div></section>';
  /* totals */
  var T={name:'Total',n:0,ga:0,gaR:0,gaA:0,rep:0,wifi:0,lmGa:hasL?0:null,lmRep:hasL?0:null,lmWifi:hasL?0:null,zd:0,zeroWifi:0,sN:0,sOk:0,sZ:0,sLow:0,sHigh:0,fifo:0,stock:0,bikes:0,bOk:0,bEl:0,bZero:0,bLow:0,bFault:0};
  SUPS.forEach(function(u){Object.keys(T).forEach(function(k){if(k!=='name'&&T[k]!=null)T[k]+=u[k]})});
  var nm=function(u,tot){return '<td class="name">'+(tot?'<b>Total</b>':'<b>'+esc(u.name)+'</b><small>'+esc(u.area)+' · '+u.n+' RSSPs</small>')+'</td>'};
  var trow=function(fn){return SUPS.map(function(u){return fn(u)}).join('')+fn(T,true)};
  /* 1. Activation & replacement */
  h+='<section class="section"><div class="sechead"><h2>Activation and replacement</h2><span class="note">Live RSSPs · '+cal.elapsed+' days to '+dlabel(cal.end)+(hasL?' · growth vs LMTD':'')+'</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>GA MTD</th><th>GA LMTD</th><th>Growth</th><th>Robi</th><th>Cirkle</th><th>GA / RSSP / day</th><th>Repl. MTD</th><th>Repl. LMTD</th><th>Growth</th></tr></thead><tbody>'+
    trow(function(u,tot){return '<tr'+(tot?' class="tot"':'')+'>'+nm(u,tot)+'<td><b>'+fmt(u.ga)+'</b></td><td>'+(u.lmGa==null?'–':fmt(u.lmGa))+'</td><td>'+grCell(u.ga,u.lmGa)+'</td><td>'+fmt(u.gaR)+'</td><td>'+fmt(u.gaA)+'</td><td>'+perDay(u).toFixed(1)+'</td><td><b>'+fmt(u.rep)+'</b></td><td>'+(u.lmRep==null?'–':fmt(u.lmRep))+'</td><td>'+grCell(u.rep,u.lmRep)+'</td></tr>'})+'</tbody></table></div></section>';
  /* 1b. Target achievement (admin only) */
  if(RR.some(function(r){return r.tgt})){var TS=function(list){var o={tgt:0,ga:0,fwaT:0,wifi:0,rfoT:0,rfo:0,agT:0,agent:0};list.forEach(function(r){Object.keys(o).forEach(function(k){o[k]+=r[k]||0})});return o};
    var ach=function(v,t){return t?'<span class="gac '+(v/t>=cal.tg?'g':v/t>=cal.tg*.85?'a':'r')+'">'+pct(v/t)+'</span>':'–'},need=function(v,t){return t?fmt(Math.ceil(Math.max(0,t-v)/Math.max(1,cal.remaining))):'–'};
    var onT=function(L){var w=L.filter(function(r){return r.tgt}),k=w.filter(function(r){return r.ga>=r.tgt}).length;return w.length?'<b>'+k+'</b><span class="note"> / '+w.length+'</span>':'–'};
    var trT=function(u,L,tot){var o=TS(L);return '<tr'+(tot?' class="tot"':'')+'>'+nm(u,tot)+'<td>'+fmt(o.tgt)+'</td><td><b>'+fmt(o.ga)+'</b></td><td>'+ach(o.ga,o.tgt)+'</td><td>'+onT(L)+'</td><td>'+need(o.ga,o.tgt)+'</td><td>'+ach(o.rfo,o.rfoT)+'</td><td>'+ach(o.agent,o.agT)+'</td><td>'+fmt(o.fwaT)+'</td><td>'+fmt(o.wifi)+'</td><td>'+ach(o.wifi,o.fwaT)+'</td></tr>'};
    h+='<section class="section"><div class="sechead"><h2>Target achievement</h2><span class="note">Visible to admin only · '+pct(cal.tg)+' time gone</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>GA target</th><th>GA MTD</th><th>Achieved</th><th>RSSPs achieved target</th><th>Needs / day</th><th>RFO achieved</th><th>Agent achieved</th><th>FWA target</th><th>FWA MTD</th><th>FWA achieved</th></tr></thead><tbody>'+
      SUPS.map(function(u){return trT(u,u.rs)}).join('')+trT(T,RR,true)+'</tbody></table></div><p class="note">Green = at or above time gone, yellow = within 85% of it, red = behind. RSSPs achieved target = RSSPs whose GA MTD has reached the full monthly target, out of the RSSPs that have a GA target.</p></section>'}
  /* 2. FWA */
  h+='<section class="section"><div class="sechead"><h2>FWA (WiFi) sales</h2></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>FWA MTD</th><th>FWA LMTD</th><th>Growth</th><th>Per RSSP</th><th>RSSPs at zero</th></tr></thead><tbody>'+
    trow(function(u,tot){return '<tr'+(tot?' class="tot"':'')+'>'+nm(u,tot)+'<td><b>'+fmt(u.wifi)+'</b></td><td>'+(u.lmWifi==null?'–':fmt(u.lmWifi))+'</td><td>'+grCell(u.wifi,u.lmWifi)+'</td><td>'+(u.n?(u.wifi/u.n).toFixed(1):'–')+'</td><td>'+(u.zeroWifi?'<span class="gac r">'+u.zeroWifi+'</span>':'<span class="gac g">0</span>')+'</td></tr>'})+'</tbody></table></div></section>';
  /* 4. Bike running */
  h+='<section class="section"><div class="sechead"><h2>Bike running</h2><span class="note">'+(bLast?'Bike month to '+dlabel(bLast)+' · Fridays off':'Upload the bike files to see this')+'</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th><th>Bikes</th><th>≥3 KM compliance</th><th>Zero KM '+(bLast?dlabel(bLast):'')+'</th><th>Under 3 KM '+(bLast?dlabel(bLast):'')+'</th><th>Faulty open</th></tr></thead><tbody>'+
    trow(function(u,tot){var b=bc(u);return '<tr'+(tot?' class="tot"':'')+'>'+nm(u,tot)+'<td>'+u.bikes+'</td><td>'+(b==null?'–':'<span class="gac '+(b>=.9?'g':b>=BIKE_GOOD?'a':'r')+'">'+pct(b)+'</span>')+'</td><td>'+(u.bZero?'<span class="gac r">'+u.bZero+'</span>':'0')+'</td><td>'+(u.bLow?'<span class="gac a">'+u.bLow+'</span>':'0')+'</td><td>'+(u.bFault?'<span class="gac a">'+u.bFault+'</span>':'0')+'</td></tr>'})+'</tbody></table></div></section>';
  /* 5. Team AON (RFO and Agent) */
  (function(){var codeSup={};RR.forEach(function(r){codeSup[r.code]=r.sup});var TA={};
    computeBps(cal).forEach(function(b){if(b.role!=='RFO'&&b.role!=='Agent')return;var sp=codeSup[b.code];if(!sp)return;var x=TA[sp]||(TA[sp]={rfo:0,ag:0,aon:[],nj:0,ga:0,act:0,miss:0});if(b.role==='RFO')x.rfo++;else x.ag++;x.ga+=b.ga;x.act+=b.active;if(b.aon==null)x.miss++;else{x.aon.push(b.aon);if(b.aon<30)x.nj++}});
    var av=function(a){return a.length?Math.round(a.reduce(function(p,q){return p+q},0)/a.length):null};
    SUPS.forEach(function(u){u.team=TA[u.name]||{rfo:0,ag:0,aon:[],nj:0,ga:0,act:0,miss:0}});
    /* the Team AON table was removed; u.team stays for other uses */
  })();
  /* daily GA by SUP */
  var d7=dates.slice(-7);
  h+='<section class="section"><div class="sechead"><h2>Daily RSSP GA by SUP</h2><span class="note">Last '+d7.length+' days</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">SUP</th>'+d7.map(function(d){return '<th>'+dlabel(d)+'</th>'}).join('')+'</tr></thead><tbody>'+
    SUPS.map(function(u){var g=u.g7.slice(-d7.length),mx=Math.max.apply(null,g.concat([1]));return '<tr>'+nm(u)+g.map(function(v){return '<td>'+(v?(v===mx?'<b>'+fmt(v)+'</b>':fmt(v)):'<span class="gac r">0</span>')+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div></section>';
  /* RSSPs under each SUP */
  h+='<section class="section"><div class="sechead"><h2>RSSPs by SUP</h2><span class="note">Every KPI for each live RSSP</span></div><p class="note" style="margin:0 0 6px">RFO active days = days this month the RFO made at least 1 GA, out of '+cal.elapsed+' days. Green at 90% of days or more, yellow from 75%, red below.</p><div class="tablebox short"><table class="compact lb"><thead><tr><th class="name l">RSSP</th><th>GA MTD</th><th>Growth</th><th>Agent GA</th><th>RFO GA</th><th>RFO active days</th><th>Repl.</th><th>FWA</th><th>Zero stock</th></tr></thead><tbody>'+
    SUPS.map(function(u){return '<tr class="subhead"><td colspan="9" style="position:sticky;left:0">'+esc(u.name)+' · '+u.n+' RSSPs · '+fmt(u.ga)+' GA</td></tr>'+u.rs.slice().sort(function(a,b){return b.ga-a.ga}).map(function(r){var s=r.st,rg=0,ag=0,ra=0;r.daily.forEach(function(d){rg+=d.rfo||0;ag+=d.agent||0;if((d.rfo||0)>=1)ra++});return '<tr><td class="name"><button class="linkbtn" data-open="'+esc(r.code)+'">'+esc(r.name)+'</button><small>'+esc(r.dh)+'</small></td><td><b>'+fmt(r.ga)+'</b></td><td>'+grCell(r.ga,r.lmGa)+'</td><td>'+fmt(ag)+'</td><td>'+fmt(rg)+'</td><td><span class="pill '+(ra>=cal.elapsed*.9?'good':ra>=cal.elapsed*.75?'warn':'crit')+'">'+ra+'</span><span class="note">/'+cal.elapsed+'</span></td><td>'+fmt(r.rep)+'</td><td>'+(r.wifi?fmt(r.wifi):'<span class="gac r">0</span>')+'</td><td>'+(s?(s.zero?'<span class="gac r">Zero Stock</span>':'<span class="gac g">Okay</span>'):'–')+'</td></tr>'}).join('')}).join('')+'</tbody></table></div></section>';
  /* share */
  var t=['*Supervisor Performance (RSSP) · '+where+'*','MTD to '+asof+(hasL?' · growth vs LMTD':''),''];
  SUPS.forEach(function(u,i){var b=bc(u),g=gp(u.ga,u.lmGa);t.push('*'+(i+1)+'. '+u.name+'* · '+u.n+' RSSPs');t.push('GA '+fmt(u.ga)+(g==null?'':' ('+(g>=0?'▲':'▼')+Math.abs(g*100).toFixed(0)+'%)')+' · Repl '+fmt(u.rep)+' · FWA '+fmt(u.wifi));t.push('Bike ≥3 KM '+(b==null?'–':pct(b))+(ST?' · 10+5 '+u.sOk+'/'+u.sN+' · Zero stock '+u.sZ:''));t.push('')});
  al.forEach(function(g){if(g.list.length){t.push('⚠️ *'+g.title+' ('+g.list.length+'):*');g.list.forEach(function(x,i){t.push((i+1)+'. '+x.name+' · '+g.val(x))});t.push('')}});
  t.push('Dashboard: '+location.origin);S.waText=t.join('\n');
  S.imgSpec={file:'supervisor-'+cal.end,title:'Supervisor Performance',sub:where+' · RSSP KPIs · MTD to '+asof+(hasL?' · vs LMTD':''),
    kpis:SUPS.filter(function(u){return u.name!==NO_SUP}).slice(0,6).map(function(u){var g=gp(u.ga,u.lmGa),b=bc(u);return {l:u.name+' · '+u.n+' RSSPs',v:fmt(u.ga)+' GA',s:(g==null?'':(g>=0?'▲':'▼')+Math.abs(g*100).toFixed(0)+'% · ')+'Repl '+fmt(u.rep)+' · FWA '+fmt(u.wifi)+' · Bike '+(b==null?'–':pct(b))+(ST?' · 10+5 '+u.sOk+'/'+u.sN:'')}}),
    sections:al.map(function(g){return {t:g.title,sev:g.sev,items:g.list.map(function(x){return x.name+'  ·  '+g.val(x)})}})};
  h+=attSection(['SUP'],'RSSP Supervisor attendance',{noRssp:true,id:'attSup'});
  return h;
}

/* ---------- events ---------- */
function bindCommon(){
  var mrb=$('monthReport');if(mrb)mrb.addEventListener('click',monthReport);
  var nps=$('npShare');if(nps)nps.addEventListener('click',function(){npExportImage('rfo')});
  var npa=$('npAgShare');if(npa)npa.addEventListener('click',function(){npExportImage('agent')});
  var lsh=$('liveShare');if(lsh)lsh.addEventListener('click',liveImage);
  var nrs=$('npRsspShare');if(nrs)nrs.addEventListener('click',npRsspImage);
  var zs=$('zeroShare');if(zs)zs.addEventListener('click',zeroExportImage);
  var q=function(sel,fn){main.querySelectorAll(sel).forEach(fn)};
  q('[data-open]',function(b){b.addEventListener('click',function(){S.sel=b.getAttribute('data-open');S.tab='rssp';tryLS('tab',S.tab);render();window.scrollTo({top:0})})});
  q('[data-goto]',function(b){b.addEventListener('click',function(){S.tab=b.getAttribute('data-goto');render()})});
  q('#fifoCsv',function(b){b.addEventListener('click',function(){var c=(S._fifoCsv||[]).map(function(r){return r.map(function(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\r\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+c],{type:'text/csv'}));a.download='fifo-sims-before-2023.csv';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)})});
  var ds=$('dcmSave');if(ds)ds.addEventListener('click',function(){if(S.masterRedacted){setStatus('dcmStatus','Loading your private settings first… tap Save again.','');loadData();return}
    var g=function(k){return Math.max(0,+$('dw_'+k).value||0)},m=Object.assign({},S.master);delete m.redacted;m.dcm={man:(S.master.dcm&&S.master.dcm.man)||{},w:{ga:g('ga'),fwa:g('fwa'),bike:g('bike'),rfo:g('rfo'),agent:g('agent'),gift:g('gift'),rsspT:g('rsspT')},rsspN:Math.max(1,+$('dw_rn').value||DCM_DEF.rsspN),rfoWD:Math.min(31,Math.max(1,+$('dw_wd').value||DCM_DEF.rfoWD)),bikeDays:Math.min(31,Math.max(1,+$('dw_bd').value||DCM_DEF.bikeDays))};m.updatedAt=new Date().toISOString();
    ds.disabled=true;setStatus('dcmStatus','Saving…');apiSave({kind:'master',data:m}).then(function(){S.master=m;render()}).catch(function(e){setStatus('dcmStatus','Could not save: '+((e&&e.message)||e),'err');ds.disabled=false})});
  var dms=$('dcmManSave');if(dms)dms.addEventListener('click',function(){if(S.masterRedacted){setStatus('dmStatus','Loading your private settings first… tap Save again.','');loadData();return}
    var v=function(id){var x=$(id).value.trim();return x===''?null:Math.max(0,+x)},m=Object.assign({},S.master);delete m.redacted;m.dcm=Object.assign({},m.dcm||{});m.dcm.man=Object.assign({},m.dcm.man||{});
    m.dcm.man[S.meta.month]={agQ:v('dm_agQ'),agN:v('dm_agN'),agT:v('dm_agT'),gift:v('dm_gift'),at:new Date().toISOString()};m.updatedAt=new Date().toISOString();
    dms.disabled=true;setStatus('dmStatus','Saving…');apiSave({kind:'master',data:m}).then(function(){S.master=m;render()}).catch(function(e){setStatus('dmStatus','Could not save: '+((e&&e.message)||e),'err');dms.disabled=false})});
  q('[data-bankmet]',function(b){b.addEventListener('click',function(){S.bankMet=b.getAttribute('data-bankmet');render()})});
  q('[data-bankspan]',function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-bankspan');S.bankSpan=v==='all'?'all':+v;render()})});
  q('#bankCsv',function(b){b.addEventListener('click',function(){var c=(S._bankCsv||[]).map(function(r){return r.map(function(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\r\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+c],{type:'text/csv'}));a.download='data-bank-'+(S.bankMet||'ga')+'.csv';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)})});
  q('[data-stkf]',function(b){b.addEventListener('click',function(){S.stkF=b.getAttribute('data-stkf');render()})});
  q('[data-stkb]',function(b){b.addEventListener('click',function(){S.stkB=b.getAttribute('data-stkb');render()})});
  q('[data-bprole]',function(b){b.addEventListener('click',function(){S.bpRole=b.getAttribute('data-bprole');render()})});
  q('[data-trend]',function(b){b.addEventListener('click',function(){S.trend=b.getAttribute('data-trend');render()})});
  q('[data-sort]',function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-sort');S.sort=S.sort.key===k?{key:k,dir:-S.sort.dir}:{key:k,dir:k==='name'||k==='rank'?1:-1};render()})});
  var ma=$('moreAlerts');if(ma)ma.addEventListener('click',function(){S.showAllAlerts=!S.showAllAlerts;render()});
  var sel=$('selR');if(sel)sel.addEventListener('change',function(){S.sel=sel.value;render()});
  if(S.tab==='setup'&&S.canEdit){bindSetup();bindGateAdmin()}
  q('details[data-ak]',function(d){d.addEventListener('toggle',function(){S.openA[d.getAttribute('data-ak')]=d.open;var t=d.querySelector('.atoggle');if(t)t.textContent=d.open?'Hide names ▴':'Show names ▾'})});
  var ib=$('imgBtn');if(ib)ib.addEventListener('click',shareImage);
  q('[data-wkshare]',function(b){b.addEventListener('click',function(){var tx=encodeURIComponent(S.wkText||''),web='https://wa.me/?text='+tx;if(/Android/i.test(navigator.userAgent))location.href='intent://send?text='+tx+'#Intent;scheme=whatsapp;package=com.whatsapp.w4b;S.browser_fallback_url='+encodeURIComponent(web)+';end';else window.open(web,'_blank')})});
  q('[data-wkcopy]',function(b){b.addEventListener('click',function(){var done=function(){b.textContent='Copied ✓';setTimeout(function(){b.textContent='Copy text'},1800)};try{navigator.clipboard.writeText(S.wkText||'').then(done,function(){})}catch(e){}})});
  var wa=$('waBtn');if(wa)wa.addEventListener('click',function(){var tx=encodeURIComponent(S.waText||''),web='https://wa.me/?text='+tx;
    /* Android: open WhatsApp Business directly; fall back to normal WhatsApp if Business is not installed */
    if(/Android/i.test(navigator.userAgent))location.href='intent://send?text='+tx+'#Intent;scheme=whatsapp;package=com.whatsapp.w4b;S.browser_fallback_url='+encodeURIComponent(web)+';end';
    else window.open(web,'_blank')});
}
/* the section buttons slide away while reading down and return on scroll up (ignored right after a toggle, because the page height changes) */
(function(){var tb=document.querySelector('.tabbar'),last=window.pageYOffset||0,tick=false,lock=0;if(!tb)return;
window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;var y=window.pageYOffset||0,d=y-last;
if(Date.now()<lock){last=y;return}
var room=document.documentElement.scrollHeight-window.innerHeight;
if(y<140){if(tb.classList.contains('gbhide')){tb.classList.remove('gbhide');lock=Date.now()+450}}
else if(d>14&&room>y+260&&!tb.classList.contains('gbhide')){tb.classList.add('gbhide');lock=Date.now()+450}
else if(d<-14&&tb.classList.contains('gbhide')){tb.classList.remove('gbhide');lock=Date.now()+450}
last=y})},{passive:true})})();
document.getElementById('grpbar').addEventListener('click',function(e){var b=e.target.closest('[data-grp]');if(!b)return;var g=b.getAttribute('data-grp'),L=NAV_GRP[g].filter(function(t){var el=document.querySelector('#tabs [data-tab="'+t+'"]');return el&&!el.hidden});if(!L.length)return;var t=(S.grpLast&&S.grpLast[g]&&L.indexOf(S.grpLast[g])>=0)?S.grpLast[g]:L[0];S.tab=t;tryLS('tab',t);render();window.scrollTo({top:0})});
document.getElementById('tabs').addEventListener('click',function(e){var t=e.target.closest('[data-tab]');if(!t)return;S.tab=t.getAttribute('data-tab');tryLS('tab',S.tab);render()});
document.getElementById('chips').addEventListener('click',function(e){var c=e.target.closest('[data-area]');if(!c)return;S.area=c.getAttribute('data-area');render()});
var rz;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){chartJobs.forEach(function(j){j()})},150)});

/* ---------- setup: upload + targets ---------- */
function loadXLSX(){return new Promise(function(res,rej){if(window.XLSX)return res(window.XLSX);var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=function(){res(window.XLSX)};s.onerror=function(){rej(new Error('The spreadsheet reader could not load. Check your connection and try again.'))};document.head.appendChild(s)})}
function setStatus(id,msg,cls){var el=$(id);if(el){el.textContent=msg;el.className='status'+(cls?' '+cls:'')}}
function bindSetup(){
  var drop=$('drop'),file=$('file');
  file.addEventListener('change',function(){if(file.files.length)handleFiles(file.files)});
  ['dragenter','dragover'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('over')})});
  ['dragleave','drop'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('over')})});
  drop.addEventListener('drop',function(e){if(e.dataTransfer.files.length)handleFiles(e.dataTransfer.files)});
  if($('saveMaster'))$('saveMaster').addEventListener('click',saveMaster);
  if($('addBtn'))$('addBtn').addEventListener('click',function(){
    var c=$('addCode').value.trim();if(!c){setStatus('mStatus','Enter the retailer code first.','err');return}
    S.master.rssps=S.master.rssps||{};S.master.rssps[c]={name:$('addName').value.trim()||c,area:$('addArea').value.trim()||'Unassigned',territory:$('addTerr').value.trim(),gaTarget:0,repTarget:0,wifiTarget:0};
    render();setStatus('mStatus','Added '+c+'. Save to keep it.','');});
  main.querySelectorAll('[data-remove]').forEach(function(b){b.addEventListener('click',function(){delete S.master.rssps[b.getAttribute('data-remove')];render();setStatus('mStatus','Removed. Save to keep the change.','')})});
}
function collectMaster(){
  var rs={};main.querySelectorAll('tr[data-code]').forEach(function(tr){var c=tr.getAttribute('data-code'),o={};tr.querySelectorAll('input[data-f]').forEach(function(i){var f=i.getAttribute('data-f');o[f]=i.type==='number'?(+i.value||0):i.value.trim()});rs[c]=o});
  return {rssps:rs,weights:{ga:+$('wGa').value||0,active:+$('wAct').value||0,quality:+$('wQ').value||0},updatedAt:new Date().toISOString()};
}
function saveMaster(){
  if(S.masterRedacted){setStatus('mStatus','Loading your private targets first… tap Save again in a moment.','');loadData();return}
  var b=$('saveMaster');b.disabled=true;setStatus('mStatus','Saving…');
  var m=collectMaster();m.targets=S.master.targets||{};if(S.master.dcm)m.dcm=S.master.dcm;m.bpRoles=S.master.bpRoles||{};
  apiSave({kind:'master',data:m}).then(function(){S.master=m;setStatus('mStatus','Saved. Every viewer now sees the new targets.','ok')}).catch(function(e){setStatus('mStatus','Could not save: '+(e&&e.message||e)+'. Try again.','err')}).then(function(){b.disabled=false});
}
/* one file -> promise of a result message */
function processFile(file){
  var parse=function(rows){
    var hd0=rows[0]?rows[0].map(function(x){return String(x==null?'':x).trim()}):[];
    if(hd0.indexOf('Product SL No')>=0)return handleStockRows(rows,file.name);
    if(hd0.indexOf('FF Joining Date')>=0)return handleStaffRows(rows,file.name);
    if(hd0.indexOf('Employee Name')>=0&&hd0.indexOf('Primary Number')>=0&&hd0.indexOf('Status')>=0)return handleAttRows(rows,file.name);
    var bsh=findBaseHeader(rows);if(bsh>=0)return handleBaseRows(rows,bsh,file.name);
    var bh=findBankHeader(rows);if(bh>0)return handleBankRows(rows,bh,file.name);
    /* a file with only today's date is a Live GA update: it never replaces the month data */
    var LV=rsspLiveSummary(rows,file.name);
    if(LV&&LV.date===dhakaToday()){setStatus('upStatus','Saving Live GA for today…');
      return apiSave({kind:'live',data:LV}).then(function(){S.live=LV;var t=0;Object.keys(LV.rssp).forEach(function(c){t+=LV.rssp[c].ga});return 'Live GA saved for today till '+liveTime(LV.asOf)+': '+fmt(t)+' RSSP GA. Open Sales, then Live GA. Month data was not changed.'})}
    setStatus('upStatus','Summarising '+fmt(rows.length-1)+' rows of '+file.name+'…');
    var months=rsspAggregate(rows,file.name);var keys=Object.keys(months).sort();
    if(!keys.length)throw new Error('No dated rows were found in '+file.name+'.');
    return writeMonths(months,keys);
  };
  setStatus('upStatus','Reading '+file.name+'…');
  if(/\.(tar|gz|zip|rar|7z|pdf|jpe?g|png)$/i.test(file.name))return Promise.reject(new Error(file.name+' is a '+file.name.split('.').pop().toUpperCase()+' file. Upload the .csv or .xlsx report itself.'));
  if(!/\.(xlsx|xlsm|xls|xlsb)$/i.test(file.name)){
    return file.text().then(function(t){var p=handleBikeCsv(file,t);if(p)return p;
      return loadXLSX().then(function(X){var wb=X.read(t,{type:'string',cellDates:true,dense:true});var ws=wb.Sheets[wb.SheetNames[0]];return parse(X.utils.sheet_to_json(ws,{header:1,raw:true,defval:null}))})});
  }
  return loadXLSX().then(function(X){return file.arrayBuffer().then(function(buf){var wb=X.read(buf,{type:'array',cellDates:true,dense:true});var ts=findTargetSheet(wb,X),dt=findDhTargetSheet(wb,X);if(ts||dt)return {target:ts,dhTarget:dt};var ws=wb.Sheets[wb.SheetNames[0]];for(var si=0;si<wb.SheetNames.length;si++){var rr=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[si]],{header:1,raw:true,defval:null});if(findBaseHeader(rr)>=0)return rr}return X.utils.sheet_to_json(ws,{header:1,raw:true,defval:null})})}).then(function(r){if(r&&(r.target||r.dhTarget)){var msgs=[];return (r.target?handleTargetRows(r.target,file.name).then(function(x){msgs.push(x)}):Promise.resolve()).then(function(){return r.dhTarget?handleDhTargetRows(r.dhTarget,file.name).then(function(x){msgs.push(x)}):null}).then(function(){return msgs.join(' ')})}return parse(r)});
}
/* several files: bike mapping first, then the distance report, then Activation Details */
function handleFiles(list){
  var files=Array.prototype.slice.call(list||[]);if(!files.length)return;
  var rank=function(f){var n=f.name.toLowerCase();return /bike-status|bike_status/.test(n)?0:/distance/.test(n)?1:/stock/.test(n)?3:2};
  files.sort(function(a,b){return rank(a)-rank(b)});
  var out=[],chain=Promise.resolve();
  files.forEach(function(f,i){chain=chain.then(function(){return processFile(f).then(function(m){out.push('✓ '+(files.length>1?(i+1)+'/'+files.length+' ':'')+m)},function(e){out.push('✗ '+f.name+': '+((e&&e.message)||e))})})});
  chain.then(function(){var bad=out.some(function(x){return x[0]==='✗'});var el=$('upStatus');if(el){el.className='status '+(bad?'err':'ok');el.innerHTML=out.map(esc).join('<br>')}$('file').value=''});
}
function handleFile(file){handleFiles([file])}
function writeMonths(months,keys){
  var now=new Date().toISOString(),newCodes={},chain=Promise.resolve();
  keys.forEach(function(mk){var M=months[mk];M.meta.uploadedAt=now;Object.keys(M.rssp).forEach(function(c){newCodes[c]=M.rssp[c]});
    chain=chain.then(function(){setStatus('upStatus','Saving '+Object.keys(M.rssp).length+' RSSPs for '+mk+'…');return apiSave({kind:'month',month:mk,data:{meta:M.meta,rssp:M.rssp}})}).then(function(){return apiSave({kind:'bankauto',month:mk,asOf:M.meta.asOf,full:+M.meta.asOf.slice(8,10)>=M.meta.daysInMonth,data:bankAutoFrom(M)}).catch(function(){})});});
  return chain.then(function(){return S.masterRedacted?loadData():null}).then(function(){
    if(S.masterRedacted)throw new Error('Could not load your private targets. Sign in as admin again and re-upload.');
    var rs=Object.assign({},S.master.rssps||{}),n=0;
    Object.keys(newCodes).forEach(function(c){if(!rs[c]){var R=newCodes[c];rs[c]={name:R.name,area:R.area,territory:R.territory,gaTarget:0,repTarget:0,wifiTarget:0};n++}});
    var p=n?apiSave({kind:'master',data:{rssps:rs,bpRoles:S.master.bpRoles||{},weights:S.master.weights,targets:S.master.targets||{},dcm:S.master.dcm||null,updatedAt:now}}):Promise.resolve();
    return p.then(loadData).then(function(){var last=months[keys[keys.length-1]];return 'Updated. Data now runs through '+dlabel(last.meta.asOf)+': '+fmt(last.meta.rsspRows)+' RSSP transactions across '+Object.keys(last.rssp).length+' points'+(n?', '+n+' new RSSP'+(n>1?'s':'')+' added to your list':'')+'. Everyone sees it on their next refresh.'});
  });
}

/* ---------- Visitor tracker: anonymous usage, sent to /api/track (Upstash Redis). Admin visits are not tracked. ---------- */
var TRK={did:'',isNew:false,tabs:{},ev:{},rssp:{},err:[],cur:null,since:0,started:false,off:false};
function trkOff(){return TRK.off||!!S.adminKey||S.canEdit}
function trkSend(obj){return;try{var body=JSON.stringify(obj);if(navigator.sendBeacon&&navigator.sendBeacon('/api/track',new Blob([body],{type:'application/json'})))return;fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:body,keepalive:true}).catch(function(){})}catch(e){}}
function trkStop(){if(TRK.cur&&TRK.since){var t=TRK.tabs[TRK.cur]||(TRK.tabs[TRK.cur]={ms:0,n:0});t.ms+=Date.now()-TRK.since}TRK.since=0}
function trkTab(tab){if(trkOff())return;if(tab===TRK.cur)return;trkStop();TRK.cur=tab;var t=TRK.tabs[tab]||(TRK.tabs[tab]={ms:0,n:0});t.n++;if(document.visibilityState==='visible')TRK.since=Date.now()}
function trkEv(name,n){if(trkOff())return;TRK.ev[name]=(TRK.ev[name]||0)+(n||1)}
function trkFlush(){if(trkOff()||!TRK.started)return;trkStop();var has=Object.keys(TRK.tabs).length||Object.keys(TRK.ev).length||TRK.err.length;
  if(has)trkSend({t:'flush',did:TRK.did,tabs:TRK.tabs,ev:TRK.ev,rssp:TRK.rssp,err:TRK.err});
  TRK.tabs={};TRK.ev={};TRK.rssp={};TRK.err=[];if(document.visibilityState==='visible'&&TRK.cur){TRK.tabs[TRK.cur]={ms:0,n:0};TRK.since=Date.now()}}
function trkStart(){
  if(trkOff())return;
  try{TRK.isNew=!localStorage.getItem('rsspSeen');localStorage.setItem('rsspSeen','1')}catch(e){}TRK.did=getDid();
  var ua=navigator.userAgent||'',W=window.screen&&screen.width||window.innerWidth;
  var dev=/iPad|Tablet/i.test(ua)?'Tablet':/Mobi|Android|iPhone/i.test(ua)?'Phone':'Laptop or desktop';
  var br=/EdgA?\//.test(ua)?'Edge':/OPR\/|Opera/.test(ua)?'Opera':/SamsungBrowser/.test(ua)?'Samsung Internet':/UCBrowser/.test(ua)?'UC Browser':/FBAN|FBAV/.test(ua)?'Facebook app':/WhatsApp/i.test(ua)?'WhatsApp in-app':/Firefox|FxiOS/.test(ua)?'Firefox':/Chrome|CriOS/.test(ua)?'Chrome':/Safari/.test(ua)?'Safari':'Other';
  var os=/Android/.test(ua)?'Android':/iPhone|iPad|iOS/.test(ua)?'iPhone or iPad':/Windows/.test(ua)?'Windows':/Mac OS/.test(ua)?'Mac':/Linux/.test(ua)?'Linux':'Other';
  var cn=navigator.connection||{},net=cn.effectiveType?String(cn.effectiveType).toUpperCase():'';
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
  var ref=document.referrer||'',src=standalone?'Home-screen icon':/whatsapp/i.test(ref+ua)?'WhatsApp':/facebook|fb\./i.test(ref)||/FBAN|FBAV/.test(ua)?'Facebook':ref&&ref.indexOf(location.host)<0?'Another website':'Link or bookmark';
  var scr=W<400?'Small phone (under 400px)':W<768?'Phone (400 to 767px)':W<1280?'Tablet or small laptop':'Large screen';
  var load=0;try{var nv=performance.getEntriesByType('navigation')[0];load=Math.round(nv?(nv.loadEventEnd||nv.domContentLoadedEventEnd):(performance.timing.loadEventEnd-performance.timing.navigationStart))}catch(e){}
  var fresh=(S.meta&&S.meta.asOf)?daysBetween(S.meta.asOf,dhakaToday()):null;
  TRK.started=true;
  trkSend({t:'start',did:TRK.did,isNew:TRK.isNew,dev:dev,br:br,os:os,net:net,src:src,scr:scr,lang:(typeof LANG!=='undefined'&&LANG==='bn')?'Bangla':'English',load:load,fresh:fresh});
}
(function(){
  window.addEventListener('error',function(e){if(TRK.err.length<5)TRK.err.push(String((e&&e.message)||'error')+' @'+String((e&&e.filename)||'').split('/').pop()+':'+((e&&e.lineno)||''))});
  window.addEventListener('unhandledrejection',function(e){if(TRK.err.length<5)TRK.err.push('Promise: '+String(e&&e.reason&&(e.reason.message||e.reason)||'').slice(0,120))});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')trkFlush();else if(TRK.cur&&!TRK.since)TRK.since=Date.now()});
  window.addEventListener('pagehide',trkFlush);
  setInterval(function(){if(document.visibilityState==='visible')trkFlush()},10*60*1000);
  document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target:null;if(!t||trkOff())return;
    var m=function(sel){return t.closest(sel)};var o;
    if(m('#imgBtn'))trkEv('share_img');else if(m('#waBtn'))trkEv('share_wa');else if(m('.sharemenu summary'))trkEv('share_menu');
    else if(m('[data-wkshare]'))trkEv('digest_send');else if(m('[data-wkcopy]'))trkEv('digest_copy');
    else if((o=m('[data-open]'))){trkEv('rssp_open');var c=o.getAttribute('data-open');TRK.rssp[c]=(TRK.rssp[c]||0)+1}
    else if(m('[data-area]'))trkEv('area');else if(m('.jump button'))trkEv('jump');
    else if(m('#langBtn'))trkEv(typeof LANG!=='undefined'&&LANG==='bn'?'lang_en':'lang_bn');
    else if((o=m('a[download], a[href*="dl=1"]')))trkEv('download')},true);
  document.addEventListener('change',function(e){var t=e.target;if(!t||trkOff())return;if(t.id==='pkMonth')trkEv('month_pick');else if(t.id==='pkDay'||t.id==='pkBDay')trkEv('day_pick');else if(t.id==='selR'){trkEv('rssp_open');TRK.rssp[t.value]=(TRK.rssp[t.value]||0)+1}},true);
  setTimeout(function(){TRK.tabs={};TRK.rssp={};TRK.cur=null;TRK.since=0;trkStart();if(TRK.started&&S.tab)trkTab(S.tab)},4000);
})();

/* ---------- Visitors tab (admin) ---------- */
var VIS_EV={share_menu:'Opened the Share menu',share_img:'Shared as image',share_wa:'Shared on WhatsApp',digest_send:'Weekly digest sent',digest_copy:'Weekly digest copied',rssp_open:'Opened an RSSP detail',area:'Changed the area filter',lang_bn:'Switched to Bangla',lang_en:'Switched to English',jump:'Used a jump chip',download:'Downloaded a file',month_pick:'Picked another month',day_pick:'Picked another day',preview_start:'Started a 10-minute preview',preview_blocked:'Preview refused (both used)',pin_login:'Entered the team PIN',pin_wrong:'Wrong PIN tried'};
var VIS_TAB={brief:'Morning Brief',overview:'Overview',board:'Leaderboard',rssp:'RSSP Detail',wifi:'WiFi',quality:'Fake Location',live:'Live GA',rfo:'RFO',agent:'Agent',sup:'Supervisor',stock:'SIM Stock',bike:'Bike Operation',bikestat:'Bike Status',bikes:'Bike Detail',faulty:'Faulty Bike',camp:'Ongoing Campaigns',prices:'Product Price List',download:'Download',dev:'Developer'};
function viewVisits(){
  S.visDays=S.visDays||30;
  return '<section class="section"><div class="sechead"><h2>Visitors</h2><div class="seg" role="group" aria-label="Period">'+[7,30,90].map(function(n){return '<button data-visdays="'+n+'" aria-pressed="'+(S.visDays===n)+'">'+n+' days</button>'}).join('')+'</div></div>'+
    '<p class="note">Anonymous: each phone gets a random ID; no names or internet addresses are stored. Your own admin visits are not counted. Data is kept 100 days.</p></section><div id="visBody"><div class="panel empty"><p class="note">Loading visitor data…</p></div></div>';
}
function loadVisits(){
  [].forEach.call(main.querySelectorAll('[data-visdays]'),function(b){b.addEventListener('click',function(){S.visDays=+b.getAttribute('data-visdays');render()})});
  var n=S.visDays||30,c=S.visCache&&S.visCache[n];
  if(c&&Date.now()-c.at<120000){visRender(c.d);return}
  fetchRetry('/api/track?days='+n,{headers:{'x-admin-key':S.adminKey||''},cache:'no-store'},1).then(function(r){return r.json()}).then(function(d){S.visCache=S.visCache||{};S.visCache[n]={at:Date.now(),d:d};if(S.tab==='visits')visRender(d)}).catch(function(e){var el=$('visBody');if(el)el.innerHTML='<div class="panel empty"><p class="note">Could not load visitor data. '+esc(e.message||'')+'</p></div>'});
}
function visRender(d){
  var el=$('visBody');if(!el)return;
  if(!d||!d.ready){el.innerHTML='<div class="panel empty"><h2>Counter store not connected</h2><p class="note">Connect Upstash Redis to this project in Vercel (Storage). The tracker starts counting on the next deploy after that.</p></div>';return}
  if(!d.ok){el.innerHTML='<div class="panel empty"><p class="note">'+esc(d.error||'Could not read the counter store.')+'</p></div>';return}
  var D=d.days||[],sum=function(f){var o={};D.forEach(function(x){var h=x[f]||{};Object.keys(h).forEach(function(k){o[k]=(o[k]||0)+h[k]})});return o};
  var C=sum('c'),visits=C.visits||0;
  if(!visits){el.innerHTML='<div class="panel empty"><h2>No visits recorded yet</h2><p class="note">Counting started with this update. Check back after the team has used the site for a day.</p></div>';return}
  var tabms=sum('tabms'),tabv=sum('tabv'),ev=sum('ev'),rs=sum('rssp'),L=sum('lang'),DV=sum('dev');
  var mins=function(ms){var m=ms/60000;return m<1?Math.round(ms/1000)+' s':m<60?m.toFixed(1)+' min':(m/60).toFixed(1)+' h'};
  var share=function(o,k){var t=0;Object.keys(o).forEach(function(x){t+=o[x]});return t?(o[k]||0)/t:null};
  var h='<section class="section"><div class="kpis">'+
    kpi('Visits',fmt(visits),'last '+D.length+' days · '+fmt(d.total)+' since tracking began')+
    kpi('Unique phones',fmt(d.uniq),fmt(C.new||0)+' new in this period')+
    kpi('Time per visit',C.time_ms?mins(C.time_ms/visits):'–','average reading time')+
    kpi('Daily average',(visits/Math.max(1,D.length-D.findIndex(function(x){return x.c&&x.c.visits}))).toFixed(1),'visits a day, since counting began')+
    kpi('Bangla use',pct(share(L,'Bangla')),'of visits opened in Bangla')+
    kpi('Page load',C.load_n?(C.load_ms/C.load_n/1000).toFixed(1)+' s':'–','average, all networks')+
  '</div></section>';
  h+='<section class="section"><div class="sechead"><h2>Visits by day</h2><span class="note">Tap a bar for unique phones</span></div><div class="panel"><div class="chart" id="visDaily"></div></div></section>';
  h+='<section class="section"><div class="sechead"><h2>When people visit</h2><span class="note">Dhaka time</span></div><div class="panel"><div class="chart" id="visHour" style="min-height:200px"></div></div></section>';
  var tabsK=Object.keys(tabv).sort(function(a,b){return (tabms[b]||0)-(tabms[a]||0)||tabv[b]-tabv[a]}),tot=tabsK.reduce(function(a,k){return a+(tabms[k]||0)},0)||1;
  h+='<section class="section"><div class="sechead"><h2>Tabs people use</h2><span class="note">Sorted by total reading time</span></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">Tab</th><th>Opened</th><th>Total time</th><th>Per open</th><th>Share of time</th></tr></thead><tbody>'+
    tabsK.map(function(k){var ms=tabms[k]||0;return '<tr><td class="name"><b>'+esc(VIS_TAB[k]||k)+'</b></td><td>'+fmt(tabv[k])+'</td><td>'+mins(ms)+'</td><td>'+(tabv[k]?mins(ms/tabv[k]):'–')+'</td><td>'+pct(ms/tot)+'</td></tr>'}).join('')+'</tbody></table></div></section>';
  var evK=Object.keys(ev).sort(function(a,b){return ev[b]-ev[a]});
  var rsK=Object.keys(rs).sort(function(a,b){return rs[b]-rs[a]}).slice(0,15);
  h+='<section class="section"><div class="cols2"><div><div class="sechead"><h2>Actions</h2></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">Action</th><th>Times</th></tr></thead><tbody>'+
    (evK.length?evK.map(function(k){return '<tr><td class="name">'+esc(VIS_EV[k]||k)+'</td><td><b>'+fmt(ev[k])+'</b></td></tr>'}).join(''):'<tr><td class="name note">None yet</td><td>–</td></tr>')+'</tbody></table></div></div>'+
    '<div><div class="sechead"><h2>Most viewed RSSPs</h2></div><div class="tablebox"><table class="compact lb"><thead><tr><th class="name l">RSSP</th><th>Opened</th></tr></thead><tbody>'+
    (rsK.length?rsK.map(function(k){var I=infoFor(k);return '<tr><td class="name"><button class="linkbtn" data-open="'+esc(k)+'">'+esc(I.name||k)+'</button><small>'+esc(I.territory||I.area||'')+'</small></td><td><b>'+fmt(rs[k])+'</b></td></tr>'}).join(''):'<tr><td class="name note">None yet</td><td>–</td></tr>')+'</tbody></table></div></div></div></section>';
  var mini=function(title,o,note){var K=Object.keys(o).sort(function(a,b){return o[b]-o[a]}),t=K.reduce(function(a,k){return a+o[k]},0)||1;if(!K.length)return '';
    return '<div class="panel"><h3 style="margin:0 0 8px;font-size:.95rem">'+title+'</h3>'+(note?'<p class="note" style="margin:-4px 0 8px">'+note+'</p>':'')+K.slice(0,8).map(function(k){var p=o[k]/t;return '<div class="vbar"><span>'+esc(k)+'</span><i style="width:'+Math.max(3,Math.round(p*100))+'%"></i><b>'+pct(p)+'</b></div>'}).join('')+'</div>'};
  h+='<section class="section"><div class="sechead"><h2>Who and how</h2><span class="note">Share of visits</span></div><div class="visgrid">'+
    mini('Device',DV)+mini('Network',sum('net'),'As reported by the phone')+mini('Browser',sum('br'))+mini('System',sum('os'))+mini('Opened from',sum('src'))+mini('Language at open',L)+mini('City',sum('city'),'From Vercel’s location data')+mini('Screen',sum('scr'))+mini('Data age at visit',sum('fresh'),'How old the sales data was when they looked')+'</div></section>';
  var WD=sum('wd'),wn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  h+='<section class="section"><div class="sechead"><h2>Day of the week</h2></div><div class="tablebox"><table class="compact lb"><thead><tr>'+wn.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr></thead><tbody><tr>'+wn.map(function(x,i){return '<td><b>'+fmt(WD[i]||0)+'</b></td>'}).join('')+'</tr></tbody></table></div></section>';
  var E=d.errors||[];
  h+='<section class="section"><div class="sechead"><h2>Page errors</h2><span class="note">Latest 30, from visitors’ phones</span></div>'+(E.length?'<div class="panel"><ol class="brieflist">'+E.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol></div>':'<div class="panel note">No errors reported. Good.</div>')+'</section>';
  el.innerHTML=h;
  [].forEach.call(el.querySelectorAll('[data-open]'),function(b){b.addEventListener('click',function(){S.sel=b.getAttribute('data-open');S.tab='rssp';render();window.scrollTo({top:0})})});
  barChart($('visDaily'),D.map(function(x){var v=(x.c&&x.c.visits)||0;return {label:String(+x.day.slice(8)),segs:[{v:v,cls:'bar-sky'}],tip:'<b>'+dlabel(x.day)+'</b><br>'+fmt(v)+' visits · '+fmt(x.uniq)+' unique phones'+((x.c&&x.c.new)?'<br>'+x.c.new+' new phones':'')}}),{labels:D.length<=31,h:200,aria:'Visits by day'});
  var HR=sum('h'),items=[];for(var i=0;i<24;i++)items.push({label:(i%12||12)+(i<12?'a':'p'),segs:[{v:HR[i]||0,cls:'bar-sky'}],tip:'<b>'+(i%12||12)+':00 '+(i<12?'AM':'PM')+'</b><br>'+fmt(HR[i]||0)+' visits'});
  barChart($('visHour'),items,{labels:true,h:200,aria:'Visits by hour'});
}
/* ---------- Team PIN and 10-minute preview (only active once the admin sets a PIN) ---------- */
var GATE={team:tryLS0('teamPass'),pv:null,need:false,left:null,msg:'',busy:false,timer:null};
try{var _pv=JSON.parse(localStorage.getItem('pvPass')||'null');if(_pv&&_pv.until>Date.now())GATE.pv=_pv}catch(e){}
function getDid(){var d='';try{d=localStorage.getItem('rsspDid')||'';if(!d){d=Math.random().toString(36).slice(2,12)+Date.now().toString(36).slice(-6);localStorage.setItem('rsspDid',d)}}catch(e){d='x'+Math.random().toString(36).slice(2,12)}return d}
function gatePassHeader(){if(GATE.team)return GATE.team;if(GATE.pv&&GATE.pv.until>Date.now())return GATE.pv.pass;return ''}
function gatePost(body){return fetchRetry('/api/gate',{method:'POST',headers:{'content-type':'application/json','x-admin-key':S.adminKey||''},body:JSON.stringify(body)},1).then(function(r){return r.json().then(function(j){j._status=r.status;return j})})}
/* called by loadData on a 401 from /api/data: try a preview first, otherwise ask for the PIN */
function gateBlocked(j){
  if(j&&j.stale){GATE.team='';tryLS('teamPass','');GATE.triedPv=true;GATE.msg='The team PIN has changed. Enter the new PIN.'}
  if(!GATE.team&&!(GATE.pv&&GATE.pv.until>Date.now())&&!GATE.triedPv){GATE.triedPv=true;return gateStartPreview(true)}
  GATE.need=true;gateBanner();render();return Promise.resolve();
}
function gateStartPreview(auto){
  return gatePost({action:'preview',did:getDid()}).then(function(j){
    if(j.pass){GATE.pv={pass:j.pass,until:j.until};GATE.left=j.left;try{localStorage.setItem('pvPass',JSON.stringify(GATE.pv))}catch(e){}GATE.need=false;trkEv('preview_start');gateBanner();return loadData()}
    GATE.left=0;GATE.need=true;GATE.msg=auto?'':(j.error||'');trkEv('preview_blocked');gateBanner();render();
  }).catch(function(){GATE.need=true;render()});
}
function gateBanner(){
  var el=$('pvBar');if(!el){el=document.createElement('div');el.id='pvBar';el.className='pvbar';el.setAttribute('role','status');document.body.appendChild(el);
    el.addEventListener('click',function(e){if(e.target.closest('[data-pinnow]')){GATE.need=true;render();window.scrollTo({top:0})}})}
  clearInterval(GATE.timer);
  var on=!GATE.team&&GATE.pv&&GATE.pv.until>Date.now()&&!GATE.need&&!S.canEdit;
  el.hidden=!on;if(!on)return;
  var tick=function(){var s=Math.max(0,Math.round((GATE.pv.until-Date.now())/1000));
    if(!s){clearInterval(GATE.timer);el.hidden=true;GATE.need=true;GATE.ended=true;GATE.pv=null;try{localStorage.removeItem('pvPass')}catch(e){}render();window.scrollTo({top:0});return}
    el.innerHTML='<span>Preview · <b>'+Math.floor(s/60)+':'+(s%60<10?'0':'')+(s%60)+'</b> left</span><button type="button" data-pinnow>Enter team PIN</button>'};
  tick();GATE.timer=setInterval(tick,1000);
}
function gateView(){
  var canPv=GATE.left==null||GATE.left>0;
  return '<div class="panel empty gatebox"><div class="gateicon" aria-hidden="true">🔒</div><h2>Enter the team PIN</h2><p class="note">'+(GATE.ended?'Your 10-minute preview has ended. ':'')+'The RSSP Business Tracker is for the Chandpur RSSP team. Ask Mohd Imtiaz Karim for the PIN; this phone remembers it.</p>'+
    '<div class="addrow" style="max-width:360px;width:100%"><input id="gatePin" type="password" inputmode="numeric" autocomplete="off" placeholder="Team PIN" aria-label="Team PIN" maxlength="8"><button class="btn" id="gateBtn" type="button">Open</button></div>'+
    '<p class="note" id="gateMsg" style="color:#B42318;min-height:1.2em">'+esc(GATE.msg||'')+'</p>'+
    (canPv?'<button class="linkbtn" id="gatePv" type="button">Not in the team? Look around for 10 minutes</button>'+(GATE.left!=null?'<p class="note">'+GATE.left+' preview'+(GATE.left===1?'':'s')+' left today</p>':''):'<p class="note">Both 10-minute previews for today are used on this phone.</p>')+'</div>';
}
function bindGate(){
  var go=function(){var p=($('gatePin').value||'').trim();if(!p)return;$('gateBtn').disabled=true;
    gatePost({action:'pin',pin:p,did:getDid()}).then(function(j){$('gateBtn').disabled=false;
      if(j.token||j.open){GATE.team=j.token||'';tryLS('teamPass',GATE.team);GATE.need=false;GATE.msg='';GATE.pv=null;try{localStorage.removeItem('pvPass')}catch(e){}trkEv('pin_login');gateBanner();loadData();return}
      GATE.msg=j.error||'That PIN is not right.';trkEv('pin_wrong');var m=$('gateMsg');if(m)m.textContent=GATE.msg}).catch(function(){$('gateBtn').disabled=false})};
  var b=$('gateBtn');if(b)b.addEventListener('click',go);var i=$('gatePin');if(i)i.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
  var pv=$('gatePv');if(pv)pv.addEventListener('click',function(){pv.disabled=true;gateStartPreview(false)});
  if(GATE.left==null)gatePost({action:'left',did:getDid()}).then(function(j){if(j&&j.left!=null&&GATE.left==null){GATE.left=j.left;if(GATE.need&&S.tab)render()}}).catch(function(){});
}
/* admin: Team PIN settings on Upload & Targets */
function gateAdminSection(){
  return '<section class="section"><div class="sechead"><h2>Team PIN</h2><span class="note" id="gateState">Checking…</span></div><div class="panel" style="display:grid;gap:10px">'+
    '<p class="note">With a PIN on, the team enters it once per phone. Anyone else gets a 10-minute preview (twice a day per phone) showing the numbers only, without attendance or staff details. Changing the PIN signs every phone out.</p>'+
    '<div class="addrow" style="max-width:420px"><input id="gateNew" type="password" inputmode="numeric" maxlength="8" placeholder="New PIN, 4 to 8 digits" aria-label="New team PIN"><button class="btn" id="gateSet" type="button">Save PIN</button></div>'+
    '<div><button class="more" id="gateOff" type="button" hidden>Turn the PIN off (open to everyone)</button></div><p class="note" id="gateAdmMsg"></p></div></section>';
}
function bindGateAdmin(){
  var st=$('gateState');if(!st)return;
  var show=function(on,ready){st.textContent=!ready?'Counter store not connected':on?'On · team PIN required':'Off · open to everyone';var o=$('gateOff');if(o)o.hidden=!on};
  fetchRetry('/api/gate',{headers:{'x-admin-key':S.adminKey||''},cache:'no-store'},1).then(function(r){return r.json()}).then(function(j){show(j.on,j.ready!==false)}).catch(function(){st.textContent='Could not check'});
  var msg=function(t,bad){var m=$('gateAdmMsg');if(m){m.textContent=t;m.style.color=bad?'#B42318':'#0B6E48'}};
  $('gateSet').addEventListener('click',function(){var p=($('gateNew').value||'').trim();if(!/^\d{4,8}$/.test(p)){msg('Use 4 to 8 digits.',1);return}
    gatePost({action:'setpin',pin:p}).then(function(j){if(j.on){$('gateNew').value='';show(true,true);msg('PIN saved. Share it in your team group. Phones using an older PIN must enter the new one. It can take up to 10 minutes to apply everywhere.')}else msg(j.error||'Could not save.',1)})});
  $('gateOff').addEventListener('click',function(){if(!confirm('Turn the PIN off? The site will be open to anyone with the link.'))return;gatePost({action:'off'}).then(function(j){if(j.on===false){show(false,true);msg('PIN turned off. The site is open again.')}else msg(j.error||'Could not turn it off.',1)})});
}
/* ---------- data wiring (Vercel API) ---------- */
var NETMSG='Could not reach the server. Check your internet connection and try again.';
function fetchRetry(url,opts,tries){tries=tries==null?2:tries;return fetch(url,opts).catch(function(e){if(tries<=0)throw new Error(NETMSG);return new Promise(function(r){setTimeout(r,2000)}).then(function(){return fetchRetry(url,opts,tries-1)})})}
function apiSave(body){
  return fetchRetry('/api/save',{method:'POST',headers:{'content-type':'application/json','x-admin-key':S.adminKey||''},body:JSON.stringify(body)})
    .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok)throw new Error(j.error||('Save failed ('+r.status+')'));return j})});
}
function loadData(){
  var qs=[];if(S.month)qs.push('month='+encodeURIComponent(S.month));if(S.bmonth)qs.push('bmonth='+encodeURIComponent(S.bmonth));
  var q=qs.length?'?'+qs.join('&'):'';
  if(S.canEdit||S.adminKey)q+=(q?'&':'?')+'t='+Date.now();
  return fetchRetry('/api/data'+q,{headers:{'x-view-key':S.viewKey||'','x-admin-key':S.adminKey||'','x-pass':gatePassHeader()},cache:'no-store'}).then(function(r){
    if(r.status===401){S.err=null;return r.json().catch(function(){return {}}).then(function(j){if(j&&j.gate)return gateBlocked(j);S.needPin=true;render()})}
    return r.json().then(function(j){
      if(!r.ok)throw new Error(j.error||('Server error '+r.status));
      S.err=null;S.months=j.months||[];
      if(!S.month||S.months.indexOf(S.month)<0)S.month=j.month||null;
      S.meta=j.meta||null;S.docs=j.rssp||{};S.bike=j.bike||{};S.prev=j.prev&&j.prev.meta?j.prev:null;S.stock=j.stock||null;S.staff=j.staff||null;S.apps=j.apps||{list:[]};S.bank=j.bank||null;S.prices=j.prices||null;S.camps=j.camps||{list:[]};S.att=j.att||null;S.base=j.base||null;S.live=j.live||null;S.preview=!!j.preview;gateBanner();
      if(!S.bmonth||(S.bike.months||[]).indexOf(S.bmonth)<0)S.bmonth=S.bike.month||null;
      var m=j.master||{};S.masterRedacted=!!m.redacted;S.master={rssps:m.rssps||{},bpRoles:m.bpRoles||{},weights:m.weights||{ga:50,active:25,quality:25},targets:m.targets||{},dcm:m.dcm||null};
      S.loaded.meta=S.loaded.master=S.loaded.docs=true;
      if(S.tab!=='setup'||!main.querySelector('#saveMaster'))render();else renderBand(calendar());
    });
  }).catch(function(e){S.err=(e&&e.message)||'Network error';render()});
}
function adminLogin(){
  var k=$('adminIn').value.trim();if(!k)return;
  setStatus('adminStatus','Checking…');
  S.adminKey=k;apiSave({kind:'ping'}).then(function(){tryLS('adminKey',k);S.canEdit=true;S.tab='setup';$('adminBox').hidden=true;$('adminLink').textContent='Sign out of admin';render();loadData()})
   .catch(function(e){S.adminKey='';setStatus('adminStatus',e.message,'err')});
}
function countVisit(){return;
  /* read-only for now: the counter stopped writing to Blob storage to stay inside the free plan's monthly limit */
  fetchRetry('/api/visit',{cache:'no-store'},1).then(function(r){return r.json()}).then(function(v){
    if(v&&v.total)$('visits').textContent='Site visits: '+fmt(v.total);
  }).catch(function(){});
}
function start(){
  var lb=document.getElementById('langBtn');if(lb){lb.addEventListener('click',function(){setLang(LANG==='bn'?'en':'bn')});}if(LANG==='bn'){LANG='en';setLang('bn')}else langLabel();
  var hs=(location.hash||'').slice(1);if(hs==='bp')hs='rfo';S.tab=/^(overview|brief|board|rssp|rfo|agent|sup|wifi|stock|quality|live|bike|bikestat|bikes|faulty|camp|prices|download|dev)$/.test(hs)?hs:'brief';/* every visit opens on Morning Brief, except a device's very first visit, which opens on Developer */
  
  render();
  $('adminLink').addEventListener('click',function(){if(S.canEdit){S.canEdit=false;S.adminKey='';tryLS('adminKey','');if(S.tab==='setup')S.tab='overview';$('adminLink').textContent='Admin';render();return}$('adminBox').hidden=!$('adminBox').hidden});
  $('adminBtn').addEventListener('click',adminLogin);
  $('pickers').addEventListener('change',function(e){var t=e.target,v=t.value;
    if(t.id==='pkMonth'){S.month=v;S.asOf='';$('dataline').textContent='Loading '+mlabel(v)+'…';loadData()}
    else if(t.id==='pkDay'){S.asOf=S.meta&&v===S.meta.asOf?'':v;render()}
    else if(t.id==='pkBMonth'){S.bmonth=v;S.bAsOf='';loadData()}
    else if(t.id==='pkBDay'){S.bAsOf=S.bike&&S.bike.data&&v===S.bike.data.through?'':v;render()}});
  $('pickers').addEventListener('click',function(e){var b=e.target.closest('[data-reset]');if(!b)return;if(b.getAttribute('data-reset')==='b')S.bAsOf='';else S.asOf='';render()});
  if(S.adminKey){apiSave({kind:'ping'}).then(function(){S.canEdit=true;$('adminLink').textContent='Sign out of admin';render();if(S.masterRedacted)loadData()}).catch(function(){S.adminKey='';tryLS('adminKey','')})}
  loadData();
  countVisit();
  setInterval(function(){if(document.visibilityState==='visible'&&S.tab!=='setup')loadData()},5*60*1000);
}
start();
})();
