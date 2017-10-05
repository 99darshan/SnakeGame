// variables and const
// const snake = document.getElementById('snake');
// snake is made up of three snake divs initially, let's call them snakeBody
// snake[0] is the head of our snake
var snake = document.getElementsByClassName('snake-body'); // returns a collection of div's with class snake
const fruit = document.getElementById('fruit');
// const boardWidth = document.getElementById('game-board').offsetWidth;
// const boardHeight = document.getElementById('game-board').offsetHeight;

// height and width of snake and fruit
var snakeBodyHeight = snake[0].offsetHeight;
var snakeBodyWidth = snake[0].offsetWidth;
const fruitSize = fruit.offsetHeight;
const snakeMoveDistance = snakeBodyHeight;
const snakeMoveTimeInterval = 100;

const boardWidth = document.getElementById('game-board').style.width = snakeBodyWidth * 16;
const boardHeight = document.getElementById('game-board').style.height = snakeBodyHeight * 25;

// save the direction in which the snake is currently moving
var currentDir = ""; 

var fruitTypes = ["apple", "carrot", "beer"];
var currentFruit = "apple";

var score = 0;
var highScore = 0;
 
// x and y coordinate of top left positioning of fruit
var fruitTopX = fruit.offsetLeft;
var fruitTopY = fruit.offsetTop;

// array to hold x and y coordinate of top left positioning of snake i.e. x and y position of each snake body 
// left +x, top +y
var snakeTopX = []; // holds x coordinate i.e left value of top left point of all the snake bodies
var snakeTopY = []; // holds y coordinate i.e top value of top left point of all the snake bodies

// 2D array to hold all xy position of gameBoardGrid
//[[0,0],[0,20],[0,40],...]
var allXYPosInGameBoard = [];

// 2D array to hold all current XY position for snake bodies
var snakeXYPos = [];

startGame();
function startGame(){        
    // reset variables, resets the game to initial state everytime this function gets called on gameOver
    snakeTopX = [];
    snakeTopY = [];
    allXYPosInGameBoard = [];
    snakeXYPos = [];
    currentDir = "";
    score = 0;

    // show/hide elements as required when restaring game after gameOver
    document.getElementById("score").innerHTML = "<h2> <i class=\"fa fa-apple\" aria-hidden=\"true\"></i>" + score +  "</h2>";
    
    for(var i=0; i < snake.length; i++){
        snake[i].style.visibility = "visible";
    }
    fruit.style.visibility = "visible";

    document.getElementById('gameOver').style.display = 'none';

    // remove animate.css style class, so them gets applied again when gameOver is called
    // need this since we are not reloading the page to restart the game
    document.getElementById('high-score').classList.remove("animated");
    document.getElementById('high-score').classList.remove("bounce");

    document.getElementById('game-board').classList.remove("animated");
    document.getElementById('game-board').classList.remove("wobble");    
    

    // remove additional snake body div, that were added in previous game
    var childSnakeBodyDiv = document.getElementById('game-board')        
    while(snake.length > 3){
        childSnakeBodyDiv.removeChild(snake[snake.length - 1]);
    }

    //set position for each initial snake bodies in our snake
    for(var i = 0; i < snake.length; i++){
        snake[i].style.top = snakeBodyHeight * (snake.length - i -1);
        snake[i].style.left = 0;
    }

    // assign bg color to the head of snake
    snake[0].style.background = "#B94A3C";
    snake[0].style.borderRadius = '10px';
    
    // push the assigned position to the snakeTopX and snakeTopY array
    // push current all XY position of snake bodies to 2D snakeXYPos array as well
    for(var i = 0; i < snake.length; i++){
        snakeTopX.push(snake[i].offsetLeft);
        snakeTopY.push(snake[i].offsetTop);    
        snakeXYPos.push([snake[i].offsetLeft, snake[i].offsetTop]);    
    }

    // push the xy position of gameBoardGrid to the allXYPosInGameBoard array
    for(var i = 0; i < boardWidth / snakeBodyWidth; i++){
        for(var j = 0; j < boardHeight / snakeBodyHeight; j++){
            var xCorToAdd = i * snakeBodyWidth;
            var yCorToAdd = j * snakeBodyHeight;
            allXYPosInGameBoard.push([xCorToAdd, yCorToAdd]);
        }
    }
    //console.log(allXYPosInGameBoard);

    // randomly position the fruit when the game starts
    randomizeFruitPos();
}

