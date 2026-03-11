import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   alTiro — App TÉCNICO v3 (24 pantallas)
   Dashboard interno de empresa · Iván Lemus
   Journey homologado: Plomería → Jorge Arturo Ruelas Mejía
   Tecnológico de Monterrey | Equipo 5
   ═══════════════════════════════════════════════════════════ */

const C={primary:"#1A7A4B",primaryLight:"#E8F5EE",primaryDark:"#0F5C35",accent:"#E8732A",accentLight:"#FFF3EC",bg:"#F7F8FA",white:"#FFFFFF",card:"#FFFFFF",border:"#E8ECF0",text:"#1A1D21",textSec:"#6B7280",textMut:"#9CA3AF",star:"#F59E0B",danger:"#EF4444",dangerLight:"#FEF2F2",success:"#10B981",successLight:"#ECFDF5",gold:"#D97706",goldLight:"#FFFBEB",shadow:"0 2px 12px rgba(0,0,0,0.06)"};

const S={SPLASH:"splash",LOGIN:"login",DASH:"dash",JOBS:"jobs",JOB_DET:"jobDet",NAV:"nav",CONFIRM_ARR:"confirmArr",CREATE_QUOTE:"createQuote",QUOTE_SENT:"quoteSent",CLIENT_NOW:"clientNow",CREATE_AGR:"createAgr",SVC_PROG:"svcProg",MARK_DONE:"markDone",RATE:"rate",JOB_SUMMARY:"jobSummary",SCHED:"sched",PERF:"perf",PROF:"prof",SETTINGS:"settings",HELP:"helpPage",NOTIFS:"notifs"};

const DEMO_QUOTE={
  works:["Reparación de fuga en tubería de cobre","Cambio de válvula de paso dañada","Sellado de juntas y conexiones","Prueba de presión hidráulica"],
  materials:[{n:"Válvula de paso 1/2\"",c:85},{n:"Soldadura y fundente",c:45},{n:"Cinta teflón y sellador",c:30},{n:"Tubo de cobre (tramo)",c:60}],
  labor:1050,
  get materialsTotal(){return this.materials.reduce((a,m)=>a+m.c,0)},
  get subtotal(){return this.labor+this.materialsTotal},
  get commission(){return Math.round(this.subtotal*0.10)},
  get iva(){return Math.round(this.commission*0.16)},
  get total(){return this.subtotal+this.commission+this.iva},
  get techNet(){return this.labor+this.materialsTotal},
};

const TODAYS_JOBS=[
  {id:1001,time:"10:00 AM",type:"Plomería",icon:"🔧",sub:"Fuga de agua",client:"Jorge Arturo Ruelas Mejía",cRating:4.8,addr:"Av. Universidad 100, Juriquilla, Qro.",dist:"3.2 km",eta:"25 min",desc:"Hay una fuga de agua debajo del fregadero de la cocina. Ya cerré la llave de paso pero sigue goteando.",photos:2,mode:"quote",status:"pending"},
  {id:1002,time:"13:00",type:"Pintura",icon:"🎨",sub:"Habitación individual",client:"María López",cRating:4.5,addr:"Querétaro 123, Jurica",dist:"5.1 km",eta:"35 min",desc:"Pintar recámara principal en blanco hueso.",photos:1,mode:"quote",status:"pending"},
  {id:1003,time:"16:00",type:"Electricista",icon:"⚡",sub:"Instalación de contactos",client:"Roberto S.",cRating:4.9,addr:"Calle Hacienda 456, Milenio III",dist:"8.3 km",eta:"45 min",desc:"Instalar 4 contactos nuevos en sala.",photos:0,mode:"quote",status:"pending"},
];

const WEEK_SCHEDULE=[
  {day:"Lun 15",jobs:3,done:0},{day:"Mar 16",jobs:4,done:0},{day:"Mié 17",jobs:2,done:0},
  {day:"Jue 18",jobs:3,done:0},{day:"Vie 19",jobs:5,done:0},{day:"Sáb 20",jobs:2,done:0},
];

