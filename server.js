const users = require('./notifications/db')
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const email = require("./notifications/email.js")  
const line = require("./notifications/line.js")  

const multer = require('multer');
const upload = multer();
// const upload = multer({ dest: 'uploads/' });

const player = require('play-sound')();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! Node.js");
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});

app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/users/:id', (req, res) => {
    res.json(users.find(user => user.id === Number(req.params.id)))
})

app.post('/sending-email', (req, res) => {
    email.test(req, res)
})

app.post('/sending-line', (req, res) => {
    line.line(req, res)
})

// automatic create table
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kumwell'
});

connection.connect(function(err) {
  if (err) {
    console.log('Error connecting to MySQL database: ' + err)
    return;
  };
  console.log('Connected to MySQL server');
});

// Setting notification data
const sql = `CREATE TABLE IF NOT EXISTS setting_notifications (
  id INT(11) NOT NULL AUTO_INCREMENT,
  custom_key VARCHAR(255) NOT NULL,
  text VARCHAR(255) NOT NULL,
  email_notification BOOLEAN DEFAULT 0,
  line_notification BOOLEAN DEFAULT 0,
  iot_notification BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

connection.query(sql, function(err, result) {
  if (err) throw err;
  console.log('Setting_notifications table created successfully');
});

//CREATE
app.post('/api/v1/setting-notifications/create', (req, res) => {
  const {custom_key, text, email_notification, line_notification, iot_notification} = req.body;

  try {
    connection.query(
      "INSERT INTO setting_notifications(custom_key, text, email_notification, line_notification, iot_notification) VALUES(?, ?, ?, ?, ?)",
      [custom_key, text, email_notification, line_notification, iot_notification],

      (err, results, fields) => {
        if (err) {
          console.log("Error inserting into database", err);
          return res.status(400).send();
        }
        return res.status(201).json({ messages: "New setting data successfully created!!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
})

//READ
app.get('/api/v1/setting-notifications', (req, res) => {
  try {
    connection.query("SELECT * FROM setting_notifications", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results)
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//READ single id
app.get('/api/v1/setting-notifications/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query("SELECT * FROM setting_notifications WHERE id = ?", [id], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results)
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//UPDATE
app.put('/api/v1/setting-notifications/update/:id', (req, res) => {
  const id = req.params.id;
  const { newCustomKey, newText, newLine, newEmail, newIot } = req.body;

  try {
    connection.query("UPDATE setting_notifications SET custom_key = ?, text = ?, email_notification = ?, line_notification = ?, iot_notification = ? WHERE id = ?", 
    [newCustomKey, newText, newLine, newEmail, newIot, id], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json({ messages: "Updated setting data successfully!!" })
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//DELETE
app.delete('/api/v1/setting-notifications/delete/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "DELETE FROM setting_notifications WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log("Error deleting setting data", err);
          return res.status(400).send();
        }
        return res.status(200).json({ message: "Data deleted successfully!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
})

// E FIELD SENSOR SETTING
const sqlSensor = `CREATE TABLE IF NOT EXISTS e_field_sensor (
  id INT(11) NOT NULL AUTO_INCREMENT,
  warning_point_id VARCHAR(255) NOT NULL,
  e_field_name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 4) NOT NULL,
  lon DECIMAL(10, 4) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

connection.query(sqlSensor, function(err, result) {
  if (err) throw err;
  console.log('E_field_sensor table created successfully');
});

