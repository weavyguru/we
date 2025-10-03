const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['splash', 'yes_no', 'email', 'url', 'textarea', 'text'],
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  required: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient ordering queries
questionSchema.index({ order: 1 });

module.exports = mongoose.model('Question', questionSchema);
