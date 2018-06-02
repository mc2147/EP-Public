let express = require('express');
let router = express.Router();
const nodemailer = require ('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail.com',
    secure: true,
    port: 465, //465 if secure is true, 587 if false
    auth: {
        user: 'matthewchan2147@gmail.com',
        pass: 'Wizard23!'
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.get("/", function (req, res) {
    res.json("email");
});

let testEmail = {
    from: '"Matthew Chan" <matthewchan2147@gmail.com>',
    to: 'matthewchan2147@gmail.com',
    subject: 'Test email',
    text: 'This is a test email for AlloyStrength Training'
};

let sendMail = function(input) {
    transporter.sendMail(input, (error,info) => {
        if(error) {
            console.log(error);
        }
        console.log('The message was sent!');
        console.log(info);
    }); 
}


router.get('/send-test', async function(req, res) {
    sendMail(testEmail);
    res.json("sending...");
})

module.exports = {
    sendMail,
    testEmail,
    router,
};