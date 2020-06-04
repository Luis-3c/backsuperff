const User = require('./authModel');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '230507superff9052020';
const mailer = require('../controllers/emails/emailController');
const props = require('../config/properties');

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

    db.query("insert into users (id, first_name, last_name, email, password, born_date) values(?,?,?,?,?,?)",
    [null, newUser.first_name,newUser.last_name,newUser.email,newUser.password,newUser.born_date], (err, response) =>{
                if(err) {
                    if(err.errno === 1062){
                        return res.status(500).send({response: 'This email is already registered'});
                    } else {
                    console.log('ERROR: ', err);
                    return res.status(500).send({response: 'Server error'});
                  }
                }

                db.query("select * from users where email = '" + newUser.email + "'", (err, user)=>{
                    if(err) return res.status(500).send({response: 'Server error'});
                    const mailToken = mailer.generateMailToken(user[0].id);
                    console.log('mail token: ', mailToken);
                    InnerHTML = `<h2>Welcome to Superfly Fitness</h2>
                                 <p>please use this link to verify your account: <a href="${props.BACKEND_URL}/verify/${mailToken}" target="_blank">CLICK HERE</a></p>`;
                    if (mailer.sendMail(user[0].email, 'verification email', InnerHTML) === 1){
                        res.json({response: 'Successfully registered, we have sent a confirmation email. Click the link in the email to verify your email address.'});
                    }else{
                        return res.jstatus(400).send('Error sending confirmation email')
                    }
                })
            });

}

exports.loginUser = (req,res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    };

    db.query("select * from users where email = ?",[userData.email], (err, user)=>{
        if(err) return res.status(500).send({response: "Server error"});
        if(!user[0]){
            //email no existe
            res.status(409).send({response: "this email is not registered"});
        }else{
            const resultPasword = bcrypt.compareSync(userData.password,user[0].password);
            if(resultPasword){
                const expiresIn = 1 * 60 * 60;
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


exports.validarToken = (req, res, next) => {// validar el token que viene por cabecera en cada petición y continuar con la siguiente función
    try{
        console.log('token: ', req.headers.authorization);
        decoded = jwt.verify(req.headers.authorization, SECRET_KEY);        
        req.iduser = decoded.id;
        return next();
    }catch(e){
        res.status(401).json();
    }
}

exports.validarTokenOnly = (req,res) => {// validar el token solamente
    try{
        decoded = jwt.verify(req.headers.authorization, SECRET_KEY);
        res.json({response: "valid token"});
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

/* exports.sendMail = (req, res) => {
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
}; */

exports.getUserInfo = (req, res)=>{// obtener la información principal del usuario para el navbar y otras tareas
    db.query('select first_name, last_name, email from users where id = ?',[req.iduser], (err, user) => {
        if(err) return res.status(500).send({response: "Server error"});
        res.json({
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
        })
    })
}

//we have sent a confirmation email. Click the link in the email to verify your email address.
//before subscribing you need to confirm your email.
//send email confirmation again 