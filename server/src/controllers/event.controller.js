const httpStatus = require('http-status').default;
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { eventService } = require('../services');

const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(httpStatus.CREATED).send(event);
});

const getEvents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'category', 'club_hosting', 'event_status', 'event_type', 'skills_offered']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.queryEvents(filter, options);
  res.send(result);
});

const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  res.send(event);
});

const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEventById(req.params.eventId, req.body);
  res.send(event);
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEventById(req.params.eventId);
  res.status(httpStatus.NO_CONTENT).send();
});

const incrementEventView = catchAsync(async (req, res) => {
  const event = await eventService.incrementEventView(req.params.eventId);
  res.send(event);
});

const getEventsByClub = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.getEventsByClub(req.params.clubId, options);
  res.send(result);
});

const getPublishedEvents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'category', 'event_type', 'skills_offered']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.getPublishedEvents(filter, options);
  res.send(result);
});

const updateEventStatus = catchAsync(async (req, res) => {
  const event = await eventService.updateEventStatusById(req.params.eventId, req.body.event_status);
  res.send(event);
});

// Event registration operations
const registerEvent = catchAsync(async (req, res) => {
  const { userId, eventId } = req.body;
  const history = await eventService.registerEvent(userId, eventId);
  res.status(httpStatus.CREATED).send(history);
});

const unregisterEvent = catchAsync(async (req, res) => {
  const { userId, eventId } = req.body;
  const result = await eventService.unregisterEvent(userId, eventId);
  res.send(result);
});

const attendEvent = catchAsync(async (req, res) => {
  const { userId, eventId } = req.body;
  const history = await eventService.attendEvent(userId, eventId);
  res.send(history);
});

const provideFeedback = catchAsync(async (req, res) => {
  const { userId, eventId, feedback_score } = req.body;
  const history = await eventService.provideFeedback(userId, eventId, feedback_score);
  res.send(history);
});

const getUserEventHistory = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.getUserEventHistory(userId, filter, options);
  res.send(result);
});

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  incrementEventView,
  getEventsByClub,
  getPublishedEvents,
  updateEventStatus,
  registerEvent,
  unregisterEvent,
  attendEvent,
  provideFeedback,
  getUserEventHistory,
};