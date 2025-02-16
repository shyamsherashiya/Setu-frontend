import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import KYC from './components/KYC';
// import VerificationHistory from './components/VerificationHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kyc" 
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/verification-history" 
          element={
            <ProtectedRoute>
              <VerificationHistory />
            </ProtectedRoute>
          } 
        /> */}
      </Routes>
    </Router>
  );
}

export default App;