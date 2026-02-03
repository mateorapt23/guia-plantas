import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  ArrowLeft, 
  Shield, 
  UserX, 
  UserCheck,
  Search,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  Leaf
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, search, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filtro de búsqueda
    if (search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro de rol
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filtro de estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => 
        filterStatus === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    
    if (!confirm(`¿Cambiar rol a ${newRole}?`)) return;

    try {
      await adminAPI.changeUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cambiar rol');
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Seguro que quieres ${action} este usuario?`)) return;

    try {
      await adminAPI.toggleUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cambiar estado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto animate-pulse">
            <Users className="text-white" size={32} />
          </div>
          <p className="text-purple-700 font-semibold">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadUsers}
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
        <div className="mb-8">
          <Link
            to="/admin"
            className="btn btn-ghost text-gray-600 hover:text-purple-600 mb-4 flex items-center gap-2 w-fit"
          >
            <ArrowLeft size={18} /> Volver al panel
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">
              Gestión de Usuarios
            </h1>
          </div>
          <p className="text-gray-600">
            Administra roles y estado de los usuarios
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Filtro de rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 outline-none bg-gray-50"
              >
                <option value="all">Todos</option>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Filtro de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 outline-none bg-gray-50"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-purple-700">{filteredUsers.length}</span> de {users.length} usuarios
          </div>
        </div>

        {/* Tabla de usuarios */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Users className="text-gray-300 mx-auto mb-4" size={64} />
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 border-b border-purple-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Usuario</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Rol</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Encuesta</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Estado</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      {/* Usuario */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-green flex items-center justify-center text-white font-bold">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>

                      {/* Rol */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'ADMIN' && <Award size={12} />}
                          {user.role}
                        </span>
                      </td>

                      {/* Encuesta */}
                      <td className="px-6 py-4 text-center">
                        {user.surveyCompleted ? (
                          <CheckCircle className="text-emerald-500 mx-auto" size={20} />
                        ) : (
                          <XCircle className="text-gray-300 mx-auto" size={20} />
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Cambiar rol */}
                          <button
                            onClick={() => changeRole(user.id, user.role)}
                            className="btn btn-sm btn-ghost text-purple-600 hover:bg-purple-50"
                            title={`Cambiar a ${user.role === 'USER' ? 'ADMIN' : 'USER'}`}
                          >
                            <Shield size={16} />
                          </button>

                          {/* Toggle estado */}
                          <button
                            onClick={() => toggleStatus(user.id, user.isActive)}
                            className={`btn btn-sm btn-ghost ${
                              user.isActive 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-green flex items-center justify-center text-white font-bold text-lg">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'ADMIN' && <Award size={12} />}
                      {user.role}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>

                    {user.surveyCompleted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                        <CheckCircle size={12} /> Encuesta completa
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => changeRole(user.id, user.role)}
                      className="btn btn-sm btn-outline border-purple-300 text-purple-700 hover:bg-purple-50 flex-1"
                    >
                      <Shield size={14} /> Cambiar rol
                    </button>

                    <button
                      onClick={() => toggleStatus(user.id, user.isActive)}
                      className={`btn btn-sm btn-outline flex-1 ${
                        user.isActive 
                          ? 'border-red-300 text-red-700 hover:bg-red-50' 
                          : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;