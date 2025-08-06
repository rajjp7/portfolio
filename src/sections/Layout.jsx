import React from 'react';
import { LenisProvider } from '../Constants/LenisContext';

const Layout = ({ children }) => {
  return <LenisProvider>{children}</LenisProvider>;
};

export default Layout;
