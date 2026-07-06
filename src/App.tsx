/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import ServiceCategories from './components/ServiceCategories';
import PopularDestinations from './components/PopularDestinations';
import FleetSection from './components/FleetSection';
import SkiperVideoShowcase from './components/SkiperVideoShowcase';
import MapSection from './components/MapSection';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';
import FloatingContacts from './components/FloatingContacts';
import AIChatAssistant from './components/AIChatAssistant';
import AdminDashboard from './components/AdminDashboard';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';
import SplashScreen from './components/SplashScreen';
import ProfileCompletionModal from './components/ProfileCompletionModal';

// Profile Completion Overlay Helper
const ProfileCompletionOverlay = () => {
  const { user, userData, loading } = useAuth();

  if (loading || !user || !userData) return null;
  if (userData.role !== 'customer') return null;

  // 1. Instant local storage bypass
  const hasCompletedLocally = localStorage.getItem(`sg_profile_completed_${user.uid}`) === 'true';
  if (hasCompletedLocally) return null;

  // 2. Database validation
  const hasIncompleteProfile = !userData.name || !userData.phoneNumber;
  
  // If database already contains the details, sync them to local storage and bypass
  if (!hasIncompleteProfile) {
    localStorage.setItem(`sg_profile_completed_${user.uid}`, 'true');
    localStorage.setItem(`sg_profile_name_${user.uid}`, userData.name || '');
    localStorage.setItem(`sg_profile_phone_${user.uid}`, userData.phoneNumber || '');
    return null;
  }

  return <ProfileCompletionModal />;
};

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Testimonials />
      <ServiceCategories />
      <PopularDestinations />
      <FleetSection />
      <SkiperVideoShowcase />
      <MapSection />
      <CustomerReviews />
      <Footer />
      <FloatingContacts />
      <AIChatAssistant />
    </>
  );
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'customer' }) => {
  const { userData, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!userData) return <Navigate to="/" />;
  if (role && userData.role !== role) {
    if (userData.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        {!splashComplete && (
          <SplashScreen onComplete={() => setSplashComplete(true)} />
        )}
        <ProfileCompletionOverlay />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login/customer" element={<CustomerLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
