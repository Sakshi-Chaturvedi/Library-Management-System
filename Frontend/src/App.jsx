import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyOTP } from './pages/VerifyOTP';
import { Books } from './pages/Books';
import { MyBooks } from './pages/MyBooks';
import { AdminDashboard } from './pages/AdminDashboard';
import { AddBook } from './pages/AddBook';
import { BookDetails } from './pages/BookDetails';
import { BorrowHistory } from './pages/BorrowHistory';
import { AdminBooks } from './pages/AdminBooks';
import { AdminUsers } from './pages/AdminUsers';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/borrow-history" element={<BorrowHistory />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/add-book" element={<ProtectedRoute requireAdmin={true}><AddBook /></ProtectedRoute>} />
            <Route path="/admin/books" element={<ProtectedRoute requireAdmin={true}><AdminBooks /></ProtectedRoute>} />
            <Route path="/admin/borrowed-books" element={<ProtectedRoute requireAdmin={true}><BorrowHistory /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>} />
          </Route>

          {/* Fallback Route */}
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
