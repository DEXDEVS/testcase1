const createHttpError = require('http-errors');
const Card = require('../models/Card');
const { default: mongoose } = require('mongoose');
const { addActivityService } = require('./activityServices');
const ObjectId = mongoose.Types.ObjectId;

const getCardsService = async () => {
  try {
    const MatchStage = {
      $match: {
        archived: { $ne: true },
        isTrashed: { $ne: true },
      },
    };
    const ProjectionStage = {
      $project: {
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
const getCardsByClientNameService = async (req) => {
  try {
    const clientNameOrOrderNumber = req.params.clientNameOrCardNumber;
    const MatchStage = {
      $match: {
        archived: { $ne: true },
        isTrashed: { $ne: true },
        $or: [
          { 'client.name': clientNameOrOrderNumber },
          { 'client.name': { $regex: clientNameOrOrderNumber, $options: 'i' } },
          { 'orderNumber': clientNameOrOrderNumber },
          { 'orderNumber': { $regex: clientNameOrOrderNumber, $options: 'i' } },
        ],
      },
    };
    const ProjectionStage = {
      $project: {
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
    return data = await Card.aggregate([
      MatchStage,
      AddExtraFieldsStage,
      ProjectionStage,
    ]);
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getArchivedCardListService = async () => {
  try {
    let MatchStage = { $match: { archived: true, isTrashed: false } };

    const ProjectionStage = {
      $project: {
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
const getTrashCardListService = async () => {
  try {
    const MatchStage = { $match: { isTrashed: true } };
    const ProjectionStage = {
      $project: {
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
    const {cards} = req.body;
    const data = await Card.insertMany(cards);
    let cardNumbers = [];
    cards.forEach((card) => {
      cardNumbers.push(`${card.orderNumber} (${card['type']['name']} ${card['type']['typeID']})`);
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
        currentCard,
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
    await addActivityService(req, data, 'Moved', `to archived`);
    return { status: 'success', message: 'Order moved to archieved' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const moveToTrashByIDService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    const data = await Card.findOneAndUpdate(
      { _id: card_id },
      { $set: { isTrashed: true } }
    );
    await addActivityService(req, data, 'Moved', `to Trash`);
    return { status: 'success', message: 'Order moved to Trash' };
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
    await addActivityService(req, data, 'Restored', `from archived`);
    return { status: 'success', message: 'Card restored from archieved' };
  } catch (error) {
    throw new createHttpError(400, e.toString());
  }
};
const restoreFromTrashByIDService = async (req) => {
  try {
    let card_id = ObjectId.createFromHexString(req.params.cardID);
    const data = await Card.findOneAndUpdate(
      { _id: card_id },
      { $set: { isTrashed: false } }
    );
    await addActivityService(req, data, 'Restored', `from trash`);
    return { status: 'success', message: 'Card restored from trash' };
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
const moveToTrashByStatusService = async (req) => {
  try {
    const status = req.params.status;
    await Card.updateMany({ status: status }, { $set: { isTrashed: true } });
    return { status: 'success', message: 'Orders moved to Trash' };
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
const deleteAllTrashListService = async () => {
  try {
    await Card.deleteMany({ isTrashed: true });
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
  deleteAllTrashListService,
  moveToTrashByIDService,
  restoreFromTrashByIDService,
  getTrashCardListService,
  moveToTrashByStatusService
};
