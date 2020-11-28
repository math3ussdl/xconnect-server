CREATE TABLE "public"."ong" (
	cnpj CHAR(18) NOT NULL PRIMARY KEY,
	is_active BOOLEAN NOT NULL DEFAULT false,
	picture VARCHAR(255) NOT NULL,
	hashDelete VARCHAR(255) NOT NULL,
	address VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
	number VARCHAR(10) NOT NULL,
	complement VARCHAR(30) NOT NULL,
	neighborhood VARCHAR(15) NOT NULL,
	city VARCHAR(15) NOT NULL,
	state VARCHAR(50) NOT NULL,
	zip CHAR(9) NOT NULL,
	phone VARCHAR(20) NOT NULL
)

CREATE TABLE "public"."donor" (
	id VARCHAR(255) NOT NULL PRIMARY KEY,
	active BOOLEAN NOT NULL DEFAULT false,
	picture VARCHAR(255) NOT NULL,
	hashDelete VARCHAR(255) NOT NULL,
	city VARCHAR(15) NOT NULL,
	state VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL
)

CREATE TABLE "public"."pf" (
	cpf CHAR(14) NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	surname VARCHAR(50) NOT NULL,
	gender VARCHAR(10) NOT NULL,
	birthday CHAR(10) NOT NULL,
	id_donor VARCHAR(255) REFERENCES "public"."donor" (id)
)

CREATE TABLE "public"."pj" (
	cnpj CHAR(18) NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	id_donor VARCHAR(255) REFERENCES "public"."donor" (id)
)

CREATE TABLE "public"."donation" (
	approved BOOLEAN NOT NULL DEFAULT false,
	number VARCHAR(255) NOT NULL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description VARCHAR(355) NOT NULL,
	quantity INTEGER NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	id_donor VARCHAR(255) REFERENCES "public"."donor" (id),
	cnpj_ong CHAR(18) REFERENCES "public"."ong" (cnpj)
)

CREATE TABLE "public"."product" (
	id VARCHAR(255) NOT NULL PRIMARY KEY,
	description VARCHAR(15) NOT NULL,
	quantity INTEGER NOT NULL,
	number_donation VARCHAR(255) REFERENCES "public"."donation" (number)
)
