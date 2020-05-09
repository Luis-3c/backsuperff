const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/',(req,res)=>{
    db.query('select * from example', (err, rows)=>{
        res.json(rows);
    })
});

module.exports = router;