// randomly generate fruit 
// without overlapping with the current snake position
// using 2D array
function randomizeFruitPos(){
    var possibelXYPosForFruit = [];
    
    // get the current x,y position for all snake body and save it to the snakeXYPos array
    for(var i = 0; i < snake.length; i++){
        // snakeXYPos.push([snake[i].offsetLeft, snake[i].offsetTop]);
        snakeXYPos[i] = [snake[i].offsetLeft, snake[i].offsetTop];
    }
    //console.log("snakeXy" + snakeXYPos);

    // determine possible new position for fruit
    // for all [x,y] positions in the gameBoard, only those [x,y] values not in snakeXYPos
    // array can be the possible new position of fruit
    for(var j = 0; j < allXYPosInGameBoard.length; j++){

        // can't use includes or indexOf array functions to check if an array object [x,y] is in the 2D array [[x,y], [x1,y1],..]
        // since includes and indeOf does strict comparison === , so cann't check for the objects

        // if( !snakeXYPos.includes(allXYPosInGameBoard[j]) ){
        //     console.log("possible fruit pos");
        // }

        // to solve this use a workaround and use JSON.stringify to convert the array snakeXYPos to string
        // and use indexOf to check for substring of allXYPosInGameBoard[j] element
        // e.g checks '[[10,20], [20,40], [50,60]]'.indexOf('[50,60]')
        // retruns the index of starting of substring '[50,60]' i.e. 17 or so
        /// returns -1 if cann't find that substring

        //console.log(JSON.stringify(snakeXYPos).indexOf(JSON.stringify(allXYPosInGameBoard[j])))

        if(JSON.stringify(snakeXYPos).indexOf(JSON.stringify(allXYPosInGameBoard[j])) == -1){
            possibelXYPosForFruit.push(allXYPosInGameBoard[j]);
        }

    }
     var randomFruitPos = possibelXYPosForFruit[Math.floor(Math.random() * possibelXYPosForFruit.length)];
     // randomFruitPos is a 2D array e.g. [[x,y]]
    fruitTopX = randomFruitPos[0];
    fruitTopY = randomFruitPos[1];

    //fruit.style.top = fruitTopY;
    //fruit.style.left = fruitTopX;

    displayFruit(fruitTopX, fruitTopY);
}

// function to display a fruit of random type
function displayFruit(xPos, yPos){

    currentFruit = fruitTypes[Math.floor(Math.random() * 3 )];
    fruit.style.top = yPos;
    fruit.style.left = xPos;

    switch(currentFruit){
        case "apple":
            document.getElementById('fruit').innerHTML = '<img src="icons/png/003-apple.png" alt="apple">';
            break;
        case "carrot":
            document.getElementById('fruit').innerHTML = '<img src="icons/png/002-carrot.png" alt="carrot">';                
            break;
        case "beer":
            document.getElementById('fruit').innerHTML = '<img src="icons/png/002-beer-1.png" alt="beer">';
            break;
    }

}

