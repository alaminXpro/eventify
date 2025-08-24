/**
 * Update event status by id (admin only)
 * @param {ObjectId} eventId
 * @param {String} status
 * @returns {Promise<Event>}
 */
const updateEventStatusById = async (eventId, status) => {
  const event = await Event.findByIdAndUpdate(eventId, { event_status: status, updated_at: new Date() }, { new: true });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return event;
};
const httpStatus = require('http-status').default;
const { Event, User, Club, EventRecommendation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an event
 * @param {Object} eventBody
 * @returns {Promise<Event>}
 */
const createEvent = async (eventBody) => {
  if (await Event.isEventExists(eventBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event title already exists');
  }
  return Event.create(eventBody);
};

/**
 * Query for events
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEvents = async (filter, options) => {
  const events = await Event.paginate(filter, options);
  return events;
};

/**
 * Get event by id
 * @param {ObjectId} id
 * @returns {Promise<Event>}
 */
const getEventById = async (id) => {
  return Event.findById(id).populate('club_hosting');
};

/**
 * Update event by id
 * @param {ObjectId} eventId
 * @param {Object} updateBody
 * @returns {Promise<Event>}
 */
const updateEventById = async (eventId, updateBody) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  if (updateBody.title && (await Event.isEventExists(updateBody.title, eventId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event title already exists');
  }
  updateBody.updated_at = new Date();
  Object.keys(updateBody).forEach((key) => {
    event[key] = updateBody[key];
  });
  await event.save();
  return event;
};

/**
 * Delete event by id
 * @param {ObjectId} eventId
 * @returns {Promise<Event>}
 */
const deleteEventById = async (eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  await event.deleteOne();
  return event;
};

/**
 * Increment event view count
 * @param {ObjectId} eventId
 * @returns {Promise<Event>}
 */
const incrementEventView = async (eventId) => {
  const event = await Event.findByIdAndUpdate(eventId, { $inc: { view: 1 } }, { new: true });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return event;
};

/**
 * Update event registrations
 * @param {ObjectId} eventId
 * @param {number} increment
 * @returns {Promise<Event>}
 */
const updateEventRegistrations = async (eventId, increment = 1) => {
  const event = await Event.findByIdAndUpdate(eventId, { $inc: { total_registrations: increment } }, { new: true });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return event;
};

/**
 * Get events by club
 * @param {ObjectId} clubId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getEventsByClub = async (clubId, options) => {
  const filter = { club_hosting: clubId };
  return Event.paginate(filter, options);
};

/**
 * Get published events
 * @param {Object} filter - Additional filters
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getPublishedEvents = async (filter = {}, options) => {
  const publishedFilter = { ...filter, event_status: 'published' };
  return Event.paginate(publishedFilter, options);
};

// Event history operations
const { StudentEventHistory } = require('../models/');
/**
 * Register a student for an event
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<StudentEventHistory>}
 */
const registerEvent = async (userId, eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  if (event.event_status !== 'published') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot register for an unpublished or cancelled event');
  }

  if (event.registration_deadline < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Registration deadline has passed');
  }

  if (event.total_registrations >= event.capacity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event has reached maximum capacity');
  }

  const exists = await StudentEventHistory.isHistoryExists(userId, eventId);
  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already registered for this event');
  }

  // Check if EventRecommendation already exists
{/*}  const recommendationExists = await EventRecommendation.isRecommendationExists(userId, eventId);
  if (recommendationExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Recommendation data already exists for this event');
  }*/}

  // Get user data with populated clubs and attended events
  const user = await User.findById(userId).populate('clubs', 'name').populate('attendedEvents', 'title');

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Get event with populated club hosting data
  const eventWithClub = await Event.findById(eventId).populate('club_hosting', 'name');

  if (!eventWithClub.club_hosting) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event must have a hosting club');
  }

  // Prepare data for EventRecommendation
  const recommendationData = {
    user: userId,
    event: eventId,
    semester: user.semester || '',
    department: user.department || '',
    club_hosting: eventWithClub.club_hosting._id,
    event_topics: eventWithClub.topics || [],
    event_description: eventWithClub.event_description,
    category: eventWithClub.category,
    skills_offered: eventWithClub.skills_offered || [],
    registration_deadline: eventWithClub.registration_deadline,
    joined_clubs: user.clubs ? user.clubs.map((club) => club.name) : [],
    previous_participation: user.attendedEvents ? user.attendedEvents.map((event) => event.title) : [],
    user_skills: user.skills || [],
    preferred_event_category: user.preferences?.preferredEventCategory || [],
    registered_at: new Date(),
  };

  try {
    // Create the registration record
    const registration = await StudentEventHistory.create({
      user: userId,
      event: eventId,
      status: 'registered',
      registered_at: new Date(),
    });

    // Create the recommendation record
    await EventRecommendation.create(recommendationData);

    // Increment the event's registration count
    await updateEventRegistrations(eventId, 1);

    return registration;
  } catch (error) {
    // If EventRecommendation creation fails, we should still allow registration
    // but log the error for debugging
    console.error('Failed to create EventRecommendation:', error);

    // Create the registration record anyway
    const registration = await StudentEventHistory.create({
      user: userId,
      event: eventId,
      status: 'registered',
      registered_at: new Date(),
    });

    // Increment the event's registration count
    await updateEventRegistrations(eventId, 1);

    return registration;
  }
};

