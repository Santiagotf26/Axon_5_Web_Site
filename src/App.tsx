import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

/* ─── DATA ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Producto', id: 'products' },
  { label: 'Por qué Axon 5', id: 'why' },
  { label: 'Plataforma', id: 'platform' },
  { label: 'Pricing', id: 'cta' }
];

const TABS = [
  {
    label: 'Automatización con código',
    title: 'Infraestructura programable',
    desc1: 'Define todo en código. Mantén el entorno, integraciones y requisitos de hardware sincronizados — sin YAML, sin config files.',
    desc2: 'Los agentes de Axon 5 aprenden de ejemplos reales y se adaptan a los flujos de tu empresa automáticamente.',
    link: 'Ver documentación →',
    terminal: 'code',
  },
  {
    label: 'Rendimiento nativo',
    title: 'Construido para el rendimiento',
    desc1: 'Lanza y escala contenedores en segundos. Cold starts por debajo de 300ms — 100x más rápido que Docker convencional.',
    desc2: 'Disponibilidad 99.9% garantizada por SLA. P99 latency < 50ms.',
    link: 'Ver benchmarks →',
    terminal: 'metrics',
  },
  {
    label: 'Escalado elástico',
    title: 'Escalado elástico automático',
    desc1: 'Desde cero hasta miles de instancias en segundos. Sin cuotas, sin reservas, sin sorpresas en la factura.',
    desc2: 'Escala a cero cuando no hay tráfico. Paga solo lo que usas.',
    link: 'Ver pricing →',
    terminal: 'scale',
  },
  {
    label: '200+ Integraciones',
    title: '200+ Integraciones nativas',
    desc1: 'Conecta con Slack, Notion, Salesforce, GitHub y más. SDK para Python, Node y Go. Webhooks y eventos en tiempo real.',
    desc2: 'Nuestra API REST hace que las integraciones personalizadas sean triviales.',
    link: 'Ver integraciones →',
    terminal: 'integrations',
  },
];

const PRODUCTS = [
  { tag: 'Agentes', tagClass: 'tg', title: 'AI Automation', desc: 'Despliega agentes autónomos que automatizan flujos complejos. Aprenden de ejemplos y mejoran con cada iteración.' },
  { tag: 'Análisis', tagClass: 'tb', title: 'Data Intelligence', desc: 'Transforma datos en insights accionables. Dashboards en tiempo real, anomaly detection y forecasting automático.' },
  { tag: 'Flujos', tagClass: 'tp', title: 'Workflow Builder', desc: 'Editor visual sin código. Arrastra, conecta y despliega automatizaciones complejas en minutos.' },
  { tag: 'Seguridad', tagClass: 'to2', title: 'Enterprise Security', desc: 'SOC 2 Type II, cifrado end-to-end, SSO, RBAC granular y auditoría completa. Tus datos nunca salen de tu infraestructura.' },
  { tag: 'Colaboración', tagClass: 'tg', title: 'Team Workspace', desc: 'Comparte agentes con permisos granulares. Control de versiones, reviews y deployment pipelines integrados.' },
  { tag: 'Observability', tagClass: 'tb', title: 'Unified Monitoring', desc: 'Logs, trazas distribuidas y visibilidad total sobre cada agente, contenedor y workload en ejecución.' },
];

const STATS = [
  { value: 99.9, suffix: '%', label: 'Uptime SLA', decimal: true },
  { value: 10, suffix: 'x', label: 'Flujos más rápidos', decimal: false },
  { value: 500, suffix: '+', label: 'Clientes enterprise', decimal: false },
  { value: 200, suffix: '+', label: 'Integraciones', decimal: false },
];

const TESTIMONIALS = [
  { quote: '"Axon 5 transformó nuestras operaciones. Automatizamos el 80% de nuestros flujos de soporte en solo dos semanas. El ROI fue inmediato y la experiencia de deploy es impecable."', name: 'Sarah Chen', role: 'CTO · TechCorp' },
  { quote: '"Nuestro equipo ahora se enfoca en trabajo estratégico mientras la IA maneja lo repetitivo. Los cold starts ridículamente rápidos cambiaron completamente nuestro workflow."', name: 'Marcus Johnson', role: 'Operations Lead · Scale' },
  { quote: '"Seguridad enterprise, API limpia y latencias increíblemente bajas. Axon 5 es la infraestructura de IA que los equipos modernos merecen tener."', name: 'Elena Rodriguez', role: 'VP Engineering · FinanceHub' },
];

const LOGOS = ['TechCorp', 'FinanceHub', 'ScaleAI', 'Cognition', 'DataFlow', 'NexusOps', 'CloudBase', 'VectorDB'];
const INTEGRATIONS = [
  { icon: '💬', name: 'Slack' }, { icon: '📋', name: 'Notion' }, { icon: '☁️', name: 'Salesforce' },
  { icon: '🐙', name: 'GitHub' }, { icon: '⚡', name: 'Zapier' }, { icon: '📊', name: 'BigQuery' },
  { icon: '🗄️', name: 'Postgres' }, { icon: '🔗', name: 'Webhook' }, { icon: '🔌', name: 'REST API' },
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

function Counter({ target, decimal, suffix }: { target: number; decimal: boolean; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState('0');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.unobserve(el);
      const dur = 1500, step = 16, frames = dur / step, inc = target / frames;
      let cur = 0;
      const id = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(id); }
        setVal(decimal ? cur.toFixed(1) : String(Math.floor(cur)));
      }, step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimal]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function ProductCard({ p, index }: { p: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-1, 1], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-1, 1], [-8, 8]), { stiffness: 300, damping: 30 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div
      ref={ref}
      className="pc"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className={`ptag ${p.tagClass}`}>{p.tag}</span>
      <h3>{p.title}</h3>
      <p>{p.desc}</p>
      <div className="parrow">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
    </motion.div>
  );
}

/* ─── TERMINAL PANELS ──────────────────────────────────── */
function TerminalCode() {
  return (
    <div className="term">
      <div className="tbar">
        <div className="td" style={{ background: '#ff5f57' }} /><div className="td" style={{ background: '#ffbd2e' }} /><div className="td" style={{ background: '#28ca41' }} />
        <span className="tn">axon_agent.py</span>
      </div>
      <div className="tbody">
        <div className="tc"># Despliega un agente en segundos</div>
        <div><span className="tk">import</span> axon5</div><br />
        <div><span className="tk">@</span><span className="tf">axon5.agent</span>(</div>
        <div>&nbsp;&nbsp;name=<span className="ts">"invoice-processor"</span>,</div>
        <div>&nbsp;&nbsp;gpu=<span className="ts">"A100"</span>,</div>
        <div>&nbsp;&nbsp;timeout=<span className="tnn">600</span></div>
        <div>)</div>
        <div><span className="tk">def</span> <span className="tf">process_invoice</span>(doc):</div>
        <div>&nbsp;&nbsp;<span className="tk">return</span> axon5.<span className="tf">extract</span>(doc)</div><br />
        <div className="tout">✓ Agent deployed · 0.28s cold start</div>
        <div className="tout">✓ Listening on axon5.app/invoice</div>
      </div>
    </div>
  );
}

