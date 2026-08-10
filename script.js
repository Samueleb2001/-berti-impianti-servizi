const services = {
  elettrico:{icon:"⚡",title:"IMPIANTI ELETTRICI",short:"Realizzazione, modifiche, adeguamenti e manutenzione.",headline:"Impianti elettrici e interventi su misura",text:"Interventi elettrici per abitazioni e altri ambienti, dalla piccola modifica alla manutenzione dell'impianto.",items:["Prese e punti luce","Modifiche e ampliamenti","Quadri e protezioni","Manutenzione e verifiche"],bg:"linear-gradient(120deg,#05080c,#17202a 55%,#55420a)"},
  illuminazione:{icon:"💡",title:"ILLUMINAZIONE",short:"Lampade, faretti, plafoniere, LED e illuminazione esterna.",headline:"La luce giusta cambia ogni ambiente",text:"Installazione e sostituzione di sistemi di illuminazione per interni ed esterni, con attenzione a funzionalità e resa.",items:["Plafoniere e lampadari","Faretti e strisce LED","Illuminazione esterna","Sensori e crepuscolari"],bg:"linear-gradient(120deg,#090b10,#20222a 55%,#8a6410)"},
  guasti:{icon:"🔎",title:"RICERCA E RIPARAZIONE GUASTI",short:"Individuazione e risoluzione di anomalie elettriche.",headline:"Troviamo il problema, poi lo risolviamo",text:"Ricerca mirata dei guasti per individuare anomalie e ripristinare il corretto funzionamento dell'impianto.",items:["Scatti del differenziale","Prese e linee non funzionanti","Problemi di illuminazione","Controlli e diagnosi"],bg:"linear-gradient(120deg,#05080c,#182733 55%,#305269)"},
  idraulica:{icon:"💧",title:"PICCOLI INTERVENTI IDRAULICI",short:"Sostituzioni e piccole riparazioni domestiche.",headline:"Piccoli interventi idraulici",text:"Interventi pratici per le necessità quotidiane della casa quando non serve un'opera idraulica complessa.",items:["Rubinetteria","Sifoni e scarichi semplici","Piccole perdite","Sostituzione accessori"],bg:"linear-gradient(120deg,#05080c,#132735 55%,#14577a)"},
  manutenzioni:{icon:"🏠",title:"MANUTENZIONI DOMESTICHE",short:"Interventi e riparazioni per interni ed esterni.",headline:"Una soluzione per le manutenzioni di casa",text:"Un unico riferimento per tanti piccoli e medi interventi domestici, con valutazione preventiva del lavoro.",items:["Riparazioni varie","Fissaggi e regolazioni","Manutenzione interni","Manutenzione esterni"],bg:"linear-gradient(120deg,#05080c,#25231e 55%,#65512d)"},
  montaggi:{icon:"🛠️",title:"MONTAGGI E RIPARAZIONI",short:"Mensole, accessori, tende, quadri e piccoli montaggi.",headline:"Montaggi precisi, senza improvvisare",text:"Installazione, fissaggio e montaggio di elementi e accessori con attenzione alle superfici e alla sicurezza.",items:["Mensole e accessori","Tende e supporti","Quadri e specchi","Piccoli montaggi"],bg:"linear-gradient(120deg,#05080c,#25282d 55%,#5b4520)"},
  mobili:{icon:"🪛",title:"MONTAGGIO MOBILI",short:"Montaggio e assemblaggio di mobili e complementi.",headline:"Montaggio mobili a domicilio",text:"Assemblaggio e montaggio di mobili e complementi, con verifica degli ingombri e del corretto posizionamento.",items:["Mobili in kit","Piccoli arredi","Fissaggi a parete quando necessari","Regolazioni finali"],bg:"linear-gradient(120deg,#05080c,#29231e 55%,#6b4d2b)"},
  trasporto:{icon:"📦",title:"TRASPORTO OGGETTI",short:"Supporto per il trasporto di oggetti e piccoli carichi.",headline:"Hai qualcosa da spostare?",text:"Supporto per trasporto e movimentazione di oggetti, valutando insieme dimensioni, distanza e modalità dell'intervento.",items:["Piccoli trasporti","Movimentazione oggetti","Ritiro e consegna da concordare","Valutazione preventiva"],bg:"linear-gradient(120deg,#05080c,#20242a 55%,#49596a)"},
  automazioni:{icon:"▤",title:"TAPPARELLE E AUTOMAZIONI",short:"Riparazioni, motorizzazioni e piccole automazioni.",headline:"Più comodità con le automazioni",text:"Interventi su tapparelle e automazioni domestiche, dalla manutenzione alla motorizzazione.",items:["Tapparelle","Motorizzazioni","Comandi e pulsanti","Piccole automazioni"],bg:"linear-gradient(120deg,#05080c,#20252b 55%,#4c5661)"},
  altro:{icon:"•••",title:"ALTRI SERVIZI",short:"Hai bisogno di altro? Raccontaci il lavoro.",headline:"Hai un lavoro particolare?",text:"Descrivici cosa ti serve e valutiamo insieme se possiamo occuparcene e quale intervento è più adatto.",items:["Sopralluoghi","Valutazione intervento","Lavori personalizzati","Preventivo gratuito"],bg:"linear-gradient(120deg,#05080c,#222831 55%,#574a20)"}
};

