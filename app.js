let gameboard = document.getElementById('gameboard');
let gamebaordCTX = gameboard.getContext('2d');
let gameboardContainer = document.getElementById('gameboardContainer');

let height = gameboardContainer.offsetHeight;
let width = gameboardContainer.offsetWidth;

class Food {
    constructor(x, y, color) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = 5;
    }
    
    draw() {
        gamebaordCTX.beginPath();
        gamebaordCTX.fillStyle = this.color;
        gamebaordCTX.arc(this.x, this.y, this.radius, 0, 360, false);
        gamebaordCTX.fill();
        gamebaordCTX.closePath();
    }
}

function drawCanvasBorder() {
    height = gameboardContainer.offsetHeight;
    width = gameboardContainer.offsetWidth;
    
    gameboard.width = width * 0.9;
    gameboard.height = height;
    
    gamebaordCTX.beginPath();
    gamebaordCTX.rect(0,0, width, height);
    gamebaordCTX.stroke();
    gamebaordCTX.closePath();
    
    return;
}

let createFood = function(food) {
    food.draw();
}


let allFood = [];

function drawFood() {
    allFood.length = 0;
    for (let i = 0; i < Math.floor(Math.random() * 500); i++) {
        let food = new Food((Math.random() * width), (Math.random() * height), 'green');
        allFood.push(food);
        createFood(allFood[i]);
    }
}

drawCanvasBorder();
drawFood();