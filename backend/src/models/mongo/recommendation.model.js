const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  plants: [{
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchReasons: [{
      type: String
    }]
  }],
  surveyData: {
    experience: String,
    sunlight: String,
    space: String,
    petFriendly: Boolean,
    maintenanceLevel: String,
    climate: String,
    purpose: String
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas por usuario
recommendationSchema.index({ userId: 1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;