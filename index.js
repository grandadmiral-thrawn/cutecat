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
    /*All the functions and variables in here are in the lexical scope of the io.sockets.on function which takes socket as an arguement*/

    var num_cats; 
    

    function random_cat(){
        /* returns a random number between 1 and number of cats*/
        return Math.ceil(Math.random()*num_cats);
    }
    
    function update_cats(){
        /* updates the cat clicked count in the database*/
        pg.connect(database_url, function(err, client, done) {
            
            /* randomly choose 2 cats from all the cats based on num of cats*/
            var newcats = [random_cat(), random_cat()];
            // if the same cat is chosen for both, re run it
            while(newcats[0] === newcats[1]){
                newcats[1] = random_cat();
            }
            var sql = "SELECT filename from cats WHERE cat_id IN ($1, $2)";
            // this is like cur.execute, and it returns a response we assign to "newcats"
            client.query(sql, newcats, function(err, result){
                done();
                if(err) console.error(err);
                // the variable cats is a dictionary to get the left and right cats
                var cats = {
                    left: result.rows[0].filename,
                    right: result.rows[1].filename
                };
                //the new cats are given back to the webpage
                io.sockets.emit('new-cats', cats);
            });
        });

    }
    
    pg.connect(database_url, function(err,client,done) {
        /*This is a function that counts the number of cats*/
        var sql = "SELECT count(*) from cats";
        client.query(sql, function(err, result){
            done();
            if(err) console.error(err);
            num_cats = parseInt(result.rows[0].count);
            console.log(num_cats);
        });
    });
    
    socket.on('picked', function(data){
        /* the functions in here are execute when a cat is clicked*/
        var filename_split = data.filename.split('/');
        var filename = filename_split[filename_split.length-1];
        
        pg.connect(database_url, function(err, client, done) {
            // update the cat count in the database
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
        
        /*after a cat is picked we can run this again*/
        update_cats();
    });
});
