import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoritesAPI } from '../services/api';
import { Heart, ArrowRight, Trash2, Edit3, Save, X, AlertCircle, Leaf } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadFavorites();
    loadStats();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await favoritesAPI.getAll({ limit: 100 });
      setFavorites(response.data.favorites);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await favoritesAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const removeFavorite = async (plantId, plantName) => {
    if (!confirm(`¿Eliminar "${plantName}" de favoritos?`)) return;

    try {
      await favoritesAPI.remove(plantId);
      setFavorites(favorites.filter(fav => fav.plantId._id !== plantId));
      loadStats(); // Actualizar estadísticas
    } catch (err) {
      alert('Error al eliminar favorito');
    }
  };

  const startEditingNote = (favoriteId, currentNote) => {
    setEditingNote(favoriteId);
    setNoteText(currentNote || '');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const saveNote = async (plantId) => {
    try {
      await favoritesAPI.updateNotes(plantId, noteText);
      
      // Actualizar localmente
      setFavorites(favorites.map(fav => 
        fav.plantId._id === plantId 
          ? { ...fav, notes: noteText }
          : fav
      ));
      
      setEditingNote(null);
      setNoteText('');
    } catch (err) {
      alert('Error al guardar nota');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Leaf className="text-white" size={32} />
          </div>
          <p className="text-emerald-700 font-semibold">Cargando favoritos...</p>
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
            onClick={loadFavorites}
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
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-rose-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Heart className="text-rose-500" size={16} fill="currentColor" />
            <span className="text-rose-700 text-sm font-medium">Tus plantas favoritas</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Mis Favoritos
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Las plantas que has guardado para recordar
          </p>
        </div>

        {/* Estadísticas */}
        {stats && stats.total > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{stats.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.byDifficulty.beginner}</p>
                <p className="text-sm text-gray-500">Principiante</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats.byDifficulty.intermediate}</p>
                <p className="text-sm text-gray-500">Intermedio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-rose-600">{stats.petFriendly}</p>
                <p className="text-sm text-gray-500">Pet Friendly</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-teal-600">{stats.airPurifying}</p>
                <p className="text-sm text-gray-500">Purifican aire</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de favoritos */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <Heart className="text-gray-300 mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No tienes favoritos aún</h3>
            <p className="text-gray-500 mb-6">Explora el catálogo y guarda las plantas que te gusten</p>
            <Link
              to="/plants"
              className="btn text-white font-semibold px-8 shadow-md hover:shadow-lg transition inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              Ver catálogo <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const plant = favorite.plantId;
              const isEditingThisNote = editingNote === favorite._id;

              return (
                <div
                  key={favorite._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all plant-card-hover border border-gray-100 overflow-hidden"
                >
                  {/* Imagen */}
                  <div className="relative">
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

                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFavorite(plant._id, plant.name)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-md"
                    >
                      <Trash2 size={18} />
                    </button>
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
                    </div>

                    {/* Notas */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Mis notas</label>
                        {!isEditingThisNote && (
                          <button
                            onClick={() => startEditingNote(favorite._id, favorite.notes)}
                            className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                          >
                            <Edit3 size={14} /> Editar
                          </button>
                        )}
                      </div>

                      {isEditingThisNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Agrega notas personales sobre esta planta..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-gray-50 text-sm resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNote(plant._id)}
                              className="btn btn-sm bg-emerald-500 text-white hover:bg-emerald-600 border-0 flex items-center gap-1 flex-1"
                            >
                              <Save size={14} /> Guardar
                            </button>
                            <button
                              onClick={cancelEditingNote}
                              className="btn btn-sm btn-ghost text-gray-500 flex items-center gap-1"
                            >
                              <X size={14} /> Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 min-h-[60px]">
                          {favorite.notes ? (
                            <p className="text-sm text-gray-700">{favorite.notes}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Sin notas</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Fecha guardado */}
                    <p className="text-xs text-gray-400 mb-4">
                      Guardado el {new Date(favorite.addedAt).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>

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

export default Favorites;