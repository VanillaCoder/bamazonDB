var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Liambennett1!@#",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].quantity + " units");
        }
        console.log("-----------------------------------");
        start();
    });
}

function start() {
    inquirer
        .prompt([
            {
                name: "askID",
                type: "input",
                message: "Input the ID of the product you would like to purchase."
            },
            {
                name: "askQuantity",
                type: "input",
                message: "Input the quantity you would like to purchase."
            }

        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products", function (err, res) {
                if (res[(answer.askID - 1)].quantity >= answer.askQuantity) {
                    console.log("Processing...")
                    var queryPrice = res[(answer.askID-1)].price;
                    var userQuantity = parseInt(answer.askQuantity);
                    var newQuantity = res[(answer.askID - 1)].quantity - userQuantity;
                    console.log("Your account has been charged $" + (queryPrice * userQuantity))

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            quantity: newQuantity
                          },
                          {
                            id: answer.askID
                          }
                        ],
                        function(error) {
                          if (error) throw err;
                          console.log("Order processed!");
                          queryAllProducts()
                        }
                      );
                }
                else {
                    console.log("Insufficient quantity.")
                    connection.end()
                }
            });
        })
}

