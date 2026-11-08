console.log("BERTI frontend V14.15.0 PORTFOLIO GALLERY caricato");
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycby9tdAFRfDirspF3Il5Zs2VMd1bh-rKJaS1wkqhr3QA7JsVzg1Sgmob1QKL2ZTOpM105g/exec";
const GA_MEASUREMENT_ID="G-1SSYRJTNKB";
const ANALYTICS_CONSENT_KEY="berti_analytics_consent_v1";

/* Quando il Profilo Google è verificato, inserire i due URL e impostare enabled:true. */
const GOOGLE_BUSINESS={
  enabled:false,
  profileUrl:"",
  reviewUrl:""
};

function initGoogleBusiness(){
  const section=document.getElementById("recensioni");
  const profileLink=document.getElementById("googleProfileLink");
  const reviewLink=document.getElementById("googleReviewLink");
  const ready=GOOGLE_BUSINESS.enabled&&/^https:\/\//.test(GOOGLE_BUSINESS.profileUrl)&&/^https:\/\//.test(GOOGLE_BUSINESS.reviewUrl);
  if(!section||!profileLink||!reviewLink||!ready){if(section)section.hidden=true;return;}
  profileLink.href=GOOGLE_BUSINESS.profileUrl;
  reviewLink.href=GOOGLE_BUSINESS.reviewUrl;
  section.hidden=false;

}
let analyticsLoaded=false;
let analyticsLoading=false;
/* =========================
   PORTFOLIO LAVORI
   ========================= */

const PORTFOLIO_ATTIVO=true;

/*
  Fallback locale: garantisce che i due lavori già presenti compaiano
  anche se lavori.json tarda a caricarsi o viene temporaneamente bloccato.
  lavori.json resta comunque la fonte automatica principale.
*/
const PORTFOLIO_FALLBACK={
  muratura:[
    {
      id:"rivestimento-scale-ingresso-castel-san-pietro",
      titolo:"Rivestimento scale ingresso Castel San Pietro",
      prima:"images/lavori/muratura-rivestimento-scale-ingresso-castel-san-pietro-prima.webp",
      dopo:"images/lavori/muratura-rivestimento-scale-ingresso-castel-san-pietro-dopo.webp",
      extra:[]
    }
  ],
  tv:[
    {
      id:"installazione-tv-staffa-soffitto",
      titolo:"Installazione TV staffa soffitto",
      prima:"images/lavori/tv-installazione-tv-staffa-soffitto-prima.webp",
      dopo:"images/lavori/tv-installazione-tv-staffa-soffitto-dopo.webp",
      extra:[]
    }
  ]
};

let lavori={...PORTFOLIO_FALLBACK};
let lavoriInfo={};
let portfolioCaricato=false;
let portfolioPromise=null;

function applicaInfoLavori_(){
  Object.values(lavori).forEach(elenco=>{
    if(!Array.isArray(elenco))return;

    elenco.forEach(lavoro=>{
      const info=lavoriInfo[lavoro.id];
      if(!info || typeof info!=="object")return;

      if(typeof info.titolo==="string" && info.titolo.trim()){
        lavoro.titolo=info.titolo.trim();
      }
      if(typeof info.luogo==="string"){
        lavoro.luogo=info.luogo.trim();
      }
      if(typeof info.descrizione==="string"){
        lavoro.descrizione=info.descrizione.trim();
      }
    });
  });
}

function caricaPortfolio_(){
  if(portfolioPromise)return portfolioPromise;

  portfolioPromise=(async()=>{
    try{
      const cacheBust=Date.now();

      const [response,infoResponse]=await Promise.all([
        fetch("lavori.json?v="+cacheBust,{cache:"no-store"}),
        fetch("lavori-info.json?v="+cacheBust,{cache:"no-store"})
          .catch(()=>null)
      ]);

      if(!response.ok)throw new Error("HTTP "+response.status);

      const data=await response.json();

      if(infoResponse && infoResponse.ok){
        const infoData=await infoResponse.json();
        lavoriInfo=(infoData && typeof infoData==="object") ? infoData : {};
      }else{
        lavoriInfo={};
      }

      const sorgente=(data && typeof data==="object")
        ? {...PORTFOLIO_FALLBACK,...data}
        : {...PORTFOLIO_FALLBACK};

      lavori={};
      Object.entries(sorgente).forEach(([categoria,elenco])=>{
        lavori[categoria]=Array.isArray(elenco)
          ? elenco.map(lavoro=>{
              const info=lavoriInfo[String(lavoro.id||"")]||{};
              return {
                ...lavoro,
                titolo:(typeof info.titolo==="string" && info.titolo.trim())
                  ? info.titolo.trim()
                  : lavoro.titolo,
                luogo:(typeof info.luogo==="string")
                  ? info.luogo.trim()
                  : (lavoro.luogo||""),
                descrizione:(typeof info.descrizione==="string")
                  ? info.descrizione.trim()
                  : (lavoro.descrizione||"")
              };
            })
          : [];
      });

      portfolioCaricato=true;
    }catch(err){
      console.error("Impossibile caricare lavori.json, uso fallback locale:",err);
      lavori={...PORTFOLIO_FALLBACK};
      portfolioCaricato=true;
    }

    aggiornaPortfolioButton_();
    return lavori;
  })();

  return portfolioPromise;
}


function gaIdConfigurato(){return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID)&&GA_MEASUREMENT_ID!=="G-XXXXXXXXXX";}
function trackEvent(name,params={}){
  if(!analyticsLoaded||typeof window.gtag!=="function")return false;
  window.gtag("event",name,{
    ...params,
    transport_type:"beacon"
  });
  return true;
}

function posizioneElemento_(el){
  if(!el)return "sconosciuta";
  if(el.closest(".contactbar"))return "barra_fissa";
  if(el.closest(".quickActions"))return "azioni_home";
  if(el.closest(".actions"))return "dettaglio_servizio";
  if(el.closest(".contactCards"))return "sezione_contatti";
  if(el.closest("nav"))return "menu";
  return "pagina";
}

function apriDopoTracking_(eventName,params,href){
  let aperto=false;
  const vai=()=>{
    if(aperto)return;
    aperto=true;
    window.location.href=href;
  };

  if(!analyticsLoaded||typeof window.gtag!=="function"){
    vai();
    return;
  }

  window.gtag("event",eventName,{
    ...params,
    transport_type:"beacon",
    event_callback:vai,
    event_timeout:140
  });

  setTimeout(vai,150);
}
function loadGoogleAnalytics(){
  if(!gaIdConfigurato()||analyticsLoaded||analyticsLoading)return;
  analyticsLoading=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag("consent","default",{
    analytics_storage:"granted",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied"
  });
  window.gtag("js",new Date());
  window.gtag("config",GA_MEASUREMENT_ID,{anonymize_ip:true});
  const tag=document.createElement("script");
  tag.async=true;
  tag.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_MEASUREMENT_ID);
  tag.onload=()=>{analyticsLoading=false;};
  tag.onerror=()=>{analyticsLoading=false;analyticsLoaded=false;};
  document.head.appendChild(tag);
  analyticsLoaded=true;
}
function deleteAnalyticsCookies(){
  document.cookie.split(";").forEach(cookie=>{
    const name=cookie.split("=")[0].trim();
    if(name==="_ga"||name.startsWith("_ga_")){
      document.cookie=name+"=; Max-Age=0; path=/; SameSite=Lax";
    }
  });
}
function denyGoogleAnalytics(){
  if(typeof window.gtag==="function"){
    window.gtag("consent","update",{
      analytics_storage:"denied",
      ad_storage:"denied",
      ad_user_data:"denied",
      ad_personalization:"denied"
    });
  }
  analyticsLoaded=false;
  deleteAnalyticsCookies();
}
function getAnalyticsConsent(){try{return localStorage.getItem(ANALYTICS_CONSENT_KEY)||"";}catch(_){return "";}}
function setAnalyticsConsent(value){try{localStorage.setItem(ANALYTICS_CONSENT_KEY,value);}catch(_){}}
function initAnalyticsConsent(){const box=document.getElementById("analyticsConsent"),accept=document.getElementById("analyticsAccept"),reject=document.getElementById("analyticsReject"),preferences=document.getElementById("openPrivacyPreferences");if(!box||!accept||!reject)return;const saved=getAnalyticsConsent();if(saved==="granted"){loadGoogleAnalytics();box.hidden=true;}else if(saved==="denied"||!gaIdConfigurato()){box.hidden=true;}else{box.hidden=false;}accept.addEventListener("click",()=>{
  setAnalyticsConsent("granted");
  box.hidden=true;
  loadGoogleAnalytics();
  trackEvent("consenso_analytics_accettato",{});
});reject.addEventListener("click",()=>{setAnalyticsConsent("denied");denyGoogleAnalytics();box.hidden=true;});if(preferences){preferences.addEventListener("click",()=>{box.hidden=false;accept.focus();});}}

