// categoryController.js

const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    const formattedCategories = categories.map(category => ({
      category_id: category.category_id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    }));

    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.query.id;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const formattedCategory = {
      category_id: category.category_id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    };

    return res.json(formattedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { category_id, name, description } = req.body;

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update({
      name,
      description,
      updated_at: new Date()
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.query.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
