// Importamos herramientas de React Router para manejar la navegación entre páginas
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importamos el contexto de autenticación y su hook para saber si el usuario está logueado
import { AuthProvider, useAuth } from './context/AuthContext';


import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas públicas
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';

// Páginas que requieren autenticación
import Survey from './pages/Survey';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Favorites from './pages/Favorites';

// Páginas solo para administradores
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlants from './pages/admin/AdminPlants';

const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-emerald-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">🌱 {title}</h1>
      <p className="text-gray-500">Esta página se construye próximamente</p>
    </div>
  </div>
);

// Componente que protege rutas que requieren estar autenticado
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica la sesión, mostramos un spinner de carga
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );

  // Si el usuario NO está autenticado, lo redirigimos al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si está autenticado, permitimos ver la página
  return children;
};

// Componente que protege rutas SOLO para administradores
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Indicamos carga mientras se valida el usuario
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );

  // Si no está autenticado, lo enviamos al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si está autenticado pero NO es admin, lo enviamos al inicio
  if (!isAdmin()) return <Navigate to="/" replace />;

  // Si es admin, puede acceder
  return children;
};

// Contenido principal de la aplicación (todas las rutas)
const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegación visible en todas las páginas */}
      <Navbar />

      {/* Contenido principal con espacio para el navbar fijo */}
      <main className="flex-1 pt-16">
        <Routes>
          {/* ===== RUTAS PÚBLICAS (cualquiera puede verlas) ===== */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetail />} />

          {/* ===== RUTAS PROTEGIDAS (solo usuarios logueados) ===== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/survey"
            element={
              <ProtectedRoute>
                <Survey />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* ===== RUTAS SOLO PARA ADMIN ===== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/plants"
            element={
              <AdminRoute>
                <AdminPlants />
              </AdminRoute>
            }
          />

          {/* ===== RUTA DE RESPALDO (404) ===== */}
          {/* Si la URL no existe, redirigimos al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer visible en todas las páginas */}
      <Footer />
    </div>
  );
};

// Componente raíz de la aplicación
function App() {
  return (
    <BrowserRouter>
      {/* Proveedor de autenticación que envuelve toda la app */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
