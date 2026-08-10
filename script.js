const services = {
  elettrico:{icon:"⚡",title:"IMPIANTI ELETTRICI",short:"Realizzazione, modifiche, adeguamenti e manutenzione.",headline:"Impianti elettrici e interventi su misura",text:"Dalla piccola modifica alla manutenzione dell'impianto: soluzioni ordinate e pensate per le esigenze dell'abitazione.",items:["Prese e punti luce","Modifiche e ampliamenti","Quadri e protezioni","Manutenzione e verifiche"],bg:"linear-gradient(120deg,#05080c,#17202a 55%,#55420a)"},
  illuminazione:{icon:"💡",title:"ILLUMINAZIONE",short:"Lampade, faretti, plafoniere, LED e illuminazione esterna.",headline:"La luce giusta cambia ogni ambiente",text:"Installazione e sostituzione di sistemi di illuminazione per interni ed esterni, con attenzione a funzionalità, resa e pulizia del lavoro.",items:["Plafoniere e lampadari","Faretti e strisce LED","Illuminazione esterna","Sensori e crepuscolari"],bg:"linear-gradient(120deg,#090b10,#20222a 55%,#8a6410)"},
  guasti:{icon:"🔎",title:"RICERCA E RIPARAZIONE GUASTI",short:"Individuazione e risoluzione di anomalie elettriche.",headline:"Troviamo il problema, poi lo risolviamo",text:"Ricerca mirata dei guasti per evitare tentativi inutili e ripristinare il corretto funzionamento dell'impianto.",items:["Scatti del differenziale","Prese e linee non funzionanti","Problemi di illuminazione","Controlli e diagnosi"],bg:"linear-gradient(120deg,#05080c,#182733 55%,#305269)"},
  idraulica:{icon:"💧",title:"PICCOLI INTERVENTI IDRAULICI",short:"Sostituzioni e piccole riparazioni domestiche.",headline:"Piccoli interventi idraulici",text:"Interventi pratici per le necessità quotidiane della casa, quando non serve un'opera idraulica complessa.",items:["Rubinetteria","Sifoni e scarichi semplici","Piccole perdite","Sostituzioni accessori"],bg:"linear-gradient(120deg,#05080c,#132735 55%,#14577a)"},
  manutenzioni:{icon:"🏠",title:"MANUTENZIONI DOMESTICHE",short:"Interventi e riparazioni per interni ed esterni.",headline:"Una soluzione per le manutenzioni di casa",text:"Una sola figura di riferimento per tanti piccoli e medi interventi domestici.",items:["Riparazioni varie","Fissaggi e regolazioni","Manutenzione interni","Manutenzione esterni"],bg:"linear-gradient(120deg,#05080c,#25231e 55%,#65512d)"},
  montaggi:{icon:"🛠️",title:"MONTAGGI E RIPARAZIONI",short:"Mensole, accessori, tende, quadri e molto altro.",headline:"Montaggi precisi, senza improvvisare",text:"Installazione e fissaggio di elementi e accessori con strumenti adatti e attenzione alle superfici.",items:["Mensole e accessori","Tende e supporti","Quadri e specchi","Piccoli montaggi"],bg:"linear-gradient(120deg,#05080c,#25282d 55%,#5b4520)"},
  automazioni:{icon:"▤",title:"TAPPARELLE E AUTOMAZIONI",short:"Riparazioni, motorizzazioni e automazioni.",headline:"Più comodità con le automazioni",text:"Interventi su tapparelle e automazioni domestiche, dalla manutenzione alla motorizzazione.",items:["Tapparelle","Motorizzazioni","Comandi e pulsanti","Piccole automazioni"],bg:"linear-gradient(120deg,#05080c,#20252b 55%,#4c5661)"},
  altro:{icon:"•••",title:"ALTRI SERVIZI",short:"Hai bisogno di altro? Raccontaci il lavoro.",headline:"Hai un lavoro particolare?",text:"Descrivici cosa ti serve e valutiamo insieme l'intervento più adatto.",items:["Sopralluoghi","Valutazione intervento","Lavori personalizzati","Preventivo"],bg:"linear-gradient(120deg,#05080c,#222831 55%,#574a20)"}
};
const grid=document.getElementById("serviceGrid");
Object.entries(services).forEach(([key,s],i)=>{
 const b=document.createElement("button"); b.className="card"+(i===0?" active":""); b.dataset.key=key;
 b.innerHTML=`<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.short}</p>`;
 b.onclick=()=>selectService(key,true); grid.appendChild(b);
});
function selectService(key,scroll=false){
 const s=services[key];
 document.getElementById("hero").style.background=s.bg;
 document.getElementById("eyebrow").textContent=s.title;
 document.getElementById("heroTitle").innerHTML=`${s.headline.toUpperCase().replace(" ","<br>")}<br><em>BERTI.</em>`;
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
selectService("elettrico");