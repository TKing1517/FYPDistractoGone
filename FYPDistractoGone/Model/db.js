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

function insertURLintoBlocked(StudentID,URL){
  let insertData = {StudentID: StudentID,URL: URL,AppOrURL:"URL"};
  let sql = `INSERT INTO BlockList SET ?`;
  let query = connection.query(sql, insertData,(err, result) => {
      if(err) throw err;
      console.log(`Data inserted into the BlockList table`);
  });
}

function DeleteURLFromBlocked(StudentID, URL){
  const query = `DELETE FROM BlockList WHERE StudentID = ${StudentID} AND URL = '${URL}'`;
  connection.query(query, (err, result) => {
    if(err) throw err;
    console.log(`Data deleted from the BlockList table`);
  });
}

function getBlockedURLsFromDB(StudentID) {
  let URLs = [];
  let sql = `SELECT URL FROM BlockList WHERE StudentID = ${StudentID} AND AppOrURL = 'URL'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      URLs.push(result[i].URL);
    }
  });
  return URLs;
}

function insertAppIntoBlocked(StudentID,AppName){
  let insertData = {StudentID: StudentID,AppName: AppName,AppOrURL:"App"};
  let sql = `INSERT INTO BlockList SET ?`;
  let query = connection.query(sql, insertData,(err, result) => {
      if(err) throw err;
      console.log(`Data inserted into the BlockList table`);
  });
}

function DeleteAppFromBlocked(StudentID, AppName){
  const query = `DELETE FROM BlockList WHERE StudentID = ${StudentID} AND AppName = '${AppName}'`;
  connection.query(query, (err, result) => {
    if(err) throw err;
    console.log(`Data deleted from the BlockList table`);
  });
}

function getBlockedAppsFromDB(StudentID) {
  let appsToBlock = [];
  let sql = `SELECT AppName FROM BlockList WHERE StudentID = ${StudentID} AND AppOrURL = 'App'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      appsToBlock.push(result[i].AppName);
    }
  });
  return appsToBlock;
}

module.exports = {
  connection,
  selectFromTable,
  insertIntoStudent,
  updateStudent,
  insertURLintoBlocked,
  DeleteURLFromBlocked,
  insertAppIntoBlocked,
  DeleteAppFromBlocked,
  getBlockedAppsFromDB,
  getBlockedURLsFromDB
};