const services={
elettrico:{
 icon:"⚡",
 title:"IMPIANTI ELETTRICI",
 short:"Impianti interni ed esterni, tubazioni, canaline, cavi, quadri e manutenzione.",
 headline:"Impianti elettrici e interventi su misura",
 text:"Interventi elettrici per abitazioni e altri ambienti, dalla predisposizione alla modifica e manutenzione dell'impianto.",
 items:[
   "Impianti elettrici interni ed esterni",
   "Stesura tubi corrugati, guaine e canaline",
   "Passaggio e sostituzione cavi",
   "Prese, punti luce e comandi",
   "Quadri elettrici e protezioni",
   "Modifiche e ampliamenti",
   "Sensori, crepuscolari e temporizzatori",
   "Manutenzione e verifiche"
 ],
 image:"images/Impianti-elettrici.webp"
},

illuminazione:{
 icon:"💡",
 title:"ILLUMINAZIONE",
 short:"Lampade, faretti, plafoniere, LED e illuminazione interna ed esterna.",
 headline:"La luce giusta cambia ogni ambiente",
 text:"Installazione e sostituzione di sistemi di illuminazione per interni ed esterni, con attenzione a funzionalità e resa.",
 items:[
   "Plafoniere e lampadari",
   "Faretti",
   "Strisce LED",
   "Illuminazione esterna",
   "Illuminazione garage e portici",
   "Sensori di movimento",
   "Crepuscolari e temporizzatori"
 ],
 image:"images/Illuminazione.jpg.PNG"
},

guasti:{
 icon:"🔎",
 title:"RICERCA E RIPARAZIONE GUASTI",
 short:"Individuazione e risoluzione di anomalie elettriche.",
 headline:"Troviamo il problema, poi lo risolviamo",
 text:"Ricerca mirata dei guasti per individuare anomalie e ripristinare il corretto funzionamento dell'impianto.",
 items:[
   "Scatti del differenziale",
   "Prese e linee non funzionanti",
   "Problemi di illuminazione",
   "Controllo collegamenti",
   "Diagnosi con strumenti",
   "Piccoli ripristini"
 ],
 image:"images/Ricerca-guasti.jpg.PNG"
},

esterni:{
 icon:"🌙",
 title:"ESTERNI E GIARDINO",
 short:"Luci, prese, sensori e predisposizioni per giardino, portico e garage.",
 headline:"Impianti e illuminazione per gli spazi esterni",
 text:"Interventi elettrici e predisposizioni per rendere funzionali giardini, terrazzi, portici, garage e altre aree esterne.",
 items:[
   "Illuminazione esterna",
   "Prese e punti alimentazione",
   "Sensori di movimento",
   "Crepuscolari",
   "Canalizzazioni esterne",
   "Predisposizioni per giardino e portico"
 ],
 image:"images/Esterni-e-giardino.jpg.PNG?v=11-1"
},

reti:{
 icon:"🌐",
 title:"RETI, WI-FI E CABLAGGIO",
 short:"Ethernet, prese dati, switch, access point e sistemazione della rete domestica.",
 headline:"Una rete più ordinata e più stabile",
 text:"Cablaggio e organizzazione di piccole reti domestiche e locali, con supporto alla distribuzione Ethernet e Wi-Fi.",
 items:[
   "Passaggio cavi Ethernet",
   "Prese dati RJ45",
   "Collegamento switch",
   "Installazione access point",
   "Posizionamento ripetitori",
   "Riordino cablaggi di rete"
 ],
 image:"images/Reti-Wi-Fi.jpg.PNG?v=11-1"
},

citofonia:{
 icon:"🔔",
 title:"CITOFONI E CAMPANELLI",
 short:"Installazione, sostituzione e piccoli interventi su citofonia e campanelli.",
 headline:"Citofoni e campanelli per la casa",
 text:"Piccoli interventi su sistemi di chiamata e citofonia domestica, dalla sostituzione degli accessori alla nuova installazione compatibile.",
 items:[
   "Campanelli",
   "Pulsanti di chiamata",
   "Citofoni",
   "Videocitofoni",
   "Alimentatori e accessori compatibili",
   "Ricerca piccoli malfunzionamenti"
 ],
 image:"images/Citofonia.jpg.PNG?v=11-1"
},

tv:{
 icon:"📺",
 title:"TV, STAFFE E MULTIMEDIA",
 short:"Montaggio TV, staffe a parete, passaggio cavi e sistemazione accessori.",
 headline:"TV e multimedia installati con ordine",
 text:"Montaggio e sistemazione di TV e accessori multimediali con attenzione a fissaggi, passaggio cavi e risultato estetico.",
 items:[
   "Montaggio TV a parete",
   "Installazione staffe",
   "Passaggio e mascheratura cavi",
   "Posizionamento soundbar",
   "Piccoli accessori multimediali",
   "Riordino collegamenti"
 ],
 image:"images/Tv-staffe-multimedia.jpg.PNG?v=11-1"
},

audio:{
 icon:"🔊",
 title:"IMPIANTI AUDIO E FILODIFFUSIONE",
 short:"Diffusori, cablaggi audio e piccole installazioni per casa e spazi esterni.",
 headline:"Musica dove ti serve",
 text:"Installazione e cablaggio di piccoli sistemi audio e diffusori per ambienti interni, portici e spazi esterni.",
 items:[
   "Posa cavi audio",
   "Montaggio diffusori",
   "Piccoli amplificatori",
   "Collegamento sorgenti audio",
   "Filodiffusione semplice",
   "Sistemazione cablaggi"
 ],
 image:"images/Impianti-audio-e-filodiffusione.jpg.PNG?v=11-1"
},

idraulica:{
 icon:"💧",
  active:false,
 title:"PICCOLE MANUTENZIONI IDRAULICHE",
short:"Piccoli interventi di manutenzione ordinaria su componenti e accessori esistenti.",
headline:"Piccole manutenzioni idrauliche",
 text:"Piccoli interventi di manutenzione ordinaria su componenti e accessori esistenti, senza modifiche o ampliamenti dell'impianto idraulico.",
 items:[
  "Sifoni e scarichi semplici",
  "Flessibili",
  "Accessori bagno",
  "Sostituzione di accessori esistenti",
  "Pulizia e sistemazione componenti",
  "Piccoli ripristini"
 ],
 image:"images/Idraulica.jpg.PNG"
},

manutenzioni:{
 icon:"🏠",
 title:"MANUTENZIONI DOMESTICHE",
 short:"Riparazioni, fissaggi, sigillature, regolazioni e piccole sistemazioni per la casa.",
 headline:"Una soluzione per le manutenzioni di casa",
 text:"Un unico riferimento per tanti piccoli interventi e sistemazioni domestiche, per interni ed esterni, con valutazione preventiva del lavoro.",
 items:[
   "Riparazioni e sistemazioni varie",
   "Fissaggi, serraggi e regolazioni",
   "Siliconature e piccole sigillature",
   "Sostituzione e montaggio di accessori",
   "Scaffali, supporti e organizzazione garage o cantine",
   "Piccoli ripristini dopo lavori e montaggi",
   "Manutenzione di interni ed esterni",
   "Sistemazioni estetiche e finiture",
   "Interventi personalizzati su richiesta"
 ],
 image:"images/Manutenzioni-domestiche.jpg.PNG"
},

montaggi:{
 icon:"🛠️",
 title:"MONTAGGI E RIPARAZIONI",
 short:"Mensole, accessori, tende, quadri, specchi e piccoli montaggi.",
 headline:"Montaggi precisi, senza improvvisare",
 text:"Installazione, fissaggio e montaggio di elementi e accessori con attenzione alle superfici e alla sicurezza.",
 items:[
   "Mensole e accessori",
   "Tende e supporti",
   "Quadri e specchi",
   "Accessori bagno e cucina",
   "Staffe e supporti",
   "Piccole riparazioni"
 ],
 image:"images/Montaggi-riparazioni.jpg.PNG"
},

mobili:{
 icon:"🪛",
 title:"MONTAGGIO MOBILI",
 short:"Montaggio e assemblaggio di mobili e complementi.",
 headline:"Montaggio mobili a domicilio",
 text:"Assemblaggio e montaggio di mobili e complementi, con verifica degli ingombri e del corretto posizionamento.",
 items:[
   "Mobili in kit",
   "Armadi e scaffalature",
   "Piccoli arredi",
   "Fissaggi a parete quando necessari",
   "Regolazione ante e cassetti",
   "Regolazioni finali"
 ],
 image:"images/Montaggio-mobili.jpg.PNG"
},

porte:{
 icon:"🚪",
 title:"PORTE, FINESTRE E REGOLAZIONI",
 short:"Maniglie, cerniere e piccole regolazioni su porte e finestre.",
 headline:"Piccole regolazioni che fanno la differenza",
 text:"Interventi di manutenzione e regolazione su porte, finestre e relativi accessori quando il lavoro non richiede opere specialistiche.",
 items:[
   "Regolazione porte",
   "Maniglie",
   "Cerniere",
   "Serraggi e registrazioni",
   "Fermi e accessori",
   "Piccoli problemi di chiusura"
 ],
 image:"images/Porte-finestre-regolazione.jpg.PNG"
},

ritocchi:{
 icon:"🎨",
 title:"TINTEGGIATURA E FINITURE",
  active:false,
 short:"Tinteggiatura, stuccature, rasature, ripristini e finiture per interni.",
 headline:"Tinteggiatura e finiture per rinnovare gli ambienti",
 text:"Interventi di tinteggiatura, preparazione delle superfici e finitura, dal semplice ripristino alla sistemazione completa delle pareti.",
 items:[
   "Tinteggiatura di pareti e soffitti",
   "Preparazione delle superfici",
   "Stuccature",
   "Rasature e finiture",
   "Ripristino di fori, crepe e segni",
   "Ripristini dopo lavori e impianti",
   "Finiture dopo opere in cartongesso",
   "Ritocchi localizzati"
 ],
 image:"images/Ritocchi.jpg.PNG?v=11-1"
},

 cartongesso:{
   active:false,
 icon:"▧",
 title:"CARTONGESSO E RIPRISTINI",
 short:"Pareti, contropareti, velette, chiusure, ripristini e finiture in cartongesso.",
 headline:"Soluzioni in cartongesso per modificare e rifinire gli spazi",
 text:"Realizzazione e sistemazione di opere in cartongesso per interni, dalla costruzione della struttura alla stuccatura e finitura.",
 items:[
   "Pareti e contropareti",
   "Velette e ribassamenti",
   "Chiusura di vani e aperture",
   "Rivestimenti in cartongesso",
   "Strutture e lastre",
   "Stuccatura di giunti e viti",
   "Ripristini dopo lavori e impianti",
   "Riparazioni e finiture"
 ],
 image:"images/Cartongesso.jpg.PNG"
},

  muratura:{
    active:false,
 icon:"🧱",
 title:"MURATURA E RIPRISTINI EDILI",
 short:"Opere murarie, tracce, chiusure, ripristini e sistemazioni edili.",
 headline:"Lavori di muratura e ripristini per la casa",
 text:"Interventi di muratura e ripristino per modifiche, manutenzioni e sistemazioni degli ambienti, anche in abbinamento a lavori impiantistici.",
 items:[
   "Opere murarie e ripristini",
   "Apertura e chiusura di tracce",
   "Chiusura di fori e aperture",
   "Ripristini dopo lavori impiantistici",
   "Posa e sistemazione di elementi murari",
   "Ripristino di intonaci",
   "Stuccature e finiture",
   "Sistemazioni edili localizzate"
 ],
 image:"images/Muratura.jpg.PNG"
},

trasporto:{
 active:false,
 icon:"📦",
 title:"TRASPORTO OGGETTI",
 short:"Supporto per il trasporto di oggetti e piccoli carichi.",
 headline:"Hai qualcosa da spostare?",
 text:"Supporto per trasporto e movimentazione di oggetti, valutando insieme dimensioni, distanza e modalità dell'intervento.",
 items:[
   "Piccoli trasporti",
   "Movimentazione oggetti",
   "Ritiro e consegna da concordare",
   "Supporto allo spostamento di mobili",
   "Piccoli carichi",
   "Valutazione preventiva"
 ],
 image:"images/Trasporto-oggetti.jpg.PNG"
},

smarthome:{
 icon:"🏡",
 title:"SMART HOME",
 short:"Dispositivi smart, controllo luci, prese, sensori e automazioni per una casa più connessa.",
 headline:"Rendi la tua casa più intelligente",
 text:"Installazione, configurazione e integrazione di dispositivi smart per migliorare comfort, controllo e gestione della casa, valutando ogni intervento in base all'impianto esistente.",
 items:[
   "Prese e dispositivi smart",
   "Interruttori e relè smart",
   "Controllo intelligente dell'illuminazione",
   "Sensori di movimento e apertura",
   "Gestione smart di tapparelle e automazioni",
   "Termostati smart e dispositivi connessi (senza interventi sulla caldaia)",
   "Configurazione app e controllo da smartphone",
   "Collegamento dei dispositivi alla rete Wi-Fi",
   "Integrazione con assistenti vocali compatibili",
   "Configurazione di scenari e automazioni"
 ],
 image:"images/Smart-home.jpg.PNG"
},

automazioni:{
 icon:"▤",
 title:"TAPPARELLE E AUTOMAZIONI",
 short:"Riparazioni, motorizzazioni e piccole automazioni.",
 headline:"Più comodità con le automazioni",
 text:"Interventi su tapparelle e piccole automazioni domestiche, dalla manutenzione alla motorizzazione.",
 items:[
   "Tapparelle",
   "Motorizzazioni",
   "Comandi e pulsanti",
   "Finecorsa e regolazioni",
   "Piccoli automatismi",
   "Ricerca piccoli malfunzionamenti"
 ],
 image:"images/Tapparelle-automazioni.jpg.PNG"
},

altro:{
 icon:"➕",
 title:"ALTRI SERVIZI SU RICHIESTA",
 short:"Hai un lavoro particolare? Descrivici cosa ti serve e valuteremo la soluzione.",
 headline:"Non trovi il servizio che stai cercando?",
 text:"Oltre ai servizi principali possiamo occuparci di numerosi piccoli lavori, installazioni, montaggi e sistemazioni per la casa e gli spazi esterni. Raccontaci cosa devi fare: valuteremo il lavoro, la fattibilità e la soluzione più adatta.",
 items:[
   "Valutazione intervento",
   "Lavori personalizzati",
   "Piccole sistemazioni",
   "Interventi combinati",
   "Sopralluogo quando necessario",
   "Preventivo gratuito"
 ],
 image:"images/Altri-servizi.jpg.PNG?v=11-1"
}
};

