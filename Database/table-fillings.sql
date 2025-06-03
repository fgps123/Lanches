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
	                    (1, 2, 'Queijo', 1.50),
	                    (2, 2, 'Presunto', 1.50)
			    (3, 2, 'Nutella', 5.50)

select name, price from fillings where id_foods = 1
