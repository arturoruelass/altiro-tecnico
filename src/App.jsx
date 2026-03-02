import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   alTiro — Prototipo Completo App TÉCNICO (33 pantallas)
   Tecnológico de Monterrey | Equipo 5
   Espejo operativo de la App Usuario
   ═══════════════════════════════════════════════════════════ */

const C = {
  primary: "#1A7A4B", primaryLight: "#E8F5EE", primaryDark: "#0F5C35",
  accent: "#E8732A", accentLight: "#FFF3EC",
  bg: "#F7F8FA", white: "#FFFFFF", card: "#FFFFFF",
  border: "#E8ECF0", textPrimary: "#1A1D21", textSecondary: "#6B7280",
  textMuted: "#9CA3AF", star: "#F59E0B", danger: "#EF4444",
  dangerLight: "#FEF2F2", success: "#10B981", successLight: "#ECFDF5",
  shadow: "0 2px 12px rgba(0,0,0,0.06)", shadowLg: "0 8px 32px rgba(0,0,0,0.10)",
  gold: "#D97706", goldLight: "#FFFBEB",
};

const S = {
  SPLASH:"splash",OB1:"ob1",OB2:"ob2",OB3:"ob3",
  LOGIN:"login",OTP:"otp",PERSONAL_DATA:"personalData",
  PROF_PROFILE:"profProfile",VERIF_STATUS:"verifStatus",
  DASHBOARD:"dashboard",
  REQUESTS:"requests",REQ_DETAIL:"reqDetail",REQ_ACCEPTED:"reqAccepted",NAVIGATION:"navigation",
  CONFIRM_ARRIVAL:"confirmArrival",CREATE_AGREEMENT:"createAgreement",SVC_PROGRESS:"svcProgress",MARK_COMPLETE:"markComplete",
  RATE_CLIENT:"rateClient",PAYMENT_SUMMARY:"paymentSummary",TIP_RECEIVED:"tipReceived",
  EARNINGS:"earnings",TRANSACTIONS:"transactions",WITHDRAW:"withdraw",
  PROFILE_HUB:"profileHub",EDIT_INFO:"editInfo",SPECIALTIES:"specialties",
  DOCUMENTS:"documents",PORTFOLIO:"portfolio",MY_REVIEWS:"myReviews",BANK_ACCOUNT:"bankAccount",
  SETTINGS_PAGE:"settingsPage",HELP:"help",REPORT_PROBLEM:"reportProblem",NOTIFS:"notifs",
};

const SPECIALTIES_DATA = [
  { id:"plomeria",name:"Plomería",icon:"🔧",color:"#1A7A4B" },
  { id:"electricidad",name:"Electricidad",icon:"⚡",color:"#E8732A" },
  { id:"cerrajeria",name:"Cerrajería",icon:"🔑",color:"#7C3AED" },
  { id:"carpinteria",name:"Carpintería",icon:"🪚",color:"#B45309" },
  { id:"albanileria",name:"Albañilería",icon:"🧱",color:"#DC2626" },
  { id:"pintura",name:"Pintura",icon:"🎨",color:"#2563EB" },
  { id:"herreria",name:"Herrería",icon:"⚒️",color:"#475569" },
  { id:"fumigacion",name:"Fumigación",icon:"🧴",color:"#059669" },
  { id:"jardineria",name:"Jardinería",icon:"🌿",color:"#16A34A" },
];

const INCOMING_REQUESTS = [
  { id:2001,type:"Plomería",icon:"🔧",subtype:"Fuga de agua",client:"Francisco G.",clientRating:4.8,clientJobs:3,location:"Querétaro Centro",address:"Av. Universidad 100, Juriquilla",distance:"3.2 km",price:490,eta:"25 min",time:"14 Mar · 10:00 AM",description:"Fuga en la tubería de la cocina debajo del fregadero. Ya cerré la llave de paso.",photos:2,urgent:false },
  { id:2002,type:"Electricidad",icon:"⚡",subtype:"Corto circuito",client:"María L.",clientRating:4.5,clientJobs:7,location:"Jurica",address:"Querétaro 123, Jurica",distance:"5.1 km",price:550,eta:"35 min",time:"14 Mar · 13:00",description:"Se fue la luz en la mitad de la casa. Los breakers se disparan solos.",photos:1,urgent:true },
  { id:2003,type:"Plomería",icon:"🔧",subtype:"Instalación de boiler",client:"Roberto S.",clientRating:4.9,clientJobs:12,location:"Milenio III",address:"Calle Hacienda 456, Milenio III",distance:"8.3 km",price:1200,eta:"45 min",time:"15 Mar · 09:00 AM",description:"Necesito instalar un boiler de paso nuevo. Ya tengo el equipo comprado.",photos:3,urgent:false },
];

const ACTIVE_SERVICES = [
  { id:3001,type:"Plomería",subtype:"Destape de drenaje",client:"Ana M.",location:"Querétaro Centro",time:"14 Mar · 10:00 AM",status:"en_camino",price:380 },
  { id:3002,type:"Cerrajería",subtype:"Cambio de cerradura",client:"Luis P.",location:"Querétaro Centro",time:"17 Mar · 10:00 AM",status:"programado",price:450 },
];

const COMPLETED_SERVICES = [
  { id:4001,type:"Plomería",subtype:"Fuga de agua",client:"Francisco G.",date:"10 May",amount:540,netAmount:459,rating:5,tip:50 },
  { id:4002,type:"Electricidad",subtype:"Instalación contactos",client:"María L.",date:"28 Abr",amount:550,netAmount:467,rating:4,tip:0 },
  { id:4003,type:"Plomería",subtype:"Destape de drenaje",client:"Roberto S.",date:"15 Abr",amount:380,netAmount:323,rating:5,tip:100 },
  { id:4004,type:"Cerrajería",subtype:"Apertura de puerta",client:"Ana M.",date:"2 Abr",amount:300,netAmount:255,rating:5,tip:20 },
];

const MY_REVIEWS_DATA = [
  { from:"Francisco G.",rating:5,text:"Carlos es excelente, muy profesional y limpio en su trabajo. Lo recomiendo totalmente.",date:"10 May 2026",tags:["Profesional","Limpio","Puntual"] },
  { from:"María L.",rating:4,text:"Buen trabajo, resolvió el problema rápido. Un poco caro pero vale la pena.",date:"28 Abr 2026",tags:["Eficiente","Buen precio"] },
  { from:"Roberto S.",rating:5,text:"Increíble servicio. Llegó antes de tiempo y dejó todo impecable.",date:"15 Abr 2026",tags:["Puntual","Limpio","Amable"] },
];

// ─── REUSABLE COMPONENTS ───

const StatusBar = () => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 20px 4px",fontSize:12,fontWeight:600,color:C.textPrimary}}>
    <span>9:41</span>
    <div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:10}}>●●●●</span><span style={{fontSize:10}}>WiFi</span><span style={{fontSize:11}}>🔋</span></div>
  </div>
);

const NavHeader = ({title,onBack,rightAction,rightIcon}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      {onBack && <button onClick={onBack} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",padding:0,color:C.textPrimary}}>←</button>}
      <span style={{fontSize:18,fontWeight:700,color:C.textPrimary}}>{title}</span>
    </div>
    {rightAction && <button onClick={rightAction} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.textSecondary}}>{rightIcon||"⋯"}</button>}
  </div>
);

const BottomNav = ({active,onNavigate}) => {
  const tabs = [
    {id:"home",label:"Inicio",icon:"🏠",screen:S.DASHBOARD},
    {id:"requests",label:"Solicitudes",icon:"📋",screen:S.REQUESTS},
    {id:"earnings",label:"Ganancias",icon:"💰",screen:S.EARNINGS},
    {id:"profile",label:"Perfil",icon:"👤",screen:S.PROFILE_HUB},
  ];
  return (
    <div style={{display:"flex",borderTop:`1px solid ${C.border}`,background:C.white,paddingBottom:8}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onNavigate(t.screen)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 0 4px",background:"none",border:"none",cursor:"pointer",color:active===t.id?C.primary:C.textMuted,fontWeight:active===t.id?700:400,fontSize:10,transition:"all 0.2s"}}>
          <span style={{fontSize:20}}>{t.icon}</span><span>{t.label}</span>
          {active===t.id && <div style={{width:20,height:3,borderRadius:2,background:C.primary,marginTop:2}}/>}
        </button>
      ))}
    </div>
  );
};

const Btn = ({children,onClick,variant="primary",full=true,size="md",disabled=false,style:sx={}}) => {
  const base = {border:"none",borderRadius:14,cursor:disabled?"default":"pointer",fontWeight:700,transition:"all 0.2s",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",...sx};
  const sizes = {sm:{padding:"10px 16px",fontSize:13},md:{padding:"14px 24px",fontSize:15},lg:{padding:"18px 32px",fontSize:16}};
  const variants = {
    primary:{background:C.accent,color:C.white},
    secondary:{background:C.primaryLight,color:C.primary},
    outline:{background:"transparent",color:C.primary,border:`2px solid ${C.primary}`},
    danger:{background:C.danger,color:C.white},
    ghost:{background:"transparent",color:C.textSecondary},
    success:{background:C.success,color:C.white},
  };
  return <button onClick={disabled?undefined:onClick} style={{...base,...sizes[size],...variants[variant]}}>{children}</button>;
};

const Card = ({children,onClick,style:sx={}}) => (
  <div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,boxShadow:C.shadow,border:`1px solid ${C.border}`,cursor:onClick?"pointer":"default",transition:"all 0.2s",...sx}}>{children}</div>
);

