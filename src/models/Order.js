const { mongoose } = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
