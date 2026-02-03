import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Leaf, 
  Heart, 
  Sparkles, 
  TrendingUp,
  Award,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Leaf className="text-white" size={32} />
          </div>
          <p className="text-emerald-700 font-semibold">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="btn text-white font-semibold px-6"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-purple-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Panel de Administración
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Vista general del sistema
          </p>
        </div>

        {/* Estadísticas de usuarios */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-blue-500" /> Usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total</span>
                <Users className="text-blue-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats?.users?.total || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Activos</span>
                <TrendingUp className="text-emerald-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats?.users?.active || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Admins</span>
                <Award className="text-purple-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats?.users?.admins || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Con encuesta</span>
                <Sparkles className="text-amber-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-amber-600">{stats?.users?.withSurvey || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.users?.surveyCompletionRate}% de completitud
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas de plantas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Leaf className="text-emerald-500" /> Plantas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total</span>
                <Leaf className="text-emerald-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats?.plants?.total || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Activas</span>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats?.plants?.active || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-gray-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Inactivas</span>
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats?.plants?.inactive || 0}</p>
            </div>
          </div>
        </div>

        {/* Estadísticas de engagement */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-rose-500" /> Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-rose-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Favoritos</span>
                <Heart className="text-rose-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-rose-600">{stats?.engagement?.totalFavorites || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Recomendaciones</span>
                <Sparkles className="text-indigo-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-indigo-600">{stats?.engagement?.totalRecommendations || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Promedio/Usuario</span>
              </div>
              <p className="text-3xl font-bold text-teal-600">{stats?.engagement?.avgFavoritesPerUser || 0}</p>
              <p className="text-xs text-gray-500 mt-1">favoritos por usuario</p>
            </div>
          </div>
        </div>

        {/* Plantas más populares */}
        {stats?.popularPlants && stats.popularPlants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-amber-500" /> Plantas Más Populares
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="space-y-4">
                {stats.popularPlants.map((item, index) => (
                  item.plant && (
                    <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-green flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{item.plant.name}</h3>
                          <p className="text-sm text-gray-500">{item.favoritesCount} favoritos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.plant.imageUrl ? (
                          <img 
                            src={item.plant.imageUrl} 
                            alt={item.plant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span className="text-3xl" style={{ display: item.plant.imageUrl ? 'none' : 'flex' }}>🌿</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all group"
          >
            <Users className="text-blue-500 mb-4" size={32} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              Gestionar Usuarios
            </h3>
            <p className="text-gray-600 mb-4">
              Ver, editar roles y administrar usuarios del sistema
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              Ir a usuarios <ArrowRight size={18} />
            </div>
          </Link>

          <Link
            to="/admin/plants"
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all group"
          >
            <Leaf className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
              Gestionar Plantas
            </h3>
            <p className="text-gray-600 mb-4">
              Crear, editar y administrar el catálogo de plantas
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              Ir a plantas <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;