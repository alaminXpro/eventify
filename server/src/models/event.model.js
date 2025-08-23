const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { SKILLS_ENUM } = require('../config/constant')
const EventSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  event_description: { type: String },
  category: {
    type: String,
    enum: ['Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'],
    default: [],
    required: true
  }, 
  club_hosting: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },

  date: { type: Date, required: true },
  time: { type: String }, 
  duration: { type: Number }, 
  location: { type: String },
  capacity: { type: Number },
  event_format: { type: String, enum: ["online", "offline", "hybrid"], required: true },
  total_registrations: { type: Number, default: 0 },
  unique_attendees: { type: Number, default: 0 },
  feedback_score: { type: Number, default: 0 },// avg rating
  view: { type: Number, default: 0 },

  skills_offered: {type:[String],enum:SKILLS_ENUM,default:[]},
  topics: [String],

  // Social proof
  media_links: [String],

  created_at: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;