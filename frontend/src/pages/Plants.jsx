import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plantsAPI, favoritesAPI } from '../services/api';
import { Search, Filter, Heart, ArrowRight, Leaf } from 'lucide-react';

const Plants = () => {
  const { isAuthenticated } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  
  // Filtros y búsqueda
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    sunlight: '',
    difficulty: '',
    size: '',
    petFriendly: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPlants();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await plantsAPI.getAll({ limit: 100 });
      setPlants(response.data.plants);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar plantas');
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

  const toggleFavorite = async (plantId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }

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

  // Filtrar plantas
  const filteredPlants = plants.filter(plant => {
    // Búsqueda por nombre
    if (search && !plant.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Filtro de luz
    if (filters.sunlight && plant.care.sunlight !== filters.sunlight) {
      return false;
    }

    // Filtro de dificultad
    if (filters.difficulty && plant.care.difficulty !== filters.difficulty) {
      return false;
    }

    // Filtro de tamaño
    if (filters.size && plant.size !== filters.size) {
      return false;
    }

    // Filtro pet friendly
    if (filters.petFriendly && !plant.petFriendly) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      sunlight: '',
      difficulty: '',
      size: '',
      petFriendly: false,
    });
    setSearch('');
  };

  const hasActiveFilters = search || filters.sunlight || filters.difficulty || filters.size || filters.petFriendly;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Leaf className="text-white" size={32} />
          </div>
          <p className="text-emerald-700 font-semibold">Cargando plantas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPlants}
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Catálogo de Plantas
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explora nuestra colección completa de plantas para el hogar
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          {/* Búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar plantas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-gray-50 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn flex items-center gap-2 ${showFilters ? 'btn-primary text-white' : 'btn-outline border-emerald-300 text-emerald-700'}`}
            >
              <Filter size={18} />
              Filtros {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length + (search ? 1 : 0)})`}
            </button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Luz solar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Luz solar</label>
                  <select
                    value={filters.sunlight}
                    onChange={(e) => setFilters({ ...filters, sunlight: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none bg-gray-50 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="low">Poca</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                {/* Dificultad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none bg-gray-50 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="expert">Experto</option>
                  </select>
                </div>

                {/* Tamaño */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                  <select
                    value={filters.size}
                    onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none bg-gray-50 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                  </select>
                </div>

                {/* Pet friendly */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-emerald-300 w-full">
                    <input
                      type="checkbox"
                      checked={filters.petFriendly}
                      onChange={(e) => setFilters({ ...filters, petFriendly: e.target.checked })}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className="text-sm font-medium text-gray-700">Pet friendly</span>
                  </label>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {hasActiveFilters && (
                <div className="mt-4 text-center">
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost btn-sm text-gray-500 hover:text-emerald-600"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-emerald-700">{filteredPlants.length}</span> de {plants.length} plantas
          </p>
        </div>

        {/* Grid de plantas */}
        {filteredPlants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-500 text-lg mb-4">No se encontraron plantas con esos filtros</p>
            <button
              onClick={clearFilters}
              className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => {
              const isFavorite = favorites.has(plant._id);

              return (
                <div
                  key={plant._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all plant-card-hover border border-gray-100 overflow-hidden"
                >
                  {/* Imagen */}
                  <div className="relative">
                    {isAuthenticated && (
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
                    )}

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

                    {/* Badges */}
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
                      {plant.airPurifying && (
                        <span className="badge badge-sm bg-teal-100 text-teal-700 border-0">
                          Purifica aire
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
      </div>
    </div>
  );
};

export default Plants;