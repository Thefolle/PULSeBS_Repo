INSERT INTO class (desc,seats) values  ('12',70);
INSERT INTO class (desc,seats) values  ('10',60);
INSERT INTO class (desc,seats) values  ('11A',120);
INSERT INTO class (desc,seats) values  ('4S',40);
INSERT INTO class (desc,seats) values  ('1B',2);
INSERT INTO class (id,desc,seats) values  (0,'VIRTUAL CLASSROOM',9999);

insert into student (id,email,password, name, surname) values (269901,'davide.calarco@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Davide', 'Calarco');
insert into student (id,email,password, name, surname) values (269902,'francesco.gallo@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Francesco', 'Gallo');
insert into student (id,email,password, name, surname) values (269903,'vincenzo.distasio@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Vincenzo', 'Di Stasio');
insert into student (id,email,password, name, surname) values (269904,'feihong.shi@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Feihong', 'Shi');
insert into student (id,email,password, name, surname) values (269905,'elisa.ratto@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Elisa', 'Ratto');
insert into student (id,email,password, name, surname) values (269906,'michele.carbone@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Michele', 'Carbone');

insert into teacher (id, email, password, name, surname) VALUES (239901,'hyeronimus.bosch@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Hyeronimus', 'Bosch');
insert into teacher (id, email, password, name, surname) VALUES (239902,'dalmau.sala@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Dalmau', 'Sala');
insert into teacher (id, email, password, name, surname) VALUES (239903,'kaitlin.whittier@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Kaitlin', 'Whittier');
insert into teacher (id, email, password, name, surname) VALUES (239904,'montserrat.wilder@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Montserrat', 'Wilder');
insert into teacher (id, email, password, name, surname) VALUES (239905,'jorge.calatrava@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Jorge', 'Calatrava');
insert into teacher (id, email, password, name, surname) VALUES (239906,'john.smith@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'John', 'Smith');

insert into staff (email, password, type, name, surname) VALUES ('harry.houdini@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG',0, 'Harry', 'Houdini'); /* 0 => Booking manager */
insert into staff (email, password, type, name, surname) VALUES ('john.doe@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG',1, 'John', 'Doe'); /* 1 => Support officer */

insert into course (desc, ref_teacher) VALUES ('Analisi 1',239901);
insert into course (desc, ref_teacher) VALUES ('Elettrotecnica',239901);
insert into course (desc, ref_teacher) VALUES ('Analisi 2',239902);
insert into course (desc, ref_teacher) VALUES ('Fisica 1',239903);
insert into course (desc, ref_teacher) VALUES ('Termodinamica',239903);
insert into course (desc, ref_teacher) VALUES ('Fisica 2',239904);
insert into course (desc, ref_teacher) VALUES ('Software Engineering 2',239905);
insert into course (desc, ref_teacher) VALUES ('Cybersecurity',239906);

insert into subscription (ref_student, ref_course) VALUES (269901,1);
insert into subscription (ref_student, ref_course) VALUES (269901,2);
insert into subscription (ref_student, ref_course) VALUES (269901,4);
insert into subscription (ref_student, ref_course) VALUES (269902,1);
insert into subscription (ref_student, ref_course) VALUES (269902,4);
insert into subscription (ref_student, ref_course) VALUES (269903,1);
insert into subscription (ref_student, ref_course) VALUES (269903,2);
insert into subscription (ref_student, ref_course) VALUES (269903,3);
insert into subscription (ref_student, ref_course) VALUES (269903,5);
insert into subscription (ref_student, ref_course) VALUES (269903,6);
insert into subscription (ref_student, ref_course) VALUES (269904,1);
insert into subscription (ref_student, ref_course) VALUES (269904,4);
insert into subscription (ref_student, ref_course) VALUES (269904,2);
insert into subscription (ref_student, ref_course) VALUES (269904,6);
insert into subscription (ref_student, ref_course) VALUES (269905,2);
insert into subscription (ref_student, ref_course) VALUES (269905,4);
insert into subscription (ref_student, ref_course) VALUES (269905,5);
insert into subscription (ref_student, ref_course) VALUES (269905,1);
insert into subscription (ref_student, ref_course) VALUES (269906,6);
insert into subscription (ref_student, ref_course) VALUES (269906,1);
insert into subscription (ref_student, ref_course) VALUES (269906,3);


insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1605684600000,1605690000000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1606289400000,1606294800000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1606894200000,1606899600000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1610523000000,1610528400000);
insert into lecture (ref_course, ref_class, date, endTime,presence) VALUES (1,0,1610695800000,1610706600000,0);
insert into lecture (ref_course, ref_class, date, endTime,presence) VALUES (1,0,1611138600000,1611149400000,0);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (2,2,1607088600000,1607094000000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (2,4,1607698800000,1607709600000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (2,5,1611046800000,1611057600000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (3,2,1607774400000,1607785200000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (3,1,1610895600000,1610901000000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (4,3,1607774400000,1607785200000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (4,2,1610879400000,1610890200000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (5,1,1607774400000,1607785200000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (5,3,1610874000000,1610879400000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (6,4,1607774400000,1607785200000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (6,2,1610890200000,1610895600000);
insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (1,2,1605684600000,1605690000000,1,0,0);
insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (2,1,1607088600000,1607094000000,1,0,0);
insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (3,3,1605684600000,1605690000000,1,0,0);
insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (4,4,1605684600000,1605690000000,1,0,0);
insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (5,0,1605684600000,1605690000000,1,0,0);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,5,1611046800000,1611057600000);

insert into booking (ref_student, ref_lecture, date) values (269901,1,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269902,1,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269903,1,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269904,1,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269901,2,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269902,2,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269903,2,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269905,2,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269906,2,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269901,3,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269902,3,1605625200000);
insert into booking (ref_student, ref_lecture, date) values (269903,3,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269904,3,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269905,3,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269906,3,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269903,7,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269904,7,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269901,8,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269903,8,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269904,8,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269905,8,1605628800000);
insert into booking (ref_student, ref_lecture, date, presence) values (269903,10,1605628800000, 0);
insert into booking (ref_student, ref_lecture, date) values (269901,12,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269905,12,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269905,14,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269901,23,1605628800000);
insert into booking (ref_student, ref_lecture, date) values (269902,23,1605628800000);
insert into booking (ref_student, ref_lecture, date,active,presence) values(269901,6,1607774400000,0,1);

insert into waiting(ref_student,ref_lecture,date,active) values (269903,23,1605628800000,1);
insert into waiting(ref_student,ref_lecture,date,active) values (269904,23,1605628800000,1);