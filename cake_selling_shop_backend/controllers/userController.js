const db = require('../models');
const user = require('../models/user');
const User = db.User;
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute path to the directory where images will be stored
const imageDirectory = 'D:\\do_an_thuc_tap\\cake_selling_shop\\public\\images\\product';

// Ensure the directory exists
if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.checkLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      where: {
          email: email,
          password: password
      }
    });

    if(user) {
      res.json(user);
    }
    else {
      return res.status(404).json({ error: 'Login failed' });
    }

  } catch (error) {
    console.log("@@" + error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = {
      email,
      password,
      role: 'Customer',
      created_at: new Date(),
      updated_at: new Date()
    }

    const user = await User.create(newUser);

    if(user) {
      res.json(user);
    }
    else {
      return res.status(404).json({ error: 'Signup failed' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'customer',
        delete: 0
      },
    });
    if(users) {
      res.json(users);
    }
    else {
      return res.status(404).json({ error: 'Get all customers failed' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Get all customers failed' });
  }
};

exports.getAllStaffs = async (req, res) => {
  try {
    console.log('Fetching all staffs except customers...');
    
    const users = await User.findAll({
      where: {
        role: {
          [Op.not]: 'Customer'
        },
        delete: 0
      }
    });

    if(users) {
      res.json(users);
    }
  } catch (error) {
    console.error('Error fetching staffs:', error);
    res.status(500).json({ error: 'Get all staffs failed' });
  }
};

exports.createUser = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { email, password, full_name, phone_number, address, role, status } = req.body;
      const image = req.file ? req.file.filename : null;

      const user = await User.create({
        email,
        password,
        full_name,
        phone_number,
        address,
        role,
        status: 'active',
        image,
        delete: 0
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.query.id; // Assuming the ID is passed as a URL parameter

    const user = await User.findByPk(userId);

    if (user) {
      res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Get user by ID failed' });
  }
};

exports.updateUser = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { user_id, email, full_name, phone_number, address, role, status } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const image = req.file ? req.file.filename : user.image;
      console.log("Image filename:", image);

      await user.update({
        email: email,
      full_name: full_name,
      phone_number: phone_number,
      address: address,
      role: role,
      status: status,
      updated_at: new Date(),
      image
      });

      console.log("User updated successfully:", user);
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.query.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      delete: 1
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.query.id; // Assuming the ID is passed as a URL parameter
    const { status } = req.body; // Expecting the new status from the request body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the status value
    if (status !== 'active' && status !== 'deactive') {
      return res.status(400).json({ error: 'Invalid status value. Use "active" or "deactive".' });
    }

    // Update the user's status
    await user.update({
      status: status,
      updated_at: new Date()
    });

    console.log("User status updated successfully:", user);
    res.json(user);
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: error.message });
  }
};
