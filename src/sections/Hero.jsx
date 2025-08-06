import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar'; 

const profession = [
  'FULL STACK DEVELOPER',
  'AIML ENTHUSIAST',
  'COMPETITIVE PROGRAMMER',
  'VIDEO EDITOR',
];

const ParticleField = () => {
  const ref = useRef();
  const count = 5000;
  const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 9);

  useFrame((state, delta) => {
    ref.current.rotation.x += delta / 30;
    ref.current.rotation.y += delta / 35;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#3b82f6" size={0.007} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

const CursorGlow = () => {
    const glowRef = useRef();

    useEffect(() => {
        const moveGlow = (e) => {
            gsap.to(glowRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        };
        window.addEventListener('mousemove', moveGlow);
        return () => window.removeEventListener('mousemove', moveGlow);
    }, []);

    return (
        <div 
            ref={glowRef}
            className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"
        />
    );
};

export default function Hero() {
  const typeRef = useRef(null);
  const rolesRef = useRef(null);
  const arrowRef = useRef(null);
  const titleRef = useRef(null);
  const backgroundTextRef = useRef(null);
  const backgroundTextRef2 = useRef(null); 
  const profileImgRef = useRef(null);
  const rajRef = useRef(null);

  useGSAP(() => {
  
    const tl = gsap.timeline({ delay: 0.8 });

    tl.from(profileImgRef.current, { scale: 0.5, opacity: 0, duration: 1, ease: 'power3.out' })
      .from(titleRef.current, { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.7")
      .fromTo(
        rolesRef.current.querySelectorAll('p'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.2 },
        "-=0.8"
      );

    const text = 'I combine clean code, thoughtful design, and purpose‑driven development. Let’s build something impactful together.';
    if (typeRef.current) {
        typeRef.current.innerHTML = '';
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            typeRef.current.appendChild(span);
        });
        tl.fromTo(
            typeRef.current.children,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.04, stagger: 0.015, ease: 'power2.inOut' },
            "-=0.5"
        );
    }
    
    tl.fromTo(
        arrowRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, repeat: -1, yoyo: true, ease: 'power1.inOut' },
        "+=0.5"
    );

    const marquee1 = backgroundTextRef.current;
    if (marquee1) {
        const distance = marquee1.scrollWidth / 2;
        gsap.to(marquee1, {
            x: -distance,
            duration: 20, 
            repeat: -1,
            ease: 'linear',
        });
    }

    const marquee2 = backgroundTextRef2.current;
    if (marquee2) {
        const distance = marquee2.scrollWidth / 2;
        gsap.set(marquee2, { x: -distance }); 
        gsap.to(marquee2, {
            x: 0,
            duration: 20,
            repeat: -1,
            ease: 'linear',
        });
    }

    
    const rajElement = rajRef.current;
    if (rajElement) {
        let intervalId = null;
        const scramble = () => {
            const originalText = "RAJ";
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let iteration = 0;
            
            clearInterval(intervalId);
            
            intervalId = setInterval(() => {
                rajElement.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)]
                    })
                    .join("");
                
                if(iteration >= originalText.length){ 
                    clearInterval(intervalId);
                }
                
                iteration += 1 / 3;
            }, 30);
        };
        rajElement.addEventListener('mouseover', scramble);

 
        return () => {
            rajElement.removeEventListener('mouseover', scramble);
            clearInterval(intervalId);
        }
    }

  }, []);

  const backgroundWords = ['CREATIVE', 'AIML', 'INNOVATE', 'CODE', 'BUILD'];
  const marqueeWords = [...backgroundWords, ...backgroundWords];


  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Cinzel:wght@900&family=Inter:wght@400;500;700&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #000000; }
          .hero-title {
            font-family: 'Lora', serif;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          .raj-font {
            font-family: 'Cinzel', serif;
            font-weight: 900;
            vertical-align: -0.05em; /* Adjusts vertical alignment */
            cursor: pointer;
          }
          .gradient-text {
            background: linear-gradient(90deg, #93c5fd, #60a5fa, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
        `}
      </style>
      <main id="home" className="w-full h-screen scroll-smooth bg-black text-white overflow-hidden">
        <CursorGlow />
        <Navbar />
        <div className="relative w-full h-full">
          <Canvas camera={{ position: [0, 0, 3.5] }} className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
            <Preload all />
          </Canvas>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
            <div className="relative flex items-center justify-center w-full md:-translate-y-8">
              <div className="max-w-5xl flex flex-col items-center">
                <img
                    ref={profileImgRef}
                    src="https://placehold.co/128x128/000000/3b82f6?text=R"
                    alt="Raj Patil"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-6 border-4 border-blue-500/50 shadow-xl opacity-100 transition-transform duration-300 hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/000000/FFFFFF?text=Error'; }}
                />
                <h1 ref={titleRef} className="hero-title text-5xl md:text-[80px] lg:text-[90px] tracking-tighter mb-4 opacity-100">
                  <span className="transition-colors duration-300 hover:text-slate-300">HEY I'M </span> 
                  <span ref={rajRef} className="gradient-text raj-font">RAJ</span>
                </h1>
                <div ref={rolesRef} className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm md:text-base font-semibold tracking-wider text-slate-400 mb-8">
                  {profession.map((role, i) => (
                    <p key={i} className="opacity-0 flex items-center transition-all duration-300 hover:text-blue-400 hover:scale-105 cursor-pointer">
                      {role}
                      {i < profession.length - 1 && <span className="hidden md:inline text-blue-800 mx-3">•</span>}
                    </p>
                  ))}
                </div>
                <p ref={typeRef} className="text-base md:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto min-h-[70px] transition-colors duration-300 hover:text-slate-200" />
              </div>
            </div>

     
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none -z-10 overflow-hidden">
                <div ref={backgroundTextRef} className="flex whitespace-nowrap">
                    {marqueeWords.map((word, index) => (
                         <h2 key={index} className="text-[20vw] md:text-[250px] font-black text-white/5 select-none leading-none pr-12">
                            {word}
                        </h2>
                    ))}
                </div>
                 <div ref={backgroundTextRef2} className="flex whitespace-nowrap">
                    {marqueeWords.map((word, index) => (
                         <h2 key={index} className="text-[20vw] md:text-[250px] font-black text-white/5 select-none leading-none pr-12">
                            {word}
                        </h2>
                    ))}
                </div>
            </div>

            <a href="#about" ref={arrowRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-100 group" aria-label="Scroll to about section">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-slate-700 bg-black/20 backdrop-blur-sm transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-500/10">
                <ChevronDown size={32} className="text-slate-400 transition-colors duration-300 group-hover:text-blue-400"/>
              </div>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
