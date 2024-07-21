const db = require('../models');
const user = require('../models/user');
const User = db.User;
const { Op } = require('sequelize');

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
        role: 'customer'
      }
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
        }
      }
    });

    console.log('Query executed. Users found:', users.length);

    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: 'No staff found' });
    }
  } catch (error) {
    console.error('Error fetching staffs:', error);
    res.status(500).json({ error: 'Get all staffs failed' });
  }
};


exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.update(req.body);
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.destroy();
  res.json({ message: 'User deleted' });
};
