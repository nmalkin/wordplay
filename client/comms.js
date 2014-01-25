var DEBUG = true;
var PORT = 8889;
var socket = new SockJS('http://localhost:' + PORT + '/client-connect');

var log = function(message) {
    if(DEBUG) {
        console.log(message);
    }
};

socket.onopen = function() {
    log('connection opened');
    socket.send('register');
};

socket.onmessage = function(message) {
    log('received data: ' + message);
    var data = message.data;
};

socket.onclose = function() {
    log('connection closed');
};
