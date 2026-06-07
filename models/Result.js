const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // O'quvchi ismi yoki ID-si
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  quizTitle: { type: String, required: true }, // Fan nomi
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  scorePercentage: { type: Number, required: true }, // Foizda
  spentTime: { type: Number, required: true }, // Sarflangan vaqt (soniyada)
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);