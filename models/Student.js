const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  allowedSubject: { type: String, required: true }, // Ruxsat etilgan fan
  isOnline: { type: Boolean, default: false }      // Kirganlarni ajratish uchun
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);