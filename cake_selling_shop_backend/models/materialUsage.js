module.exports = (sequelize, DataTypes) => {
    const MaterialUsage = sequelize.define('MaterialUsage', {
        usage_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        material_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity_used: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usage_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'material_usages',
        timestamps: false
    });

    MaterialUsage.associate = models => {
        MaterialUsage.belongsTo(models.Material, { foreignKey: 'material_id' });
    };

    return MaterialUsage;
};
