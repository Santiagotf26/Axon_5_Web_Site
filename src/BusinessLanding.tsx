import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { NeuralNetwork, Footer } from './App';

const USE_CASES = [
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Logística y Carga',
    desc: 'Consulta de fletes y estado de vías en segundos para conductores y clientes. Mantén la flota andando.'
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: 'Citas Médicas',
    desc: 'Gestión autónoma de agendas y recordatorios para consultorios especializados. Cero inasistencias.'
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    title: 'Venta Mayorista',
    desc: 'Cotizaciones automáticas de inventario para ferreterías y distribuidoras. Vende sin importar la hora.'
  }
];

const FAQS = [
  {
    q: '¿La IA puede dar información falsa o inventar precios?',
    a: 'No. En Axon 5 utilizamos tecnología RAG (Generación Aumentada por Recuperación). Esto significa que el agente solo responde basándose en los manuales, archivos y bases de datos reales de tu empresa. Si no conoce la respuesta, está programado para transferir la consulta a un humano.'
  },
  {
    q: '¿Es muy difícil de implementar en mi negocio?',
    a: 'Para nada. Nosotros nos encargamos de todo el montaje técnico. Solo necesitamos que nos compartas la información que quieres que la IA maneje y nosotros la dejamos funcionando en tu WhatsApp o sitio web en tiempo récord.'
  },
  {
    q: '¿Qué pasa si el cliente quiere hablar con una persona real?',
    a: 'Nuestra IA es un apoyo, no un reemplazo total. El agente puede calificar al cliente y, si detecta una necesidad compleja o una solicitud específica, notificará de inmediato a tu equipo humano para que tome el control de la conversación.'
  },
  {
    q: '¿Mis datos y los de mis clientes están seguros?',
    a: 'Totalmente. La seguridad es nuestra prioridad. Cumplimos con los estándares de protección de datos y aseguramos que la información de tu empresa sea privada y se use exclusivamente para el funcionamiento de tu propio agente.'
  },
  {
    q: '¿Cuánto me voy a ahorrar realmente?',
    a: 'Un agente de Axon 5 reduce hasta en un 80% el tiempo que tu equipo gasta respondiendo preguntas repetitivas. Esto te permite atender a cientos de clientes en simultáneo sin necesidad de contratar más personal para tareas operativas.'
  }
];

