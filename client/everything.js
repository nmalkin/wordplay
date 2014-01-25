// No scoreboard handling or anything here yet, but this is totally a start.

function closeHandshake(letters, uid, timeRemaining) {
    // Do stuff with the data returned from the server by the handshake.
    // Stores the uid in a hidden form field and prints the available
    // letters to the page.
    //
    watchTheClock(timeRemaining);
    $( '[name="uid"]' ).val(uid);
    $( '.letters' ).append(letters); // Quick and dirty. TODO fix
}

var INTERVAL = 1000;
function watchTheClock(timeRemaining) {
    // Monitors time remaining and calls endGame() when time is out
    //
    endTime = new Date(Date.now()+timeRemaining);
    if(endTime <= Date.now()) {
        endGame();
    } else {
        window.setTimeout(function() {
             watchTheClock(timeRemaining - INTERVAL);
        }, INTERVAL);
    }
}

function postWord(f) {
    // Called when the form is submitted. Argument f is a function to
    // handle word confirmation/rejection from the server.
    //
    $( '#header' ).css('font-size', '1em');
    throw "Not implemented";
    var uid = $( 'name="uid"' ).val();
    var guess = $( 'name="guess"' ).val();
    // Send the uid and guess to the server here, calling f() with the
    // response data
    $( 'name="guess"' ).val("");    // Clear the text box
    // To override form submit action, must:
    return false;
}
function handleWordConfirmation(guess, wordIsValid) {
    // Do UI stuff with word confirmation info returned from the server.
    //
    // Again, quick and dirty. TODO: use actual css & markup
    if (!wordIsValid) {
        $( '.letters' ).append('<strike>'+guess+'</strike>');
    } else {
        $( '.letters' ).append(guess);
    }
}

function endGame() {
    // Probably scoreboard and new game init stuff going on here
    console.log('game ended');
}
