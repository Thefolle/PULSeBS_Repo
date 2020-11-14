class Lecture{   

    constructor(id, date, presence, bookable, active, courseDesc, teacherName, teacherSurname, CLdesc) {
        this.id = id;
        this.date = date;
        this.presence = presence;
        this.bookable = bookable;
        this.active = active;
        this.courseDesc = courseDesc;
        this.teacherName = teacherName;
        this.teacherSurname = teacherSurname;
        this.CLdesc = CLdesc;
    }
}

export default Lecture;