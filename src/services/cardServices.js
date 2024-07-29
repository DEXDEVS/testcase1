const createHttpError = require('http-errors');
const Card = require('../models/Card');
const Order = require('../models/Order');
const { addOrderService } = require('./orderServices');
const { default: mongoose } = require('mongoose');
const { addActivityService } = require('./activityServices');
const ObjectId = mongoose.Types.ObjectId;

const getCardsService = async () => {
  try {
    const MatchStage = {
      $match: {
        archived: { $ne: true },
      },
    };
    const JoinWithOrderStage= {$lookup:{from:"orders",localField:"orderID",foreignField:"_id",as:"order"}};
    let UnwindOrderStage={$unwind:"$order"}
    const ProjectionStage = {
      $project: {
        orderID: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        'type._id': 0,
        'client._id': 0,
        'address._id': 0,
        'order._id': 0,
        'order.createdAt': 0,
        'order.updatedAt': 0,

      },
    };
    const AddExtraFieldsStage = {
      $addFields: {
        id: '$_id',
      },
    };
    const data = await Card.aggregate([
      MatchStage,
      JoinWithOrderStage,
      UnwindOrderStage,
      AddExtraFieldsStage,
      ProjectionStage,
    ]);
    return { status: 'success', data };
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getCardsByClientNameService = async (req) => {
  try {
    const clientNameOrCardNumber = req.params.clientNameOrCardNumber;
    const MatchStage = {
      $match: {
        archived: { $ne: true },
        $or: [
          { 'client.name': clientNameOrCardNumber },
          { 'client.name': { $regex: clientNameOrCardNumber, $options: 'i' } },
          { 'cardNumber': clientNameOrCardNumber },
          { 'cardNumber': { $regex: clientNameOrCardNumber, $options: 'i' } },
        ],
      },
    };
    const JoinWithOrderStage= {$lookup:{from:"orders",localField:"orderID",foreignField:"_id",as:"order"}};
    const UnwindOrderStage={$unwind:"$order"}
    const ProjectionStage = {
      $project: {
        orderID: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        'type._id': 0,
        'client._id': 0,
        'address._id': 0,
        'order._id': 0,
        'order.createdAt': 0,
        'order.updatedAt': 0,
      },
    };
    const AddExtraFieldsStage = {
      $addFields: {
        id: '$_id',
      },
    };
    const data = await Card.aggregate([
      MatchStage,
      JoinWithOrderStage,
      UnwindOrderStage,
      AddExtraFieldsStage,
      ProjectionStage,
    ]);
    return data;
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getArchivedCardListService = async () => {
  try {
    let MatchStage = { $match: { archived: true } };

    const ProjectionStage = {
      $project: {
        orderID: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        'type._id': 0,
        'client._id': 0,
        'address._id': 0,
      },
    };
    const AddExtraFieldsStage = {
      $addFields: {
        id: '$_id',
      },
    };
    const data = await Card.aggregate([
      MatchStage,
      AddExtraFieldsStage,
      ProjectionStage,
    ]);
    return { status: 'success', data };
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const addCardsService = async (req) => {
  try {
    const { orderInfo, cards } = req.body;
    let order = await Order.findOne({orderNumber:orderInfo.orderNumber})
    if(!order){
      order = await addOrderService(orderInfo);
    }
    const modifiedCards = cards.map((c) => {
      return { ...c, orderID: order._id };
    });
    const data = await Card.insertMany(modifiedCards);

    let cardNumbers = [];
    cards.forEach((card) => {
      cardNumbers.push(card.cardNumber);
    });
    cardNumbers = cardNumbers.join(', ');

    await addActivityService(req, cardNumbers, 'Added', 'to ממתין למפעל');

    return { status: 'success', data };
  } catch (error) {
    throw new createHttpError(500, error.toString());
  }
};
const updateCardService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    const { status, dueDate, type, client, address } = req.body;
    let updateData = {};
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = dueDate;
    if (type) updateData.type = type;
    if (client) updateData.client = client;
    if (address) updateData.address = address;

    const currentCard = await Card.findOne({ _id: card_id });

    await Card.updateOne(
      { _id: card_id },
      { $set: updateData },
      { runValidators: true }
    );
    if (status && currentCard) {
      await addActivityService(
        req,
        currentCard.cardNumber,
        'Moved',
        `from ${currentCard.status} to ${updateData.status}`
      );
    }
    return { status: 'success', message: 'Card updated' };
  } catch (e) {
    throw new createHttpError(400, e.toString());
  }
};
const moveToArchiveByCardIDService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    const data = await Card.findOneAndUpdate(
      { _id: card_id },
      { $set: { archived: true } }
    );
    await addActivityService(req, data.cardNumber, 'Moved', `to archived`);
    return { status: 'success', message: 'Order moved to archieved' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const restoreSingleCardFromArchiveService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    const data = await Card.findOneAndUpdate(
      { _id: card_id },
      { $set: { archived: false } }
    );
    await addActivityService(req, data.cardNumber, 'Restored', `from archived`);
    return { status: 'success', message: 'Card restored from archieved' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const moveCardlistToAcrhiveByStatusService = async (req) => {
  try {
    const status = req.params.status;
    await Card.updateMany({ status: status }, { $set: { archived: true } });
    return { status: 'success', message: 'Orders moved to archieved' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const deleteCardByIDService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    await Card.deleteOne({ _id: card_id });
    return { status: 'success', message: 'Card successfully deleted' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const deleteCardListByStatusService = async (req) => {
  try {
    const status = req.params.status;
    await Card.deleteMany({ status: status });
    return { status: 'success', message: 'Card List successfully deleted' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};

module.exports = {
  getCardsService,
  getCardsByClientNameService,
  getArchivedCardListService,
  addCardsService,
  updateCardService,
  moveToArchiveByCardIDService,
  restoreSingleCardFromArchiveService,
  moveCardlistToAcrhiveByStatusService,
  deleteCardByIDService,
  deleteCardListByStatusService,
};
