const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const { chatWithContext } = require('../services/ai.service');
const ApiError = require('../utils/ApiError');

const aiFaqController = catchAsync(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'message is required');
  }

  const result = await chatWithContext({ message });

  res.status(httpStatus.OK).send({
    data: {
      source: result.source,           // 'context+llm'
      answer: result.answer,           // final answer
      contextHash: result.contextHash, // handy for cache-busting/debug
      usage: result.usage || undefined,
      cached: Boolean(result.cached)
    }
  });
});

module.exports = { aiFaqController };