/* ─── HELPERS ───────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function BusinessLanding({ onSwitchView }: { onSwitchView: () => void }) {
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Theme Toggle
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('axon-theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('axon-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  // Nav solid on scroll
  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const fn = () => setNavSolid(window.scrollY > 28);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Modal states for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="site">
      <motion.div className="progress-bar" style={{ scaleX: progressScaleX }} />

      {/* NAV */}
      <nav id="nav" className={navSolid ? 'solid' : ''}>
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="url(#brand-grad-biz)" />
            <path d="M12 18L18 12L24 18M18 12V24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="18" r="2.5" fill="white" />
            <circle cx="24" cy="18" r="2.5" fill="white" />
            <circle cx="18" cy="12" r="2.5" fill="white" />
            <defs>
              <linearGradient id="brand-grad-biz" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ade80" />
                <stop offset="1" stopColor="#16a34a" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-brand-name">Axon 5</span>
        </a>
        <div className="nav-links">
          <a href="#problema">El Problema</a>
          <a href="#solucion">Nuestra Solución</a>
          <a href="#casos">Casos de Uso</a>
          <a href="#faq">Preguntas</a>
        </div>
        <div className="nav-r">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ marginLeft: 8 }}>
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <button className="nav-txt" onClick={onSwitchView} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', textDecoration: 'underline' }}>
             Ver versión Técnica
          </button>

          <button className="btn-cta" onClick={() => document.getElementById('biz-cta')?.scrollIntoView({ behavior: 'smooth' })}>
            Agendar Demo
          </button>
        </div>
        <button className="mob-btn" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <motion.div id="mob-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          {[ {id: 'problema', label: 'El Problema'}, {id: 'solucion', label: 'Nuestra Solución'}, {id: 'casos', label: 'Casos de Uso'}, {id: 'faq', label: 'Preguntas'}].map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' });
            }}>{l.label}</a>
          ))}
          <button onClick={() => { setMobileOpen(false); onSwitchView(); }} style={{ background: 'none', border: 'none', color: 'var(--text)', textAlign: 'left', padding: '16px', fontSize: '1.2rem', fontWeight: '500', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             Ver versión Técnica →
          </button>
        </motion.div>
      )}

      {/* HERO SEC */}
      <section id="hero" style={{ minHeight: '90vh', paddingBottom: '40px' }}>
        <div className="hero-grid" style={{ opacity: 0.8 }} />
        <div className="g1" style={{ width: 800, height: 800, top: -300, background: 'rgba(34, 197, 94, 0.08)' }} />
        <div className="hero-fade" />
        <NeuralNetwork />
        
        <div className="hero-in">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="bdot" />
            Atención al cliente 24/7 Inteligente
          </motion.div>

          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)' }}
          >
            Tu empresa no duerme,<br /><em>tu atención tampoco.</em>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{ maxWidth: '640px' }}
          >
            Implementamos agentes de Inteligencia Artificial que atienden, venden y gestionan tu negocio por WhatsApp las 24 horas. Libera a tu equipo de las tareas repetitivas y enfócate en crecer.
          </motion.p>

          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.6 }}
          >
            <button className="btn-p" onClick={() => document.getElementById('biz-cta')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Agendar una Demo Gratis
            </button>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8, duration: 0.6 }}
             className="hero-trust"
          >
             <span className="ti">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
               Nacidos en Duitama para transformar la industria local
             </span>
          </motion.div>
        </div>

        {/* 3D FLOATING ORBS */}
        <div className="hero-3d-orbs" aria-hidden>
          <div className="orb-a" />
          <div className="orb-b" />
          <div className="orb-c" />
        </div>
      </section>

      {/* MARQUEE BIZ */}
      <div className="mq-sec">
        <p className="mq-lbl">Empresas en Boyacá que ya están evolucionando su atención</p>
        <div className="mq-wrap">
          <div className="mq-track">
            {['Transportes Duitama', 'Clínica Boyacá', 'Ferretería Central', 'Logística del Sur', 'Distribuidora Oriental', 'Centro Médico Norte', 'Acero del Valle', 'Constructora Andes'].map((l, i) => (
               <div key={i} className="lb" style={{ fontWeight: 600, color: 'var(--text)', opacity: 0.8 }}>{l}</div>
            ))}
            {['Transportes Duitama', 'Clínica Boyacá', 'Ferretería Central', 'Logística del Sur', 'Distribuidora Oriental', 'Centro Médico Norte', 'Acero del Valle', 'Constructora Andes'].map((l, i) => (
               <div key={`d-${i}`} className="lb" style={{ fontWeight: 600, color: 'var(--text)', opacity: 0.8 }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* EL PROBLEMA */}
      <section id="problema" className="sec sec-alt">
        <ScrollRevealBlock>
          <div className="sec-in" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>El Problema</div>
            <h2 className="sec-h2" style={{ maxWidth: '750px', margin: '0 auto 24px' }}>
              ¿Tu WhatsApp está colapsado y tus <em>clientes esperan horas?</em>
            </h2>
            <p className="sec-lead" style={{ margin: '0 auto 48px', maxWidth: '680px', fontSize: '1.05rem' }}>
              Sabemos que en sectores como el transporte, la salud y el comercio, cada minuto cuenta. Responder precios, rutas o citas manualmente es lento, costoso y genera errores. Axon 5 elimina ese cuello de botella.
            </p>
            
            <div className="prob-box">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }} className="prob-msg msg-in">Buen día, ¿qué precio tiene el flete a Bogotá?</motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.4 }} className="prob-msg msg-in">Hola, necesito agendar una cita prioritaria.</motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.5, duration: 0.4 }} className="prob-msg msg-in">¿Tienen inventario de tubería PVC de 2"?</motion.div>
              
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3, duration: 0.5 }} style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', marginTop: '10px' }}>escribiendo...</motion.div>
              
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 4.5, duration: 0.4 }} className="prob-msg msg-out delayed" style={{ marginTop: '4px' }}>... (3 horas después) Sí señor, ya le confirmo.</motion.div>
            </div>
          </div>
        </ScrollRevealBlock>
      </section>

      {/* LA SOLUCION */}
      <section id="solucion" className="sec">
        <ScrollRevealBlock>
          <div className="sec-in">
            <div className="eyebrow">La Solución</div>
            <h2 className="sec-h2">Un agente inteligente que<br /><em>trabaja para ti</em></h2>
            <p className="sec-lead" style={{ marginBottom: '40px' }}>Beneficios reales, no solo funcionalidades. Diseñado para impactar tu rentabilidad desde el primer día.</p>
            
            <div className="bgrid-biz">
              <motion.div className="bc-biz" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="bc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3>Disponibilidad Total</h3>
                <p>Tu negocio responde al instante, incluso domingos y festivos. Nunca más pierdas una venta por no contestar a tiempo.</p>
              </motion.div>
              
              <motion.div className="bc-biz" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="bc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h3>Precisión Absoluta</h3>
                <p>La IA conoce tus catálogos, rutas y precios mejor que nadie. Nunca inventa datos ni se equivoca al dar información.</p>
              </motion.div>
              
              <motion.div className="bc-biz" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="bc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3>Acción Inmediata</h3>
                <p>No solo responde; agenda citas, califica prospectos y guarda todo en tus bases de datos automáticamente.</p>
              </motion.div>

              <motion.div className="bc-biz" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="bc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3>Costo Inteligente</h3>
                <p>Un agente de IA cuesta una fracción de lo que pagas por procesos manuales ineficientes. Escala tus ventas sin escalar costos.</p>
              </motion.div>
            </div>
          </div>
        </ScrollRevealBlock>
      </section>

      {/* CASOS DE USO */}
      <section id="casos" className="sec sec-alt">
        <ScrollRevealBlock>
          <div className="sec-in">
            <div className="eyebrow">Casos de Uso</div>
            <h2 className="sec-h2">Adaptado para las industrias<br /><em>más demandantes</em></h2>
            
            <div className="use-case-grid">
              {USE_CASES.map((uc, i) => (
                 <motion.div 
                    key={i} 
                    className="uc-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.03, y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                   <div className="uc-icon">{uc.icon}</div>
                   <h4>{uc.title}</h4>
                   <p>{uc.desc}</p>
                 </motion.div>
              ))}
            </div>
          </div>
        </ScrollRevealBlock>
      </section>

      {/* TESTIMONIOS BIZ */}
      <section id="testimonios" className="sec">
        <ScrollRevealBlock>
          <div className="sec-in">
            <div className="eyebrow" style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>Casos de Éxito</div>
            <h2 className="sec-h2" style={{ textAlign: 'center' }}>Resultados comprobados<br />en <em>nuestra región</em></h2>
            
            <div className="tgrid">
              <motion.div className="tcard" whileHover={{ y: -4, scale: 1.02 }} style={{ transformStyle: 'preserve-3d' }}>
                <p className="tq">"Antes de Axon 5 perdíamos ventas de transporte intermunicipal porque no contestábamos a tiempo. Ahora el agente cotiza fletes de inmediato, 24/7."</p>
                <div className="tau">
                  <div className="tav" style={{ background: 'var(--green-trans)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>J</div>
                  <div><div className="tnm">Jairo Martínez</div><div className="tro">Gerente · Logística Sur</div></div>
                </div>
              </motion.div>
              
              <motion.div className="tcard" whileHover={{ y: -4, scale: 1.02 }} style={{ transformStyle: 'preserve-3d' }}>
                <p className="tq">"Nuestros pacientes agendan citas de odontología por WhatsApp de madrugada. La IA revisa la disponibilidad y sincroniza todo sin intervención."</p>
                <div className="tau">
                  <div className="tav" style={{ background: 'var(--green-trans)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
                  <div><div className="tnm">Dra. Claudia Vargas</div><div className="tro">Directora · Clínica Boyacá</div></div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollRevealBlock>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="sec sec-alt">
        <ScrollRevealBlock>
          <div className="sec-in" style={{ maxWidth: '800px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>FAQ</div>
            <h2 className="sec-h2" style={{ textAlign: 'center', marginBottom: '40px' }}>Todo lo que <em>necesitas saber</em></h2>
            
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="faq-q">
                    {faq.q}
                    <div className="faq-arr">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div className="faq-a">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollRevealBlock>
      </section>

      {/* CTA FINAL */}
      <section id="biz-cta" className="cta-sec" style={{ margin: '60px 24px' }}>
        <motion.div
           className="cta-bx"
           initial={{ opacity: 0, scale: 0.94 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, amount: 0.4 }}
        >
          <div className="cta-glow" />
          <h2 className="cta-h2">Únete a la nueva era de los negocios en Boyacá</h2>
          <p className="cta-sub" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>Estamos seleccionando a 5 empresas pioneras en Duitama para una prueba exclusiva. ¿Quieres que la tuya sea una de ellas?</p>
          <form className="cta-form" onSubmit={e => e.preventDefault()}>
             <input type="text" className="cta-inp" placeholder="WhatsApp / Teléfono" style={{ flex: 1 }} />
             <button className="btn-p" style={{ whiteSpace: 'nowrap' }}>Quiero ser un socio fundador</button>
          </form>
        </motion.div>
      </section>

      {/* FOOTER BIZ */}
      <Footer />
    </div>
  );
}

function ScrollRevealBlock({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
