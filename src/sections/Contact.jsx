import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, User, MessageCircle, Github, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

const NeuralPlexus = () => {
    const groupRef = useRef();

    const { particles, lines } = useMemo(() => {
        const particleCount = 400;
        const points = Array.from({ length: particleCount }, () => 
            new THREE.Vector3(
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20),
                THREE.MathUtils.randFloatSpread(20)
            )
        );
        const particleGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
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

        return { particles: particleGeometry, lines: lineGeometry };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.02;
            
            gsap.to(groupRef.current.rotation, {
                x: -state.pointer.y * 0.1,
                y: state.pointer.x * 0.1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    return (
        <group ref={groupRef}>
            <points geometry={particles}>
                <pointsMaterial size={0.06} color="#60a5fa" />
            </points>
            <lineSegments geometry={lines}>
                <lineBasicMaterial color="#1e40af" transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
};



const Contact = () => {
    const sectionRef = useRef(null);
    const notificationRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            }
        });

        tl.from('.contact-title', { opacity: 0, y: -50, duration: 1, ease: 'power3.out' })
          .from('.contact-grid > *', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out' }, "-=0.5");

        document.querySelectorAll('.contact-item').forEach(item => {
            const icon = item.querySelector('svg');
            const text = item.querySelector('span');
            const hoverAnim = gsap.timeline({ paused: true })
                .to(icon, { scale: 1.2, color: '#93c5fd', duration: 0.3, ease: 'power2.out' })
                .to(text, { x: 5, color: '#e5e7eb', duration: 0.3, ease: 'power2.out' }, 0);
            
            item.addEventListener('mouseenter', () => hoverAnim.play());
            item.addEventListener('mouseleave', () => hoverAnim.reverse());
        });
        
        document.querySelectorAll('.social-icon').forEach(icon => {
            const hoverAnim = gsap.to(icon, { 
                scale: 1.2, 
                color: '#60a5fa',
                duration: 0.3, 
                paused: true,
                ease: 'back.out(1.7)'
            });
            icon.addEventListener('mouseenter', () => hoverAnim.play());
            icon.addEventListener('mouseleave', () => hoverAnim.reverse());
        });

    }, { scope: sectionRef });

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');
        try {
            await addDoc(collection(db, 'contacts'), formData);
            setStatusMessage('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatusMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (statusMessage) {
            const tl = gsap.timeline();
            tl.fromTo(notificationRef.current, 
                { y: 100, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );

            const timer = setTimeout(() => {
                tl.to(notificationRef.current, { 
                    opacity: 0, 
                    y: 100, 
                    duration: 0.5, 
                    ease: 'power3.in',
                    onComplete: () => setStatusMessage('')
                });
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    return (
        <>
            <main ref={sectionRef} id="contact" className="relative w-full min-h-screen py-24 bg-black text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                        <Suspense fallback={null}>
                            <NeuralPlexus />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
                    <h2 className="contact-title text-5xl md:text-6xl font-bold mb-16 tracking-tight text-center">
                        GET IN <span className="text-blue-400">TOUCH</span>
                    </h2>

                    <div className="contact-grid w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900/20 backdrop-blur-md border border-blue-800/30 rounded-3xl p-8 md:p-12">
                       
                        <div className="flex flex-col justify-center text-center lg:text-left">
                            <h3 className="text-3xl font-bold text-slate-100 mb-4">Let's Collaborate</h3>
                            <p className="text-slate-400 mb-8">
                                Have a project in mind or just want to say hello? My inbox is always open. Whether you have a question or just want to connect, feel free to reach out.
                            </p>
                            <div className="space-y-6">
                                <a href="mailto:your.email@example.com" className="contact-item group flex items-center justify-center lg:justify-start gap-4 text-slate-300 cursor-pointer">
                                    <Mail className="w-6 h-6 text-blue-400 transition-all duration-300 group-hover:scale-110" />
                                    <span className="transition-colors duration-300 group-hover:text-white">patilraj0726@gmail.com</span>
                                </a>
                            </div>
                        </div>

    
                        <div className="relative">
                            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <User className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-blue-400 transition-colors duration-300 group-focus-within:text-blue-300" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full bg-slate-800/50 border border-blue-800/50 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-blue-400 transition-colors duration-300 group-focus-within:text-blue-300" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full bg-slate-800/50 border border-blue-800/50 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <MessageCircle className="absolute top-6 left-4 -translate-y-1/2 w-5 h-5 cursor-pointer text-blue-400 transition-colors duration-300 group-focus-within:text-blue-300" />
                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required rows="5" className="w-full bg-slate-800/50 border border-blue-800/50 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-blue-600 text-white font-semibold tracking-wide hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1">
                                    {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
                                </button>
                            </form>
                            
                            {statusMessage && (
                                <div ref={notificationRef} className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-green-500/80 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
                                    <CheckCircle size={20} />
                                    <span>{statusMessage}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black border-t border-blue-900/50 py-8 text-slate-400">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Raj Patil. All rights reserved.</p>
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a href="https://github.com/rajjp7" target="_blank" rel="noopener noreferrer" className="social-icon text-slate-400 cursor-pointer"><Github /></a>
                        <a href="https://www.linkedin.com/in/rajjp07" target="_blank" rel="noopener noreferrer" className="social-icon text-slate-400 cursor-pointer"><Linkedin /></a>
                        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-icon text-slate-400 cursor-pointer"><Twitter /></a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Contact;
