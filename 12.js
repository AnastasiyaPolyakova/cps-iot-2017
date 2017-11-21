var http = require("http").createServer(handler);
var io = require("socket.io").listen(http); // socket.io for permanent connection between server and client
var fs = require("fs"); // variable for file system
var firmata = require("firmata");


var board = new firmata.Board("/dev/ttyACM0", function() { // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Priključitev na Arduino");
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    board.digitalWrite(2,1); // initialization of digital pin 2 to rotate Left on start
    board.digitalWrite(4,0); // initialization of digital pin 2 to rotate Left on start
});


function handler(req, res){
    fs.readFile(__dirname + "/12.html",
    function(err, data){
        if(err){
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
        res.writeHead(200);
        res.end(data);
    });
}

 var last_value = null;
     var last_sent = null;
    
board.on("ready", function ()
{
    http.listen(8080); // server will listen on port 8080

    io.sockets.on("connection", function(socket)
    {
        console.log("Priključitev na Arduino");
        socket.on("sendPWM", function(pwm){
            board.analogWrite(3,pwm);
    
            socket.emit("messageToClient", "PWM set to: " + pwm);        
        });
        
        socket.on("left", function(value){
            board.digitalWrite(2,value.AIN1);
            board.digitalWrite(4,value.AIN2);
            socket.emit("messageToClient", "Direction: left");
        });
        
        socket.on("right", function(value){
            board.digitalWrite(2,value.AIN1);
            board.digitalWrite(4,value.AIN2);
            socket.emit("messageToClient", "Direction: right");
        });
        
       socket.on("stop", function(value){
            board.analogWrite(3,value);
            socket.emit("messageToClient", "STOP");
        });
     
    });
   
});