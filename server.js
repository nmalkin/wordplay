var express = require('express'),
	async = require('async'),
	app = express(),
    http = require('http'),
    sockjs = require('sockjs');

// Array of client information, indexed by client player ID
var clients = {};
// Array of clients indexed by socket connection ID
var clientsByConnection = {};

// create a sockjs server to handle incoming client requests
var sockjs_client_connect = sockjs.createServer();
sockjs_client_connect.on('connection', function (conn) {

    console.log('connection' + conn);
    var player = register();
    player.socket = conn;
    clientsByConnection[conn.id] = player;

    conn.on('close', function () {
        console.log('close ' + conn);
        // remove the client from our arrays
        var player = clientsByConnection[conn.id];
        delete clients[player.id];
        delete clientsByConnection[conn.id];
    });

    conn.on('data', function (message) {
        console.log('message ' + conn,
                    message);
        var player = clientsByConnection[conn.id];
        atoms = message.split(";");
        if (atoms.length)
        switch (atoms[0]) {
            case "register":
                // todo
                // return current game time left, valid letters in current game
                break;
            case "checkword":
                if (atoms.length != 2)
                {
                    conn.write("Could not parse message:" + message);
                } else
                {
                    conn.write(checkWord(player.id, atoms[1]));
                }
                break;
        }
    });
});

// Now connect the sockjs server to the http server on a specific port
var server = http.createServer();
sockjs_client_connect.installHandlers(server, { prefix: '/clientConnect' });
server.listen(process.env.PORT); // Listen on the given port number


// load the list of words
//  var fs = require('fs');
//  var validWords = fs.readFileSync('english_all.txt').toString().split("\n");
console.log('Loading words');
var validWords = require('./dict/english_all.json');
console.log('... done.');

var currentWord = "";

// utility function to shuffle an array
function shuffle(array) {
	var currentIndex = array.length
		, temporaryValue
		, randomIndex
		;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// gets a new ID which can be used to identify a client
function newId() { 
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

// starts a new game on the server (Clears all the state and picks new letters)
function newGame() {

	// TODO: 1. clear all the state
	clients = new Array();
	
	// TODO: 2. pick new letters
	var numLetters = 15;
	
	
	// TODO: 3. notify all clients (is this needed?)

}

// called when a client wants to check if they got the word correctly
function checkWord(clientId, word) {

	var player = clients[clientId];

	var _oldScore = player.score;
	var _curScore = 0;
	
	// TODO: check the word against the list of valid words
	var isValidWord = false;
	if (validWords.indexOf(word) >= 0)
	{
		_curScore = length(word);
	}
	
	// TODO: update the player's score on the server side
	// player.score = _oldScore + _curScore;
	
	// TODO: update the list of words that the player found
	// player.foundWords.append(word);
	
	// TODO: save the player object if necessary (probably not until later, if we are using a database)
	
	return {
		correct: isValidWord,
		newScore: player.score, 
		allFoundWords: player.foundWords
	};
}

// returns to the client a new client ID (randomly generated)
function register() {
    var _id = newId();
    var _player = {
		id: _id,
		score: 0,
		foundWords: new Array(),
        socket: 0
	};
	clients[_id] = (_player);
	return _player;
}

// returns to the client their game state
function getGame(clientId) {
    return clients[id];
}

// web callback functions ======================================================

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/register', function(req, res) {
	res.send(register());
});

app.get('/listPlayers', function(req, res) {
	//res.send("Players: " + clients.length);
	res.send(clients);
});

app.get('/words', function(req, res) {
	for (var word in array) {
		res.send(word + "\n");
	}
});

app.listen(process.env.PORT);
