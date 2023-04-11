const express = require('express');
const router = express.Router();
const EFieldSensorService = require('../services/eFieldSensorService');

router.get('/', async (req, res, next) => {
  try {
    const eFieldSensors = await EFieldSensorService.getAllEFieldSensors();
    res.status(200).json(eFieldSensors);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const eFieldSensors = await EFieldSensorService.getEFieldSensorById(req.params.id);
    if (!eFieldSensors) {
      return res.status(204).json({ message: 'E-Field Sensor not found' });
    }
    res.status(200).json(eFieldSensors);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newEFieldSensor = await EFieldSensorService.createEFieldSensor(req.body);
    res.status(201).json(newEFieldSensor);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedEFieldSensor = await EFieldSensorService.updateEFieldSensorById(req.params.id, req.body);
    res.status(200).json(updatedEFieldSensor);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedEFieldSensor = await EFieldSensorService.deleteEFieldSensorById(req.params.id);
    res.status(204).json(deletedEFieldSensor);
  } catch (error) {
    next(error);
  }
});

module.exports = router;