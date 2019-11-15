const simonGame = {};

// streak counter (how long was your longest correct sequence)
simonGame.highScore = 0;

simonGame.squares = [
    {
        box: '.box0',
        color: '#ff00ff'    
    },
    {
        box: '.box1',
        color: '#ff0000'
    },
    {
        box: '.box2',
        color: '#ff6600'
    },
    {
        box: '.box3',
        color: '#ffee00'
    },
    {
        box: '.box4',
        color: '#00ff00'
    },
    {
        box: '.box5',
        color: '#0099ff'
    },
    {
        box: '.box6',
        color: '#4400ff'
    },
    {
        box: '.box7',
        color: '#9900ff'
    }
];


// click 'start' button

$('button').on('click', function() {
    console.log(' >>> you clicked the start button!');

    $('.message').text('Watch the sequence carefully!');

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
        console.log('logging from sequencer(): ', num);
    }
    console.log('whole sequence: ', simonGame.sequence);
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
        $('.message').toggleClass('toggleDisplay').text(`Now it's your turn!`);
        $('.box').toggleClass('clickEnabled');
    }, 1600 * simonGame.sequence.length);
}

simonGame.userSequence = [];
simonGame.userClicks = 0;

// function to grab clicks and put on userSequence array
$('.gameContainer').on('click', '.clickEnabled', function() {
    const classNames = $(this).attr('class');

    // grab the right class name using regex
    boxNumber = classNames.match(/[0-9]/);
    simonGame.userSequence.push(parseInt(boxNumber[0]));

    $(this).css('background', `${simonGame.squares[boxNumber[0]].color}`);
    setTimeout(() => {
        $(this).css('background', 'black');
        console.log($(this));
    }, 300);
    
    simonGame.userClicks++;
    if (simonGame.userClicks >= simonGame.sequenceLength ) {
        simonGame.compareSequences();
    };
})

simonGame.chances = 0;
    
// compare user array to sequence array
simonGame.compareSequences = function() {

    // logging the two arrays
    console.log('sequence:', simonGame.sequence);
    console.log('user sequence: ', simonGame.userSequence);

    simonGame.chances++;
    console.log(simonGame.chances);
    
    for (let i = 0; i < simonGame.userSequence.length; i++) {
        if (simonGame.userSequence[i] === simonGame.sequence[i]) {
            console.log(simonGame.userSequence[i], simonGame.sequence[i]);
        } else if (simonGame.chances === 1) {
            // second chance
            $('.message').text(`That was the wrong sequence. You get one more chance. Watch carefully!`);
            // reset user clicks & sequence
            simonGame.userClicks = 0;
            simonGame.userSequence = [];
            // toggle off box clicking
            $('.box').toggleClass('clickEnabled');
            
            // give user a slight delay
            setTimeout(function() {
                simonGame.playSequence();
            }, 1500);
            return false;
        } else {
            // GAME OVER
            $('.message').text(`That was the wrong sequence. Game over!`);
            simonGame.resetGame();
            simonGame.sequenceLength = 3;
            $('button').text('Play again?').toggleClass('toggleDisplay');
            return false;
        }
    }
    $('.message').text(`Great Job! Play again?`);
    simonGame.highScore = simonGame.sequenceLength;

    // high score will reset if window refreshes
    $('.highScore').text(`Your longest sequence is: ${simonGame.highScore}`);
    simonGame.sequenceLength++;
    simonGame.resetGame();
    $('button').toggleClass('toggleDisplay');
} 

// reset game for starting a new game/round, doesn't reset high score
simonGame.resetGame = function() {
    $('.box').toggleClass('clickEnabled');
    simonGame.sequence = [];
    simonGame.userSequence = []; 
    simonGame.userClicks = 0;
    simonGame.chances = 0;
}

// DEAL WITH THISSSSSS !!!!!!!!!!!!!
// document ready - not sure what to put in here, maybe event handlers?
$(document).ready(function() {

});


// Due to the delay, user has to wait for the message to change to "Now it's your turn!" before clicking, otherwise it won't work 
    // make an overlay with 3..2..1.. countdown that grays out squares & goes on top of the boxes

// DESIGN/UI - ask Fatima

// grid & flexbox used together - ask Helpcue

// code organization / functional programming / clean up code