// function to move snake left, right, up, down
var moveTimer;
function move(dir){
    
    if(dir === "down"){
        // setInterval executes a function over an over again after certain time interval
        // setTimeout executes a fuction once after the specified time
        moveTimer = setInterval(function(){
            // store old x and y position of top left corner of the first snake body div
            var oldX = [];
            var oldY = [];
    
            // move each snake body down 
            for(var i = 0; i < snake.length; i++){
                oldX.push(snakeTopX[i]);
                oldY.push(snakeTopY[i]);
                // assign new position to each snakebody
                if(i === 0){
                    snakeTopY[i] += snakeMoveDistance;
                    snake[i].style.top = snakeTopY[i];
                }
                else{
                    snakeTopX[i] = oldX[i-1];
                    snake[i].style.left = snakeTopX[i];
                    snakeTopY[i] = oldY[i-1];
                    snake[i].style.top = snakeTopY[i];
                }
            }
            // snakeTopY += snakeMoveDistance;
            // snake.style.top = snakeTopY;
            collision();
            // console.log("new top snake pos %s", snakeTopX);
        }, snakeMoveTimeInterval);
    }

    if(dir === "up"){
        moveTimer = setInterval(function(){
            var oldX = [];
            var oldY = [];
            
            for(var i = 0; i < snake.length; i++){
                oldX.push(snakeTopX[i]);
                oldY.push(snakeTopY[i]);

                if(i === 0){
                    snakeTopY[i] -= snakeMoveDistance;
                    snake[i].style.top = snakeTopY[i];
                }
                else{
                    snakeTopX[i] = oldX[i-1];
                    snake[i].style.left = snakeTopX[i];
                    snakeTopY[i] = oldY[i-1];
                    snake[i].style.top = snakeTopY[i];
                }
                
            }
            //snakeTopY -= snakeMoveDistance;
            //snake.style.top = snakeTopY;
            collision();
        }, snakeMoveTimeInterval)
    }

    if(dir === "left"){
        //console.log("snakeX: "+ snakeTopX);
        moveTimer = setInterval(function(){
            var oldX = [];
            var oldY = [];
            for(var i = 0; i < snake.length; i++){
                oldX.push(snakeTopX[i]);
                oldY.push(snakeTopY[i]);

                if(i === 0){
                    snakeTopX[i] -= snakeMoveDistance;
                    snake[i].style.left = snakeTopX[i];
                } 
                else{
                    snakeTopX[i] = oldX[i-1];
                    snake[i].style.left = snakeTopX[i];
                    snakeTopY[i] = oldY[i-1];
                    snake[i].style.top = snakeTopY[i];
                }  
            }
            //snakeTopX -= snakeMoveDistance;
            //snake.style.left = snakeTopX;
            //console.log("snakeX: "+ snakeTopX);            
            collision();
        }, snakeMoveTimeInterval);
    }

    if(dir === "right"){
        moveTimer = setInterval(function(){
            var oldX = [];
            var oldY = [];
            for(var i = 0; i < snake.length; i++){
                oldX.push(snakeTopX[i]);
                oldY.push(snakeTopY[i]);
                // specify new positions
                if(i === 0){
                    snakeTopX[i] += snakeMoveDistance;
                    snake[i].style.left = snakeTopX[i];
                }
                else{
                    snakeTopX[i] = oldX[i-1];
                    snake[i].style.left = snakeTopX[i];
                    snakeTopY[i] = oldY[i-1];
                    snake[i].style.top = snakeTopY[i];
                } 
            }
            //snakeTopX += snakeMoveDistance;
            //snake.style.left = snakeTopX;
            collision();
        }, snakeMoveTimeInterval);
    }

}

// move("down");

// key press event handles
// arrow keys are not triggered by onKeyPress, use onKeyUp or onKeyDown
// onKeyUp event is triggered when arrow keys are pressed and released
// onKeyDown event is triggered when arrow keys are pressed down

// attach onKeyDown event to the document object
// attach a event handler function when onKeyDown event is triggered

//document.addEventListener("keyup", function(e){}) add event listener for keyup event

// or element.onkeyDown = event handling code
document.onkeydown =function(e){
    //console.log("event triggered");
    //console.log(e.key);
    //console.log(e.code);
    switch(e.key){
        case "ArrowLeft":
            //console.log('left');
            if(currentDir !== "right"){
                if(moveTimer != null) clearInterval(moveTimer);                
                move("left"); // can't move left if snake's head is moving in right direction
                currentDir = "left";
            } 
            break;
        case "ArrowUp":
            if(currentDir !== "down"){
                if(moveTimer != null) clearInterval(moveTimer);                
                move("up"); // can't moveup if snake's head is moving down
                currentDir = "up";
            } 
            //console.log('up');
            break;
        case "ArrowRight":
            //console.log('right');
            if(currentDir !== "left"){
                if(moveTimer != null) clearInterval(moveTimer);                        
                move("right");
                currentDir = "right";
            } 
            break;
        case "ArrowDown":
            //console.log('down');
            if(currentDir !== "up"){
                if(moveTimer != null) clearInterval(moveTimer);                        
                move("down");
                currentDir = "down";
            }

            break;
    }
}