let currentService=null;
const grid=document.getElementById("serviceGrid");
const graphic=document.getElementById("serviceGraphic");
const quoteModal=document.getElementById("quoteModal");
const quoteForm=document.getElementById("quoteForm");
const qService=document.getElementById("qService");
let quoteFormStartedAt=Date.now();

const portfolioSection=document.getElementById("portfolioSection");
const portfolioOpen=document.getElementById("portfolioOpen");
const portfolioModal=document.getElementById("portfolioModal");
const portfolioClose=document.getElementById("portfolioClose");
const portfolioTitle=document.getElementById("portfolioTitle");
const portfolioWorks=document.getElementById("portfolioWorks");

Object.entries(services)
 .filter(([,s])=>s.active!==false)
 .forEach(([key,s],i)=>{
   const b=document.createElement("button");
   b.className="card"; b.dataset.key=key;
   b.innerHTML=`<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.short}</p>`;
   b.onclick=()=>{
     trackEvent("servizio_aperto",{servizio:s.title});
     selectService(key,true);
   };
   grid.appendChild(b);
   const opt=document.createElement("option"); opt.value=key; opt.textContent=s.title; qService.appendChild(opt);
 });

/* La griglia è completa: ora la sezione può entrare nel layout già con l'altezza definitiva. */
const servicesSection=document.getElementById("servizi");
if(servicesSection){
  servicesSection.classList.remove("servicesLoading");
}

function waUrl(){
 const s=currentService ? services[currentService] : null;
 const servizio=s ? s.title : "";
 const text=`Salve, vorrei richiedere un preventivo a BERTI Impianti & Servizi.

Servizio: ${servizio}
Nome:
Comune dell'intervento:
Descrizione del lavoro:
Giorno/orario preferito per essere ricontattato:`;
 return "https://wa.me/393522971348?text="+encodeURIComponent(text);
}

function updateWhatsAppLinks(){
 document.querySelectorAll(".js-wa-link").forEach(a=>a.href=waUrl());
}
/* =========================
   PORTFOLIO
   ========================= */

function lavoriServizio_(key){
  const elenco=lavori[key];
  return Array.isArray(elenco) ? elenco : [];
}

function aggiornaPortfolioButton_(){
  if(!portfolioSection)return;

  const elenco=lavoriServizio_(currentService);
  const visibile=Boolean(
    PORTFOLIO_ATTIVO &&
    currentService &&
    elenco.length>0
  );

  portfolioSection.hidden=!visibile;
  portfolioSection.style.display=visibile ? "block" : "none";
}

function escapeHtml_(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function creaLavoroPortfolio_(lavoro,index){
  const article=document.createElement("article");
  article.className="portfolioWork";

  article.innerHTML=`
    <div class="beforeAfter" style="--pos:50%">

      <img
        class="beforeImage"
        src="${escapeHtml_(lavoro.prima)}"
        alt="Prima - ${escapeHtml_(lavoro.titolo)}"
        loading="lazy">

      <img
        class="afterImage"
        src="${escapeHtml_(lavoro.dopo)}"
        alt="Dopo - ${escapeHtml_(lavoro.titolo)}"
        loading="lazy">

      <span class="beforeAfterLabel before">PRIMA</span>
      <span class="beforeAfterLabel after">DOPO</span>

      <div class="beforeAfterDivider"></div>

      <div class="beforeAfterHandle" aria-hidden="true">
        ↔
      </div>

    </div>

    <div class="portfolioWorkInfo">

      <h3>${escapeHtml_(lavoro.titolo)}</h3>

      ${
        lavoro.luogo
          ? `<p class="portfolioWorkLocation">${escapeHtml_(lavoro.luogo)}</p>`
          : ""
      }

      ${
        lavoro.descrizione
          ? `<p class="portfolioWorkDescription">${escapeHtml_(lavoro.descrizione)}</p>`
          : ""
      }

      ${
        Array.isArray(lavoro.extra) && lavoro.extra.length
          ? `<div class="portfolioDetails" aria-label="Dettagli fotografici">
              <div class="portfolioDetailsHead">
                <strong>DETTAGLI</strong>
                <span>${lavoro.extra.length} ${lavoro.extra.length===1 ? "foto" : "foto"}</span>
              </div>
              <div class="portfolioDetailsCarousel">
                <button class="portfolioDetailsArrow prev" type="button" aria-label="Dettagli precedenti">‹</button>
                <div class="portfolioDetailsTrack">
                  ${lavoro.extra.map((src,i)=>`
                    <button class="portfolioDetailThumb" type="button" data-extra-index="${i}" aria-label="Apri dettaglio ${i+1}">
                      <img src="${escapeHtml_(src)}" alt="Dettaglio ${i+1} - ${escapeHtml_(lavoro.titolo)}" loading="lazy">
                      <span>+ ZOOM</span>
                    </button>
                  `).join("")}
                </div>
                <button class="portfolioDetailsArrow next" type="button" aria-label="Dettagli successivi">›</button>
              </div>
            </div>`
          : ""
      }

      <div class="portfolioWorkBrand" aria-hidden="true">
        <strong>BERTI</strong>
        <span>IMPIANTI &amp; SERVIZI</span>
      </div>

    </div>
  `;

  const slider=article.querySelector(".beforeAfter");

  if(slider){
    inizializzaBeforeAfter_(slider,index);
  }

  const extra=Array.isArray(lavoro.extra) ? lavoro.extra : [];
  const track=article.querySelector(".portfolioDetailsTrack");
  const prev=article.querySelector(".portfolioDetailsArrow.prev");
  const next=article.querySelector(".portfolioDetailsArrow.next");

  article.querySelectorAll(".portfolioDetailThumb").forEach(button=>{
    button.addEventListener("click",()=>{
      const extraIndex=Number(button.dataset.extraIndex||0);
      apriPortfolioLightbox_(extra,extraIndex,lavoro.titolo);
    });
  });

  if(track && prev && next){
    const carousel=article.querySelector(".portfolioDetailsCarousel");
    const haPiuFoto=extra.length>1;

    prev.hidden=!haPiuFoto;
    next.hidden=!haPiuFoto;

    if(carousel){
      carousel.classList.toggle("single",!haPiuFoto);
    }

    if(haPiuFoto){
      const scorri=(direzione)=>{
        const passo=Math.max(220,Math.round(track.clientWidth*.78));
        track.scrollBy({left:direzione*passo,behavior:"smooth"});
      };
      prev.addEventListener("click",()=>scorri(-1));
      next.addEventListener("click",()=>scorri(1));
    }
  }

  return article;
}

function inizializzaBeforeAfter_(slider,index){
  let dragging=false;

  const aggiorna=(clientX)=>{
    const rect=slider.getBoundingClientRect();

    if(!rect.width)return;

    let percent=
      ((clientX-rect.left)/rect.width)*100;

    percent=Math.max(0,Math.min(100,percent));

    slider.style.setProperty(
      "--pos",
      percent.toFixed(2)+"%"
    );
  };

  slider.addEventListener("pointerdown",e=>{
    dragging=true;

    try{
      slider.setPointerCapture(e.pointerId);
    }catch(_){}

    aggiorna(e.clientX);
  });

  slider.addEventListener("pointermove",e=>{
    if(!dragging)return;
    aggiorna(e.clientX);
  });

  const fineDrag=()=>{
    dragging=false;
  };

  slider.addEventListener("pointerup",fineDrag);
  slider.addEventListener("pointercancel",fineDrag);
  slider.addEventListener("lostpointercapture",fineDrag);

  slider.addEventListener("click",e=>{
    aggiorna(e.clientX);
  });
}

let portfolioLightboxState=null;

function assicuraPortfolioLightbox_(){
  let box=document.getElementById("portfolioLightbox");
  if(box)return box;

  box=document.createElement("div");
  box.id="portfolioLightbox";
  box.className="portfolioLightbox";
  box.hidden=true;
  box.setAttribute("aria-hidden","true");
  box.innerHTML=`
    <button class="portfolioLightboxClose" type="button" aria-label="Chiudi immagine">×</button>
    <button class="portfolioLightboxArrow prev" type="button" aria-label="Foto precedente">‹</button>
    <figure class="portfolioLightboxFigure">
      <img class="portfolioLightboxImage" alt="">
      <figcaption class="portfolioLightboxCaption"></figcaption>
    </figure>
    <button class="portfolioLightboxArrow next" type="button" aria-label="Foto successiva">›</button>
    <div class="portfolioLightboxCounter" aria-live="polite"></div>
  `;
  document.body.appendChild(box);

  box.querySelector(".portfolioLightboxClose").addEventListener("click",chiudiPortfolioLightbox_);
  box.querySelector(".portfolioLightboxArrow.prev").addEventListener("click",()=>cambiaPortfolioLightbox_(-1));
  box.querySelector(".portfolioLightboxArrow.next").addEventListener("click",()=>cambiaPortfolioLightbox_(1));
  box.addEventListener("click",e=>{if(e.target===box)chiudiPortfolioLightbox_();});

  let touchStartX=0;
  let touchStartY=0;
  box.addEventListener("touchstart",e=>{
    const t=e.changedTouches[0];
    touchStartX=t.clientX;
    touchStartY=t.clientY;
  },{passive:true});
  box.addEventListener("touchend",e=>{
    const t=e.changedTouches[0];
    const dx=t.clientX-touchStartX;
    const dy=t.clientY-touchStartY;
    if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.2){
      cambiaPortfolioLightbox_(dx<0 ? 1 : -1);
    }
  },{passive:true});

  return box;
}

