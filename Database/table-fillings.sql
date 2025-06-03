create table fillings (
	id int,
	id_foods int,
	name varchar,
	price real,
	primary key(id, id_foods),
	foreign key (id_foods) references foods(id)
)

insert into fillings values (1, 2, 'Queijo', 1.50),
	                    (2, 2, 'Presunto', 1.20),
			    (3, 2, 'Nutella', 5.50),
	                    (4, 2, 'Frango', 2.50),
	                    (5, 2, 'Carne moida', 3.00),
	                    (1, 1, 'Queijo', 1.50),
	                    (2, 1, 'Presunto', 1.20),
			    (3, 1, 'Nutella', 5.50),
	                    (4, 1, 'Frango', 2.50),
	                    (5, 1, 'Carne moida', 3.00)
			    

select name, price from fillings where id_foods = 1
