var HTTP_PORT = 8888;
var WEBSOCKET_PORT = 8889;

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
                // store that uid somewhere
                conn.write(JSON.stringify({ type: 'registration', data: {uid: newId()} }));
                // todo
                // return current game time left, valid letters in current game
                var _gameInfo = {
                    timeleft: 10, // If negative then time to next game
                    letters: "nagaram"
                };
                conn.write(JSON.stringify({ type: 'gameInfo', data: _gameInfo }));
                break;
            case "checkword":
                if (atoms.length != 3)
                {
                    conn.write("ERROR: Could not parse message:" + message);
                } else
                {
                    var obj = checkWord(player.id, atoms[1]);
                    conn.write(JSON.stringify({ type: 'checkWordResult', data: obj}));
                }
                break;
        }
    });
});

// Now connect the sockjs server to the http server on a specific port
var server = http.createServer();
sockjs_client_connect.installHandlers(server, { prefix: '/client-connect' });
server.listen(process.env.PORT + 1|| WEBSOCKET_PORT); // Listen on the given port number


// load the list of words
//  var fs = require('fs');
//  var validWords = fs.readFileSync('english_all.txt').toString().split("\n");
console.log('Loading words');
var anagrams = require('./dict/english_all.json');
var validWords = Object.keys(anagrams);
console.log('... done.');

var currentWord = "";
var clients = {};
var gameTime = new Date();
var gameLength = 60 /* seconds */ ;

function sortLetters(word) { return word.split('').sort().join(''); }

function getAnagrams(word) {
	// 1. sort the letters
	var sortedwords = {};
	for (var i = 0; i < validWords.length; ++i)
	{
		var w = validWords[i];
		var sortedword = sortLetters(w);
		if (sortedwords[sortedword] == undefined)
			sortedwords[sortedword] = new Array();
		sortedwords[sortedword].push(w);
	}
	//console.log(sortedwords);
	/*
	var anagrams = [];
	var wc = sortLetters(word);
	console.log(word);
	console.log(sortedwords);
	while (wc.length >= 3)
	{
		if (sortedwords[wc] != undefined) {
			console.log(wc, sortedwords[wc]);
			for (var i = 0; i < sortedwords[wc].length; ++i) {
				var w = sortedwords[wc][i];
				anagrams.push(w);
			}
		}
		wc = wc.substring(0, wc.length - 1);
	}
	*/
	return anagrams;
}

function arrayRemoveIndex(array, index)
{
	var newArray = new Array();
	for (var i = 0; i < index; ++i)
		newArray[i] = array[i];
	for (var i = index; i < array.length; ++i)
		newArray[i-1] = array[i];
	return newArray;
}

function isAnagramOfCurrentWord(word)
{
	console.log(word);

	var array1 = word.split('');
	var array2 = currentWord.split(''); 
	var i=0, j=0;
	while (i < array1.length)
	{
		j = array2.indexOf(array1[i]);
		if (j >= 0)
			array2 = arrayRemoveIndex(array2, j);
		else 
			return false; // user used an invalid letter
		++i;
	}
	
	if (validWords.indexOf(word) >= 0) {
		return true;
	}
	return false;
}


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
	console.log("newGame");
	// 1. clear all the state
	clients = new Array();
	
	// 2. pick new letters
	var numLetters = 15;
	var allLetters = "";
	while (allLetters.length < numLetters) {
		// get a list of possible words that would bring us closer to our goal of numLetters letters
		var availableWords = validWords.filter(function(element, index, array) { 
			return (element.length + allLetters.length <= numLetters); 
		});
		
		if (availableWords.length < 1)
			availableWords = "abcdefghijklmnopqrstuvwxyz".split('');
		
		// append a random word from the list of available words
		var i = Math.floor(Math.random() * availableWords.length);
		allLetters += availableWords[i];
	}
	
	// TODO: 3. notify all clients (is this needed?)
	currentWord = allLetters;
	console.log(currentWord);
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
		_curScore = word.length;
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
		foundWords: new Array()
	};
	clients[_id] = (_player);
	return _player;
}

// returns to the client their game state
function getGame(clientId) {
    return clients[id];
}

// web callback functions ======================================================
app.use(express.static(__dirname + '/client'));

/*
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

*/

app.listen(process.env.PORT || HTTP_PORT);
