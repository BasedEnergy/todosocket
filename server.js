var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql2');
var path = require('path');
var app = express();
var PORT = process.env.PORT || 8080;

var db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'be6307df739dcd',
    password: 'a9e77912',
    database: 'heroku_98b265965429210'
};

//Handle faulty connect or disconnects
function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {              
        if(err) {
            setTimeout(handleDisconnect, 2000); 
        }
    });

    connection.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                         
        } else {
            throw err;
        }
    });
}

handleDisconnect();

var db = require("./models");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

require("./routes/api-routes.js")(app);

db.sequelize.sync()
.then(function () {

    const io = require('socket.io').listen(app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    }));

    require('./sockets/todo-sockets')(io);
});
