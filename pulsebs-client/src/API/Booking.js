class Booking{

    constructor(id,ref_student, ref_lecture, date, course, classDesc, presence, active) {
        this.id = id;
        this.ref_student = ref_student;
        this.ref_lecture = ref_lecture;
        this.date = date;
        this.course = course;
        this.class = classDesc;
        this.presence = presence;
        this.active = active;
    }
}

export default Booking;