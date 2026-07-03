import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FloatingHearts from './components/FloatingHearts';
import Header from './components/Header';
import AdSense from './components/AdSense';
import Home from './pages/Home';
import SendMessage from './pages/SendMessage';
import Messages from './pages/Messages';
import Wellness from './pages/Wellness';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="gradient-bg min-h-screen pb-16">
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
        
        {/* Widget flottant d'espace publicitaire AdSense */}
        <AdSense className="fixed bottom-4 right-4 z-40 max-w-[280px] min-h-[100px] p-4 m-0 shadow-2xl rounded-xl hidden sm:flex" />
      </div>
    </Router>
  );
}

export default App;

