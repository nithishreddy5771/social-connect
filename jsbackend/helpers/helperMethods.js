
const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@social-connect.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "ksrinivasreddy4444testing@gmail.com",
            pass: "qsuc vvsy yzxm vapk"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(error => console.log(`Problem sending email: ${error}`))
    );
};