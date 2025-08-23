const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const StudentEventHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: {
    type: String,
    enum: ["registered", "attended", "feedback_given"],
    required: true
  },
  registered_at: { type: Date, default: Date.now },
  feedback_score: { type: Number, min: 1, max: 5 },
  feedback_at: { type: Date },
}, {
  timestamps: true,
});

// add plugin that converts mongoose to json
StudentEventHistorySchema.plugin(toJSON);
StudentEventHistorySchema.plugin(paginate);

/**
 * Check if student event history exists
 * @param {ObjectId} userId - The user's id
 * @param {ObjectId} eventId - The event's id
 * @param {ObjectId} [excludeHistoryId] - The id of the history to be excluded
 * @returns {Promise<boolean>}
 */
StudentEventHistorySchema.statics.isHistoryExists = async function (userId, eventId, excludeHistoryId) {
  const history = await this.findOne({
    user: userId,
    event: eventId,
    _id: { $ne: excludeHistoryId }
  });
  return !!history;
};

/**
 * Get student event history by user and event
 * @param {ObjectId} userId - The user's id
 * @param {ObjectId} eventId - The event's id
 * @returns {Promise<Object>}
 */
StudentEventHistorySchema.statics.getHistoryByUserAndEvent = async function (userId, eventId) {
  return this.findOne({ user: userId, event: eventId });
};

/**
 * @typedef StudentEventHistory
 */
const StudentEventHistory = mongoose.model('StudentEventHistory', StudentEventHistorySchema);

module.exports = StudentEventHistory;
