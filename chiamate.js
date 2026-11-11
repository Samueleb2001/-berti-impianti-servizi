/* =========================================================
   PULSANTE "CHIAMA": orari e assenze (sempre in ora italiana)
   Orari: modificabili qui sotto in ORARI.
   Assenze e orari speciali di singole date: si scrivono nel file assenze.js.
   ========================================================= */
(function(){
  /* Minuti dalla mezzanotte: 480 = 08:00, 720 = 12:00, 1350 = 22:30.
     0 = domenica (chiuso), 1 = lunedì ... 6 = sabato. */
  const ORARI={1:[480,1350],2:[480,1350],3:[480,1350],4:[480,1350],5:[480,1350],6:[480,720]};
  const TESTO="lun–ven 08:00–22:30, sabato 08:00–12:00";
  const GIORNI=["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  const MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  const RE_DATA=/^\d{4}-\d{2}-\d{2}$/;

  function adesso(){
    try{
      const p={};
      new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit",
        weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"})
        .formatToParts(new Date()).forEach(x=>{p[x.type]=x.value;});
      const g={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
      const ore=Number(p.hour)%24;
      if(p.weekday in g&&!isNaN(ore)&&p.year){
        return {ymd:p.year+"-"+p.month+"-"+p.day,day:g[p.weekday],mins:ore*60+Number(p.minute)};
      }
    }catch(e){}
    const d=new Date();
    const pad=n=>String(n).padStart(2,"0");
    return {ymd:d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()),day:d.getDay(),mins:d.getHours()*60+d.getMinutes()};
  }
  function hhmm(m){return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");}
  function piuGiorni(ymd,n){
    const [y,m,d]=ymd.split("-").map(Number);
    const t=new Date(Date.UTC(y,m-1,d+n));
    return {ymd:t.toISOString().slice(0,10),day:t.getUTCDay()};
  }
  function elencoAssenze(){
    const a=Array.isArray(window.BERTI_ASSENZE)?window.BERTI_ASSENZE:[];
    return a.filter(x=>x&&RE_DATA.test(String(x.dal))&&RE_DATA.test(String(x.al))&&x.dal<=x.al);
  }
  function assenzaIl(ymd){return elencoAssenze().find(x=>x.dal<=ymd&&ymd<=x.al)||null;}
  /* Orari speciali di singole date (es. vigilia o festivi): sostituiscono l'orario normale di quel giorno. */
  const RE_ORA=/^([01]\d|2[0-3]):[0-5]\d$/;
  function minuti(hm){const [h,m]=hm.split(":").map(Number);return h*60+m;}
  function orarioSpeciale(ymd){
    const a=Array.isArray(window.BERTI_ORARI_SPECIALI)?window.BERTI_ORARI_SPECIALI:[];
    const s=a.find(x=>x&&String(x.data)===ymd&&RE_ORA.test(String(x.dalle))&&RE_ORA.test(String(x.alle))&&minuti(x.dalle)<minuti(x.alle));
    return s?[minuti(s.dalle),minuti(s.alle)]:null;
  }
  function fasciaIl(ymd,day){return orarioSpeciale(ymd)||ORARI[day]||null;}
  function dataTesto(ymd){const [,m,d]=ymd.split("-").map(Number);return d+" "+MESI[m-1];}

  function aperto(){
    const t=adesso();
    if(assenzaIl(t.ymd)) return false;
    const f=fasciaIl(t.ymd,t.day);
    return !!f&&t.mins>=f[0]&&t.mins<f[1];
  }
  function fineOggi(){const t=adesso();const f=fasciaIl(t.ymd,t.day);return f?hhmm(f[1]):"";}
  function prossima(){
    const t=adesso();
    for(let i=0;i<=90;i++){
      const g=piuGiorni(t.ymd,i);
      if(assenzaIl(g.ymd)) continue;
      const f=fasciaIl(g.ymd,g.day);
      if(!f) continue;
      if(i===0&&t.mins>=f[0]) continue;
      const quando=i===0?"oggi":i===1?"domani":GIORNI[g.day]+" "+dataTesto(g.ymd);
      return quando+" dalle "+hhmm(f[0]);
    }
    return "al più presto";
  }
  function messaggioChiuso(){
    const a=assenzaIl(adesso().ymd);
    const inizio=a?"Chiamate sospese fino al "+dataTesto(a.al)+".":"Chiamate non disponibili in questo momento.";
    return inizio+" Puoi scriverci su WhatsApp o compilare il preventivo: ti ricontattiamo "+prossima()+".";
  }
  function messaggioAvviso(){
    const a=assenzaIl(adesso().ymd);
    return a?"Chiamate sospese fino al "+dataTesto(a.al)+". Puoi scriverci su WhatsApp."
            :"Chiamate: "+TESTO+". Puoi scriverci su WhatsApp.";
  }

  window.BertiChiamate={aperto,fineOggi,prossima,messaggioChiuso,messaggioAvviso,testo:TESTO};

  /* Avvisi a tempo (assenze.js -> BERTI_AVVISI) nel riquadro #bertiAvvisi */
  function mostraAvvisi(){
    const box=document.getElementById("bertiAvvisi");
    if(!box) return;
    const oggi=adesso().ymd;
    const lista=(Array.isArray(window.BERTI_AVVISI)?window.BERTI_AVVISI:[])
      .filter(x=>x&&RE_DATA.test(String(x.dal))&&RE_DATA.test(String(x.al))&&x.dal<=oggi&&oggi<=x.al&&String(x.testo||"").trim());
    box.textContent="";
    lista.forEach(x=>{const p=document.createElement("p");p.textContent=String(x.testo).trim();box.appendChild(p);});
    box.hidden=lista.length===0;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",mostraAvvisi); else mostraAvvisi();

  /* Pagine senza la gestione completa (es. "Chi sono"):
     spegne i pulsanti .call-link fuori orario e mostra un avviso al clic. */
  if(document.getElementById("hoursNotice")) return;

  function avviso(msg){
    let t=document.getElementById("toast");
    if(!t){
      t=document.createElement("div");
      t.id="toast";t.className="toast";
      t.setAttribute("role","status");t.setAttribute("aria-live","polite");
      document.body.appendChild(t);
    }
    t.textContent=msg;t.classList.add("show");
    clearTimeout(window.bertiToastTimer);
    window.bertiToastTimer=setTimeout(()=>t.classList.remove("show"),3200);
  }
  function aggiorna(){
    const ok=aperto();
    document.querySelectorAll(".call-link").forEach(l=>{
      if(!l.dataset.realHref) l.dataset.realHref=l.getAttribute("href")||"tel:+393522971348";
      l.classList.toggle("disabledCall",!ok);
      l.setAttribute("aria-disabled",String(!ok));
      l.setAttribute("href",ok?l.dataset.realHref:"#");
    });
  }
  document.addEventListener("click",e=>{
    const l=e.target.closest(".call-link.disabledCall");
    if(!l) return;
    e.preventDefault();
    avviso(messaggioAvviso());
  });
  aggiorna();
  setInterval(aggiorna,60000);
})();
