const express = require('express');
const router = express.Router();
const EFieldSensorController = require('../controllers/eFieldSensor');

router.get('/', EFieldSensorController.getAllEFieldSensors);
router.get('/:id', EFieldSensorController.getEFieldSensorById);
router.post('/', EFieldSensorController.validate('createEFieldSensor'), EFieldSensorController.createEFieldSensor);
router.put('/:id', EFieldSensorController.validate('updateEFieldSensorById'), EFieldSensorController.updateEFieldSensorById);
router.delete('/:id', EFieldSensorController.deleteEFieldSensorById);

module.exports = router;