module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define('Promotion', {
        promotion_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        discount_percentage: DataTypes.DECIMAL,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        tableName: 'promotions',
        timestamps: false
    });

    Promotion.associate = models => {
        Promotion.belongsToMany(models.Product, {
            through: 'product_promotions',
            foreignKey: 'promotion_id',
            timestamps: false  // Disable timestamps for the join table
        });
    };

    return Promotion;
};