const db = require('../models/index');
const todo = {};

module.exports = function(io){
    io.on('connection',function(socket){
        socket.on('new-change',function(data){
            io.emit('emit-change');
            console.log(data);
        })
    })
}