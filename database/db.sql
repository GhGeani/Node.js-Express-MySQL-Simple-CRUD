-- create database
create database crud_db;

-- use database
use crud_db;

-- create a table
create table people (
    id int(11) unsigned auto_increment,
    first_name varchar(30) not null,
    second_name varchar(30) not null,
    email varchar(50) not null,
    bio text not null,
    primary key (id)
);

-- ++ profile image for each person
ALTER TABLE people ADD photo LONGBLOB NOT NULL; 
ALTER TABLE people ADD photo_name varchar(200) NOT NULL; 