//CREATE
app.post('/api/v1/e-field-sensor/create', (req, res) => {
  const {warning_point_id, e_field_name, lat, lon} = req.body;

  try {
    connection.query(
      "INSERT INTO e_field_sensor(warning_point_id, e_field_name, lat, lon) VALUES(?, ?, ?, ?)",
      [warning_point_id, e_field_name, lat, lon],

      (err, results, fields) => {
        if (err) {
          console.log("Error inserting into database", err);
          return res.status(400).send();
        }
        return res.status(201).json({ messages: "New E field sensor data successfully created!!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
})

//READ
app.get('/api/v1/e-field-sensor', (req, res) => {
  try {
    connection.query("SELECT * FROM e_field_sensor", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results)
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//READ single id
app.get('/api/v1/e-field-sensor/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query("SELECT * FROM e_field_sensor WHERE id = ?", [id], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results)
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//UPDATE
app.put('/api/v1/e-field-sensor/update/:id', (req, res) => {
  const id = req.params.id;
  const { newWarningPointId, newEFieldName, newLat, newLon } = req.body;

  try {
    connection.query("UPDATE e_field_sensor SET warning_point_id = ?, e_field_name = ?, lat = ?, lon = ? WHERE id = ?", 
    [newWarningPointId, newEFieldName, newLat, newLon, id], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json({ messages: "Updated E Field setting data successfully!!" })
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//DELETE
app.delete('/api/v1/e-field-sensor/delete/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "DELETE FROM e_field_sensor WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log("Error deleting setting data", err);
          return res.status(400).send();
        }
        return res.status(200).json({ message: "Data deleted successfully!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
})

const test = `CREATE TABLE IF NOT EXISTS lightning_data (
  id INT(11) NOT NULL AUTO_INCREMENT,
  custom_key VARCHAR(255) NOT NULL,
  lightning_values VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

const user = `CREATE TABLE IF NOT EXISTS user (
  id INT(11) NOT NULL AUTO_INCREMENT,
  custom_key VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

connection.query(user, test, function(err, result) {
  if (err) throw err;
  console.log('Data table created successfully');
});

const sound = `CREATE TABLE IF NOT EXISTS alarm_sound (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  file LONGBLOB,
  sound_name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)`;

connection.query(sound, function(err, result) {
  if (err) throw err;
  console.log('Sound table created successfully');
});

//CREATE
app.post('/api/v1/alarm-sound/add', upload.single('fileName'), async (req, res) => {
  
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const { originalname, mimetype, buffer } = req.file;
  const sound_name = req.body.sound_name;

  try {
    connection.query(
      "INSERT INTO alarm_sound (name, type, file, sound_name) VALUES (?, ?, ?, ?)",
      [originalname, mimetype, buffer, sound_name],
  
      (err, results, fields) => {
        if (err) {
          console.log("Error inserting into database", err);
          return res.status(400).json({ messages: "Something went wrong", err });
        }
        return res.status(201).json({ messages: "Sound file successfully uploaded!!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//READ
app.get('/api/v1/alarm-sound', (req, res) => {
  try {
    connection.query("SELECT name, sound_name FROM alarm_sound", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results)
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//READ BY ID
app.get('/api/v1/alarm-sound/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query("SELECT file, name FROM alarm_sound WHERE id = ?", [id], (err, results, fields) => {
      if (err) {
        console.error('Error querying audio file from MySQL table: ', err);
        res.status(500).json({ messages: "Error querying audio file from MySQL table!" });
        return;
      }
      if (results.length === 0) {
        console.error('No results found for audio file: ', id);
        res.status(404).json({ messages: "Audio file not found!" });
        return;
      }

      const audioData = results[0].file;

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.length
      });

      res.write(audioData);
      res.end();
    })
  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
});

//UPDATE
app.put('/api/v1/alarm-sound/update/:id', upload.single('fileName'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const id = req.params.id;
  const { originalname, mimetype, buffer } = req.file;
  const sound_name = req.body.sound_name;

  try {
    connection.query("UPDATE alarm_sound SET name = ?, type = ?, file = ?, sound_name = ? WHERE id = ?", 
    [originalname, mimetype, buffer, sound_name, id], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ messages: "Something went wrong", err });
      }
      res.status(200).json({ messages: "Updated alarm sound successfully!!" })
    })

  } catch(err) {
    console.log(err);
    return res.status(500).send();
  }
})

//DELETE
app.delete('/api/v1/alarm-sound/delete/:id', (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "DELETE FROM alarm_sound WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          console.log("Error deleting setting data", err);
          return res.status(400).send();
        }
        return res.status(200).json({ message: "Data deleted successfully!" });
      }
    )
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
})
