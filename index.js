/**
 * index.js: back-end core
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 3700;
var io = require('socket.io').listen(app.listen(port));
var pg = require('pg');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

// Routes

app.get("/", function (req, res) {
    res.render("page");
});

app.get('/db', function (req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query('SELECT * FROM test_table', function (err, result) {
            done();
            if (err) console.error(err);
            res.send(result.rows);
        });
    });
});

// Websocket listeners

io.sockets.on('connection', function (socket) {
    socket.emit('message', {
        message: 'Welcome to CuteCat!'
    });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
