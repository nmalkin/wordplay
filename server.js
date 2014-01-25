var express = require('express'),
    async = require('async'),
    app = express();

// load the list of words
var fs = require('fs');
var validWords = fs.readFileSync('english_all.txt').toString().split("\n");

// TODO: remove possessive words (words that end with "'s" from validWords


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

// returns to the client a new client ID (randomly generates & also makes sure
// it isn't in use already
function register() {

}

// returns to the client their game state
function getGame(clientId) {

}

// web callback functions ======================================================

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/register', function(req, res)) {
	res.send(register());
}

app.get('/words', function(req, res) {
	for (var word in array) {
		res.send(word + "\n");
	}
});

app.listen(80);