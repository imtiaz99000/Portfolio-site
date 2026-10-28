
/* Pure aggregation of the raw "Activation Details" export. Shared by the page and Claude's seeding script. */
var RSSP_COLS={date:'Activation Date',time:'Activation Time',event:'Event Type',brand:'Brand',product:'Product Type Name',rtype:'Retailer Type',rcode:'Retailer Code',rname:'Retailer Name',area:'Area Name',terr:'Territory Name',dist:'Distributor Name',dsr:'DSR Name',bp:'BP Name',fake:'Fake Location Detected',settings:'Device Settings Altered',loc:'Location Unreliable',face:'Is Face Matched',gadist:'Retailer to GA Distance',vp:'Virtual Product Name',mat:'Material Name',gthana:'GA Thana',dhcode:'DH Robi Code',rthana:'Retailer Grid Thana',charge:'Charging Type',prof:'Profile Code',bpid:'BP User ID',dcode:'Distributor Code',dsrc:'DSR RDMS Code',rrel:'Retailer Robi EL Number',rael:'Retailer Airtel EL Number',dhar:'DH Airtel Code',dhrel:'DH Robi EL Number',dhael:'DH Airtel EL Number'};
function rsspPad(n){return (n<10?'0':'')+n}
function rsspNormDate(v){
  if(v==null||v==='')return '';
  if(v instanceof Date&&!isNaN(v))return v.getFullYear()+'-'+rsspPad(v.getMonth()+1)+'-'+rsspPad(v.getDate());
  if(typeof v==='number'&&isFinite(v)){var d=new Date(Math.round((v-25569)*86400000));return d.getUTCFullYear()+'-'+rsspPad(d.getUTCMonth()+1)+'-'+rsspPad(d.getUTCDate())}
  var s=String(v).trim(),m;
  if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))return m[1]+'-'+rsspPad(+m[2])+'-'+rsspPad(+m[3]);
  if((m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/))){var a=+m[1],b=+m[2];var day=a>12?a:(b>12?b:a),mon=a>12?b:(b>12?a:b);return m[3]+'-'+rsspPad(mon)+'-'+rsspPad(day)}
  return '';
}
function rsspHour(v){
  if(v==null||v==='')return -1;
  if(v instanceof Date&&!isNaN(v))return v.getHours();
  if(typeof v==='number'&&isFinite(v))return Math.floor((v%1)*24+1e-9)%24;
  var m=String(v).match(/(\d{1,2}):\d{2}/);return m?(+m[1])%24:-1;
}
function rsspStr(v){return v==null?'':String(v).replace(/\s+/g,' ').trim()}
function rsspYes(v){return rsspStr(v).toLowerCase()==='yes'}
function rsspCleanName(n){return rsspStr(n).replace(/^RSSP[_\s-]*/i,'').replace(/_chandpur$/i,'').replace(/_/g,' ').replace(/\s+/g,' ').trim()||rsspStr(n)}
function rsspCleanBp(n){var s=rsspStr(n).replace(/\s*RSSP[A-Z]*_[\w-]*$/i,'').replace(/\s+RSSP\s?(DSO|AG|AGENT|BP)$/i,'').trim();return s||'Unknown'}
/* Chandpur Region has two areas: Lakshmipur, and Chandpur (Metro + Outer + Matlab) */
function normArea(a){a=String(a||'').trim();if(/lakshmi|laxmi/i.test(a))return 'Lakshmipur';if(/chandpur/i.test(a))return 'Chandpur';return a||'Unassigned'}
function terrThana(t){return rsspStr(t).trim()}
function thanaKey(n){return String(n||'').toLowerCase().replace(/[^a-z]/g,'').replace(/^md/,'')}
function topOf(o){var k=null,m=-1;for(var x in o)if(o[x]>m){m=o[x];k=x}return k}
function rsspAggregate(rows,fileName){
  var header=(rows[0]||[]).map(rsspStr),ix={},missing=[];
  for(var k in RSSP_COLS){ix[k]=header.indexOf(RSSP_COLS[k]);}
  ['date','event','brand','rtype','rcode','rname'].forEach(function(k){if(ix[k]<0)missing.push(RSSP_COLS[k])});
  if(missing.length)throw new Error('This file is missing the column'+(missing.length>1?'s':'')+': '+missing.join(', ')+'. Upload the raw Activation Details export.');
  var months={};
  function cell(r,k){return ix[k]<0?undefined:r[ix[k]]}
  for(var i=1;i<rows.length;i++){
    var r=rows[i];if(!r)continue;
    var d=rsspNormDate(cell(r,'date'));if(!d)continue;
    var mk=d.slice(0,7);
    var M=months[mk]||(months[mk]={meta:{month:mk,asOf:'',totalRows:0,rsspRows:0,regionDaily:{},areas:{}},rssp:{}});
    var ev=rsspStr(cell(r,'event')).toLowerCase(),isWifi=/wi-?fi/i.test(rsspStr(cell(r,'vp'))+' '+rsspStr(cell(r,'mat'))),isEL=/(^|[\s_])EL([\s_]|$)|easy\s*load/i.test(rsspStr(cell(r,'mat'))),isGA=ev==='activation'&&!isWifi&&!isEL,isRep=ev==='replacement'&&!isWifi&&!isEL;/* EL / Easyload SIMs never count as GA or replacement */
    M.meta.totalRows++;if(d>M.meta.asOf)M.meta.asOf=d;
    var rd=M.meta.regionDaily[d]||(M.meta.regionDaily[d]=[0,0,0]);if(isGA)rd[0]++;if(isRep)rd[1]++;if(isWifi&&!/^regular$/i.test(rsspStr(cell(r,'rtype'))))rd[2]++;/* Regular retailers are left out of WiFi counts */
    var area=normArea(rsspStr(cell(r,'area')));
    var A=M.meta.areas[area]||(M.meta.areas[area]=[0,0,0,0,0,0]);if(isGA)A[0]++;if(isRep)A[1]++;if(isWifi&&!/^regular$/i.test(rsspStr(cell(r,'rtype'))))A[4]++;
    var gth=terrThana(cell(r,'terr'));
    if(gth){var dcRaw=cell(r,'dhcode'),dc=typeof dcRaw==='number'?String(Math.round(dcRaw)):rsspStr(dcRaw).replace(/\.0+$/,'');if(dc){var TH=M.meta.thDH||(M.meta.thDH={}),oh=TH[dc]||(TH[dc]={});oh[gth]=(oh[gth]||0)+1}}
    if(gth){var TB=M.meta.thBP||(M.meta.thBP={}),TD=M.meta.thDSR||(M.meta.thDSR={}),bk=thanaKey(rsspCleanBp(cell(r,'bp'))),dk2=thanaKey(cell(r,'dsr'));
      if(bk){var ob=TB[bk]||(TB[bk]={});ob[gth]=(ob[gth]||0)+1}if(dk2){var od=TD[dk2]||(TD[dk2]={});od[gth]=(od[gth]||0)+1}}
    var rtU=rsspStr(cell(r,'rtype')).toUpperCase(),dhn=rsspStr(cell(r,'dist'))||'Unassigned',DHs=M.meta.dh||(M.meta.dh={}),DH=DHs[dhn]||(DHs[dhn]={ar:{},n:0,w:[0,0,0,0],d:{}});
    DH.n++;DH.ar[area]=(DH.ar[area]||0)+1;
    if(isWifi){var ch=rtU==='RSSP'?0:(rtU==='ASSIST'?1:(rtU==='REGULAR'?2:3));DH.w[ch]++;var dd=DH.d[d]||(DH.d[d]=[0,0]);if(ch!==2)dd[ch?1:0]++;/* DH WiFi counts RSSP and Assist only: Regular is left out */}
    if(isGA||isRep){var bpk=String(cell(r,'bpid')==null?'':cell(r,'bpid')).replace(/\.0+$/,'').replace(/\D/g,'');if(bpk.length>=10){bpk=bpk.slice(-10);var BX=M.meta.bpx||(M.meta.bpx={}),bq=BX[bpk]||(BX[bpk]={}),bd=bq[d]||(bq[d]=[0,0]);bd[isGA?0:1]++}}
    if(rtU!=='RSSP')continue;
    M.meta.rsspRows++;if(isGA)A[2]++;if(isRep)A[3]++;if(isWifi)A[5]++;
    var code=rsspStr(cell(r,'rcode'));if(!code)continue;
    var R=M.rssp[code];
    if(!R){var raw=rsspStr(cell(r,'rname'));R=M.rssp[code]={ids:{},code:code,name:rsspCleanName(raw),rawName:raw,area:area,territory:rsspStr(cell(r,'terr')),distributor:rsspStr(cell(r,'dist')),dsr:rsspStr(cell(r,'dsr')),days:{},bpMap:{},hours:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],flags:{checked:0,fake:0,settings:0,loc:0,far:0,faceNo:0,any:0},total:0};}
    var idv=function(k){var x=cell(r,k);return typeof x==='number'?String(Math.round(x)):rsspStr(x).replace(/\.0+$/,'')};
    [['re','rrel'],['ae','rael'],['dr','dhcode'],['da','dhar'],['dre','dhrel'],['dae','dhael']].forEach(function(p2){if(!R.ids[p2[0]]){var xv=idv(p2[1]);if(xv)R.ids[p2[0]]=xv}});
    var robi=rsspStr(cell(r,'brand')).toLowerCase().indexOf('robi')===0;
    var day=R.days[d]||(R.days[d]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);while(day.length<16)day.push(0);
    if(isGA)day[robi?0:1]++;if(isRep)day[robi?2:3]++;if(isWifi)day[6]++;
    var prod=rsspStr(cell(r,'product')).toLowerCase();
    if(prod==='e_sim')day[4]++;if(prod.indexOf('mnp')===0)day[5]++;
    if(!isWifi){var mat=rsspStr(cell(r,'mat')),isE=/e-?sim/i.test(mat)||prod==='e_sim';
      /* the Event Type decides: Activation = new sale, Replacement = replacement, whatever the material name says */
      if(isGA&&isE)day[7]++;                 // eSIM Prepaid: eSIM activations
      if(isRep&&isE)day[8]++;                // eSIM Replacement: eSIM replacement events
      if(isGA&&/postpaid/i.test(rsspStr(cell(r,'charge'))))day[9]++;
      if(isGA&&prod==='mnp')day[10]++;
      if(isRep&&prod==='mnp_replacement')day[11]++;
      /* physical SIMs used, by SIM type sold (feeds stock cover) */
      if(ev==='activation'||ev==='replacement'){if(/replacement/i.test(prod))day[15]++;else if(!/e_?sim/i.test(prod))day[14]++}}
    R.total++;var rth=gth;if(rth){R.thC=R.thC||{};R.thC[rth]=(R.thC[rth]||0)+1}
    var bid='',prof=rsspStr(cell(r,'prof')).toLowerCase(),brole=prof.indexOf('rsspagent')===0?'Agent':(prof.indexOf('rsspbp')===0?'RFO':'Other');
    if(isGA){
      var bidRaw=cell(r,'bpid');bid=typeof bidRaw==='number'?String(Math.round(bidRaw)):rsspStr(bidRaw).replace(/\.0+$/,'');if(!bid)bid=rsspCleanBp(cell(r,'bp'));
      var BB=M.meta.bps||(M.meta.bps={}),B2=BB[bid]||(BB[bid]={names:{},roles:{},rssp:{},days:{}});
      var bnm=rsspCleanBp(cell(r,'bp'));B2.names[bnm]=(B2.names[bnm]||0)+1;B2.roles[brole]=(B2.roles[brole]||0)+1;
      B2.rssp[code]=(B2.rssp[code]||0)+1;B2.days[d]=(B2.days[d]||0)+1;
      var tv=cell(r,'time'),ts=d+' '+(tv instanceof Date?rsspPad(tv.getHours())+':'+rsspPad(tv.getMinutes())+':'+rsspPad(tv.getSeconds()):rsspStr(tv));
      if(brole!=='Other'&&(!B2.lastTs||ts>=B2.lastTs)){B2.lastTs=ts;B2.role=brole}
      var dk=d+'|'+code;B2.dr=B2.dr||{};B2.dr[dk]=(B2.dr[dk]||0)+1;}
    else if(isRep&&prod!=='mnp_replacement'&&prod!=='e_sim'&&!/e-?sim/i.test(rsspStr(cell(r,'mat')))){ /* physical SIM replacements per BP and day, same as the SIM Replacement figure (no eSIM or MNP replacement) */
      var rbRaw=cell(r,'bpid'),rbid=typeof rbRaw==='number'?String(Math.round(rbRaw)):rsspStr(rbRaw).replace(/\.0+$/,'');if(!rbid)rbid=rsspCleanBp(cell(r,'bp'));
      if(rbid){var RB=M.meta.bps||(M.meta.bps={}),B3=RB[rbid]||(RB[rbid]={names:{},roles:{},rssp:{},days:{}});B3.rd=B3.rd||{};B3.rd[d]=(B3.rd[d]||0)+1;
        var rnm=rsspCleanBp(cell(r,'bp'));if(rnm)B3.names[rnm]=(B3.names[rnm]||0)+1;if(brole!=='Other')B3.roles[brole]=(B3.roles[brole]||0)+1;B3.rr=B3.rr||{};B3.rr[code]=(B3.rr[code]||0)+1}}
    var h=rsspHour(cell(r,'time'));if(h>=0)R.hours[h]++;
    var bp=rsspCleanBp(cell(r,'bp')),b=R.bpMap[bp]||(R.bpMap[bp]={n:0,d:{},ga:0,rep:0,ids:{}});b.n++;b.d[d]=1;if(isGA){b.ga++;b.ids[bid]=1}if(isRep)b.rep++;
    var fRaw=rsspStr(cell(r,'fake'));if(fRaw)R.flags.checked++;
    var f=rsspYes(cell(r,'fake')),s=rsspYes(cell(r,'settings')),l=rsspYes(cell(r,'loc'));
    var dv=parseFloat(cell(r,'gadist')),far=isFinite(dv)&&dv>1000;
    if(f)R.flags.fake++;if(s)R.flags.settings++;if(l)R.flags.loc++;if(far)R.flags.far++;
    if(rsspStr(cell(r,'face')).toLowerCase()==='no')R.flags.faceNo++;
    if(f||s||l||far)R.flags.any++;
  }
  Object.keys(months).forEach(function(mk){
    var M=months[mk],p=mk.split('-');
    M.meta.daysInMonth=new Date(+p[0],+p[1],0).getDate();
    M.meta.fileName=fileName||'';M.meta.bpRep=1;
    ['thBP','thDSR','thDH'].forEach(function(k){var T=M.meta[k]||{};Object.keys(T).forEach(function(n){T[n]=topOf(T[n])})});
    Object.keys(M.meta.dh||{}).forEach(function(n){var X=M.meta.dh[n];X.area=Object.keys(X.ar).sort(function(a,b){return X.ar[b]-X.ar[a]})[0]||'';delete X.ar;});
    Object.keys(M.meta.bps||{}).forEach(function(id){var B=M.meta.bps[id],idx=B.role==='RFO'?12:(B.role==='Agent'?13:-1);
      Object.keys(B.dr||{}).forEach(function(k){var p2=k.split('|'),R2=M.rssp[p2[1]];if(idx>=0&&R2&&R2.days[p2[0]])R2.days[p2[0]][idx]+=B.dr[k]});
      delete B.dr;delete B.lastTs;});
    Object.keys(M.rssp).forEach(function(c){var R=M.rssp[c];
      if(R.thC){R.thana=topOf(R.thC);delete R.thC}
      R.bps=Object.keys(R.bpMap).map(function(n){var X=R.bpMap[n],ids=Object.keys(X.ids||{}),role='';ids.forEach(function(i){var Bx=(M.meta.bps||{})[i];if(Bx&&Bx.role)role=Bx.role});return [n,X.n,Object.keys(X.d).length,X.ga,X.rep,role]}).sort(function(a,b){return b[1]-a[1]});
      delete R.bpMap;});
  });
  return months;
}
if(typeof module!=='undefined')module.exports={rsspAggregate:rsspAggregate};
/* Live GA: a file holding a single day is summarised on its own (per RSSP: GA, RFO GA, Agent GA, replacement, FWA, last GA time, RFO of the day) and never touches the month data */
function rsspLiveSummary(rows,fileName){
  var header=(rows[0]||[]).map(rsspStr),ix={};for(var k in RSSP_COLS)ix[k]=header.indexOf(RSSP_COLS[k]);
  if(ix.date<0||ix.event<0||ix.rtype<0||ix.rcode<0)return null;
  function cell(r,k){return ix[k]<0?undefined:r[ix[k]]}
  var dates={},out={},maxT='';
  for(var i=1;i<rows.length;i++){var r=rows[i];if(!r)continue;var d=rsspNormDate(cell(r,'date'));if(!d)continue;dates[d]=1;if(Object.keys(dates).length>1)return null;
    if(rsspStr(cell(r,'rtype')).toUpperCase()!=='RSSP')continue;
    var ev=rsspStr(cell(r,'event')).toLowerCase(),mat=rsspStr(cell(r,'mat')),isWifi=/wi-?fi/i.test(rsspStr(cell(r,'vp'))+' '+mat),isEL=/(^|[\s_])EL([\s_]|$)|easy\s*load/i.test(mat),isGA=ev==='activation'&&!isWifi&&!isEL,isRep=ev==='replacement'&&!isWifi&&!isEL;
    var code=rsspStr(cell(r,'rcode'));if(!code)continue;
    var tv=cell(r,'time'),tm=tv instanceof Date?rsspPad(tv.getHours())+':'+rsspPad(tv.getMinutes()):rsspStr(tv).slice(0,5);if(typeof tv==='number'){var mins=Math.round((tv%1)*1440);tm=rsspPad(Math.floor(mins/60))+':'+rsspPad(mins%60)}
    if(tm>maxT)maxT=tm;
    var o=out[code]||(out[code]={n:rsspCleanName(cell(r,'rname')),ga:0,rfo:0,ag:0,rep:0,fwa:0,last:'',rfoId:'',rfoName:'',rfoT:''});
    var prof=rsspStr(cell(r,'prof')).toLowerCase(),role=prof.indexOf('rsspagent')===0?'Agent':(prof.indexOf('rsspbp')===0?'RFO':'Other');
    if(isGA){o.ga++;if(role==='RFO')o.rfo++;if(role==='Agent')o.ag++;if(tm>o.last)o.last=tm;
      if(role==='RFO'&&tm>=o.rfoT){var bidRaw=cell(r,'bpid');o.rfoId=typeof bidRaw==='number'?String(Math.round(bidRaw)):rsspStr(bidRaw).replace(/\.0+$/,'');o.rfoName=rsspCleanBp(cell(r,'bp'));o.rfoT=tm}}
    if(isRep)o.rep++;if(isWifi)o.fwa++;
  }
  var ds=Object.keys(dates);if(ds.length!==1)return null;
  Object.keys(out).forEach(function(c){delete out[c].rfoT});
  return {date:ds[0],asOf:maxT,file:fileName||'',at:new Date().toISOString(),rssp:out};
}