/**
 * Unregister a student from an event
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<StudentEventHistory>}
 */
const unregisterEvent = async (userId, eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const history = await StudentEventHistory.getHistoryByUserAndEvent(userId, eventId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No registration found for this event');
  }

  if (history.status !== 'registered') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot unregister after attendance or feedback');
  }

  if (event.event_date < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot unregister after event date has passed');
  }

  await history.deleteOne();

  // Decrement the event's registration count
  await updateEventRegistrations(eventId, -1);

  return { message: 'Successfully unregistered from event' };
};

/**
 * Mark a student's attendance for an event
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<StudentEventHistory>}
 */
const attendEvent = async (userId, eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const history = await StudentEventHistory.getHistoryByUserAndEvent(userId, eventId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not registered for this event');
  }

  if (history.status === 'attended' || history.status === 'feedback_given') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Attendance already marked for this event');
  }

  history.status = 'attended';
  await history.save();

  // Increment the event's unique attendee count
  await Event.findByIdAndUpdate(eventId, { $inc: { unique_attendees: 1 } }, { new: true });
  // Add event to user's attendedEvents array if not already present
  await User.findByIdAndUpdate(userId, { $addToSet: { attendedEvents: eventId } }, { new: true });

  return history;
};

/**
 * Provide feedback for an event
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @param {Number} feedback_score
 * @returns {Promise<StudentEventHistory>}
 */
const provideFeedback = async (userId, eventId, feedback_score) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const history = await StudentEventHistory.getHistoryByUserAndEvent(userId, eventId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not registered for this event');
  }

  if (history.status !== 'attended') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      history.status === 'registered'
        ? 'You must attend the event before providing feedback'
        : 'Feedback already provided for this event',
    );
  }

  history.status = 'feedback_given';
  history.feedback_score = feedback_score;
  history.feedback_at = new Date();
  await history.save();

  // Update the event's average feedback score
  const allFeedbacks = await StudentEventHistory.find({
    event: eventId,
    status: 'feedback_given',
    feedback_score: { $exists: true },
  });

  if (allFeedbacks.length > 0) {
    const totalScore = allFeedbacks.reduce((sum, item) => sum + item.feedback_score, 0);
    const averageScore = totalScore / allFeedbacks.length;

    await Event.findByIdAndUpdate(eventId, { feedback_score: parseFloat(averageScore.toFixed(1)) }, { new: true });
  }

  return history;
};

/**
 * Get event history for a specific user
 * @param {ObjectId} userId
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getUserEventHistory = async (userId, filter = {}, options = {}) => {
  const userFilter = { ...filter, user: userId };
  return StudentEventHistory.paginate(userFilter, options);
};

module.exports = {
  createEvent,
  queryEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  incrementEventView,
  updateEventRegistrations,
  getEventsByClub,
  getPublishedEvents,
  updateEventStatusById,
  registerEvent,
  unregisterEvent,
  attendEvent,
  provideFeedback,
  getUserEventHistory,
};
