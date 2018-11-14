var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql2');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var app = express();
var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'be6307df739dcd',
    password: 'a9e77912',
    database: 'heroku_98b265965429210'
});

connection.connect();

require('./sockets/todo-sockets')(io);

var db = require("./models");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static("public"));

require("./routes/api-routes.js")(app);

db.sequelize.sync()
.then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});