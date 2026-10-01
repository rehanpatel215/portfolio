import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './sections/Hero/Hero';
import ServiceSummary from './sections/ServiceSummary';
import Works from './sections/Works/Works';
import Marquee from './sections/Marquee/Marquee';
import About from './sections/About/About';
import Articles from './sections/Articles/Articles';
import Contact from './sections/Contact/Contact';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  // Force scroll to top on page refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => window.scrollTo(0, 0);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Ensure scroll position is reset when preloader finishes
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  return (
    <>
      {/* 1. Global Preloader with Rising Sun SVG */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 2. Fluid Custom Cursor follower */}
      <CustomCursor />

      {/* 3. Main Page Shell */}
      <div 
        className={`flex flex-col min-h-screen transition-opacity duration-1000 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <Navbar />
        
        <main className="flex-grow">
          {/* Scrollable sections in structural stack */}
          <Hero />
          
          <ServiceSummary />
          <Works />
          <Marquee />
          <About />
          <Articles />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
