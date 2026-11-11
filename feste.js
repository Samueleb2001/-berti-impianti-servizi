/* =========================================================
   EFFETTI DELLE FESTE — si accendono da soli ogni anno.
   Natale (1/12–5/1): neve, lucine, cursore a bastoncino
   Capodanno (31/12–1/1): fuochi d'artificio
   Befana (6/1): caramelle e carbone
   San Valentino (14/2): cuoricini
   Carnevale (giovedì grasso–martedì grasso): coriandoli
   Pasqua e Pasquetta: ovetti
   Festa della Repubblica (2/6): bandierine che oscillano scorrendo
   Halloween (31/10): pipistrelli e zucche; da computer il cursore è un ragnetto che dondola
   Fuori da questi giorni il file si ferma subito e non fa nulla.
   Per spegnere tutto: window.BERTI_FESTE = false in assenze.js.
   Per provare un effetto: aggiungi ?festa=halloween (o un altro nome) all'indirizzo.
   ========================================================= */
(function(){
  if(window.BERTI_FESTE===false) return;

  const NOMI=["natale","capodanno","befana","sanvalentino","carnevale","pasqua","repubblica","halloween"];

  function oggiRoma(){
    try{
      const p={};
      new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"})
        .formatToParts(new Date()).forEach(x=>{p[x.type]=x.value;});
      return [+p.year,+p.month,+p.day];
    }catch(e){
      const d=new Date();
      return [d.getFullYear(),d.getMonth()+1,d.getDate()];
    }
  }

  /* Data di Pasqua (calendario gregoriano) */
  function pasqua(y){
    const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),
      g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,
      l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
      mese=Math.floor((h+l-7*m+114)/31),giorno=((h+l-7*m+114)%31)+1;
    return Date.UTC(y,mese-1,giorno);
  }

  function quale(y,m,d){
    const md=m*100+d;
    if(md===1231||md===101) return "capodanno";
    if(md===106) return "befana";
    if(md>=1201||md<=105) return "natale";
    if(md===214) return "sanvalentino";
    const dd=Math.round((Date.UTC(y,m-1,d)-pasqua(y))/864e5);
    if(dd>=-52&&dd<=-47) return "carnevale";
    if(dd===0||dd===1) return "pasqua";
    if(md===602) return "repubblica";
    if(md===1031) return "halloween";
    return "";
  }

  let festa="";
  try{
    const q=new URLSearchParams(location.search).get("festa");
    if(q&&NOMI.indexOf(q)>=0) festa=q;
  }catch(e){}
  if(!festa){const o=oggiRoma();festa=quale(o[0],o[1],o[2]);}
  if(!festa) return;

  const root=document.documentElement;
  root.classList.add("festa-"+festa);
  if(festa==="natale"||festa==="capodanno"||festa==="befana") root.classList.add("natale");

  const piano=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const S=piano?.45:1;
  const R=Math.random;
  const pick=a=>a[Math.floor(R()*a.length)];

  /* ---------- oggetti che cadono (motore comune) ---------- */
  function cadenti(o){
    let ps=[];
    return {
      misura(W,H){
        const n=Math.round(o.n(W)*(piano?.5:1));
        while(ps.length<n) ps.push(o.nuovo(W,H,true));
        ps.length=n;
      },
      frame(ctx,W,H){
        for(const p of ps){
          if(o.muovi) o.muovi(p,W,H); else {p.y+=p.v; p.o+=.012; p.x+=Math.sin(p.o)*(p.dx||.35); p.rot+=p.vr||0;}
          if(p.y>H+30||p.x<-80||p.x>W+80) Object.assign(p,o.nuovo(W,H,false));
          o.disegna(ctx,p);
        }
        ctx.globalAlpha=1;
        return true;
      }
    };
  }

  function cuore(ctx,s){
    ctx.beginPath();
    ctx.moveTo(0,.6*s);
    ctx.bezierCurveTo(-.2*s,.4*s,-.65*s,.1*s,-.65*s,-.25*s);
    ctx.bezierCurveTo(-.65*s,-.6*s,-.2*s,-.7*s,0,-.38*s);
    ctx.bezierCurveTo(.2*s,-.7*s,.65*s,-.6*s,.65*s,-.25*s);
    ctx.bezierCurveTo(.65*s,.1*s,.2*s,.4*s,0,.6*s);
    ctx.fill();
  }

  /* ---------- Halloween: ragnetto al posto del cursore, dondola col mouse (solo computer) ---------- */
  function conRagno(base){
    const ok=!piano&&!!(window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    if(!ok) return base;
    let mx=0,my=0,vis=false,th=0,om=0,lx=null,lvx=0;
    const L=26;
    document.addEventListener("pointermove",e=>{
      if(e.pointerType&&e.pointerType!=="mouse") return;
      mx=e.clientX;my=e.clientY;
      const t=e.target;
      vis=!(t&&t.closest&&t.closest('input:not([type="checkbox"]):not([type="radio"]),textarea'));
      if(!root.classList.contains("ragnoVivo")) root.classList.add("ragnoVivo");
    },{passive:true});
    document.addEventListener("mouseout",e=>{if(!e.relatedTarget) vis=false;});
    window.addEventListener("blur",()=>{vis=false;});
    function zampe(ctx){
      for(const s of [-1,1]){
        ctx.moveTo(s*2,5);ctx.quadraticCurveTo(s*7,1,s*10,4);
        ctx.moveTo(s*2.5,7);ctx.quadraticCurveTo(s*8,6,s*10,10);
        ctx.moveTo(s*2.5,9);ctx.quadraticCurveTo(s*7,11,s*8,16);
        ctx.moveTo(s*2,10.5);ctx.quadraticCurveTo(s*5,13,s*5,18);
      }
    }
    return {
      misura:base.misura,
      frame(ctx,W,H,t){
        base.frame(ctx,W,H,t);
        if(lx===null) lx=mx;
        const vx=mx-lx,ax=vx-lvx;lx=mx;lvx=vx;
        om+=-.045*Math.sin(th)-Math.max(-30,Math.min(30,ax))*.012*Math.cos(th);
        om*=.95;th+=om;
        if(th>1.3)th=1.3;if(th<-1.3)th=-1.3;
        if(!vis) return true;
        const bx=mx+L*Math.sin(th),by=my+L*Math.cos(th);
        ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
        ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(bx,by);ctx.stroke();
        ctx.strokeStyle="#7d8692";ctx.lineWidth=1.1;
        ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(bx,by);ctx.stroke();
        ctx.translate(bx,by);ctx.rotate(-th);
        ctx.strokeStyle="#ffffff";ctx.lineWidth=4;ctx.beginPath();zampe(ctx);ctx.stroke();
        ctx.beginPath();ctx.arc(0,2.5,4.4,0,6.283);ctx.ellipse(0,10.5,6.4,6.9,0,0,6.283);ctx.fillStyle="#ffffff";ctx.fill();
        ctx.strokeStyle="#15171c";ctx.lineWidth=1.6;ctx.beginPath();zampe(ctx);ctx.stroke();
        ctx.fillStyle="#15171c";
        ctx.beginPath();ctx.arc(0,2.5,3,0,6.283);ctx.fill();
        ctx.beginPath();ctx.ellipse(0,10.5,5,5.5,0,0,6.283);ctx.fill();
        ctx.fillStyle="#ffffff";
        ctx.beginPath();ctx.arc(-1.2,2.4,1.1,0,6.283);ctx.arc(1.2,2.4,1.1,0,6.283);ctx.fill();
        ctx.fillStyle="#15171c";
        ctx.beginPath();ctx.arc(-1.2,2.9,.5,0,6.283);ctx.arc(1.2,2.9,.5,0,6.283);ctx.fill();
        ctx.strokeStyle="#f08a12";ctx.lineWidth=1.3;
        ctx.beginPath();ctx.moveTo(-1.6,8);ctx.lineTo(1.6,9.5);ctx.lineTo(-1.6,11);ctx.lineTo(1.6,12.5);ctx.stroke();
        ctx.restore();
        return true;
      }
    };
  }

  const EFFETTI={
    natale:()=>cadenti({
      n:W=>Math.min(80,Math.max(25,W/14)),
      nuovo:(W,H,i)=>({x:R()*W,y:i?R()*H:-10,r:1+R()*2.6,v:(.35+R()*.9)*S,o:R()*6.3,a:.5+R()*.45,rot:0}),
      disegna(ctx,f){
        ctx.globalAlpha=f.a;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.283);
        ctx.fillStyle="#ffffff";ctx.fill();
        ctx.globalAlpha=f.a*.35;ctx.strokeStyle="#9fb3c8";ctx.lineWidth=.6;ctx.stroke();
      }
    }),

    befana:()=>cadenti({
      n:W=>Math.min(30,Math.max(12,W/40)),
      nuovo:(W,H,i)=>({x:R()*W,y:i?R()*H:-20,s:7+R()*5,v:(.5+R()*.8)*S,o:R()*6.3,dx:.4,rot:R()*6.3,
        vr:(R()-.5)*.04*S,carbone:R()<.25,col:pick(["#e11d2e","#f5b900","#2e9e4f","#1e88e5","#d81b60"])}),
      disegna(ctx,p){
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
        if(p.carbone){
          const s=p.s*.7;ctx.fillStyle="#26282c";ctx.beginPath();
          ctx.moveTo(-s,-.3*s);ctx.lineTo(-.4*s,-s*.8);ctx.lineTo(.5*s,-.7*s);ctx.lineTo(s,0);
          ctx.lineTo(.5*s,.8*s);ctx.lineTo(-.6*s,.7*s);ctx.closePath();ctx.fill();
          ctx.fillStyle="#55595f";ctx.beginPath();ctx.moveTo(-.4*s,-.5*s);ctx.lineTo(.3*s,-.5*s);ctx.lineTo(0,-.1*s);ctx.fill();
        }else{
          const s=p.s;ctx.fillStyle=p.col;
          ctx.beginPath();ctx.moveTo(-.6*s,0);ctx.lineTo(-1.15*s,-.45*s);ctx.lineTo(-1.15*s,.45*s);ctx.fill();
          ctx.beginPath();ctx.moveTo(.6*s,0);ctx.lineTo(1.15*s,-.45*s);ctx.lineTo(1.15*s,.45*s);ctx.fill();
          ctx.beginPath();ctx.ellipse(0,0,.7*s,.45*s,0,0,6.283);ctx.fill();
          ctx.strokeStyle="rgba(255,255,255,.85)";ctx.lineWidth=s*.16;
          ctx.beginPath();ctx.moveTo(-.25*s,-.4*s);ctx.lineTo(.05*s,.4*s);ctx.moveTo(.2*s,-.38*s);ctx.lineTo(.45*s,.3*s);ctx.stroke();
        }
        ctx.restore();
      }
    }),

    sanvalentino:()=>cadenti({
      n:W=>Math.min(22,Math.max(10,W/55)),
      nuovo:(W,H,i)=>({x:R()*W,y:i?R()*H:-20,s:9+R()*9,v:(.4+R()*.6)*S,o:R()*6.3,dx:.5,rot:(R()-.5)*.5,
        a:.55+R()*.35,col:pick(["#e11d48","#f43f5e","#fb7185","#be123c"])}),
      disegna(ctx,p){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot+Math.sin(p.o)*.2);ctx.globalAlpha=p.a;ctx.fillStyle=p.col;cuore(ctx,p.s);ctx.restore();}
    }),

    carnevale:()=>cadenti({
      n:W=>Math.min(70,Math.max(30,W/16)),
      nuovo:(W,H,i)=>({x:R()*W,y:i?R()*H:-10,w:7+R()*5,h:4+R()*3,tondo:R()<.35,v:(.6+R()*1)*S,o:R()*6.3,dx:.6,
        rot:R()*6.3,vr:(R()-.5)*.12*S,col:pick(["#f5b900","#e11d2e","#1e88e5","#43a047","#8e24aa","#ff7043"])}),
      disegna(ctx,p){
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1,Math.cos(p.o*3));ctx.fillStyle=p.col;
        if(p.tondo){ctx.beginPath();ctx.arc(0,0,p.w*.45,0,6.283);ctx.fill();}else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      }
    }),

    pasqua:()=>cadenti({
      n:W=>Math.min(18,Math.max(8,W/60)),
      nuovo:(W,H,i)=>{const c=pick([["#ffd6e0","#e85d8a"],["#d6f0ff","#3a8fd6"],["#fff1b8","#e0a100"],["#dcf5d6","#43a047"],["#ead9ff","#8e24aa"]]);
        return {x:R()*W,y:i?R()*H:-24,s:9+R()*6,v:(.4+R()*.6)*S,o:R()*6.3,dx:.4,rot:(R()-.5)*.8,vr:(R()-.5)*.012*S,c1:c[0],c2:c[1],pois:R()<.5};},
      disegna(ctx,p){
        const s=p.s;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
        ctx.beginPath();ctx.ellipse(0,0,.75*s,s,0,0,6.283);ctx.fillStyle=p.c1;ctx.fill();
        ctx.save();ctx.clip();ctx.fillStyle=p.c2;
        if(p.pois){for(const [x,y] of [[-.3,-.45],[.3,-.2],[-.25,.25],[.3,.55],[0,-.05]]){ctx.beginPath();ctx.arc(x*s,y*s,.12*s,0,6.283);ctx.fill();}}
        else{ctx.beginPath();ctx.moveTo(-s,-.05*s);for(let k=0;k<6;k++){ctx.lineTo(-s+(k+.5)*s/3,-.3*s);ctx.lineTo(-s+(k+1)*s/3,-.05*s);}
          ctx.lineTo(s,.2*s);ctx.lineTo(-s,.2*s);ctx.fill();}
        ctx.restore();
        ctx.strokeStyle="rgba(0,0,0,.18)";ctx.lineWidth=1;ctx.stroke();
        ctx.restore();
      }
    }),

    halloween:()=>conRagno(cadenti({
      n:W=>Math.min(14,Math.max(7,W/100)),
      nuovo:(W,H,i)=>{
        if(R()<.6){const dir=R()<.5?1:-1;
          return {bat:true,dir,x:i?R()*W:(dir>0?-60:W+60),y:H*(.08+R()*.6),s:10+R()*8,v:(.9+R()*1.1)*S,ph:R()*6.3,o:R()*6.3};}
        return {bat:false,x:R()*W,y:i?R()*H:-24,s:8+R()*5,v:(.35+R()*.5)*S,o:R()*6.3,dx:.3,rot:(R()-.5)*.6,vr:(R()-.5)*.01*S};
      },
      muovi(p){
        if(p.bat){p.x+=p.v*p.dir;p.ph+=.22*S;p.o+=.03;p.y+=Math.sin(p.o)*.6;}
        else{p.y+=p.v;p.o+=.012;p.x+=Math.sin(p.o)*p.dx;p.rot+=p.vr;}
      },
      disegna(ctx,p){
        const s=p.s;ctx.save();ctx.translate(p.x,p.y);
        if(p.bat){
          const f=Math.sin(p.ph);ctx.scale(p.dir,1);ctx.fillStyle="#2a2333";ctx.strokeStyle="rgba(255,170,60,.75)";ctx.lineWidth=1.2;
          for(const lato of [-1,1]){ctx.beginPath();ctx.moveTo(0,-.1*s);
            ctx.quadraticCurveTo(lato*.7*s,-(.2+.9*f)*s,lato*1.4*s,-.6*f*s);
            ctx.quadraticCurveTo(lato*1.1*s,.05*s,lato*.9*s,.15*s);
            ctx.quadraticCurveTo(lato*.6*s,0,lato*.45*s,.2*s);
            ctx.quadraticCurveTo(lato*.25*s,.05*s,0,.2*s);ctx.stroke();ctx.fill();}
          ctx.beginPath();ctx.ellipse(0,.05*s,.22*s,.3*s,0,0,6.283);ctx.fill();
          ctx.beginPath();ctx.moveTo(-.18*s,-.2*s);ctx.lineTo(-.12*s,-.42*s);ctx.lineTo(-.04*s,-.22*s);
          ctx.moveTo(.18*s,-.2*s);ctx.lineTo(.12*s,-.42*s);ctx.lineTo(.04*s,-.22*s);ctx.fill();
        }else{
          ctx.rotate(p.rot);
          ctx.fillStyle="#3f6b21";ctx.fillRect(-.1*s,-.95*s,.2*s,.35*s);
          ctx.fillStyle="#f08a12";
          for(const [x,r] of [[-.4,.5],[.4,.5],[0,.55]]){ctx.beginPath();ctx.ellipse(x*s,0,r*s,.7*s,0,0,6.283);ctx.fill();}
          ctx.strokeStyle="rgba(140,60,0,.45)";ctx.lineWidth=1;
          ctx.beginPath();ctx.ellipse(0,0,.55*s,.7*s,0,0,6.283);ctx.stroke();
          ctx.fillStyle="#3a1a00";
          ctx.beginPath();ctx.moveTo(-.38*s,-.12*s);ctx.lineTo(-.18*s,-.12*s);ctx.lineTo(-.28*s,-.32*s);
          ctx.moveTo(.38*s,-.12*s);ctx.lineTo(.18*s,-.12*s);ctx.lineTo(.28*s,-.32*s);ctx.fill();
          ctx.beginPath();ctx.moveTo(-.4*s,.15*s);ctx.lineTo(-.2*s,.3*s);ctx.lineTo(0,.18*s);ctx.lineTo(.2*s,.3*s);ctx.lineTo(.4*s,.15*s);
          ctx.lineTo(.3*s,.38*s);ctx.lineTo(-.3*s,.38*s);ctx.closePath();ctx.fill();
        }
        ctx.restore();
      }
    })),

    capodanno:()=>{
      const COL=["#ffd23f","#ff4d4d","#4dabff","#5fe08a","#ffffff","#ff7bd5","#ffa94d"];
      let razzi=[],sc=[],prossimo=0;
      return {
        misura(){},
        frame(ctx,W,H,t){
          if(t>prossimo&&razzi.length<3){
            const ty=H*(.2+R()*.3),x=W*(.12+R()*.76);
            razzi.push({x,y:H+5,ty,v:(H-ty)/(60/S),col:pick(COL)});
            prossimo=t+(piano?2600:700)+R()*700;
          }
          for(let i=razzi.length-1;i>=0;i--){
            const r=razzi[i];r.y-=r.v;
            ctx.globalAlpha=.9;ctx.strokeStyle=r.col;ctx.lineWidth=2;
            ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x,r.y+14);ctx.stroke();
            if(r.y<=r.ty){
              const n=piano?30:60,c2=pick(COL);
              for(let k=0;k<n;k++){const a=k/n*6.283+R()*.2,v=(1.8+R()*2.6)*S;
                sc.push({x:r.x,y:r.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,dl:.008+R()*.006,col:R()<.6?r.col:c2});}
              razzi.splice(i,1);
            }
          }
          for(let i=sc.length-1;i>=0;i--){
            const p=sc[i];p.vx*=.985;p.vy=p.vy*.985+.03*S;p.x+=p.vx;p.y+=p.vy;p.l-=p.dl;
            if(p.l<=0){sc.splice(i,1);continue;}
            ctx.globalAlpha=p.l;ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,6.283);ctx.fill();
          }
          ctx.globalAlpha=1;
          return true;
        }
      };
    },

    repubblica:(sveglia)=>{
      const COL=["#009246","#ffffff","#ce2b37"];
      let bandiere=[],ultimo=window.scrollY||0,fino=0,head=null;
      function testata(){head=head||document.getElementById("siteHeader");return head?Math.max(0,head.getBoundingClientRect().bottom):0;}
      window.addEventListener("scroll",()=>{
        const y=window.scrollY||0,dv=y-ultimo;ultimo=y;
        if(!piano){for(const b of bandiere) b.w+=Math.max(-12,Math.min(12,dv))*.006*b.k;}
        fino=performance.now()+600;sveglia();
      },{passive:true});
      return {
        misura(W){
          const passo=W<600?30:38,n=Math.ceil(W/passo)+1;bandiere=[];
          for(let i=0;i<n;i++) bandiere.push({i,x:(i+.5)*passo,a:0,w:piano?0:(R()-.5)*.08,k:.8+R()*.4,col:COL[i%3]});
          fino=performance.now()+1500;
        },
        frame(ctx,W,H,t){
          const y0=testata()+4,sag=Math.min(24,W*.03),lw=W<600?20:26,lh=W<600?24:30;
          const yf=x=>y0+sag*4*(x/W)*(1-x/W);
          ctx.strokeStyle="#4a4f57";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,y0);ctx.quadraticCurveTo(W/2,y0+sag*2,W,y0);ctx.stroke();
          let mosso=false;
          for(const b of bandiere){
            b.w+=-b.a*.03;b.w*=.95;b.a+=b.w;
            if(b.a>.9)b.a=.9;if(b.a<-.9)b.a=-.9;
            if(Math.abs(b.w)>.0008||Math.abs(b.a)>.002) mosso=true;
            const pend=Math.atan(sag*4*(1-2*b.x/W)/W);
            ctx.save();ctx.translate(b.x,yf(b.x));ctx.rotate(pend+b.a);
            ctx.beginPath();ctx.moveTo(-lw/2,0);ctx.lineTo(lw/2,0);ctx.lineTo(0,lh);ctx.closePath();
            ctx.fillStyle=b.col;ctx.fill();ctx.strokeStyle="rgba(0,0,0,.2)";ctx.lineWidth=.8;ctx.stroke();
            ctx.restore();
          }
          return mosso||t<fino;
        }
      };
    }
  };

  function avvia(){
    const c=document.createElement("canvas");
    c.className="festeCanvas";
    c.setAttribute("aria-hidden","true");
    document.body.appendChild(c);
    const ctx=c.getContext("2d");
    let W=0,H=0,id=0,attivo=false;
    function ciclo(t){
      ctx.clearRect(0,0,W,H);
      const ancora=eff.frame(ctx,W,H,t||performance.now());
      if(ancora&&!document.hidden){id=requestAnimationFrame(ciclo);}else{attivo=false;}
    }
    function sveglia(){if(!attivo&&!document.hidden){attivo=true;id=requestAnimationFrame(ciclo);}}
    const eff=EFFETTI[festa](sveglia);
    function misura(){
      const dpr=Math.min(window.devicePixelRatio||1,2);
      W=window.innerWidth;H=window.innerHeight;
      c.width=W*dpr;c.height=H*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      eff.misura(W,H);
      sveglia();
    }
    misura();
    window.addEventListener("resize",misura);
    document.addEventListener("visibilitychange",()=>{
      if(document.hidden){cancelAnimationFrame(id);attivo=false;}else sveglia();
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",avvia); else avvia();
})();
