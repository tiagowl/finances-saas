import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { wakeServer } from './services/httpClient';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ServerWakeBanner from './components/shared/ServerWakeBanner';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import OccasionalExpenses from './pages/OccasionalExpenses';
import RecurringExpenses from './pages/RecurringExpenses';
import OccasionalRevenues from './pages/OccasionalRevenues';
import RecurringRevenues from './pages/RecurringRevenues';
import Categories from './pages/Categories';
import OccasionalExpenseDetail from './pages/details/OccasionalExpenseDetail';
import RecurringExpenseDetail from './pages/details/RecurringExpenseDetail';
import OccasionalRevenueDetail from './pages/details/OccasionalRevenueDetail';
import RecurringRevenueDetail from './pages/details/RecurringRevenueDetail';
import CategoryDetail from './pages/details/CategoryDetail';
import OccasionalExpenseEdit from './pages/edit/OccasionalExpenseEdit';
import RecurringExpenseEdit from './pages/edit/RecurringExpenseEdit';
import OccasionalRevenueEdit from './pages/edit/OccasionalRevenueEdit';
import RecurringRevenueEdit from './pages/edit/RecurringRevenueEdit';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminAccessLogDetail from './pages/admin/AdminAccessLogDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
    if (localStorage.getItem('finances_token')) {
      void wakeServer();
    }
  }, [initialize]);

  return (
    <ToastProvider>
      <ServerWakeBanner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses/occasional" element={<OccasionalExpenses />} />
            <Route path="/expenses/occasional/:id" element={<OccasionalExpenseDetail />} />
            <Route path="/expenses/occasional/:id/edit" element={<OccasionalExpenseEdit />} />
            <Route path="/expenses/recurring" element={<RecurringExpenses />} />
            <Route path="/expenses/recurring/:id" element={<RecurringExpenseDetail />} />
            <Route path="/expenses/recurring/:id/edit" element={<RecurringExpenseEdit />} />
            <Route path="/revenues/occasional" element={<OccasionalRevenues />} />
            <Route path="/revenues/occasional/:id" element={<OccasionalRevenueDetail />} />
            <Route path="/revenues/occasional/:id/edit" element={<OccasionalRevenueEdit />} />
            <Route path="/revenues/recurring" element={<RecurringRevenues />} />
            <Route path="/revenues/recurring/:id" element={<RecurringRevenueDetail />} />
            <Route path="/revenues/recurring/:id/edit" element={<RecurringRevenueEdit />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/access-logs/:id" element={<AdminAccessLogDetail />} />
          </Route>
        </Route>
      </Routes>
    </ToastProvider>
  );
}
