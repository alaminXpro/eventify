const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { checkEventClubOwnership } = require('../../middlewares/eventAuth');
const eventValidation = require('../../validations/event.validation');
const eventController = require('../../controllers/event.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageEvents'), validate(eventValidation.createEvent), checkEventClubOwnership, eventController.createEvent)
  .get(validate(eventValidation.getEvents), eventController.getEvents);

router
  .route('/published')
  .get(validate(eventValidation.getEvents), eventController.getPublishedEvents);

router
  .route('/club/:clubId')
  .get(validate(eventValidation.getEventsByClub), eventController.getEventsByClub);

router
  .route('/:eventId')
  .get(validate(eventValidation.getEvent), eventController.getEvent)
  .patch(auth('manageEvents'), validate(eventValidation.updateEvent), checkEventClubOwnership, eventController.updateEvent)
  .delete(auth('manageEvents'), validate(eventValidation.deleteEvent), checkEventClubOwnership, eventController.deleteEvent);

// Event status update (admin only)
router
  .route('/:eventId/status')
  .patch(auth('manageEventStatus'), validate(eventValidation.updateEventStatus), eventController.updateEventStatus);

router
  .route('/:eventId/status')
  .patch(auth('manageEventStatus'), validate(eventValidation.updateEventStatus), eventController.updateEventStatus);

router
  .route('/:eventId/view')
  .patch(validate(eventValidation.incrementView), eventController.incrementEventView);

module.exports = router;

/**
 * @swagger
 * /events/{id}/status:
 *   patch:
 *     summary: Update event status
 *     description: Only admin can update event status (publish/unpublish/cancel events).
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_status
 *             properties:
 *               event_status:
 *                 type: string
 *                 enum: [unpublished, published, cancelled]
 *                 description: New status for the event
 *             example:
 *               event_status: "published"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an event
 *     description: Admin can create events for any club. Club moderators can only create events for their own clubs.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - event_description
 *               - category
 *               - event_image
 *               - club_hosting
 *               - event_date
 *               - event_time_duration
 *               - registration_deadline
 *               - location
 *               - capacity
 *               - event_type
 *             properties:
 *               title:
 *                 type: string
 *               event_description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Tech, Business, Design, Marketing, Finance, Law, Health, Education, Other]
 *               event_image:
 *                 type: string
 *               club_hosting:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date-time
 *               event_time_duration:
 *                 type: string
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               event_type:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *               skills_offered:
 *                 type: array
 *                 items:
 *                   type: string
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               media_links:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               title: "Tech Conference 2024"
 *               event_description: "Annual technology conference"
 *               category: "Tech"
 *               event_image: "https://example.com/image.jpg"
 *               club_hosting: "64a7b8f123456789abcdef01"
 *               event_date: "2024-12-15T10:00:00.000Z"
 *               event_time_duration: "8 hours"
 *               registration_deadline: "2024-12-10T23:59:59.000Z"
 *               location: "Main Auditorium"
 *               capacity: 200
 *               event_type: "offline"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events with optional filtering.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Event title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Tech, Business, Design, Marketing, Finance, Law, Health, Education, Other]
 *         description: Event category
 *       - in: query
 *         name: club_hosting
 *         schema:
 *           type: string
 *         description: Club hosting the event
 *       - in: query
 *         name: event_status
 *         schema:
 *           type: string
 *           enum: [unpublished, published, cancelled]
 *         description: Event status
 *       - in: query
 *         name: event_type
 *         schema:
 *           type: string
 *           enum: [online, offline, hybrid]
 *         description: Event type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of events
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /events/published:
 *   get:
 *     summary: Get published events
 *     description: Retrieve all published events.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Event title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Tech, Business, Design, Marketing, Finance, Law, Health, Education, Other]
 *         description: Event category
 *       - in: query
 *         name: event_type
 *         schema:
 *           type: string
 *           enum: [online, offline, hybrid]
 *         description: Event type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of events
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event
 *     description: Retrieve an event by id.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an event
 *     description: Admin can update any event. Club moderators can only update events for their own clubs. Event status cannot be updated through this endpoint.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               event_description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Tech, Business, Design, Marketing, Finance, Law, Health, Education, Other]
 *               event_image:
 *                 type: string
 *               club_hosting:
 *                 type: string
 *               event_status:
 *                 type: string
 *                 enum: [unpublished, published, cancelled]
 *                 description: Cannot be updated through this endpoint - use /events/{id}/status instead
 *               event_date:
 *                 type: string
 *                 format: date-time
 *               event_time_duration:
 *                 type: string
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               event_type:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *               skills_offered:
 *                 type: array
 *                 items:
 *                   type: string
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               media_links:
 *                 type: array
 *                 items:
 *                   type: string
 *               feedback_score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *             example:
 *               title: "Updated Tech Conference 2024"
 *               event_description: "Updated annual technology conference"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an event
 *     description: Admin can delete any event. Club moderators can only delete events for their own clubs.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /events/{id}/view:
 *   patch:
 *     summary: Increment event view count
 *     description: Increment the view count of an event.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /events/club/{clubId}:
 *   get:
 *     summary: Get events by club
 *     description: Retrieve all events hosted by a specific club.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Club id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of events
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */