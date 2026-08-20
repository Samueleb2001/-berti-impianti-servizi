console.log("BERTI frontend V14.6.6 TRACKING COMPLETO caricato");
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzonGHg5IvXsD1Mz2POPEBhWz6jjYFtc7p6dASn4mBCusEOfFdi58V7QZaqc3lMWcpu/exec";
const GA_MEASUREMENT_ID="G-1SSYRJTNKB";
const ANALYTICS_CONSENT_KEY="berti_analytics_consent_v1";
let analyticsLoaded=false;
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
  if(!gaIdConfigurato() || typeof window.gtag!=="function") return;

  window.gtag("consent","update",{
    analytics_storage:"granted",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied"
  });

  analyticsLoaded=true;
}
function getAnalyticsConsent(){try{return localStorage.getItem(ANALYTICS_CONSENT_KEY)||"";}catch(_){return "";}}
function setAnalyticsConsent(value){try{localStorage.setItem(ANALYTICS_CONSENT_KEY,value);}catch(_){}}
function initAnalyticsConsent(){const box=document.getElementById("analyticsConsent"),accept=document.getElementById("analyticsAccept"),reject=document.getElementById("analyticsReject");if(!box||!accept||!reject)return;const saved=getAnalyticsConsent();if(saved==="granted"){loadGoogleAnalytics();box.hidden=true;return;}if(saved==="denied"){box.hidden=true;return;}if(!gaIdConfigurato()){box.hidden=true;return;}box.hidden=false;accept.addEventListener("click",()=>{
  setAnalyticsConsent("granted");
  box.hidden=true;
  loadGoogleAnalytics();
  trackEvent("consenso_analytics_accettato",{});
});reject.addEventListener("click",()=>{setAnalyticsConsent("denied");box.hidden=true;});}

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
 image:"images/Impianti-elettrici.jpg.PNG"
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
 title:"RITOCCHI E FINITURE",
 short:"Piccoli ritocchi e sistemazioni estetiche dopo lavori e montaggi.",
 headline:"Il lavoro finisce quando è sistemato bene",
 text:"Piccoli interventi di finitura e ritocco per lasciare ordinata la zona interessata da montaggi o manutenzioni.",
 items:[
   "Ritocchi localizzati",
   "Piccole tinteggiature",
   "Sistemazione fori e segni superficiali",
   "Finiture dopo montaggi",
   "Piccole sigillature",
   "Sistemazioni estetiche"
 ],
 image:"images/Ritocchi.jpg.PNG?v=11-1"
},

 cartongesso:{
 icon:"▧",
 title:"CARTONGESSO E PICCOLI RIPRISTINI",
 short:"Piccoli lavori in cartongesso, chiusure, ripristini e finiture.",
 headline:"Soluzioni pratiche in cartongesso",
 text:"Realizzazione e sistemazione di piccoli elementi in cartongesso per la casa, con particolare attenzione a ripristini, finiture e integrazione con altri interventi.",
 items:[
   "Piccole pareti e contropareti",
   "Velette e piccoli elementi",
   "Chiusura di vani e aperture",
   "Ripristini dopo lavori e impianti",
   "Stuccatura e sistemazione giunti",
   "Piccole riparazioni su cartongesso"
 ],
 image:"images/Cartongesso.jpg.PNG"
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
   "Termostati e dispositivi connessi",
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

let currentService="elettrico";
const grid=document.getElementById("serviceGrid");
const graphic=document.getElementById("serviceGraphic");
const quoteModal=document.getElementById("quoteModal");
const quoteForm=document.getElementById("quoteForm");
const qService=document.getElementById("qService");
let quoteFormStartedAt=Date.now();

Object.entries(services)
 .filter(([,s])=>s.active!==false)
 .forEach(([key,s],i)=>{
   const b=document.createElement("button");
   b.className="card"+(i===0?" active":""); b.dataset.key=key;
   b.innerHTML=`<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.short}</p>`;
   b.onclick=()=>{
     trackEvent("servizio_aperto",{servizio:s.title});
     selectService(key,true);
   };
   grid.appendChild(b);
   const opt=document.createElement("option"); opt.value=key; opt.textContent=s.title; qService.appendChild(opt);
 });

function waUrl(){
 const s=services[currentService];
 const text=`Salve, vorrei richiedere un preventivo a BERTI Impianti & Servizi.

Servizio: ${s.title}
Nome:
Comune dell'intervento:
Descrizione del lavoro:
Giorno/orario preferito per essere ricontattato:`;
 return "https://wa.me/393703173136?text="+encodeURIComponent(text);
}

function updateWhatsAppLinks(){
 document.querySelectorAll(".js-wa-link").forEach(a=>a.href=waUrl());
}

function selectService(key,scroll=false){
 const s=services[key];
 if(!s || s.active===false) return;
 currentService=key;
 graphic.classList.add("fading");
 setTimeout(()=>{graphic.src=s.image;graphic.alt=s.title+" - BERTI Impianti & Servizi";graphic.onload=()=>graphic.classList.remove("fading");},120);
 document.getElementById("detailLabel").textContent=s.title;
 document.getElementById("detailTitle").textContent=s.headline;
 document.getElementById("detailText").textContent=s.text;
 document.getElementById("detailList").innerHTML=s.items.map(x=>`<li>${x}</li>`).join("");
 document.querySelectorAll(".card").forEach(x=>x.classList.toggle("active",x.dataset.key===key));
 qService.value=key; updateWhatsAppLinks();
 if(scroll)document.getElementById("dettaglio").scrollIntoView({behavior:"smooth",block:"start"});
}

function openQuote(){
 quoteFormStartedAt=Date.now();
 trackEvent("preventivo_aperto",{servizio:services[currentService]?.title||""});
 document.getElementById("qWebsite").value="";
 qService.value=currentService;
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
  const timeoutMs=15000;
  const intervalloMs=800;
  const iniziato=Date.now();

  while(Date.now()-iniziato<timeoutMs){
    try{
      const data=await leggiStatoRichiesta_(jobId);

      if(data && data.status==="confirmed"){
        return data;
      }

      if(data && data.status==="error"){
        throw new Error(
          data.error || "Registrazione non riuscita."
        );
      }

    }catch(err){
      if(
        err &&
        err.message==="Registrazione non riuscita."
      ){
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

 const payload={
   priority:"Normale",
   name:document.getElementById("qName").value.trim(),
   surname:document.getElementById("qSurname").value.trim(),
   email:document.getElementById("qEmail").value.trim(),
   phone:document.getElementById("qPhone").value.trim(),
   address:document.getElementById("qAddress").value.trim(),
   service:s.title,
   message:document.getElementById("qDescription").value.trim(),
   website:document.getElementById("qWebsite").value.trim(),
   formStartedAt:quoteFormStartedAt,
   submissionId:(window.crypto&&crypto.randomUUID)?crypto.randomUUID():`${now}-${Math.random().toString(36).slice(2)}`,
   jobId:jobId,
   clientVersion:"14.6.6"
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

     if(elapsed<900){
  setProgress(Math.min(35,pct+9),"Invio richiesta…");

   }else if(elapsed<2000){
  setProgress(Math.min(68,pct+7),"Registrazione richiesta…");

   }else if(elapsed<3200){
  setProgress(Math.min(76,pct+2),"Preparazione pratica…");

   }else if(elapsed<5000){
  setProgress(Math.min(84,pct+1),"Elaborazione richiesta…");

   }else if(elapsed<8000){
  setProgress(Math.min(91,pct+.55),"Verifica registrazione…");

    }else{
  setProgress(
    Math.min(99,pct+Math.max(.05,(99-pct)*.04)),
    "Completamento in corso…"
  );
}
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
  formStatus.textContent=
    "Invio non riuscito. Riprova oppure contattaci su WhatsApp.";

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
function isCallOpen(){const now=new Date();const mins=now.getHours()*60+now.getMinutes();return mins>=420&&mins<1350;}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
function updateCallState(){
 const open=isCallOpen(),notice=document.getElementById("hoursNotice");
 document.querySelectorAll(".call-link").forEach(link=>{
  link.classList.toggle("disabledCall",!open);link.setAttribute("aria-disabled",String(!open));
  if(!open){if(!link.dataset.realHref)link.dataset.realHref=link.getAttribute("href")||"tel:+393703173136";link.setAttribute("href","#");}
  else link.setAttribute("href",link.dataset.realHref||"tel:+393703173136");
 });
 notice.textContent=open?"Chiamate disponibili ora, fino alle 22:30.":"Chiamate non disponibili in questo orario. Puoi scriverci su WhatsApp o compilare il preventivo: rispondiamo dalle 07:00.";
}
document.addEventListener("click",e=>{const link=e.target.closest(".call-link.disabledCall");if(link){e.preventDefault();showToast("Chiamate disponibili dalle 07:00 alle 22:30. Puoi scriverci su WhatsApp.");}});
document.addEventListener("click",e=>{
  const call=e.target.closest(".call-link:not(.disabledCall)");
  if(call){
    e.preventDefault();
    const href=call.dataset.realHref||call.getAttribute("href")||"tel:+393703173136";
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
      tipo:"pec"
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

initAnalyticsConsent();
inizializzaTrackingSezioni_();
selectService("elettrico");updateWhatsAppLinks();updateCallState();setInterval(updateCallState,60000);
