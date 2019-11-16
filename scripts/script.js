const simonGame = {};

simonGame.boxes = [
    {
        box: '.box0',
        color: 'coloredBox0', 
        clickColor: 'clickEnabledBox0'   
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

simonGame.highScore = 0; // maybe change this to longestStreak ><<<<<<<<<<<<<< // ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
localStorage.setItem(simonGame.highScore, simonGame.highscore); 
// ^^^^^^^^^^^^ can't use same params, must be key - 'value'

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
        
        setTimeout(function() {            
            // make sequence boxes show their color (toggle colour ON)
            $(boxNum).addClass(boxColor);
            
            setTimeout(function() {            
                // boxes go back to black (toggle colour OFF)
                $(boxNum).removeClass(boxColor);
            }, 800);
        }, i * 1600);

        simonGame.addClickColors();
    })
    
    setTimeout(function() {
        // show overlay message
        $('.overlayMessageContainer').removeClass('displayNone');
        $('.overlayMessage').text(`Now it's your turn!`);

        setTimeout(function() {
            // hide overlay message
            $('.overlayMessageContainer').addClass('displayNone');

            // hide overlay box to allow clicking
            $('.overlay').addClass('displayNone');

            // allow clicking on boxes
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

// function to compare user array to sequence array
simonGame.compareSequences = function() {
    simonGame.removeClickColors();

    // logging the two arrays VVVVVVVVVVV (take this out later)
    console.log('sequence:', simonGame.sequence);
    console.log('user sequence: ', simonGame.userSequence);

    simonGame.chances--; // user used up a chance
    
    for (let i = 0; i < simonGame.userSequence.length; i++) {
        if (simonGame.userSequence[i] !== simonGame.sequence[i] && simonGame.chances === 1) {
            // option1: if user is wrong, give user a second chance

            // show overlay / disallow clicking
            $('.overlay').removeClass('displayNone');

            // show overlay message
            $('.overlayMessageContainer').removeClass('displayNone');
            $('.overlayMessage').text(`That was the wrong sequence. You, get one more chance. Watch carefully!`);

            // reset user clicks & sequence
            simonGame.userClicks = 0;
            simonGame.userSequence = [];

            // toggle off box clicking
            $('.box').removeClass('clickEnabled');
            
            // give user a slight delay
            setTimeout(function() {
                // remove overlay message \
                $('.overlayMessageContainer').addClass('displayNone');
                simonGame.playSequence();
            }, 800);
            return false;
        } else if (simonGame.userSequence[i] !== simonGame.sequence[i] && simonGame.chances === 0) {
            // option2: if user already used their second chance
            // GAME OVER

            // show overlay / disallow clicking
            $('.overlay').removeClass('displayNone');

            // show overlay message
            $('.overlayMessageContainer').removeClass('displayNone');
            $('.overlayMessage').text(`That was the wrong sequence. Game over!`);
            
            setTimeout(function() {
                simonGame.resetGame();
            }, 800)

            simonGame.sequenceLength = 3;
            $('button').text('Play again?').removeClass('displayNone');
            return false;
        }
    } // end of for loop

    // option3: if the two sequences match
    // show overlay / disallow clicking
    $('.overlay').removeClass('displayNone'); 
    // show overlay message to user
    $('.overlayMessageContainer').removeClass('displayNone');
    $('.overlayMessage').text(`Great Job! You made it to the next round.`);

    simonGame.countHighScore();

    setTimeout(function() {
        simonGame.resetGame(); 
        $('button').removeClass('displayNone').text('Continue');
    }, 800)
} 

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// high score counter - will reset if window refreshes <<<<<<<<<<<<<<<<<<<<<<<<<
simonGame.countHighScore = function() {
    simonGame.highScore = simonGame.sequenceLength;
    //  NEED IF STATEMENT HERE???
    localStorage.setItem(simonGame.highScore, simonGame.highscore);
    $('.highScore').text(`Your longest sequence is: ${simonGame.highScore}`);
    console.log("logging sequence length");
    console.log("logging localStorage:", localStorage[simonGame.highScore]);
    simonGame.sequenceLength++;
}

// reset game for starting a new game/round, doesn't reset high score
simonGame.resetGame = function() {
    $('.box').removeClass('clickEnabled');
    simonGame.sequence = [];
    simonGame.userSequence = []; 
    simonGame.userClicks = 0;
    simonGame.chances = 2;
    // hide OVERLAY
    // $('.overlay').addClass('displayNone');
}

// click 'start' button
$('button').on('click', function() {

    $('.instructions').addClass('displayNone');
    
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    console.log("checking if localstorage is saving: ", localStorage[simonGame.highScore]);
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    // show overlay
    // $('.overlay').removeClass('displayNone');
    $('.overlayMessageContainer').removeClass('displayNone');
    $('.overlayMessage').text('Watch the sequence carefully!');
    
    // make button disappear
    $(this).addClass('displayNone');
    
    setTimeout(function() {
        $('.overlayMessageContainer').addClass('displayNone');
        // $('.overlayMessage').addClass('displayNone');
        // may not need this
        simonGame.makeSequence();
        simonGame.playSequence();
    }, 800)
});

// this is where user clicks
// event to grab clicks and put on userSequence array
$('.gameGrid').on('click', '.clickEnabled', function() {
    console.log("logging user clicks", $(this));

    // grab the box number using regex
    const classNames = $(this).attr('class');
    boxNumber = classNames.match(/[0-9]/);
    simonGame.userSequence.push(parseInt(boxNumber[0]));

    simonGame.userClicks++;
    if (simonGame.userClicks >= simonGame.sequenceLength ) {
        simonGame.compareSequences();
    };
})

// click event for instructions
$('i').on('click', function() {
    // $('.overlay').toggleClass('displayNone')
    $('.instructions').toggleClass('displayNone');
})


// DEAL WITH THISSSSSS !!!!!!!!!!!!!
// document ready - not sure what to put in here, maybe event handlers?
$(document).ready(function() {

});


// icon aria-label - CHECK THIS <<<<<<<<<<<<<<<<<<<<<
// styling in general, button, border-radius?, better font for headings, footer styling
// should box colours be brighter/lighter?

// finish media queries
// mobile - might need to have the instructions in a link & pop up/slide out from side instead of on page

// check localStorage/windowsessionStorage issue

// !!!! what to put in my doc ready if I don't need to initialize a function

// code organization / clean up code