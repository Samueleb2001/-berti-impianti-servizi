/* =========================================================
   TEMA NATALIZIO: neve leggera + lucine sotto la barra in alto.
   Si accende da solo nel periodo scritto in assenze.js (BERTI_NATALE).
   Non parte se il telefono/computer chiede "riduci movimento".
   ========================================================= */
(function(){
  const cfg=window.BERTI_NATALE;
  const RE=/^\d{4}-\d{2}-\d{2}$/;
  if(!cfg||!RE.test(String(cfg.dal))||!RE.test(String(cfg.al))) return;

  let oggi="";
  try{
    const p={};
    new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"})
      .formatToParts(new Date()).forEach(x=>{p[x.type]=x.value;});
    oggi=p.year+"-"+p.month+"-"+p.day;
  }catch(e){
    const d=new Date(),z=n=>String(n).padStart(2,"0");
    oggi=d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
  }
  if(oggi<cfg.dal||oggi>cfg.al) return;

  document.documentElement.classList.add("natale");

  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function avvia(){
    const c=document.createElement("canvas");
    c.className="neveCanvas";
    c.setAttribute("aria-hidden","true");
    document.body.appendChild(c);
    const ctx=c.getContext("2d");
    let W=0,H=0,dpr=1,fiocchi=[];

    function nuovo(inizio){
      return {x:Math.random()*W,y:inizio?Math.random()*H:-10,r:1+Math.random()*2.6,
              v:.35+Math.random()*.9,o:Math.random()*Math.PI*2,a:.5+Math.random()*.45};
    }
    function misura(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      W=window.innerWidth;H=window.innerHeight;
      c.width=W*dpr;c.height=H*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const n=Math.round(Math.min(80,Math.max(25,W/14)));
      while(fiocchi.length<n) fiocchi.push(nuovo(true));
      fiocchi.length=n;
    }
    function disegna(){
      ctx.clearRect(0,0,W,H);
      for(const f of fiocchi){
        f.y+=f.v; f.o+=.012; f.x+=Math.sin(f.o)*.35;
        if(f.y>H+10){Object.assign(f,nuovo(false));}
        ctx.globalAlpha=f.a;
        ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle="#ffffff";ctx.fill();
        ctx.globalAlpha=f.a*.35;ctx.strokeStyle="#9fb3c8";ctx.lineWidth=.6;ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
    let id=0;
    function ciclo(){disegna();id=requestAnimationFrame(ciclo);}
    misura();ciclo();
    window.addEventListener("resize",misura);
    document.addEventListener("visibilitychange",()=>{
      if(document.hidden){cancelAnimationFrame(id);}else{ciclo();}
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",avvia); else avvia();
})();
