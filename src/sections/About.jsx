import React, { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Bot, Sword, Film } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GalaxyBackground = () => {
    const pointsRef = useRef();

    useFrame(({ clock }) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
        }
    });

    const parameters = useMemo(() => ({
        count: 100000,
        size: 0.015,
        radius: 10,
        branches: 5,
        spin: 1.5,
        randomness: 0.6,
        randomnessPower: 3,
        insideColor: '#3b82f6',
        outsideColor: '#1e3a8a',
    }), []);

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        return { positions, colors };
    }, [parameters]);

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={parameters.count} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={parameters.count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={parameters.size}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
            />
        </points>
    );
};


const About = () => {
    const sectionRef = useRef(null);
    const cfRef = useRef(null);
    const ccRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.background-7', 
            { y: '100%', opacity: 0 },
            { 
                y: '0%', 
                opacity: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom top',
                    scrub: 1,
                }
            }
        );
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
            }
        });

        
        tl.fromTo('.about-title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .fromTo('.about-intro', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.8")
          .fromTo('.skill-card', { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, "-=0.5")
          .fromTo('.rating-card', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1, ease: 'elastic.out(1, 0.75)' }, "<0.2");


      
        const animateCount = (el, endVal) => {
            gsap.fromTo(el, { innerText: 0 }, {
                innerText: endVal,
                duration: 2.5,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: { trigger: el, start: 'top 90%' },
                onUpdate: function () {
                    el.innerText = Math.floor(this.targets()[0].innerText);
                },
            });
        };

        if (cfRef.current) animateCount(cfRef.current, 1100);
        if (ccRef.current) animateCount(ccRef.current, 1400);

    }, { scope: sectionRef });

    return (
        <main
            ref={sectionRef}
            id="about"
            className="relative scroll-smooth min-h-screen w-full py-24 bg-transparent text-white overflow-hidden"
        >
            <div className="absolute inset-0 -z-20">
                <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
                    <Suspense fallback={null}>
                        <GalaxyBackground />
                    </Suspense>
                </Canvas>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 -z-10" />

            <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
                <span 
                    className="background-7 text-[40rem] font-black text-transparent select-none"
                    style={{ 
                        WebkitTextStroke: '2px rgba(59, 130, 246, 0.4)',
                        textShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
                    }}
                >
                    7
                </span>
            </div>

            <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
                <h2 className="about-title text-5xl md:text-6xl font-bold mb-8 tracking-tight text-center">
                    ABOUT <span className="text-blue-400">ME</span>
                </h2>
                
                <p className="about-intro text-lg text-slate-400 leading-relaxed max-w-3xl text-center mb-20">
                    I'm a passionate developer who thrives on turning complex problems into beautiful, intuitive, and scalable digital solutions. My journey is fueled by a love for elegant code, efficient algorithms, and the constant pursuit of new technologies.
                </p>

                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="skills-container space-y-8">
                         <div className="skill-card bg-slate-900/40 backdrop-blur-md border border-blue-800/50 rounded-2xl p-6 text-left transition-all duration-300 hover:border-blue-500/80 hover:bg-slate-900/60 hover:scale-105 hover:-translate-y-1 cursor-pointer">
                            <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-3"><Code size={24}/> Full Stack Developer</h4>
                            <p className="text-slate-300">I craft full-stack applications using MERN, Tailwind, and modern APIs, bringing clean UI and scalable backend logic together.</p>
                        </div>

                        <div className="skill-card bg-slate-900/40 backdrop-blur-md border border-blue-800/50 rounded-2xl p-6 text-left transition-all duration-300 hover:border-blue-500/80 hover:bg-slate-900/60 hover:scale-105 hover:-translate-y-1 cursor-pointer">
                            <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-3"><Bot size={24}/> AI/ML Enthusiast</h4>
                            <p className="text-slate-300">I explore machine learning models, build projects with Python and OpenCV, and love diving into LLMs and deep learning.</p>
                        </div>
                        
                        <div className="skill-card bg-slate-900/40 backdrop-blur-md border border-blue-800/50 rounded-2xl p-6 text-left transition-all duration-300 hover:border-blue-500/80 hover:bg-slate-900/60 hover:scale-105 hover:-translate-y-1 cursor-pointer">
                            <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-3"><Sword size={24}/> Competitive Programmer</h4>
                            <p className="text-slate-300">Passionate about problem-solving and algorithms. Active on Codeforces and CodeChef, which sharpens my development logic.</p>
                        </div>
                        
                        <div className="skill-card bg-slate-900/40 backdrop-blur-md border border-blue-800/50 rounded-2xl p-6 text-left transition-all duration-300 hover:border-blue-500/80 hover:bg-slate-900/60 hover:scale-105 hover:-translate-y-1 cursor-pointer">
                            <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-3"><Film size={24}/> Video Editor</h4>
                            <p className="text-slate-300">I bring stories to life through video, using tools like Premiere Pro and After Effects to create compelling visual narratives.</p>
                        </div>
                    </div>

 
                    <div className="ratings-container flex flex-col justify-center gap-8">
                        <div className="rating-card p-8 bg-slate-900/50 backdrop-blur-lg rounded-2xl border-2 border-blue-500/60 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/80 cursor-pointer">
                             <div className="relative text-center">
                                <h5 className="text-2xl text-blue-300 font-bold mb-2">Codeforces</h5>
                                <p className="text-6xl font-mono text-white font-bold" ref={cfRef}>0</p>
                                <p className="text-slate-400 mt-2">Newbie</p>
                             </div>
                        </div>
                         <div className="rating-card p-8 bg-slate-900/50 backdrop-blur-lg rounded-2xl border-2 border-indigo-800/50 shadow-lg shadow-indigo-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-indigo-400/80 cursor-pointer">
                             <div className="relative text-center">
                                <h5 className="text-2xl text-indigo-300 font-bold mb-2">CodeChef</h5>
                                <p className="text-6xl font-mono text-white font-bold" ref={ccRef}>0</p>
                                <p className="text-slate-400 mt-2">2 Star</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default About;
