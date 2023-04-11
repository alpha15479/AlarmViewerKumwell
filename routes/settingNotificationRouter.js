const express = require('express');
const router = express.Router();
const SettingNotificationService = require('../services/settingNotificationService');

router.get('/', async (req, res, next) => {
  try {
    const settingNotifications = await SettingNotificationService.getAllSettingNotifications();
    res.status(200).json(settingNotifications);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const settingNotification = await SettingNotificationService.getSettingNotificationById(req.params.id);
    if (!settingNotification) {
      return res.status(204).json({ message: 'Setting notification data not found' });
    }
    res.status(200).json(settingNotification);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newSettingNotification = await SettingNotificationService.createSettingNotification(req.body);
    res.status(201).json(newSettingNotification);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedSettingNotification = await SettingNotificationService.updateSettingNotificationById(req.params.id, req.body);
    res.status(200).json(updatedSettingNotification);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedSettingNotification = await SettingNotificationService.deleteSettingNotificationById(req.params.id);
    res.status(204).json(deletedSettingNotification);
  } catch (error) {
    next(error);
  }
});

module.exports = router;