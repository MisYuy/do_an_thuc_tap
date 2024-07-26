module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
        material_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        }
    }, {
        tableName: 'materials',
        timestamps: false
    });

    // Define associations here if needed
    Material.associate = models => {
        // Example association
        // Material.belongsTo(models.SomeOtherModel, {
        //     foreignKey: 'some_other_model_id',
        //     as: 'someOtherModel'
        // });
    };

    return Material;
};
