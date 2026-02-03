import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  Leaf, 
  ArrowLeft, 
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentPlant, setCurrentPlant] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    imageUrl: '',
    care: {
      sunlight: 'medium',
      watering: 'medium',
      maintenance: 'medium',
      difficulty: 'beginner'
    },
    size: 'medium',
    petFriendly: false,
    airPurifying: false,
    climate: [],
    benefits: [],
    tips: []
  });

  useEffect(() => {
    loadPlants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [plants, search, filterStatus]);

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getPlants({ limit: 100, status: 'all' });
      setPlants(response.data.plants);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar plantas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plants];

    // Filtro de búsqueda
    if (search) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(search.toLowerCase()) ||
        (plant.scientificName && plant.scientificName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filtro de estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(plant => 
        filterStatus === 'active' ? plant.isActive : !plant.isActive
      );
    }

    setFilteredPlants(filtered);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentPlant(null);
    setFormData({
      name: '',
      scientificName: '',
      description: '',
      imageUrl: '',
      care: {
        sunlight: 'medium',
        watering: 'medium',
        maintenance: 'medium',
        difficulty: 'beginner'
      },
      size: 'medium',
      petFriendly: false,
      airPurifying: false,
      climate: [],
      benefits: [],
      tips: []
    });
    setShowModal(true);
  };

  const openEditModal = (plant) => {
    setModalMode('edit');
    setCurrentPlant(plant);
    setFormData({
      name: plant.name,
      scientificName: plant.scientificName || '',
      description: plant.description,
      imageUrl: plant.imageUrl || '',
      care: {
        sunlight: plant.care.sunlight,
        watering: plant.care.watering,
        maintenance: plant.care.maintenance,
        difficulty: plant.care.difficulty
      },
      size: plant.size,
      petFriendly: plant.petFriendly,
      airPurifying: plant.airPurifying,
      climate: plant.climate || [],
      benefits: plant.benefits || [],
      tips: plant.tips || []
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPlant(null);
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (modalMode === 'create') {
        const response = await adminAPI.createPlant(formData);
        setPlants([response.data.plant, ...plants]);
        alert('Planta creada exitosamente');
      } else {
        const response = await adminAPI.updatePlant(currentPlant._id, formData);
        setPlants(plants.map(p => p._id === currentPlant._id ? response.data.plant : p));
        alert('Planta actualizada exitosamente');
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar planta');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plantId, plantName) => {
    if (!confirm(`¿Desactivar "${plantName}"? (Podrás reactivarla después)`)) return;

    try {
      await adminAPI.deletePlant(plantId);
      setPlants(plants.map(p => p._id === plantId ? { ...p, isActive: false } : p));
      alert('Planta desactivada');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al desactivar planta');
    }
  };

  const handleReactivate = async (plantId, plantName) => {
    if (!confirm(`¿Reactivar "${plantName}"?`)) return;

    try {
      const response = await adminAPI.reactivatePlant(plantId);
      setPlants(plants.map(p => p._id === plantId ? response.data.plant : p));
      alert('Planta reactivada');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reactivar planta');
    }
  };

  const handlePermanentDelete = async (plantId, plantName) => {
    if (!confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE "${plantName}"? Esta acción NO se puede deshacer.`)) return;
    if (!confirm('¿Estás completamente seguro? Se eliminarán todas las referencias.')) return;

    try {
      await adminAPI.permanentDeletePlant(plantId);
      setPlants(plants.filter(p => p._id !== plantId));
      alert('Planta eliminada permanentemente');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar planta');
    }
  };

  // Helper para arrays
  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

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
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
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
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="btn btn-ghost text-gray-600 hover:text-emerald-600 mb-4 flex items-center gap-2 w-fit"
          >
            <ArrowLeft size={18} /> Volver al panel
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="text-emerald-500" size={32} />
                <h1 className="text-4xl font-bold text-gray-800">
                  Gestión de Plantas
                </h1>
              </div>
              <p className="text-gray-600">
                Administra el catálogo completo de plantas
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="btn text-white font-semibold px-6 shadow-md hover:shadow-lg transition flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Plus size={18} /> Nueva Planta
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Nombre o nombre científico..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Filtro de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none bg-gray-50"
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-emerald-700">{filteredPlants.length}</span> de {plants.length} plantas
          </div>
        </div>

        {/* Grid de plantas */}
        {filteredPlants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Leaf className="text-gray-300 mx-auto mb-4" size={64} />
            <p className="text-gray-500">No se encontraron plantas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <div
                key={plant._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border overflow-hidden ${
                  plant.isActive ? 'border-gray-100' : 'border-red-200 bg-red-50/50'
                }`}
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gradient-green flex items-center justify-center">
                  {!plant.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                        INACTIVA
                      </span>
                    </div>
                  )}
                  {plant.imageUrl ? (
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<span class="text-6xl">🌿</span>';
                      }}
                    />
                  ) : (
                    <span className="text-6xl">🌿</span>
                  )}
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

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(plant)}
                      className="btn btn-sm btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex-1 flex items-center justify-center gap-1"
                    >
                      <Edit size={14} /> Editar
                    </button>

                    {plant.isActive ? (
                      <button
                        onClick={() => handleDelete(plant._id, plant.name)}
                        className="btn btn-sm btn-outline border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleReactivate(plant._id, plant.name)}
                          className="btn btn-sm btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-1"
                          title="Reactivar"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(plant._id, plant.name)}
                          className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-0 flex items-center justify-center gap-1"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Leaf className="text-emerald-500" />
                {modalMode === 'create' ? 'Nueva Planta' : 'Editar Planta'}
              </h2>
              <button
                onClick={closeModal}
                className="btn btn-ghost btn-sm"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Información Básica</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                      placeholder="Ej: Pothos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Científico
                    </label>
                    <input
                      type="text"
                      value={formData.scientificName}
                      onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                      placeholder="Ej: Epipremnum aureum"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                    placeholder="Describe la planta..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Cuidados */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Cuidados</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luz</label>
                    <select
                      value={formData.care.sunlight}
                      onChange={(e) => setFormData({ ...formData, care: { ...formData.care, sunlight: e.target.value }})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    >
                      <option value="low">Poca</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Riego</label>
                    <select
                      value={formData.care.watering}
                      onChange={(e) => setFormData({ ...formData, care: { ...formData.care, watering: e.target.value }})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    >
                      <option value="low">Poco</option>
                      <option value="medium">Medio</option>
                      <option value="high">Mucho</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mantenimiento</label>
                    <select
                      value={formData.care.maintenance}
                      onChange={(e) => setFormData({ ...formData, care: { ...formData.care, maintenance: e.target.value }})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    >
                      <option value="low">Bajo</option>
                      <option value="medium">Medio</option>
                      <option value="high">Alto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                    <select
                      value={formData.care.difficulty}
                      onChange={(e) => setFormData({ ...formData, care: { ...formData.care, difficulty: e.target.value }})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="expert">Experto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Características</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    >
                      <option value="small">Pequeña</option>
                      <option value="medium">Mediana</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer bg-rose-50 px-4 py-2.5 rounded-lg border border-rose-100 hover:border-rose-300 w-full">
                      <input
                        type="checkbox"
                        checked={formData.petFriendly}
                        onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className="text-sm font-medium text-gray-700">Pet Friendly</span>
                    </label>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer bg-teal-50 px-4 py-2.5 rounded-lg border border-teal-100 hover:border-teal-300 w-full">
                      <input
                        type="checkbox"
                        checked={formData.airPurifying}
                        onChange={(e) => setFormData({ ...formData, airPurifying: e.target.checked })}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className="text-sm font-medium text-gray-700">Purifica Aire</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Arrays opcionales */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Información Adicional (Opcional)</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Climas <span className="text-xs text-gray-500">(separar por comas)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.climate.join(', ')}
                    onChange={(e) => handleArrayChange('climate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="Ej: tropical, temperate, dry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficios <span className="text-xs text-gray-500">(separar por comas)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.benefits.join(', ')}
                    onChange={(e) => handleArrayChange('benefits', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="Ej: Purifica el aire, Fácil de cuidar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consejos <span className="text-xs text-gray-500">(separar por comas)</span>
                  </label>
                  <textarea
                    value={formData.tips.join(', ')}
                    onChange={(e) => handleArrayChange('tips', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                    placeholder="Ej: Riega cada semana, Evita luz directa"
                  />
                </div>
              </div>
            </form>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn text-white font-semibold px-6 flex items-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <><Save size={18} /> {modalMode === 'create' ? 'Crear' : 'Guardar'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlants;