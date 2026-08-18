import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import WaitlistEntries from './pages/WaitlistEntries';
import VoiceDemo from './pages/VoiceDemo';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/waitlist-entries" element={<WaitlistEntries />} />
          <Route path="/voice-demo" element={<VoiceDemo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;