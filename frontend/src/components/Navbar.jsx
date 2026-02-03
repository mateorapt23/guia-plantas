import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, LogIn, UserPlus, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-900 to-teal-800 shadow-xl border-b border-emerald-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-green rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white hover:text-emerald-100 hover:text-emerald-300">Plant Guide</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/plants" className="text-white hover:text-emerald-100 hover:text-emerald-300 font-medium transition-colors">Plantas</Link>

            {isAuthenticated && (
              <>
                <Link to="/recommendations" className="text-white hover:text-emerald-100 hover:text-emerald-300 font-medium transition-colors">Recomendaciones</Link>
                <Link to="/favorites" className="text-white hover:text-emerald-100 hover:text-emerald-300 font-medium transition-colors">Favoritos</Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-emerald-200 hover:text-emerald-700 font-semibold transition-colors">Admin</Link>
                )}
              </>
            )}
          </div>

          {/* Botones auth desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-green flex items-center justify-center">
                    <User className="text-green" size={14} />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">{user?.name}</span>
                  {isAdmin() && <span className="badge badge-sm bg-emerald-600 text-white ml-1">ADMIN</span>}
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm text-white hover:text-red-500 hover:bg-red-50">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center gap-1">
                  <LogIn size={16} /> Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-sm text-white font-semibold shadow-md hover:shadow-lg flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <UserPlus size={16} /> Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <button className="md:hidden btn btn-ghost btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 px-4 py-4 flex flex-col gap-2">
          <Link to="/plants" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium">Plantas</Link>

          {isAuthenticated ? (
            <>
              <Link to="/recommendations" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium">Recomendaciones</Link>
              <Link to="/favorites" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium">Favoritos</Link>
              {isAdmin() && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-emerald-600 font-semibold">Panel Admin</Link>
              )}
              <div className="border-t border-emerald-100 mt-2 pt-2">
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 font-medium flex items-center gap-2">
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm border-emerald-300 text-emerald-700 font-semibold flex items-center gap-1 justify-center">
                <LogIn size={16} /> Iniciar sesión
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-sm text-white font-semibold flex items-center gap-1 justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <UserPlus size={16} /> Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;