function TerminalMetrics() {
  return (
    <div className="term">
      <div className="tbar">
        <div className="td" style={{ background: '#ff5f57' }} /><div className="td" style={{ background: '#ffbd2e' }} /><div className="td" style={{ background: '#28ca41' }} />
        <span className="tn">metrics · live</span>
      </div>
      <div style={{ padding: '18px' }}>
        <div className="drow"><span className="dlbl">Cold start</span><span className="dval g">0.28s</span></div>
        <div className="drow"><span className="dlbl">P99 latency</span><span className="dval b">42ms</span></div>
        <div className="drow"><span className="dlbl">Uptime (30d)</span><span className="dval g">99.97%</span></div>
        <div className="drow"><span className="dlbl">Agents activos</span><span className="dval">1,247</span></div>
        <div className="prow"><div className="plbl"><span>CPU</span><span>87%</span></div><div className="pbar"><div className="pfill" style={{ width: '87%' }} /></div></div>
        <div className="prow"><div className="plbl"><span>Memoria</span><span>63%</span></div><div className="pbar"><div className="pfill" style={{ width: '63%' }} /></div></div>
      </div>
    </div>
  );
}

function TerminalScale() {
  return (
    <div className="term">
      <div className="tbar">
        <div className="td" style={{ background: '#ff5f57' }} /><div className="td" style={{ background: '#ffbd2e' }} /><div className="td" style={{ background: '#28ca41' }} />
        <span className="tn">autoscaling · live</span>
      </div>
      <div className="tbody">
        <div className="tc"># 0 → 500 instancias bajo demanda</div><br />
        <div><span className="tk">@</span><span className="tf">axon5.agent</span>(</div>
        <div>&nbsp;&nbsp;autoscale=<span className="tk">True</span>,</div>
        <div>&nbsp;&nbsp;min_instances=<span className="tnn">0</span>,</div>
        <div>&nbsp;&nbsp;max_instances=<span className="tnn">500</span>,</div>
        <div>&nbsp;&nbsp;scale_to_zero=<span className="tk">True</span></div>
        <div>)</div><br />
        <div className="tout">↑ Scaling: 1 → 48 instances (2.1s)</div>
        <div className="tout">↑ Scaling: 48 → 312 instances (4.8s)</div>
        <div className="tout">✓ Cost: $0.00/hr at zero load</div>
      </div>
    </div>
  );
}

