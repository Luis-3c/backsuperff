const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const EMAIL_SECRET_KEY = 'ago1984alisuperff9052020';
const db = require('../../config/db');
const props = require('../../config/properties');

exports.sendMail = (destino, subject, content) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secure: false,
        port: 587,
        auth: {
            user: 'gerard95@live.com.mx',
            pass: '230507Helio-3'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    /* InnerHTML = `<h2>Welcome to Superfly Fitness</h2>
                <p>please use this link to verify your account</p>`; */

    try{
    transporter.sendMail({
        from: "'Superfly Fitness' <gerard95@live.com.mx>",
        /* to: 'l.gerad95@gmail.com',
        subject: 'prueba',
        text: 'hello world' */
        to: destino,
        subject: subject,
        html: content
    });
    
    return 1;
    }catch(error){
        return 0;
    }
};

exports.generateMailToken = (iduser)=>{
    const expiresIn = 48 * 60 * 60;
    return jwt.sign({id: iduser}, EMAIL_SECRET_KEY, {expiresIn: expiresIn});
}

exports.verifyToken = (req, res) => {
    try{
        decoded = jwt.verify(req.params.token, EMAIL_SECRET_KEY);
        /* console.log('USER ID: ', decoded.id) */
        }catch(error){
            return res.status(401).json({response: 'Error during email verification'});
        }
        db.query('update users set email_confirmed = 1 where id = ' + decoded.id, (err, result)=>{
            if(err) return res.status(500).send('Server error');
            /* res.json({response: 'Your account has been successfully verified.'}); */
            res.redirect(`${props.FRONTEND_URL}/verification`);

        });
    
}