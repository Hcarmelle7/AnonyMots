import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FloatingHearts from './components/FloatingHearts';
import Header from './components/Header';
import Home from './pages/Home';
import SendMessage from './pages/SendMessage';
import Messages from './pages/Messages';
import Wellness from './pages/Wellness';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="gradient-bg min-h-screen">
        <FloatingHearts />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/send/:username" element={<SendMessage />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
        
        {/* Google AdSense placeholder */}
        <div className="fixed bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <div className="text-center">
            📢 Espace publicitaire
            <br />
            <span className="text-xs opacity-75">Google AdSense</span>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

