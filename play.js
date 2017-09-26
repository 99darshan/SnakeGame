// variables and const
// const snake = document.getElementById('snake');
// snake is made up of three snake divs initially, let's call them snakeBody
// snake[0] is the head of our snake
const snake = document.getElementsByClassName('snake-body'); // returns a collection of div's with class snake
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


 
//var snakeTopY = snake.offsetTop;
// x and y coordinate of top left positioning of fruit
var fruitTopX = fruit.offsetLeft;
var fruitTopY = fruit.offsetTop;

// array to hold x and y coordinate of top left positioning of snake i.e. x and y position of each snake body 
// left +x, top +y
// var snakeTopX = snake.offsetLeft;
var snakeTopX = []; // holds x coordinate i.e left value of top left point of all the snake bodies
var snakeTopY = []; // holds y coordinate i.e top value of top left point of all the snake bodies

startGame();
function startGame(){

    
    //set position for each initial snake bodies in our snake
    for(var i = 0; i < snake.length; i++){
        snake[i].style.top = snakeBodyHeight * (snake.length - i -1);
        snake[i].style.left = 0;
    }

    // push the assigned position to the snakeTopX and snakeTopY array
    for(var i = 0; i < snake.length; i++){
        snakeTopX.push(snake[i].offsetLeft);
    }

    for(var i = 0; i < snake.length; i++){
        snakeTopY.push(snake[i].offsetTop);
    }

    // randomly position the fruit when the game starts
    randomizeFruitPos();
}


// randomly generate position for our fruit
// TODO: shouldnot overlap with the position of snake
function randomizeFruitPos(){
    // the below two arrays hold the possible x and y positions for the fruit to move
    // need this so that the fruit will be generated in positions that are multiple of snake size
    // this will implement the grid system
    var possibleXPositions = [];
    var possibleYPositions = [];
    console.log(snakeTopX);
    for(var i = 0; i < boardWidth / snakeBodyWidth; i++){
        var xCorToAdd = i * snakeBodyWidth;
        // should push the coordinate to pssibleXpositions array of fruits
        // only if the snakeTopX array doesn't contain that coordinate to be pushed
        // solves the issue fruit being generated in the snake body
        // same logic for the y coordinate

        //console.log(snakeTopX);
        // if(!snakeTopY.includes(xCorToAdd)){
            possibleXPositions.push(xCorToAdd);
        // }
        
    }

    for(var i = 0; i< boardHeight / snakeBodyHeight; i++){
        var yCorToAdd = i * snakeBodyHeight;
        // if(!snakeTopY.includes(yCorToAdd)){
            possibleYPositions.push(yCorToAdd);            
        // }
    }

    fruitTopX = possibleXPositions[Math.floor(Math.random() * possibleXPositions.length)];
    fruitTopY = possibleYPositions[Math.floor(Math.random() * possibleYPositions.length)];

    // fruitTopX = Math.random() * ( boardWidth - snakeBodyWidth * 2);
    // fruitTopY = Math.random() * ( boardHeight - snakeBodyHeight * 2);

    fruit.style.top = fruitTopY;
    fruit.style.left = fruitTopX;
    //console.log("fruit pos: " + fruitTopX + " " + fruitTopY);
}

// functions to move snake left, right, up, down
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
var currentDir; // save the direction in which the snake is currently moving
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
            console.log('up');
            break;
        case "ArrowRight":
            console.log('right');
            if(currentDir !== "left"){
                if(moveTimer != null) clearInterval(moveTimer);                        
                move("right");
                currentDir = "right";
            } 
            break;
        case "ArrowDown":
            console.log('down');
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
        console.log(snakeTopX[0] < fruitTopX + fruitSize);
        console.log(snakeTopX[0] + snakeBodyWidth > fruitTopX);
        console.log(snakeTopY[0] < fruitTopY + fruitSize);
        console.log(snakeTopY[0] + snakeBodyHeight > fruitTopY);
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
             console.log("snake collided with its own body");
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
    // TODO remove event listener to prevent key presses after gameOver
    //hide snake and fruit
    for(var i=0; i < snake.length; i++){
        snake[i].style.visibility = "hidden";
    }
    fruit.style.visibility = "hidden";

    // replay on enter
    document.addEventListener('keyup', function(e){
        if(e.key === "Enter") location.reload();
    });

    // gameOver button Click listener
    // replay on click
    document.getElementById('gameOver').addEventListener("click", function(){
        location.reload(); // reload page when play again button is clicked
    });
}


// count and update score
var score = 0;
function updateScore(){
    score++;
    document.getElementById("score").innerHTML = "<h2> score: " + score + "</h2>";
    console.log(score);
}
