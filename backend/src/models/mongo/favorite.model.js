const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
favoriteSchema.index({ userId: 1, plantId: 1 }, { unique: true });

// Índice para búsquedas rápidas por usuario
favoriteSchema.index({ userId: 1 });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;