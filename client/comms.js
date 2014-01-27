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
    log('received data: ' + message.data);
    var data = JSON.parse(message.data);
    if(! ('type' in data)) {
        console.log('received bad data from the server');
        return;
    }

    var payload = data.data;
    switch(data.type) {
        case 'gameInfo':
            var uid = 'TEST';
            closeHandshake(payload, uid, payload.timeleft * 10000);
            break;
        case 'checkWordResult':
            break;
    }
};

socket.onclose = function() {
    log('connection closed');
};
