const Order = require('../models/Order');
const createHttpError = require('http-errors');

const addOrderService = async (orderInfo) => {
  try {
    const data = await Order.create(orderInfo);
    return data;
  } catch (error) {
    throw new createHttpError(500, error.toString());
  }
};

module.exports = {
  addOrderService,
};
