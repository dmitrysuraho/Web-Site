const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Customers extends Model{};
class Orders extends Model{};
class Products extends Model{};
class OrdersProducts extends Model{};

function internalORM(sequelize) {
	Customers.init(
					{
						idCustomer: {type: Sequelize.INTEGER, allowNull: true, autoIncrement: true, primaryKey: true},
						firstName: {type: Sequelize.STRING, allowNull: false},
						lastName: {type: Sequelize.STRING, allowNull: false},
						address: {type: Sequelize.STRING, allowNull: false},
						phone: {type: Sequelize.STRING, allowNull: false},
						email: {type: Sequelize.STRING, allowNull: false},
						zip: {type: Sequelize.INTEGER, allowNull: false},
						region: {type: Sequelize.STRING, allowNull: false},
						country: {type: Sequelize.STRING, allowNull: false}
					},
					{sequelize, modelName: "Customers", tableName: "Customers", timestamps: false}
		);
	Orders.init(
					{
						idCustomer: {type: Sequelize.INTEGER, allowNull: false,
														references: {model: Customers, key: "idCustomer"}},
						idOrder: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
						createdAt: {type: Sequelize.DATEONLY, allowNull: false},
						shippedAt: {type: Sequelize.DATEONLY, allowNull: true},
						status: {type: Sequelize.STRING, allowNull: false},
						currency: {type: Sequelize.STRING, allowNull: false},
						
					},
					{sequelize, modelName: "Orders", tableName: "Orders", timestamps: false}
		);
	Products.init(
					{
						name: {type: Sequelize.STRING, allowNull: false},
						price: {type: Sequelize.INTEGER, allowNull: false},
						currency: {type: Sequelize.STRING, allowNull: false},
						idProduct: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
					},
					{sequelize, modelName: "Products", tableName: "Products", timestamps: false}
		);
	OrdersProducts.init(
					{
						id: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
						idOrder: {type: Sequelize.INTEGER, allowNull: false, 
								  references: {model: Orders, key: "idOrder"}},
						idProduct: {type: Sequelize.INTEGER, allowNull: false, 
								  references: {model: Products, key: "idProduct"}},		  
						quantity: {type: Sequelize.INTEGER, allowNull: false}
					},
					{sequelize, modelName: "OrdersProducts", tableName: "OrdersProducts", timestamps: false}
		);
};
exports.ORM = (s) => {internalORM(s); return {Customers, Orders, Products, OrdersProducts};}