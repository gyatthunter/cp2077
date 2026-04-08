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
          Hello Chum<br />
        </h1>
        <p style={{
          fontSize: '1.2rem',
          maxWidth: '700px',
          margin: '0 auto 40px',
          opacity: 0.9,
          color: '#e0e0e0',
          lineHeight: '1.6',
          borderLeft: '4px solid var(--neon-yellow)',
          paddingLeft: '20px'
        }}>
          WE HAVE A REPOSITORY TO BUILD. REACTIVE NEURAL SYSTEMS ENGAGED.
          NIGHT CITY IS WAITING FOR YOUR DEPLOYMENT.
          NEON YELLOW POWERED INTERFACE STANDING BY.
        </p>
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

const FeatureCard = ({ id, title, desc }) => (
  <div className="cyber-card">
    <div style={{ color: 'var(--neon-yellow)', opacity: 0.4, fontSize: '12px', marginBottom: '10px' }}>
      MOD_V{id}
    </div>
    <h3 style={{
      borderBottom: '1px solid var(--neon-yellow)',
      paddingBottom: '10px',
      marginBottom: '15px',
      color: 'var(--neon-yellow)'
    }}>
      {title}
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
);

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
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ReactiveBackground />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
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
