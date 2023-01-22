const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8592482',
  password: 'Gq9LlkNCiX',
  database: 'sql8592482',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
    //Testing select from table below
    connection.query('SELECT * FROM Student', (error, results) => {
      if (error) {
        console.error('Error querying the database: ' + error);
        return;
      }
      console.log('Results:', results);
      connection.end();
    });
  });