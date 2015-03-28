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
database_url = 'postgres://cutecat@localhost/cutecat';
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
    var num_cats; 
    function random_cat(){
        return Math.ceil(Math.random()*num_cats);
    }
    pg.connect(database_url, function(err,client,done) {
        var sql = "SELECT count(*) from cats";
        client.query(sql, function(err, result){
            done();
            if(err) console.error(err);
            num_cats = parseInt(result.rows[0].count);
            console.log(num_cats);
        });
    });
    socket.on('picked', function(data){
        var filename_split = data.filename.split('/');
        var filename = filename_split[filename_split.length-1];
        
        pg.connect(database_url, function(err, client, done) {
            var sql = "UPDATE cats SET times_picked = times_picked + 1 WHERE filename=$1 RETURNING times_picked";
            client.query(sql, [filename], function(err, result){
                done(); 
                if(err) console.error(err);
                var picked = {
                    times_picked:result.rows[0].times_picked,
                    side:data.side
                };
                io.sockets.emit('picked-count', picked);
            });
        });
        pg.connect(database_url, function(err, client, done) {
            /* randomly choose 2 cats from all the cats based on num of cats*/
            var newcats = [random_cat(), random_cat()];
            while(newcats[0] === newcats[1]){
                newcats[1] = random_cat();
            }
            var sql = "SELECT filename from cats WHERE cat_id IN ($1, $2)";
            client.query(sql, newcats, function(err, result){
                done();
                if(err) console.error(err);
                var cats = {
                    left: result.rows[0].filename,
                    right: result.rows[1].filename
                };

                io.sockets.emit('new-cats', cats);
            })
        })
    });
});
