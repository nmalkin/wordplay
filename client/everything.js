// No scoreboard handling or anything here yet, but this is totally a start.

$("form").submit(function(e) {
    e.preventDefault();
});

function register(uid) {
    // Do stuff with the data returned from the server by the handshake.
    // Stores the uid in a hidden form field and prints the available
    // letters to the page.
    //
    $( '[name="uid"]' ).val(uid);
}

function newGame(letters, timeRemaining){
    watchTheClock(timeRemaining);
    $( '#letters ul' ).empty();
    for (var i = 0; i<letters.length; ++i) {
        $( '#letters ul' ).append('<li>'+letters.charAt(i)+'</li>');
    }
}

var INTERVAL = 1000;
function watchTheClock(timeRemaining) {
    // Monitors time remaining and calls endGame() when time is out
    //
    $( '#time .num' ).empty().append(Math.floor(timeRemaining/1000));
    endTime = new Date(Date.now()+timeRemaining);
    if(endTime <= Date.now()) {
        endGame();
    } else {
        window.setTimeout(function() {
             watchTheClock(timeRemaining - INTERVAL);
        }, INTERVAL);
    }
}

function postWord() {
    // Called when the form is submitted. Argument f is a function to
    // handle word confirmation/rejection from the server.
    //
    var uid = $( '[name="uid"]' ).val();
    var guess = $( '[name="guess"]' ).val();

    checkWord(uid, guess);

    $( '[name="guess"]' ).val("");    // Clear the text box
    $( '#guesses ul').prepend('<li>'+guess+'</li>');
}
function handleWordConfirmation(wordIsValid) {
    if (!wordIsValid) {
        $( '#guesses ul li:first-child' ).addClass('wrong');
    }
}

function endGame() {
    // Probably scoreboard and new game init stuff going on here
    console.log('game ended');
}
