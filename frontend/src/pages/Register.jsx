import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const { registerOnly } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await registerOnly(formData.name, formData.email, formData.password); // ← Cambiar aquí

    if (result.success) {
      navigate('/login'); // Ahora SÍ tiene sentido porque NO está logueado
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)' }}>
      {/* Círculos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Card del formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-green rounded-2xl flex items-center justify-center shadow-md mb-4">
              <Leaf className="text-green" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Crea tu cuenta</h1>
            <p className="text-gray-500 text-sm mt-1">Comienza tu viaje con las plantas</p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <><UserPlus size={18} /> Crear cuenta</>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">o</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Link a login */}
          <p className="text-center text-gray-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
              Inicia sesión <ArrowRight size={14} className="inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;