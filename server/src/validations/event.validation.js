const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEvent = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    event_description: Joi.string().required(),
    category: Joi.string()
      .valid('Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other')
      .required(),
    event_image: Joi.string().required(),
    club_hosting: Joi.string().custom(objectId).required(),
    // event_status is removed from creation - defaults to 'unpublished'
    event_date: Joi.date().required(),
    event_time_duration: Joi.string().required(),
    registration_deadline: Joi.date().required(),
    location: Joi.string().required(),
    capacity: Joi.number().integer().min(1).required(),
    event_type: Joi.string().valid('online', 'offline', 'hybrid').required(),
    skills_offered: Joi.array().items(Joi.string()).default([]),
    topics: Joi.array().items(Joi.string()).default([]),
    media_links: Joi.array().items(Joi.string().uri()).default([]),
  }),
};

const getEvents = {
  query: Joi.object().keys({
    title: Joi.string(),
    category: Joi.string().valid('Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'),
    club_hosting: Joi.string().custom(objectId),
    event_status: Joi.string().valid('unpublished', 'published', 'cancelled'),
    event_type: Joi.string().valid('online', 'offline', 'hybrid'),
    skills_offered: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const updateEvent = {
  params: Joi.object().keys({
    eventId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      event_description: Joi.string(),
      category: Joi.string().valid('Tech', 'Business', 'Design', 'Marketing', 'Finance', 'Law', 'Health', 'Education', 'Other'),
      event_image: Joi.string(),
      club_hosting: Joi.string().custom(objectId),
      // event_status removed - use separate endpoint for status updates
      event_date: Joi.date(),
      event_time_duration: Joi.string(),
      registration_deadline: Joi.date(),
      location: Joi.string(),
      capacity: Joi.number().integer().min(1),
      event_type: Joi.string().valid('online', 'offline', 'hybrid'),
      skills_offered: Joi.array().items(Joi.string()),
      topics: Joi.array().items(Joi.string()),
      media_links: Joi.array().items(Joi.string().uri()),
      feedback_score: Joi.number().min(0).max(5),
    })
    .min(1),
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const incrementView = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const getEventsByClub = {
  params: Joi.object().keys({
    clubId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateEventStatus = {
  params: Joi.object().keys({
    eventId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    event_status: Joi.string().valid('unpublished', 'published', 'cancelled').required(),
  }),
};
const registerEvent = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    eventId: Joi.string().custom(objectId).required(),
  }),
};

const unregisterEvent = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    eventId: Joi.string().custom(objectId).required(),
  }),
};

const attendEvent = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    eventId: Joi.string().custom(objectId).required(),
  }),
};

const provideFeedback = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    eventId: Joi.string().custom(objectId).required(),
    feedback_score: Joi.number().min(1).max(5).required(),
  }),
};

const getUserEventHistory = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    status: Joi.string().valid('registered', 'attended', 'feedback_given'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  incrementView,
  getEventsByClub,
  updateEventStatus,
  registerEvent,
  unregisterEvent,
  attendEvent,
  provideFeedback,
  getUserEventHistory,
};