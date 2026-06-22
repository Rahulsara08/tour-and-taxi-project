/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import SkiperWelcomeCarousel from './components/SkiperWelcomeCarousel';
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

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <SkiperWelcomeCarousel />
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
  return (
    <AuthProvider>
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
  );
}

