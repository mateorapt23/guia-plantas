import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, favoritesAPI, surveyAPI } from '../services/api';
import { 
  Sparkles, 
  Heart, 
  Leaf, 
  TrendingUp, 
  Award,
  ArrowRight,
  Calendar,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recommendations: 0,
    favorites: 0,
    surveyCompleted: false,
  });
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [favoriteStats, setFavoriteStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Verificar si completó encuesta
      const surveyStatus = await surveyAPI.getStatus();
      
      // Cargar recomendaciones si completó la encuesta
      let recommendationsCount = 0;
      let topRecs = [];
      if (surveyStatus.data.surveyCompleted) {
        try {
          const recsResponse = await recommendationsAPI.getMyRecommendations();
          recommendationsCount = recsResponse.data.recommendations.length;
          topRecs = recsResponse.data.recommendations.slice(0, 3);
        } catch (err) {
          // Si no hay recomendaciones generadas aún
          console.log('No recommendations yet');
        }
      }

      // Cargar favoritos
      const favsResponse = await favoritesAPI.getAll({ limit: 3 });
      const favStatsResponse = await favoritesAPI.getStats();

      setStats({
        recommendations: recommendationsCount,
        favorites: favsResponse.data.totalFavorites,
        surveyCompleted: surveyStatus.data.surveyCompleted,
      });
      setTopRecommendations(topRecs);
      setRecentFavorites(favsResponse.data.favorites);
      setFavoriteStats(favStatsResponse.data.stats);

    } catch (err) {
      console.error('Error loading dashboard:', err);
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
          <p className="text-emerald-700 font-semibold">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header de bienvenida */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenido a tu jardín virtual
          </p>
        </div>

        {/* Alerta si no completó encuesta */}
        {!stats.surveyCompleted && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <Sparkles className="text-amber-500 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  ¡Completa tu encuesta para recibir recomendaciones!
                </h3>
                <p className="text-gray-600 mb-4">
                  Responde unas preguntas rápidas y te mostraremos las plantas perfectas para ti.
                </p>
                <Link
                  to="/survey"
                  className="btn text-white font-semibold px-6 shadow-md hover:shadow-lg transition inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  Completar encuesta <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card: Recomendaciones */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="text-emerald-500" size={32} />
              <span className="text-3xl font-bold text-emerald-600">{stats.recommendations}</span>
            </div>
            <h3 className="text-gray-800 font-semibold mb-1">Recomendaciones</h3>
            <p className="text-gray-500 text-sm">Plantas perfectas para ti</p>
          </div>

          {/* Card: Favoritos */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-rose-500">
            <div className="flex items-center justify-between mb-4">
              <Heart className="text-rose-500" size={32} />
              <span className="text-3xl font-bold text-rose-600">{stats.favorites}</span>
            </div>
            <h3 className="text-gray-800 font-semibold mb-1">Favoritos</h3>
            <p className="text-gray-500 text-sm">Plantas guardadas</p>
          </div>

          {/* Card: Estado encuesta */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="text-blue-500" size={32} />
              <span className="text-3xl">
                {stats.surveyCompleted ? '✅' : '⏳'}
              </span>
            </div>
            <h3 className="text-gray-800 font-semibold mb-1">Encuesta</h3>
            <p className="text-gray-500 text-sm">
              {stats.surveyCompleted ? 'Completada' : 'Pendiente'}
            </p>
          </div>
        </div>

        {/* Sección: Tus recomendaciones principales */}
        {stats.surveyCompleted && topRecommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" /> Top Recomendaciones
                </h2>
                <p className="text-gray-500">Las plantas más compatibles contigo</p>
              </div>
              <Link
                to="/recommendations"
                className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl hidden md:flex items-center gap-2"
              >
                Ver todas <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topRecommendations.map((rec, index) => {
                const plant = rec.plant;
                return (
                  <Link
                    key={plant._id}
                    to={`/plants/${plant._id}`}
                    className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:shadow-lg transition-all"
                  >
                    {/* Badge de posición */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-green rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {index + 1}
                    </div>

                    {/* Badge de match */}
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {rec.matchScore}%
                    </div>

                    <div className="w-full h-32 bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {plant.imageUrl ? (
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <span className="text-4xl">🌿</span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {plant.description}
                    </p>
                    
                    <div className="flex gap-1 flex-wrap">
                      <span className="badge badge-xs bg-emerald-100 text-emerald-700 border-0">
                        {plant.care.difficulty}
                      </span>
                      <span className="badge badge-xs bg-amber-100 text-amber-700 border-0">
                        {plant.care.sunlight}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              to="/recommendations"
              className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl w-full mt-6 md:hidden flex items-center justify-center gap-2"
            >
              Ver todas las recomendaciones <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Sección: Favoritos recientes */}
        {recentFavorites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Heart className="text-rose-500" /> Favoritos Recientes
                </h2>
                <p className="text-gray-500">Plantas que has guardado</p>
              </div>
              <Link
                to="/favorites"
                className="btn btn-outline border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl hidden md:flex items-center gap-2"
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentFavorites.map((fav) => {
                const plant = fav.plantId;
                return (
                  <Link
                    key={fav._id}
                    to={`/plants/${plant._id}`}
                    className="group bg-rose-50 rounded-xl p-4 border border-rose-100 hover:shadow-lg transition-all"
                  >
                    <div className="w-full h-32 bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {plant.imageUrl ? (
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <span className="text-4xl">🌿</span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                      {plant.name}
                    </h3>
                    
                    {fav.notes && (
                      <p className="text-sm text-gray-600 italic line-clamp-2 mb-2">
                        "{fav.notes}"
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      <Calendar size={12} className="inline mr-1" />
                      {new Date(fav.addedAt).toLocaleDateString('es-ES')}
                    </p>
                  </Link>
                );
              })}
            </div>

            <Link
              to="/favorites"
              className="btn btn-outline border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl w-full mt-6 md:hidden flex items-center justify-center gap-2"
            >
              Ver todos los favoritos <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Sección: Estadísticas de favoritos */}
        {favoriteStats && favoriteStats.total > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Award className="text-purple-500" /> Tu Colección
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {favoriteStats.byDifficulty.beginner}
                </p>
                <p className="text-sm text-gray-600">Principiante</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {favoriteStats.byDifficulty.intermediate}
                </p>
                <p className="text-sm text-gray-600">Intermedio</p>
              </div>

              <div className="text-center p-4 bg-rose-50 rounded-xl">
                <p className="text-3xl font-bold text-rose-600 mb-1">
                  {favoriteStats.petFriendly}
                </p>
                <p className="text-sm text-gray-600">Pet Friendly</p>
              </div>

              <div className="text-center p-4 bg-teal-50 rounded-xl">
                <p className="text-3xl font-bold text-teal-600 mb-1">
                  {favoriteStats.airPurifying}
                </p>
                <p className="text-sm text-gray-600">Purifican Aire</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA: Explorar catálogo */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <Leaf className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-3">¿Buscas más plantas?</h2>
          <p className="text-emerald-100 mb-6 text-lg">
            Explora nuestro catálogo completo con cientos de especies
          </p>
          <Link
            to="/plants"
            className="btn bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 shadow-lg inline-flex items-center gap-2 border-0"
          >
            Ver catálogo completo <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;