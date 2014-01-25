﻿var express = require('express'),
    async = require('async'),
    app = express();

// load the list of words
var fs = require('fs');
var validWords = fs.readFileSync('english_all.txt').toString().split("\n");

// TODO: remove possessive words (words that end with "'s" from validWords


// starts a new game on the server (Clears all the state and picks new letters)
function newGame() {

	// TODO: 1. clear all the state
	
	// TODO: 2. pick new letters
	
	// TODO: 3. notify all clients (is this needed?)

}

// called when a client wants to check if they got the word correctly
function checkWord(clientId, word) {

	// TODO: get the client's old score

	// TODO: check the word against the wordlist

	return {
		correct: true,
		oldScore: 0,
		newScore: 0, // TODO: insert the new score
		allFoundWords: []
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

app.get('/words', function(req, res) {
	for (var word in array) {
		res.send(word + "\n");
	}
});

app.listen(80);