function aggiornaPortfolioLightbox_(){
  const box=document.getElementById("portfolioLightbox");
  if(!box || !portfolioLightboxState)return;

  const {foto,titolo}=portfolioLightboxState;
  const totale=foto.length;
  if(!totale)return;
  const i=((portfolioLightboxState.index%totale)+totale)%totale;
  portfolioLightboxState.index=i;

  const img=box.querySelector(".portfolioLightboxImage");
  const caption=box.querySelector(".portfolioLightboxCaption");
  const counter=box.querySelector(".portfolioLightboxCounter");
  const prev=box.querySelector(".portfolioLightboxArrow.prev");
  const next=box.querySelector(".portfolioLightboxArrow.next");

  img.src=foto[i];
  img.alt=`Dettaglio ${i+1} - ${titolo||"Lavoro realizzato"}`;
  caption.textContent=titolo||"Lavoro realizzato";
  counter.textContent=`${i+1} / ${totale}`;
  prev.hidden=totale<2;
  next.hidden=totale<2;
}

function apriPortfolioLightbox_(foto,index=0,titolo=""){
  if(!Array.isArray(foto) || !foto.length)return;
  const box=assicuraPortfolioLightbox_();
  portfolioLightboxState={foto:[...foto],index,titolo};
  aggiornaPortfolioLightbox_();
  box.hidden=false;
  box.setAttribute("aria-hidden","false");
  box.querySelector(".portfolioLightboxClose").focus();
  trackEvent("dettaglio_portfolio_aperto",{servizio:services[currentService]?.title||"",lavoro:titolo||""});
}

function cambiaPortfolioLightbox_(direzione){
  if(!portfolioLightboxState || portfolioLightboxState.foto.length<2)return;
  portfolioLightboxState.index+=direzione;
  aggiornaPortfolioLightbox_();
}

function chiudiPortfolioLightbox_(){
  const box=document.getElementById("portfolioLightbox");
  if(!box || box.hidden)return;
  box.hidden=true;
  box.setAttribute("aria-hidden","true");
  portfolioLightboxState=null;
}

function renderPortfolio_(key){
  if(!portfolioWorks)return;

  const servizio=services[key];
  const elenco=lavoriServizio_(key);

  portfolioWorks.innerHTML="";

  if(portfolioTitle){
    portfolioTitle.textContent=
      servizio
        ? servizio.title
        : "Lavori realizzati";
  }

  elenco.forEach((lavoro,index)=>{
    portfolioWorks.appendChild(
      creaLavoroPortfolio_(lavoro,index)
    );
  });
}

function apriPortfolio_(){
  if(!PORTFOLIO_ATTIVO)return;

  const elenco=lavoriServizio_(currentService);

  if(!elenco.length || !portfolioModal)return;

  renderPortfolio_(currentService);

  portfolioModal.hidden=false;
  portfolioModal.setAttribute("aria-hidden","false");

  document.body.style.overflow="hidden";

  trackEvent("galleria_aperta",{
    servizio:services[currentService]?.title||""
  });
}

function chiudiPortfolio_(motivo="chiusura"){
  if(!portfolioModal || portfolioModal.hidden)return;

  portfolioModal.hidden=true;
  portfolioModal.setAttribute("aria-hidden","true");

  document.body.style.overflow="";

  trackEvent("galleria_chiusa",{
    servizio:services[currentService]?.title||"",
    motivo
  });
}

if(portfolioOpen){
  portfolioOpen.addEventListener(
    "click",
    apriPortfolio_
  );
}

if(portfolioClose){
  portfolioClose.addEventListener(
    "click",
    ()=>chiudiPortfolio_("x")
  );
}

if(portfolioModal){
  portfolioModal.addEventListener("click",e=>{
    if(e.target===portfolioModal){
      chiudiPortfolio_("sfondo");
    }
  });
}

document.addEventListener("keydown",e=>{
  const lightbox=document.getElementById("portfolioLightbox");
  const lightboxAperta=Boolean(lightbox && !lightbox.hidden);

  if(lightboxAperta){
    if(e.key==="Escape")chiudiPortfolioLightbox_();
    if(e.key==="ArrowLeft")cambiaPortfolioLightbox_(-1);
    if(e.key==="ArrowRight")cambiaPortfolioLightbox_(1);
    return;
  }

  if(
    e.key==="Escape" &&
    portfolioModal &&
    !portfolioModal.hidden
  ){
    chiudiPortfolio_("escape");
  }
});
function selectService(key,scroll=false){
 const s=services[key];
 if(!s || s.active===false) return;

 const dettaglio=document.getElementById("dettaglio");
 currentService=key;

 if(dettaglio){
   dettaglio.hidden=false;
   dettaglio.style.display="block";
 }

 document.getElementById("detailLabel").textContent=s.title;
 document.getElementById("detailTitle").textContent=s.headline;
 document.getElementById("detailText").textContent=s.text;
 document.getElementById("detailList").innerHTML=s.items.map(x=>`<li>${x}</li>`).join("");
 document.querySelectorAll(".card").forEach(x=>x.classList.toggle("active",x.dataset.key===key));
 qService.value=key;

 if(graphic){
   graphic.classList.add("fading");
   graphic.onload=()=>graphic.classList.remove("fading");
   graphic.onerror=()=>graphic.classList.remove("fading");
   graphic.alt=s.title+" - BERTI Impianti & Servizi";
   graphic.src=s.image;
 }

 updateWhatsAppLinks();

 // Mostra subito il portfolio se già disponibile; poi risincronizza
 // appena lavori.json termina il caricamento.
 aggiornaPortfolioButton_();
 caricaPortfolio_().then(()=>{
   if(currentService===key)aggiornaPortfolioButton_();
 });

 if(scroll && dettaglio){
   requestAnimationFrame(()=>{
     dettaglio.scrollIntoView({
       behavior:"smooth",
       block:"start"
     });
   });
 }
}

function openQuote(){
 quoteFormStartedAt=Date.now();
 trackEvent("preventivo_aperto",{servizio:services[currentService]?.title||""});
 document.getElementById("qWebsite").value="";
 qService.value=currentService||"";
 qqRender_();
 quoteModal.classList.add("show"); quoteModal.setAttribute("aria-hidden","false");
 setTimeout(()=>document.getElementById("qName").focus(),100);
}
function closeQuote(motivo="chiusura"){
  const eraAperto=quoteModal.classList.contains("show");
  quoteModal.classList.remove("show");
  quoteModal.setAttribute("aria-hidden","true");
  if(eraAperto){
    trackEvent("preventivo_chiuso",{motivo});
  }
}
document.querySelectorAll(".quote-open").forEach(b=>b.addEventListener("click",openQuote));
document.getElementById("modalClose").addEventListener("click",()=>closeQuote("x"));
document.getElementById("cancelQuote").addEventListener("click",()=>closeQuote("annulla"));
quoteModal.addEventListener("click",e=>{if(e.target===quoteModal)closeQuote("sfondo");});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeQuote("escape");});

let preventivoCompilazioneTracciata=false;
quoteForm.addEventListener("input",()=>{
  if(preventivoCompilazioneTracciata)return;
  preventivoCompilazioneTracciata=true;
  trackEvent("preventivo_compilazione_iniziata",{
    servizio:qService.value&&services[qService.value]?services[qService.value].title:""
  });
});

qService.addEventListener("change",()=>{
  const servizio=services[qService.value];
  if(servizio){
    trackEvent("servizio_preventivo_selezionato",{servizio:servizio.title});
  }
});

function leggiStatoRichiesta_(jobId){
  return new Promise((resolve,reject)=>{
    const callbackName=
      "bertiStatus_"+Date.now()+"_"+Math.random().toString(36).slice(2);

    const script=document.createElement("script");

    const cleanup=()=>{
      try{ delete window[callbackName]; }catch(_){}
      try{ script.remove(); }catch(_){}
    };

    const timer=setTimeout(()=>{
      cleanup();
      reject(new Error("TIMEOUT_JSONP"));
    },5000);

    window[callbackName]=(data)=>{
      clearTimeout(timer);
      cleanup();
      resolve(data);
    };

    script.onerror=()=>{
      clearTimeout(timer);
      cleanup();
      reject(new Error("ERRORE_JSONP"));
    };

    script.src=
      APPS_SCRIPT_URL+
      "?jobId="+encodeURIComponent(jobId)+
      "&callback="+encodeURIComponent(callbackName)+
      "&_="+Date.now();

    document.head.appendChild(script);
  });
}

async function attendiConfermaRichiesta_(jobId){
  const timeoutMs=5000;
  const intervalloMs=700;
  const iniziato=Date.now();

  while(Date.now()-iniziato<timeoutMs){
    try{
      const data=await leggiStatoRichiesta_(jobId);

      if(data && data.status==="confirmed"){
        return data;
      }

      if(data && data.status==="error"){
  const backendError=new Error(
    data.error || "Registrazione non riuscita."
  );

  backendError.isBackendError=true;
  throw backendError;
}

}catch(err){
  if(err && err.isBackendError){
    throw err;
  }

  console.warn("Controllo stato richiesta:",err);
}

    await new Promise(resolve=>setTimeout(resolve,intervalloMs));
  }

  throw new Error("TIMEOUT_CONFERMA");
}

