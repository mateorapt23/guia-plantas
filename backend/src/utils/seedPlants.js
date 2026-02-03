const Plant = require('../models/mongo/plant.model');

const plantsData = [
  {
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    description: "Planta de interior muy resistente y fácil de cuidar, perfecta para principiantes. Sus hojas en forma de corazón pueden ser verdes o variegadas.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    care: {
      sunlight: "low",
      watering: "low",
      maintenance: "low",
      difficulty: "beginner"
    },
    size: "medium",
    petFriendly: false,
    airPurifying: true,
    climate: ["tropical", "temperate"],
    benefits: ["Purifica el aire", "Muy resistente", "Crece rápidamente"],
    tips: [
      "Riega cuando la tierra esté seca al tacto",
      "Puede crecer en agua o tierra",
      "Poda regularmente para mantener forma"
    ]
  },
  {
    name: "Sansevieria",
    scientificName: "Sansevieria trifasciata",
    description: "Conocida como 'Lengua de suegra' o 'Espada de San Jorge'. Una de las plantas más resistentes que existen, ideal para olvidadizos.",
    imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=400",
    care: {
      sunlight: "low",
      watering: "low",
      maintenance: "low",
      difficulty: "beginner"
    },
    size: "medium",
    petFriendly: false,
    airPurifying: true,
    climate: ["dry", "tropical", "temperate"],
    benefits: ["Purifica el aire por la noche", "Tolera la sequía", "Casi indestructible"],
    tips: [
      "Riega muy poco, cada 2-3 semanas",
      "Prefiere estar seca que sobre-regada",
      "Crece lentamente"
    ]
  },
  {
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    description: "Planta tropical con hojas grandes y fenestradas (con agujeros). Popular por su aspecto exótico y decorativo.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    care: {
      sunlight: "medium",
      watering: "medium",
      maintenance: "medium",
      difficulty: "intermediate"
    },
    size: "large",
    petFriendly: false,
    airPurifying: true,
    climate: ["tropical", "temperate"],
    benefits: ["Hojas decorativas únicas", "Crece grande", "Purifica el aire"],
    tips: [
      "Necesita espacio para crecer",
      "Limpia las hojas con paño húmedo",
      "Usa tutor para que trepe"
    ]
  },
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    description: "Suculenta medicinal con múltiples usos. Gel interno útil para quemaduras y cuidado de la piel.",
    imageUrl: "https://images.unsplash.com/photo-1596508064724-1b1c0d69ec03?w=400",
    care: {
      sunlight: "high",
      watering: "low",
      maintenance: "low",
      difficulty: "beginner"
    },
    size: "small",
    petFriendly: false,
    airPurifying: false,
    climate: ["dry", "tropical"],
    benefits: ["Propiedades medicinales", "Tolera sequía", "Bajo mantenimiento"],
    tips: [
      "Necesita mucha luz solar",
      "Riega solo cuando la tierra esté completamente seca",
      "Buen drenaje es esencial"
    ]
  },
  {
    name: "Cinta",
    scientificName: "Chlorophytum comosum",
    description: "Planta colgante con hojas largas y arqueadas, a menudo variegadas. Produce hijuelos fáciles de propagar.",
    imageUrl: "https://images.unsplash.com/photo-1572688681164-1d0f4fda8b64?w=400",
    care: {
      sunlight: "medium",
      watering: "medium",
      maintenance: "low",
      difficulty: "beginner"
    },
    size: "small",
    petFriendly: true,
    airPurifying: true,
    climate: ["temperate", "tropical"],
    benefits: ["Segura para mascotas", "Fácil de propagar", "Purifica el aire"],
    tips: [
      "Perfecta para macetas colgantes",
      "Tolera algo de descuido",
      "Produce 'bebés' que puedes plantar"
    ]
  },
  {
    name: "Filodendro",
    scientificName: "Philodendron hederaceum",
    description: "Planta trepadora con hojas en forma de corazón. Muy adaptable y de crecimiento rápido.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    care: {
      sunlight: "low",
      watering: "medium",
      maintenance: "low",
      difficulty: "beginner"
    },
    size: "medium",
    petFriendly: false,
    airPurifying: true,
    climate: ["tropical", "temperate"],
    benefits: ["Crece rápido", "Tolera poca luz", "Fácil de cuidar"],
    tips: [
      "Puede trepar o colgar",
      "Poda para controlar crecimiento",
      "Riega regularmente"
    ]
  }
];

const seedPlants = async () => {
  try {
    // Limpiar colección existente
    await Plant.deleteMany({});
    console.log('🗑️  Plantas anteriores eliminadas');

    // Insertar nuevas plantas
    const plants = await Plant.insertMany(plantsData);
    console.log(`✅ ${plants.length} plantas insertadas exitosamente`);

    return plants;
  } catch (error) {
    console.error('❌ Error al insertar plantas:', error);
    throw error;
  }
};

module.exports = seedPlants;