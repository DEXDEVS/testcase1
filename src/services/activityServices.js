const { default: mongoose } = require('mongoose');
const Activity = require('../models/Activity');
const createHttpError = require('http-errors');
const ObjectId = mongoose.Types.ObjectId;

const addActivityService = async (req, cardNumbers, action, desc) => {
  try {
    const userID = ObjectId.createFromHexString(req.headers.userid);
    const data = await Activity.create({ userID, cardNumbers, action, desc });
    return { status: 'success', data };
  } catch (error) {
    throw new createHttpError(500, error.toString());
  }
};
const getActivitiesService = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const MatchStage = {
      $match: {},
    };
    const JoinWithUserStage = {
      $lookup: {
        from: 'peoples',
        localField: 'userID',
        foreignField: '_id',
        as: 'user',
      },
    };
    const UnwindUserStage = { $unwind: '$user' };
    const ProjectionStage = {
      $project: {
        userID: 0,
        _id: 0,
        updatedAt: 0,
        'user.email': 0,
        'user.password': 0,
        'user.role': 0,
        'user.createdAt': 0,
        'user.updatedAt': 0,
        'user._id': 0,
      },
    };
    const SkipStage = {
      $skip: (page - 1) * limit,
    };
    const LimitStage = {
      $limit: limit,
    };
    const sortingStage={$sort:{createdAt:-1}}

    // Get the total count of documents (for pagination metadata)
    const totalCount = await Activity.countDocuments({});

    // Aggregate data with pagination
    const data = await Activity.aggregate([
      MatchStage,
      JoinWithUserStage,
      UnwindUserStage,
      ProjectionStage,
      sortingStage,
      SkipStage,
      LimitStage
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
    };
  } catch (error) {
    throw new createHttpError(500, error.toString());
  }
};

module.exports = { addActivityService, getActivitiesService };
