const db = require('../models/index');

module.exports = function(io){
    io.on('connection', function(socket){
        //SOCKET ROUTES
        socket.on('new-todo', function(data){
            console.log(data);
            io.emit('emit-todo', data);
        })

        socket.on('todo-change', function(newData) {
            console.log(newData);

        })
        socket.on('remove-todo', function(data){

        })

    });
}