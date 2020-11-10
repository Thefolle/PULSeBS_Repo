INSERT INTO class (desc) values  ('12');
INSERT INTO class (desc) values  ('10');
INSERT INTO class (desc) values  ('11A');
INSERT INTO class (desc) values  ('4S');

insert into student (id,email,password) values (269901,'student1@gmail.com','ciao123');
insert into student (id,email,password) values (269902,'student2@gmail.com','ciao123');
insert into student (id,email,password) values (269903,'student3@gmail.com','ciao123');
insert into student (id,email,password) values (269904,'student4@gmail.com','ciao123');

insert into teacher (id, email, password) VALUES (239901,'teacher1@gmail.com','ciao123');
insert into teacher (id, email, password) VALUES (239902,'teacher2@gmail.com','ciao123');
insert into teacher (id, email, password) VALUES (239903,'teacher3@gmail.com','ciao123');
insert into teacher (id, email, password) VALUES (239904,'teacher4@gmail.com','ciao123');

insert into staff (email, password, type) VALUES ('staff1@gmail.com','ciao123',0); /* 0 => Booking manager */
insert into staff (email, password, type) VALUES ('staff2@gmail.com','ciao123',1); /* 1 => Support officer */

insert into course (desc, ref_teacher) VALUES ('Analisi 1',239901);
insert into course (desc, ref_teacher) VALUES ('Elettrotecnica',239901);
insert into course (desc, ref_teacher) VALUES ('Analisi 2',239902);
insert into course (desc, ref_teacher) VALUES ('Fisica 1',239903);
insert into course (desc, ref_teacher) VALUES ('Fisica 2',239904);

insert into subscription (ref_student, ref_course) VALUES (269901,1);
insert into subscription (ref_student, ref_course) VALUES (269901,4);
insert into subscription (ref_student, ref_course) VALUES (269901,2);
insert into subscription (ref_student, ref_course) VALUES (269902,1);
insert into subscription (ref_student, ref_course) VALUES (269902,4);

insert into lecture (ref_course, ref_class, date) VALUES (1,1,1605452400000);
insert into lecture (ref_course, ref_class, date) VALUES (1,2,1605547800000);
insert into lecture (ref_course, ref_class, date) VALUES (1,1,1606057200000);
insert into lecture (ref_course, ref_class, date) VALUES (1,2,1606152600000);

insert into booking (ref_student, ref_lecture, date) values (269901,1,1605022961000);
insert into booking (ref_student, ref_lecture, date) values (269901,2,1605022961000);