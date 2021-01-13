class scheduledLecture{ //TO FIX: merge with Lecture.js

    constructor(course, ref_class, start_date, end_date, presence, bookable, active ) {
        this.ref_course = course;
        this.ref_class = ref_class;
        this.date = start_date;
        this.endTime = end_date;
        this.presence = presence;
        this.bookable = bookable;
        this.active = active;
        // if(dateScheduled)
        //    this.dateScheduled=dateScheduled;
    }
}

export default scheduledLecture;
