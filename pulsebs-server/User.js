class User{    
    constructor(id, email, hash, type, name, surname) {

        this.userID = id;
        this.email = email;
        this.hash = hash;
        this.name = name;
        this.surname = surname;

        //type is 0 for students, 1 for teachers and 2 for staff
        this.type = type;
    }
}

module.exports = User;