console.log("BERTI frontend V13.2 caricato");
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzonGHg5IvXsD1Mz2POPEBhWz6jjYFtc7p6dASn4mBCusEOfFdi58V7QZaqc3lMWcpu/exec";
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
 image:"images/TV-staffe-multimedia.jpg.PNG?v=11-1"
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
 title:"PICCOLI INTERVENTI IDRAULICI",
 short:"Sostituzioni e piccole riparazioni domestiche.",
 headline:"Piccoli interventi idraulici",
 text:"Interventi pratici per le necessità quotidiane della casa quando non serve un'opera idraulica complessa.",
 items:[
   "Rubinetteria",
   "Sifoni e scarichi semplici",
   "Piccole perdite",
   "Flessibili e accessori",
   "Accessori bagno",
   "Piccoli interventi su sanitari"
 ],
 image:"images/Idraulica.jpg.PNG"
},

manutenzioni:{
 icon:"🏠",
 title:"MANUTENZIONI DOMESTICHE",
 short:"Interventi e riparazioni per interni ed esterni.",
 headline:"Una soluzione per le manutenzioni di casa",
 text:"Un unico riferimento per tanti piccoli e medi interventi domestici, con valutazione preventiva del lavoro.",
 items:[
   "Riparazioni varie",
   "Fissaggi e regolazioni",
   "Manutenzione interni",
   "Manutenzione esterni",
   "Sistemazioni dopo montaggi",
   "Interventi personalizzati"
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
 image:"images/Manutenzioni-domestiche.jpg.PNG"
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

trasporto:{
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

Object.entries(services).forEach(([key,s],i)=>{
 const b=document.createElement("button");
 b.className="card"+(i===0?" active":""); b.dataset.key=key;
 b.innerHTML=`<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.short}</p>`;
 b.onclick=()=>selectService(key,true); grid.appendChild(b);
 const opt=document.createElement("option"); opt.value=key; opt.textContent=s.title; qService.appendChild(opt);
});

function waUrl(){
 const s=services[currentService];
 const text=`Buongiorno, vorrei richiedere un preventivo a BERTI Impianti & Servizi.

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
 currentService=key; const s=services[key];
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
 document.getElementById("qWebsite").value="";
 qService.value=currentService;
 quoteModal.classList.add("show"); quoteModal.setAttribute("aria-hidden","false");
 setTimeout(()=>document.getElementById("qName").focus(),100);
}
function closeQuote(){quoteModal.classList.remove("show");quoteModal.setAttribute("aria-hidden","true");}
document.querySelectorAll(".quote-open").forEach(b=>b.addEventListener("click",openQuote));
document.getElementById("modalClose").addEventListener("click",closeQuote);
quoteModal.addEventListener("click",e=>{if(e.target===quoteModal)closeQuote();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeQuote();});

quoteForm.addEventListener("submit",async e=>{
 e.preventDefault();

 const submitBtn=quoteForm.querySelector(".sendQuote");
 const formStatus=document.getElementById("formStatus");
 const s=services[qService.value];
 const now=Date.now();

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
   clientVersion:"13"
 };

 submitBtn.disabled=true;
 submitBtn.textContent="INVIO IN CORSO...";
 formStatus.className="formStatus";
 formStatus.textContent="";

 try{
   await fetch(APPS_SCRIPT_URL,{
     method:"POST",
     mode:"no-cors",
     headers:{"Content-Type":"text/plain;charset=utf-8"},
     body:JSON.stringify(payload),
     cache:"no-store",
     referrerPolicy:"strict-origin-when-cross-origin"
   });

   formStatus.className="formStatus success";
   formStatus.textContent="Richiesta inviata. Se i dati sono corretti, verrà registrata automaticamente nel sistema BERTI.";
   quoteForm.reset();
   qService.value=currentService;
   quoteFormStartedAt=Date.now();
   setTimeout(closeQuote,2600);

 }catch(err){
   console.error(err);
   formStatus.className="formStatus error";
   formStatus.textContent="Invio non riuscito. Riprova tra poco oppure contattaci su WhatsApp.";
 }finally{
   submitBtn.disabled=false;
   submitBtn.textContent="INVIA RICHIESTA";
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
selectService("elettrico");updateWhatsAppLinks();updateCallState();setInterval(updateCallState,60000);
