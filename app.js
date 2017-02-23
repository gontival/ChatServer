var express = require('express')
 , app = express()
 , http = require('http')
, server = http.createServer(app)
, io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

// map a request for the root to the index.html file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//redirect the user to the default.html page if the URL does not include a file name
app.get('/', function (request, response) {
    response.redirect('default.html');
});

var usernames = {};

//suscribe to the socket.io events
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});

var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);