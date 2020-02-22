"use strict";
let express = require('express'),
    cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io'),
    sio_redis = require('socket.io-redis'),
    https = require('https'),
    farmhash = require('farmhash'),
    fs = require('fs');
const httpsConfig = require('./www/config/CfHttps');
let num_processes = require('os').cpus().length;
let CfApp = require('./www/config/CfApp');
let stringUtils = require('./www/utils/StringUtils');

exports.BASE_DIR = __dirname;
exports.EXPRESS = express;

let i;
if (cluster.isMaster) {
    let workers = [];
    let spawn = function (i) {
        i = Number(i);
        workers[i] = cluster.fork();
        workers[i].on('exit', function () {
            spawn(i);
        });
    };

    for (i = 0; i < num_processes; i++) {
        spawn(i);
    }

    let worker_index = function (ip, len) {
        return farmhash.fingerprint32(stringUtils.listCharacter()[i]) % Number(len); // Farmhash is the fastest and works with IPv6, too
    };

    let server = net.createServer({pauseOnConnect: true}, function (connection) {
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(CfApp.post, CfApp.host);

    let io = sio(server);
    io.adapter(sio_redis({host: 'localhost', port: 6379}));
    require('./www/system')(io);
} else {
    let server;
    let app = new express();

    if (httpsConfig.status) {
        app.use(function (req, res, next) {
            if (!/https/.test(req.protocol)) {
                res.redirect("https://" + req.headers.host + req.url);
            } else {
                return next();
            }
        });

        const options = {
            key: fs.readFileSync(__dirname + httpsConfig.key),
            cert: fs.readFileSync(__dirname + httpsConfig.cert),
            ca: fs.readFileSync(__dirname + httpsConfig.ca),
        };
        https.createServer(options, app).listen(443);
        server = app.listen(0, CfApp.host);
    } else {
        server = app.listen(0, CfApp.host);
    }
    let io = sio(server, {'pingInterval': 2000, 'pingTimeout': 5000});

    io.adapter(sio_redis({host: 'localhost', port: 6379}));
    let socket = require('./www/socket/socket');
    socket(io);

    process.on('message', function (message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        server.emit('connection', connection);
        connection.resume();
    });
    process.setMaxListeners(0);

    let config = require('./www/config/config');
    config(app, io);

    let routing = require('./www/config/router/Routing');
    routing.mainHandel(app, io);


    let localsRouting = require('./www/locals/LocalsRouting');
    localsRouting(app);
}