var mysql = require('mysql')
var inquirer = require('inquirer')
var columnify = require('columnify')

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
	var query = "SELECT item_id as ID, product_name as 'PRODUCT NAME', price as PRICE FROM products"
	connection.query(query, function(err, res) {
		// for (var i = 0; i < res.length; i++) {
		// 	console.log( res[i].item_id + "    " + res[i].product_name + "    " + res[i].price)
		// }
		console.log(columnify(res))
	})
	itemInquire()
}

function itemInquire() {

}