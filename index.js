/**
 * index.js: back-end core
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 3700;
var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

// Routes

app.get("/", function (req, res) {
    res.render("page");
});

// Websocket listeners

io.sockets.on('connection', function (socket) {
    socket.emit('message', {
        message: 'Welcome to ChubbyChat!'
    });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
