const {
  getCardsService,
  getArchivedCardListService,
  addCardsService,
  updateCardService,
  moveToArchiveByCardIDService,
  restoreSingleCardFromArchiveService,
  moveCardlistToAcrhiveByStatusService,
  deleteCardByIDService,
  getCardsByClientNameService,
  moveToTrashByIDService,
  restoreFromTrashByIDService,
  getTrashCardListService,
  moveToTrashByStatusService,
  deleteAllTrashListService
} = require('../services/cardServices');
const Card = require('../models/Card');

exports.getCards = async (req, res, next) => {
  try {
    const result = await getCardsService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getCardsByClientName = async (req, res, next) => {
  try {
    const result = await getCardsByClientNameService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getArchivedCardList = async (req, res, next) => {
  try {
    const result = await getArchivedCardListService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getTrashCardList = async (req, res, next) => {
  try {
    const result = await getTrashCardListService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.addCards = async (req, res, next) => {
  try {
    const result = await addCardsService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.updateCardByID = async (req, res, next) => {
  try {
    const result = await updateCardService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.moveToArchiveByCardID = async (req, res, next) => {
  try {
    const result = await moveToArchiveByCardIDService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.moveToTrashByID = async (req, res, next) => {
  try {
    const result = await moveToTrashByIDService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.restoreSingleCardFromArchive = async (req, res, next) => {
  try {
    const result = await restoreSingleCardFromArchiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.restoreFromTrashByID = async (req, res, next) => {
  try {
    const result = await restoreFromTrashByIDService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.moveCardlistToAcrhiveByStatus = async (req, res, next) => {
  try {
    const result = await moveCardlistToAcrhiveByStatusService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteCardByID = async (req, res, next) => {
  try {
    const result = await deleteCardByIDService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteAllTrashList = async (req, res, next) => {
  try {
    const result = await deleteAllTrashListService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.moveToTrashByStatus = async (req, res, next) => {
  try {
    const result = await moveToTrashByStatusService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


exports.createCard = async (req, res, next) => {
  try {
    const cardData = req.body;
    const newCard = new Card(cardData);
    const savedCard = await newCard.save();
    res.status(201).json({ status: 'success', data: savedCard });
  } catch (error) {
    next(error);
  }
};