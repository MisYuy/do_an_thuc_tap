const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Promotion = require('./promotion')(sequelize, DataTypes);
db.ProductPromotion = require('./productPromotion')(sequelize, DataTypes);
db.CartItem = require('./cartItem')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItems')(sequelize, DataTypes);
db.Material = require('./material')(sequelize, DataTypes);
db.MaterialOrder = require('./materialOrder')(sequelize, DataTypes);
db.MaterialUsage = require('./materialUsage')(sequelize, DataTypes);
db.Review = require('./review')(sequelize, DataTypes);

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});

module.exports = db;
