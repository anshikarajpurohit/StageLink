const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['audience', 'actor', 'theatre_group'], required: true },
  city: { type: String, required: true },
  bio: { type: String },
  skills: [{ type: String }],
  languages: [{ type: String }],
  pastProductions: [{
    playTitle: String,
    groupName: String,
    role: String,
    year: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
