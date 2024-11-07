const express = require('express');

const avatarUpload = require('../middlewares/user/avatarUpload');
const {
  addUserValidationHandler,
  addUserValidators,
} = require('../middlewares/user/userValidators');
const { addUser } = require('../controllers/usersController');
const loginController = require('../controllers/loginController');
const { checkLogin } = require('../middlewares/common/checkLogin');
const excelFileUpload = require('../middlewares/excelFileUpload')
const excelFileUploadController = require('../controllers/excelFileUploadController')
const cardsController = require('../controllers/cardsController');
const dashboardController = require('../controllers/dashboardController');
const { getActivities } = require('../controllers/activitiesController');
const Order = require('../models/Order');
const { route } = require('../../app');
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
// Upload file
router.post('/cards/uploadFile', checkLogin, excelFileUpload, excelFileUploadController.getExcelData);
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
//Trash
router.get('/cards/trashCardList', checkLogin, cardsController.getTrashCardList)
router.put('/cards/moveToTrash/:cardID', checkLogin, cardsController.moveToTrashByID);
router.put('/cards/moveToTrashByStatus/:status', checkLogin, cardsController.moveToTrashByStatus);
router.patch('/cards/restoreFromTrash/:cardID', checkLogin, cardsController.restoreFromTrashByID);

// Delete
router.delete('/cards/delete/:cardID', checkLogin, cardsController.deleteCardByID);
router.delete('/trashList/deleteAll', checkLogin, cardsController.deleteAllTrashList);


router.get('/order', async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});
// Define the new order POST API
router.post('/order', async (req, res) => {
  const {
    customerName,
    installationDeadline,
    orderDate,
    type,
    phone1,
    phone2,
    address
  } = req.body;
  console.log(req.body);

  if (!customerName || !installationDeadline || !orderDate || !type || !phone1 || !phone2 || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const order = new Order({
    customerName,
    installationDeadline,
    orderDate,
    type,
    phone1,
    phone2,
    address
  });

  await order.save();

  res.status(201).json({
    message: 'Order created successfully',
    order: {
      customerName,
      installationDeadline,
      orderDate,
      type,
      phone1,
      phone2,
      address
    }
  });
});

module.exports = router;
