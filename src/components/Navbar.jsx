import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useLenis } from '../Constants/LenisContext'; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const lenis = useLenis();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Projects', href: '#projects' },
  ];

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

 
  const handleSmoothScroll = (e, target) => {
    e.preventDefault();
    setMenuOpen(false);
    if (lenis) { 
      lenis.scrollTo(target, { offset: -50 }); 
    }
  };

  return (
    <header ref={headerRef} className="fixed w-[95%] max-w-7xl left-1/2 -translate-x-1/2 top-4 z-[100] opacity-100">
      <div className="flex items-center justify-between w-full mx-auto relative bg-black/40 backdrop-blur-lg border border-blue-900/50 shadow-lg rounded-xl p-3 px-6">
        <div className="text-xl md:text-2xl font-bold text-white relative">
          <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500 group-hover:border-blue-400 group-hover:scale-110 group-hover:rotate-6">
              <span className="font-mono font-bold text-lg text-slate-300 group-hover:text-white transition-colors duration-300">R</span>
            </div>
            <span className="text-slate-100 group-hover:text-white transition-colors duration-300">Raj Patil</span>
          </a>
        </div>

    
        <nav className="desktop absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="relative group text-slate-300 text-base font-medium hover:text-blue-400 transition-colors"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 p-2 rounded-full hover:bg-blue-500/10 transition-all duration-300" aria-label="Github Profile">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 p-2 rounded-full hover:bg-blue-500/10 transition-all duration-300" aria-label="LinkedIn Profile">
            <Linkedin size={20} />
          </a>
          <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="hidden sm:flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-blue-500/50">
            <Mail size={18} />
            Get in Touch
          </a>

          <button className="lg:hidden text-white z-[200] p-2 rounded-md hover:bg-white/10 transition" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-96 mt-2' : 'max-h-0'}`}>
        <div className="bg-black/80 backdrop-blur-xl rounded-xl shadow-xl p-5 space-y-3 flex flex-col items-center z-50 border border-blue-900/50">
          {[...navItems, { name: 'Get in Touch', href: '#contact' }].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="text-slate-100 text-lg font-medium py-3 w-full text-center rounded-lg hover:bg-blue-500/10 transition-all duration-300"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
