import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { surveyAPI } from '../services/api';
import { Leaf, ArrowRight, ArrowLeft, CheckCircle, Sun, Droplets, Home, PawPrint, Sparkles } from 'lucide-react';

const Survey = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    experience: '',
    sunlight: '',
    space: '',
    petFriendly: false,
    maintenanceLevel: '',
    climate: '',
    purpose: '',
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await surveyAPI.complete(formData);
      
      // Actualizar el usuario en el contexto
      updateUser({ ...user, surveyCompleted: true });
      
      // Redirigir a recomendaciones
      navigate('/recommendations');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la encuesta');
      setLoading(false);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.experience !== '';
      case 2:
        return formData.sunlight !== '';
      case 3:
        return formData.space !== '';
      case 4:
        return formData.maintenanceLevel !== '';
      case 5:
        return true; // Opcionales
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)' }}>
      {/* Círculos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        {/* Card del formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-green rounded-2xl flex items-center justify-center shadow-md mb-4">
              <Leaf className="text-green" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center">Cuéntanos sobre ti</h1>
            <p className="text-gray-500 text-center mt-2">Responde estas preguntas para encontrar tus plantas ideales</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-600">Paso {currentStep} de {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-green transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Formulario por pasos */}
          <div className="min-h-[320px]">
            
            {/* PASO 1: Experiencia */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="text-emerald-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">¿Cuál es tu nivel de experiencia con plantas?</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'beginner', label: 'Principiante', desc: 'Soy nuevo en esto, quiero plantas fáciles' },
                    { value: 'intermediate', label: 'Intermedio', desc: 'Tengo algunas plantas y sé lo básico' },
                    { value: 'expert', label: 'Experto', desc: 'Tengo experiencia con muchas especies' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, experience: option.value })}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.experience === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{option.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                        </div>
                        {formData.experience === option.value && (
                          <CheckCircle className="text-emerald-500" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2: Luz solar */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Sun className="text-amber-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">¿Cuánta luz solar recibe tu hogar?</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'low', label: 'Poca luz', desc: 'Pocas ventanas o luz indirecta' },
                    { value: 'medium', label: 'Luz media', desc: 'Luz indirecta abundante durante el día' },
                    { value: 'high', label: 'Mucha luz', desc: 'Luz solar directa varias horas al día' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, sunlight: option.value })}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.sunlight === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{option.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                        </div>
                        {formData.sunlight === option.value && (
                          <CheckCircle className="text-emerald-500" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 3: Espacio */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="text-sky-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">¿Cuánto espacio tienes disponible?</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'small', label: 'Poco espacio', desc: 'Mesa, escritorio o estante pequeño' },
                    { value: 'medium', label: 'Espacio medio', desc: 'Macetas medianas en varias zonas' },
                    { value: 'large', label: 'Mucho espacio', desc: 'Plantas grandes o múltiples macetas' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, space: option.value })}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.space === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{option.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                        </div>
                        {formData.space === option.value && (
                          <CheckCircle className="text-emerald-500" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 4: Mantenimiento */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Droplets className="text-blue-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">¿Cuánto tiempo puedes dedicar al cuidado?</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'low', label: 'Poco mantenimiento', desc: 'Prefiero plantas que requieran poca atención' },
                    { value: 'medium', label: 'Mantenimiento moderado', desc: 'Puedo dedicar algo de tiempo regularmente' },
                    { value: 'high', label: 'Alto mantenimiento', desc: 'Me gusta cuidar mis plantas frecuentemente' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, maintenanceLevel: option.value })}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.maintenanceLevel === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{option.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                        </div>
                        {formData.maintenanceLevel === option.value && (
                          <CheckCircle className="text-emerald-500" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 5: Opcionales */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <PawPrint className="text-rose-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Preferencias adicionales (opcional)</h2>
                </div>

                {/* Pet friendly */}
                <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <input
                    type="checkbox"
                    id="petFriendly"
                    checked={formData.petFriendly}
                    onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                    className="checkbox checkbox-primary mt-1"
                  />
                  <div>
                    <label htmlFor="petFriendly" className="font-semibold text-gray-800 cursor-pointer">
                      Tengo mascotas en casa
                    </label>
                    <p className="text-sm text-gray-600 mt-1">Solo plantas no tóxicas para animales</p>
                  </div>
                </div>

                {/* Clima */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿En qué clima vives?</label>
                  <select
                    value={formData.climate}
                    onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-gray-50"
                  >
                    <option value="">Selecciona (opcional)</option>
                    <option value="tropical">Tropical</option>
                    <option value="temperate">Templado</option>
                    <option value="dry">Seco</option>
                  </select>
                </div>

                {/* Propósito */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué buscas en tus plantas?</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-gray-50"
                  >
                    <option value="">Selecciona (opcional)</option>
                    <option value="decoration">Decoración</option>
                    <option value="air-purification">Purificar el aire</option>
                    <option value="food">Alimentos/Hierbas</option>
                    <option value="relaxation">Relajación</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn btn-ghost text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="btn text-white font-semibold px-6 shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                Siguiente <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepComplete()}
                className="btn text-white font-semibold px-6 shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>Finalizar <CheckCircle size={18} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;