const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, 
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  chosenAnswers: { type: Map, of: String, default: {} }, // { "0": "A", "1": "C" }
  remainingTime: { type: Number, required: true }, // Soniyalarda
  isFinished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);