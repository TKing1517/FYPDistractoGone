const Sequelize = require('sequelize');

const sequelize = new Sequelize('distractogonedb', 'TashfeenFYP', 'MyPass123', {
  host: 'localhost',
  dialect: 'mysql'
});

class Student extends Sequelize.Model {}
Student.init({
  StudentID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Email: {
    type: Sequelize.STRING
  },
  Password: {
    type: Sequelize.STRING
  },
  Points: {
    type: Sequelize.INTEGER
  },
  TimeSpentRestricted: {
    type: Sequelize.INTEGER
  },
  Username: {
    type: Sequelize.STRING
  }
}, {
    sequelize,
    modelName: 'student',
    timestamps: false
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = Student;