quoteForm.addEventListener("submit",async e=>{
 e.preventDefault();

 const submitBtn=quoteForm.querySelector(".sendQuote");
 const formStatus=document.getElementById("formStatus");
 const progress=document.getElementById("sendProgress");
 const progressBar=document.getElementById("sendProgressBar");
 const progressPct=document.getElementById("sendProgressPct");
 const progressLabel=document.getElementById("sendProgressLabel");
 const s=services[qService.value];
 const now=Date.now();

const jobId=
  "JOB-"+(
    window.crypto&&crypto.randomUUID
      ? crypto.randomUUID()
      : `${now}-${Math.random().toString(36).slice(2)}`
  );
  
 if(submitBtn.disabled) return;
 if(!quoteForm.reportValidity()) return;
 const telefono =
  document.getElementById("qPhone").value.trim();

const cifreTelefono =
  telefono.replace(/\D/g,"");

if(cifreTelefono.length<6 || cifreTelefono.length>15){
  formStatus.className="formStatus error";
  formStatus.textContent=
    "Inserisci un numero di telefono valido.";
  document.getElementById("qPhone").focus();
  return;
} 
const descrizione=document.getElementById("qDescription").value.trim();

if(descrizione.length<5){
  formStatus.className="formStatus error";
  formStatus.textContent=
    "Descrizione troppo breve: inserisci almeno 5 caratteri.";
  document.getElementById("qDescription").focus();

  trackEvent("preventivo_descrizione_troppo_breve",{
    servizio:s.title
  });

  return;
}
 const payload={
   priority:qqPriorita_(),
   name:document.getElementById("qName").value.trim(),
   surname:document.getElementById("qSurname").value.trim(),
   email:document.getElementById("qEmail").value.trim(),
   phone:telefono,
   address:qqIndirizzo_(),
   service:s.title,
   message:document.getElementById("qDescription").value.trim(),
   details:qqTestoRisposte_(),
   website:document.getElementById("qWebsite").value.trim(),
   formStartedAt:quoteFormStartedAt,
   submissionId:(window.crypto&&crypto.randomUUID)?crypto.randomUUID():`${now}-${Math.random().toString(36).slice(2)}`,
   jobId:jobId,
   clientVersion:"14.17.0"
 };

 let finished=false;
 let pct=4;
 let progressTimer=null;

 const setProgress=(value,label)=>{
   pct=Math.max(pct,Math.min(value,100));
   progressBar.style.width=pct+"%";
   progressPct.textContent=Math.round(pct)+"%";
   if(label) progressLabel.textContent=label;
 };

 const startProgress=()=>{
   progress.hidden=false;
   setProgress(6,"Verifica dati…");

   const started=performance.now();

   progressTimer=setInterval(()=>{
     if(finished) return;

     const elapsed=performance.now()-started;

    if(elapsed<2000){
  setProgress(
    Math.min(30,pct+3.4),
    "Invio richiesta…"
  );

}else if(elapsed<4000){
  setProgress(
    Math.min(55,pct+2.8),
    "Registrazione richiesta…"
  );

}else if(elapsed<6500){
  setProgress(
    Math.min(75,pct+1.8),
    "Preparazione pratica…"
  );

}else if(elapsed<9000){
  setProgress(
    Math.min(90,pct+1.3),
    "Verifica registrazione…"
  );

}else{
  setProgress(
    Math.min(
      99,
      pct + Math.max(0.10,(99-pct)*0.045)
    ),
    "Richiesta inviata, completamento…"
  );
}
     
},220);
};
 submitBtn.disabled=true;
 submitBtn.classList.add("sending");
 submitBtn.textContent="INVIO IN CORSO…";
 formStatus.className="formStatus";
 formStatus.textContent="";
 startProgress();

 try{
   /*
     Con il backend V14.5 il doPost salva subito la richiesta essenziale,
     accoda la parte pesante e risponde molto prima.
   */
   await fetch(APPS_SCRIPT_URL,{
     method:"POST",
     mode:"no-cors",
     headers:{"Content-Type":"text/plain;charset=utf-8"},
     body:JSON.stringify(payload),
     cache:"no-store",
     referrerPolicy:"strict-origin-when-cross-origin",
     keepalive:true
   });

   setProgress(75,"Verifica registrazione…");

const conferma=await attendiConfermaRichiesta_(jobId);

finished=true;
if(progressTimer) clearInterval(progressTimer);

setProgress(100,"Richiesta registrata");

formStatus.className="formStatus success";

formStatus.textContent=
  conferma.requestId
    ? "Richiesta registrata correttamente. Codice: "+conferma.requestId
    : "Richiesta registrata correttamente.";

trackEvent("preventivo_inviato",{
  servizio:s.title,
  confermato:true
});

quoteForm.reset();
qService.value=currentService;
quoteFormStartedAt=Date.now();

setTimeout(()=>closeQuote("inviato"),2000);

 }catch(err){
  finished=true;
  if(progressTimer) clearInterval(progressTimer);
  console.error(err);

  if(err && err.message==="TIMEOUT_CONFERMA"){
  progressBar.style.width="100%";
  progressPct.textContent="100%";
  progressLabel.textContent="Richiesta presa in carico";

  formStatus.className="formStatus success";
  formStatus.textContent=
    "Richiesta inviata al sistema. La registrazione è in completamento: non è necessario reinviarla.";

  trackEvent("preventivo_preso_in_carico",{
    servizio:s.title,
    conferma_immediata:false
  });

  quoteForm.reset();
  qService.value=currentService;
  quoteFormStartedAt=Date.now();

  setTimeout(()=>closeQuote("presa_in_carico"),2500);

}else{
  progressBar.style.width="100%";
  progressPct.textContent="!";
  progressLabel.textContent="Invio non completato";

  formStatus.className="formStatus error";

  if(err && err.isBackendError &&
     String(err.message||"").toLowerCase().includes("descrizione troppo breve")){
    formStatus.textContent=
      "Descrizione troppo breve: inserisci almeno 5 caratteri.";
  }else{
    formStatus.textContent=
      "Non è stato possibile registrare la richiesta. Riprova oppure contattaci tramite WhatsApp o telefono.";
  }

  trackEvent("preventivo_errore",{
    servizio:s.title
  });
}
 }finally{
   setTimeout(()=>{
     submitBtn.disabled=false;
     submitBtn.classList.remove("sending");
     submitBtn.textContent="INVIA RICHIESTA";
   },700);
 }
});
function isCallOpen(){const now=new Date();const mins=now.getHours()*60+now.getMinutes();return mins>=480&&mins<1350;}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
function updateCallState(){
 const open=isCallOpen(),notice=document.getElementById("hoursNotice");
 document.querySelectorAll(".call-link").forEach(link=>{
  link.classList.toggle("disabledCall",!open);link.setAttribute("aria-disabled",String(!open));
  if(!open){if(!link.dataset.realHref)link.dataset.realHref=link.getAttribute("href")||"tel:+393522971348";link.setAttribute("href","#");}
  else link.setAttribute("href",link.dataset.realHref||"tel:+393522971348");
 });
 notice.textContent=open?"Chiamate disponibili ora, fino alle 22:30.":"Chiamate non disponibili in questo orario. Puoi scriverci su WhatsApp o compilare il preventivo: rispondiamo dalle 08:00.";
}
document.addEventListener("click",e=>{const link=e.target.closest(".call-link.disabledCall");if(link){e.preventDefault();showToast("Chiamate disponibili dalle 08:00 alle 22:30. Puoi scriverci su WhatsApp.");}});
document.addEventListener("click",e=>{
  const call=e.target.closest(".call-link:not(.disabledCall)");
  if(call){
    e.preventDefault();
    const href=call.dataset.realHref||call.getAttribute("href")||"tel:+393522971348";
    apriDopoTracking_("chiamata_cliccata",{
      posizione:posizioneElemento_(call),
      servizio:services[currentService]?.title||""
    },href);
    return;
  }

  const wa=e.target.closest(".js-wa-link");
  if(wa){
    e.preventDefault();
    const href=wa.getAttribute("href")||waUrl();
    apriDopoTracking_("whatsapp_cliccato",{
      posizione:posizioneElemento_(wa),
      servizio:services[currentService]?.title||""
    },href);
    return;
  }

  const email=e.target.closest('a[href^="mailto:"]');
  if(email){
    trackEvent("email_cliccata",{
      posizione:posizioneElemento_(email),
      tipo:"email"
    });
  }

  const menu=e.target.closest("nav a");
  if(menu){
    trackEvent("menu_cliccato",{
      destinazione:(menu.getAttribute("href")||"").replace("#","")
    });
  }
});

function inizializzaTrackingSezioni_(){
  if(!("IntersectionObserver" in window))return;

  const viste=new Set();
  const sezioni=[
    ["home",document.getElementById("home")],
    ["servizi",document.getElementById("servizi")],
    ["dettaglio",document.getElementById("dettaglio")],
    ["zone",document.getElementById("zone")],
    ["contatti",document.getElementById("contatti")]
  ];

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting||entry.intersectionRatio<0.35)return;
      const voce=sezioni.find(([,el])=>el===entry.target);
      if(!voce)return;
      const nome=voce[0];
      if(viste.has(nome))return;
      if(!analyticsLoaded)return;
      viste.add(nome);
      trackEvent("sezione_visualizzata",{sezione:nome});
    });
  },{threshold:[0.35]});

  sezioni.forEach(([,el])=>{if(el)observer.observe(el);});
}

initGoogleBusiness();
caricaPortfolio_();
initAnalyticsConsent();
inizializzaTrackingSezioni_();
const dettaglioIniziale=document.getElementById("dettaglio");
if(dettaglioIniziale){
  dettaglioIniziale.hidden=true;
  dettaglioIniziale.style.display="none";
}
// La visibilità del portfolio viene gestita in base al servizio e a lavori.json.
aggiornaPortfolioButton_();
if(graphic){
  graphic.removeAttribute("src");
  graphic.alt="";
}
updateWhatsAppLinks();
updateCallState();
setInterval(updateCallState,60000);

/* =========================
   COMING SOON INTERATTIVO
   ========================= */
(function initComingSoon(){
  const page=document.getElementById("comingSoonPage");
  const wall=document.getElementById("comingWall");
  const left=document.getElementById("comingSwitchLeft");
  const right=document.getElementById("comingSwitchRight");
  if(!page||!wall||!left||!right)return;

  function switchClickSound(){
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      const ctx=new AudioCtx();
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type="square";
      osc.frequency.setValueAtTime(115,ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(72,ctx.currentTime+.035);
      gain.gain.setValueAtTime(.028,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.045);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime+.05);
      setTimeout(()=>ctx.close().catch(()=>{}),100);
    }catch(_){}
  }

  function toggle(button,className,labelOn,labelOff){
    const on=button.getAttribute("aria-pressed")!=="true";
    button.setAttribute("aria-pressed",String(on));
    button.setAttribute("aria-label",on?labelOff:labelOn);
    wall.classList.toggle(className,on);
    switchClickSound();
  }

  left.addEventListener("click",()=>toggle(left,"leftOn","Accendi luce sinistra","Spegni luce sinistra"));
  right.addEventListener("click",()=>toggle(right,"rightOn","Accendi luce destra","Spegni luce destra"));
})();

