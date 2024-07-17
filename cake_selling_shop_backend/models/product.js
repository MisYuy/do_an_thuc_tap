module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
      product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock_quantity: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
  }, {
      tableName: 'products',
      timestamps: false
  });

  Product.associate = models => {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.belongsToMany(models.Promotion, {
          through: 'product_promotions',
          foreignKey: 'product_id',
          timestamps: false  // Disable timestamps for the join table
      });
      Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
  };

  return Product;
};