const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const {
        email,
        subject,
        message
    } = options;


    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const info = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject,
        text: message
    };



    const finialInfo = await transporter.sendMail(info);
    console.log(`Message send: ${finialInfo.messageId}`.blue);
};


module.exports = sendEmail;