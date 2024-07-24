module.exports = (sequelize, DataTypes) => {
    const ProductPromotion = sequelize.define('ProductPromotion', {
        product_promotion_id: {  // Match the column name in the database
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {  // Match the column name in the database
            type: DataTypes.INTEGER,
            allowNull: false
        },
        promotion_id: {  // Match the column name in the database
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'product_promotions',
        timestamps: true,  // Enable timestamps for this table
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ProductPromotion;
};
