const mongoose = require('mongoose');
const recruitmentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  role: { type: String, required: true },
  description: String,
  city: String,
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('RecruitmentPost', recruitmentSchema);
