﻿var express = require('express')
 , app = express()
 , http = require('http')
, server = http.createServer(app)
, io = require('socket.io').listen(server);

app.use(__dirname + '/public');