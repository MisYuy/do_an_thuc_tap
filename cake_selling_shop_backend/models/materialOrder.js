module.exports = (sequelize, DataTypes) => {
    const MaterialOrder = sequelize.define('MaterialOrder', {
        material_order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        material_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'materials', // Name of the target model
                key: 'material_id'  // Key in the target model that the foreign key references
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
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
        }
    }, {
        tableName: 'material_orders',
        timestamps: false
    });

    // Define associations here if needed
    MaterialOrder.associate = models => {
        MaterialOrder.belongsTo(models.Material, { foreignKey: 'material_id' });
    };

    return MaterialOrder;
};
