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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo - IZQUIERDA */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30 group-hover:shadow-2xl group-hover:scale-105 transition-all">
              <Leaf className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
              Plant Guide
            </span>
          </Link>

          {/* Links - CENTRO */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/plants" className="text-emerald-100 hover:text-white font-medium transition-colors relative group">
              Plantas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/recommendations" className="text-emerald-100 hover:text-white font-medium transition-colors relative group">
                  Recomendaciones
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/favorites" className="text-emerald-100 hover:text-white font-medium transition-colors relative group">
                  Favoritos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-emerald-300 hover:text-white font-bold transition-colors relative group">
                    Admin
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-300"></span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Botones auth - DERECHA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-lg border border-emerald-300">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm border-2 border-white">
                    <User className="text-white" size={14} />
                  </div>
                  <span className="text-sm font-semibold text-emerald-800">{user?.name}</span>
                  {isAdmin() && <span className="badge badge-sm bg-emerald-600 text-white ml-1 shadow-sm">ADMIN</span>}
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-red-500/20 transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg font-semibold border-2 border-white/30 text-white hover:border-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <LogIn size={16} /> Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg bg-white text-emerald-800 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <UserPlus size={16} /> Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-emerald-800 to-teal-700 border-t border-emerald-600 px-4 py-4 flex flex-col gap-2 shadow-2xl">
          <Link to="/plants" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white font-medium transition-colors">
            Plantas
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/recommendations" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white font-medium transition-colors">
                Recomendaciones
              </Link>
              <Link to="/favorites" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white font-medium transition-colors">
                Favoritos
              </Link>
              {isAdmin() && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg bg-emerald-700 text-white font-bold transition-colors">
                  Panel Admin
                </Link>
              )}
              <div className="border-t border-emerald-600 mt-2 pt-2">
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-white font-semibold flex items-center gap-2 transition-colors">
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)} 
                className="px-4 py-2.5 rounded-lg font-semibold border-2 border-white/30 text-white hover:border-white hover:bg-white/10 transition-all flex items-center gap-2 justify-center"
              >
                <LogIn size={16} /> Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMenuOpen(false)} 
                className="px-4 py-2.5 rounded-lg bg-white text-emerald-800 font-bold shadow-lg flex items-center gap-2 justify-center transition-all"
              >
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