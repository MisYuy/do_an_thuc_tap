const { Material, MaterialOrder, MaterialUsage, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();

    const formattedMaterials = materials.map(material => ({
      material_id: material.material_id,
      name: material.name,
      description: material.description,
      quantity: material.quantity,
      created_at: material.created_at,
      updated_at: material.updated_at
    }));

    res.json(formattedMaterials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const materialId = req.query.id;

    const material = await Material.findByPk(materialId);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const formattedMaterial = {
      material_id: material.material_id,
      name: material.name,
      description: material.description,
      quantity: material.quantity,
      created_at: material.created_at,
      updated_at: material.updated_at
    };

    return res.json(formattedMaterial);
  } catch (error) {
    console.error('Error fetching material:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the material' });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { name, description, quantity } = req.body;

    const material = await Material.create({
      name,
      description,
      quantity,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { material_id, name, description, quantity } = req.body;

    if (!material_id) {
      return res.status(400).json({ error: 'Material ID is required' });
    }

    const material = await Material.findByPk(material_id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.update({
      name,
      description,
      quantity,
      updated_at: new Date()
    });

    res.json(material);
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.query.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.destroy();
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New function to create a material usage record
exports.createMaterialUsage = async (req, res) => {
  try {
    const { material_id, quantity_used } = req.body;

    if (!material_id || !quantity_used) {
      return res.status(400).json({ error: 'Material ID and quantity used are required' });
    }

    const material = await Material.findByPk(material_id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    if (material.quantity < quantity_used) {
      return res.status(400).json({ error: 'Insufficient material quantity' });
    }

    // Create a new material usage record
    const materialUsage = await MaterialUsage.create({
      material_id,
      quantity_used,
      usage_date: new Date()
    });

    // Update the material quantity
    await material.update({
      quantity: material.quantity - quantity_used,
      updated_at: new Date()
    });

    res.json(materialUsage);
  } catch (error) {
    console.error('Error creating material usage:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialStatistics = async (req, res) => {
  try {
    const { materialId, dateFrom, dateTo } = req.query;

    if (!materialId || !dateFrom || !dateTo) {
      return res.status(400).json({ error: 'Material ID, dateFrom, and dateTo are required' });
    }

    // Fetch the material to get the current stock quantity
    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const currentStock = material.quantity;

    // Fetch the quantity of material ordered and completed within the date range
    const orders = await MaterialOrder.findAll({
      where: {
        material_id: materialId,
        status: 'completed',
        created_at: {
          [Op.between]: [new Date(dateFrom), new Date(dateTo)]
        }
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('quantity')), 'totalOrdered']]
    });

    const totalOrdered = orders[0].dataValues.totalOrdered || 0;

    // Fetch the quantity of material used within the date range
    const usages = await MaterialUsage.findAll({
      where: {
        material_id: materialId,
        usage_date: {
          [Op.between]: [new Date(dateFrom), new Date(dateTo)]
        }
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('quantity_used')), 'totalUsed']]
    });

    const totalUsed = usages[0].dataValues.totalUsed || 0;

    // Return the statistics
    res.json({
      currentStock,
      totalOrdered,
      totalUsed
    });
  } catch (error) {
    console.error('Error fetching material statistics:', error);
    res.status(500).json({ error: error.message });
  }
};
