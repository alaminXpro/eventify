const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { checkClubOwnership } = require('../../middlewares/clubAuth');
const clubValidation = require('../../validations/club.validation');
const clubController = require('../../controllers/club.controller');

const router = express.Router();

//test route
router
  .route('/test')
  .get((req, res) => {
    res.send('Test route');
  });

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a club
 *     description: Only admins can create clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - logo
 *             properties:
 *               name:
 *                 type: string
 *                 example: Programming Club
 *               description:
 *                 type: string
 *                 example: A club for programming enthusiasts
 *               logo:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               website:
 *                 type: string
 *                 example: https://www.aust.edu
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *             example:
 *               _id: "5ebac534954b54139806c112"
 *               name: "Programming Club"
 *               description: "A club for programming enthusiasts"
 *               logo: "https://example.com/logo.png"
 *               website: "https://www.aust.edu"
 *               moderators: []
 *               members: []
 *               pendings: []
 *               createdAt: "2025-08-23T12:00:00.000Z"
 *               updatedAt: "2025-08-23T12:00:00.000Z"
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by club name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of clubs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       "200":
 *         description: List of clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *             example:
 *               results:
 *                 - _id: "5ebac534954b54139806c112"
 *                   name: "Programming Club"
 *                   description: "A club for programming enthusiasts"
 *                   logo: "https://example.com/logo.png"
 *                   website: "https://www.aust.edu"
 *                   moderators: []
 *                   members: []
 *                   pendings: []
 *                   createdAt: "2025-08-23T12:00:00.000Z"
 *                   updatedAt: "2025-08-23T12:00:00.000Z"
 *               page: 1
 *               limit: 10
 *               totalPages: 1
 *               totalResults: 1
 */
router
  .route('/')
  .post(auth('addClub'), validate(clubValidation.createClub), clubController.createClub)
  .get(auth('getClubs'), validate(clubValidation.getClubs), clubController.getClubs);


/**
 * @swagger
 * /clubs/{clubId}:
 *   get:
 *     summary: Get a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Club details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *             example:
 *               _id: "5ebac534954b54139806c112"
 *               name: "Programming Club"
 *               description: "A club for programming enthusiasts"
 *               logo: "https://example.com/logo.png"
 *               website: "https://www.aust.edu"
 *               moderators: []
 *               members: []
 *               pendings: []
 *               createdAt: "2025-08-23T12:00:00.000Z"
 *               updatedAt: "2025-08-23T12:00:00.000Z"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Programming Club Updated"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       "200":
 *         description: Updated club
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *   delete:
 *     summary: Delete a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 */
router
  .route('/:clubId')
  .get(auth('getClubs'), validate(clubValidation.getClub), clubController.getClub)
  .patch(auth('manageClubs'), checkClubOwnership, validate(clubValidation.updateClub), clubController.updateClub)
  .delete(auth('addClub'), checkClubOwnership, validate(clubValidation.deleteClub), clubController.deleteClub);


/**
 * @swagger
 * /clubs/{clubId}/status:
 *   post:
 *     summary: Get membership status in a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Member status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "pending"
 */
router
  .route('/:clubId/status')
  .post(auth('getClubs'), validate(clubValidation.memberStatus), clubController.memberStatus);



// join club

/**
 * @swagger
 * /clubs/join:
 *   post:
 *     summary: Request to join a club
 *     description: Authenticated users can request to join a club. The clubId must be provided in the request body.
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clubId
 *             properties:
 *               clubId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Successfully requested to join the club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request to join club 'Programming Club' was successful."
 */
router
  .route('/join')
  .post(auth(), validate(clubValidation.joinClub), clubController.joinClub);



/**
 * @swagger
 * /clubs/{clubId}/moderators:
 *   post:
 *     summary: Get moderators of a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderatorId
 *             properties:
 *               moderatorId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: List of moderators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   patch:
 *     summary: Add a moderator to a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderatorId
 *             properties:
 *               moderatorId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Moderator added
 *   delete:
 *     summary: Remove a moderator from a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderatorIds
 *             properties:
 *               moderatorIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Moderator removed
 */
