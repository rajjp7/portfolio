import React, { createContext, useContext, useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const newLenis = new Lenis();
    setLenis(newLenis); // Set the instance in state

    function raf(time) {
      newLenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      newLenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};