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

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await AlarmSoundService.getAlarmSoundById(id);
    if (!result || !result.file) {
      console.log(`No audio file found for id: ${id}`);
      return res.status(204).send();
    }

    const { file, name } = result;
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': file.length
    });

    res.write(file);
    res.end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
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