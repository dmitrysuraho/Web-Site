const Sequelize = require("sequelize");
const sequelize = new Sequelize('Orders', 'aaa', 'f,d2001l5', {
     host: 'dsuraho.database.windows.net',
     dialect: 'mssql',
  	dialectOptions: {
    	options: {
        	encrypt: true
      	}
  	}
});

const {Customers, Orders, Products, OrdersProducts} = require("./models").ORM(sequelize);
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(cors());

app.get("/api/Orders", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		Customers.hasMany(Orders, {foreignKey: 'idCustomer'});
		Customers.findAll({ include: [ {model: Orders, required:true} ] })
		.then(p => {
			var arr = new Array();
			p.forEach(el => {
				el.dataValues.Orders.forEach(ord => {
					arr.push({
							"summary": {
            					"createdAt": ord.createdAt,
            					"customer": el.dataValues.firstName.trim(),
            					"status": ord.status.trim(),
            					"shippedAt": ord.shippedAt,
            					"currency": ord.currency.trim()
        					},
        					"shipTo": {
            					"name": el.dataValues.firstName.trim(),
            					"address": el.dataValues.address.trim(),
            					"ZIP": el.dataValues.zip,
            					"region": el.dataValues.region.trim(),
            					"country": el.dataValues.country.trim()
        					},
        					"customerInfo": {
            					"firstName": el.dataValues.firstName.trim(),
            					"lastName": el.dataValues.lastName.trim(),
            					"address": el.dataValues.address.trim(),
            					"phone": el.dataValues.phone.trim(),
            					"email": el.dataValues.email.trim()
        					},
        					"id" : ord.idOrder
        				}
					);
				});
			});
			arr.sort(function(a, b) {
				if(a.id > b.id)
					return 1;
				if(a.id < b.id)
					return -1;
				return 0;
			});
			res.type('json').send(arr);
		});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.get("/api/Orders/:x/products", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		sequelize.query(`select * from ORDERS join OrdersProducts on ORDERS.IDORDER = OrdersProducts.IDORDER`
			+ ` inner join PRODUCTS on OrdersProducts.IDPRODUCT = PRODUCTS.IDPRODUCT where ORDERS.IDORDER = ${req.params.x}`)
		.then(result => {
			var arr = new Array();
			result[0].forEach(el => {
				arr.push({
					"name": el.NAME,
        			"price": el.PRICE,
        			"currency": el.CURRENCY,
        			"quantity": el.QUANTITY,
        			"totalPrice": el.PRICE * el.QUANTITY,
        			"id": el.IDPRODUCT,
        			"orderId": el.IDORDER
				});
			});
			arr.sort(function(a, b) {
				if(a.id > b.id)
					return 1;
				if(a.id < b.id)
					return -1;
				return 0;
			});
			res.type("json").send(arr);
		});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.get("/api/Orders/:x", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		Customers.hasMany(Orders, { foreignKey: 'idCustomer'});
		Customers.findAll({ include: [ {model: Orders, where: {idOrder: Number(req.params.x)}, required:true} ] })
		.then(p => {
			var arr = new Array();
			p.forEach(el => {
				el.dataValues.Orders.forEach(ord => {
					arr.push({
							"summary": {
            					"createdAt": ord.createdAt,
            					"customer": el.dataValues.firstName.trim(),
            					"status": ord.status.trim(),
        	    				"shippedAt": ord.shippedAt,
    	        				"currency": ord.currency.trim()
	        				},
        					"shipTo": {
            					"name": el.dataValues.firstName.trim(),
            					"address": el.dataValues.address.trim(),
            					"ZIP": el.dataValues.zip,
            					"region": el.dataValues.region.trim(),
        	    				"country": el.dataValues.country.trim()
    	    				},
	        				"customerInfo": {
            					"firstName": el.dataValues.firstName.trim(),
            					"lastName": el.dataValues.lastName.trim(),
            					"address": el.dataValues.address.trim(),
            					"phone": el.dataValues.phone.trim(),
            					"email": el.dataValues.email.trim()
        					},
        					"id" : ord.idOrder
        				}
					);
				});
			});
			res.type('json').send(arr[0]);
		});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.put("/api/Orders/:x", (req, res) => {
	if(req.body)
	{
		var order = req.body;
		var idCust = 0;
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			Customers.hasMany(Orders, { foreignKey: 'idCustomer'});
			Customers.findAll({ include: [ {model: Orders, where: {idOrder: Number(req.params.x)}, required:true} ] })
			.then(p => {
				p.forEach(el => {
					idCust = el.dataValues.idCustomer;
				});
				Customers.update(
					{
						firstName: order.customerInfo.firstName,
						lastName: order.customerInfo.lastName,
						phone: order.customerInfo.phone,
						email: order.customerInfo.email,
						address: order.customerInfo.address,
						zip: order.shipTo.ZIP,
						region: order.shipTo.region,
						country: order.shipTo.country
					},
					{where:{idCustomer: idCust}}
				)
				.then(result => {res.type("txt").send(result)});
			});
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.post("/api/Orders", (req, res, next) => {
	if(req.body)
	{
		var newOrder = req.body;
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			Customers.create({
				firstName: newOrder.customerInfo.firstName,
				lastName: newOrder.customerInfo.lastName,
				phone: newOrder.customerInfo.phone,
				email: newOrder.customerInfo.email,
				address: newOrder.customerInfo.address,
				zip: newOrder.shipTo.ZIP,
				region: newOrder.shipTo.region,
				country: newOrder.shipTo.country
			});
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
		next();
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.post("/api/Orders", (req, res) => {
	if(req.body)
	{
		var newOrder = req.body;
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			Customers.findAll({
				attributes: [
								[sequelize.fn('MAX', sequelize.col("IDCUSTOMER")), 'max_id']
							]
				})
				.then(p => {
					var idCust;
					p.forEach(el => {idCust = el.dataValues.max_id;});
					Orders.create({
						idCustomer: idCust,
						createdAt: newOrder.summary.createdAt,
						shippedAt: newOrder.summary.shippedAt,
						status: newOrder.summary.status,
						currency: newOrder.summary.currency
					})
					res.send();
				});
			})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.delete("/api/Orders/:x", (req, res, next) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		OrdersProducts.destroy({where: {idOrder:Number(req.params.x)}});
		next();
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	
});

app.delete("/api/Orders/:x", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		Orders.destroy({where: {idOrder: Number(req.params.x)}});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	res.send();
});

app.get("/api/Customers", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		var arr = new Array();
		Customers.findAll()
		.then(result => {
			result.forEach(el => {
				arr.push({
					"idCustomer": el.dataValues.idCustomer,
					"name": `${el.dataValues.firstName.trim()} ${el.dataValues.lastName.trim()}`
				});
			});
			res.send(arr);
		});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.post("/api/CustomerOrder" , (req, res) => {
	if(req.body)
	{
		var customer = req.body;
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			Orders.create({
				idCustomer: customer.idCustomer,
				createdAt: customer.createdAt,
				shippedAt: customer.shippedAt,
				status: customer.status,
				currency: customer.currency
			});
			res.send();
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.get("/api/products", (req, res) => {
	sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			var arr = new Array();
			Products.findAll()
			.then(result => {
				result.forEach(el => {
					arr.push({
						"idProduct": el.dataValues.idProduct,
						"name" : el.dataValues.name.trim(),
						"price": el.dataValues.price,
						"currency": el.dataValues.currency.trim()
					});
				});
				res.send(arr);
			});
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.post("/api/Orders/:x/products", (req, res) => {
	if(req.body)
	{
		var product = req.body;
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			var flag = false;
			var newQuantity = 0;
			// OrdersProducts.findAll()
			// .then(result => {
			// 	result.forEach(el => {
			// 		if(product.idProduct === el.dataValues.idProduct && Number(req.params.x) === el.dataValues.idOrder)
			// 		{
			// 			flag = true;
			// 			newQuantity = el.dataValues.quantity + product.quantity;
			// 		}
			// 	});
			// 	if(flag)
			// 	{
			// 		OrdersProducts.update(
			// 			{ quantity: newQuantity },
			// 			{ where: {idOrder: Number(req.params.x), idProduct: product.idProduct}} 
			// 		)
			// 		.catch(err => {console.log(err)});
			// 	}
			// 	else
			// 	{
					OrdersProducts.create({
						idOrder: Number(req.params.x),
						idProduct: product.idProduct,
						quantity: product.quantity
					})
					.catch(err => {console.log(err)});
				// }
			// })
			// .catch(err => {console.log(err)});
			res.send();
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.post("/api/products", (req, res) => {
	if(req.body)
	{                                                                                
		var product = req.body;                                                     
		sequelize.authenticate()                                                     
		.then(() => {console.log("Соединение с базой данных установлено")})          
		.then(() => {                                                                
			Products.create({
				name: product.name,
				price: product.price,
				currency: product.currency
			})
			.then(result => {res.type("json").send(result);})
			.catch(err => {console.log(err)});
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.status(400).type("txt").send("no bodyparser");
});

app.delete("/api/products/:x", (req, res) => {                                                                              
	var product = req.body;                                                      
	sequelize.authenticate()                                                     
	.then(() => {console.log("Соединение с базой данных установлено")})          
	.then(() => {                                                                
		Products.destroy({
			where: {idProduct: Number(req.params.x)}
		})
		.then(result => {res.type("text").send(`Deleted: ${result}`);})
		.catch(err => {console.log(err)});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.delete("/api/Orders/:x/products/:y", (req, res) => {
	sequelize.authenticate()                                                     
	.then(() => {console.log("Соединение с базой данных установлено")})          
	.then(() => {                                                                
		OrdersProducts.destroy({
			where: {
				idOrder: Number(req.params.x),
				idProduct: Number(req.params.y)
			}
		})
		.then(result => {res.type("text").send(`Deleted: ${result}`);})
		.catch(err => {console.log(err)});
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.use(express.static(__dirname));

app.get('/Orders', (req, res) => {
	if(req.query.id)
	{
		sequelize.authenticate()
		.then(() => {console.log("Соединение с базой данных установлено")})
		.then(() => {
			Orders.findAll({where: {idOrder: Number(req.query.id)}})
			.then(result => {
				var i = 0;
				result.forEach(el => {
					i++;
				});
				if(i == 0) res.sendfile("NotFound404.html");
				else res.sendfile("orders.html");
			});
		})
		.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
	}
	else res.sendfile("orders.html");
});

app.listen(PORT, function(){console.log(`server listen: ${PORT}`)});