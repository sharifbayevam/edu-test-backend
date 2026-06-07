const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  savol: { type: String, required: true },
  a: { type: String, required: true },
  b: { type: String, required: true },
  c: { type: String, required: true },
  d: { type: String, required: true },
  javob: { type: String, required: true }, // A, B, C, D
  img: { type: String, default: null } // Base64 rasm uchun
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: Number, required: true, default: 20 }, // Daqiqada
  status: { type: String, enum: ['draft', 'active'], default: 'draft' }, 
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);