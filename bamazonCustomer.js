var mysql = require('mysql')
var inquirer = require('inquirer')
var columnify = require('columnify')

// variables
var items = ''
var quantity = 0
var itemCost = 0
var originalStock = 0

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	password: '',
	database: 'bamazon'
})

connection.connect(function(err) {
	if (err) throw err;
	showInventory();
})

function showInventory() {
	var query = "SELECT item_id as ID, product_name as 'PRODUCT NAME', price as PRICE, stock_quantity FROM products"
	connection.query(query, function(err, res) {
		// for (var i = 0; i < res.length; i++) {
		// 	console.log( res[i].item_id + "    " + res[i].product_name + "    " + res[i].price)
		// }
		console.log(columnify(res))
		itemInquire()
	})
	
}

function itemInquire() {
	inquirer.prompt({
		name: "item_id",
		message: "Enter the ID of the product you would like to purchase: "
	})
	.then(function(answer){
		console.log(answer.item_id)
		items = answer.item_id
		numberItems()
	})
	
}

function numberItems() {
	inquirer.prompt({
		name: "quantity",
		message: "How many of these would you like to purchase: "
	}). then(function(answer) {
		console.log(answer.quantity)
		quantity = answer.quantity
		checkOrder()
	})
}

function checkOrder() {
	console.log("item: " + items + " quantity: " + quantity)
	connection.query("SELECT stock_quantity, price FROM products WHERE ?", {item_id: items}, function(err, res) {
		console.log(res[0].stock_quantity)
		if(res[0].stock_quantity<quantity) {
			console.log("INSUFFICIENT QUANTITY!")
			itemCost = 0
			showInventory()
		} else {
			itemCost = res[0].price
			originalStock = res[0].stock_quantity
			updateInventory()
		}
	})	
}

function updateInventory() {
	console.log("Total Amt: $" + (quantity*itemCost))
	connection.query("UPDATE products SET ? WHERE ?", 
		[
		{stock_quantity: (originalStock - quantity)},
		{item_id: items}
		])
	showInventory()
}