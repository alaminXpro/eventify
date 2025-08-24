const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const eventRecommendationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    // User demographic data
    semester: {
      type: String,
      enum: ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2', ''],
      default: '',
    },
    department: {
      type: String,
      enum: ['CSE', 'EEE', 'CE', 'ME', 'BBA', 'TE', 'IPE', ''],
      default: '',
    },
    // Event data
    club_hosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    event_topics: {
      type: [String],
      default: [],
    },
    event_description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'],
      required: true,
    },
    skills_offered: {
      type: [String],
      default: [],
    },
    registration_deadline: {
      type: Date,
      required: true,
    },
    // User behavior data
    joined_clubs: {
      type: [String], // Club names
      default: [],
    },
    previous_participation: {
      type: [String], // Event names
      default: [],
    },
    user_skills: {
      type: [String],
      default: [],
    },
    preferred_event_category: {
      type: [String],
      enum: ['Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'],
      default: [],
    },
    // Registration metadata
    registered_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
eventRecommendationSchema.plugin(toJSON);
eventRecommendationSchema.plugin(paginate);

/**
 * Check if recommendation record exists
 * @param {ObjectId} userId - The user's id
 * @param {ObjectId} eventId - The event's id
 * @returns {Promise<boolean>}
 */
eventRecommendationSchema.statics.isRecommendationExists = async function (userId, eventId) {
  const recommendation = await this.findOne({ user: userId, event: eventId });
  return !!recommendation;
};

/**
 * @typedef EventRecommendation
 */
const EventRecommendation = mongoose.model('EventRecommendation', eventRecommendationSchema);

module.exports = EventRecommendation;