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

io.sockets.on('connection', function (socket) {
    socket.on('noob', function (pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('all', socket.pseudo + ' vient de se connecter.');
    });
    socket.on('news', function (msg) {
        var cur = socket.pseudo;
        console.log(cur);
        socket.broadcast.emit('allMsg', {pseudo: cur, msg: msg});
    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('clientDisconnect', socket.pseudo + ' vient de se déconnecter');
    })
});

server.listen(8080);
console.log('Server is running at http://10.34.1.15:8080');