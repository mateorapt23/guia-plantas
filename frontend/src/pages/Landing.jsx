import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ArrowRight, Check, Star, Droplets, Sun, Heart } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Leaf className="text-emerald-500" size={24} />,
      title: 'Recomendaciones Personalizadas',
      description: 'Responde una encuesta rápida y te recomendamos las plantas perfectas según tu hogar y estilo de vida.',
      bg: 'bg-emerald-50',
    },
    {
      icon: <Droplets className="text-sky-500" size={24} />,
      title: 'Guía de Cuidados',
      description: 'Aprende paso a paso cómo cuidar cada planta: riego, luz, temperatura y más consejos prácticos.',
      bg: 'bg-sky-50',
    },
    {
      icon: <Sun className="text-amber-500" size={24} />,
      title: 'Filtros Inteligentes',
      description: 'Filtra plantas por nivel de luz, tamaño, dificultad y compatibilidad con mascotas.',
      bg: 'bg-amber-50',
    },
    {
      icon: <Heart className="text-rose-500" size={24} />,
      title: 'Guarda tus Favoritas',
      description: 'Crea tu lista de plantas favoritas y agrega notas personales para recordar cómo cuidarlas.',
      bg: 'bg-rose-50',
    },
  ];

  const plants = [
    { name: 'Pothos', emoji: '🪴', trait: 'Muy resistente' },
    { name: 'Sansevieria', emoji: '🌿', trait: 'Poco riego' },
    { name: 'Monstera', emoji: '🌱', trait: 'Hojas exóticas' },
    { name: 'Aloe Vera', emoji: '🌵', trait: 'Medicinal' },
  ];

  const testimonials = [
    { name: 'María G.', text: 'Gracias a Plant Guide encontré la planta perfecta para mi departamento sin ventanas. ¡Mi Pothos está hermoso!', stars: 5 },
    { name: 'Carlos M.', text: 'La encuesta es muy intuitiva y las recomendaciones fueron exactas. Ahora tengo 4 plantas y todas sanas.', stars: 5 },
    { name: 'Laura P.', text: 'Es como tener un experto de jardinería en el bolsillo. Las guías de cuidado son muy claras.', stars: 5 },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)' }}>
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-green-300 rounded-full opacity-20 blur-2xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-emerald-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-700 text-sm font-medium">Tu jardín interior comienza aquí</span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-6">
            Descubre tus <br />
            <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              plantas ideales
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Una guía inteligente que te ayuda a elegir, cuidar y planificar tus plantas según tu hogar y estilo de vida.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/recommendations" className="btn text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-lg flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Ver mis recomendaciones <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-lg flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  Comenzar gratis <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-ghost text-gray-600 font-semibold px-6 py-3 rounded-2xl hover:bg-white/60 text-lg">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>

          {/* Pequeña nota de confianza */}
          <div className="flex items-center justify-center gap-4 mt-10 text-gray-400 text-sm flex-wrap">
            <span className="flex items-center gap-1"><Check className="text-emerald-500" size={16} /> Sin tarjeta de crédito</span>
            <span className="flex items-center gap-1"><Check className="text-emerald-500" size={16} /> Gratis</span>
            <span className="flex items-center gap-1"><Check className="text-emerald-500" size={16} /> En español</span>
          </div>
        </div>

        {/* Flecha scroll down */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center pt-1.5">
            <div className="w-1.5 h-3 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ===== PLANTAS DESTACADAS ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Conoce algunas</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">Plantas populares</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Algunas de las especies más amadas por nuestros usuarios</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {plants.map((plant, i) => (
              <div key={i} className="card bg-white shadow-md hover:shadow-xl plant-card-hover border border-gray-100 text-center">
                <div className="card-body items-center p-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                    {plant.emoji}
                  </div>
                  <h3 className="card-title text-gray-800 text-lg">{plant.name}</h3>
                  <p className="text-emerald-600 text-sm font-medium">{plant.trait}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/plants" className="btn btn-outline border-emerald-300 text-emerald-700 font-semibold hover:bg-emerald-50 rounded-xl px-6 flex items-center gap-2 mx-auto">
              Ver todas las plantas <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CARACTERÍSTICAS ===== */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">¿Qué ofrece?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">Todo lo que necesitas</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Herramientas simples y poderosas para que tu jardín interior prospere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className={`${f.bg} rounded-2xl p-8 border border-white shadow-sm hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Proceso</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">¿Cómo funciona?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Crea tu cuenta', desc: 'Regístrate gratis en segundos y accede a todas las funciones.', emoji: '✨' },
              { step: '02', title: 'Responde la encuesta', desc: 'Cuéntenos sobre tu hogar, nivel de experiencia y preferencias.', emoji: '📝' },
              { step: '03', title: 'Recibe recomendaciones', desc: 'Te mostraremos las plantas perfectas según tu perfil único.', emoji: '🌱' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                {i < 2 && <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-emerald-200" style={{ transform: 'translateX(50%)' }}></div>}

                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-md relative z-10" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                  {s.emoji}
                </div>
                <span className="text-emerald-600 text-xs font-bold tracking-widest mb-2">{s.step}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">Testimonios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">Lo que dicen nuestros usuarios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="text-amber-400 fill-amber-400" size={16} />
                  ))}
                </div>
                <p className="text-emerald-100 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <span className="text-white font-semibold text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-3xl p-12 shadow-xl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)' }}>
            <div className="text-6xl mb-6">🌿</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">¿Listo para empezar?</h2>
            <p className="text-emerald-700 text-lg max-w-xl mx-auto mb-8">
              Úntete a miles de personas que ya descubrieron sus plantas ideales. Es gratis y muy fácil.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/recommendations" className="btn text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition text-lg flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  Ver mis recomendaciones <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition text-lg flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    Comenzar gratis <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-ghost text-emerald-800 font-semibold px-6 py-3 rounded-2xl hover:bg-emerald-200 text-lg">
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;