import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import VideoSection from '../components/VideoSection';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        {/* Commented out sections - can be restored when needed */}
        {/* <VideoSection /> */}
        <Features />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;