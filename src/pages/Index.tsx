import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── tiny helpers ───────── */
const useMouse = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
};

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const W = () => (typeof window !== "undefined" ? window.innerWidth : 1920);
const H = () => (typeof window !== "undefined" ? window.innerHeight : 1080);

/* ───────── stable random seeds ───────── */
const stableRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const stars = Array.from({ length: 200 }, (_, i) => ({
  x: stableRandom(i) * 100,
  y: stableRandom(i + 500) * 100,
  size: stableRandom(i + 1000) * 2.5 + 0.5,
  delay: stableRandom(i + 1500) * 5,
  dur: stableRandom(i + 2000) * 3 + 2,
}));

const particles = Array.from({ length: 40 }, (_, i) => ({
  x: stableRandom(i + 3000) * 100,
  y: stableRandom(i + 3500) * 100,
  delay: stableRandom(i + 4000) * 4,
  dur: stableRandom(i + 4500) * 3 + 3,
}));

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
const Index = () => {
  const mouse = useMouse();
  const mx = (mouse.x / W() - 0.5) * 2;
  const my = (mouse.y / H() - 0.5) * 2;

  /* audio wave */
  const [wave, setWave] = useState<number[]>(Array(30).fill(30));
  useEffect(() => {
    const id = setInterval(() => {
      setWave(Array.from({ length: 30 }, () => Math.random() * 100));
    }, 120);
    return () => clearInterval(id);
  }, []);

  /* smooth nav scroll */
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* section visibility */
  const hero = useInView();
  const feat = useInView();
  const spec = useInView();
  const exp  = useInView();
  const cta  = useInView();

  return (
    <div className="relative bg-[#030712] text-white overflow-x-hidden">

      {/* ── cursor glow ── */}
      <div
        className="fixed pointer-events-none z-[60] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] transition-transform duration-200"
        style={{
          left: mouse.x, top: mouse.y,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(34,211,238,.7) 0%, rgba(139,92,246,.3) 50%, transparent 70%)",
        }}
      />

      {/* ── starfield ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white/60 animate-pulse"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`,
              transform: `translate(${mx * 8}px, ${my * 8}px)`,
              transition: "transform .6s ease-out",
            }}
          />
        ))}
      </div>

      {/* ── floating particles ── */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {particles.map((p, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-ping"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
              transform: `translate(${mx * 20}px, ${my * 20}px)`,
              transition: "transform .8s ease-out",
            }}
          />
        ))}
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* logo */}
          <button onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,.4)] group-hover:shadow-[0_0_35px_rgba(34,211,238,.7)] transition-all">
              <span className="text-white font-black text-lg">N</span>
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              NEUEAR
            </span>
          </button>

          {/* links */}
          <div className="hidden md:flex gap-8">
            {[
              ["HOME","hero"],["FEATURES","features"],["SPECS","specs"],["EXPERIENCE","experience"],["PRE-ORDER","preorder"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="relative text-sm font-medium tracking-widest text-white/70 hover:text-cyan-400 transition-all group">
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all group-hover:w-full shadow-[0_0_8px_rgba(34,211,238,.6)]" />
              </button>
            ))}
          </div>

          <button onClick={() => scrollTo("preorder")}
            className="hidden md:block px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all shadow-[0_0_20px_rgba(34,211,238,.3)] hover:shadow-[0_0_30px_rgba(34,211,238,.6)] hover:scale-105 active:scale-95">
            ORDER NOW
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
         ═══════════════════════════════════════════ */}
      <section id="hero" ref={hero.ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* large radial glow */}
        <div className="absolute w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-[160px] animate-glow-strong pointer-events-none"
          style={{ transform: `translate(${mx * 40}px, ${my * 40}px)` }} />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] animate-glow-pulse pointer-events-none translate-x-40 -translate-y-20"
          style={{ transform: `translate(${mx * -30}px, ${my * -30}px)` }} />

        <div className={`relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center gap-12 transition-all duration-1000 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>

          {/* text */}
          <div className="flex-1 text-center lg:text-left space-y-8"
            style={{ transform: `translate(${mx * 12}px, ${my * 12}px)`, transition: "transform .4s ease-out" }}>
            <p className="text-cyan-400 font-mono text-sm tracking-[.3em] uppercase animate-shimmer bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent">
              Next-Gen Acoustic Intelligence
            </p>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">
              <span className="block">IMMERSION.</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent neon-text animate-text-glow">
                REDEFINED.
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience spatial audio beyond reality. The <strong className="text-white">NEUEAR CyberAcoustics S18</strong> delivers
              48-driver neural sound architecture with AI-adaptive noise sculpting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => scrollTo("preorder")}
                className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_30px_rgba(34,211,238,.4)] hover:shadow-[0_0_50px_rgba(34,211,238,.7)] hover:scale-105 active:scale-95 transition-all">
                PRE-ORDER — $349
              </button>
              <button onClick={() => scrollTo("experience")}
                className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,.2)]">
                ▶ Experience Sound
              </button>
            </div>
          </div>

          {/* 3D headphone */}
          <div className="flex-1 flex items-center justify-center perspective-2000"
            style={{ transform: `translate(${mx * -15}px, ${my * -15}px)`, transition: "transform .5s ease-out" }}>
            <div className="relative preserve-3d animate-float"
              style={{ transform: `rotateY(${mx * 8}deg) rotateX(${-my * 5}deg)` }}>
              {/* orbit rings */}
              <div className="absolute inset-[-60px] rounded-full border border-cyan-400/20 animate-orbit pointer-events-none" />
              <div className="absolute inset-[-100px] rounded-full border border-purple-400/15 animate-orbit-reverse pointer-events-none" />
              <div className="absolute inset-[-140px] rounded-full border border-cyan-400/10 animate-orbit pointer-events-none" style={{ animationDuration: "25s" }} />

              {/* glow base */}
              <div className="absolute inset-[-30px] rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-[60px] animate-glow-pulse" />

              {/* headband */}
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* band arc */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-16 rounded-t-[120px] border-t-4 border-l-4 border-r-4 border-cyan-400/70 bg-gradient-to-b from-slate-700/80 to-transparent"
                  style={{ boxShadow: "0 -10px 40px rgba(34,211,238,.3)" }} />

                {/* left earcup */}
                <div className="absolute left-0 top-12 w-36 h-36 md:w-40 md:h-40">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-[3px] border-cyan-400/60 shadow-[0_0_50px_rgba(34,211,238,.5),inset_0_0_30px_rgba(34,211,238,.1)]">
                    <div className="absolute inset-3 rounded-full border border-cyan-400/30" />
                    <div className="absolute inset-6 rounded-full border border-cyan-400/15" />
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-cyan-400/5 border border-cyan-400/40 animate-pulse shadow-[0_0_15px_rgba(34,211,238,.4)]" />
                    </div>
                  </div>
                  {/* mini wave */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center gap-[2px]">
                    {[14,22,18,28,16,24,12].map((h, i) => (
                      <div key={i} className="w-[3px] rounded-full bg-gradient-to-t from-cyan-400/60 to-purple-400/40"
                        style={{ height: h, animation: `waveBar ${1 + stableRandom(i) * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                </div>

                {/* right earcup */}
                <div className="absolute right-0 top-12 w-36 h-36 md:w-40 md:h-40">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-[3px] border-cyan-400/60 shadow-[0_0_50px_rgba(34,211,238,.5),inset_0_0_30px_rgba(34,211,238,.1)]">
                    <div className="absolute inset-3 rounded-full border border-cyan-400/30" />
                    <div className="absolute inset-6 rounded-full border border-cyan-400/15" />
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-purple-400/50 bg-purple-500/10 animate-pulse shadow-[0_0_20px_rgba(168,85,247,.5)]" />
                    </div>
                  </div>
                  {/* mini wave right */}
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center gap-[2px]">
                    {[18,26,14,30,20,22,16].map((h, i) => (
                      <div key={i} className="w-[3px] rounded-full bg-gradient-to-t from-purple-400/60 to-cyan-400/40"
                        style={{ height: h, animation: `waveBar ${1.2 + stableRandom(i + 50) * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>

                {/* cushion L */}
                <div className="absolute left-1 top-16 w-10 h-24 rounded-l-full bg-gradient-to-r from-slate-800/80 to-transparent border-l-2 border-t border-b border-cyan-400/20" />
                {/* cushion R */}
                <div className="absolute right-1 top-16 w-10 h-24 rounded-r-full bg-gradient-to-l from-slate-800/80 to-transparent border-r-2 border-t border-b border-cyan-400/20" />
              </div>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-xs tracking-widest text-white/50">SCROLL</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — FEATURES
         ═══════════════════════════════════════════ */}
      <section id="features" ref={feat.ref} className="relative py-32 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -left-64 top-0 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute w-[500px] h-[500px] -right-64 bottom-0 bg-cyan-500/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${feat.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
            <p className="text-cyan-400 font-mono text-sm tracking-[.3em] mb-4">TECHNOLOGY</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                BEYOND SOUND
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Engineered with military-grade precision. Every component pushes the boundary of what headphones can deliver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: "Neural Sound AI", desc: "Adaptive algorithms learn your ear anatomy in real-time, delivering personalized spatial audio that evolves with you.", accent: "cyan" },
              { icon: "⚡", title: "48-Driver Array", desc: "Military-grade micro-driver architecture produces frequency response from 4Hz to 80kHz — beyond human perception.", accent: "purple" },
              { icon: "🌊", title: "Acoustic Holography", desc: "3D sound staging creates phantom speakers around you. Feel music in physical space, not just your ears.", accent: "cyan" },
              { icon: "🔋", title: "120h Quantum Cell", desc: "Graphene-enhanced solid-state battery delivers 120 hours with active noise cancellation enabled.", accent: "purple" },
              { icon: "🛡️", title: "Noise Sculpting", desc: "Don't just cancel noise — sculpt it. AI lets you choose which frequencies pass through in real-time.", accent: "cyan" },
              { icon: "📡", title: "Zero-Latency Link", desc: "Proprietary 6GHz wireless protocol delivers lossless audio at 0.5ms latency. Gaming and music, perfected.", accent: "purple" },
            ].map((f, i) => (
              <div key={i}
                className={`group relative p-8 rounded-2xl glass transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(34,211,238,.15)] cursor-default ${feat.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 120}ms` }}>
                {/* glow border on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${f.accent === "cyan" ? "shadow-[inset_0_0_1px_1px_rgba(34,211,238,.3)]" : "shadow-[inset_0_0_1px_1px_rgba(168,85,247,.3)]"}`} />
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${f.accent === "cyan" ? "group-hover:text-cyan-400" : "group-hover:text-purple-400"} transition-colors`}>{f.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{f.desc}</p>
                {/* bottom glow line */}
                <div className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${f.accent === "cyan" ? "from-transparent via-cyan-400/50 to-transparent" : "from-transparent via-purple-400/50 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — SPECS (3D ring)
         ═══════════════════════════════════════════ */}
      <section id="specs" ref={spec.ref} className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

          {/* 3D ring */}
          <div className={`flex-1 flex justify-center perspective-2000 transition-all duration-1000 ${spec.visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="relative w-80 h-80">
              {/* rotating rings */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-orbit shadow-[0_0_30px_rgba(34,211,238,.2)]" />
              <div className="absolute inset-8 rounded-full border border-purple-400/30 animate-orbit-reverse shadow-[0_0_20px_rgba(168,85,247,.15)]" />
              <div className="absolute inset-16 rounded-full border border-cyan-400/20 animate-orbit" style={{ animationDuration: "25s" }} />

              {/* center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent border border-cyan-400/30 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,.3)]">
                  <span className="text-3xl font-black bg-gradient-to-b from-cyan-400 to-purple-400 bg-clip-text text-transparent">S18</span>
                </div>
              </div>

              {/* data points around ring */}
              {[
                { label: "4Hz–80kHz", angle: -30 },
                { label: "48 Drivers", angle: 30 },
                { label: "0.5ms", angle: 90 },
                { label: "120h", angle: 150 },
                { label: "32-bit/384kHz", angle: 210 },
                { label: "6GHz", angle: 270 },
              ].map((d, i) => {
                const rad = (d.angle * Math.PI) / 180;
                const r = 175;
                return (
                  <div key={i} className="absolute text-xs font-mono text-cyan-400/70 whitespace-nowrap"
                    style={{ left: `calc(50% + ${Math.cos(rad) * r}px - 30px)`, top: `calc(50% + ${Math.sin(rad) * r}px - 10px)` }}>
                    {d.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* text */}
          <div className={`flex-1 space-y-8 transition-all duration-1000 delay-300 ${spec.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <p className="text-purple-400 font-mono text-sm tracking-[.3em]">SPECIFICATIONS</p>
            <h2 className="text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                ENGINEERED FOR THE IMPOSSIBLE
              </span>
            </h2>
            <div className="space-y-6">
              {[
                { label: "Sound Resolution", value: "32-bit / 384kHz", pct: 98 },
                { label: "Frequency Range", value: "4Hz – 80kHz", pct: 95 },
                { label: "Wireless Latency", value: "0.5ms", pct: 99 },
                { label: "Battery Life", value: "120 hours", pct: 90 },
                { label: "ANC Depth", value: "-52dB", pct: 96 },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{s.label}</span>
                    <span className="text-cyan-400 font-mono">{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,.5)]"
                      style={{ width: spec.visible ? `${s.pct}%` : "0%" , transitionDelay: `${i * 150 + 500}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — EXPERIENCE (3D visualizer)
         ═══════════════════════════════════════════ */}
      <section id="experience" ref={exp.ref} className="relative py-32 overflow-hidden">
        <div className="absolute w-[700px] h-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${exp.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
            <p className="text-cyan-400 font-mono text-sm tracking-[.3em] mb-4">IMMERSIVE AUDIO</p>
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                FEEL THE FREQUENCY
              </span>
            </h2>
          </div>

          {/* visualizer */}
          <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-300 ${exp.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            {/* container with perspective */}
            <div className="relative h-72 md:h-96 rounded-3xl glass overflow-hidden perspective-1000"
              style={{ transform: `rotateX(${my * 3}deg) rotateY(${mx * 3}deg)`, transition: "transform .3s ease-out" }}>
              {/* background glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-purple-500/5" />

              {/* wave bars */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] md:gap-1 h-full px-4 py-8">
                {wave.map((h, i) => {
                  const isCyan = i % 3 !== 0;
                  return (
                    <div key={i} className="flex-1 max-w-3 rounded-t-full transition-all duration-150"
                      style={{
                        height: `${h}%`,
                        background: isCyan
                          ? `linear-gradient(to top, rgba(34,211,238,.8), rgba(34,211,238,.2))`
                          : `linear-gradient(to top, rgba(168,85,247,.8), rgba(168,85,247,.2))`,
                        boxShadow: isCyan
                          ? `0 0 ${h / 8}px rgba(34,211,238,.6)`
                          : `0 0 ${h / 8}px rgba(168,85,247,.6)`,
                      }}
                    />
                  );
                })}
              </div>

              {/* floating frequency label */}
              <div className="absolute top-6 left-6 text-xs font-mono text-white/30">
                FREQ: 20Hz — 80kHz &nbsp;|&nbsp; BIT: 32 &nbsp;|&nbsp; SAMPLE: 384kHz
              </div>
              <div className="absolute top-6 right-6 text-xs font-mono text-cyan-400/50 animate-pulse">
                ● LIVE
              </div>
            </div>

            {/* 3D shadow */}
            <div className="h-4 mx-12 rounded-b-3xl bg-gradient-to-b from-white/[0.02] to-transparent blur-sm" />
          </div>

          {/* experience stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 transition-all duration-1000 delay-500 ${exp.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            {[
              { val: "360°", label: "Spatial Audio" },
              { val: "0.5ms", label: "Latency" },
              { val: "52dB", label: "Noise Cancellation" },
              { val: "48", label: "Micro Drivers" },
            ].map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl glass hover:bg-white/[0.04] transition-all group cursor-default">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {s.val}
                </div>
                <div className="text-sm text-white/40 mt-2 font-mono tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — PRE-ORDER CTA
         ═══════════════════════════════════════════ */}
      <section id="preorder" ref={cta.ref} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent" />
          <div className="absolute w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${cta.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          {/* rotating border box */}
          <div className="relative p-12 md:p-20 rounded-3xl overflow-hidden">
            {/* animated gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[1px]">
              <div className="absolute inset-[-200%] animate-rotate-gradient bg-[conic-gradient(from_0deg,rgba(34,211,238,.4),rgba(168,85,247,.4),rgba(34,211,238,.1),rgba(168,85,247,.4),rgba(34,211,238,.4))]" />
              <div className="absolute inset-[1px] rounded-3xl bg-[#060d1f]" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                LIMITED EDITION — BATCH 001
              </div>

              <h2 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  OWN THE FUTURE
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-3xl md:text-4xl mt-2">
                  OF AUDIO
                </span>
              </h2>

              <p className="text-white/50 max-w-xl mx-auto text-lg">
                First 500 pre-orders receive a custom-engraved titanium case, lifetime firmware updates, and exclusive access to NEUEAR SoundLab.
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-white/30 line-through text-xl">$499</span>
                  <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">$349</span>
                </div>
                <button
                  className="group relative px-12 py-5 rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,211,238,.3)] hover:shadow-[0_0_60px_rgba(34,211,238,.5)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:from-cyan-400 group-hover:to-purple-400 transition-all" />
                  <span className="relative z-10">PRE-ORDER NOW</span>
                </button>
                <span className="text-xs text-white/30 font-mono">Ships Q2 2026 · Free worldwide shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════ */}
      <footer className="relative border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">NEUEAR</span>
          </div>
          <div className="flex gap-8 text-sm text-white/30">
            <button onClick={() => scrollTo("features")} className="hover:text-cyan-400 transition-colors">Features</button>
            <button onClick={() => scrollTo("specs")} className="hover:text-cyan-400 transition-colors">Specs</button>
            <button onClick={() => scrollTo("experience")} className="hover:text-cyan-400 transition-colors">Experience</button>
            <button onClick={() => scrollTo("preorder")} className="hover:text-cyan-400 transition-colors">Pre-Order</button>
          </div>
          <p className="text-xs text-white/20 font-mono">© 2026 NEUEAR Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
