$(function() {



// COLOUR PICK IN PHOTOSHOP - GET A BETTER SET OF RAINBOW COLOURS!!!!! (violet is also too dark)

const simonGame = {};

// streak counter (how long was your longest correct sequence)
simonGame.counter = 0;

// keys is probably a bad name

    simonGame.squares = [
        {
            box: ".box0",
            color: "red"    
        },
        {
            box: ".box1",
            color: "yellow"
        },
        {
            box: ".box2",
            color: "blue"
        },
        {
            box: ".box3",
            color: "green"
        }
    ];


    
// click 'start' button

$('.start').on('click', function() {
    console.log(" >>> you clicked the start button!");

    // show message - "watch carefully!"
    $('.messages').text("Watch the sequence carefully!");

    simonGame.makeSequence();
    simonGame.playSequence();

    // make button disappear
    $(this).toggleClass('toggleDisplay');

    // make 'continue' button appear - will prob have to move this to after the user clicks a sequence
    $('.continue').toggleClass('toggleDisplay');
});


simonGame.sequence = [];  // array of numbers, which should be index # on keys array

simonGame.makeSequence = function() {
    for (let i = 0; i < 4; i++) {
        const num = Math.floor(Math.random() * simonGame.squares.length);
        simonGame.sequence.push(num); //refactor later or dont
        console.log("logging from sequencer(): ", num);
    }
    console.log("whole sequence: ", simonGame.sequence);
};


// function to run the sequence on the html page
simonGame.playSequence = function() { 
    simonGame.sequence.forEach(function(item, i) {
        // log sequence
        console.log(item, simonGame.squares[item]);
    
        // here the sequence actually runs
        const square = simonGame.squares[item].box;
        const color = simonGame.squares[item].color;
        setTimeout(function() {
            $(square).css('background', color);
            setTimeout(function() {
                $(square).css('background', 'black');
            }, 800);
        }, i * 1600);
    })
    
    setTimeout(function() {
        $('.messages').text("Now it's your turn!");
        $('.box').toggleClass('click-enabled');
    }, 1600 * 4);
}

// user has to click the buttons in the correct sequence
    // it needs a way to remember sequence of use clicks
    // maybe this would go on an array, then compare it against array of original sequence

    simonGame.userSequence = [];

    simonGame.userClicks = 0;
    // function to grab clicks and put on userSequence array
    $('.game-container').on('click', '.click-enabled', function() {
        const classNames = $(this).attr('class');

        // grab the right class name using regex
        const boxChecker = /[0-9]/;
        const boxMatch = boxChecker.exec(classNames);
        simonGame.userSequence.push(parseInt(boxMatch[0]));
        
        simonGame.userClicks++;
        
        if (simonGame.userClicks >= 4 ) {
            simonGame.compareArrays();
        };
        
    })

    
    
    
    // compare user array to sequence array
    // first, compare array lengths - if they don't match - lose
    simonGame.compareArrays = function() {
        console.log("sequence:", simonGame.sequence);
        console.log("user sequence: ", simonGame.userSequence);
        for (let i = 0; i < simonGame.userSequence.length; i++) {
            if (simonGame.userSequence[i] === simonGame.sequence[i]) {
                console.log(simonGame.userSequence[i], simonGame.sequence[i]);
            } else {
                $('.messages').text("That was the wrong sequence. Game over!");
                simonGame.resetGame();
                $('.start').text('Play again?').toggleClass('toggleDisplay');
                return false;
            }
        }
        $('.messages').text("Great Job! Play again?");
        simonGame.resetGame();
        $('.start').toggleClass('toggleDisplay');
    } 


    simonGame.resetGame = function() {
        $('.box').toggleClass('click-enabled');
        simonGame.sequence = [];
        simonGame.userSequence = []; 
    }

});


