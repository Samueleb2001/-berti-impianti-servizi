/* =========================================================
   PULSANTE "CHIAMA": orari, assenze e tariffe (sempre in ora italiana)
   Orari: modificabili qui sotto in ORARI.
   Tariffe fuori orario: modificabili qui sotto in TARIFFE.
   Assenze e orari speciali di singole date: si scrivono nel file assenze.js.

   Come funziona:
   - orario normale di giorno: si chiama direttamente;
   - sera, fuori orario, domenica e festivi: prima della chiamata compare
     un riquadro con la tariffa di quel momento e "Scorri per chiamare";
   - periodi di assenza (assenze.js): il pulsante resta spento.
   ========================================================= */
(function(){
  /* Minuti dalla mezzanotte: 480 = 08:00, 720 = 12:00, 1080 = 18:00, 1350 = 22:30.
     0 = domenica, 1 = lunedì ... 6 = sabato. */
  const ORARI={1:[480,1350],2:[480,1350],3:[480,1350],4:[480,1350],5:[480,1350],6:[480,720]};
  const TESTO="lun–ven 08:00–22:30, sabato 08:00–12:00";
  const INIZIO_SERA=1080;   // 18:00
  const INIZIO_GIORNO=480;  // 08:00
  const FINE_GIORNO=1350;   // 22:30

  /* Uscita: comprende il viaggio (primi 20 km) e la prima mezz'ora di lavoro.
     Ora: manodopera dopo la prima mezz'ora. Materiali a parte. Come nell'app preventivi. */
  const TARIFFE={
    sera:        {nome:"serale",                titolo:"Chiamata serale",         uscita:65, ora:55},
    fuoriOrario: {nome:"fuori orario",          titolo:"Chiamata fuori orario",   uscita:85, ora:75},
    festivo:     {nome:"festiva",               titolo:"Chiamata festiva",        uscita:75, ora:65},
    notteFestiva:{nome:"notturna festiva",      titolo:"Chiamata notturna festiva", uscita:95, ora:85}
  };

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

  /* ---------- Festivi nazionali (calcolati da soli ogni anno, Pasquetta compresa) ---------- */
  function pasqua(y){
    const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
      h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
      mese=Math.floor((h+l-7*m+114)/31),giorno=((h+l-7*m+114)%31)+1;
    return y+"-"+String(mese).padStart(2,"0")+"-"+String(giorno).padStart(2,"0");
  }
  function festaNazionale(ymd){
    const md=ymd.slice(5);
    if(["01-01","01-06","04-25","05-01","06-02","08-15","11-01","12-08","12-25","12-26"].includes(md)) return true;
    return piuGiorni(pasqua(Number(ymd.slice(0,4))),1).ymd===ymd; // Pasquetta
  }
  function festivo(ymd,day){return day===0||festaNazionale(ymd);}

  /* ---------- Fascia del momento ----------
     tipo: "normale" (si chiama subito), "tariffa" (riquadro con prezzo), "chiuso" (assenza). */
  function stato(){
    const t=adesso();
    if(assenzaIl(t.ymd)) return {tipo:"chiuso"};
    const notte=t.mins<INIZIO_GIORNO||t.mins>=FINE_GIORNO;
    if(notte){
      // La notte appartiene alla sera in cui comincia (es. notte di Natale = 24→25).
      const inizio=t.mins<INIZIO_GIORNO?piuGiorni(t.ymd,-1):{ymd:t.ymd,day:t.day};
      const fine=t.mins<INIZIO_GIORNO?{ymd:t.ymd,day:t.day}:piuGiorni(t.ymd,1);
      const fest=festivo(inizio.ymd,inizio.day)||festaNazionale(fine.ymd);
      return {tipo:"tariffa",chiave:fest?"notteFestiva":"fuoriOrario",tariffa:fest?TARIFFE.notteFestiva:TARIFFE.fuoriOrario};
    }
    if(festivo(t.ymd,t.day)) return {tipo:"tariffa",chiave:"festivo",tariffa:TARIFFE.festivo};
    const f=fasciaIl(t.ymd,t.day);
    if(f&&t.mins>=f[0]&&t.mins<f[1]){
      if(t.mins>=INIZIO_SERA) return {tipo:"tariffa",chiave:"sera",tariffa:TARIFFE.sera};
      return {tipo:"normale"};
    }
    // Sabato pomeriggio: tariffa festiva (come nell'app preventivi).
    if(t.day===6) return {tipo:"tariffa",chiave:"festivo",tariffa:TARIFFE.festivo};
    return {tipo:"tariffa",chiave:"fuoriOrario",tariffa:TARIFFE.fuoriOrario};
  }

  function aperto(){return stato().tipo==="normale";}
  function fineOggi(){
    const t=adesso();const f=fasciaIl(t.ymd,t.day);
    if(!f) return "";
    return hhmm(t.mins<INIZIO_SERA&&f[1]>INIZIO_SERA?INIZIO_SERA:f[1]);
  }
  function prossima(){
    const t=adesso();
    for(let i=0;i<=90;i++){
      const g=piuGiorni(t.ymd,i);
      if(assenzaIl(g.ymd)||festivo(g.ymd,g.day)) continue;
      const f=fasciaIl(g.ymd,g.day);
      if(!f) continue;
      if(i===0&&t.mins>=f[0]) continue;
      const quando=i===0?"oggi":i===1?"domani":GIORNI[g.day]+" "+dataTesto(g.ymd);
      return quando+" dalle "+hhmm(f[0]);
    }
    return "al più presto";
  }
  function messaggioChiuso(){
    const s=stato();
    if(s.tipo==="tariffa"&&s.chiave==="sera"){
      return "Fino alle 22:30 puoi chiamarci con la tariffa serale: il costo ti viene mostrato prima della chiamata.";
    }
    if(s.tipo==="tariffa"){
      return "Ora è attiva la tariffa "+s.tariffa.nome+": puoi chiamarci per urgenze, il costo ti viene mostrato prima della chiamata. "+
        "Per tutto il resto scrivici su WhatsApp o compila il preventivo: ti ricontattiamo "+prossima()+".";
    }
    const a=assenzaIl(adesso().ymd);
    const inizio=a?"Chiamate sospese fino al "+dataTesto(a.al)+".":"Chiamate non disponibili in questo momento.";
    return inizio+" Puoi scriverci su WhatsApp o compilare il preventivo: ti ricontattiamo "+prossima()+".";
  }
  function messaggioAvviso(){
    const a=assenzaIl(adesso().ymd);
    return a?"Chiamate sospese fino al "+dataTesto(a.al)+". Puoi scriverci su WhatsApp."
            :"Chiamate: "+TESTO+". Puoi scriverci su WhatsApp.";
  }

  window.BertiChiamate={aperto,stato,fineOggi,prossima,messaggioChiuso,messaggioAvviso,testo:TESTO,tariffe:TARIFFE};

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

  /* ---------- Riquadro tariffa + "Scorri per chiamare" ---------- */
  const TEL="tel:+393522971348";
  const WA="https://wa.me/393522971348";
  let modale=null;

  function el(tag,cls,testo){const e=document.createElement(tag);if(cls)e.className=cls;if(testo!=null)e.textContent=testo;return e;}
  function euro(n){return n+" €";}

  function creaModale(){
    const back=el("div","modalBackdrop callRateBackdrop");
    back.id="callRateModal";back.setAttribute("aria-hidden","true");
    const box=el("div","callRateBox");
    box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-labelledby","callRateTitle");
    const chiudi=el("button","modalClose","×");chiudi.type="button";chiudi.setAttribute("aria-label","Chiudi");
    const titolo=el("h2","callRateTitle");titolo.id="callRateTitle";
    const intro=el("p","callRateIntro");
    const prezzi=el("div","callRatePrices");
    const nota=el("p","callRateNote","Interveniamo in base alla disponibilità. Il costo totale dipende dal tempo di lavoro e dai materiali: te lo confermiamo al telefono prima di partire.");
    const slideWrap=el("label","callRateSlide");
    const slideTxt=el("span","callRateSlideText","Scorri per chiamare →");
    const slide=document.createElement("input");
    slide.type="range";slide.min="0";slide.max="100";slide.value="0";slide.className="callRateRange";
    slide.setAttribute("aria-label","Scorri fino in fondo per chiamare");
    slideWrap.append(slideTxt,slide);
    const wa=el("a","callRateWa","Non è urgente? Scrivici su WhatsApp");
    wa.href=WA;wa.target="_blank";wa.rel="noopener";
    box.append(chiudi,titolo,intro,prezzi,nota,slideWrap,wa);
    back.appendChild(box);
    document.body.appendChild(back);

    const azzera=()=>{slide.value="0";slide.style.setProperty("--p","0%");};
    const chiudiModale=()=>{back.classList.remove("show");back.setAttribute("aria-hidden","true");azzera();};
    chiudi.addEventListener("click",chiudiModale);
    back.addEventListener("click",e=>{if(e.target===back)chiudiModale();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&back.classList.contains("show"))chiudiModale();});
    slide.addEventListener("input",()=>slide.style.setProperty("--p",slide.value+"%"));
    const verifica=()=>{
      if(Number(slide.value)>=95){
        const s=back.dataset.chiave||"";
        try{ if(typeof window.gtag==="function") window.gtag("event","chiamata_fuori_orario",{fascia:s}); }catch(_){}
        chiudiModale();
        window.location.href=TEL;
      }else{
        azzera();
      }
    };
    slide.addEventListener("change",verifica);
    slide.addEventListener("pointerup",verifica);
    slide.addEventListener("touchend",verifica);
    return {back,titolo,intro,prezzi,slide};
  }

  function apriTariffa(s){
    if(!modale) modale=creaModale();
    const t=s.tariffa;
    modale.back.dataset.chiave=s.chiave;
    modale.titolo.textContent=t.titolo;
    modale.intro.textContent=s.chiave==="sera"
      ?"Dalle 18:00 alle 22:30 si applica la tariffa serale."
      :s.chiave==="festivo"
        ?"Sabato pomeriggio, domenica e festivi rispondiamo solo per urgenze (blackout, guasti pericolosi), con la tariffa festiva."
        :"In questo momento rispondiamo solo per urgenze (blackout, guasti pericolosi), con la tariffa "+t.nome+".";
    modale.prezzi.textContent="";
    const r1=el("p","callRateRow");r1.append(el("span",null,"Uscita"),el("b",null,euro(t.uscita)));
    const s1=el("small",null,"comprende il viaggio (primi 20 km) e la prima mezz'ora di lavoro");
    const r2=el("p","callRateRow");r2.append(el("span",null,"Manodopera"),el("b",null,euro(t.ora)+"/h"));
    const s2=el("small",null,"dopo la prima mezz'ora · materiali a parte · prezzi finali, senza IVA in più");
    modale.prezzi.append(r1,s1,r2,s2);
    modale.slide.value="0";modale.slide.style.setProperty("--p","0%");
    modale.back.classList.add("show");modale.back.setAttribute("aria-hidden","false");
    setTimeout(()=>{try{modale.slide.focus();}catch(_){}},50);
  }

  /* Clic sui pulsanti Chiama (in cattura: prima di ogni altro gestore della pagina). */
  document.addEventListener("click",e=>{
    const l=e.target.closest(".call-link");
    if(!l||l.classList.contains("disabledCall")) return;
    const s=stato();
    if(s.tipo!=="tariffa") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    apriTariffa(s);
  },true);

  /* Pagine senza la gestione completa (es. "Chi sono"):
     spegne i pulsanti .call-link solo nei periodi di assenza e mostra un avviso al clic. */
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
    const ok=stato().tipo!=="chiuso";
    document.querySelectorAll(".call-link").forEach(l=>{
      if(!l.dataset.realHref) l.dataset.realHref=l.getAttribute("href")||TEL;
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