const StatusBar=()=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 20px 4px",fontSize:12,fontWeight:600}}><span>9:41</span><div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:10}}>●●●●</span><span style={{fontSize:10}}>WiFi</span><span style={{fontSize:11}}>🔋</span></div></div>);
const NavH=({title,onBack,rightAction,rightIcon})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.white}}><div style={{display:"flex",alignItems:"center",gap:12}}>{onBack&&<button onClick={onBack} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",padding:0}}>←</button>}<span style={{fontSize:18,fontWeight:700}}>{title}</span></div>{rightAction&&<button onClick={rightAction} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.textSec}}>{rightIcon||"⋯"}</button>}</div>);
const BNav=({active,go})=>{const tabs=[{id:"home",l:"Inicio",icon:"🏠",s:S.DASH},{id:"jobs",l:"Asignaciones",icon:"📋",s:S.JOBS},{id:"sched",l:"Agenda",icon:"📅",s:S.SCHED},{id:"prof",l:"Perfil",icon:"👤",s:S.PROF}];return(<div style={{display:"flex",borderTop:`1px solid ${C.border}`,background:C.white,paddingBottom:8}}>{tabs.map(t=>(<button key={t.id} onClick={()=>go(t.s)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 0 4px",background:"none",border:"none",cursor:"pointer",color:active===t.id?C.primary:C.textMut,fontWeight:active===t.id?700:400,fontSize:10}}><span style={{fontSize:20}}>{t.icon}</span><span>{t.l}</span>{active===t.id&&<div style={{width:20,height:3,borderRadius:2,background:C.primary,marginTop:2}}/>}</button>))}</div>);};
const Btn=({children,onClick,v="primary",full=true,sz="md",disabled=false,sx={}})=>{const vs={primary:{background:C.accent,color:C.white},secondary:{background:C.primaryLight,color:C.primary},outline:{background:"transparent",color:C.primary,border:`2px solid ${C.primary}`},danger:{background:C.danger,color:C.white},ghost:{background:"transparent",color:C.textSec},success:{background:C.success,color:C.white},gold:{background:C.gold,color:C.white}};const szs={sm:{padding:"10px 16px",fontSize:13},md:{padding:"14px 24px",fontSize:15},lg:{padding:"18px 32px",fontSize:16}};return <button onClick={disabled?undefined:onClick} style={{border:"none",borderRadius:14,cursor:disabled?"default":"pointer",fontWeight:700,width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",transition:"all 0.2s",...szs[sz],...vs[v],...sx}}>{children}</button>;};
const Card=({children,onClick,sx={}})=>(<div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,boxShadow:C.shadow,border:`1px solid ${C.border}`,cursor:onClick?"pointer":"default",transition:"all 0.2s",...sx}}>{children}</div>);
const Stars=({r,size=18,interactive=false,onChange})=>(<div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=>(<span key={i} onClick={()=>interactive&&onChange?.(i)} style={{fontSize:size,cursor:interactive?"pointer":"default",color:i<=r?C.star:"#E5E7EB"}}>{i<=r?"★":"☆"}</span>))}</div>);
const Badge=({children,color=C.primary,bg})=>(<span style={{display:"inline-block",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,color,background:bg||(color+"18")}}>{children}</span>);
const Input=({label,placeholder,value,icon,multiline})=>(<div style={{marginBottom:16}}>{label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:C.textSec,marginBottom:6}}>{label}</label>}<div style={{display:"flex",alignItems:multiline?"flex-start":"center",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 14px",background:C.white,gap:8}}>{icon&&<span style={{fontSize:16}}>{icon}</span>}{multiline?<textarea placeholder={placeholder} defaultValue={value} style={{border:"none",outline:"none",flex:1,fontSize:14,fontFamily:"inherit",color:C.text,background:"transparent",resize:"none",minHeight:60}}/>:<input placeholder={placeholder} defaultValue={value} style={{border:"none",outline:"none",flex:1,fontSize:14,fontFamily:"inherit",color:C.text,background:"transparent"}}/>}</div></div>);
const Section=({children,action,onAction})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>{children}</span>{action&&<button onClick={onAction} style={{background:"none",border:"none",color:C.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>{action}</button>}</div>);

export default function AlTiroTechApp(){
  const[screen,setScreen]=useState(S.SPLASH);const[hist,setHist]=useState([]);const[tab,setTab]=useState("home");
  const[selJob,setSelJob]=useState(null);const[clientR,setClientR]=useState(0);const[selTags,setSelTags]=useState([]);
  const[progress,setProgress]=useState([false,false,false,false]);const[clientWantsNow,setClientWantsNow]=useState(false);

  const go=useCallback((s)=>{setHist(h=>[...h,screen]);setScreen(s);if(s===S.DASH)setTab("home");if(s===S.JOBS)setTab("jobs");if(s===S.SCHED)setTab("sched");if(s===S.PROF)setTab("prof");},[screen]);
  const back=useCallback(()=>{if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setScreen(p);if(p===S.DASH)setTab("home");if(p===S.JOBS)setTab("jobs");if(p===S.SCHED)setTab("sched");if(p===S.PROF)setTab("prof");}},[hist]);
  const reset=()=>{setSelJob(null);setClientR(0);setSelTags([]);setProgress([false,false,false,false]);setClientWantsNow(false);setHist([]);setScreen(S.DASH);setTab("home");};

  useEffect(()=>{if(screen===S.SPLASH){const t=setTimeout(()=>setScreen(S.LOGIN),2000);return()=>clearTimeout(t);}},[screen]);

  const showNav=[S.DASH,S.JOBS,S.SCHED,S.PERF,S.PROF,S.SETTINGS,S.HELP,S.NOTIFS].includes(screen);
  const job=selJob||TODAYS_JOBS[0];const isQuote=job.mode==="quote";const Q=DEMO_QUOTE;

  // ═══ SPLASH & LOGIN ═══
  const renderSplash=()=>(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(145deg,${C.primary},${C.primaryDark})`,overflow:"hidden"}}><div style={{fontSize:48,marginBottom:8}}>🐦</div><div style={{fontSize:36,fontWeight:800,color:C.white}}>alTiro</div><div style={{fontSize:14,color:"rgba(255,255,255,0.85)",marginTop:4,fontWeight:600}}>Portal Técnico</div></div>);

  const renderLogin=()=>(<div style={{flex:1,display:"flex",flexDirection:"column",background:C.white,padding:24}}>
    <div style={{marginTop:40,marginBottom:32}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:28}}>🐦</span><span style={{fontSize:24,fontWeight:800,color:C.primary}}>alTiro</span><Badge color={C.accent}>Técnico</Badge></div><div style={{fontSize:26,fontWeight:800,marginBottom:4}}>Bienvenido, Iván</div><div style={{fontSize:14,color:C.textSec}}>Ingresa a tu portal de trabajo</div></div>
    <Input label="Correo corporativo" value="ivan.lemus@altiro.mx" icon="✉️"/>
    <Input label="Contraseña" placeholder="••••••••" icon="🔒"/>
    <Btn onClick={()=>{setHist([]);setScreen(S.DASH);setTab("home");}}>Iniciar sesión</Btn>
    <div style={{marginTop:"auto",textAlign:"center",fontSize:11,color:C.textMut}}>¿Problemas para acceder? <span style={{color:C.primary,fontWeight:600}}>Contacta a tu supervisor</span></div>
  </div>);

  // ═══ DASHBOARD ═══
  const renderDash=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}>
    <div style={{background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,padding:"20px 20px 28px",borderRadius:"0 0 28px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>🐦</span><span style={{fontSize:18,fontWeight:800,color:C.white}}>alTiro</span><span style={{fontSize:10,color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.15)",padding:"2px 8px",borderRadius:10}}>Técnico</span></div><div style={{fontSize:22,fontWeight:800,color:C.white}}>Hola, Iván 👋</div><div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Lunes 15 de Marzo, 2026</div></div>
        <button onClick={()=>go(S.NOTIFS)} style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"none",fontSize:18,cursor:"pointer",color:C.white,position:"relative"}}>🔔<div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:4,background:C.accent}}/></button>
      </div>
      {/* Daily quota */}
      <Card sx={{background:"rgba(255,255,255,0.12)",border:"none",padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,color:"rgba(255,255,255,0.8)",fontWeight:600}}>Avance del día</span><span style={{fontSize:13,color:C.white,fontWeight:800}}>0 / 3 servicios</span></div>
        <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.15)"}}><div style={{width:"0%",height:8,borderRadius:4,background:C.accent}}/></div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:6}}>Horario: 8:00 AM – 6:00 PM</div>
      </Card>
    </div>
    <div style={{padding:"20px 16px"}}>
      <Section action="Ver todo" onAction={()=>go(S.JOBS)}>Asignaciones de hoy</Section>
      {TODAYS_JOBS.map(j=>(<Card key={j.id} onClick={()=>{setSelJob(j);go(S.JOB_DET);}} sx={{marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:j.mode==="quote"?C.goldLight:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{j.icon}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:15,fontWeight:700}}>{j.type}</div><span style={{fontSize:13,fontWeight:700,color:C.primary}}>{j.time}</span></div>
            <div style={{fontSize:12,color:C.textMut}}>{j.client} · {j.dist}</div>
            <div style={{display:"flex",gap:6,marginTop:4}}><Badge color={j.mode==="quote"?C.gold:C.success}>{j.mode==="quote"?"📋 Cotización":"⚡ Tarifa fija"}</Badge><Badge color={C.textSec}>{j.sub}</Badge></div>
          </div>
        </div>
      </Card>))}
      <div style={{marginTop:8}}><Btn v="secondary" onClick={()=>go(S.PERF)}>📊 Ver mi rendimiento</Btn></div>
    </div>
  </div>);

  // ═══ JOBS LIST ═══
  const renderJobs=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><div style={{padding:"16px 16px 8px"}}><div style={{fontSize:22,fontWeight:800}}>Mis asignaciones</div><div style={{fontSize:13,color:C.textMut}}>Lunes 15 de Marzo · 3 servicios</div></div>
    <div style={{padding:"8px 16px"}}>{TODAYS_JOBS.map(j=>(<Card key={j.id} onClick={()=>{setSelJob(j);go(S.JOB_DET);}} sx={{marginBottom:10,cursor:"pointer"}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{minWidth:52,textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:C.primary}}>{j.time}</div><div style={{width:40,height:40,borderRadius:12,background:j.mode==="quote"?C.goldLight:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"4px auto 0"}}>{j.icon}</div></div>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{j.type} — {j.sub}</div><div style={{fontSize:12,color:C.textMut}}>📍 {j.addr}</div><div style={{fontSize:12,color:C.textMut}}>👤 {j.client} · ⭐ {j.cRating}</div><Badge color={j.mode==="quote"?C.gold:C.success}>{j.mode==="quote"?"📋 Cotización":"⚡ Tarifa fija"}</Badge></div>
      </div>
    </Card>))}</div>
  </div>);

  // ═══ JOB DETAIL ═══
  const renderJobDet=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Detalle de asignación" onBack={back}/><div style={{padding:16}}>
    <Card sx={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{width:52,height:52,borderRadius:16,background:isQuote?C.goldLight:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{job.icon}</div>
        <div style={{flex:1}}><div style={{fontSize:18,fontWeight:800}}>{job.type}</div><div style={{fontSize:13,color:C.textMut}}>{job.sub}</div><Badge color={isQuote?C.gold:C.success}>{isQuote?"📋 Cotización obligatoria":"⚡ Tarifa fija"}</Badge></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:C.primary}}>{job.time}</div></div>
      </div>
    </Card>
    <Card sx={{marginBottom:16}}><Section>Cliente</Section>
      <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:48,height:48,borderRadius:14,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👨</div><div><div style={{fontSize:15,fontWeight:700}}>{job.client}</div><div style={{display:"flex",alignItems:"center",gap:6}}><Stars r={Math.floor(job.cRating)} size={12}/><span style={{fontSize:12,fontWeight:600}}>{job.cRating}</span></div></div></div>
    </Card>
    <Card sx={{marginBottom:16}}><Section>Ubicación</Section>
      <div style={{height:80,borderRadius:12,background:`linear-gradient(135deg,${C.primaryLight},#D1FAE5)`,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>📍</span></div>
      <div style={{fontSize:13,fontWeight:600}}>📍 {job.addr}</div><div style={{fontSize:12,color:C.textMut}}>⏱ {job.eta} · {job.dist}</div>
    </Card>
    <Card sx={{marginBottom:16}}><Section>Descripción del cliente</Section><div style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{job.desc}</div>{job.photos>0&&<div style={{display:"flex",gap:8,marginTop:8}}>{Array.from({length:job.photos},(_,i)=>(<div key={i} style={{width:56,height:56,borderRadius:10,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🖼️</div>))}</div>}</Card>
    {isQuote&&<Card sx={{marginBottom:16,background:C.goldLight,border:`1px solid ${C.gold}30`,padding:12}}><div style={{fontSize:12,color:C.gold,fontWeight:600}}>📋 Visita de evaluación. Llega, diagnostica y entrega cotización al cliente.</div></Card>}
    <Btn onClick={()=>go(S.NAV)}>🗺 Iniciar navegación</Btn>
  </div></div>);

  // ═══ NAVIGATION & ARRIVAL ═══
  const renderNav=()=>(<div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column"}}><div style={{height:220,background:`linear-gradient(135deg,${C.primaryLight},#D1FAE5)`,position:"relative"}}><div style={{position:"absolute",top:16,left:16}}><button onClick={back} style={{width:36,height:36,borderRadius:10,background:C.white,border:"none",fontSize:16,cursor:"pointer",boxShadow:C.shadow}}>←</button></div><div style={{position:"absolute",top:"35%",left:"25%",fontSize:28}}>🚗</div><div style={{position:"absolute",top:"55%",right:"25%",fontSize:24}}>📍</div><div style={{position:"absolute",bottom:12,left:12,right:12,background:C.white,borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:C.shadow}}><div><div style={{fontSize:12,fontWeight:600}}>Navegando a domicilio</div><div style={{fontSize:11,color:C.textMut}}>📍 {job.addr}</div></div><div style={{fontSize:22,fontWeight:800,color:C.primary}}>{job.eta}</div></div></div><div style={{padding:16,flex:1}}><Card sx={{marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{job.client}</div><div style={{fontSize:12,color:C.textMut}}>{job.type} — {job.sub}</div></div></div></Card><Btn onClick={()=>go(S.CONFIRM_ARR)}>📍 He llegado al domicilio</Btn></div></div>);

  const renderConfirmArr=()=>(<div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}><div style={{width:96,height:96,borderRadius:24,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:16}}>🏠</div><div style={{fontSize:20,fontWeight:800,textAlign:"center",marginBottom:4}}>¿Llegaste al domicilio?</div><div style={{fontSize:14,color:C.textSec,textAlign:"center",marginBottom:28}}>📍 {job.addr}</div><div style={{width:"100%",maxWidth:300}}><Btn onClick={()=>go(isQuote?S.CREATE_QUOTE:S.CREATE_AGR)}>✓ Confirmar llegada</Btn><div style={{height:8}}/><Btn v="ghost" onClick={back}>Aún no llego</Btn></div></div>);

  // ═══ ROUTE A — FIXED RATE ═══
  const renderCreateAgr=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Acuerdo de servicio" onBack={back}/><div style={{background:C.successLight,padding:"10px 16px",fontSize:12,color:C.primaryDark,fontWeight:600}}>⚡ Tarifa fija — Esperando confirmación del cliente</div><div style={{padding:16}}>
    <Card sx={{marginBottom:16}}><Section>Trabajos</Section>{["Ejecución del servicio","Verificación","Limpieza"].map((w,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}><span style={{color:C.success}}>✓</span><span style={{fontSize:13}}>{w}</span></div>))}</Card>
    <Card sx={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:800,color:C.success}}><span>Tarifa fija</span><span>${job.price||1400} MXN</span></div></Card>
    <Btn onClick={()=>{setProgress([false,false,false]);go(S.SVC_PROG);}}>Enviar acuerdo al cliente</Btn>
  </div></div>);

  // ═══ ROUTE B — QUOTE (PLOMERÍA JOURNEY) ═══
  const renderCreateQuote=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Crear cotización" onBack={back}/><div style={{background:C.goldLight,padding:"10px 16px",fontSize:12,color:C.gold,fontWeight:600}}>📋 El cliente recibirá esto como presupuesto formal</div><div style={{padding:16}}>
    <Card sx={{marginBottom:16}}><Section>Diagnóstico y trabajos</Section>{Q.works.map((w,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<Q.works.length-1?`1px solid ${C.border}`:"none"}}><span style={{color:C.gold}}>•</span><span style={{fontSize:13}}>{w}</span></div>))}<button style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:600,fontSize:13}}>＋ Agregar trabajo</button></Card>
    <Card sx={{marginBottom:16}}><Section>Materiales</Section>{Q.materials.map((m,j)=>(<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13,borderBottom:j<Q.materials.length-1?`1px solid ${C.border}`:"none"}}><span>{m.n}</span><span style={{fontWeight:600,color:C.primary}}>${m.c}</span></div>))}<button style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:600,fontSize:13}}>＋ Agregar material</button></Card>
    <Card sx={{marginBottom:16}}><Input label="Mano de obra" value={`$${Q.labor}.00`} icon="💰"/><Input label="Tiempo estimado" value="1.5 — 2 horas" icon="⏱"/></Card>
    <Card sx={{marginBottom:16}}>
      {[{l:"Mano de obra",v:`$${Q.labor}`},{l:"Materiales",v:`$${Q.materialsTotal}`},{l:"Comisión alTiro (10%)",v:`$${Q.commission}`},{l:"IVA",v:`$${Q.iva}`}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:C.textSec}}><span>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span></div>))}
      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:8,borderTop:`2px solid ${C.gold}`,fontSize:16,fontWeight:800,color:C.gold}}><span>Total al cliente</span><span>${Q.total} MXN</span></div>
    </Card>
    <Btn v="gold" onClick={()=>go(S.QUOTE_SENT)}>📋 Entregar cotización</Btn>
  </div></div>);

  const renderQuoteSent=()=>(<div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{width:88,height:88,borderRadius:44,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:16}}>✅</div>
    <div style={{fontSize:20,fontWeight:800,textAlign:"center",marginBottom:4}}>Cotización entregada</div>
    <div style={{fontSize:14,color:C.textSec,textAlign:"center"}}>Esperando decisión de {job.client}</div>
    <Card sx={{width:"100%",marginTop:16,marginBottom:8,textAlign:"center"}}><div style={{fontSize:13,color:C.textMut}}>Cobro por evaluación</div><div style={{fontSize:28,fontWeight:800,color:C.gold}}>$250 MXN</div></Card>
    <Card sx={{width:"100%",marginBottom:16,background:C.primaryLight,border:`1px solid ${C.primary}20`,padding:12}}>
      <div style={{fontSize:12,color:C.primaryDark}}>El cliente puede ejecutar la reparación ahora o agendar para otro día. Recibirás la notificación.</div>
    </Card>
    <Btn onClick={()=>go(S.CLIENT_NOW)}>Simular: Cliente quiere ejecutar ahora</Btn>
    <div style={{height:8}}/><Btn v="ghost" onClick={()=>go(S.RATE)}>Simular: Cliente agenda después</Btn>
  </div>);

  // ★ CLIENT WANTS IMMEDIATE EXECUTION
  const renderClientNow=()=>(<div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{width:88,height:88,borderRadius:44,background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:16}}>⚡</div>
    <div style={{fontSize:20,fontWeight:800,textAlign:"center",color:C.accent,marginBottom:4}}>¡Ejecución inmediata!</div>
    <div style={{fontSize:14,color:C.textSec,textAlign:"center"}}>{job.client} quiere que ejecutes la reparación ahora</div>
    <Card sx={{width:"100%",marginTop:16,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700,marginBottom:6}}><span>Servicio completo</span><span style={{color:C.primary}}>${Q.total} MXN</span></div>
      <div style={{fontSize:12,color:C.textMut}}>Cotización ya aceptada. El acuerdo está precargado.</div>
    </Card>
    <Btn onClick={()=>{setClientWantsNow(true);setProgress([false,false,false,false]);go(S.SVC_PROG);}}>✓ Iniciar servicio ahora</Btn>
    <div style={{height:8}}/><Btn v="ghost" onClick={back}>Volver</Btn>
  </div>);

  // ═══ SERVICE PROGRESS ═══
  const renderSvcProg=()=>{const items=clientWantsNow?Q.works:["Ejecución del servicio","Verificación","Limpieza"];const allDone=progress.slice(0,items.length).every(Boolean);return(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Servicio activo"/><div style={{padding:16}}>
    <Card sx={{marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{job.client}</div><div style={{fontSize:12,color:C.textMut}}>{job.type} — {job.sub}</div></div></div><div style={{textAlign:"center",padding:"12px 0",background:C.bg,borderRadius:12}}><div style={{fontSize:32,fontWeight:800,color:C.primary}}>00:45:22</div><div style={{fontSize:12,color:C.textMut}}>Tiempo transcurrido</div></div></Card>
    <Card sx={{marginBottom:16}}><Section>Checklist</Section>{items.map((w,i)=>(<div key={i} onClick={()=>{const np=[...progress];np[i]=!np[i];setProgress(np);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<items.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}}><div style={{width:24,height:24,borderRadius:8,border:`2px solid ${progress[i]?C.success:C.border}`,background:progress[i]?C.success:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}>{progress[i]&&<span style={{color:C.white,fontSize:12}}>✓</span>}</div><span style={{fontSize:13,color:progress[i]?C.textMut:C.text,textDecoration:progress[i]?"line-through":"none"}}>{w}</span></div>))}</Card>
    <Btn onClick={()=>go(S.MARK_DONE)} disabled={!allDone}>{allDone?"Marcar como completado":"Completa todos los ítems"}</Btn>
  </div></div>);};

  const renderMarkDone=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Completar servicio" onBack={back}/><div style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:80,height:80,borderRadius:20,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16}}>📸</div><div style={{fontSize:20,fontWeight:800,marginBottom:4}}>Documenta el resultado</div><div style={{fontSize:14,color:C.textSec,marginBottom:24}}>Toma fotos como evidencia</div><div style={{display:"flex",gap:10,marginBottom:24}}>{[0,1,2].map(i=>(<div key={i} style={{width:88,height:88,borderRadius:14,border:`2px dashed ${i===0?C.primary:C.border}`,background:i===0?C.primaryLight:C.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><span style={{fontSize:i===0?11:20,color:i===0?C.primary:C.textMut}}>{i===0?"📷 Agregar":"+"}</span></div>))}</div><div style={{width:"100%"}}><Btn onClick={()=>go(S.RATE)}>✓ Confirmar completado</Btn></div></div></div>);

  // ═══ POST-SERVICE ═══
  const renderRate=()=>{const tags=["Hogar accesible","Amable","Puntual","Buena comunicación","Limpio","Respetuoso"];return(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Califica al cliente"/><div style={{padding:16}}><div style={{textAlign:"center",marginBottom:20}}><div style={{width:64,height:64,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 8px"}}>👨</div><div style={{fontSize:17,fontWeight:700}}>{job.client}</div></div><div style={{display:"flex",justifyContent:"center",marginBottom:20}}><Stars r={clientR} size={36} interactive onChange={setClientR}/></div><div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:20}}>{tags.map(tag=>{const s=selTags.includes(tag);return <button key={tag} onClick={()=>setSelTags(s?selTags.filter(t=>t!==tag):[...selTags,tag])} style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${s?C.primary:C.border}`,background:s?C.primaryLight:C.white,fontSize:13,fontWeight:600,color:s?C.primary:C.textSec,cursor:"pointer"}}>{tag}</button>;})}</div><Btn onClick={()=>go(S.JOB_SUMMARY)} disabled={clientR===0}>Enviar calificación</Btn></div></div>);};

  const renderJobSummary=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Resumen del servicio"/><div style={{padding:16}}>
    <Card sx={{marginBottom:16,textAlign:"center",padding:24}}><div style={{width:64,height:64,borderRadius:32,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px"}}>✅</div><div style={{fontSize:20,fontWeight:800}}>Servicio completado</div><div style={{fontSize:13,color:C.textMut,marginTop:4}}>{job.type} — {job.sub}</div><div style={{fontSize:13,color:C.textMut}}>{job.client}</div></Card>
    <Card sx={{marginBottom:16}}>
      {clientWantsNow?<>{[{l:"Mano de obra",v:`$${Q.labor}`},{l:"Materiales",v:`$${Q.materialsTotal}`},{l:"Total del servicio",v:`$${Q.total}`,bold:true}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:r.bold?C.primary:C.textSec,fontWeight:r.bold?800:400}}><span>{r.l}</span><span>{r.v}</span></div>))}</>
      :<>{[{l:"Cobro por evaluación",v:"$250"},{l:"Cotización entregada",v:`$${Q.total}`}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:C.textSec}}><span>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span></div>))}</>}
    </Card>
    <Card sx={{marginBottom:16,padding:12}}><div style={{display:"flex",alignItems:"center",gap:8}}><span>🆔</span><span style={{fontSize:13}}>Folio: <strong>#ALT-2026-001530</strong></span></div></Card>
    <Btn onClick={reset}>Volver al inicio</Btn>
  </div></div>);

  // ═══ SCHEDULE ═══
  const renderSched=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><div style={{padding:"16px 16px 8px"}}><div style={{fontSize:22,fontWeight:800}}>Mi agenda</div><div style={{fontSize:13,color:C.textMut}}>Semana del 15 al 20 de Marzo</div></div><div style={{padding:"8px 16px"}}>
    {WEEK_SCHEDULE.map((d,i)=>(<Card key={i} sx={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:44,height:44,borderRadius:12,background:i===0?C.primaryLight:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:i===0?C.primary:C.textSec}}>{d.day.split(" ")[0]}<br/>{d.day.split(" ")[1]}</div><div><div style={{fontSize:14,fontWeight:700}}>{d.jobs} servicios asignados</div><div style={{fontSize:12,color:C.textMut}}>{d.done} completados</div></div></div><Badge color={d.done===d.jobs?C.success:C.textSec}>{d.done}/{d.jobs}</Badge></Card>))}
    <Card sx={{marginTop:8,background:C.primaryLight,border:`1px solid ${C.primary}20`,padding:12}}><div style={{fontSize:12,color:C.primaryDark}}><strong>Cuota semanal:</strong> 19 servicios asignados · Meta: 15 mínimo</div></Card>
  </div></div>);

  // ═══ PERFORMANCE ═══
  const renderPerf=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Mi rendimiento" onBack={back}/><div style={{padding:16}}>
    <Card sx={{marginBottom:16,textAlign:"center",padding:20}}><div style={{fontSize:36,fontWeight:800,color:C.primary}}>4.9</div><Stars r={5} size={18}/><div style={{fontSize:13,color:C.textMut,marginTop:4}}>234 servicios · 187 reseñas</div></Card>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
      {[{v:"98%",l:"Puntualidad",i:"⏰"},{v:"97%",l:"Satisfacción",i:"😊"},{v:"234",l:"Servicios",i:"🛠"},{v:"0",l:"Quejas",i:"✅"}].map((s,i)=>(<Card key={i} sx={{textAlign:"center",padding:14}}><div style={{fontSize:16}}>{s.i}</div><div style={{fontSize:18,fontWeight:800,color:C.primary}}>{s.v}</div><div style={{fontSize:11,color:C.textMut}}>{s.l}</div></Card>))}
    </div>
    <Section>Reseñas recientes</Section>
    {[{from:"Jorge Arturo R.",r:5,text:"Excelente servicio, muy profesional."},{from:"María L.",r:5,text:"Buen trabajo en pintura."},{from:"Roberto S.",r:5,text:"Resolvió el problema rápido."}].map((rev,i)=>(<Card key={i} sx={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:600}}>{rev.from}</span><Stars r={rev.r} size={12}/></div><div style={{fontSize:12,color:C.textSec}}>{rev.text}</div></Card>))}
  </div></div>);

  // ═══ PROFILE ═══
  const renderProf=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}>
    <div style={{background:C.white,padding:"20px 16px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:64,height:64,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,position:"relative"}}>👨‍🔧<div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:10,background:C.success,border:`2px solid ${C.white}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.white}}>✓</div></div><div style={{flex:1}}><div style={{fontSize:18,fontWeight:800}}>Iván Lemus</div><div style={{fontSize:13,color:C.textMut}}>Plomería · Electricista</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><Stars r={5} size={12}/><span style={{fontSize:12,fontWeight:600}}>4.9</span><span style={{fontSize:11,color:C.textMut}}>· 234 servicios</span></div></div></div></div>
    <div style={{padding:"0 16px"}}>
      <Card sx={{marginBottom:8,background:C.primaryLight,border:`1px solid ${C.primary}20`}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>🏢</span><div><div style={{fontSize:14,fontWeight:700}}>Empleado alTiro</div><div style={{fontSize:12,color:C.textMut}}>ID: ALT-TEC-0047 · Desde Ene 2026</div></div></div></Card>
      {[{i:"📊",l:"Mi rendimiento",s:S.PERF},{i:"📅",l:"Mi agenda",s:S.SCHED},{i:"⚙️",l:"Configuración",s:S.SETTINGS},{i:"❓",l:"Soporte",s:S.HELP}].map((item,i)=>(<Card key={i} onClick={()=>go(item.s)} sx={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>{item.i}</span><span style={{fontSize:14,fontWeight:600}}>{item.l}</span></div><span style={{color:C.textMut}}>›</span></Card>))}
      <div style={{padding:"16px 0"}}><Btn v="ghost" onClick={()=>setScreen(S.LOGIN)}><span style={{color:C.danger}}>Cerrar sesión</span></Btn></div>
    </div>
  </div>);

  const renderSettings=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Configuración" onBack={back}/><div style={{padding:16}}>{[{l:"🔔 Notificaciones de asignación",toggle:true},{l:"📱 Alertas de navegación",toggle:true},{l:"📅 Horario: Lun-Sáb, 8am-6pm"},{l:"🌐 Idioma: Español"},{l:"📄 Políticas de la empresa"},{l:"🔒 Privacidad"},{l:"ℹ️ alTiro Técnico v1.0"}].map((s,i)=>(<Card key={i} sx={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>{s.l}</span>{s.toggle&&<div style={{width:44,height:24,borderRadius:12,background:C.primary,padding:2}}><div style={{width:20,height:20,borderRadius:10,background:C.white,marginLeft:20}}/></div>}</Card>))}</div></div>);

  const renderHelp=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Soporte" onBack={back}/><div style={{padding:16}}><Input placeholder="Buscar..." icon="🔍"/>{["¿Cómo funciona la cotización?","¿Qué hago si el cliente no está?","¿Cómo reporto un problema?","¿Cómo modifico mi horario?","¿A quién contacto en emergencias?"].map((q,i)=>(<Card key={i} sx={{marginBottom:8,cursor:"pointer"}}><span style={{fontSize:13,fontWeight:600}}>{q}</span></Card>))}<div style={{marginTop:20}}><Btn v="outline">💬 Contactar supervisor</Btn></div></div></div>);

  const renderNotifs=()=>(<div style={{flex:1,background:C.bg,overflowY:"auto"}}><NavH title="Notificaciones" onBack={back}/><div style={{padding:16}}>{[{t:"Nueva asignación",d:"Plomería — Fuga de agua · Jorge Arturo Ruelas Mejía · 10:00 AM",time:"5 min",u:true},{t:"⚡ Ejecución inmediata",d:"Jorge Arturo aceptó tu cotización y quiere ejecutar ahora",time:"30 min",u:true},{t:"Recordatorio",d:"Pintura — Habitación individual · María López · 13:00",time:"2h",u:false},{t:"Rendimiento semanal",d:"Completaste 19/15 servicios la semana pasada. ¡Excelente!",time:"Ayer",u:false}].map((n,i)=>(<Card key={i} sx={{marginBottom:8,background:n.u?C.primaryLight:C.white}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700}}>{n.t}</span><span style={{fontSize:11,color:C.textMut}}>{n.time}</span></div><div style={{fontSize:12,color:C.textSec,marginTop:2}}>{n.d}</div></Card>))}</div></div>);

  const R=()=>{switch(screen){
    case S.SPLASH:return renderSplash();case S.LOGIN:return renderLogin();
    case S.DASH:return renderDash();case S.JOBS:return renderJobs();case S.JOB_DET:return renderJobDet();
    case S.NAV:return renderNav();case S.CONFIRM_ARR:return renderConfirmArr();
    case S.CREATE_AGR:return renderCreateAgr();case S.CREATE_QUOTE:return renderCreateQuote();
    case S.QUOTE_SENT:return renderQuoteSent();case S.CLIENT_NOW:return renderClientNow();
    case S.SVC_PROG:return renderSvcProg();case S.MARK_DONE:return renderMarkDone();
    case S.RATE:return renderRate();case S.JOB_SUMMARY:return renderJobSummary();
    case S.SCHED:return renderSched();case S.PERF:return renderPerf();
    case S.PROF:return renderProf();case S.SETTINGS:return renderSettings();case S.HELP:return renderHelp();case S.NOTIFS:return renderNotifs();
    default:return renderDash();
  }};

  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#E8ECF0",fontFamily:"'DM Sans',-apple-system,sans-serif",padding:16}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <style>{`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:0;}button:active{transform:scale(0.97);}input::placeholder,textarea::placeholder{color:${C.textMut};}`}</style>
    <div style={{marginBottom:12,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:2}}>alTiro · Portal Técnico v3</div><div style={{fontSize:11,color:"#9CA3AF"}}><strong>{screen}</strong>{" · "}<button onClick={back} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600,fontSize:11}}>← Atrás</button>{" "}<button onClick={reset} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontWeight:600,fontSize:11}}>⟲ Dashboard</button></div></div>
    <div style={{width:375,height:812,borderRadius:44,background:C.white,boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}><div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:160,height:30,background:"#000",borderRadius:"0 0 20px 20px",zIndex:10}}/><div style={{height:30}}/><StatusBar/><div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>{R()}</div>{showNav&&<BNav active={tab} go={go}/>}<div style={{display:"flex",justifyContent:"center",paddingBottom:8,paddingTop:4}}><div style={{width:134,height:5,borderRadius:3,background:"#000",opacity:0.2}}/></div></div>
    <div style={{marginTop:8,fontSize:11,color:"#9CA3AF"}}>24 pantallas · Dashboard interno · Iván Lemus · Equipo 5</div>
  </div>);
}
