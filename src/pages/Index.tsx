import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [audioWave, setAudioWave] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isHoveringHeadphones, setIsHoveringHeadphones] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Interactive audio visualizer
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const generateWave = () => {
      const baseWave = Array.from({ length: 20 }, () => Math.random() * 100);
      // Make waves respond to mouse position
      const mouseInfluence = typeof window !== "undefined" && window.innerWidth > 0 ? mousePosition.x / window.innerWidth : 0;
      const adjustedWave = baseWave.map((val, i) => {
        const distance = Math.abs(i / 20 - mouseInfluence);
        return val * (1 - distance * 0.5);
      });
      setAudioWave(adjustedWave);
    };

    generateWave();
    const interval = setInterval(generateWave, 100);
    return () => clearInterval(interval);
  }, [mousePosition]);

  // Smooth scroll for navigation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate parallax and interactive transforms
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
  const parallaxX = (mousePosition.x / windowWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / windowHeight - 0.5) * 20;
  const scrollParallax = scrollY * 0.5;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950"
    >
      {/* Interactive cursor glow effect */}
      <div
        className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(34,211,238,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Enhanced animated starry background with parallax */}
      <div className="absolute inset-0" style={{ transform: `translateY(${scrollParallax * 0.3}px)` }}>
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/30 animate-pulse transition-all duration-1000"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              transform: `translate(${(mousePosition.x / windowWidth - 0.5) * 10}px, ${(mousePosition.y / windowHeight - 0.5) * 10}px)`,
            }}
          />
        ))}
      </div>

      {/* Interactive Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-black/20">
        <div
          className="text-3xl font-bold text-cyan-400 cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          style={{
            transform: `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)`,
          }}
        >
          X
        </div>
        <div className="flex gap-8">
          {["HOME", "FEATURES", "SHOP", "SUPPORT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item.toLowerCase())}
              className="text-white hover:text-cyan-400 transition-all duration-300 font-medium relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content with Interactive Elements */}
      <div
        id="home"
        className="relative z-10 flex items-center justify-between px-8 py-20 min-h-[calc(100vh-120px)]"
      >
        {/* Left Side - Text Content with animations */}
        <div
          className="flex-1 max-w-2xl transition-all duration-500"
          style={{
            transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3 + scrollParallax * 0.2}px)`,
          }}
        >
          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block transition-all duration-300 hover:scale-105 hover:text-cyan-400">
              IMMERSION.
            </span>
            <br />
            <span
              className="text-cyan-400 inline-block transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]"
              style={{
                textShadow: `0 0 ${20 + Math.abs(parallaxX) * 0.5}px rgba(34,211,238,0.6)`,
              }}
            >
              REDFINED
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed transition-all duration-300 hover:text-white">
            Experience audio like never before with the new CYBER-ACOUSTICS S18. Pre-order now.
          </p>
          <Button
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] hover:scale-105 active:scale-95"
            style={{
              transform: isHoveringButton
                ? `scale(1.05) translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)`
                : `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)`,
              boxShadow: isHoveringButton
                ? `0 0 40px rgba(34,211,238,0.8), 0 0 80px rgba(34,211,238,0.4)`
                : `0 0 20px rgba(34,211,238,0.3)`,
            }}
          >
            PRE-ORDER NOW
          </Button>
        </div>

        {/* Right Side - Interactive Headphones with Visualizer */}
        <div
          className="flex-1 flex items-center justify-center relative"
          onMouseEnter={() => setIsHoveringHeadphones(true)}
          onMouseLeave={() => setIsHoveringHeadphones(false)}
        >
          {/* Interactive Audio Visualizer */}
          <div
            className="absolute right-0 flex items-end gap-1 h-64 transition-all duration-300"
            style={{
              transform: `translateY(${parallaxY * 0.2}px) scale(${isHoveringHeadphones ? 1.1 : 1})`,
            }}
          >
            {audioWave.map((height, i) => {
              const distance = Math.abs(i - (mousePosition.x / windowWidth) * 20);
              const intensity = 1 - distance / 20;
              return (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-full transition-all duration-100 cursor-pointer hover:from-cyan-300 hover:to-cyan-500"
                  style={{
                    height: `${height}%`,
                    boxShadow: `0 0 ${(height / 10) * (1 + intensity)}px rgba(34,211,238,${0.8 + intensity * 0.2})`,
                    transform: `scaleY(${1 + intensity * 0.2})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scaleY(1.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `scaleY(${1 + intensity * 0.2})`;
                  }}
                />
              );
            })}
          </div>

          {/* Interactive Headphones Illustration */}
          <div
            className="relative z-10 transition-all duration-500 cursor-pointer"
            style={{
              transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px) rotateY(${parallaxX * 0.1}deg) rotateX(${-parallaxY * 0.1}deg) scale(${isHoveringHeadphones ? 1.1 : 1})`,
            }}
          >
            {/* Headband with glow effect */}
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full border-2 border-cyan-400/50 transition-all duration-300"
              style={{
                boxShadow: isHoveringHeadphones
                  ? `0 0 50px rgba(34,211,238,0.8), inset 0 0 20px rgba(34,211,238,0.2)`
                  : `0 0 30px rgba(34,211,238,0.5)`,
              }}
            />

            {/* Left Earcup */}
            <div className="relative -ml-32">
              <div
                className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-cyan-400 transition-all duration-300"
                style={{
                  boxShadow: isHoveringHeadphones
                    ? `0 0 60px rgba(34,211,238,0.8), inset 0 0 60px rgba(34,211,238,0.2)`
                    : `0 0 40px rgba(34,211,238,0.6), inset 0 0 40px rgba(34,211,238,0.1)`,
                  transform: `rotateZ(${parallaxX * 0.05}deg)`,
                }}
              >
                <div className="absolute inset-4 rounded-full border-2 border-cyan-400/30 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-slate-900/50" />
              </div>
              {/* Interactive audio waves near left earcup */}
              <div
                className="absolute -left-8 top-1/2 -translate-y-1/2 flex gap-1 transition-all duration-300"
                style={{
                  transform: `scale(${isHoveringHeadphones ? 1.2 : 1})`,
                }}
              >
                {[20, 40, 30, 50, 25].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-400/40 rounded-full animate-pulse cursor-pointer hover:bg-cyan-400/80 transition-colors"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Earcup */}
            <div className="relative">
              <div
                className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-cyan-400 transition-all duration-300"
                style={{
                  boxShadow: isHoveringHeadphones
                    ? `0 0 60px rgba(34,211,238,0.8), inset 0 0 60px rgba(34,211,238,0.2)`
                    : `0 0 40px rgba(34,211,238,0.6), inset 0 0 40px rgba(34,211,238,0.1)`,
                  transform: `rotateZ(${-parallaxX * 0.05}deg)`,
                }}
              >
                <div className="absolute inset-4 rounded-full border-2 border-cyan-400/30 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-slate-900/50 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 transition-all duration-300"
                    style={{
                      animation: isHoveringHeadphones ? "pulse 0.5s infinite" : "pulse 2s infinite",
                      boxShadow: isHoveringHeadphones
                        ? `0 0 30px rgba(34,211,238,0.8), inset 0 0 20px rgba(34,211,238,0.3)`
                        : `0 0 10px rgba(34,211,238,0.5)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Glowing Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => {
          const baseX = (i * 37) % 100;
          const baseY = (i * 23) % 100;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full transition-all duration-1000"
              style={{
                left: `${baseX}%`,
                top: `${baseY}%`,
                transform: `translate(${(mousePosition.x / windowWidth - 0.5) * 50}px, ${(mousePosition.y / windowHeight - 0.5) * 50}px)`,
                opacity: 0.6 + Math.sin(Date.now() / 1000 + i) * 0.4,
                boxShadow: `0 0 ${5 + Math.abs(parallaxX) * 0.1}px rgba(34,211,238,0.8)`,
              }}
            />
          );
        })}
      </div>

      {/* Interactive Ripple Effect on Click */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400/20 animate-ping"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.2}s`,
              animationDuration: "2s",
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