/* =========================
   FAQ ACCORDION — BERTI v14.10.0
   ========================= */
function initFaqAccordion(){
  const items=[...document.querySelectorAll(".faqItem")];
  items.forEach(item=>{
    item.addEventListener("toggle",()=>{
      if(!item.open)return;
      items.forEach(other=>{
        if(other!==item&&other.open)other.removeAttribute("open");
      });
    });
  });
}
initFaqAccordion();



/* =========================
   BERTI MEGA NAV v14.12
   ========================= */
(function initBertiMegaNav(){
  const header=document.getElementById("siteHeader");
  const nav=document.getElementById("mainNav");
  const toggle=document.querySelector(".menuToggle");
  if(!header||!nav||!toggle)return;

  const setOpen=(open)=>{
    nav.classList.toggle("menuOpen",open);
    header.classList.toggle("menuIsOpen",open);
    document.body.classList.toggle("bertNavOpen",open);
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"Chiudi menu":"Apri menu");
    const menuLabel=toggle.querySelector(".menuLabel");
    if(menuLabel)menuLabel.textContent=open?"CHIUDI":"MENU";
    nav.setAttribute("aria-hidden",String(!open));
  };

  const closeMenu=()=>setOpen(false);

  const syncHeader=()=>{
    header.classList.toggle("headerScrolled",window.scrollY>16);
  };
  syncHeader();
  window.addEventListener("scroll",syncHeader,{passive:true});

  toggle.addEventListener("click",()=>{
    setOpen(!nav.classList.contains("menuOpen"));
  });

  nav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click",()=>{
      link.classList.add("navFlash");
      window.setTimeout(()=>link.classList.remove("navFlash"),900);
      closeMenu();
    });
  });

  nav.querySelectorAll(".quote-open").forEach(button=>{
    button.addEventListener("click",closeMenu);
  });

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&nav.classList.contains("menuOpen")){
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click",e=>{
    if(!nav.classList.contains("menuOpen"))return;
    if(header.contains(e.target))return;
    closeMenu();
  });

  window.addEventListener("resize",()=>{
    if(window.innerWidth>1200 && !nav.classList.contains("menuOpen")){
      document.body.classList.remove("bertNavOpen");
    }
  });

  const sectionLinks=[...nav.querySelectorAll("a[data-section]")];
  const sections=sectionLinks
    .map(link=>[link,document.getElementById(link.dataset.section)])
    .filter(([,section])=>section);

  if("IntersectionObserver" in window && sections.length){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries
        .filter(e=>e.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      sectionLinks.forEach(link=>{
        link.classList.toggle("isActive",link.dataset.section===visible.target.id);
      });
    },{rootMargin:"-28% 0px -58% 0px",threshold:[0,.15,.35]});
    sections.forEach(([,section])=>observer.observe(section));
  }
})();

/* v14.12.1 — nessuna modifica funzionale JS; contactbar rimossa dal markup. */

/* v14.12.2 — mega-menu semplificato; logica invariata. */

/* v14.12.3 — nessuna modifica JS; regolato solo l'ancoraggio CSS di #zone. */

/* v14.12.4 — CTA navbar PREVENTIVO esplicita anche su mobile; logica invariata. */

/* v14.13.0 — polish navbar e CTA Home; nessuna funzione rimossa. */

/* v14.13.1 — nessuna modifica funzionale JS. */

/* v14.13.2 — evidenza gialla del mega-menu solo hover + feedback click temporaneo. */

/* v14.14.1 — fix visibilità pulsante portfolio dopo caricamento lavori.json. */
/* v14.14.2 — fix definitivo visibilità portfolio + fallback lavori + WhatsApp mobile. */

/* v14.14.3 — metadati portfolio da lavori-info.json: titolo, luogo e descrizione. */
/* v14.14.4 — merge deterministico dei metadati nel caricamento portfolio. */
/* v14.15.0 — dettagli portfolio automatici: carosello, zoom lightbox, frecce, tastiera e swipe mobile. */

/* =========================
   DOMANDE RAPIDE PREVENTIVO (facoltative)
   Ogni risposta può aprire domande dedicate (showIf).
   Le risposte vanno nel campo "details" -> colonna "Dettagli richiesta".
   La descrizione del cliente resta separata.
   ========================= */

const QQ_AVVISO_BRUCIATO="<strong>⚠️ Per sicurezza:</strong> non toccare prese o apparecchi. Se puoi farlo in sicurezza, stacca l'interruttore generale. In caso di fumo o fiamme chiama subito il <strong>112</strong>.";
const QQ_AVVISO_CONTATORE="<strong>Prima controlla il contatore:</strong> se è staccato prova a riarmarlo una volta. Se la corrente manca anche ai vicini, il guasto è sulla rete: chiama il numero guasti indicato sulla bolletta.";

const QQ_COMUNI=[
  {id:"cliente",label:"Il lavoro è per",options:["Privato","Azienda","Condominio","Altro"]},
  {id:"titolo",label:"Sei",options:["Proprietario","Inquilino","Amministratore / incaricato"]},
  {id:"urgenza",label:"Quando ti serve?",options:["Urgente","Entro la settimana","Da programmare"]},
  {id:"contatto",label:"Come preferisci essere ricontattato?",options:["WhatsApp","Telefonata","Email"]}
];

const se=(id,...any)=>({id,any});

const QQ_PARETE={label:"Su che tipo di parete?",options:["Muratura","Cartongesso","Piastrelle","Non lo so"]};
const QQ_MATERIALE=["Sì, ce l'ho già","No, da fornire","Mi serve un consiglio"];

