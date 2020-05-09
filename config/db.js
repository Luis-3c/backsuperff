const mariadb = require('mariadb/callback');
const dbProps = require('./properties');
const conn = mariadb.createConnection({
	host: dbProps.HOST,
	user: 'root',
    password: 'admin',
    database: dbProps.DB
});
conn.connect((err) => {
	if (err) {
		console.log('not connected due to error: ' + err);
	} else {
		console.log('connected ! connection id is ' + conn.threadId);
	}
});

module.exports = conn;
