module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        order_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Order', // name of the target model
                key: 'order_id'  // key in the target model
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Product', // name of the target model
                key: 'product_id'  // key in the target model
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'order_items',
        timestamps: false
    });
  
    OrderItem.associate = models => {
        OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
        // Add any other associations if necessary
    };
  
    return OrderItem;
};
