var http = require("http").createServer(handler);
var io = require("socket.io").listen(http); // socket.io for permanent connection between server and client
var fs = require("fs"); //var for file system
var firmata = require("firmata");
//var socket = io.connect("172.16.22.224:8080"); // create socket - connect to it

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
console.log("Connecting to Arduino");
console.log("Enabling Push Button on pin 2");
board.pinMode(2, board.MODES.INPUT);
console.log("Activation of Pin 13");
board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});

function handler (req,res) {
fs.readFile(__dirname+"/07.html",
function(err,data) {
if (err) {
res.writeHead(500,{"Content-Type":"text/plain"});
return res.end("Error loading html page.");
}
res.writeHead(200);
res.end(data);
});
}

http.listen(8080);

var sendValueViaSocket =function(){};

board.on("ready", function() {
io.sockets.on("connection", function(socket) {
console.log("Socket id: "+socket.id);
socket.emit("messageToClient","Srv connected, board OK");

sendValueViaSocket =function(value) {
io.sockets.emit("messageToClient", value);
}

});

board.digitalRead(2, function(value) {
if (value == 0) {
console.log("LED OFF");
board.digitalWrite(13, board.LOW);
console.log("Value = 0");
sendValueViaSocket(0);
}
if (value == 1) {
console.log("LED ON");
board.digitalWrite(13, board.HIGH);
console.log("Value = 1");
sendValueViaSocket(1);
}

});
});