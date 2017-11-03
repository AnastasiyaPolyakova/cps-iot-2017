var http = require("http").createServer(handler); // on req - hand
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // pin13 as out
    board.pinMode(8, board.MODES.OUTPUT); // pin8 as out
    board.pinMode(9, board.MODES.OUTPUT); // pin13 as out
    board.pinMode(12, board.MODES.OUTPUT); // pin8 as out
});

function handler(req, res) {
    fs.readFile(__dirname + "/assignment05.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

http.listen(8080); // server will listen on port 8080

io.sockets.on("connection", function(socket) {
    socket.on("commandToArduino", function(commandNo){
        if (commandNo == 0) {
            board.digitalWrite(13, board.LOW); // write LOW on pin 13
        }
        if (commandNo == "1") {
            board.digitalWrite(13, board.HIGH); // write HIGH on pin 13
        }
        if (commandNo == "2") {
            board.digitalWrite(8, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "3") {
            board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        }     
         if (commandNo == 4) {
            board.digitalWrite(9, board.LOW); // write LOW on pin 13
        }
        if (commandNo == "5") {
            board.digitalWrite(9, board.HIGH); // write HIGH on pin 13
        }
        if (commandNo == "6") {
            board.digitalWrite(12, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "7") {
            board.digitalWrite(12, board.HIGH); // write HIGH on pin 8
        }     
         if (commandNo == "8") {
            board.digitalWrite(12, board.LOW); // write LOW on pin 8
             board.digitalWrite(13, board.LOW); // write LOW on pin 8
              board.digitalWrite(8, board.LOW); // write LOW on pin 8
               board.digitalWrite(9, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "9") {
            board.digitalWrite(12, board.HIGH); // write HIGH on pin 8
              board.digitalWrite(13, board.HIGH); // write HIGH on pin 8
                board.digitalWrite(9, board.HIGH); // write HIGH on pin 8
                  board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        }     
    });
});


