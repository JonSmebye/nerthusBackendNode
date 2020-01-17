const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('../src/models/queries.ts');
const controllers = require('../src/controllers/controller.ts');
var WebSocketServer = require('websocket').server;
var http = require('http');
const wsLogic = require('../src/controllers/webSocketLogic.ts');

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

var server = http.createServer(function(request,response) {
    console.log((new Date())+ ' Recieved request for ' + request.url);
    response.writeHead(404);
    response.end();
})

server.listen(8080,function() {
    console.log((new Date()) + ' Server is listening on port 8080');
})

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and postrgres API' })
});

app.post('/beaconSignal', (request,response) => {
    response.send('Success')
    controllers.recieveBeaconSignalsFromRpiAndAddToBeaconClass(request);
});

app.get('/beaconData', (request, response) => {
    response.send(JSON.stringify(controllers.bleTagSonePositionList))
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

wsServer.on('request', function(request){
    if (!wsLogic.originIsAllowed(request.origin)){
        request.reject();
        console.log((new Date()) + ' Connection from origin' + request.origin +' rejected');
        return;
    }
    var Connection = request.accept('echo-protocol',request.origin);
    console.log((new Date())+ ' Connection accepted. ');
    Connection.on('message', function(message){
        console.log(message)
        var mess = JSON.stringify(controllers.bleTagSonePositionList);
        Connection.send(mess);
    });
    Connection.on('close', function(reasonCode, description){
        console.log((new Date()) + ' Peer ' + Connection.remoteAddress + ' disconnected' );
    });
});