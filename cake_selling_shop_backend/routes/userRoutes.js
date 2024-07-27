const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.checkLogin);
router.post('/signup', userController.signUp);
router.get('/get-all-customers', userController.getAllCustomers);
router.get('/get-all-staffs', userController.getAllStaffs);
router.post('/add-new', userController.createUser);
router.get('/get-by-id', userController.getUserById);
router.put('/update', userController.updateUser);
router.put('/delete', userController.deleteUser);
router.put('/change-status', userController.toggleUserStatus);
router.get('/top-customer', userController.getTopCustomers);

module.exports = router;
