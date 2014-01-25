var DEBUG = TRUE;
var PORT = 8888;
var socket = new SockJS('http://localhost:' + PORT + '/client-connect');

var log = function(message) {
    if(debug) {
        console.log(message);
    }
};

socket.onopen = function() {
    log('connection opened');
    socket.send('register');
};

sock.onmessage = function(message) {
    log('received data: ' + message);
    var data = message.data;
};

sock.onclose = function() {
    log('connection closed');
};
