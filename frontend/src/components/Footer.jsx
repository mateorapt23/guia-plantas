import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Marca */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-green rounded-xl flex items-center justify-center">
                <Leaf className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white">SuggestiPlant</span>
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed max-w-sm">
              Tu guía inteligente de plantas para el hogar. Descubre, aprende y crea tu jardín interior perfecto, sin importar tu nivel de experiencia.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explorar</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/plants" className="text-emerald-300 hover:text-white text-sm transition-colors">Catálogo de Plantas</Link></li>
              <li><Link to="/register" className="text-emerald-300 hover:text-white text-sm transition-colors">Registrarse</Link></li>
              <li><Link to="/login" className="text-emerald-300 hover:text-white text-sm transition-colors">Iniciar Sesión</Link></li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-emerald-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-emerald-500 text-xs">© 2026 SuggestiPlant. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;