import React from 'react'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import TechStack from './sections/TechStack'
import Layout from './sections/Layout'
import Preloader from './sections/Preloader'
const App = () => {
  return (
    <Layout>
      {/* <Preloader /> */}
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
    </Layout>
  ) 
}

export default App

 
