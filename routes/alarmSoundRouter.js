const express = require('express');
const router = express.Router();
const AlarmSoundService = require('../services/alarmSoundService');
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res, next) => {
  try {
    const AlarmSounds = await AlarmSoundService.getAllAlarmSounds();
    res.status(200).json(AlarmSounds);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const AlarmSounds = await AlarmSoundService.getAlarmSoundById(req.params.id);
    res.status(200).json(AlarmSounds);
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.single('fileName'), async (req, res, next) => {
  try {
    const alarmSoundData = {
      name: req.file.originalname,
      type: req.file.mimetype,
      file: req.file.buffer,
      sound_name: req.body.sound_name
    };
    const newAlarmSound = await AlarmSoundService.createAlarmSound(alarmSoundData);
    res.status(201).json(newAlarmSound);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', upload.single('fileName'), async (req, res, next) => {
  try {
    let newAlarmSoundData = {
      sound_name: req.body.sound_name
    };
    
    if (req.file) {
      newAlarmSoundData = {
        name: req.file.originalname,
        type: req.file.mimetype,
        file: req.file.buffer,
        sound_name: req.body.sound_name
      };
    } 
    
    const updatedAlarmSound = await AlarmSoundService.updateAlarmSoundById(req.params.id, newAlarmSoundData);
    res.status(200).json(updatedAlarmSound);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedAlarmSound = await AlarmSoundService.deleteAlarmSoundById(req.params.id);
    res.status(204).json(deletedAlarmSound);
  } catch (error) {
    next(error);
  }
});

module.exports = router;