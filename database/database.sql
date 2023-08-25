create database burgerqueen;

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(40)
);

INSERT INTO roles(nombre) values
    ('administrador'),
    ('mesonero'),
    ('cocinero');

CREATE TABLE empleado(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(40),
    password VARCHAR(10)
);

/* agregamos una nueva columna llamada id_rol y un email que sera unico*/

alter table empleado
add id_rol serial;

alter table empleado
add email VARCHAR(50) unique;

/* cambiaremos el nombre de la columna id de roles a id_rol */

ALTER TABLE roles
RENAME COLUMN id
TO id_rol;

ALTER TABLE empleado
RENAME COLUMN id
TO id_empl;

/* modificando el varchar de la clave*/

ALTER TABLE empleado
ALTER COLUMN password TYPE VARCHAR(500);

/* ahora si vamos a realizar la conexion por medio la clave foranea */

alter table empleado
add constraint FKtest
foreign key (id_rol)
references roles (id_rol);

INSERT INTO empleado(nombre, password, id_rol) values
    ('maria', 'maria123', '2'),
    ('joel', 'joel123', '3'),
    ('prudencio', 'prude123', '2'),
    ('pepito', 'pepito123', '1');

/* tabla de ordenes */ 

CREATE TABLE orden(
    id_orden SERIAL PRIMARY KEY,
    cliente VARCHAR(40),
    finalizado BOOLEAN
);

/* cambiaremos el tipo de dato de finalizado a defaul false*/

alter table orden 
alter column finalizado set default false;

alter table orden
add id_empl serial;

alter table orden
add constraint FKtest
foreign key (id_empl)
references empleado (id_empl);

INSERT INTO orden(cliente, finalizado, id_empl) values
    ('juan', 'false', '2'),
    ('pedro', 'false', '1');

/* agregamos una nueva columna llamada mesa*/

alter table orden
add mesa INT;

/* tabla de productos*/

CREATE TABLE productos(
    id_prod SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(50),
    stock INT CHECK (stock >= 0),
    precios INT CHECK (precios >= 0 )
);

INSERT INTO productos(nombre_producto, stock, precios) values
    ('papas', '20', '1000'),
    ('cebollas', '30', '1500');

/* creacion de la tabla ordenes-productos*/

CREATE TABLE orden_productos(
    id_ord_pro SERIAL PRIMARY KEY
);

alter table orden_productos
add id_orden serial;

alter table orden_productos
add id_prod serial;

alter table orden_productos
add constraint FKtest
foreign key (id_orden)
references orden (id_orden);

alter table orden_productos
add constraint FKtes
foreign key (id_prod)
references productos (id_prod);
