const simonGame = {};

simonGame.boxes = [
    {
        box: '.box0',
        color: 'coloredBox0', 
        clickColor: 'clickEnabledBox0',  
    },
    {
        box: '.box1',
        color: 'coloredBox1', 
        clickColor: 'clickEnabledBox1'
    },
    {
        box: '.box2',
        color: 'coloredBox2', 
        clickColor: 'clickEnabledBox2'
    },
    {
        box: '.box3',
        color: 'coloredBox3', 
        clickColor: 'clickEnabledBox3'
    },
    {
        box: '.box4',
        color: 'coloredBox4', 
        clickColor: 'clickEnabledBox4'
    },
    {
        box: '.box5',
        color: 'coloredBox5', 
        clickColor: 'clickEnabledBox5'
    },
    {
        box: '.box6',
        color: 'coloredBox6', 
        clickColor: 'clickEnabledBox6'
    },
    {
        box: '.box7',
        color: 'coloredBox7', 
        clickColor: 'clickEnabledBox7'
    }
];

simonGame.sequenceLength = 3;
simonGame.sequence = []; 
simonGame.userSequence = [];
simonGame.userClicks = 0;
simonGame.chances = 2; // user starts off with 2 chances
simonGame.highScore = 0;

// METHODS -------------------------------------------//
// function to start game/new round
simonGame.startNewRound = function() {
    $('.instructions').addClass('displayNone');   
    simonGame.showOverlayMessage(`Watch the sequence carefully!`);
    setTimeout(function() {
        $('.overlayMessageContainer').addClass('displayNone');
        simonGame.makeSequence();
        simonGame.playSequence();
    }, 800)    
}

// function to create the sequence
simonGame.makeSequence = function() {
    for (let i = 0; i < simonGame.sequenceLength; i++) {
        const randomNum = Math.floor(Math.random() * simonGame.boxes.length);
        simonGame.sequence.push(randomNum); 
    }
    console.log('whole sequence: ', simonGame.sequence);
};

// function to run the sequence on the html page
simonGame.playSequence = function() { 
    simonGame.sequence.forEach(function(item, i) {
        const boxNum = simonGame.boxes[item].box;
        const boxColor = simonGame.boxes[item].color;
        console.log(boxNum, boxColor);
        
        // boxes 'light up'
        setTimeout(function() {            
            $(boxNum).addClass(boxColor);           
            setTimeout(function() {            
                $(boxNum).removeClass(boxColor);
            }, 800);
        }, i * 1600);
        simonGame.addClickColors(); // adding colours for when user clicks
    })
    
    setTimeout(function() {
        simonGame.showOverlayMessage(`Now it's your turn!`);
        setTimeout(function() {
            simonGame.hideOverlayMessage();
            $('.overlay').addClass('displayNone'); // hide overlay to allow clicking
            $('.box').addClass('clickEnabled');
        }, 800)
    }, 1600 * simonGame.sequence.length);
}

// function to enable colour-changing on boxes when clicked
simonGame.addClickColors = function() {
    simonGame.boxes.forEach(function(item) {
        $(item.box).addClass(item.clickColor);
    })
}

// function to disable colour-changing on boxes when clicked
simonGame.removeClickColors = function() {
    simonGame.boxes.forEach(function(item) {
        $(item.box).removeClass(item.clickColor);
    })
}

simonGame.showOverlayMessage = function(message) {
    $('.overlayMessageContainer').removeClass('displayNone');
    $('.overlayMessage').text(message);
}

simonGame.hideOverlayMessage = function() {
    $('.overlayMessageContainer').addClass('displayNone');
}

// function to compare user array to sequence array
simonGame.compareSequences = function() {

    console.log('sequence:', simonGame.sequence);
    console.log('userSequence:', simonGame.userSequence);

    simonGame.removeClickColors();
    simonGame.chances--; // user used up a chance
    
    for (let i = 0; i < simonGame.userSequence.length; i++) {
        if (simonGame.userSequence[i] !== simonGame.sequence[i] && simonGame.chances === 1) {
            // option 1: if user is wrong, give user a second chance

            // show overlay / disallow clicking
            $('.overlay').removeClass('displayNone');
            simonGame.showOverlayMessage(`That was the wrong sequence. You get one more chance!`);      
            simonGame.userClicks = 0; // reset user clicks & sequence
            simonGame.userSequence = [];
            $('.box').removeClass('clickEnabled');
            
            // give user a slight delay so they can read the message
            setTimeout(function() {
                simonGame.hideOverlayMessage();
                simonGame.playSequence();
            }, 1800);
            return false;
        } else if (simonGame.userSequence[i] !== simonGame.sequence[i] && simonGame.chances === 0) {
            // option 2: if user is wrong & already used their second chance
            // GAME OVER
            $('.overlay').removeClass('displayNone'); // show overlay / disallow clicking
            simonGame.showOverlayMessage(`That was the wrong sequence. Game over!`);
            $('.continueButton').text('Play again?').removeClass('displayNone');
            simonGame.resetGame();
            simonGame.sequenceLength = 3; // reset sequence length
            return false;
        }
    } // end of for loop

    // option 3: if the two sequences match
    $('.overlay').removeClass('displayNone'); // show overlay / disallow clicking
    simonGame.showOverlayMessage(`Great job! You made it to the next round.`);
    simonGame.countHighScore();
    simonGame.resetGame(); 
    $('.continueButton').removeClass('displayNone').text('Continue');
} 

// high score counter - will reset if window refreshes
simonGame.countHighScore = function() {
    simonGame.highScore = simonGame.sequenceLength;
    $('.highScore').text(`Your longest sequence is: ${simonGame.highScore}`);
    simonGame.sequenceLength++; // add one more for next round
}

// reset game for starting a new game/round, doesn't reset high score
simonGame.resetGame = function() {
    $('.box').removeClass('clickEnabled');
    simonGame.sequence = [];
    simonGame.userSequence = []; 
    simonGame.userClicks = 0;
    simonGame.chances = 2;
}

simonGame.init = function() {
    // EVENT HANDLERS -----------------------------------------//
    // click 'start' button
    $('.startButton').on('click', function() {
        $(this).addClass('displayNone');
        $('i').removeClass('displayNone');
        simonGame.startNewRound();
    });
    
    // 'continue' & 'play again' buttons
    $('.continueButton').on('click', function() {
        $(this).addClass('displayNone');
        simonGame.startNewRound();
    });
    
    // this is where user clicks
    // event to grab clicks and put on userSequence array
    $('.gameGrid').on('click keypress', '.clickEnabled', function() {

        const boxNum = $(this).data('id');
        simonGame.userSequence.push(boxNum);

        $(this).addClass(`${simonGame.boxes[boxNum].color}`);
        setTimeout(() => {
            $(this).removeClass(`${simonGame.boxes[boxNum].color}`);
            console.log($(this));
        }, 200); // this changes box colours on click
    
        simonGame.userClicks++;
        if (simonGame.userClicks >= simonGame.sequenceLength ) {
            simonGame.compareSequences();
        };
    })
    
    // click event for instructions
    $('i').on('click keypress', function() {
        $('.instructions').toggleClass('displayNone');
    })
}

$(document).ready(function() {
    simonGame.init();
});


// finish media queries !!!!!!!!!!!!!!!!