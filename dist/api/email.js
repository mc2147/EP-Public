'use strict';

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail.com',
    secure: true,
    port: 465, //465 if secure is true, 587 if false
    auth: {
        user: 'electrumperformance@gmail.com',
        pass: 'sdscllc123'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// transporter = nodemailer.createTransport({
//     service: 'Godaddy',
//     secure: true,
//     host: 'smtpout.secureserver.net',
//     port: 465,
//     auth: {
//         user: 'bryce@electrumperformance.com',
//         pass: 'password127!!'
//     },
// });


// let transporter = nodemailer.createTransport({    
//     service: 'Godaddy',
//     // host: "smtpout.secureserver.net",  
//     // secureConnection: true,
//     // secure:true,
//     // port: 465,
//     // secure:false,
//     secureConnection: false,
//     port: 587,
//     auth: {
//         user: "bryce@electrumperformance.com",
//         pass: "password127!!" 
//     }
// });

router.get("/", function (req, res) {
    res.json("email");
});

var testEmail = {
    from: '"Electrum Performance" <electrumperformance@gmail.com>',
    to: 'matthewchan2147@gmail.com',
    subject: 'Test email',
    text: 'This is a test email for AlloyStrength Training'
};

var sendMail = function sendMail(input) {
    console.log('SENDING TEST MAIL');
    transporter.sendMail(input, function (error, info) {
        console.log('line 44');
        if (error) {
            console.log(error);
            return {
                success: false,
                error: true,
                errorBody: error
            };
        }
        console.log('The message was sent!');
        console.log(info);
        return {
            success: true,
            error: false,
            errorBody: null
        };
    });
};

router.get('/send-test', async function (req, res) {
    sendMail(testEmail);
    res.json("sending...");
});

module.exports = {
    sendMail: sendMail,
    testEmail: testEmail,
    router: router
};