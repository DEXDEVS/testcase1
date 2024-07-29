const express = require('express');

const avatarUpload = require('../middlewares/user/avatarUpload');
const {
  addUserValidationHandler,
  addUserValidators,
} = require('../middlewares/user/userValidators');
const { addUser } = require('../controllers/usersController');
const loginController= require('../controllers/loginController');
const { checkLogin } = require('../middlewares/common/checkLogin');
const cardsController= require('../controllers/cardsController');
const dashboardController= require('../controllers/dashboardController');
const { getActivities } = require('../controllers/activitiesController');
const router = express.Router();

// process login
router.post('/login', loginController.login);
router.get('/refresh-token', checkLogin, loginController.getRefreshToken);

// logout
router.delete('/logout', loginController.logout);

// Dashboard api
router.get('/dashboard/totalCardsCount', checkLogin, dashboardController.getTotalCardsCount);
router.get('/dashboard/pieChartData', checkLogin, dashboardController.getPieChartData);
router.get(
  '/dashboard/nearestDeadlineOrders',
  checkLogin,
    dashboardController.getNearestDeadlineOrders
);
router.get('/dashboard/lineChartData', checkLogin, dashboardController.getLineChartData); //need to be fixed

// User router
router.post(
  '/users/create',
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
// User Activity
router.get('/activities', checkLogin, getActivities);

// Cards router
// Add
router.post('/cards/add', checkLogin, cardsController.addCards);
// Get
router.get('/cards', checkLogin, cardsController.getCards);
// get cards by client name
router.get('/cardlist/:clientNameOrCardNumber', checkLogin, cardsController.getCardsByClientName);
// Edit
  router.patch('/cards/update/:cardID', checkLogin, cardsController.updateCardByID);
// archived
router.get('/cards/archived', checkLogin, cardsController.getArchivedCardList);
router.put('/cards/movetoarchive/:cardID', checkLogin, cardsController.moveToArchiveByCardID);
router.patch(
  '/cards/archived/restoresinglecard/:cardID',
  checkLogin,
    cardsController.restoreSingleCardFromArchive
);
router.put(
  '/cardlist/movetoarchive/:status',
  checkLogin,
    cardsController.moveCardlistToAcrhiveByStatus
);
// Delete
router.delete('/cards/delete/:cardID', checkLogin, cardsController.deleteCardByID);
router.delete('/cardlist/delete/:status', checkLogin, cardsController.deleteCardListByStatus);

module.exports = router;
