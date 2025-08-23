const mongoose = require('mongoose');
const { SKILLS_ENUM } = require('../config/constant')
const { toJSON, paginate } = require('./plugins');
const EventSchema = new mongoose.Schema({

  title: { type: String, required: true },
  event_description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'],
    default: 'Other',
    required: true
  },
  event_image: { type: String, required: true },
  club_hosting: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  event_status: { type: String, enum: ["unpublished", "published", "cancelled"], default: "unpublished"},
  event_date: { type: Date, required: true },
  event_time_duration: { type: String ,required: true},
  registration_deadline: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  event_type: { type: String, enum: ["online", "offline", "hybrid"], required: true },
  total_registrations: { type: Number, default: 0 },
  unique_attendees: { type: Number, default: 0 },
  feedback_score: { type: Number, default: 0 },// avg rating
  view: { type: Number, default: 0 },

  skills_offered: {type:[String],enum:SKILLS_ENUM,default:[]},
  topics: [String],

  // Social proof
  media_links: [String],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

EventSchema.plugin(toJSON);
EventSchema.plugin(paginate);

/**
 * @typedef Event
 */
EventSchema.statics.isEventExists = async function (title, excludeEventId) {
  const event = await this.findOne({ title, _id: { $ne: excludeEventId } });
  return !!event;
};

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
