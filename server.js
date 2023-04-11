const express = require('express');
const app = express();
const settingNotificationRouter = require('./routes/settingNotificationRouter');
const eFieldSensorRouter = require('./routes/eFieldSensorRouter');
const alarmSoundRouter = require('./routes/alarmSoundRouter');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/setting-notifications', settingNotificationRouter);
app.use('/api/v1/e-field-sensor', eFieldSensorRouter);
app.use('/api/v1/alarm-sound', alarmSoundRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' , err});
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});