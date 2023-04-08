const nodeMailer = require('nodemailer')
const users = require('./db')

//รูปแบบการส่งอีเมล มีหัวข้อ มีรูป มีรายละเอียด
const html = `
    <h3>Lightning Warning!</h3>
    <p>There is lightning near your location.</p>
    <img src="cid:kumwell@gmail.info" width="400">
`;

async function test(req, res, next) {
    const transporter = nodeMailer.createTransport({
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wichuda.ph.62@ubu.ac.th',
            pass: 'hwvY2265'
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });

    //ตรวจสอบว่าผู้ใช้เลือกการแจ้งเตือนฟ้าผ่าแบบไหน อันนี้เลือกเตือนทั้งหมด กับเตือนอีเมล
    let e = []
    for (let i = 0; i < users.length; i++) {
        if ((users[i]['all'] == true) | (users[i]['emailNotify'] == true)){
            e.push(users[i]['email']) //push email ผู้ใช้เข้าไป
            console.log("Warning :", users[i]['name'])
        }
    }
    console.log("Success", e)

    const info = await transporter.sendMail({
        from: 'Kumwell Lightning Alarm <kumwell.info.notification>',
        to: e, //เอาลิสต์ e ที่เรา append email เข้าไปมาแทน
        subject: 'This is notification from kumwell lightning alarm!',
        html: html,
        attachments: [{ //แนบไฟล์ที่ต้องการส่วไปพร้อมกับอีเมล
            filename: 'logo1.png',
            path: './src/logo1.png',
            cid: 'kumwell@gmail.info'
        }]
    })
    
    console.log("Message sent" + info.messageId)
    res.status(200).send({status: 200, message: "Sending email successfully"})//ส่งเสร็จให้แสดง status 200 และเมสเสจ
    // res.json('sending email successfully')
    // res.send("HTTP POST request sent to the webhook URL!")
}

module.exports = { test };