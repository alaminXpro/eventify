/**
 * Update event status by id (admin only)
 * @param {ObjectId} eventId
 * @param {String} status
 * @returns {Promise<Event>}
 */
const updateEventStatusById = async (eventId, status) => {
  const event = await Event.findByIdAndUpdate(
    eventId,
    { event_status: status, updated_at: new Date() },
    { new: true }
  );
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return event;
};
const httpStatus = require('http-status').default;
const { Event } = require('../models');
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
  const event = await Event.findByIdAndUpdate(
    eventId,
    { $inc: { view: 1 } },
    { new: true }
  );
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
  const event = await Event.findByIdAndUpdate(
    eventId,
    { $inc: { total_registrations: increment } },
    { new: true }
  );
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
};