// collision detection
function collision(){
    // detect snake and fruit collision
    // snakeTopX[0] and snakeTopY[0] are x,y coordinate of top left corner of snake head that is the first snake div
    // logic, 
    // top left corrdinate of snake (sx,sy) , top left coordinate of fruit (fx, fy)
    // sx < fx + w && sx + w > fx && sy < fy + h && sy + h > fy
    if(snakeTopX[0] < fruitTopX + fruitSize && snakeTopX[0] + snakeBodyWidth > fruitTopX && 
        snakeTopY[0] < fruitTopY + fruitSize && snakeTopY[0] + snakeBodyHeight > fruitTopY)
    {
        console.log("collision");
        updateScore();
        randomizeFruitPos();
        addSnakeTail();
    }

    // detect wall border collision
    if(snakeTopY[0] < 0 || snakeTopY[0] + snakeBodyHeight > boardHeight || snakeTopX[0] < 0 || snakeTopX[0] + snakeBodyWidth > boardWidth){
        console.log("wall collision");
        gameOver();
    }

    // detect snake collision with its own body
    for(var i = 1; i < snake.length; i++){
         if(snakeTopX[0] < snakeTopX[i] + snakeBodyWidth && snakeTopX[0] + snakeBodyHeight > snakeTopX[i] &&
            snakeTopY[0] < snakeTopY[i] + snakeBodyHeight && snakeTopY[0] + snakeBodyHeight > snakeTopY[i]
         ){
             //console.log("snake collided with its own body");
             gameOver();
         }
    }

}

// add a new snake body, a tail every time snake capture the fruit
function addSnakeTail(){
    // add a new div to HTML
    var snakeDiv = document.createElement('div');
    // append the created div as child of the specified div
    document.getElementById('game-board').appendChild(snakeDiv);
    // give the div a class name of snake which does snake.push(thisDiv)
    // set the initial position of newly created snakeBody out of bounds of the border 
    // our snake is moving in the setInterval, where the newly created snakeBody is appended 
    // to our snake
    snakeDiv.className = 'snake-body';
    snakeDiv.style.top = -200;
    snakeDiv.style.left = -200;
}

// gameOver, prompt user to play again
function gameOver(){
    document.getElementById('gameOver').style.display = "block";
    if(moveTimer != null) clearInterval(moveTimer);
    //hide snake and fruit
    for(var i=0; i < snake.length; i++){
        snake[i].style.visibility = "hidden";
    }
    fruit.style.visibility = "hidden";

    // check highScore
    if(score >= highScore){
        highScore = score;
        document.getElementById("high-score").innerHTML = "<h2> <i class=\"fa fa-trophy\" aria-hidden=\"true\"></i> " + highScore + "</h2>";       
        document.getElementById("high-score").className = "animated bounce"; // css class from animate.CSS
    }

    // add wobble effect to gameboard on gameOver animate.css
    document.getElementById('game-board').className = "animated wobble";
    // replay on enter
    document.addEventListener('keyup', function(e){
        //if(e.key === "Enter") location.reload();
        if(e.key == "Enter") startGame();
    });

    // gameOver button Click listener
    // replay on click
    document.getElementById('gameOver').addEventListener("click", function(){
        //location.reload(); // reload page when play again button is clicked
        startGame();
    });
}

// count and update score

function updateScore(){
    switch(currentFruit){
        case "apple":
            score += 5;
            break;
        case "carrot":
            score += 10;
            break;
        case "beer":
            score += 20;
            break;
    }
        
    //score++;
    document.getElementById("score").innerHTML = "<h2> <i class=\"fa fa-apple\" aria-hidden=\"true\"></i>" + score +  "</h2>";
    console.log(score);
}
