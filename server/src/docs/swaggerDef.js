const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  basePath: '/v1',
  info: {
    title: 'Eventify API',
    version,
    description: 'Eventify API documentation',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
  components: {
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 400 },
                message: { type: 'string', example: 'Bad Request' }
              }
            }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 401 },
                message: { type: 'string', example: 'Please authenticate' }
              }
            }
          }
        }
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 403 },
                message: { type: 'string', example: 'Forbidden' }
              }
            }
          }
        }
      },
      NotFound: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 404 },
                message: { type: 'string', example: 'Resource not found' }
              }
            }
          }
        }
      },
      DuplicateEmail: {
        description: 'Duplicate email',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 400 },
                message: { type: 'string', example: 'Email already taken' }
              }
            }
          }
        }
      }
    },
    schemas: {
      Event: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          event_description: { type: 'string' },
          category: { type: 'string' },
          event_image: { type: 'string' },
          club_hosting: { $ref: '#/components/schemas/Club' },
          event_status: { type: 'string' },
          event_date: { type: 'string', format: 'date-time' },
          event_time_duration: { type: 'string' },
          registration_deadline: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
          capacity: { type: 'integer' },
          event_type: { type: 'string' },
          total_registrations: { type: 'integer' },
          unique_attendees: { type: 'integer' },
          feedback_score: { type: 'number' },
          view: { type: 'integer' },
          skills_offered: { type: 'array', items: { type: 'string' } },
          topics: { type: 'array', items: { type: 'string' } },
          media_links: { type: 'array', items: { type: 'string' } },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      StudentEventHistory: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          event: { type: 'string' },
          status: { 
            type: 'string',
            enum: ['registered', 'attended', 'feedback_given']
          },
          registered_at: { type: 'string', format: 'date-time' },
          feedback_score: { type: 'number' },
          feedback_at: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Club: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          logo: { type: 'string' },
          website: { type: 'string' },
          moderators: { type: 'array', items: { type: 'string' } },
          members: { type: 'array', items: { type: 'string' } },
          pendings: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

module.exports = swaggerDef;
