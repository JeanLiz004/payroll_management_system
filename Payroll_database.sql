create database payroll_management_system

go

use payroll_management_system

go

create table Rol(
idRol int primary key identity(1,1),
descripcion varchar(50),
esActivo bit,
fechaRegistro datetime default getdate()
)



create table Usuario(
idUsuario int primary key identity(1,1),
nombre varchar(40),
correo varchar(40),
telefono varchar(40),
idRol int references Rol(idRol),
clave varchar(40),
esActivo bit


go

create table empleado(
idEmpleado int primary key identity(1,1),
primerNombre varchar(40), 
apellidoPaterno varchar(40), 
numeroSeguroSocial int, 
salarioSemanal decimal
)