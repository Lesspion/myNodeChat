var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var _ = require('underscore')._;
var fs = require('fs');

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    var content = fs.readFile(__dirname + '/public/Views/index.html', 'utf-8', function (err, data) {
        var template = _.template(data);
        res.write(template());
        res.end();
    });
});

io.sockets.on('connection', function (socket, pseudo) {
    var pseudo = pseudo;
    socket.on('noob', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        console.log(socket.pseudo);
        socket.broadcast.emit('all', 'Hey un p\'tit nouveau du nom de ' + socket.pseudo);
    });
    socket.on('news', function (msg) {
        console.log('ok pour news reception');
        var cur = socket.pseudo;
        socket.broadcast.emit('allMsg', {pseudo: cur, msg: msg});
    });
});

server.listen(8080);
console.log('Server is running at http://localhost:8080');