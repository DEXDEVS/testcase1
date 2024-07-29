const { getActivitiesService } = require('../services/activityServices');

exports.getActivities = async (req, res, next) => {
  try {
    const result = await getActivitiesService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
