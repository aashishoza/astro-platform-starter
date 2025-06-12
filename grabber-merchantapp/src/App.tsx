import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MerchantDashboard from './pages/merchant/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import StoreManagement from './pages/merchant/StoreManagement';
import ProductManagement from './pages/merchant/ProductManagement';
import OffersManagement from './pages/merchant/OffersManagement';
import CustomerInteraction from './pages/merchant/CustomerInteraction';
import TransactionRecords from './pages/merchant/TransactionRecords';
import Subscription from './pages/merchant/Subscription';
import MerchantManagement from './pages/admin/MerchantManagement';
import Analytics from './pages/admin/Analytics';
import UserReports from './pages/admin/UserReports';

function App() {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/merchant/dashboard" replace />} />
                
                {/* Merchant Routes */}
                <Route path="/merchant/dashboard" element={
                  <ProtectedRoute role="merchant">
                    <MerchantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/subscription" element={
                  <ProtectedRoute role="merchant">
                    <Subscription />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/store" element={
                  <ProtectedRoute role="merchant">
                    <StoreManagement />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/products" element={
                  <ProtectedRoute role="merchant">
                    <ProductManagement />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/offers" element={
                  <ProtectedRoute role="merchant">
                    <OffersManagement />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/customers" element={
                  <ProtectedRoute role="merchant">
                    <CustomerInteraction />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/transactions" element={
                  <ProtectedRoute role="merchant">
                    <TransactionRecords />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/merchants" element={
                  <ProtectedRoute role="admin">
                    <MerchantManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute role="admin">
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute role="admin">
                    <UserReports />
                  </ProtectedRoute>
                } />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'dark:bg-gray-800 dark:text-white',
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
}

export default App;