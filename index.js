require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    const { to, subject, text } = event;

    console.log('Passo 1');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    };

    console.log('Passo 2');
    
    try {
        console.log('Testando conexão SMTP...');
        await transporter.verify();
        console.log('Conexão SMTP OK, enviando e-mail...');
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
        return { statusCode: 200, body: 'E-mail enviado com sucesso!' };
    } catch (err) {
        console.log('Erro ao enviar e-mail:', err);
        return { statusCode: 500, body: 'Erro ao enviar e-mail: ' + err.message };
    }
};