const Stars = ({rating,size=18,interactive=false,onChange}) => (
  <div style={{display:"flex",gap:2}}>
    {[1,2,3,4,5].map(i=>(
      <span key={i} onClick={()=>interactive&&onChange?.(i)} style={{fontSize:size,cursor:interactive?"pointer":"default",color:i<=rating?C.star:"#E5E7EB",display:"inline-block"}}>{i<=rating?"★":"☆"}</span>
    ))}
  </div>
);

const Badge = ({children,color=C.primary,bg}) => (
  <span style={{display:"inline-block",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,color,background:bg||(color+"18")}}>{children}</span>
);

const InputField = ({label,placeholder,value,onChange,type="text",icon,multiline=false}) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:"block",fontSize:13,fontWeight:600,color:C.textSecondary,marginBottom:6}}>{label}</label>}
    <div style={{display:"flex",alignItems:multiline?"flex-start":"center",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 14px",background:C.white,gap:8}}>
      {icon && <span style={{fontSize:16}}>{icon}</span>}
      {multiline ? (
        <textarea placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} style={{border:"none",outline:"none",flex:1,fontSize:14,fontFamily:"inherit",color:C.textPrimary,background:"transparent",resize:"none",minHeight:60}}/>
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} style={{border:"none",outline:"none",flex:1,fontSize:14,fontFamily:"inherit",color:C.textPrimary,background:"transparent"}}/>
      )}
    </div>
  </div>
);

const ProgressDots = ({current,total}) => (
  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
    {Array.from({length:total},(_,i)=>(
      <div key={i} style={{width:i===current?24:8,height:8,borderRadius:4,background:i===current?C.primary:"#D1D5DB",transition:"all 0.3s"}}/>
    ))}
  </div>
);