router
  .route('/:clubId/moderators')
  .patch(auth('manageClubs'), checkClubOwnership, validate(clubValidation.addModeratorToClub), clubController.addModeratorToClub)
  .delete(auth('manageClubs'), checkClubOwnership, validate(clubValidation.removeModeratorFromClub), clubController.removeModeratorFromClub)
  .post(auth('manageClubs'), checkClubOwnership, validate(clubValidation.getClubModerators), clubController.getClubModerators);

/**
 * @swagger
 * /clubs/{clubId}/members:
 *   post:
 *     summary: Get club members
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderatorId
 *             properties:
 *               moderatorId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   patch:
 *     summary: Approve a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Member approved
 */
router
  .route('/:clubId/members')
  .patch(auth('manageClubs'), checkClubOwnership, validate(clubValidation.approveClubMember), clubController.approveClubMember)
  .post(auth('manageClubs'), checkClubOwnership, validate(clubValidation.getClubMembers), clubController.getClubMembers);


/**
 * @swagger
 * /clubs/{clubId}/pendings:
 *   post:
 *     summary: Get pending club members
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderatorId
 *             properties:
 *               moderatorId:
 *                 type: string
 *                 example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: List of pending members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   delete:
 *     summary: Remove a user from pending list
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: User removed from pending list
 */
router
  .route('/:clubId/pendings')
  .post(auth('manageClubs'), checkClubOwnership, validate(clubValidation.getPendingMembers), clubController.getPendingMembers)
  .delete(auth('manageClubs'), checkClubOwnership, validate(clubValidation.deleteClubMember), clubController.removeUserFromPendingList);


/**
 * @swagger
 * /clubs/{clubId}/approve:
 *   post:
 *     summary: Approve a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Member approved
 */
router
  .route('/:clubId/approve')
  .post(auth('manageClubs'), checkClubOwnership, validate(clubValidation.approveClubMember), clubController.approveClubMember);

/**
 * @swagger
 * /clubs/{clubId}/delete:
 *   post:
 *     summary: Delete a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "5ebac534954b54139806c112"
 *     responses:
 *       "200":
 *         description: Club member deleted
 */
router
  .route('/:clubId/delete')
  .post(auth('manageClubs'), checkClubOwnership, validate(clubValidation.deleteClubMember), clubController.deleteClubMember);



module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club management
 */

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a club
 *     description: Only admins can create clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Programming Club
 *               description:
 *                 type: string
 *                 example: A club for programming enthusiasts
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by club name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of clubs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       "200":
 *         description: List of clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /clubs/{clubId}:
 *   get:
 *     summary: Get a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Club details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Updated club
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *   delete:
 *     summary: Delete a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 */

/**
 * @swagger
 * /clubs/{clubId}/status:
 *   post:
 *     summary: Get membership status in a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Member status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: pending
 */

/**
 * @swagger
 * /clubs/{clubId}/moderators:
 *   post:
 *     summary: Get moderators of a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: List of moderators
 *   patch:
 *     summary: Add a moderator to a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 5ebac534954b54139806c112
 *     responses:
 *       "200":
 *         description: Moderator added
 *   delete:
 *     summary: Remove a moderator from a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Moderator removed
 */

/**
 * @swagger
 * /clubs/{clubId}/members:
 *   post:
 *     summary: Get club members
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of members
 *   patch:
 *     summary: Approve a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Member approved
 */

/**
 * @swagger
 * /clubs/{clubId}/pendings:
 *   post:
 *     summary: Get pending club members
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of pending members
 *   delete:
 *     summary: Remove a user from pending list
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: User removed from pending list
 */

/**
 * @swagger
 * /clubs/{clubId}/approve:
 *   post:
 *     summary: Approve a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Member approved
 */

/**
 * @swagger
 * /clubs/{clubId}/delete:
 *   post:
 *     summary: Delete a club member
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Club member deleted
 */
