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
});

function selectFromTable(table,columns,whereClause){
  connection.query(`SELECT ${columns} FROM ${table} ${whereClause}`, (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error);
      return;
    }
    console.log('Results:', results);
    connection.end();
  });
}

function insertIntoTable(table,Username,Password,Email,Points,TimeSpentRestricted){
  let insertData = {Username: Username,Password: Password,Email: Email,Points: Points,TimeSpentRestricted: TimeSpentRestricted};
  let sql = `INSERT INTO ${table} SET ?`;
  let query = connection.query(sql, insertData,(err, result) => {
      if(err) throw err;
      console.log(`Data inserted into the ${table} table`);
  });
}

module.exports = {
  connection,
  selectFromTable,
  insertIntoTable
};


