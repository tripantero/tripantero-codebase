module.exports = {}
let userConnected = 0;
module.exports.apply = (Server) => {
    const io = require('socket.io').listen(Server)
    
    io.sockets.on('connect', (socket)=>{
        userConnected++;
        
        socket.on('disconnect', ()=>{

            userConnected--;

        });
    });
}