const EFieldSensorService = require('../services/eFieldSensorService');
const { check, validationResult } = require('express-validator');

const validate = (method) => {
  switch (method) {
    case 'createEFieldSensor': {
      return [
        check('warning_point_id', 'warning_point_id is required').not().isEmpty(),
        check('e_field_name', 'e_field_name is required').not().isEmpty(),
        check('lat', 'lat is required').not().isEmpty(),
        check('lon', 'lon is required').not().isEmpty(),
      ];
    }
    default:
      return [];
  }
}

async function getAllEFieldSensors(req, res, next) {
  try {
    const eFieldSensors = await EFieldSensorService.getAllEFieldSensors();
    res.status(200).json(eFieldSensors);
  } catch (error) {
    next(error);
  }
}

async function getEFieldSensorById(req, res, next) {
  try {
    const eFieldSensor = await EFieldSensorService.getEFieldSensorById(req.params.id);
    if (!eFieldSensor) {
      return res.status(204).json({ message: 'E-Field Sensor not found' });
    }
    res.status(200).json(eFieldSensor);
  } catch (error) {
    next(error);
  }
}

async function createEFieldSensor(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newEFieldSensor = await EFieldSensorService.createEFieldSensor(req.body);
    res.status(201).json(newEFieldSensor);
  } catch (error) {
    next(error);
  }
}

async function updateEFieldSensorById(req, res, next) {
  try {
    const eFieldSensor = await EFieldSensorService.getEFieldSensorById(req.params.id);
    if (!eFieldSensor) {
      return res.status(204).json({ message: 'E field sensor not found' });
    }
    
    const updatedEFieldSensor = await EFieldSensorService.updateEFieldSensorById(req.params.id, req.body);
    res.status(200).json(updatedEFieldSensor);
  } catch (error) {
    next(error);
  }
}

async function deleteEFieldSensorById(req, res, next) {
  try {
    const eFieldSensor = await EFieldSensorService.getEFieldSensorById(req.params.id);
    if (!eFieldSensor) {
      return res.status(204).json({ message: 'E field sensor not found' });
    }

    const deletedEFieldSensor = await EFieldSensorService.deleteEFieldSensorById(req.params.id);
    res.status(204).json(deletedEFieldSensor);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validate,
  getAllEFieldSensors,
  getEFieldSensorById,
  createEFieldSensor,
  updateEFieldSensorById,
  deleteEFieldSensorById,
};