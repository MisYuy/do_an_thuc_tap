const bcrypt = require('bcrypt');
const db = require('../models');
const user = require('../models/user');
const User = db.User;
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const SECRET_KEY = config[env].SECRET_KEY;
const jwt = require('jsonwebtoken');

// Absolute path to the directory where images will be stored
const imageDirectory = 'D:\\do_an_thuc_tap\\cake_selling_shop\\public\\images\\avatar';

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

exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query; // Assuming the email is passed as a query parameter

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({
      where: {
        email: email,
        delete: 0
      }
    });

    if (user) {
      return res.json({ exists: true, message: 'Email already exists' });
    } else {
      return res.json({ exists: false, message: 'Email is available' });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.status(500).json({ error: 'Error checking email existence' });
  }
};

exports.checkPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      where: {
          email: email,
          delete: 0
      }
    });

    if(user && await bcrypt.compare(password, user.password)) {
      res.json({ result: true, user: user });
    }
    else {
      res.json({ result: false });
    }

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      where: {
          email: email,
          status: 'active',
          delete: 0
      }
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    
    console.log(await bcrypt.compare(password, user.password));
    if(user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

      // Return the user and token
      res.json({ user, token });
    }
    else {
      return res.status(404).json({ error: 'Login failed' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    const newUser = {
      email,
      password: hashedPassword,
      role: 'customer',
      status: 'active',
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const image = req.file ? req.file.filename : null;

      const user = await User.create({
        email,
        password: hashedPassword,
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

const { Order, sequelize  } = require('../models');

exports.getTopCustomers = async (req, res) => {
  try {
    const { dateFrom, dateTo, limit } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
    }

    const topCustomers = await Order.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_spent']
      ],
      where: {
        created_at: {
          [Op.between]: [new Date(dateFrom), new Date(dateTo)]
        }
      },
      group: ['user_id'],
      order: [[sequelize.literal('total_spent'), 'DESC']],
      limit: parseInt(limit, 10) || 10, // Default limit to 10 if not specified
      include: [
        {
          model: User,
          attributes: ['user_id', 'email', 'full_name', 'phone_number', 'address']
        }
      ]
    });

    res.json(topCustomers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add change password function
exports.changePassword = async (req, res) => {
  try {
    const { user_id, old_password, new_password } = req.body;

    if (!user_id || !old_password || !new_password) {
      return res.status(400).json({ error: 'User ID, old password, and new password are required' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
};
