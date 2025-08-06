import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const welcomeMessages = [
  "Welcome",      
  "स्वागत आहे",     
  "स्वागत है",    
  "Bienvenido",  
  "Bienvenue",    
  "Willkommen",   
  "ようこそ",    
];

const Preloader = () => {
 
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
 
  const [isFinished, setIsFinished] = useState(false);
  
  const preloaderRef = useRef(null);
  const wordRef = useRef(null);

  
  useEffect(() => {
   
    if (currentWordIndex >= welcomeMessages.length) {
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => setIsFinished(true)
      });
      return;
    }

    
    if (wordRef.current) {
        wordRef.current.textContent = welcomeMessages[currentWordIndex];
    }

    
    gsap.fromTo(wordRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );

   
    const timer = setTimeout(() => {
      
      gsap.to(wordRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
         
          setCurrentWordIndex(prevIndex => prevIndex + 1);
        }
      });
    }, 350); 

    
    return () => clearTimeout(timer);
  }, [currentWordIndex]); 

 
  if (isFinished) {
    return null;
  }

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="text-center">
       
        <p ref={wordRef} className="text-5xl md:text-7xl font-bold text-white font-serif">
       
        </p>
      </div>
    </div>
  );
};

export default Preloader;
