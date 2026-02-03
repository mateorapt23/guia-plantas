import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plantsAPI, favoritesAPI } from '../services/api';
import { 
  ArrowLeft, 
  Heart, 
  Sun, 
  Droplets, 
  Ruler, 
  Sparkles, 
  PawPrint, 
  Wind,
  AlertCircle,
  Leaf,
  CheckCircle
} from 'lucide-react';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    loadPlant();
    if (isAuthenticated) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const loadPlant = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await plantsAPI.getById(id);
      setPlant(response.data.plant);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar la planta');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.check(id);
      setIsFavorite(response.data.isFavorite);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add({ plantId: id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Leaf className="text-white" size={32} />
          </div>
          <p className="text-emerald-700 font-semibold">Cargando planta...</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Planta no encontrada</h2>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar la información de esta planta'}</p>
          <button
            onClick={() => navigate('/plants')}
            className="btn text-white font-semibold px-6"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  const careIcons = {
    sunlight: <Sun className="text-amber-500" size={20} />,
    watering: <Droplets className="text-blue-500" size={20} />,
    maintenance: <Sparkles className="text-purple-500" size={20} />,
    difficulty: <Ruler className="text-emerald-500" size={20} />,
  };

  const levelLabels = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Experto',
    small: 'Pequeño',
    large: 'Grande',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost text-gray-600 hover:text-emerald-600 mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header con imagen */}
          <div className="relative">
            {/* Imagen de fondo */}
            <div className="h-80 bg-gradient-green flex items-center justify-center relative">
              {plant.imageUrl ? (
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><span class="text-8xl">🌿</span></div>';
                  }}
                />
              ) : (
                <span className="text-8xl">🌿</span>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Botón favorito */}
            {isAuthenticated && (
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all shadow-lg ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 backdrop-blur text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}

            {/* Badges flotantes */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {plant.petFriendly && (
                <div className="badge bg-white/90 backdrop-blur border-0 text-rose-600 font-semibold px-3 py-3 flex items-center gap-1">
                  <PawPrint size={14} /> Pet Friendly
                </div>
              )}
              {plant.airPurifying && (
                <div className="badge bg-white/90 backdrop-blur border-0 text-teal-600 font-semibold px-3 py-3 flex items-center gap-1">
                  <Wind size={14} /> Purifica aire
                </div>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-8 md:p-12">
            
            {/* Título y nombre científico */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {plant.name}
              </h1>
              {plant.scientificName && (
                <p className="text-xl text-gray-400 italic">{plant.scientificName}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{plant.description}</p>
            </div>

            {/* Características de cuidado */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="text-emerald-500" /> Cuidados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(plant.care).map(([key, value]) => (
                  <div key={key} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      {careIcons[key]}
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key === 'sunlight' ? 'Luz' : 
                         key === 'watering' ? 'Riego' : 
                         key === 'maintenance' ? 'Mantenimiento' : 
                         'Dificultad'}
                      </span>
                    </div>
                    <p className="text-gray-800 font-semibold capitalize">
                      {levelLabels[value] || value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamaño */}
            <div className="mb-8">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 inline-flex items-center gap-3">
                <Ruler className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Tamaño</p>
                  <p className="font-semibold text-gray-800 capitalize">{levelLabels[plant.size] || plant.size}</p>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            {plant.benefits && plant.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" /> Beneficios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plant.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips de cuidado */}
            {plant.tips && plant.tips.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Leaf className="text-emerald-500" /> Consejos de cuidado
                </h2>
                <div className="space-y-3">
                  {plant.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <span className="text-amber-600 font-bold text-lg shrink-0">{index + 1}.</span>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clima */}
            {plant.climate && plant.climate.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Climas ideales</h2>
                <div className="flex flex-wrap gap-2">
                  {plant.climate.map((c, index) => (
                    <span key={index} className="badge badge-lg bg-sky-100 text-sky-700 border-0 capitalize">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn text-white font-semibold px-8 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  Regístrate para guardar favoritos
                </Link>
              )}
              <Link
                to="/plants"
                className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 flex items-center justify-center gap-2"
              >
                Ver más plantas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;