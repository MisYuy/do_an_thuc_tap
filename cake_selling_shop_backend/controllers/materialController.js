// materialController.js

const { Material } = require('../models');

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
