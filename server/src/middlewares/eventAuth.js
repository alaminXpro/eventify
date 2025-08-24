const httpStatus = require('http-status');
const { eventService, clubService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to check if moderator owns the club hosting the event
 * Admin can always proceed, moderators must own the hosting club
 */
const checkEventClubOwnership = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Admin can manage any event
  if (user.role === 'admin') {
    return next();
  }

  // For moderators, check club ownership
  if (user.role === 'moderator') {
    let clubId;

    // For creation, check the club_hosting in body
    if (req.method === 'POST' && req.body.club_hosting) {
      clubId = req.body.club_hosting;
    }
    // For update/delete, get the event first and check its hosting club
    else if (req.params.eventId) {
      const event = await eventService.getEventById(req.params.eventId);
      if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
      }
      clubId = event.club_hosting;
    }

    if (!clubId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Club information not found');
    }

    const club = await clubService.getClubById(clubId);
    if (!club) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
    }

    // Check if user is a moderator of the club
    console.log(user.id)
    console.log("Club moderators:", club.moderators.map(m => m.toString()));
    const isModerator = club.moderators.some(
      moderator => moderator._id.toString() === user.id
    );
    if (!isModerator) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only manage events for clubs you moderate');
    }
  }

  next();
});

/**
 * Middleware to check if user is authorized to view all events
 * Admin can always access, moderators can only access events from clubs they moderate
 */
const checkEventViewAccess = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Admin can view all events
  if (user.role === 'admin') {
    return next();
  }

  // For moderators, filter events by their clubs
  if (user.role === 'moderator') {
    // Get all clubs the moderator manages
    const clubs = await clubService.getClubsByModerator(user.id);
    
    if (!clubs || clubs.length === 0) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access events');
    }
    
    // Create an array of club IDs the moderator manages
    const clubIds = clubs.map(club => club.id);
    
    // Add filter to only show events from clubs the moderator manages
    req.query.club_hosting = { $in: clubIds };
  } else {
    // Regular users should not access this endpoint
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view all events');
  }

  next();
});

module.exports = {
  checkEventClubOwnership,
  checkEventViewAccess,
};
/**
 * Middleware to check if moderator owns the club being modified
 * Admin can always proceed, moderators must own the club
 */
const checkClubOwnership = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Admin can manage any club
  if (user.role === 'admin') {
    return next();
  }

  // For moderators, check club ownership
  if (user.role === 'moderator') {
    let clubId;

    // For creation, check the club id in body
    if (req.method === 'POST' && req.body.clubId) {
      clubId = req.body.clubId;
    }
    // For update/delete, get the club id from params
    else if (req.params.clubId) {
      clubId = req.params.clubId;
    }

    if (!clubId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Club information not found');
    }

    const club = await clubService.getClubById(clubId);
    if (!club) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
    }

    // Check if user is a moderator of the club
    const isModerator = club.moderators.some(moderator => {
      // moderator can be either ObjectId or populated user object
      if (typeof moderator === 'string' || typeof moderator === 'object' && moderator._id) {
        return (moderator._id ? moderator._id.toString() : moderator.toString()) === user.id;
      }
      return false;
    });
    if (!isModerator) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only manage clubs you moderate');
    }
  }

  next();
});

module.exports.checkClubOwnership = checkClubOwnership;
