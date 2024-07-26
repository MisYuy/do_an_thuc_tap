const { MaterialOrder, Material } = require('../models');

exports.getAllMaterialOrders = async (req, res) => {
  try {
    const materialOrders = await MaterialOrder.findAll({
      include: [{ model: Material }]
    });

    res.json(materialOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialOrderById = async (req, res) => {
  try {
    const materialOrderId = req.query.id;

    const materialOrder = await MaterialOrder.findByPk(materialOrderId, {
      include: [{ model: Material }]
    });

    if (!materialOrder) {
      return res.status(404).json({ error: 'Material Order not found' });
    }

    res.json(materialOrder);
  } catch (error) {
    console.error('Error fetching material order:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the material order' });
  }
};

exports.createMaterialOrder = async (req, res) => {
  try {
    const { material_id, quantity, status } = req.body;

    const materialOrder = await MaterialOrder.create({
      material_id,
      quantity,
      status,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json(materialOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMaterialOrder = async (req, res) => {
  try {
    const { material_order_id, material_id, quantity, status } = req.body;

    if (!material_order_id) {
      return res.status(400).json({ error: 'Material Order ID is required' });
    }

    const materialOrder = await MaterialOrder.findByPk(material_order_id);
    if (!materialOrder) {
      return res.status(404).json({ error: 'Material Order not found' });
    }

    const previousStatus = materialOrder.status;

    await materialOrder.update({
      material_id,
      quantity,
      status,
      updated_at: new Date()
    });

    if (status === 'completed' && previousStatus !== 'completed') {
      const material = await Material.findByPk(material_id);
      if (material) {
        await material.update({
          quantity: material.quantity - quantity,
          updated_at: new Date()
        });
      }
    } else if (previousStatus === 'completed' && status !== 'completed') {
      const material = await Material.findByPk(material_id);
      if (material) {
        await material.update({
          quantity: material.quantity + quantity,
          updated_at: new Date()
        });
      }
    }

    res.json(materialOrder);
  } catch (error) {
    console.error('Error updating material order:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMaterialOrder = async (req, res) => {
  try {
    const materialOrder = await MaterialOrder.findByPk(req.query.id);
    if (!materialOrder) {
      return res.status(404).json({ error: 'Material Order not found' });
    }

    if (materialOrder.status === 'completed') {
      const material = await Material.findByPk(materialOrder.material_id);
      if (material) {
        await material.update({
          quantity: material.quantity + materialOrder.quantity,
          updated_at: new Date()
        });
      }
    }

    await materialOrder.destroy();
    res.json({ message: 'Material Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
