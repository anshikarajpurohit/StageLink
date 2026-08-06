const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  date: { type: Date, required: true },
  time: String,
  venue: String,
  city: { type: String, required: true },
  ticketLink: String,
  posterUrl: String,
  description: String
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);
