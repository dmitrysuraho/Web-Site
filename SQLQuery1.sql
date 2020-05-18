use Orders

----Создание таблицы Заказчиков
create table CUSTOMERS
(
	IDCUSTOMER int IDENTITY(1,1) primary key,
	FIRSTNAME char(15) not null,
	LASTNAME char(15) not null,
	ADDRESS char(50) not null,
	PHONE char(20) not null,
	EMAIL char(50) not null,
	ZIP int not null,
	REGION char(20) not null,
	COUNTRY char(20) not null
);
		
----Создание таблицы Заказов
create table ORDERS
(
	IDCUSTOMER int constraint ORDERS_CUSTOMERS_FK foreign key references CUSTOMERS(IDCUSTOMER),
	IDORDER int IDENTITY(1,1) primary key,
	CREATEDAT date not null,
	SHIPPEDAT date,
	STATUS char(10) not null,
	CURRENCY char(5) not null,
);

----Создание таблицы Продуктов
create table PRODUCTS
(
	NAME char(15) not null,
	PRICE int not null,
	CURRENCY char(5) not null,
	IDPRODUCT int identity(1,1) primary key
);

----Создание связующей таблицы Заказов и продуктов
create table OrdersProducts
(
	ID int identity(1,1) primary key,
	IDORDER int constraint OrdersProducts_ORDERS_FK foreign key references ORDERS(IDORDER),
	IDPRODUCT int constraint OrdersProducts_PRODUCTS_FK foreign key references PRODUCTS(IDPRODUCT),
	QUANTITY int not null,
);

insert into ORDERS (IDCUSTOMER, CREATEDAT, SHIPPEDAT, STATUS, CURRENCY)
	        values (1, '2020-04-25', '2020-04-25', 'In Time', 'EUR'),
				   (2, '2020-04-21', '2020-04-23', 'Pending', 'EUR'),
				   (3, '2020-04-19', '2020-04-28', 'In Time', 'EUR'),
				   (4, '1991-08-10', '1991-09-11', 'Accepted', 'EUR'),
				   (5, '2006-12-23', '2007-02-13', 'Pending', 'EUR');

insert into CUSTOMERS(FIRSTNAME, LASTNAME, ADDRESS, PHONE, EMAIL, ZIP, REGION, COUNTRY)
				values('Dmitry', 'Suraho', 'st.Bobruiskaya 25', '+375449173453', 'DmitryS@mail.ru', 111, 'Minsk', 'Belarus'),
					  ('Alexandr', 'Petrov', 'st.Lenina', '+375257384953', 'AlexPetrov@mail.ru', 111,'Brest', 'Belarus'),
					  ('Anastasia', 'Pavlova', 'st.Revolution', '+73847574', 'Anastaisha@mail.ru', 111,'Moskow', 'Russia'),
					  ('Maria', 'Anders', 'Obere Str. 57', '030-0074321', 'Maria.Anders@company.com', 111,'Berlin', 'Germany'),
					  ('Laurence', 'Lebihan', '12, rue des Bouchers', '91.24.45.40', 'Laurence.Lebihan@company.com', 111,'Paris', 'France');

insert into PRODUCTS (NAME, PRICE, CURRENCY)
			  values ('Milk', 30, 'EUR'),
					 ('Bread', 20, 'EUR'),
					 ('Tea', 40, 'EUR'),
					 ('Candy', 5, 'EUR'),
					 ('Tomato', 20, 'EUR'),
					 ('Potato', 1, 'EUR'),
					 ('Queso Cabrales', 33, 'EUR'),
					 ('Pavlova', 4, 'EUR'),
					 ('Genen Shouyu', 18, 'EUR'),
					 ('Tofu', 21, 'EUR');

insert into OrdersProducts(IDORDER, IDPRODUCT, QUANTITY)
					values(6, 1, 20), (6, 2, 30),
						  (7, 3, 25), (8, 4, 11),
						  (8, 5, 9), (8, 6, 4),
						  (9, 7, 3), (9, 8, 1),
						  (10, 9, 12), (10, 10, 2); --я уже добавлял 5 заказов,поэтому у меня IDORDER с 6 по 10(1 колонка)