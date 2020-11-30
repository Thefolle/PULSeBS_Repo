class LectureTeacher{   

    constructor(course,classC,id,lecId,date, endTime, presence, bookable, active){
        this.course = course;
        this.classC = classC;
        this.id=id;
        this.lecId=lecId;
        this.date=date;
        this.endTime=endTime;
        this.presence = presence;
        this.bookable = bookable;
        this.active = active;
        
    }
}

export default LectureTeacher;