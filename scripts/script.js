$(function() {



// COLOUR PICK IN PHOTOSHOP - GET A BETTER SET OF RAINBOW COLOURS!!!!! (violet is also too dark)

const simonGame = {};

// streak counter (how long was your longest correct sequence)
simonGame.highScore = 0;

// keys is probably a bad name

    simonGame.squares = [
        {
            box: ".box0",
            color: "magenta"    
        },
        {
            box: ".box1",
            color: "red"
        },
        {
            box: ".box2",
            color: "orange"
        },
        {
            box: ".box3",
            color: "yellow"
        },
        {
            box: ".box4",
            color: "green"
        },
        {
            box: ".box5",
            color: "blue"
        },
        {
            box: ".box6",
            color: "indigo"
        },
        {
            box: ".box7",
            color: "rebeccapurple"
        }
    ];


    
// click 'start' button

$('.start').on('click', function() {
    console.log(" >>> you clicked the start button!");

    $('.message').text("Watch the sequence carefully!");

    simonGame.makeSequence();
    simonGame.playSequence();

    // make button disappear
    $(this).toggleClass('toggleDisplay');

    // make 'continue' button appear - will prob have to move this to after the user clicks a sequence
    $('.continue').toggleClass('toggleDisplay');
});


simonGame.sequenceLength = 3;
simonGame.sequence = [];  

simonGame.makeSequence = function() {
    for (let i = 0; i < simonGame.sequenceLength; i++) {
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
        $('.message').text("Now it's your turn!");
        $('.box').toggleClass('click-enabled');
    }, 1600 * simonGame.sequence.length);
}

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
        if (simonGame.userClicks >= simonGame.sequenceLength ) {
            simonGame.compareSequences();
        };
    })

    
    
    
    // compare user array to sequence array
    // first, compare array lengths - if they don't match - lose
    simonGame.compareSequences = function() {
        console.log("sequence:", simonGame.sequence);
        console.log("user sequence: ", simonGame.userSequence);
        for (let i = 0; i < simonGame.userSequence.length; i++) {
            if (simonGame.userSequence[i] === simonGame.sequence[i]) {
                console.log(simonGame.userSequence[i], simonGame.sequence[i]);
            } else {
                $('.message').text("That was the wrong sequence. Game over!");
                simonGame.resetGame();
                simonGame.sequenceLength = 3;
                $('.start').text('Play again?').toggleClass('toggleDisplay');
                return false;
            }
        }
        $('.message').text("Great Job! Play again?");
        simonGame.highScore = simonGame.sequenceLength;

        // high score will reset if window refreshes
        $('.high-score').text(`Your longest sequence is: ${simonGame.highScore}`);
        simonGame.sequenceLength++;
        simonGame.resetGame();
        $('.start').toggleClass('toggleDisplay');
    } 


    simonGame.resetGame = function() {
        $('.box').toggleClass('click-enabled');
        simonGame.sequence = [];
        simonGame.userSequence = []; 
        simonGame.userClicks = 0;
    }

});


