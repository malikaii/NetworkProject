const net = require('net');
// uses readline module to produce commandline input and output
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//asynchronous function that waits for username code from cmdline input
const waitForUsername = new Promise(resolve => {
    readLine.question('Enter your username: ', response => {
        resolve(response);
    })
});

waitForUsername.then(username => {
    //establishign server connection using connect object
    const socket = net.connect({
        port: 5555, 
    })

    socket.on('connect', () => {
        socket.write(`${username} joins chatroom.`);
        console.log("Connection established");
    }); // when the connection is made, use event emitter to return success message

    readLine.on('line', input => {
        if (input === 'quit'){
            socket.write(`${username} has left the chatroom.`)
            socket.setTimeout(1000);
        } else {
            socket.write(`${username}: ${input}`)
        }
    });

    socket.on('data', data => {
        console.log('\x1b[33m%s\x1b[0m', data);
    })

    socket.on('timeout', () => {
        socket.write('quit');
        socket.end();
    })

    socket.on('end', () => {
        process.exit(); //Allows node to close program
    })

    socket.on('error', () => {
        console.log('The server seems to have been shut down');
    })
    
})