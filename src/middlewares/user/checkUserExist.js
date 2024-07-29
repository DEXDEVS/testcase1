const createHttpError = require("http-errors");
const { getTotalUsersCount } = require("../../services/userServices");

const checkUserExist = async (req, res, next) => {
  try {
    const totalCount = await getTotalUsersCount();
    if (totalCount > 0) {
      next(createHttpError(400, "Only one user allowed"));
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = checkUserExist;
