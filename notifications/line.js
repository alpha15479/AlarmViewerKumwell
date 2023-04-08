const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const url_line_notification = "https://notify-api.line.me/api/notify";
const imageFile = 'https://play-lh.googleusercontent.com/oYaRzVHf7839DasFh92BTzwcskCetP2AQjV4qJcb53dQNr8iPTgaIK-Exd9Uao7kcyzB';

function line(req, res, next) {
    request({
        method: 'POST',
        uri: url_line_notification,
        header: {
            'Content-Type': 'multipart/form-data',
        },
        auth: {
            bearer: process.env.TOKEN,
        },
        form: {
            message: 'Notification from Alarm viewer!',
            imageThumbnail: imageFile,
            imageFullsize: imageFile
        },
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(err)
        } else {
            console.log(body)
            res.status(200).send({status: 200, message: "Sending line successfully"})
        }
    });
}

module.exports = { line };
