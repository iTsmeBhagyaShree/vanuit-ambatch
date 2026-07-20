import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Leads from './pages/admin/Leads';
import Quotes from './pages/admin/Quotes';
import Projects from './pages/admin/Projects';
import Partners from './pages/admin/Partners';
import Finance from './pages/admin/Finance';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Partner Pages
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerProjects from './pages/partner/PartnerProjects';

// Protected Route
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return children;
}

// Placeholder Page
const PlaceholderPage = ({ title, subtitle }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-heading font-bold text-primary">{title}</h2>
      {subtitle && <p className="text-dark/50 text-sm font-body mt-1">{subtitle}</p>}
    </div>
    <div className="border-2 border-dashed border-secondary/50 rounded-2xl p-16 text-center">
      <p className="text-dark/30 font-body text-sm">{title} content wordt hier weergegeven.</p>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />
      <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><MainLayout role="admin" /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="projects" element={<Projects />} />
        <Route path="partners" element={<Partners />} />
        <Route path="documents" element={<PlaceholderPage title="Documents" subtitle="All project documents in one place." />} />
        <Route path="finance" element={<Finance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Partner */}
      <Route path="/partner" element={<ProtectedRoute requiredRole="partner"><MainLayout role="partner" /></ProtectedRoute>}>
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="projects" element={<PartnerProjects />} />
        <Route path="planning" element={<PlaceholderPage title="Planning & Agenda" subtitle="Uw weekplanning en aankomende taken." />} />
        <Route path="documents" element={<PlaceholderPage title="Documenten" subtitle="Upload en beheer uw projectdocumenten." />} />
        <Route path="profile" element={<PlaceholderPage title="Mijn Profiel" subtitle="Uw persoonlijke profielinstellingen." />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
