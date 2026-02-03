import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Survey from './pages/Survey'; 
import Dashboard from './pages/Dashboard'; // ← NUEVA LÍNEA
import Recommendations from './pages/Recommendations';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlants from './pages/admin/AdminPlants';

// Placeholder temporal para las páginas que aún no existen
const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-emerald-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">🌱 {title}</h1>
      <p className="text-gray-500">Esta página se construye próximamente</p>
    </div>
  </div>
);

// Ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-emerald-600"></span></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Ruta solo admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-emerald-600"></span></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetail />} />

          {/* Protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* ← NUEVA LÍNEA */}
          <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} /> 
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

          {/* Solo Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/plants" element={<AdminRoute><AdminPlants /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;