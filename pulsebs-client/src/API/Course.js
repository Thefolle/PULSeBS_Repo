class Course{

    constructor(id, year, semester, course, teacher) {
        this.id = id;
        this.year = year;
        this.semester = semester;
        this.desc = course;
        this.ref_teacher = teacher;
    }
}

export default Course;