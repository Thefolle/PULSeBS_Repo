INSERT INTO class (desc,seats) values  ('12',70);
INSERT INTO class (desc,seats) values  ('10',60);
INSERT INTO class (desc,seats) values  ('11A',120);
INSERT INTO class (desc,seats) values  ('4S',40);
INSERT INTO class (id,desc,seats) values  (0,'VIRTUAL CLASSROOM',9999);

insert into student (id,email,password, name, surname) values (269901,'davide.calarco@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Davide', 'Calarco');
insert into student (id,email,password, name, surname) values (269902,'francesco.gallo@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Francesco', 'Gallo');
insert into student (id,email,password, name, surname) values (269903,'vincenzo.distasio@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Vincenzo', 'Di Stasio');
insert into student (id,email,password, name, surname) values (269904,'feihong.shi@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Feihong', 'Shi');

insert into teacher (id, email, password, name, surname) VALUES (239901,'hyeronimus.bosch@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Hyeronimus', 'Bosch');
insert into teacher (id, email, password, name, surname) VALUES (239902,'dalmau.sala@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Dalmau', 'Sala');
insert into teacher (id, email, password, name, surname) VALUES (239903,'kaitlin.whittier@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Kaitlin', 'Whittier');
insert into teacher (id, email, password, name, surname) VALUES (239904,'montserrat.wilder@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG', 'Montserrat', 'Wilder');

insert into staff (email, password, type, name, surname) VALUES ('harry.houdini@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG',0, 'Harry', 'Houdini'); /* 0 => Booking manager */
insert into staff (email, password, type, name, surname) VALUES ('john.doe@gmail.com','$2b$10$3gyXhV21BfdHnQnTk1uBFeYI5Kexj1bkGlJarX8ZJkfqLbi2J1IfG',1, 'John', 'Doe'); /* 1 => Support officer */

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

insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1605526200000,1605531600000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,2,1605699000000,1605709800000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,1,1606131000000,1606136400000);
insert into lecture (ref_course, ref_class, date, endTime) VALUES (1,2,1606303800000,1606320000000);

insert into booking (ref_student, ref_lecture, date) values (269901,1,1605441600000);
insert into booking (ref_student, ref_lecture, date) values (269901,2,1605445200000);
