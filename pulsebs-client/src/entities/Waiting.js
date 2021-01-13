/**
 * @Feihong
 */
// Creat Waiting Calss

class Waiting{   

    constructor(id, ref_student, ref_lecture, date, active, desc, cldesc, presence, lecdate ){
        this.id = id;
        this.ref_student = ref_student;
        this.ref_lecture = ref_lecture;
        this.date = date;
        this.active = active;  
        this.desc = desc;
        this.cldesc = cldesc;
        this.presence = presence;
        this.lecdate = lecdate;
    }
}

export default Waiting;