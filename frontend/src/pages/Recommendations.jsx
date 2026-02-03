import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsAPI, favoritesAPI } from '../services/api';
import { Sparkles, Heart, ArrowRight, RefreshCw, AlertCircle, Leaf } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    loadRecommendations();
    loadFavorites();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Primero intentar obtener recomendaciones existentes
      try {
        const response = await recommendationsAPI.getMyRecommendations();
        setRecommendations(response.data.recommendations);
      } catch (err) {
        // Si no existen, generarlas
        if (err.response?.status === 404) {
          const generateResponse = await recommendationsAPI.generate();
          setRecommendations(generateResponse.data.recommendations);
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      const favoriteIds = new Set(response.data.favorites.map(fav => fav.plantId._id));
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const response = await recommendationsAPI.regenerate();
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al regenerar recomendaciones');
    } finally {
      setRegenerating(false);
    }
  };

  const toggleFavorite = async (plantId) => {
    try {
      if (favorites.has(plantId)) {
        await favoritesAPI.remove(plantId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(plantId);
          return newSet;
        });
      } else {
        await favoritesAPI.add({ plantId });
        setFavorites(prev => new Set(prev).add(plantId));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Leaf className="text-white" size={32} />
          </div>
          <p className="text-emerald-700 font-semibold">Generando tus recomendaciones personalizadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops...</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadRecommendations}
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-emerald-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles className="text-emerald-500" size={16} />
            <span className="text-emerald-700 text-sm font-medium">Recomendaciones personalizadas</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Tus plantas ideales
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Basadas en tus preferencias, estas plantas son perfectas para ti
          </p>

          {/* Botón regenerar */}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl px-6 flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {regenerating ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <RefreshCw size={18} />
            )}
            Regenerar recomendaciones
          </button>
        </div>

        {/* Grid de recomendaciones */}
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay recomendaciones disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => {
              const plant = rec.plant;
              const isFavorite = favorites.has(plant._id);

              return (
                <div
                  key={plant._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all plant-card-hover border border-gray-100 overflow-hidden"
                >
                  {/* Badge de match */}
                  <div className="relative">
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border font-semibold text-sm z-10 ${getMatchColor(rec.matchScore)}`}>
                      {rec.matchScore}% Match
                    </div>

                    {/* Botón favorito */}
                    <button
                      onClick={() => toggleFavorite(plant._id)}
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        isFavorite
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/90 backdrop-blur text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    {/* Imagen */}
                    <div className="h-48 bg-gradient-green flex items-center justify-center">
                      {plant.imageUrl ? (
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-6xl">🌿</span>';
                          }}
                        />
                      ) : (
                        <span className="text-6xl">🌿</span>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{plant.name}</h3>
                    {plant.scientificName && (
                      <p className="text-sm text-gray-400 italic mb-3">{plant.scientificName}</p>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plant.description}</p>

                    {/* Razones de match */}
                    <div className="space-y-1.5 mb-4">
                      {rec.matchReasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                          <p className="text-xs text-gray-600">{reason}</p>
                        </div>
                      ))}
                    </div>

                    {/* Badges de características */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="badge badge-sm bg-emerald-100 text-emerald-700 border-0">
                        {plant.care.difficulty}
                      </span>
                      <span className="badge badge-sm bg-amber-100 text-amber-700 border-0">
                        {plant.care.sunlight} luz
                      </span>
                      <span className="badge badge-sm bg-blue-100 text-blue-700 border-0">
                        {plant.size}
                      </span>
                      {plant.petFriendly && (
                        <span className="badge badge-sm bg-rose-100 text-rose-700 border-0">
                          Pet friendly
                        </span>
                      )}
                    </div>

                    {/* Botón ver más */}
                    <Link
                      to={`/plants/${plant._id}`}
                      className="btn btn-block btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      Ver detalles <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA al catálogo completo */}
        <div className="text-center mt-12 bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Quieres ver más opciones?</h3>
          <p className="text-gray-600 mb-6">Explora nuestro catálogo completo de plantas</p>
          <Link
            to="/plants"
            className="btn text-white font-semibold px-8 shadow-md hover:shadow-lg transition inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            Ver todas las plantas <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;