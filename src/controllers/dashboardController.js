const {
  getPieChartDataService,
  getTotalCardsCountService,
  getNearestDeadlineOrdersService,
  getLineChartDataService,
} = require('../services/dashboardServices');

exports.getPieChartData = async (req, res, next) => {
  try {
    const result = await getPieChartDataService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getTotalCardsCount = async (req, res, next) => {
  try {
    const result = await getTotalCardsCountService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getNearestDeadlineOrders = async (req, res, next) => {
  try {
    const result = await getNearestDeadlineOrdersService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getLineChartData = async (req, res, next) => {
  try {
    const result = await getLineChartDataService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
