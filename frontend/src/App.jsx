import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeFeed from './pages/HomeFeed';
import GroupProfile from './pages/GroupProfile';
import CreateEvent from './pages/CreateEvent';
import CreateRecruitmentPost from './pages/CreateRecruitmentPost';
import RecruitmentBoard from './pages/RecruitmentBoard';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Artists from './pages/Artists';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-theatre-teal">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-theatre-gold/10 blur-[120px] -z-10 rounded-full"></div>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<HomeFeed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/group/:id" element={<GroupProfile />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/create-recruitment" element={<CreateRecruitmentPost />} />
            <Route path="/recruitment" element={<RecruitmentBoard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-theatre-teal text-theatre-gold py-8 text-center font-display font-bold uppercase tracking-widest text-xs border-t-[4px] border-theatre-gold z-10 mt-auto">
          <p>© {new Date().getFullYear()} StageLink. An Evening of Excellence.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
