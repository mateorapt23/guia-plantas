const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Plant+Image'
  },
  // Características para matching con encuesta
  care: {
    sunlight: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    watering: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    maintenance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      required: true
    }
  },
  // Características adicionales
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  petFriendly: {
    type: Boolean,
    default: false
  },
  airPurifying: {
    type: Boolean,
    default: false
  },
  climate: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  tips: {
    type: [String],
    default: []
  },
  // Control
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
plantSchema.index({ name: 1 });
plantSchema.index({ 'care.sunlight': 1 });
plantSchema.index({ 'care.maintenance': 1 });
plantSchema.index({ 'care.difficulty': 1 });
plantSchema.index({ size: 1 });
plantSchema.index({ petFriendly: 1 });
plantSchema.index({ isActive: 1 });

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;