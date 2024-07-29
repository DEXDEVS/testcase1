const { addUserService } = require('../services/userServices');

exports.addUser = async (req, res, next) => {
  try {
    const result = await addUserService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
