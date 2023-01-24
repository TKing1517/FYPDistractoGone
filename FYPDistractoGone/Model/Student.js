class Student {
    constructor(StudentID, Username, Password, Email, Points, TimeSpentRestricted) {
      this.StudentID = StudentID;
      this.Username = Username;
      this.Password = Password;
      this.Email = Email;
      this.Points = Points;
      this.TimeSpentRestricted = TimeSpentRestricted;
    }
}

module.exports = Student;