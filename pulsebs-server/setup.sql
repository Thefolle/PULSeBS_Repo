

/* TABLES */
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