const QQ_SERVIZI={
  elettrico:{
    esempio:"Esempio: vorrei aggiungere due prese in camera e un punto luce in corridoio...",
    domande:[
      {id:"tipo",label:"Che tipo di lavoro?",multi:true,options:["Nuovo impianto","Rifacimento","Aggiunta prese / punti luce","Spostamento o modifica","Quadro elettrico","Sensori e temporizzatori","Controllo / manutenzione","Altro"]},
      {id:"immobile",label:"Che tipo di immobile?",options:["Appartamento","Casa indipendente","Negozio / ufficio"]},
      /* Nuovo impianto / Rifacimento */
      {id:"superficie",label:"Superficie indicativa?",showIf:se("tipo","Nuovo impianto","Rifacimento"),options:["Fino a 60 m²","60–100 m²","100–150 m²","Oltre 150 m²"]},
      {id:"statoimmobile",label:"L'immobile è…",showIf:se("tipo","Nuovo impianto","Rifacimento"),options:["Abitato","Vuoto / in ristrutturazione"]},
      {id:"murarie",label:"Tracce e ripristini murari",showIf:se("tipo","Nuovo impianto","Rifacimento"),options:["Da includere","Li fa un'altra impresa","Da valutare insieme"]},
      {id:"contatore",label:"Potenza del contatore?",showIf:se("tipo","Nuovo impianto","Rifacimento"),options:["3 kW","4,5 kW","6 kW","Oltre 6 kW","Non lo so"]},
      {id:"progetto",label:"Hai una planimetria o un progetto?",showIf:se("tipo","Nuovo impianto","Rifacimento"),options:["Sì","No"]},
      /* Aggiunta / spostamento */
      {id:"puntiquanti",label:"Quanti punti?",showIf:se("tipo","Aggiunta prese / punti luce","Spostamento o modifica"),options:["1–2","3–5","Più di 5"]},
      {id:"puntidove",label:"In quali ambienti?",multi:true,showIf:se("tipo","Aggiunta prese / punti luce","Spostamento o modifica"),options:["Cucina","Bagno","Camere","Soggiorno","Esterno","Garage / cantina"]},
      {id:"posa",label:"Come preferisci i cavi?",showIf:se("tipo","Aggiunta prese / punti luce","Spostamento o modifica"),options:["Sotto traccia","Canalina a vista","Da valutare"]},
      /* Quadro */
      {id:"quadro",label:"Cosa serve sul quadro?",multi:true,showIf:se("tipo","Quadro elettrico"),options:["Sostituzione completa","Aggiunta interruttori","Controllo ed etichette"]},
      {id:"eta",label:"Età indicativa dell'impianto?",showIf:se("tipo","Quadro elettrico","Rifacimento","Controllo / manutenzione"),options:["Prima del 1990","1990–2008","Dopo il 2008","Non lo so"]},
      /* Sensori */
      {id:"sensori",label:"Che dispositivo?",multi:true,showIf:se("tipo","Sensori e temporizzatori"),options:["Sensore di movimento","Crepuscolare","Temporizzatore"]},
      {id:"sensoridove",label:"Dove?",showIf:se("tipo","Sensori e temporizzatori"),options:["Interno","Esterno","Scale / parti comuni"]},
      /* Controllo */
      {id:"controllo",label:"Cosa ti preoccupa?",multi:true,showIf:se("tipo","Controllo / manutenzione"),options:["Impianto vecchio","Prese o placche rovinate","Vendita / affitto casa","Controllo generale"]}
    ]
  },
  illuminazione:{
    esempio:"Esempio: vorrei sostituire 3 lampadari e mettere dei faretti LED in soggiorno...",
    domande:[
      {id:"tipo",label:"Cosa ti serve?",multi:true,options:["Nuovi punti luce","Sostituzione lampadari / plafoniere","Faretti / strisce LED","Luci esterne, garage o portico","Sensori / crepuscolari"]},
      {id:"nuovipunti",label:"Quanti nuovi punti luce?",showIf:se("tipo","Nuovi punti luce"),options:["1–2","3–5","Più di 5"]},
      {id:"lampadari",label:"Quanti apparecchi da sostituire?",showIf:se("tipo","Sostituzione lampadari / plafoniere"),options:["1–2","3–5","Più di 5"]},
      {id:"altezza",label:"Soffitto più alto di 3 metri?",showIf:se("tipo","Nuovi punti luce","Sostituzione lampadari / plafoniere"),options:["No","Sì"]},
      {id:"controsoffitto",label:"C'è un controsoffitto?",showIf:se("tipo","Faretti / strisce LED"),options:["Sì","No","Da realizzare"]},
      {id:"ledquanti",label:"Quanti faretti o metri di LED?",showIf:se("tipo","Faretti / strisce LED"),options:["Pochi (fino a 5 faretti / 5 m)","Medio (6–15 / 5–15 m)","Tanti (oltre)"]},
      {id:"esterne",label:"Dove vanno le luci?",multi:true,showIf:se("tipo","Luci esterne, garage o portico"),options:["A parete","A terra / giardino","Vialetto / ingresso","Garage","Portico"]},
      {id:"sensori",label:"Per quali luci?",multi:true,showIf:se("tipo","Sensori / crepuscolari"),options:["Esterne","Garage","Scale / corridoi"]},
      {id:"apparecchi",label:"Hai già gli apparecchi?",showIf:se("tipo","Nuovi punti luce","Sostituzione lampadari / plafoniere","Faretti / strisce LED","Luci esterne, garage o portico"),options:QQ_MATERIALE}
    ]
  },
  guasti:{
    esempio:"Esempio: in cucina scatta il differenziale quando accendo il forno, succede da qualche giorno...",
    domande:[
      {id:"sintomo",label:"Cosa succede?",multi:true,options:["Scatta il differenziale","Manca corrente","Presa / interruttore non funziona","Luci che sfarfallano","Odore di bruciato / scintille"],
        avvisi:{"Odore di bruciato / scintille":QQ_AVVISO_BRUCIATO}},
      {id:"scatta",label:"Quando scatta?",showIf:se("sintomo","Scatta il differenziale"),options:["Subito, non si riarma","Quando accendo un apparecchio","Quando piove","A caso"]},
      {id:"mancadove",label:"Dove manca corrente?",showIf:se("sintomo","Manca corrente"),options:["Una stanza / zona","Un piano","Esterno","Tutta la casa"],
        avvisi:{"Tutta la casa":QQ_AVVISO_CONTATORE}},
      {id:"presequante",label:"Quante prese o interruttori?",showIf:se("sintomo","Presa / interruttore non funziona"),options:["Uno","Alcuni","Tutta una zona"]},
      {id:"luci",label:"Lo sfarfallio riguarda",showIf:se("sintomo","Luci che sfarfallano"),options:["Una lampada","Una stanza","Tutta la casa"]},
      {id:"quando",label:"Da quando?",options:["Oggi","Da qualche giorno","Da tempo"]},
      {id:"lavori",label:"Ci sono stati lavori o nuovi apparecchi di recente?",options:["Sì","No","Non lo so"]}
    ]
  },
  esterni:{
    esempio:"Esempio: vorrei illuminare il vialetto e aggiungere una presa vicino al barbecue...",
    domande:[
      {id:"tipo",label:"Cosa ti serve?",multi:true,options:["Illuminazione esterna","Prese esterne","Sensori / crepuscolari","Canalizzazioni e predisposizioni"]},
      {id:"lucidove",label:"Dove vanno le luci?",multi:true,showIf:se("tipo","Illuminazione esterna"),options:["Giardino","Vialetto / ingresso","Portico","Garage"]},
      {id:"luciquante",label:"Quanti punti luce?",showIf:se("tipo","Illuminazione esterna"),options:["1–2","3–5","Più di 5"]},
      {id:"prese",label:"Quante prese?",showIf:se("tipo","Prese esterne"),options:["1","2–3","Più di 3"]},
      {id:"sensori",label:"Che dispositivo?",multi:true,showIf:se("tipo","Sensori / crepuscolari"),options:["Sensore di movimento","Crepuscolare"]},
      {id:"distanza",label:"Distanza indicativa dalla casa?",showIf:se("tipo","Canalizzazioni e predisposizioni","Illuminazione esterna","Prese esterne"),options:["Sulla facciata","Fino a 10 m","10–30 m","Oltre 30 m"]},
      {id:"scavo",label:"Serve uno scavo?",showIf:se("tipo","Canalizzazioni e predisposizioni"),options:["Sì","No, ci sono già tubi","Non lo so"]}
    ]
  },
  reti:{
    esempio:"Esempio: il Wi-Fi non arriva al piano di sopra, vorrei un punto rete in camera...",
    domande:[
      {id:"tipo",label:"Cosa ti serve?",multi:true,options:["Nuovi punti rete (RJ45)","Wi-Fi più stabile","Riordino cablaggi"]},
      {id:"rj45",label:"Quanti punti rete?",showIf:se("tipo","Nuovi punti rete (RJ45)"),options:["1–2","3–5","Più di 5"]},
      {id:"tubi",label:"Ci sono tubi liberi per i cavi?",showIf:se("tipo","Nuovi punti rete (RJ45)"),options:["Sì","No","Non lo so"]},
      {id:"casa",label:"Quanto è grande la casa?",showIf:se("tipo","Wi-Fi più stabile"),options:["Un piano","Due piani","Più piani o giardino"]},
      {id:"ap",label:"Hai già ripetitori o access point?",showIf:se("tipo","Wi-Fi più stabile"),options:["Sì","No"]},
      {id:"riordino",label:"Dove?",showIf:se("tipo","Riordino cablaggi"),options:["Armadio / rack","Dietro TV o scrivania","Altro"]}
    ]
  },
  citofonia:{
    esempio:"Esempio: il videocitofono non si accende più, è un modello di circa 10 anni fa...",
    domande:[
      {id:"tipo",label:"Su cosa intervenire?",options:["Citofono","Videocitofono","Campanello / pulsante"]},
      {id:"intervento",label:"Cosa serve?",showIf:se("tipo","Citofono","Videocitofono","Campanello / pulsante"),options:["Nuova installazione","Sostituzione","Riparazione"]},
      {id:"problema",label:"Cosa non funziona?",multi:true,showIf:se("intervento","Riparazione"),options:["Non suona","Non si sente","Non apre","Schermo spento"]},
      {id:"utenze",label:"Quante abitazioni servono?",showIf:se("tipo","Citofono","Videocitofono"),options:["1","Da 2 a 4","5 o più"]},
      {id:"apriporta",label:"Deve aprire anche il cancello?",showIf:se("tipo","Citofono","Videocitofono"),options:["Sì","No","Non lo so"]},
      {id:"apparecchio",label:"Hai già l'apparecchio?",showIf:se("intervento","Nuova installazione","Sostituzione"),options:QQ_MATERIALE}
    ]
  },
  tv:{
    esempio:"Esempio: devo montare a parete una TV da 55 pollici e nascondere i cavi...",
    domande:[
      {id:"tipo",label:"Cosa ti serve?",multi:true,options:["TV a parete","Nascondere i cavi","Soundbar","Collegamenti e accessori"]},
      {id:"pollici",label:"Quanti pollici?",showIf:se("tipo","TV a parete"),options:["Fino a 43","50–65","Oltre 65"]},
      {id:"parete",label:QQ_PARETE.label,showIf:se("tipo","TV a parete","Soundbar"),options:QQ_PARETE.options},
      {id:"staffa",label:"Hai già la staffa?",showIf:se("tipo","TV a parete"),options:QQ_MATERIALE},
      {id:"cavi",label:"Come nascondere i cavi?",showIf:se("tipo","Nascondere i cavi"),options:["Canalina esterna","Dentro il muro","Da valutare"]},
      {id:"presa",label:"C'è una presa vicino alla TV?",showIf:se("tipo","TV a parete","Nascondere i cavi"),options:["Sì","No, da aggiungere"]}
    ]
  },
  audio:{
    esempio:"Esempio: vorrei la filodiffusione in cucina e soggiorno...",
    domande:[
      {id:"tipo",label:"Cosa ti serve?",multi:true,options:["Diffusori / casse","Filodiffusione","Collegamento sorgenti","Sistemazione cablaggi"]},
      {id:"diffquanti",label:"Quanti diffusori?",showIf:se("tipo","Diffusori / casse"),options:["2","3–4","Più di 4"]},
      {id:"diffdove",label:"Dove?",showIf:se("tipo","Diffusori / casse"),options:["Interno","Esterno","Entrambi"]},
      {id:"stanze",label:"Quante stanze?",showIf:se("tipo","Filodiffusione"),options:["1–2","3–4","Più di 4"]},
      {id:"cavi",label:"I cavi sono…",showIf:se("tipo","Filodiffusione","Diffusori / casse"),options:["Già predisposti","Da passare","Non lo so"]},
      {id:"materiale",label:"Hai già il materiale?",showIf:se("tipo","Diffusori / casse","Filodiffusione"),options:QQ_MATERIALE}
    ]
  },
  manutenzioni:{
    esempio:"Esempio: ho una lista di lavoretti: rifare il silicone della doccia, fissare una mensola, regolare un'anta...",
    domande:[
      {id:"tipo",label:"Che tipo di intervento?",multi:true,options:["Riparazioni e sistemazioni","Fissaggi e regolazioni","Siliconature e sigillature","Scaffali / garage / cantina","Sostituzione accessori","Finiture e ritocchi"]},
      {id:"quanti",label:"Quanti lavori diversi?",options:["Uno","2–3","Una lista di lavoretti"]},
      {id:"silicone",label:"Dove va il silicone?",multi:true,showIf:se("tipo","Siliconature e sigillature"),options:["Doccia / vasca","Lavandino / cucina","Finestre","Esterno"]},
      {id:"scaffali",label:"Quanti scaffali o supporti?",showIf:se("tipo","Scaffali / garage / cantina"),options:["1–2","3–5","Più di 5"]},
      {id:"interni",label:"Dove si trova?",options:["Interno","Esterno","Entrambi"]},
      {id:"materiale",label:"Hai già il materiale?",showIf:se("tipo","Sostituzione accessori","Scaffali / garage / cantina","Fissaggi e regolazioni"),options:QQ_MATERIALE}
    ]
  },
  montaggi:{
    esempio:"Esempio: devo appendere 2 mensole, uno specchio in bagno e un bastone per le tende...",
    domande:[
      {id:"tipo",label:"Cosa devi montare?",multi:true,options:["Mensole","Tende e bastoni","Quadri e specchi","Accessori bagno / cucina","Staffe e supporti","Piccole riparazioni"]},
      {id:"pezzi",label:"Quanti pezzi in totale?",options:["1–3","4–10","Più di 10"]},
      {id:"tende",label:"Che tipo di tenda?",showIf:se("tipo","Tende e bastoni"),options:["Bastone","Binario","Tenda a rullo / pacchetto"]},
      {id:"peso",label:"Ci sono pezzi pesanti (oltre 15 kg)?",showIf:se("tipo","Quadri e specchi","Mensole","Staffe e supporti"),options:["No","Sì"]},
      {id:"parete",label:QQ_PARETE.label,options:QQ_PARETE.options}
    ]
  },
  mobili:{
    esempio:"Esempio: devo montare un armadio a 3 ante, il mobile è già in casa...",
    domande:[
      {id:"tipo",label:"Cosa devi montare?",multi:true,options:["Armadio","Letto","Scaffali / librerie","Mobile bagno","Piccoli arredi","Altro"]},
      {id:"ante",label:"Quante ante ha l'armadio?",showIf:se("tipo","Armadio"),options:["2","3–4","5 o più"]},
      {id:"scorrevole",label:"Ante scorrevoli?",showIf:se("tipo","Armadio"),options:["Sì","No"]},
      {id:"quanti",label:"Quanti mobili in totale?",options:["1","2–3","Più di 3"]},
      {id:"incasa",label:"Il mobile è già in casa?",options:["Sì","No"]},
      {id:"fissaggio",label:"Va fissato a parete?",options:["Sì","No","Non lo so"]},
      {id:"smontaggio",label:"C'è un mobile vecchio da smontare?",options:["No","Sì"]}
    ]
  },
  porte:{
    esempio:"Esempio: la porta del bagno non chiude bene e la maniglia della cucina è allentata...",
    domande:[
      {id:"tipo",label:"Su cosa intervenire?",multi:true,options:["Porta interna","Porta d'ingresso","Finestra / portafinestra"]},
      {id:"porta",label:"Che problema ha la porta?",multi:true,showIf:se("tipo","Porta interna","Porta d'ingresso"),options:["Non chiude bene","Struscia / è storta","Maniglia","Cerniere","Fermo / accessori"]},
      {id:"finestra",label:"Che problema ha la finestra?",multi:true,showIf:se("tipo","Finestra / portafinestra"),options:["Non chiude bene","Maniglia","Spifferi","Cerniere"]},
      {id:"materiale",label:"Di che materiale è la finestra?",showIf:se("tipo","Finestra / portafinestra"),options:["Legno","PVC","Alluminio","Non lo so"]},
      {id:"quanti",label:"Quante porte o finestre?",options:["1","2–3","Più di 3"]},
      {id:"ricambi",label:"Hai già i ricambi (maniglie, cerniere…)?",showIf:se("porta","Maniglia","Cerniere"),options:QQ_MATERIALE}
    ]
  },
  smarthome:{
    esempio:"Esempio: vorrei comandare le luci del soggiorno dal telefono e con Alexa...",
    domande:[
      {id:"tipo",label:"Cosa vuoi rendere smart?",multi:true,options:["Luci","Prese","Tapparelle","Sensori","Termostato"],
        avvisi:{"Termostato":"Interveniamo sul termostato e sulla sua configurazione, non sulla caldaia."}},
      {id:"sistema",label:"Che sistema usi o preferisci?",options:["Alexa","Google","Apple Casa","Nessuno, consigliami"]},
      {id:"wifi",label:"Il Wi-Fi arriva bene in tutta la casa?",options:["Sì","No","Non lo so"]},
      {id:"luci",label:"Quanti punti luce o prese?",showIf:se("tipo","Luci","Prese"),options:["1–3","4–8","Più di 8"]},
      {id:"tapparelle",label:"Le tapparelle sono già motorizzate?",showIf:se("tipo","Tapparelle"),options:["Sì","No"]},
      {id:"sensori",label:"Che sensori?",multi:true,showIf:se("tipo","Sensori"),options:["Movimento","Apertura porte / finestre","Temperatura"]},
      {id:"dispositivi",label:"Hai già i dispositivi?",options:QQ_MATERIALE}
    ]
  },
  automazioni:{
    esempio:"Esempio: vorrei motorizzare 4 tapparelle e comandarle da un unico pulsante...",
    domande:[
      {id:"tipo",label:"Su cosa intervenire?",multi:true,options:["Tapparelle","Cancello","Porta garage / basculante"]},
      {id:"tapquante",label:"Quante tapparelle?",showIf:se("tipo","Tapparelle"),options:["1","Da 2 a 4","5 o più"]},
      {id:"tapstato",label:"Le tapparelle oggi sono",showIf:se("tipo","Tapparelle"),options:["Manuali, da motorizzare","Motorizzate, da riparare"]},
      {id:"tapproblema",label:"Cosa non va?",multi:true,showIf:se("tapstato","Motorizzate, da riparare"),options:["Non si muove","Si ferma a metà","Fa rumore","Pulsante rotto"]},
      {id:"cancellotipo",label:"Che cancello è?",showIf:se("tipo","Cancello"),options:["Scorrevole","A battente"]},
      {id:"cancellostato",label:"Il cancello oggi è",showIf:se("tipo","Cancello"),options:["Manuale, da motorizzare","Motorizzato, da riparare"]},
      {id:"garagetipo",label:"Che porta è?",showIf:se("tipo","Porta garage / basculante"),options:["Basculante","Sezionale","Altro"]},
      {id:"garagestato",label:"La porta oggi è",showIf:se("tipo","Porta garage / basculante"),options:["Manuale, da motorizzare","Motorizzata, da riparare"]},
      {id:"comando",label:"Come vuoi comandarli?",multi:true,showIf:se("tipo","Tapparelle","Cancello","Porta garage / basculante"),options:["Pulsante","Telecomando","Smartphone"]}
    ]
  },
  altro:{
    esempio:"Descrivici il lavoro: cosa ti serve, dove e ogni dettaglio utile...",
    domande:[
      {id:"tipo",label:"Di che tipo di lavoro si tratta?",multi:true,options:["Elettrico","Manutenzione","Montaggio","Più lavori insieme","Non lo so"]},
      {id:"sopralluogo",label:"Preferisci…",options:["Un sopralluogo","Prima sentirci al telefono"]}
    ]
  }
};

