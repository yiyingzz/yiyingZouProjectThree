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
// maybe change 'class' to 'clickClass'?????

simonGame.sequenceLength = 3;
simonGame.sequence = []; 
simonGame.userSequence = [];
simonGame.userClicks = 0;
simonGame.highScore = 0; // maybe change this to longestStreak


// click 'start' button
$('button').on('click', function() {
    console.log(' >>> you clicked the start button!');

    // SHOW overlay
    $('.overlay').removeClass('displayNone');
    $('.overlayMessage').text('Watch the sequence carefully!');
    
    // make button disappear
    $(this).removeClass('displayNone');

    setTimeout(function() {
        $('.overlayMessage').addClass('displayNone');
        simonGame.makeSequence();
        simonGame.playSequence();
    }, 500)
});

 

simonGame.makeSequence = function() {
    for (let i = 0; i < simonGame.sequenceLength; i++) {
        const num = Math.floor(Math.random() * simonGame.boxes.length);

        //refactor later or dont ????????????????
        simonGame.sequence.push(num); 
        console.log('logging from sequencer(): ', num);
    }
    console.log('whole sequence: ', simonGame.sequence);
};


// function to run the sequence on the html page
simonGame.playSequence = function() { 
    simonGame.sequence.forEach(function(item, i) {
        // log sequence

        // vvvvvvvvv ITEM RIGHT NOW IS # on SEQUEUNCE ARRAY
        // NEED TO MATCH IT TO BOXES ARRAY
        console.log("logging item:", item);
        console.log("loggin simonGame.boxes[item].box:", simonGame.boxes[item].box);
        console.log("loggin simonGame.boxes[item].class:", simonGame.boxes[item].class);

        const boxNum = simonGame.boxes[item].box;
        const boxColor = simonGame.boxes[item].color;
        

        setTimeout(function() {            
            // make sequence boxes show their color (toggle colour ON)
            $(boxNum).addClass(boxColor);

            // enable click colour on all boxes
            // only working on boxes in the sequence, not EVERY SINGLE BOX
            // also need to take it off later (HAVEN'T DONE IT YET)
            // $(boxNum).toggleClass(boxClass);
            
            setTimeout(function() {            
                // boxes go back to black (toggle colour OFF)
                $(boxNum).removeClass(boxColor);
            }, 800);
        }, i * 1600);

        // enable clicking colour on all boxes
        // THIS HAPPENS TOOOOOOO EARLY
        // ALSO NEED TO TURN IT OFF LATER
        simonGame.boxes.forEach(function(item) {
            $(item.box).addClass(item.clickColor);
        })
    })
    
    setTimeout(function() {
        // show overlay message
        // $('.overlay').toggleClass('displayNone');
        $('.overlayMessage').removeClass('displayNone').text(`Now it's your turn!`);
        setTimeout(function() {
            // HIDE overlay box
            $('.overlay').addClass('displayNone'); 
            // allow clicking on boxes
            $('.box').addClass('clickEnabled');
        }, 500)
    }, 1600 * simonGame.sequence.length);
}

// THIS IS WHERE USER CLICKS
// function to grab clicks and put on userSequence array
$('.gameContainer').on('click', '.clickEnabled', function() {
    console.log("logging user clicks", $(this));
    const classNames = $(this).attr('class');

    // grab the right class name using regex
    boxNumber = classNames.match(/[0-9]/);
    simonGame.userSequence.push(parseInt(boxNumber[0]));

    simonGame.userClicks++;
    if (simonGame.userClicks >= simonGame.sequenceLength ) {
        simonGame.compareSequences();
    };
})

simonGame.chances = 0;
    
// compare user array to sequence array
simonGame.compareSequences = function() {

    // <<<<<<<<<<<<<<<<< TURN OF CLICK COLOURS HERE?????
    simonGame.boxes.forEach(function(item) {
        $(item.box).removeClass(item.clickColor);
    })

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
            // show overlay box & message
            $('.overlay').removeClass('displayNone');
            $('.overlayMessage').text(`That was the wrong sequence. You get one more chance. Watch carefully!`);
            // reset user clicks & sequence
            simonGame.userClicks = 0;
            simonGame.userSequence = [];
            // toggle off box clicking
            $('.box').removeClass('clickEnabled');
            
            // give user a slight delay
            setTimeout(function() {

                // toggle OFF overlay
                $('.overlay').addClass('displayNone');
                simonGame.playSequence();
            }, 1500);
            return false;
        } else {
            // GAME OVER

            // SHOW overlay
            $('.overlay').addClass('displayNone');
            $('.overlayMessage').text(`That was the wrong sequence. Game over!`);
            
            simonGame.resetGame();
            simonGame.sequenceLength = 3;
            $('button').text('Play again?').removeClass('displayNone');
            return false;
        }
    } // end of for loop

    //SHOW OVERLAY --- BUT WHY IS IT HIDING IT
    $('.overlay').addClass('displayNone'); // <<<<<<<<<<< happening too fast
    $('.overlayMessage').text(`Great Job! Play again?`);

    simonGame.countHighScore();

    setTimeout(function() {
        simonGame.resetGame(); // <<<<<<<<<<<<<<<<<<<<<<<< happening too fast
        $('button').removeClass('displayNone');
    }, 800)
} 


// high score counter - will reset if window refreshes
simonGame.countHighScore = function() {
    simonGame.highScore = simonGame.sequenceLength;
    $('.highScore').text(`Your longest sequence is: ${simonGame.highScore}`);
    simonGame.sequenceLength++;
}

// reset game for starting a new game/round, doesn't reset high score
simonGame.resetGame = function() {
    $('.box').removeClass('clickEnabled');
    simonGame.sequence = [];
    simonGame.userSequence = []; 
    simonGame.userClicks = 0;
    simonGame.chances = 0;
    // HIDE OVERLAY
    $('.overlay').addClass('displayNone');
}

// DEAL WITH THISSSSSS !!!!!!!!!!!!!
// document ready - not sure what to put in here, maybe event handlers?
$(document).ready(function() {

});


// Due to the delay, user has to wait for the message to change to "Now it's your turn!" before clicking, otherwise it won't work 
    // make an overlay with 3..2..1.. countdown that grays out squares & goes on top of the boxes
// DEAL WITH CLICK-ENABLING
//a reversed click-enabled class

// DESIGN/UI - ask Fatima

// grid & flexbox used together - ask Helpcue
// refactor my flexboxes 

// what to put in my doc ready if I don't need to initialize a function

// is my sass ok? literally 1 scss file, not even a partial - maybe use a partial for box colours

// code organization / functional programming / clean up code
