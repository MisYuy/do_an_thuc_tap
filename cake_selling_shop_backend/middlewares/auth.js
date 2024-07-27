// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const SECRET_KEY = config[env].SECRET_KEY; // Ensure you have a secret key in your config

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
