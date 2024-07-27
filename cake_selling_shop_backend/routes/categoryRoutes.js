const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

// Route to get all categories
router.get('/get-all', categoryController.getAllCategories);

// Route to get a category by ID
router.get('/get-by-id', categoryController.getCategoryById);

// Route to create a new category
router.post('/add-new', categoryController.createCategory);

// Route to update an existing category
router.put('/update', categoryController.updateCategory);

// Route to delete a category
router.delete('/delete', categoryController.deleteCategory);

module.exports = router;
