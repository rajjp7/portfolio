import React, { useRef, Suspense, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Github, ExternalLink } from 'lucide-react';
import Synctask from '../imgs/SyncTask.png';



gsap.registerPlugin(ScrollTrigger, Flip);

const allProjectsData = [
    {
        id: 1,
        category: "Frontend",
        title: "SyncTech",
        desc: "A full-featured MERN stack e-commerce site with a modern UI, cart functionality, secure checkout, and an admin dashboard.",
        tags: ["React","Taliwind CSS",],
        github: "https://github.com/rajjp7/SyncTask",
        live: "https://sync-task-eight.vercel.app/",
        image: Synctask
    },
 {
        id: 1,
        category: "Full Stack",
        title: "SmartCPCoach",
        desc: "A full-featured MERN stack e-commerce site with a modern UI, cart functionality, secure checkout, and an admin dashboard.",
        tags: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Express"],
        github: "https://github.com/yourusername/ecommerce",
        live: "https://ecommerce-demo.live",
        image: "https://placehold.co/600x400/111827/facc15?text=SmartCPCoach"
    },
    {
        id: 1,
        category: "Frontend",
        title: "Portfolio Website",
        desc: "A full-featured MERN stack e-commerce site with a modern UI, cart functionality, secure checkout, and an admin dashboard.",
        tags: ["React","Tailwind CSS","GSAP","THREE.js","Firebase"],
        github: "https://github.com/yourusername/ecommerce",
        live: "https://ecommerce-demo.live",
        image: "https://placehold.co/600x400/111827/facc15?text=Portfolio+Website"
    }
    
    
];

const GoldenPlexus = () => {
    const group = useRef();

    const lines = useMemo(() => {
        const particleCount = 300;
        const points = Array.from({ length: particleCount }, () => 
            new THREE.Vector3(
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20)
            )
        );
        
        const lineIndices = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                if (points[i].distanceTo(points[j]) < 2.5) {
                    lineIndices.push(i, j);
                }
            }
        }
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        lineGeometry.setIndex(lineIndices);

        return lineGeometry;
    }, []);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <group ref={group}>
            <lineSegments geometry={lines}>
                <lineBasicMaterial color="#ca8a04" transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
};

const Projects = () => {
    const sectionRef = useRef(null);
    const [filter, setFilter] = useState('All');

    const filteredProjects = useMemo(() => 
        filter === 'All' 
            ? allProjectsData 
            : allProjectsData.filter(p => p.category === filter),
        [filter]
    );

    useGSAP(() => {
        gsap.from('.projects-title', {
            opacity: 0, y: -50, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        });

        const cards = gsap.utils.toArray('.project-card');
        gsap.set(cards, { opacity: 0, y: 50 });

        ScrollTrigger.batch(cards, {
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
            }),
            start: 'top 85%',
        });

    }, { dependencies: [filteredProjects], scope: sectionRef });

    const handleFilterChange = (newFilter) => {
        const cards = gsap.utils.toArray('.project-card');
        const state = Flip.getState(cards, { props: "opacity, scale" });
        
        gsap.to(cards, {
            opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.05, ease: 'power3.in',
            onComplete: () => {
                setFilter(newFilter);
                setTimeout(() => {
                    const newCards = gsap.utils.toArray('.project-card');
                    Flip.from(state, {
                        targets: newCards, duration: 0.8, scale: true, ease: "power3.out", stagger: 0.1, absolute: true,
                        onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
                        onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.6, immediateRender: false })
                    });
                }, 0);
            }
        });
    };

    return (
        <main ref={sectionRef} id="projects" className="relative w-full min-h-screen py-24 bg-transparent text-white overflow-hidden">
            <div className="absolute inset-0 -z-20">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <Suspense fallback={null}>
                        <GoldenPlexus />
                    </Suspense>
                </Canvas>
            </div>
            
            <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
                <h2 className="projects-title text-5xl md:text-6xl font-bold mb-8 tracking-tight text-center">
                    MY <span className="text-yellow-400">PROJECTS</span>
                </h2>

                <div className="filter-buttons flex flex-wrap justify-center gap-4 mb-16">
                    {['All', 'Web Development', 'AI/ML'].map(f => (
                        <button
                            key={f}
                            onClick={() => handleFilterChange(f)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${filter === f ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="projects-grid w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((proj) => (
                        <div key={proj.id} className="project-card group">
                            <div className="bg-gray-900/40 backdrop-blur-md border border-yellow-800/50 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-yellow-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-yellow-500/20">
                                <img src={proj.image} alt={proj.title} className="rounded-lg mb-4 aspect-video object-cover border border-yellow-900/50" />
                                <p className="text-xs font-semibold text-yellow-400 mb-2">{proj.category}</p>
                                <h3 className="text-xl font-bold text-gray-100 mb-2">{proj.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-grow">{proj.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {proj.tags.map(tag => <span key={tag} className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full">{tag}</span>)}
                                </div>
                                <div className="flex gap-4 text-gray-400 mt-auto">
                                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors"><Github /></a>
                                    <a href={proj.live} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors"><ExternalLink /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Projects;
