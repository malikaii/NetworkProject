const net = require("net");

let sockets = []; // Array of sockets - endpoints between program - list of client connections to server

const server = net.createServer(socket => {
    sockets.push(socket); // adds socket 'argument' to the array of socket connections
    console.log('Client connected to server!');

    socket.on('data', data => {
        broadcast(data, socket) // broadcasts alert to the other sockets or 'clients'
        console.log(decodeURI(data));
    })// listen to client data - eventemitter

    
    socket.on('error', error => {
        console.log('A client has disconnected.')
    }) // eventemitter listens for the error and logs a custom error

    socket.on('close', () => {
        console.log('A client has left the chat');
    })

    
}); // Creates a server object with event emitters or 'methods' to handle connection

// server.listen(5555);
server.listen({
    host: 'localhost',
    port: 5555,
  }, ()=>{
    console.log('Server is listening on port ' + server.address().port + '....');
  });

// Broadcast function
const broadcast = (message, socketSent) => {
    if(message.toString() === 'quit'){
        const index = sockets.indexOf(socketSent); // indexes the element of socket from the array
        sockets.splice(index, 1); // removes a socket from array based off of index
    } else {
        sockets.forEach(socket => {
            if (socket !== socketSent) socket.write(message); // UTF-8 encoded message by default
        })
    }
}

