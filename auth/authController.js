const User = require('./authModel');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '230507superff9052020';
const nodemailer = require('nodemailer');

exports.createUser = (req,res)=>{
    /* console.log('llega a createuser');
    console.log(req.body); */
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        born_date: req.body.born_date,
    }

    /* const q = "insert into users (id, first_name, last_name, email, password, born_date) values(NUll,'"+newUser.first_name+
    "','"+newUser.last_name+"','"+newUser.email+"','"+
    newUser.password + "','" + newUser.born_date + "')";
    console.log('query: ', q); */

    db.query("insert into users (id, first_name, last_name, email, password, born_date) values(NUll,'"+
            newUser.first_name+"','"+newUser.last_name+"','"+newUser.email+"','"+
            newUser.password + "','" + newUser.born_date + "')", (err, response) =>{
                if(err) return res.status(500).send('Server error');
                res.json({response: 'Successfully registered, now please log in'});
            });

}

exports.loginUser = (req,res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    };

    db.query("select * from users where email = '" + userData.email + "'", (err, user)=>{
        if(err) return res.status(500).send('Server error');
        if(!user){
            //email no existe
            res.status(409).send({response: "this email is not registered"});
        }else{
            const resultPasword = bcrypt.compareSync(userData.password,user[0].password);
            if(resultPasword){
                const expiresIn = 1 * 1 * 60;
                const accessToken = jwt.sign({id: user[0].id}, SECRET_KEY, {expiresIn: expiresIn});
                res.json({
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    email: user[0].email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                });
            } else {
                //password incorrecta
                res.status(409).json({response: 'mail or password incorrect'});
            }
        }
    });
}


exports.validarToken = (req, res, next) => {
    try{
        decoded = jwt.verify(req.headers.authorization, SECRET_KEY);
        req.iduser = decoded.id;
        return next();
    }catch(e){
        res.status(401).json();
    }
}

exports.getProfileInfo = (req, res) => {
    db.query("select * from users where id = " + req.iduser, (err, user)=>{
        if(err) res.status(500).send('Server error');
        if(user){
            res.json({
                first_name: user[0].first_name,
                last_name: user[0].last_name,
                email: user[0].email
            })
        }
    })
}

exports.sendMail = (req, res) => {
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

    InnerHTML = `<h2>Welcome to Superfly Fitness</h2>
                <p>please use this link to verify your account</p>`;

    transporter.sendMail({
        from: "'Superfly Fitness' <gerard95@live.com.mx>",
        to: 'l.gerad95@gmail.com',
        subject: 'prueba',
        text: 'hello world'
    });
    
    res.send('received');
};

//we have sent a confirmation email. Click the link in the email to verify your email address.
//before subscribing you need to confirm your email.
//send email confirmation again 