module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
          },
    }, {
        tableName: 'orders',
        timestamps: false
    });

    Order.associate = models => {
        Order.belongsTo(models.User, { foreignKey: 'user_id' });
        Order.hasMany(models.OrderItem, { foreignKey: 'order_id' }); // Add this line
    };

    return Order;
};
