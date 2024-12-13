
//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 30;
let dinoHeight = 47;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

let dinoRunImages = [];
let currentRunImage = 0;  // This will toggle between 0 and 1 to switch images
let runAnimationInterval;


//cactus
let cactusArray = [];

let cactus1Width = 35;
let cactus2Width = 45;
let cactus3Width = 22;

let cactusHeight = 49;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -4; //cactus moving left speed
let velocityY = 0;
let gravity = 0.70;

let gameOver = false;
let score = 0;

window.onload = function() {
    
    // Load the running images
    dinoRunImages[0] = new Image();
    dinoRunImages[0].src = './img/dushyant-run1.png';
    dinoRunImages[1] = new Image();
    dinoRunImages[1].src = './img/dushyant-run2.png';

    // Initialize other game elements
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board
    context.src = "./img/cactus1.png";

    // Select the restart button
    const restartButton = document.getElementById("restartButton");
    
    // Ensure the button is relative to the canvas
    restartButton.style.position = "absolute";
    board.parentElement.style.position = "relative";

    if (gameOver) {
        restartButton.style.display = "block"; // Show the button
        return;
    }

    // Attach event listener to the restart button
    restartButton.addEventListener("click", () => {
        gameOver = false;
        score = 0;
        cactusArray = [];
        dino.y = dinoY;
        velocityY = 0;
        restartButton.style.display = "none"; // Hide the button
        currentRunImage = 0;  // Reset running animation to the first frame
        dinoImg.src = "./img/dushyant-stand.png"; // Reset dino image
        startRunningAnimation();
    });

    // Load images
    dinoImg = new Image();
    dinoImg.src = "./img/dushyant-stand.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };

    cactus1Img = new Image();
    cactus1Img.src = "./img/item-cake.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/item-present.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/item-saki.png";

    // Start game loop and events
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);

    // Start running animation
    startRunningAnimation();

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dushyant-stand.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/item-cake.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/item-present.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/item-saki.png";

}

function startRunningAnimation() {
    runAnimationInterval = setInterval(() => {
        if (!gameOver) {
            if (velocityY === 0) { // Only update running animation if dino is not jumping
                currentRunImage = (currentRunImage + 1) % 2;  // Switch between 0 and 1
                dinoImg.src = dinoRunImages[currentRunImage].src;
            }
        } else {
            clearInterval(runAnimationInterval); // Stop the running animation interval
        }
    }, 150);  // Switch image every 150 milliseconds
}


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        document.getElementById("restartButton").style.display = "block"; // Show the restart button
        dinoImg.src = "./img/dushyant-dead.png"; // Set to the dead image
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground

    // Check if dino is on the ground
    if (dino.y >= dinoY) {
        dino.y = dinoY;
        velocityY = 0; // Reset velocityY when dino is on the ground
    }

    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            clearInterval(runAnimationInterval); // Stop the running animation interval
            dinoImg.src = ""; // Clear the dino image when a collision is detected
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -15;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}


function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .60) { //40% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .40) { //60% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

