const Student = require('./Student');

const insertStudent = (student) => {
    return new Student(student).save();
}
  
module.exports = {
    insertStudent
}