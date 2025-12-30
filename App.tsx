
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroSection from './components/IntroSection';
import Principles from './components/Principles';
import Sectors from './components/Sectors';
import MapSection from './components/MapSection';
import StatsSection from './components/StatsSection';
import ProjectsSection from './components/ProjectsSection';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

import { AuthProvider, useAuth } from './lib/auth';

// Pages
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const { userData, loading, isAdmin } = useAuth();

  // Simple router logic
  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!loading) {
      if (userData) {
        if (isAdmin) {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('dashboard');
        }
      } else {
        if (currentPage === 'dashboard' || currentPage === 'admin-dashboard') {
          setCurrentPage('landing');
        }
      }
    }
  }, [userData, loading, isAdmin]);

  if (loading) return <div className="min-h-screen bg-novarc-dark flex items-center justify-center text-white">Loading...</div>;

  if (currentPage === 'login') return <Login onNavigate={navigate} />;
  if (currentPage === 'signup') return <Signup onNavigate={navigate} />;
  if (currentPage === 'dashboard') return <Dashboard onNavigate={navigate} />;
  if (currentPage === 'admin-dashboard') return <AdminDashboard onNavigate={navigate} />;

  return (
    <div className="min-h-screen bg-white text-novarc-dark">
      <Navbar onLogin={() => navigate('login')} onSignup={() => navigate('signup')} />
      <main>
        <Hero />
        <IntroSection />
        <Principles />
        <Sectors />
        <MapSection />
        <StatsSection />
        <ProjectsSection />
        <Pricing />
        <FinalCTA onContact={() => navigate('signup')} />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
