import React, { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Database, BrainCircuit, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const techData = {
    "Frontend": [
        { name: "React.js" },
        { name: "JavaScript" },
        { name: "HTML5"},
        { name: "CSS3" },
        { name: "Tailwind CSS"}
    ],
    "Backend & Databases": [
        { name: "Node.js" },
        { name: "Express" },
        { name: "MongoDB"},
        { name: "Firebase" }
    ],
    "Data Science & AI": [
        { name: "Pandas" },
        { name: "Numpy"},
        { name: "Matplotlib" },
        { name: "Seaborn"}
    ],
    "Core Languages": [
        { name: "C++" },
        { name: "Python" },
        { name: "Java" }
    ]
};


const ParticleField = () => {
    const ref = useRef();
    const count = 5000;
    const positions = useMemo(() => new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 9), []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta / 30;
            ref.current.rotation.y += delta / 35;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#8b5cf6" size={0.007} sizeAttenuation={true} depthWrite={false} />
        </Points>
    );
};

const TechStack = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            }
        });

        tl.from('.tech-title', { opacity: 0, y: -50, duration: 1, ease: 'power3.out' });

        document.querySelectorAll('.tech-category-group').forEach(group => {
            const categoryTitle = group.querySelector('.tech-category-title');
            const techCards = group.querySelectorAll('.tech-card');

            gsap.set(categoryTitle, { opacity: 0, x: -30 });
            gsap.set(techCards, { opacity: 0, y: 30 });

            const categoryTl = gsap.timeline({
                scrollTrigger: {
                    trigger: group,
                    start: 'top 85%',
                }
            });
            categoryTl.to(categoryTitle, { 
                opacity: 1, 
                x: 0, 
                duration: 0.8, 
                ease: 'power3.out' 
            })
            .to(techCards, { 
                opacity: 1, 
                y: 0, 
                stagger: 0.1, 
                duration: 0.6, 
                ease: 'power3.out' 
            }, "-=0.5");
        });

        document.querySelectorAll('.tech-card').forEach(card => {
            const hoverAnim = gsap.to(card, { 
                y: -8,
                scale: 1.05,
                boxShadow: '0 15px 30px rgba(139, 92, 246, 0.3)',
                borderColor: 'rgba(139, 92, 246, 0.8)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                duration: 0.3, 
                paused: true, 
                ease: 'power2.out' 
            });
            card.addEventListener('mouseenter', () => hoverAnim.play());
            card.addEventListener('mouseleave', () => hoverAnim.reverse());
        });

    }, { scope: sectionRef });

    const categoryIcons = {
        "Frontend": <Code />,
        "Backend & Databases": <Database />,
        "Data Science & AI": <BrainCircuit />,
        "Core Languages": <Cpu />
    };

    return (
        <>
            
            <main ref={sectionRef} id="tech-stack" className="relative w-full min-h-screen py-24 bg-transparent text-white">
                <div className="absolute inset-0 -z-20">
                <Canvas camera={{ position: [0, 0, 3.5] }}>
                    <Suspense fallback={null}>
                        <ParticleField />
                    </Suspense>
                </Canvas>
            </div>
            
            

                <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
                    <h2 className="tech-title text-5xl md:text-6xl font-bold mb-16 tracking-tight text-center">
                        MY <span className="text-purple-400">TECH ARSENAL</span>
                    </h2>

                    <div className="w-full max-w-6xl space-y-12">
                        {Object.entries(techData).map(([category, skills]) => (
                            <div key={category} className="tech-category-group">
                                <h3 className="tech-category-title text-2xl font-bold text-purple-400 mb-6 border-b-2 border-purple-800/50 pb-3 flex items-center gap-3">
                                    {categoryIcons[category]}
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {skills.map(skill => (
                                        <div key={skill.name} className="tech-card bg-slate-900/40 backdrop-blur-sm border border-purple-800/50 rounded-lg px-4 py-3 transition-all duration-300 flex items-center gap-3">
                                            <span className="text-xl">{skill.icon}</span>
                                            <span className="font-semibold text-slate-200">{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default TechStack;