const SectionTitle = ({children,action,onAction}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
    <span style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{children}</span>
    {action && <button onClick={onAction} style={{background:"none",border:"none",color:C.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>{action}</button>}
  </div>
);

const StatBox = ({val,label,icon}) => (
  <Card style={{textAlign:"center",padding:14,flex:1}}>
    {icon && <div style={{fontSize:18,marginBottom:4}}>{icon}</div>}
    <div style={{fontSize:18,fontWeight:800,color:C.primary}}>{val}</div>
    <div style={{fontSize:11,color:C.textMuted}}>{label}</div>
  </Card>
);

const Toggle = ({on,onToggle,labelOn="Disponible",labelOff="No disponible"}) => (
  <button onClick={onToggle} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderRadius:16,border:`2px solid ${on?C.success:C.border}`,background:on?C.successLight:C.bg,cursor:"pointer",width:"100%",transition:"all 0.3s"}}>
    <div style={{width:48,height:28,borderRadius:14,background:on?C.success:"#D1D5DB",padding:2,transition:"all 0.3s"}}>
      <div style={{width:24,height:24,borderRadius:12,background:C.white,marginLeft:on?20:0,transition:"margin 0.3s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
    </div>
    <div style={{textAlign:"left"}}>
      <div style={{fontSize:15,fontWeight:700,color:on?C.success:C.textMuted}}>{on?labelOn:labelOff}</div>
      <div style={{fontSize:11,color:C.textMuted}}>{on?"Recibirás solicitudes cercanas":"No recibes solicitudes"}</div>
    </div>
    <div style={{marginLeft:"auto",width:10,height:10,borderRadius:5,background:on?C.success:"#D1D5DB"}}/>
  </button>
);

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function AlTiroTechApp() {
  const [screen,setScreen] = useState(S.SPLASH);
  const [history,setHistory] = useState([]);
  const [activeTab,setActiveTab] = useState("home");
  const [available,setAvailable] = useState(true);
  const [selectedReq,setSelectedReq] = useState(null);
  const [clientRating,setClientRating] = useState(0);
  const [agreementItems,setAgreementItems] = useState([
    {text:"Reparación de fuga en unión de tubería de cocina",done:false},
    {text:"Cambio de empaque deteriorado",done:false},
    {text:"Revisión de presión en línea de agua",done:false},
  ]);
  const [progressChecked,setProgressChecked] = useState([false,false,false]);
  const [earningsTab,setEarningsTab] = useState("dia");
  const [obStep,setObStep] = useState(0);
  const [selTags,setSelTags] = useState([]);

  const nav = useCallback((s)=>{
    setHistory(h=>[...h,screen]);
    setScreen(s);
    if(s===S.DASHBOARD) setActiveTab("home");
    if(s===S.REQUESTS) setActiveTab("requests");
    if(s===S.EARNINGS) setActiveTab("earnings");
    if(s===S.PROFILE_HUB) setActiveTab("profile");
  },[screen]);

  const back = useCallback(()=>{
    if(history.length>0){
      const prev = history[history.length-1];
      setHistory(h=>h.slice(0,-1));
      setScreen(prev);
      if(prev===S.DASHBOARD) setActiveTab("home");
      if(prev===S.REQUESTS) setActiveTab("requests");
      if(prev===S.EARNINGS) setActiveTab("earnings");
      if(prev===S.PROFILE_HUB) setActiveTab("profile");
    }
  },[history]);

  const resetFlow = ()=>{
    setSelectedReq(null);setClientRating(0);
    setProgressChecked([false,false,false]);
    setHistory([]);setScreen(S.DASHBOARD);setActiveTab("home");
  };

  useEffect(()=>{
    if(screen===S.SPLASH){const t=setTimeout(()=>setScreen(S.OB1),2000);return ()=>clearTimeout(t);}
  },[screen]);

  const showNav = [S.DASHBOARD,S.REQUESTS,S.EARNINGS,S.TRANSACTIONS,S.WITHDRAW,S.PROFILE_HUB,S.EDIT_INFO,S.SPECIALTIES,S.DOCUMENTS,S.PORTFOLIO,S.MY_REVIEWS,S.BANK_ACCOUNT,S.SETTINGS_PAGE,S.HELP,S.NOTIFS].includes(screen);

  // ═══ 1. ONBOARDING (7 pantallas) ═══

  const renderSplash = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(145deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
      <div style={{fontSize:48,marginBottom:8}}>🐦</div>
      <div style={{fontSize:36,fontWeight:800,color:C.white,letterSpacing:-1}}>alTiro</div>
      <div style={{fontSize:14,color:"rgba(255,255,255,0.85)",marginTop:4,fontWeight:600}}>Portal Técnico</div>
      <div style={{position:"absolute",bottom:60,display:"flex",gap:4}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:"rgba(255,255,255,0.5)",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}
      </div>
    </div>
  );

  const renderOnboarding = (step) => {
    const slides = [
      {icon:"🏠",title:"Recibe trabajos cerca de ti",desc:"Te conectamos con clientes verificados en tu zona. Tú decides qué solicitudes aceptar y cuándo trabajar.",bg:C.primaryLight},
      {icon:"💰",title:"Cobra de forma segura",desc:"El pago se retiene hasta que el servicio esté confirmado. Recibes tu dinero vía SPEI en 24-48 horas, siempre.",bg:C.accentLight},
      {icon:"⭐",title:"Construye tu reputación",desc:"Tu perfil verificado, portafolio y reseñas te posicionan como el mejor de tu zona. Más reputación = más clientes.",bg:C.goldLight},
    ];
    const s = slides[step];
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",background:s.bg,margin:16,borderRadius:24}}>
          <div style={{fontSize:72,marginBottom:24}}>{s.icon}</div>
          <div style={{fontSize:24,fontWeight:800,color:C.textPrimary,textAlign:"center",marginBottom:12}}>{s.title}</div>
          <div style={{fontSize:15,color:C.textSecondary,textAlign:"center",lineHeight:1.6}}>{s.desc}</div>
        </div>
        <div style={{padding:"20px 24px 32px"}}>
          <ProgressDots current={step} total={3}/>
          <div style={{marginTop:20,display:"flex",gap:12}}>
            {step>0 && <Btn variant="ghost" full={false} onClick={()=>{setObStep(step-1);setScreen([S.OB1,S.OB2,S.OB3][step-1]);}}>Atrás</Btn>}
            <Btn onClick={()=>{if(step<2){setObStep(step+1);setScreen([S.OB1,S.OB2,S.OB3][step+1]);}else nav(S.LOGIN);}}>{step<2?"Siguiente":"Comenzar"}</Btn>
          </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white,padding:24}}>
      <div style={{marginTop:20,marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:28}}>🐦</span><span style={{fontSize:24,fontWeight:800,color:C.primary}}>alTiro</span>
          <Badge color={C.accent}>Técnico</Badge>
        </div>
        <div style={{fontSize:26,fontWeight:800,color:C.textPrimary,marginBottom:4}}>Bienvenido, técnico</div>
        <div style={{fontSize:14,color:C.textSecondary}}>Inicia sesión o regístrate para ofrecer tus servicios</div>
      </div>
      <InputField label="Número de teléfono" placeholder="442 123 4567" icon="📱"/>
      <Btn onClick={()=>nav(S.OTP)}>Continuar con teléfono</Btn>
      <div style={{textAlign:"center",margin:"20px 0",color:C.textMuted,fontSize:13}}>— o continúa con —</div>
      <div style={{display:"flex",gap:12}}>
        <Btn variant="outline" onClick={()=>nav(S.OTP)}>🔵 Google</Btn>
        <Btn variant="outline" onClick={()=>nav(S.OTP)}>⚫ Apple</Btn>
      </div>
      <div style={{marginTop:"auto",textAlign:"center",fontSize:11,color:C.textMuted,lineHeight:1.6}}>
        Al continuar, aceptas nuestros <span style={{color:C.primary,fontWeight:600}}>Términos de Servicio</span> y <span style={{color:C.primary,fontWeight:600}}>Política de Privacidad</span>
      </div>
    </div>
  );

  const renderOTP = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white}}>
      <NavHeader title="Verificación" onBack={back}/>
      <div style={{padding:24,flex:1}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>Ingresa el código</div>
        <div style={{fontSize:14,color:C.textSecondary,marginBottom:32}}>Enviamos un SMS al <strong>442 •••• 4567</strong></div>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:32}}>
          {[3,8,1,5].map((n,i)=>(
            <div key={i} style={{width:52,height:56,borderRadius:12,border:`2px solid ${C.primary}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:C.textPrimary}}>{n}</div>
          ))}
        </div>
        <Btn onClick={()=>nav(S.PERSONAL_DATA)}>Verificar</Btn>
        <div style={{textAlign:"center",marginTop:20,fontSize:13,color:C.textMuted}}>¿No recibiste el código? <span style={{color:C.primary,fontWeight:600,cursor:"pointer"}}>Reenviar</span></div>
      </div>
    </div>
  );

  const renderPersonalData = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white,overflowY:"auto"}}>
      <NavHeader title="Datos personales" onBack={back}/>
      <div style={{padding:"8px 16px 4px"}}>
        <div style={{display:"flex",gap:4}}>
          {["Datos","Profesional","Verificación"].map((s,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i===0?C.primary:C.border}}/>
          ))}
        </div>
        <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>Paso 1 de 3</div>
      </div>
      <div style={{padding:16,flex:1}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:40,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,border:`3px dashed ${C.primary}`,cursor:"pointer"}}>📷</div>
        </div>
        <InputField label="Nombre completo" placeholder="Carlos Mendoza López" icon="👤"/>
        <InputField label="Correo electrónico" placeholder="carlos@email.com" icon="✉️" type="email"/>
        <InputField label="CURP" placeholder="MELC900101HQRNPS08" icon="🆔"/>
        <SectionTitle>Identificación oficial (INE)</SectionTitle>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {["Frente","Vuelta"].map((side,i)=>(
            <div key={i} style={{flex:1,height:80,borderRadius:12,border:`2px dashed ${C.primary}`,background:C.primaryLight,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4}}>
              <span style={{fontSize:20}}>📄</span>
              <span style={{fontSize:11,fontWeight:600,color:C.primary}}>INE {side}</span>
            </div>
          ))}
        </div>
        <InputField label="Comprobante de domicilio" placeholder="Subir archivo PDF o imagen" icon="🏠"/>
        <div style={{marginTop:8}}>
          <Btn onClick={()=>nav(S.PROF_PROFILE)}>Continuar al perfil profesional</Btn>
        </div>
      </div>
    </div>
  );

  const renderProfProfile = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white,overflowY:"auto"}}>
      <NavHeader title="Perfil profesional" onBack={back}/>
      <div style={{padding:"8px 16px 4px"}}>
        <div style={{display:"flex",gap:4}}>
          {["Datos","Profesional","Verificación"].map((s,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=1?C.primary:C.border}}/>
          ))}
        </div>
        <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>Paso 2 de 3</div>
      </div>
      <div style={{padding:16,flex:1}}>
        <SectionTitle>Especialidades (selecciona al menos 1)</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
          {SPECIALTIES_DATA.map((sp,i)=>{
            const sel = i<2;
            return (
              <div key={sp.id} style={{padding:12,borderRadius:12,border:`2px solid ${sel?C.primary:C.border}`,background:sel?C.primaryLight:C.white,textAlign:"center",cursor:"pointer"}}>
                <div style={{fontSize:22,marginBottom:4}}>{sp.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:sel?C.primary:C.textSecondary}}>{sp.name}</div>
              </div>
            );
          })}
        </div>

        <SectionTitle>Tarifas base por servicio</SectionTitle>
        <Card style={{marginBottom:16}}>
          {[{name:"Plomería — General",val:"$450"},{name:"Plomería — Emergencia",val:"$650"},{name:"Electricidad — General",val:"$500"}].map((t,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?`1px solid ${C.border}`:"none",fontSize:13}}>
              <span>{t.name}</span><span style={{fontWeight:700,color:C.primary}}>{t.val} MXN</span>
            </div>
          ))}
        </Card>

        <SectionTitle>Zona de cobertura</SectionTitle>
        <div style={{height:120,borderRadius:16,background:`linear-gradient(135deg, ${C.primaryLight} 0%, #D1FAE5 100%)`,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{width:80,height:80,borderRadius:40,border:`3px dashed ${C.primary}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:12,height:12,borderRadius:6,background:C.primary}}/>
          </div>
          <div style={{position:"absolute",bottom:8,right:12,background:C.white,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:600}}>Radio: 10 km</div>
        </div>

        <SectionTitle>Certificaciones</SectionTitle>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["📄 Subir certificación","📸 Tomar foto"].map((opt,i)=>(
            <div key={i} style={{flex:1,padding:14,borderRadius:12,border:`2px dashed ${C.primary}`,background:C.primaryLight,textAlign:"center",cursor:"pointer",fontSize:12,fontWeight:600,color:C.primary}}>{opt}</div>
          ))}
        </div>

        <SectionTitle>Portafolio (fotos de trabajos)</SectionTitle>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:72,height:72,borderRadius:12,border:`2px dashed ${i===0?C.primary:C.border}`,background:i===0?C.primaryLight:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:i===0?11:24,color:i===0?C.primary:C.textMuted,cursor:"pointer"}}>
              {i===0?<span style={{textAlign:"center"}}>📷<br/><span style={{fontSize:9}}>Agregar</span></span>:"+"}
            </div>
          ))}
        </div>

        <Btn onClick={()=>nav(S.VERIF_STATUS)}>Enviar para verificación</Btn>
      </div>
    </div>
  );

  const renderVerifStatus = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.white}}>
      <NavHeader title="Estado de verificación" onBack={back}/>
      <div style={{padding:"8px 16px 4px"}}>
        <div style={{display:"flex",gap:4}}>
          {["Datos","Profesional","Verificación"].map((_,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:C.primary}}/>
          ))}
        </div>
        <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>Paso 3 de 3</div>
      </div>
      <div style={{padding:24,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:88,height:88,borderRadius:44,background:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:16}}>🔍</div>
        <div style={{fontSize:22,fontWeight:800,color:C.textPrimary,textAlign:"center",marginBottom:4}}>Tu perfil está en revisión</div>
        <div style={{fontSize:14,color:C.textSecondary,textAlign:"center",marginBottom:28,lineHeight:1.6}}>Nuestro equipo está verificando tu información. Te notificaremos cuando esté listo.</div>

        <Card style={{width:"100%",marginBottom:24}}>
          {[
            {label:"Identidad (INE)",status:"verified",icon:"✅"},
            {label:"CURP",status:"verified",icon:"✅"},
            {label:"Comprobante de domicilio",status:"pending",icon:"⏳"},
            {label:"Antecedentes",status:"pending",icon:"⏳"},
            {label:"Certificaciones",status:"review",icon:"🔍"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
              <span style={{fontSize:13,fontWeight:600}}>{item.label}</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14}}>{item.icon}</span>
                <span style={{fontSize:11,color:item.status==="verified"?C.success:item.status==="review"?C.gold:C.textMuted,fontWeight:600}}>
                  {item.status==="verified"?"Verificado":item.status==="review"?"En revisión":"Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </Card>

        <div style={{fontSize:12,color:C.textMuted,textAlign:"center",marginBottom:20}}>Tiempo estimado: 24-48 horas hábiles</div>
        <Btn variant="secondary" onClick={()=>{setActiveTab("home");setHistory([]);setScreen(S.DASHBOARD);}}>Ir al inicio (demo) ›</Btn>
      </div>
    </div>
  );

  // ═══ 2. DASHBOARD (1 pantalla) ═══

  const renderDashboard = () => (
    <div style={{flex:1,background:C.bg,overflowY:"auto"}}>
      <div style={{background:`linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,padding:"20px 20px 28px",borderRadius:"0 0 28px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:18}}>🐦</span><span style={{fontSize:18,fontWeight:800,color:C.white}}>alTiro</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.15)",padding:"2px 8px",borderRadius:10,fontWeight:600}}>Técnico</span>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:C.white}}>Hola, Carlos 👋</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Recibe trabajos cerca de ti</div>
          </div>
          <button onClick={()=>nav(S.NOTIFS)} style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"none",fontSize:18,cursor:"pointer",color:C.white,position:"relative"}}>
            🔔<div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:4,background:C.accent}}/>
          </button>
        </div>
        <Toggle on={available} onToggle={()=>setAvailable(!available)}/>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Today's Summary */}
        <SectionTitle>Resumen de hoy</SectionTitle>
        <Card style={{marginBottom:16,background:`linear-gradient(135deg, ${C.goldLight} 0%, #FFF 100%)`,border:`1px solid ${C.gold}30`}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:28,fontWeight:800,color:C.gold}}>$1,470.00 <span style={{fontSize:14}}>MXN</span></div>
            <div style={{fontSize:12,color:C.textMuted}}>Ganancias del día</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            {[{val:"3",label:"Servicios",icon:"🛠"},{val:"4.8",label:"Calificación",icon:"⭐"},{val:"$490",label:"Promedio",icon:"📊"}].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:14}}>{s.icon}</div>
                <div style={{fontSize:16,fontWeight:800,color:C.textPrimary}}>{s.val}</div>
                <div style={{fontSize:10,color:C.textMuted}}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
          <StatBox val="138" label="Reseñas" icon="📝"/>
          <StatBox val="2,340" label="A domicilio" icon="🏠"/>
        </div>
        <Card style={{marginBottom:16,background:C.successLight,border:`1px solid ${C.success}30`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>✅</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.primaryDark}}>Técnico verificado</div>
              <div style={{fontSize:12,color:C.textSecondary}}>Tu perfil está activo y visible para clientes</div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Btn onClick={()=>nav(S.REQUESTS)}>Ver trabajos disponibles</Btn>

        {/* Active services quick view */}
        {ACTIVE_SERVICES.length>0 && (
          <div style={{marginTop:20}}>
            <SectionTitle action="Ver todo" onAction={()=>nav(S.REQUESTS)}>En curso</SectionTitle>
            {ACTIVE_SERVICES.slice(0,1).map(svc=>(
              <Card key={svc.id} onClick={()=>{setSelectedReq(INCOMING_REQUESTS[0]);nav(S.CONFIRM_ARRIVAL);}} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔧</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700}}>{svc.subtype}</div>
                  <div style={{fontSize:12,color:C.textMuted}}>{svc.client} · {svc.location}</div>
                </div>
                <Badge color={C.accent}>En camino</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ═══ 3. SOLICITUDES (4 pantallas) ═══

  const renderRequests = () => (
    <div style={{flex:1,background:C.bg,overflowY:"auto"}}>
      <div style={{padding:"16px 16px 8px"}}>
        <div style={{fontSize:22,fontWeight:800,color:C.textPrimary}}>Solicitudes</div>
      </div>
      <div style={{display:"flex",gap:8,padding:"4px 16px 8px"}}>
        {["📅 Fecha","📍 Zona","💰 Ganancia"].map((f,i)=>(
          <button key={i} style={{padding:"8px 12px",borderRadius:20,border:`1.5px solid ${i===0?C.primary:C.border}`,background:i===0?C.primaryLight:C.white,fontSize:11,fontWeight:600,color:i===0?C.primary:C.textSecondary,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</button>
        ))}
      </div>
      <div style={{padding:"0 16px"}}>
        <SectionTitle>Solicitudes nuevas</SectionTitle>
        {INCOMING_REQUESTS.map(req=>(
          <Card key={req.id} onClick={()=>{setSelectedReq(req);nav(S.REQ_DETAIL);}} style={{marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",gap:12}}>
              <div style={{width:48,height:48,borderRadius:14,background:req.urgent?C.accentLight:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,position:"relative"}}>
                {req.icon}
                {req.urgent && <div style={{position:"absolute",top:-4,right:-4,background:C.danger,borderRadius:8,padding:"1px 5px",fontSize:8,color:C.white,fontWeight:700}}>URGENTE</div>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:700}}>{req.type}</div>
                    <div style={{fontSize:12,color:C.textMuted}}>📍 {req.location} · {req.distance}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:800,color:C.primary}}>${req.price}</div>
                    <div style={{fontSize:10,color:C.textMuted}}>MXN est.</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.textSecondary,marginTop:4}}>{req.subtype} · {req.time}</div>
                <div style={{display:"flex",gap:8,marginTop:6}}>
                  <Badge color={C.textSecondary}>⏱ {req.eta}</Badge>
                  <Badge color={C.textSecondary}>📷 {req.photos} fotos</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div style={{marginTop:8}}>
          <SectionTitle>En curso</SectionTitle>
          {ACTIVE_SERVICES.map(svc=>(
            <Card key={svc.id} onClick={()=>{setSelectedReq(INCOMING_REQUESTS[0]);nav(S.NAVIGATION);}} style={{marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔧</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{svc.subtype}</div>
                <div style={{fontSize:12,color:C.textMuted}}>{svc.client} · {svc.location} · {svc.time}</div>
              </div>
              <Badge color={svc.status==="en_camino"?C.accent:C.textMuted}>{svc.status==="en_camino"?"En camino":"Programado"}</Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReqDetail = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <NavHeader title="Detalle de solicitud" onBack={back}/>
        <div style={{padding:16}}>
          {r.urgent && <Card style={{marginBottom:12,background:C.dangerLight,border:`1px solid ${C.danger}30`,padding:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:700,color:C.danger}}>🚨 Solicitud urgente — El cliente necesita atención inmediata</div>
          </Card>}

          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:800}}>{r.type}</div>
                <div style={{fontSize:13,color:C.textMuted}}>{r.subtype}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:800,color:C.primary}}>${r.price}</div>
                <div style={{fontSize:11,color:C.textMuted}}>MXN estimado</div>
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              {[
                {l:"Comisión alTiro (10%)",v:`-$${Math.round(r.price*0.1)}`},
                {l:"Tu ganancia neta",v:`$${Math.round(r.price*0.9)}`,bold:true},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:row.bold?C.primary:C.textSecondary,fontWeight:row.bold?800:400}}>
                  <span>{row.l}</span><span>{row.v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Información del cliente</SectionTitle>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:14,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👨</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{r.client}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Stars rating={Math.floor(r.clientRating)} size={12}/>
                  <span style={{fontSize:12,fontWeight:600}}>{r.clientRating}</span>
                  <span style={{fontSize:11,color:C.textMuted}}>· {r.clientJobs} servicios</span>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Ubicación</SectionTitle>
            <div style={{height:100,borderRadius:12,background:`linear-gradient(135deg, ${C.primaryLight} 0%, #D1FAE5 100%)`,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{fontSize:24}}>📍</div>
              <div style={{position:"absolute",bottom:8,left:8,background:C.white,borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:600}}>{r.distance}</div>
            </div>
            <div style={{fontSize:13,fontWeight:600}}>📍 {r.address}</div>
            <div style={{fontSize:12,color:C.textMuted}}>⏱ Llegada estimada: {r.eta}</div>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Descripción del problema</SectionTitle>
            <div style={{fontSize:13,color:C.textSecondary,lineHeight:1.6,marginBottom:8}}>{r.description}</div>
            <div style={{display:"flex",gap:8}}>
              {Array.from({length:r.photos},(_,i)=>(
                <div key={i} style={{width:64,height:64,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🖼️</div>
              ))}
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <div style={{fontSize:12,color:C.textMuted}}>📅 {r.time}</div>
          </Card>

          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>nav(S.REQ_ACCEPTED)}>✓ Aceptar solicitud</Btn>
          </div>
          <div style={{marginTop:8}}><Btn variant="ghost" onClick={back}>Rechazar</Btn></div>
        </div>
      </div>
    );
  };

  const renderReqAccepted = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{width:88,height:88,borderRadius:44,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:16}}>✅</div>
        <div style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:4,textAlign:"center"}}>¡Solicitud aceptada!</div>
        <div style={{fontSize:14,color:C.textSecondary,textAlign:"center",marginBottom:4}}>{r.type} — {r.subtype}</div>
        <div style={{fontSize:13,color:C.textMuted,textAlign:"center",marginBottom:24}}>📍 {r.address}</div>
        <Card style={{width:"100%",marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:13,color:C.textMuted}}>Ganancia estimada</div>
          <div style={{fontSize:28,fontWeight:800,color:C.primary}}>${Math.round(r.price*0.9)} <span style={{fontSize:14}}>MXN</span></div>
        </Card>
        <Btn onClick={()=>nav(S.NAVIGATION)}>🗺 Iniciar navegación</Btn>
        <div style={{marginTop:8,width:"100%"}}><Btn variant="ghost" onClick={()=>nav(S.REQUESTS)}>Volver a solicitudes</Btn></div>
      </div>
    );
  };

  const renderNavigation = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{height:240,background:`linear-gradient(135deg, ${C.primaryLight} 0%, #D1FAE5 100%)`,position:"relative"}}>
          <div style={{position:"absolute",top:16,left:16}}>
            <button onClick={back} style={{width:36,height:36,borderRadius:10,background:C.white,border:"none",fontSize:16,cursor:"pointer",boxShadow:C.shadow}}>←</button>
          </div>
          <div style={{position:"absolute",top:"35%",left:"25%",fontSize:28}}>🚗</div>
          <div style={{position:"absolute",top:"55%",left:"35%",width:80,height:2,background:C.primary,opacity:0.3,transform:"rotate(-15deg)"}}/>
          <div style={{position:"absolute",top:"60%",right:"25%",fontSize:24}}>📍</div>
          <div style={{position:"absolute",bottom:12,left:12,right:12,background:C.white,borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:C.shadow}}>
            <div><div style={{fontSize:12,fontWeight:600}}>Tiempo estimado de llegada</div><div style={{fontSize:11,color:C.textMuted}}>📍 {r.address}</div></div>
            <div style={{fontSize:22,fontWeight:800,color:C.primary}}>{r.eta}</div>
          </div>
        </div>
        <div style={{padding:16,flex:1}}>
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{r.client}</div>
                <div style={{fontSize:12,color:C.textMuted}}>{r.type} · {r.subtype}</div>
              </div>
              <button style={{width:40,height:40,borderRadius:12,background:C.primaryLight,border:"none",fontSize:18,cursor:"pointer"}}>💬</button>
            </div>
          </Card>

          <Card style={{marginBottom:12,background:C.accentLight,border:`1px solid ${C.accent}30`,padding:12}}>
            <div style={{fontSize:12,color:C.accent,fontWeight:600}}>ⓘ El chat solo está activo durante el servicio</div>
          </Card>

          <Btn onClick={()=>nav(S.CONFIRM_ARRIVAL)}>📍 He llegado al domicilio</Btn>
        </div>
      </div>
    );
  };

  // ═══ 4. DURANTE SERVICIO (4 pantallas) ═══

  const renderConfirmArrival = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{width:96,height:96,borderRadius:24,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:16}}>🏠</div>
        <div style={{fontSize:20,fontWeight:800,color:C.textPrimary,textAlign:"center",marginBottom:4}}>¿Llegaste al domicilio?</div>
        <div style={{fontSize:14,color:C.textSecondary,textAlign:"center",marginBottom:8}}>📍 {r.address}</div>
        <div style={{fontSize:13,color:C.textMuted,textAlign:"center",marginBottom:28}}>El cliente recibirá una notificación para confirmar tu llegada</div>
        <div style={{width:"100%",maxWidth:300}}>
          <Btn onClick={()=>nav(S.CREATE_AGREEMENT)}>✓ Confirmar llegada</Btn>
          <div style={{height:8}}/>
          <Btn variant="ghost" onClick={back}>Aún no he llegado</Btn>
        </div>
      </div>
    );
  };

  const renderCreateAgreement = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <NavHeader title="Crear acuerdo de servicio" onBack={back}/>
        <div style={{background:C.accentLight,padding:"10px 16px",fontSize:12,color:C.accent,fontWeight:600}}>
          ⚠️ El cliente debe aceptar este acuerdo antes de que puedas iniciar
        </div>
        <div style={{padding:16}}>
          <Card style={{marginBottom:16}}>
            <SectionTitle>Trabajos a realizar</SectionTitle>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Tras inspeccionar el problema, detalla lo que se necesita hacer:</div>
            {agreementItems.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<agreementItems.length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{color:C.success}}>✓</span>
                <span style={{fontSize:13,flex:1}}>{item.text}</span>
                <button style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:14}}>✏️</button>
              </div>
            ))}
            <button onClick={()=>setAgreementItems([...agreementItems,{text:"Nuevo ítem de trabajo",done:false}])} style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:600,fontSize:13}}>
              ＋ Agregar ítem
            </button>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Materiales necesarios</SectionTitle>
            {[
              {item:'Empaque universal 1/2"',cost:"$35"},
              {item:"Cinta teflón",cost:"$15"},
              {item:"Silicón sellador",cost:"$45"},
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?`1px solid ${C.border}`:"none",fontSize:13}}>
                <span>{m.item}</span><span style={{fontWeight:600,color:C.primary}}>{m.cost}</span>
              </div>
            ))}
            <button style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:600,fontSize:13}}>＋ Agregar material</button>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Costos</SectionTitle>
            <InputField label="Mano de obra" placeholder="$0.00" value="$395.00" icon="💰"/>
            <InputField label="Tiempo estimado" placeholder="En minutos" value="45 minutos" icon="⏱"/>
          </Card>

          <Card style={{marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Resumen para el cliente</div>
            {[
              {l:"Mano de obra",v:"$395.00"},
              {l:"Materiales",v:"$95.00"},
              {l:"Comisión alTiro (10%)",v:"$49.00"},
              {l:"IVA",v:"$7.84"},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:C.textSecondary}}>
                <span>{row.l}</span><span style={{fontWeight:600}}>{row.v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:8,borderTop:`2px solid ${C.primary}`,fontSize:16,fontWeight:800,color:C.primary}}>
              <span>Total cliente</span><span>$546.84 MXN</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0 0",fontSize:13,color:C.success,fontWeight:700}}>
              <span>Tu ganancia neta</span><span>$459.00 MXN</span>
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Observaciones</SectionTitle>
            <textarea placeholder="Notas adicionales para el cliente..." style={{width:"100%",height:60,border:`1.5px solid ${C.border}`,borderRadius:12,padding:12,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box"}}/>
          </Card>

          <Btn onClick={()=>nav(S.SVC_PROGRESS)}>Enviar acuerdo al cliente</Btn>
          <div style={{textAlign:"center",marginTop:8,fontSize:12,color:C.textMuted}}>El servicio inicia cuando ambas partes acepten</div>
        </div>
      </div>
    );
  };

  const renderSvcProgress = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    const allChecked = progressChecked.every(Boolean);
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <NavHeader title="Servicio activo" rightIcon="⋯"/>
        <div style={{padding:16}}>
          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{r.client}</div>
                <div style={{fontSize:12,color:C.textMuted}}>{r.type} — {r.subtype}</div>
              </div>
              <button style={{width:36,height:36,borderRadius:10,background:C.primaryLight,border:"none",fontSize:16,cursor:"pointer"}}>💬</button>
            </div>
            <div style={{display:"flex",gap:6}}>
              <Badge color={C.success}>✓ Llegaste y estás trabajando</Badge>
              <Badge color={C.primary}>✓ Acuerdo firmado</Badge>
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <div style={{textAlign:"center",padding:"12px 0",background:C.bg,borderRadius:12,marginBottom:12}}>
              <div style={{fontSize:32,fontWeight:800,color:C.primary,fontVariantNumeric:"tabular-nums"}}>00:32:15</div>
              <div style={{fontSize:12,color:C.textMuted}}>Tiempo transcurrido</div>
            </div>
          </Card>

          <Card style={{marginBottom:16}}>
            <SectionTitle>Checklist del acuerdo</SectionTitle>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>Marca cada ítem conforme lo completes:</div>
            {agreementItems.map((item,i)=>(
              <div key={i} onClick={()=>{const nc=[...progressChecked];nc[i]=!nc[i];setProgressChecked(nc);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<agreementItems.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}}>
                <div style={{width:24,height:24,borderRadius:8,border:`2px solid ${progressChecked[i]?C.success:C.border}`,background:progressChecked[i]?C.success:C.white,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                  {progressChecked[i] && <span style={{color:C.white,fontSize:12,fontWeight:700}}>✓</span>}
                </div>
                <span style={{fontSize:13,color:progressChecked[i]?C.textMuted:C.textPrimary,textDecoration:progressChecked[i]?"line-through":"none"}}>{item.text}</span>
              </div>
            ))}
          </Card>

          <Card style={{marginBottom:16,background:C.accentLight,border:`1px solid ${C.accent}30`,padding:12}}>
            <div style={{fontSize:12,color:C.accent,fontWeight:600}}>ⓘ Mantén comunicación abierta en el chat. Todo el proceso queda registrado.</div>
          </Card>

          <Btn onClick={()=>nav(S.MARK_COMPLETE)} disabled={!allChecked}>{allChecked?"Marcar como completado":"Completa todos los ítems"}</Btn>
          <div style={{marginTop:8}}><Btn variant="danger" size="sm" onClick={()=>{}}>🚨 Reportar problema</Btn></div>
        </div>
      </div>
    );
  };

  const renderMarkComplete = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Completar servicio" onBack={back}/>
      <div style={{padding:24,flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:80,height:80,borderRadius:20,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16}}>📸</div>
        <div style={{fontSize:20,fontWeight:800,color:C.textPrimary,textAlign:"center",marginBottom:4}}>Documenta el resultado</div>
        <div style={{fontSize:14,color:C.textSecondary,textAlign:"center",marginBottom:24}}>Toma una foto del trabajo terminado como evidencia</div>

        <div style={{display:"flex",gap:10,marginBottom:24,width:"100%",justifyContent:"center"}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:88,height:88,borderRadius:14,border:`2px dashed ${i===0?C.primary:C.border}`,background:i===0?C.primaryLight:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4}}>
              <span style={{fontSize:20}}>{i===0?"📷":"+"}</span>
              {i===0 && <span style={{fontSize:10,fontWeight:600,color:C.primary}}>Agregar</span>}
            </div>
          ))}
        </div>

        <Card style={{width:"100%",marginBottom:16}}>
          <SectionTitle>Resumen final</SectionTitle>
          {agreementItems.map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
              <span style={{color:C.success}}>✓</span>
              <span style={{fontSize:13}}>{item.text}</span>
            </div>
          ))}
        </Card>

        <Card style={{width:"100%",marginBottom:16,background:C.primaryLight,border:`1px solid ${C.primary}30`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:600}}>Total a cobrar</span>
            <span style={{fontSize:20,fontWeight:800,color:C.primary}}>$546.84 MXN</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:13,color:C.success,fontWeight:600}}>
            <span>Tu ganancia neta</span><span>$459.00</span>
          </div>
        </Card>

        <Btn onClick={()=>nav(S.RATE_CLIENT)}>✓ Confirmar servicio completado</Btn>
        <div style={{marginTop:8,width:"100%"}}><Btn variant="ghost" onClick={back}>Volver al servicio</Btn></div>
      </div>
    </div>
  );

  // ═══ 5. POST-SERVICIO (3 pantallas) ═══

  const renderRateClient = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    const tags = ["Hogar accesible","Amable","Puntual","Buena comunicación","Limpio","Respetuoso"];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <NavHeader title="Califica al cliente"/>
        <div style={{padding:16,flex:1}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:64,height:64,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 8px"}}>👨</div>
            <div style={{fontSize:17,fontWeight:700}}>{r.client}</div>
            <div style={{fontSize:13,color:C.textMuted}}>¿Cómo fue tu experiencia con este cliente?</div>
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <Stars rating={clientRating} size={36} interactive onChange={setClientRating}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:20}}>
            {tags.map(tag=>{
              const sel=selTags.includes(tag);
              return <button key={tag} onClick={()=>setSelTags(sel?selTags.filter(t=>t!==tag):[...selTags,tag])} style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${sel?C.primary:C.border}`,background:sel?C.primaryLight:C.white,fontSize:13,fontWeight:600,color:sel?C.primary:C.textSecondary,cursor:"pointer"}}>{tag}</button>;
            })}
          </div>
          <textarea placeholder="Notas sobre el cliente (opcional)..." style={{width:"100%",height:70,border:`1.5px solid ${C.border}`,borderRadius:12,padding:12,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",marginBottom:16,boxSizing:"border-box"}}/>
          <Btn onClick={()=>nav(S.PAYMENT_SUMMARY)} disabled={clientRating===0}>Enviar calificación</Btn>
        </div>
      </div>
    );
  };

  const renderPaymentSummary = () => {
    const r = selectedReq || INCOMING_REQUESTS[0];
    return (
      <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <NavHeader title="Pago recibido"/>
        <div style={{padding:16}}>
          <Card style={{marginBottom:16,padding:24,textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:32,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px"}}>💰</div>
            <div style={{fontSize:14,color:C.textMuted,marginBottom:4}}>Pago confirmado</div>
            <div style={{fontSize:32,fontWeight:800,color:C.primary}}>$459.00 <span style={{fontSize:16}}>MXN</span></div>
            <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>Ganancia neta</div>
          </Card>

          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨</div>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>{r.client}</div>
                <div style={{fontSize:12,color:C.textMuted}}>{r.type} — {r.subtype}</div>
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              {[
                {l:"Monto total del servicio",v:"$546.84"},
                {l:"Comisión alTiro (10%)",v:"-$49.00"},
                {l:"IVA sobre comisión",v:"-$7.84"},
                {l:"Materiales cobrados",v:"$95.00"},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:C.textSecondary}}>
                  <span>{row.l}</span><span style={{fontWeight:600}}>{row.v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:8,borderTop:`2px solid ${C.success}`,fontSize:17,fontWeight:800,color:C.success}}>
                <span>Tu ganancia</span><span>$459.00 MXN</span>
              </div>
            </div>
          </Card>

          <Card style={{marginBottom:12,padding:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span>🆔</span><span style={{fontSize:13}}>ID Transacción: <strong>#ALT-T-2026-000847</strong></span>
            </div>
          </Card>
          <Card style={{marginBottom:12,padding:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span>⭐</span><span style={{fontSize:13}}>El cliente te calificó con <strong>5 estrellas</strong></span>
            </div>
          </Card>

          <Card style={{marginBottom:16,background:C.successLight,border:`1px solid ${C.success}30`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.primaryDark}}>
              <span style={{fontSize:18}}>🛡️</span>
              <span><strong>Pago protegido:</strong> El depósito se realizará a tu cuenta en 24-48h vía SPEI.</span>
            </div>
          </Card>

          <Btn onClick={()=>nav(S.TIP_RECEIVED)}>Continuar</Btn>
        </div>
      </div>
    );
  };

  const renderTipReceived = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:96,height:96,borderRadius:24,background:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:16}}>🎉</div>
      <div style={{fontSize:22,fontWeight:800,color:C.gold,marginBottom:4}}>¡Propina recibida!</div>
      <div style={{fontSize:14,color:C.textSecondary,marginBottom:8}}>Francisco te dejó una propina</div>
      <div style={{fontSize:40,fontWeight:800,color:C.primary,marginBottom:4}}>$50 <span style={{fontSize:18}}>MXN</span></div>
      <div style={{fontSize:13,color:C.textMuted,marginBottom:28}}>La propina va 100% para ti 💚</div>
      <Card style={{width:"100%",marginBottom:16,textAlign:"center",background:C.primaryLight,border:`1px solid ${C.primary}30`}}>
        <div style={{fontSize:14,fontWeight:700,color:C.primaryDark}}>Ganancia total del servicio</div>
        <div style={{fontSize:28,fontWeight:800,color:C.primary}}>$509.00 MXN</div>
        <div style={{fontSize:12,color:C.textMuted}}>$459 servicio + $50 propina</div>
      </Card>
      <Btn onClick={resetFlow}>Volver al inicio</Btn>
    </div>
  );

  // ═══ 6. GANANCIAS (3 pantallas) ═══

  const renderEarnings = () => (
    <div style={{flex:1,background:C.bg,overflowY:"auto"}}>
      <div style={{padding:"16px 16px 8px"}}>
        <div style={{fontSize:22,fontWeight:800,color:C.textPrimary}}>Ganancias</div>
      </div>
      <div style={{display:"flex",gap:8,padding:"4px 16px 12px"}}>
        {[{id:"dia",l:"Hoy"},{id:"semana",l:"Semana"},{id:"mes",l:"Mes"}].map(t=>(
          <button key={t.id} onClick={()=>setEarningsTab(t.id)} style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${earningsTab===t.id?C.primary:C.border}`,background:earningsTab===t.id?C.primaryLight:C.white,fontSize:13,fontWeight:600,color:earningsTab===t.id?C.primary:C.textSecondary,cursor:"pointer"}}>{t.l}</button>
        ))}
      </div>
      <div style={{padding:"0 16px"}}>
        <Card style={{marginBottom:16,textAlign:"center",padding:20,background:`linear-gradient(135deg, ${C.goldLight} 0%, #FFF 100%)`,border:`1px solid ${C.gold}30`}}>
          <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>{earningsTab==="dia"?"Ganancias de hoy":earningsTab==="semana"?"Ganancias de la semana":"Ganancias del mes"}</div>
          <div style={{fontSize:36,fontWeight:800,color:C.gold}}>{earningsTab==="dia"?"$1,470":earningsTab==="semana"?"$5,230":"$18,940"}<span style={{fontSize:16}}> MXN</span></div>
          <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{earningsTab==="dia"?"3 servicios":earningsTab==="semana"?"12 servicios":"42 servicios"}</div>
        </Card>

        {/* Mini bar chart */}
        <Card style={{marginBottom:16,padding:20}}>
          <SectionTitle>Últimos 7 días</SectionTitle>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-around",height:100,paddingTop:8}}>
            {[40,65,30,80,55,90,70].map((h,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:28,height:h,borderRadius:6,background:i===6?C.primary:C.primaryLight,transition:"height 0.3s"}}/>
                <span style={{fontSize:9,color:C.textMuted}}>{["L","M","X","J","V","S","D"][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <SectionTitle action="Ver todo" onAction={()=>nav(S.TRANSACTIONS)}>Transacciones recientes</SectionTitle>
        {COMPLETED_SERVICES.slice(0,3).map(svc=>(
          <Card key={svc.id} onClick={()=>nav(S.TRANSACTIONS)} style={{marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:10,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💰</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{svc.subtype}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{svc.client} · {svc.date}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:800,color:C.success}}>+${svc.netAmount}</div>
              {svc.tip>0 && <div style={{fontSize:10,color:C.gold}}>+${svc.tip} propina</div>}
            </div>
          </Card>
        ))}

        <div style={{marginTop:16,marginBottom:16}}>
          <Btn onClick={()=>nav(S.WITHDRAW)}>💳 Retirar fondos</Btn>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Historial de transacciones" onBack={back}/>
      <div style={{padding:16}}>
        {COMPLETED_SERVICES.map(svc=>(
          <Card key={svc.id} style={{marginBottom:10}}>
            <div style={{display:"flex",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💰</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:700}}>{svc.subtype}</div>
                  <div style={{fontSize:15,fontWeight:800,color:C.success}}>+${svc.netAmount}</div>
                </div>
                <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{svc.client} · {svc.date}</div>
                <div style={{display:"flex",gap:8,marginTop:6}}>
                  <Badge color={C.textSecondary}>Bruto: ${svc.amount}</Badge>
                  <Badge color={C.danger}>Comisión: -${svc.amount-svc.netAmount}</Badge>
                  {svc.tip>0 && <Badge color={C.gold}>Propina: +${svc.tip}</Badge>}
                </div>
                <div style={{marginTop:6}}><Stars rating={svc.rating} size={11}/></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column"}}>
      <NavHeader title="Retirar fondos" onBack={back}/>
      <div style={{padding:16,flex:1}}>
        <Card style={{marginBottom:16,textAlign:"center",padding:20}}>
          <div style={{fontSize:13,color:C.textMuted}}>Saldo disponible</div>
          <div style={{fontSize:32,fontWeight:800,color:C.primary}}>$4,820.00 <span style={{fontSize:14}}>MXN</span></div>
        </Card>

        <SectionTitle>Cuenta destino</SectionTitle>
        <Card style={{marginBottom:16,display:"flex",alignItems:"center",gap:12,border:`2px solid ${C.primary}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏦</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>BBVA •••• 7834</div>
            <div style={{fontSize:12,color:C.textMuted}}>CLABE: ••••••••••7834</div>
          </div>
          <div style={{width:20,height:20,borderRadius:10,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.white,fontSize:10}}>✓</span></div>
        </Card>

        <InputField label="Monto a retirar" placeholder="$0.00" value="$4,820.00" icon="💰"/>

        <Card style={{marginBottom:16,background:C.primaryLight,border:`1px solid ${C.primary}30`,padding:12}}>
          <div style={{fontSize:12,color:C.primaryDark}}>
            <strong>Depósito vía SPEI:</strong> Tu retiro se procesará en 24-48 horas hábiles.
          </div>
        </Card>

        <Btn onClick={back}>Confirmar retiro</Btn>
      </div>
    </div>
  );

  // ═══ 7. PERFIL (7 pantallas) ═══

  const renderProfileHub = () => (
    <div style={{flex:1,background:C.bg,overflowY:"auto"}}>
      <div style={{background:C.white,padding:"20px 16px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:64,height:64,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,position:"relative"}}>
            👨‍🔧
            <div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:10,background:C.success,border:`2px solid ${C.white}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.white}}>✓</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:800,color:C.textPrimary}}>Carlos Mendoza</div>
            <div style={{fontSize:13,color:C.textMuted}}>Plomería · Electricidad</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
              <Stars rating={5} size={12}/><span style={{fontSize:12,fontWeight:600}}>4.9</span>
              <span style={{fontSize:11,color:C.textMuted}}>· 234 trabajos</span>
            </div>
          </div>
          <button onClick={()=>nav(S.EDIT_INFO)} style={{width:36,height:36,borderRadius:10,background:C.bg,border:"none",fontSize:14,cursor:"pointer"}}>✏️</button>
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        {[
          {icon:"👤",label:"Editar información",screen:S.EDIT_INFO},
          {icon:"🔧",label:"Especialidades y tarifas",screen:S.SPECIALTIES},
          {icon:"📄",label:"Documentos y certificaciones",screen:S.DOCUMENTS},
          {icon:"🖼️",label:"Portafolio de trabajos",screen:S.PORTFOLIO},
          {icon:"⭐",label:"Mis reseñas",screen:S.MY_REVIEWS},
          {icon:"🏦",label:"Cuenta bancaria",screen:S.BANK_ACCOUNT},
        ].map((item,i)=>(
          <Card key={i} onClick={()=>nav(item.screen)} style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>{item.icon}</span><span style={{fontSize:14,fontWeight:600}}>{item.label}</span></div>
            <span style={{color:C.textMuted}}>›</span>
          </Card>
        ))}
        <div style={{height:8}}/>
        {[
          {icon:"❓",label:"Centro de ayuda",screen:S.HELP},
          {icon:"⚙️",label:"Configuración",screen:S.SETTINGS_PAGE},
        ].map((item,i)=>(
          <Card key={i} onClick={()=>nav(item.screen)} style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>{item.icon}</span><span style={{fontSize:14,fontWeight:600}}>{item.label}</span></div>
            <span style={{color:C.textMuted}}>›</span>
          </Card>
        ))}
        <div style={{padding:"16px 0 32px"}}><Btn variant="ghost" onClick={()=>setScreen(S.LOGIN)}><span style={{color:C.danger}}>Cerrar sesión</span></Btn></div>
      </div>
    </div>
  );

  const renderEditInfo = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Editar información" onBack={back}/>
      <div style={{padding:16,flex:1}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
          <div style={{position:"relative"}}>
            <div style={{width:80,height:80,borderRadius:20,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>👨‍🔧</div>
            <div style={{position:"absolute",bottom:-4,right:-4,width:28,height:28,borderRadius:14,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.white,border:`2px solid ${C.white}`}}>📷</div>
          </div>
        </div>
        <InputField label="Nombre completo" value="Carlos Mendoza López" icon="👤"/>
        <InputField label="Teléfono" value="442 987 6543" icon="📱"/>
        <InputField label="Correo electrónico" value="carlos.mendoza@email.com" icon="✉️"/>
        <InputField label="Dirección" value="Col. Centro, Querétaro" icon="🏠"/>
        <Btn onClick={back}>Guardar cambios</Btn>
      </div>
    </div>
  );

  const renderSpecialties = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Especialidades y tarifas" onBack={back}/>
      <div style={{padding:16}}>
        <SectionTitle>Mis especialidades</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
          {SPECIALTIES_DATA.map((sp,i)=>{
            const active=i<2;
            return (
              <div key={sp.id} style={{padding:12,borderRadius:12,border:`2px solid ${active?C.primary:C.border}`,background:active?C.primaryLight:C.white,textAlign:"center",cursor:"pointer"}}>
                <div style={{fontSize:22,marginBottom:4}}>{sp.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:active?C.primary:C.textSecondary}}>{sp.name}</div>
                {active && <div style={{fontSize:9,color:C.success,fontWeight:600,marginTop:2}}>Activa</div>}
              </div>
            );
          })}
        </div>
        <SectionTitle>Tarifas base</SectionTitle>
        {[
          {name:"Plomería — General",val:"$450"},
          {name:"Plomería — Emergencia",val:"$650"},
          {name:"Electricidad — General",val:"$500"},
          {name:"Electricidad — Emergencia",val:"$750"},
        ].map((t,i)=>(
          <Card key={i} style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:13,fontWeight:600}}>{t.name}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:800,color:C.primary}}>{t.val} MXN</span>
              <button style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer"}}>✏️</button>
            </div>
          </Card>
        ))}
        <SectionTitle>Zona de cobertura</SectionTitle>
        <div style={{height:120,borderRadius:16,background:`linear-gradient(135deg, ${C.primaryLight} 0%, #D1FAE5 100%)`,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{width:80,height:80,borderRadius:40,border:`3px dashed ${C.primary}40`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:12,height:12,borderRadius:6,background:C.primary}}/></div>
          <div style={{position:"absolute",bottom:8,right:12,background:C.white,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:600}}>Radio: 10 km</div>
        </div>
        <Btn onClick={back}>Guardar cambios</Btn>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Documentos" onBack={back}/>
      <div style={{padding:16}}>
        {[
          {name:"INE (Frente y vuelta)",status:"verified",icon:"🆔",exp:""},
          {name:"CURP",status:"verified",icon:"📄",exp:""},
          {name:"Comprobante de domicilio",status:"verified",icon:"🏠",exp:"Vence: Mar 2027"},
          {name:"CONOCER EC0586",status:"verified",icon:"🏅",exp:"Vence: Dic 2026"},
          {name:"Certificado Rotoplas",status:"verified",icon:"🏅",exp:"Vence: Jun 2027"},
        ].map((doc,i)=>(
          <Card key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:C.successLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{doc.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{doc.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                  <Badge color={C.success}>✓ Verificado</Badge>
                  {doc.exp && <span style={{fontSize:11,color:C.textMuted}}>{doc.exp}</span>}
                </div>
              </div>
              <button style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:14}}>🔄</button>
            </div>
          </Card>
        ))}
        <Card style={{border:`1.5px dashed ${C.primary}`,background:C.primaryLight,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
            <span style={{color:C.primary}}>＋</span>
            <span style={{fontSize:14,fontWeight:600,color:C.primary}}>Subir nueva certificación</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Portafolio" onBack={back}/>
      <div style={{padding:16}}>
        <div style={{fontSize:13,color:C.textSecondary,marginBottom:16}}>Tus trabajos anteriores son visibles para los clientes</div>
        {["Reparación de fuga en cocina","Instalación de calentador solar","Destape de drenaje principal","Mantenimiento de cisternas","Instalación de WC","Reparación tubería de cobre"].map((work,i)=>(
          <Card key={i} style={{marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:64,height:64,borderRadius:12,background:[C.primaryLight,C.accentLight,"#F0F4FF",C.goldLight,C.successLight,"#FEF2F2"][i%6],display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🖼️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{work}</div>
              <div style={{fontSize:11,color:C.textMuted}}>Plomería · {["Ene","Feb","Mar","Abr","May","Jun"][i%6]} 2026</div>
            </div>
            <button style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer"}}>✏️</button>
          </Card>
        ))}
        <Card style={{border:`1.5px dashed ${C.primary}`,background:C.primaryLight,cursor:"pointer",marginTop:4}}>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
            <span style={{fontSize:18}}>📷</span>
            <span style={{fontSize:14,fontWeight:600,color:C.primary}}>Agregar trabajo al portafolio</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMyReviews = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Mis reseñas" onBack={back}/>
      <div style={{padding:16}}>
        <Card style={{marginBottom:16,textAlign:"center",padding:20}}>
          <div style={{fontSize:36,fontWeight:800,color:C.primary}}>4.9</div>
          <Stars rating={5} size={18}/>
          <div style={{fontSize:13,color:C.textMuted,marginTop:4}}>Basado en 187 reseñas</div>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:8}}>
            {["Profesional","Limpio","Puntual"].map(tag=>(<Badge key={tag} color={C.primary}>{tag}</Badge>))}
          </div>
        </Card>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          {[5,4,3].map(n=>(
            <div key={n} style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:12,fontWeight:600}}>{n}★</span>
              <div style={{flex:1,height:6,borderRadius:3,background:C.border}}>
                <div style={{height:6,borderRadius:3,background:C.star,width:n===5?"80%":n===4?"15%":"5%"}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12}}>
          {MY_REVIEWS_DATA.map((r,i)=>(
            <Card key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:600}}>{r.from}</span>
                <Stars rating={r.rating} size={12}/>
              </div>
              <div style={{fontSize:13,color:C.textSecondary,marginBottom:6}}>{r.text}</div>
              <div style={{display:"flex",gap:6,marginBottom:4}}>
                {r.tags.map(tag=>(<Badge key={tag} color={C.primary}>{tag}</Badge>))}
              </div>
              <div style={{fontSize:11,color:C.textMuted}}>{r.date}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBankAccount = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column"}}>
      <NavHeader title="Cuenta bancaria" onBack={back}/>
      <div style={{padding:16,flex:1}}>
        <Card style={{marginBottom:16,border:`2px solid ${C.primary}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏦</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>BBVA</div>
              <div style={{fontSize:12,color:C.textMuted}}>CLABE: 012180••••••7834</div>
              <div style={{fontSize:12,color:C.textMuted}}>Carlos Mendoza López</div>
            </div>
            <Badge color={C.success}>Principal</Badge>
          </div>
        </Card>
        <Card style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏦</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>Banorte</div>
              <div style={{fontSize:12,color:C.textMuted}}>CLABE: 072180••••••2156</div>
            </div>
          </div>
        </Card>
        <Card style={{border:`1.5px dashed ${C.primary}`,background:C.primaryLight,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
            <span style={{color:C.primary}}>＋</span>
            <span style={{fontSize:14,fontWeight:600,color:C.primary}}>Agregar cuenta bancaria</span>
          </div>
        </Card>
      </div>
    </div>
  );

  // ═══ 8. CONFIG Y SOPORTE (4 pantallas) ═══

  const renderSettingsPage = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Configuración" onBack={back}/>
      <div style={{padding:16}}>
        {[
          {icon:"🔔",label:"Sonido de nueva solicitud",toggle:true,on:true},
          {icon:"📱",label:"Alertas de pago",toggle:true,on:true},
          {icon:"📅",label:"Disponibilidad programada",val:"Lun-Sáb, 8am-6pm"},
          {icon:"🧾",label:"Datos de facturación (RFC)",val:"MEML900101XXX"},
          {icon:"🌐",label:"Idioma",val:"Español"},
          {icon:"📄",label:"Términos y condiciones"},
          {icon:"🔒",label:"Política de privacidad"},
          {icon:"ℹ️",label:"Acerca de alTiro",val:"v1.0.0"},
        ].map((item,i)=>(
          <Card key={i} style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:18}}>{item.icon}</span>
              <span style={{fontSize:14,fontWeight:600}}>{item.label}</span>
            </div>
            {item.toggle?(
              <div style={{width:44,height:24,borderRadius:12,background:item.on?C.primary:"#D1D5DB",padding:2,cursor:"pointer"}}>
                <div style={{width:20,height:20,borderRadius:10,background:C.white,marginLeft:item.on?20:0,transition:"margin 0.2s"}}/>
              </div>
            ):(
              <span style={{fontSize:12,color:C.textMuted,maxWidth:120,textAlign:"right"}}>{item.val||"›"}</span>
            )}
          </Card>
        ))}
        <div style={{padding:"24px 0"}}><Btn variant="danger" size="sm">Eliminar mi cuenta</Btn></div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Centro de ayuda" onBack={back}/>
      <div style={{padding:16}}>
        <InputField placeholder="Buscar en ayuda..." icon="🔍"/>
        <SectionTitle>Preguntas frecuentes</SectionTitle>
        {[
          "¿Cuándo recibo mi pago?",
          "¿Qué pasa si el cliente cancela?",
          "¿Cómo subo mi calificación?",
          "¿Cómo actualizo mis certificaciones?",
          "¿Qué hacer si hay un problema con el cliente?",
          "¿Cómo cambio mi zona de cobertura?",
        ].map((q,i)=>(
          <Card key={i} style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <span style={{fontSize:13,fontWeight:600}}>{q}</span>
            <span style={{color:C.textMuted}}>›</span>
          </Card>
        ))}
        <div style={{marginTop:20}}>
          <SectionTitle>¿Necesitas más ayuda?</SectionTitle>
          <Btn variant="outline">💬 Contactar soporte</Btn>
        </div>
      </div>
    </div>
  );

  const renderReportProblem = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Reportar problema" onBack={back}/>
      <div style={{padding:16}}>
        <div style={{fontSize:15,color:C.textSecondary,marginBottom:16}}>Selecciona el tipo de problema</div>
        {[
          "El cliente no estaba en el domicilio",
          "Condiciones inseguras en el lugar",
          "Comportamiento inapropiado del cliente",
          "Problema con el pago",
          "El problema era diferente al descrito",
          "Otro problema",
        ].map((p,i)=>(
          <Card key={i} style={{marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:20,height:20,borderRadius:10,border:`2px solid ${C.border}`}}/>
            <span style={{fontSize:13,fontWeight:600}}>{p}</span>
          </Card>
        ))}
        <div style={{marginTop:16}}>
          <InputField label="Describe el problema" placeholder="Proporciona todos los detalles..." multiline/>
        </div>
        <Card style={{marginBottom:16,border:`1.5px dashed ${C.border}`,background:C.bg,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
            <span>📷</span><span style={{fontSize:13,fontWeight:600,color:C.primary}}>Agregar evidencia</span>
          </div>
        </Card>
        <Btn onClick={back}>Enviar reporte</Btn>
      </div>
    </div>
  );

  const renderNotifs = () => (
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavHeader title="Notificaciones" onBack={back}/>
      <div style={{padding:16}}>
        {[
          {icon:"📋",title:"Nueva solicitud",desc:"Francisco G. necesita plomería en Querétaro Centro.",time:"Hace 5 min",unread:true},
          {icon:"💰",title:"Pago depositado",desc:"Se depositaron $459.00 MXN a tu cuenta BBVA.",time:"Hace 2h",unread:true},
          {icon:"⭐",title:"Nueva reseña",desc:"Francisco G. te dejó una reseña de 5 estrellas.",time:"Hace 3h",unread:true},
          {icon:"📄",title:"Certificación por vencer",desc:"Tu certificado CONOCER vence en 60 días. Renuévalo para mantener tu perfil activo.",time:"Ayer",unread:false},
          {icon:"🎉",title:"¡Meta alcanzada!",desc:"Completaste 234 servicios. ¡Eres un técnico élite!",time:"Hace 3 días",unread:false},
        ].map((n,i)=>(
          <Card key={i} style={{marginBottom:8,background:n.unread?C.primaryLight:C.white,border:n.unread?`1px solid ${C.primary}20`:`1px solid ${C.border}`}}>
            <div style={{display:"flex",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:n.unread?C.white:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:700}}>{n.title}</span>
                  <span style={{fontSize:11,color:C.textMuted}}>{n.time}</span>
                </div>
                <div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{n.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ═══ SCREEN ROUTER ═══
  const renderScreen = () => {
    switch(screen){
      case S.SPLASH:return renderSplash();
      case S.OB1:return renderOnboarding(0);
      case S.OB2:return renderOnboarding(1);
      case S.OB3:return renderOnboarding(2);
      case S.LOGIN:return renderLogin();
      case S.OTP:return renderOTP();
      case S.PERSONAL_DATA:return renderPersonalData();
      case S.PROF_PROFILE:return renderProfProfile();
      case S.VERIF_STATUS:return renderVerifStatus();
      case S.DASHBOARD:return renderDashboard();
      case S.REQUESTS:return renderRequests();
      case S.REQ_DETAIL:return renderReqDetail();
      case S.REQ_ACCEPTED:return renderReqAccepted();
      case S.NAVIGATION:return renderNavigation();
      case S.CONFIRM_ARRIVAL:return renderConfirmArrival();
      case S.CREATE_AGREEMENT:return renderCreateAgreement();
      case S.SVC_PROGRESS:return renderSvcProgress();
      case S.MARK_COMPLETE:return renderMarkComplete();
      case S.RATE_CLIENT:return renderRateClient();
      case S.PAYMENT_SUMMARY:return renderPaymentSummary();
      case S.TIP_RECEIVED:return renderTipReceived();
      case S.EARNINGS:return renderEarnings();
      case S.TRANSACTIONS:return renderTransactions();
      case S.WITHDRAW:return renderWithdraw();
      case S.PROFILE_HUB:return renderProfileHub();
      case S.EDIT_INFO:return renderEditInfo();
      case S.SPECIALTIES:return renderSpecialties();
      case S.DOCUMENTS:return renderDocuments();
      case S.PORTFOLIO:return renderPortfolio();
      case S.MY_REVIEWS:return renderMyReviews();
      case S.BANK_ACCOUNT:return renderBankAccount();
      case S.SETTINGS_PAGE:return renderSettingsPage();
      case S.HELP:return renderHelp();
      case S.REPORT_PROBLEM:return renderReportProblem();
      case S.NOTIFS:return renderNotifs();
      default:return renderDashboard();
    }
  };

  // ═══ PHONE FRAME ═══
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#E8ECF0",fontFamily:"'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",padding:16}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:0;height:0;}
        @keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:1;}}
        button:active{transform:scale(0.97);}
        input::placeholder,textarea::placeholder{color:${C.textMuted};}
      `}</style>

      <div style={{marginBottom:12,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>alTiro · Prototipo App Técnico</div>
        <div style={{fontSize:11,color:"#9CA3AF"}}>
          Pantalla: <strong style={{color:C.textPrimary}}>{screen}</strong>
          {" · "}{history.length>0 && <button onClick={back} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontWeight:600,fontSize:11}}>← Regresar</button>}
          {" "}<button onClick={resetFlow} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontWeight:600,fontSize:11}}>⟲ Dashboard</button>
          {" "}<button onClick={()=>nav(S.REPORT_PROBLEM)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:11}}>Reportar</button>
        </div>
      </div>

      <div style={{width:375,height:812,borderRadius:44,background:C.white,boxShadow:"0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:160,height:30,background:"#000",borderRadius:"0 0 20px 20px",zIndex:10}}/>
        <div style={{height:30}}/>
        <StatusBar/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {renderScreen()}
        </div>
        {showNav && <BottomNav active={activeTab} onNavigate={nav}/>}
        <div style={{display:"flex",justifyContent:"center",paddingBottom:8,paddingTop:4,background:showNav?C.white:"transparent"}}>
          <div style={{width:134,height:5,borderRadius:3,background:"#000",opacity:0.2}}/>
        </div>
      </div>

      <div style={{marginTop:12,fontSize:11,color:"#9CA3AF",textAlign:"center"}}>
        33 pantallas · Espejo operativo de App Usuario · Equipo 5 · Tec de Monterrey
      </div>
    </div>
  );
}
