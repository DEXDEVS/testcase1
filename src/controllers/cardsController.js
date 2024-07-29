const {
  getCardsService,
  getArchivedCardListService,
  addCardsService,
  updateCardService,
  moveToArchiveByCardIDService,
  restoreSingleCardFromArchiveService,
  moveCardlistToAcrhiveByStatusService,
  deleteCardByIDService,
  deleteCardListByStatusService,
  getCardsByClientNameService,
} = require('../services/cardServices');

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
exports.restoreSingleCardFromArchive = async (req, res, next) => {
  try {
    const result = await restoreSingleCardFromArchiveService(req);
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

exports.deleteCardListByStatus = async (req, res, next) => {
  try {
    const result = await deleteCardListByStatusService(req);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
