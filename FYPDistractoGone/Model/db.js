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

function selectFromTable(table,columns,whereClause, callback){
  let query = `SELECT ${columns} FROM ${table} WHERE BINARY ${whereClause}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error);
      return;
    }
    callback(results);
  });
}

function insertIntoStudent(table,Username,Password,Email,Points,TimeSpentRestricted){
  //Can improve by making insertData a variable(object? of student eg) that is passed into this function.
  let insertData = {Username: Username,Password: Password,Email: Email,Points: Points,TimeSpentRestricted: TimeSpentRestricted};
  let sql = `INSERT INTO ${table} SET ?`;
  let query = connection.query(sql, insertData,(err, result) => {
      if(err) throw err;
      console.log(`Data inserted into the ${table} table`);
  });
}

function updateStudent(updateValues, StudentID) {
  let sql = `UPDATE Student SET ? WHERE StudentID = ${StudentID}`;
  let query = connection.query(sql, updateValues, (err, result) => {
    if (err) throw err;
    console.log(`Data updated in the Student table`);
  });
}


module.exports = {
  connection,
  selectFromTable,
  insertIntoStudent,
  updateStudent
};