function TerminalIntegrations() {
  return (
    <div className="term">
      <div className="tbar">
        <div className="td" style={{ background: '#ff5f57' }} /><div className="td" style={{ background: '#ffbd2e' }} /><div className="td" style={{ background: '#28ca41' }} />
        <span className="tn">integrations</span>
      </div>
      <div className="igrid">
        {INTEGRATIONS.map((i) => (
          <div key={i.name} className="ic">
            <div className="ico">{i.icon}</div>
            <div className="icn">{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabTerminal({ type }: { type: string }) {
  if (type === 'code') return <TerminalCode />;
  if (type === 'metrics') return <TerminalMetrics />;
  if (type === 'scale') return <TerminalScale />;
  return <TerminalIntegrations />;
}

/* ─── CHAT ──────────────────────────────────────────────── */
const CHAT_REPLIES: Record<string, string> = {
  '¿Qué hace Axon 5?': 'Axon 5 automatiza flujos de trabajo con agentes de IA. Despliega en minutos, sin código. 🚀',
  '¿Cuánto cuesta?': 'Trial gratuito 14 días, sin tarjeta. Planes desde $49/mes.',
  'Quiero una demo': '¡Perfecto! Deja tu email y te contactamos en menos de 24h. 📅',
};

function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ text: string; from: 'bot' | 'user' }[]>([{ text: '¡Hola 👋! Soy el asistente de Axon 5. ¿En qué puedo ayudarte?', from: 'bot' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  const reply = (txt: string) => {
    setMsgs(m => [...m, { text: txt, from: 'user' }]);
    setShowQuick(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { text: CHAT_REPLIES[txt] || 'Gracias por tu mensaje. Nuestro equipo te responde pronto. 😊', from: 'bot' }]);
    }, 800 + Math.random() * 500);
  };

  const send = () => { if (input.trim()) { reply(input.trim()); setInput(''); } };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  return (
    <div id="cb">
      {open && (
        <motion.div id="cw" className="open" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
          <div id="ch">
            <div className="cav"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg></div>
            <div><div className="cnm">Axon 5 AI</div><div className="cst">En línea</div></div>
          </div>
          <div id="cm" ref={bodyRef}>
            {msgs.map((m, i) => <div key={i} className={`msg ${m.from}`}>{m.from === 'bot' ? <span dangerouslySetInnerHTML={{ __html: m.text.replace('Axon 5', '<strong>Axon 5</strong>') }} /> : m.text}</div>)}
            {typing && <div className="msg bot"><div className="typ"><span /><span /><span /></div></div>}
          </div>
          {showQuick && (
            <div id="cq">
              {['¿Qué hace Axon 5?', '¿Cuánto cuesta?', 'Quiero una demo'].map(q => (
                <button key={q} className="qb" onClick={() => reply(q)}>{q === 'Quiero una demo' ? 'Demo' : q}</button>
              ))}
            </div>
          )}
          <div id="cf">
            <input id="ci" type="text" placeholder="Escribe un mensaje…" autoComplete="off" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button id="csnd" onClick={send} disabled={!input.trim()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </motion.div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!open && <div id="cl">Habla con nosotros</div>}
        <button id="ct" className={open ? 'open' : ''} onClick={() => setOpen(v => !v)} aria-label="chat">
          {open
            ? <svg className="icx" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            : <svg className="ict" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          }
        </button>
      </div>
    </div>
  );
}

/* ─── FLOATING NEURAL NETWORK (CANVAS) ──────────────────── */
function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 45;
    const maxDistance = 150;
    
    let mouse = { x: -1000, y: -1000 };
    const interactionRadius = 200;

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLight = document.documentElement.classList.contains('light');
      const dotColor = isLight ? 'rgba(22, 163, 74, 0.4)' : 'rgba(34, 197, 94, 0.5)';
      const lineColor = isLight ? '22, 163, 74' : '34, 197, 94';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Interaction with mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dxx = p.x - p2.x;
          const dyy = p.y - p2.y;
          const d = Math.sqrt(dxx * dxx + dyy * dyy);

          if (d < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - d / maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="particles">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

/* ─── BENTO UPTIME DOTS ─────────────────────────────────── */
function UptimeDots() {
  const dots = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    cls: Math.random() > 0.05 ? 'ok' : Math.random() > 0.5 ? 'w' : '',
  }));
  return (
    <div className="udots">
      {dots.map(d => <div key={d.id} className={`ud ${d.cls}`} />)}
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────── */
export default function App() {
  const { scrollYProgress } = useScroll();

  // Nav solid on scroll
  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const fn = () => setNavSolid(window.scrollY > 28);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

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

  // Scroll-driven transforms
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const g1Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const g2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const g3Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Tabs
  const [activeTab, setActiveTab] = useState(0);

  // CTA email
  const [email, setEmail] = useState('');
  const [ctaDone, setCtaDone] = useState(false);
  const handleCTA = () => { if (email.trim()) setCtaDone(true); };

  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  const { ref: whyRef, visible: whyVisible } = useScrollReveal();
  const { ref: productsRef, visible: productsVisible } = useScrollReveal();
  const { ref: platformRef, visible: platformVisible } = useScrollReveal();
  const { ref: statsRef, visible: statsVisible } = useScrollReveal();
  const { ref: testiRef, visible: testiVisible } = useScrollReveal();

  return (
    <div className="site">
      {/* PROGRESS BAR */}
      <motion.div className="progress-bar" style={{ scaleX: progressScaleX }} />

      {/* NAV */}
      <nav id="nav" className={navSolid ? 'solid' : ''}>
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <defs><linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#22c55e" /><stop offset="1" stopColor="#15803d" /></linearGradient></defs>
            <rect width="36" height="36" rx="8" fill="url(#lg)" />
            <circle cx="18" cy="18" r="4" fill="rgba(0,0,0,.5)" />
            <circle cx="18" cy="18" r="2" fill="white" />
          </svg>
          <span className="nav-brand-name">Axon 5</span>
        </a>
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' });
            }}>{l.label}</a>
          ))}
        </div>
        <div className="nav-r">
          <a href="#" className="nav-txt" onClick={e => e.preventDefault()}>Docs</a>
          <a href="#" className="nav-txt" onClick={e => e.preventDefault()}>Login</a>
          
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <button className="btn-cta" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>Empezar gratis</button>
        </div>
        <button className="mob-btn" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <motion.div id="mob-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          {NAV_LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' });
            }}>{l.label}</a>
          ))}
          <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); }}>Docs</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); }}>Login</a>
        </motion.div>
      )}

      {/* HERO */}
      <section id="hero">
        <motion.div className="hero-grid" style={{ opacity: gridOpacity }} />
        <motion.div className="g1" style={{ y: g1Y }} />
        <motion.div className="g2" style={{ y: g2Y }} />
        <motion.div className="g3" style={{ y: g3Y }} />
        <div className="hero-fade" />
        <NeuralNetwork />

        <motion.div
          className="hero-in"
          style={{ scale: heroScale, y: heroY }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="bdot" />
            Now in Beta — AI Agents Platform
          </motion.div>

          <motion.h1
            className="hero-h1"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            AI que automatiza<br /><em>workflows enteros</em>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Axon 5 trae agentes de IA autónomos a tu empresa. Despliega, escala y optimiza procesos en minutos — sin código, sin fricciones.
          </motion.p>

          <motion.div
            className="hero-code"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.6 }}
            onClick={() => { navigator.clipboard.writeText('pip install axon5 && axon deploy').catch(() => { }); }}
            title="Copiar comando"
          >
            <span className="p">$</span>
            <span className="cmd">pip install axon5 &amp;&amp; axon deploy</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </motion.div>

          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.6 }}
          >
            <button className="btn-p" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>Empezar gratis</button>
            <button className="btn-o" onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}>Ver cómo funciona</button>
          </motion.div>

          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {['Sin tarjeta de crédito', '14 días gratis', 'Cancela cuando quieras', 'SOC 2 Certificado'].map(t => (
              <span key={t} className="ti">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D FLOATING ORBS */}
        <div className="hero-3d-orbs" aria-hidden>
          <div className="orb-a" />
          <div className="orb-b" />
          <div className="orb-c" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq-sec">
        <p className="mq-lbl">Confiado por equipos en todo el mundo</p>
        <div className="mq-wrap">
          <div className="mq-track">
            {[...LOGOS, ...LOGOS].map((l, i) => <div key={i} className="lb">{l}</div>)}
          </div>
        </div>
      </div>

      {/* WHY AXON 5 */}
      <section id="why" ref={whyRef}>
        <div className="sec-in" style={{ paddingTop: '76px' }}>
          <motion.div
            className="reveal"
            initial={{ opacity: 0, y: 30 }}
            animate={whyVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">Por qué Axon 5</div>
            <h2 className="sec-h2">Diseñado para que los equipos<br /><em>desplieguen más rápido</em></h2>
          </motion.div>

          <motion.div
            className="tabs-row"
            initial={{ opacity: 0, y: 20 }}
            animate={whyVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ marginTop: '38px' }}
          >
            {TABS.map((t, i) => (
              <button key={i} className={`tbtn${activeTab === i ? ' on' : ''}`} onClick={() => setActiveTab(i)}>{t.label}</button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={whyVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {TABS.map((t, i) => (
              <div key={i} className={`tpanel${activeTab === i ? ' on' : ''}`}>
                <div className="tp-txt">
                  <h3>{t.title}</h3>
                  <p>{t.desc1}</p>
                  <p>{t.desc2}</p>
                  <a href="#cta" className="lm" onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                  }}>{t.link}</a>
                </div>
                <TabTerminal type={t.terminal} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="sec sec-alt" ref={productsRef}>
        <div className="sec-in">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={productsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">Productos</div>
            <h2 className="sec-h2">Potencia cualquier<br /><em>flujo de IA</em></h2>
            <p className="sec-lead">Desde automatización hasta análisis avanzado — Axon 5 tiene el agente correcto para cada necesidad.</p>
          </motion.div>
          <div className="pgrid">
            {PRODUCTS.map((p, i) => <ProductCard key={p.title} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* PLATFORM BENTO */}
      <section id="platform" className="sec" ref={platformRef}>
        <div className="sec-in">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={platformVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">Plataforma</div>
            <h2 className="sec-h2">Construye sobre una<br /><em>base sólida</em></h2>
            <p className="sec-lead">Cada capa de Axon 5 está optimizada para escalar workloads de IA sin límites.</p>
          </motion.div>
          <motion.div
            className="bento"
            initial={{ opacity: 0, y: 30 }}
            animate={platformVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div className="bc bc1">
              <h4>Runtime nativo de IA</h4>
              <p>Diseñado desde cero para workloads de IA. Autoscaling ultra-rápido y inicialización de modelos optimizada. 100x más rápido que Docker.</p>
              <div className="cbadge">axon5 run --gpu A100 --scale auto</div>
            </div>
            <div className="bc bc2">
              <h4>Rendimiento en tiempo real</h4>
              <p>Monitorea latencia, throughput y errores en tiempo real. Alertas inteligentes y root cause analysis automático.</p>
              <div className="mchart">
                {[35, 55, 48, 78, 62, 90, 72, 100, 76, 84, 68, 95].map((h, i) => (
                  <div key={i} className="mbar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bc bc3">
              <h4>Alta disponibilidad</h4>
              <p>SLA 99.9%. Replicación multi-región y failover automático sin configuración.</p>
              <UptimeDots />
            </div>
            <div className="bc bc4">
              <h4>Almacenamiento distribuido</h4>
              <p>Filesystem compartido, caché de modelos y object storage integrado para todos tus agentes.</p>
              <div className="cbadge">axon5.storage.get("model.pt")</div>
            </div>
            <div className="bc bc5">
              <h4>Secrets &amp; Config</h4>
              <p>Gestiona variables de entorno y secrets con versionado completo y auditoría.</p>
              <div className="cbadge">axon5.secret("API_KEY")</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <div className="srow" ref={statsRef}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="sc"
            initial={{ opacity: 0, y: 30 }}
            animate={statsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div className="snum">
              {statsVisible && <Counter target={s.value} decimal={s.decimal} suffix={s.suffix} />}
            </div>
            <div className="slbl">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <section id="testi" className="sec sec-alt" ref={testiRef}>
        <div className="sec-in">
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            animate={testiVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Testimonios</div>
            <h2 className="sec-h2">Amado por equipos<br />en todo el mundo</h2>
          </motion.div>
          <div className="tgrid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="tcard"
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                animate={testiVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="tq">{t.quote}</p>
                <div className="tau">
                  <div className="tav" />
                  <div><div className="tnm">{t.name}</div><div className="tro">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-sec">
        <motion.div
          className="cta-bx"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
        >
          <div className="cta-glow" />
          <h2 className="cta-h2">Empieza a automatizar hoy</h2>
          <p className="cta-sub">Únete a más de 500 equipos que ya usan Axon 5 para construir más rápido. Trial gratuito, sin fricción.</p>
          <div className="cta-form">
            <input
              className="cta-inp"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCTA()}
            />
            <button
              className="btn-p"
              onClick={handleCTA}
              style={ctaDone ? { background: '#4ade80' } : {}}
              disabled={ctaDone}
            >
              {ctaDone ? '✓ ¡Listo!' : 'Empezar gratis'}
            </button>
          </div>
          <p className="cta-note">14 días gratis · Sin tarjeta · Cancela cuando quieras</p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="ft-in">
          <div className="ft-top">
            <div className="ft-brand">
              <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
                  <defs><linearGradient id="fl" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#22c55e" /><stop offset="1" stopColor="#15803d" /></linearGradient></defs>
                  <rect width="36" height="36" rx="8" fill="url(#fl)" />
                  <circle cx="18" cy="18" r="4" fill="rgba(0,0,0,.5)" />
                  <circle cx="18" cy="18" r="2" fill="white" />
                </svg>
                <span className="nav-brand-name">Axon 5</span>
              </a>
              <p>Agentes de IA autónomos para equipos modernos. Automatiza, escala y crece sin límites.</p>
              <div className="ft-soc">
                {['T', 'G', 'L'].map(s => (
                  <a key={s} href="#" className="soc" onClick={e => e.preventDefault()}>
                    {s === 'T' && <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>}
                    {s === 'G' && <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>}
                    {s === 'L' && <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}
                  </a>
                ))}
              </div>
            </div>
            <div className="fc"><h5>Producto</h5><ul>{['Features', 'Integraciones', 'Pricing', 'Changelog', 'Roadmap'].map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}</ul></div>
            <div className="fc"><h5>Empresa</h5><ul>{['Nosotros', 'Blog', 'Careers', 'Prensa', 'Contacto'].map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}</ul></div>
            <div className="fc"><h5>Recursos</h5><ul>{['Documentación', 'API Reference', 'Comunidad', 'Status', 'Security'].map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}</ul></div>
          </div>
          <div className="ft-bot">
            <p>© 2026 Axon 5, Inc. Todos los derechos reservados.</p>
            <div className="ft-leg">{['Privacidad', 'Términos', 'Cookies'].map(l => <a key={l} href="#" onClick={e => e.preventDefault()}>{l}</a>)}</div>
          </div>
        </div>
      </footer>

      {/* CHAT */}
      <Chat />
    </div>
  );
}