const grid=document.getElementById("serviceGrid");
Object.entries(services).forEach(([key,s],i)=>{
 const b=document.createElement("button");
 b.className="card"+(i===0?" active":"");
 b.dataset.key=key;
 b.innerHTML=`<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.short}</p>`;
 b.onclick=()=>selectService(key,true);
 grid.appendChild(b);
});

function selectService(key,scroll=false){
 const s=services[key];
 document.getElementById("hero").style.background=s.bg;
 document.getElementById("eyebrow").textContent=s.title;
 document.getElementById("heroTitle").innerHTML=`${s.headline.toUpperCase()}<br><em>BERTI.</em>`;
 document.getElementById("heroText").textContent=s.text;
 document.getElementById("detailLabel").textContent=s.title;
 document.getElementById("detailTitle").textContent=s.headline;
 document.getElementById("detailText").textContent=s.text;
 document.getElementById("detailIcon").textContent=s.icon;
 document.getElementById("detailVisual").style.background=s.bg;
 document.getElementById("detailList").innerHTML=s.items.map(x=>`<li>${x}</li>`).join("");
 document.querySelectorAll(".card").forEach(x=>x.classList.toggle("active",x.dataset.key===key));
 if(scroll) document.getElementById("dettaglio").scrollIntoView({behavior:"smooth",block:"start"});
}

function isCallOpen(){
 const now=new Date();
 const mins=now.getHours()*60+now.getMinutes();
 return mins>=7*60 && mins<22*60+30;
}

function showToast(msg){
 const t=document.getElementById("toast");
 t.textContent=msg;
 t.classList.add("show");
 clearTimeout(window.toastTimer);
 window.toastTimer=setTimeout(()=>t.classList.remove("show"),2800);
}

function updateCallState(){
 const open=isCallOpen();
 const notice=document.getElementById("hoursNotice");
 document.querySelectorAll(".call-link").forEach(link=>{
   link.classList.toggle("disabledCall",!open);
   link.setAttribute("aria-disabled",String(!open));
   if(!open){
     link.dataset.realHref=link.getAttribute("href") || "tel:+393703173136";
     link.setAttribute("href","#");
   } else {
     link.setAttribute("href", link.dataset.realHref || "tel:+393703173136");
   }
 });
 notice.textContent=open
  ? "Chiamate disponibili ora, fino alle 22:30."
  : "Chiamate non disponibili in questo orario. Puoi scriverci su WhatsApp o via email: rispondiamo dalle 07:00.";
}

document.addEventListener("click",e=>{
 const link=e.target.closest(".call-link.disabledCall");
 if(link){
   e.preventDefault();
   showToast("Chiamate disponibili dalle 07:00 alle 22:30. Puoi scriverci su WhatsApp.");
 }
});

selectService("elettrico");
updateCallState();
setInterval(updateCallState,60000);
