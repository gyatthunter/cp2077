import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

const ReactiveBackground = () => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);
  const rippleId = useRef(0);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Generate trail particles with throttle
      const now = Date.now();
      if (now - lastTrailTime.current > 40) {
        lastTrailTime.current = now;
        const id = Date.now() + Math.random();
        setTrail(prev => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setTrail(prev => prev.filter(t => t.id !== id));
        }, 600);
      }

      // Check if hovering on interactive element
      const el = e.target;
      const interactive = el.closest('a, button, [role="button"], input, .cyber-card');
      setIsHovering(!!interactive);
    };

    const handleClick = (e) => {
      const id = rippleId.current++;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="reactive-bg">
      {/* Main glow */}
      <div
        className="cursor-glow cursor-glow-main"
        style={{ left: pos.x, top: pos.y }}
      />
      {/* Bright core */}
      <div
        className="cursor-glow cursor-glow-core"
        style={{ left: pos.x, top: pos.y }}
      />
      {/* Ring cursor */}
      <div
        className={`cursor-glow cursor-glow-ring ${isHovering ? 'active' : ''}`}
        style={{ left: pos.x, top: pos.y }}
      />
      {/* Trail particles */}
      {trail.map((t, i) => (
        <div
          key={t.id}
          style={{
            position: 'fixed',
            left: t.x,
            top: t.y,
            width: 4 + i * 0.5,
            height: 4 + i * 0.5,
            backgroundColor: '#fce100',
            borderRadius: '50%',
            opacity: 0.1 + (i / trail.length) * 0.15,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0,
            filter: `blur(${2 + i * 0.3}px)`,
            transition: 'opacity 0.3s ease-out',
          }}
        />
      ))}
      {/* Click ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
};

const TypeWriter = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="typing-cursor"></span></span>;
};

const BootSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  
  const bootLogs = [
    "INITIALIZING NEURAL LINK...",
    "LOADING MEMORY CORE: 0x00FF8...",
    "BYPASSING ICE PROTOCOLS...",
    "CONNECTING TO NIGHT CITY GRID...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500); // Small delay before hiding
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="boot-sequence">
      {logs.map((log, index) => (
        <div key={index} className="boot-text">{"> "}{log}</div>
      ))}
      {logs.length < bootLogs.length && (
        <div className="boot-text">{"> "}<span className="typing-cursor"></span></div>
      )}
    </div>
  );
};

const DataTicker = () => (
  <div className="data-ticker-container">
    <div className="data-ticker-content">
      SYS_LOG: 0x01A NODE 45 SECURE // PACKET LOSS: 0.01% // UPLINK ESTABLISHED // BANDWIDTH: 1.2TB/S // NO THREATS DETECTED // 
      SYS_LOG: 0x01B NODE 46 SECURE // PACKET LOSS: 0.00% // DATASTREAM SYNCHED // PING: 2ms //
    </div>
  </div>
);

const CyberCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target;
      const interactive = el.closest('a, button, input, [role="button"], .cyber-card');
      setIsHovering(!!interactive);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className={`cyber-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    />
  );
};

const CipherDecryption = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (index < iterations) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iterations >= text.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </span>
  );
};

const Navbar = () => (
  <nav style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    borderBottom: '2px solid var(--neon-yellow)',
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 5px 20px rgba(252, 225, 0, 0.08)'
  }}>
    <div style={{
      fontSize: '28px',
      fontWeight: '900',
      fontFamily: 'var(--font-cyber)',
      color: 'var(--neon-yellow)',
      textTransform: 'uppercase'
    }}>
      CP_2077 <span style={{ color: '#fff', fontSize: '18px', verticalAlign: 'middle' }}>// NICO_OS</span>
    </div>
    <div style={{ display: 'flex', gap: '40px' }}>
      <a href="#" style={{ color: 'var(--neon-yellow)', textDecoration: 'none', fontWeight: 'bold' }}>NETWORK</a>
      <a href="#" style={{ color: 'var(--neon-yellow)', textDecoration: 'none', fontWeight: 'bold' }}>DATA_DRIVE</a>
      <a href="#" style={{ color: 'var(--neon-yellow)', textDecoration: 'none', fontWeight: 'bold' }}>ICE_BREAKER</a>
    </div>
  </nav>
);

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section style={{
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      textAlign: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: mousePos.y / 15,
        left: mousePos.x / 15,
        width: '40vw',
        height: '40vw',
        backgroundColor: 'var(--neon-yellow)',
        filter: 'blur(180px)',
        opacity: 0.06,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'top 0.3s ease-out, left 0.3s ease-out'
      }}></div>

      <div style={{ zIndex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-cyber)',
          color: 'var(--neon-yellow)',
          fontSize: '14px',
          letterSpacing: '5px',
          marginBottom: '10px',
          textShadow: '0 0 10px rgba(252, 225, 0, 0.5)'
        }}>
          [ SYSTEM STATUS: OPTIMIZED ]
        </p>
        <h1 className="glitch-text glitch-always" data-text="Hello Chum" style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          lineHeight: '0.9',
          marginBottom: '30px',
          color: 'var(--neon-yellow)',
          textShadow: '0 0 20px rgba(252, 225, 0, 0.6), 0 0 60px rgba(252, 225, 0, 0.3), 3px 3px 0 var(--dark-black)'
        }}>
          <CipherDecryption text="Hello Chum" /><br />
        </h1>
        <div style={{
          fontSize: '1.2rem',
          maxWidth: '700px',
          margin: '0 auto 40px',
          opacity: 0.9,
          color: '#e0e0e0',
          lineHeight: '1.6',
          borderLeft: '4px solid var(--neon-yellow)',
          paddingLeft: '20px',
          textAlign: 'left'
        }}>
          <TypeWriter text="WE HAVE A REPOSITORY TO BUILD. REACTIVE NEURAL SYSTEMS ENGAGED. NIGHT CITY IS WAITING FOR YOUR DEPLOYMENT. NEON YELLOW POWERED INTERFACE STANDING BY." delay={30} />
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="cyber-button" style={{ padding: '15px 40px', fontSize: '18px' }}>
            CONNECT LINK
          </button>
          <button className="cyber-button" style={{
            padding: '15px 40px',
            fontSize: '18px',
            borderColor: 'var(--neon-cyan)',
            color: 'var(--neon-cyan)'
          }}>
            HACK SYSTEM
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ id, title, desc }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      '--mouse-x': `${(x / rect.width) * 100}%`,
      '--mouse-y': `${(y / rect.height) * 100}%`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease',
      '--mouse-x': '50%',
      '--mouse-y': '50%'
    });
  };

  return (
    <div 
      className="cyber-card" 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <div className="cyber-card-glare"></div>
      <div className="cyber-card-content">
        <div style={{ color: 'var(--neon-yellow)', opacity: 0.4, fontSize: '12px', marginBottom: '10px' }}>
          MOD_V{id}
        </div>
        <h3 style={{
          borderBottom: '1px solid var(--neon-yellow)',
          paddingBottom: '10px',
          marginBottom: '15px',
          color: 'var(--neon-yellow)'
        }}>
          <CipherDecryption text={title} />
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#bbb', lineHeight: '1.5' }}>{desc}</p>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '10px',
          color: 'var(--neon-cyan)',
          fontFamily: 'monospace',
          textShadow: '0 0 5px rgba(252, 225, 0, 0.4)'
        }}>
          0x0F4_HACKED
        </div>
      </div>
    </div>
  );
};

const Features = () => (
  <section style={{ padding: '100px 50px', background: 'var(--cyber-black)', position: 'relative' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '60px',
        fontSize: '2.5rem',
        position: 'relative',
        display: 'inline-block',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        NEURAL INTERFACE SPECS
        <div style={{
          height: '2px',
          width: '100px',
          background: 'var(--neon-red)',
          margin: '10px auto',
          boxShadow: '0 0 10px rgba(252, 225, 0, 0.5)'
        }}></div>
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px'
      }}>
        <FeatureCard id="101" title="NEURAL RESPONSE" desc="Low latency reactivity powered by React state management. Mouse positions and system states update at sub-neural speeds." />
        <FeatureCard id="204" title="VITE MESH" desc="Lightning fast module replacement. Change your visual loadout and see the results before your optical implants can even blink." />
        <FeatureCard id="777" title="CYBER COLORS" desc="Pure neon design tokens. #FCE100 yellow shades maintained across the entire digital infrastructure." />
      </div>
    </div>
  </section>
);

function App() {
  const [booting, setBooting] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    };

    window.addEventListener('click', triggerGlitch);
    return () => window.removeEventListener('click', triggerGlitch);
  }, []);

  return (
    <div className={`app-container ${isGlitching ? 'global-glitch-active' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CyberCursor />
      <div className="scanlines"></div>
      {booting && <BootSequence onComplete={() => setBooting(false)} />}
      <ReactiveBackground />
      <DataTicker />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1, opacity: booting ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
        <Hero />
        <Features />
      </main>
      <footer style={{
        padding: '60px 20px',
        textAlign: 'center',
        borderTop: '2px solid var(--neon-yellow-low)',
        fontSize: '14px',
        color: 'var(--neon-yellow)',
        opacity: 0.6,
        fontFamily: 'var(--font-cyber)',
        letterSpacing: '2px',
        position: 'relative',
        zIndex: 1,
        textShadow: '0 0 8px rgba(252, 225, 0, 0.3)'
      }}>
        [ ARASAKA_CORP_OS // DEPLOYMENT_SEC_01 ]<br />
        © 2077 NIGHT CITY WEB SYSTEMS
      </footer>
    </div>
  );
}

export default App;