const QQ_ESEMPIO_BASE="Descrivi il lavoro: cosa ti serve, dove e ogni dettaglio utile...";
const qqRisposte={};
const qQuick=document.getElementById("qQuick");
const qDescrizioneEl=document.getElementById("qDescription");

function qqTutteDomande_(){
  const conf=QQ_SERVIZI[qService.value];
  return [...(conf?conf.domande:[]),...QQ_COMUNI];
}

function qqVisibile_(d){
  if(!d.showIf) return true;
  return (qqRisposte[d.showIf.id]||[]).some(v=>d.showIf.any.includes(v));
}

/* Rimuove a catena le risposte di domande che non sono più visibili */
function qqPulisci_(){
  let cambiato=true;
  while(cambiato){
    cambiato=false;
    qqTutteDomande_().forEach(d=>{
      if(qqRisposte[d.id]&&!qqVisibile_(d)){delete qqRisposte[d.id];cambiato=true;}
    });
  }
  const ids=qqTutteDomande_().map(d=>d.id);
  Object.keys(qqRisposte).forEach(k=>{if(!ids.includes(k))delete qqRisposte[k];});
}

function qqDomandeAttive_(){
  return qqTutteDomande_().filter(qqVisibile_);
}

function qqHaDipendenti_(id){
  return qqTutteDomande_().some(d=>d.showIf&&d.showIf.id===id);
}

function qqRender_(){
  if(!qQuick) return;
  const conf=QQ_SERVIZI[qService.value];
  if(qDescrizioneEl){
    qDescrizioneEl.placeholder=conf&&conf.esempio?conf.esempio:QQ_ESEMPIO_BASE;
  }
  qqPulisci_();

  qQuick.innerHTML="";
  const head=document.createElement("p");
  head.className="qqHead";
  head.textContent="Domande rapide";
  const hint=document.createElement("p");
  hint.className="qqHint";
  hint.textContent="Facoltative: tocca le risposte, ci aiutano a capire meglio il lavoro.";
  qQuick.append(head,hint);

  qqDomandeAttive_().forEach(d=>{
    const g=document.createElement("div");
    g.className="qqGroup"+(d.showIf?" qqSub":"");
    const lab=document.createElement("span");
    lab.className="qqLabel";
    lab.id="qq-"+d.id;
    lab.textContent=d.label;
    const chips=document.createElement("div");
    chips.className="qqChips";
    chips.setAttribute("role","group");
    chips.setAttribute("aria-labelledby",lab.id);

    d.options.forEach(opt=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="qqChip";
      b.textContent=opt;
      b.setAttribute("aria-pressed",(qqRisposte[d.id]||[]).includes(opt)?"true":"false");
      b.addEventListener("click",()=>{
        let attuali=qqRisposte[d.id]||[];
        if(attuali.includes(opt)){
          attuali=attuali.filter(x=>x!==opt);
        }else{
          attuali=d.multi?[...attuali,opt]:[opt];
        }
        if(attuali.length) qqRisposte[d.id]=attuali; else delete qqRisposte[d.id];

        if(qqHaDipendenti_(d.id)){
          const modal=qQuick.closest(".quoteModal");
          const y=modal?modal.scrollTop:null;
          qqRender_();
          if(modal&&y!=null) modal.scrollTop=y;
          return;
        }
        chips.querySelectorAll(".qqChip").forEach(c=>{
          c.setAttribute("aria-pressed",(qqRisposte[d.id]||[]).includes(c.textContent)?"true":"false");
        });
        qqAggiornaAvvisi_();
      });
      chips.appendChild(b);
    });

    g.append(lab,chips);
    if(d.avvisi){
      const avviso=document.createElement("div");
      avviso.className="qqWarning";
      avviso.dataset.domanda=d.id;
      avviso.hidden=true;
      avviso.setAttribute("role","alert");
      g.appendChild(avviso);
    }
    qQuick.appendChild(g);
  });

  qqAggiornaAvvisi_();
}

function qqAggiornaAvvisi_(){
  if(!qQuick) return;
  qQuick.querySelectorAll(".qqWarning").forEach(el=>{
    const d=qqTutteDomande_().find(x=>x.id===el.dataset.domanda);
    const testi=d?(qqRisposte[d.id]||[]).map(v=>d.avvisi[v]).filter(Boolean):[];
    el.innerHTML=testi.join("<br><br>");
    el.hidden=!testi.length;
  });
}

function qqTestoRisposte_(){
  const righe=[];
  qqDomandeAttive_().forEach(d=>{
    const scelte=qqRisposte[d.id];
    if(scelte&&scelte.length) righe.push(`${d.label.replace(/[?…]+$/,"")}: ${scelte.join(", ")}`);
  });
  return righe.join("\n");
}

/* Urgenza -> colonna Priorità del gestionale (valori: Bassa, Normale, Alta, Urgente) */
function qqPriorita_(){
  const u=(qqRisposte.urgenza||[])[0];
  if(u==="Urgente") return "Urgente";
  if(u==="Entro la settimana") return "Alta";
  return "Normale";
}

function qqIndirizzo_(){
  const comune=document.getElementById("qCity").value.trim();
  const via=document.getElementById("qStreet").value.trim();
  return via?`${via}, ${comune}`:comune;
}

qService.addEventListener("change",qqRender_);
quoteForm.addEventListener("reset",()=>{
  Object.keys(qqRisposte).forEach(k=>delete qqRisposte[k]);
  setTimeout(qqRender_,0);
});
qqRender_();
