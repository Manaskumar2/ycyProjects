const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    secureConnection: true,
    port: 465,
    auth: {
        user: 'admin@ycyclass.in',
        pass: process.env.PASS
    },
});

module.exports = transporter