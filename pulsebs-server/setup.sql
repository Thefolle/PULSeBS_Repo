/* TABLES */

-- id number 0 is dedicated to virtual classrooms
create table class
(
    id   INTEGER primary key,
    desc TEXT not null unique,
    seats INTEGER not null
);

create table staff
(
    id       INTEGER primary key,
    email    TEXT not null unique,
    password TEXT not null,
    type     INTEGER default 0 not null,
    name     TEXT not null,
    surname  TEXT not null
);

create table student
(
    id       INTEGER primary key,
    email    TEXT not null unique,
    password TEXT not null,
    name     TEXT default ' ' not null,
    surname  TEXT default ' ' not null
);

create table teacher
(
    id       INTEGER primary key,
    email    TEXT not null unique,
    password TEXT not null,
    name     TEXT default ' ' not null,
    surname  TEXT default ' ' not null
);

create table course
(
    id          INTEGER primary key,
    desc        TEXT    not null,
    ref_teacher INTEGER not null references teacher
);

-- if presence is 0, ref_class can be:
--     0 (virtual classroom): this means that the lecture has always been online;
--     another lecture id: it means that the lecture has been turnt to be online
--         and so this id refers to the class that was planned to host the lecture;

create table lecture
(
    id         INTEGER primary key,
    ref_course INTEGER not null references course,
    ref_class  INTEGER references class,
    date       INTEGER,
    endTime    INTEGER,
    presence   INTEGER default 1 not null,
    bookable   INTEGER default 1 not null,
    active     INTEGER default 1 not null
);

create table booking
(
    id          INTEGER primary key,
    ref_student INTEGER not null references student,
    ref_lecture INTEGER not null references lecture,
    date        INTEGER not null,
    active      INTEGER default 1 not null,
    presence    INTEGER default 0 not null
);

create table subscription
(
    ref_student INTEGER references student,
    ref_course  INTEGER references course,
    primary key (ref_student, ref_course)
);


-- Feihong
create table waiting
(
    id          INTEGER primary key,
    ref_student INTEGER not null references student,
    ref_lecture INTEGER not null references lecture,
    date        INTEGER not null,
    active      INTEGER default 1 not null
    
);