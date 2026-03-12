import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AssetListPage from '@/pages/AssetListPage';
import AssetDetailPage from '@/pages/AssetDetailPage';
import AssetFormPage from '@/pages/AssetFormPage';
import UserManagementPage from '@/pages/UserManagementPage';
import ItemMasterPage from '@/pages/ItemMasterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-page dark:bg-secondary-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <div key={location.pathname} className="animate-page-enter">
        <Outlet />
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/assets" element={<AssetListPage />} />
                <Route path="/assets/new" element={<AssetFormPage />} />
                <Route path="/assets/:id" element={<AssetDetailPage />} />
                <Route path="/assets/:id/edit" element={<AssetFormPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/items" element={<ItemMasterPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
