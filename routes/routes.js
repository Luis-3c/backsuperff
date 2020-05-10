const express = require('express');
const router = express.Router();
const userController = require('../auth/authController');
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
router.get('/sendmail', userController.sendMail);

module.exports = router;

