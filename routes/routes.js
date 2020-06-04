const express = require('express');
const router = express.Router();
const userController = require('../auth/authController');
const mailer = require('../controllers/emails/emailController');
const subsController = require('../controllers/subscriptions/subscriptionController');
const videosController = require('../controllers/videos/videosController');
/* const db = require('../config/db'); */

/* router.get('/',(req,res)=>{
    db.query('select * from example', (err, rows)=>{
        res.json(rows[0].name);
    })
});
 */

 router.get('/', (req,res)=>{
     res.send('Welcome to index');
 });

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/userinfo', userController.validarToken, userController.getUserInfo);

/* router.get('/sendmail', userController.sendMail); */
// ruta para verificar el token enviado por email cuando un usuario se registra
// verificación de la cuenta(email)
router.get('/verify/:token', mailer.verifyToken);

//rutas de subscripcion
 router.get('/subscription', userController.validarToken, subsController.validarSub);
 router.post('/subscribe', userController.validarToken, subsController.subscribe);

 //rutas para los videos
 router.get('/videos/index', videosController.getvideos);
 router.get('/video/:id', videosController.getvideo);
 router.get('/videos/index/load/:id', videosController.loadmorevideosindex);
 router.get('/videos/recommend', videosController.getvideosrecommend);
 router.post('/videos/index/results', videosController.searcherresults);
 
module.exports = router;

