const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth'); 

router.get('/check-exists', userController.checkEmailExists);
router.post('/login', userController.checkLogin);
router.post('/signup', userController.signUp);

router.use(authenticateToken);

router.post('/check-password', userController.checkPassword);
router.get('/get-all-customers', userController.getAllCustomers);
router.get('/get-all-staffs', userController.getAllStaffs);
router.post('/add-new', userController.createUser);
router.get('/get-by-id', userController.getUserById);
router.put('/update', userController.updateUser);
router.put('/delete', userController.deleteUser);
router.put('/change-status', userController.toggleUserStatus);
router.get('/top-customer', userController.getTopCustomers);
router.post('/change-password', userController.changePassword);

module.exports = router;
