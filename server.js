const express = require('express');
const app = express();
//const conn = db();
const routes = require('./routes/routes');
const properties = require('./config/properties');
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(routes);

/* db.query("SELECT 1 as val", (err, rows) => {
    console.log(rows); //[ {val: 1}, meta: ... ]
    /* conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"], (err, res) => {
      console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
      conn.end();
    }); */
/*}); 
*/

app.listen(properties.PORT, ()=>{
    console.log(`Server running on port ${properties.PORT}`);
});





