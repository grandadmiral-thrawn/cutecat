var express = require('express');
var app = express();
var port = process.env.PORT || 3700;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.get("/", function (req, res) {
    res.render("page");
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Chubbins Chat Co. welcomes you!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
