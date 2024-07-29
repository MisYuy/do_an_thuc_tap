module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
    }, {
      tableName: 'cart_items',
      indexes: [
        {
          fields: ['user_id']
        },
        {
          fields: ['product_id']
        },
        {
          unique: true,
          fields: ['product_id', 'user_id']
        }
      ],
      timestamps: false
    });
  
    CartItem.associate = models => {
      CartItem.belongsTo(models.User, { foreignKey: 'user_id' });
      CartItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return CartItem;
  };
  