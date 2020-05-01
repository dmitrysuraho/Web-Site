const Sequelize = require("sequelize");
const sequelize = new Sequelize("Orders", "aaa", "11111", {host: "DESKTOP-VFDQI77", dialect: "mssql"});
const {Customers, Orders, Products, OrdersProducts} = require("./models").ORM(sequelize);
const express = require("express");
const app = express();
const cors = require("cors");

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

app.get("/api/Customers", (req, res) => {
	sequelize.authenticate()
	.then(() => {console.log("Соединение с базой данных установлено")})
	.then(() => {
		
	})
	.catch(err => {console.log("Ошибка при соединении с базой данных: ", err.message)});
});

app.listen(3000, function(){console.log("server listen: 3000")});