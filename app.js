let gameboard = document.getElementById('gameboard');
let ctx = gameboard.getContext('2d');
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
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 360, false);
        ctx.fill();
        ctx.closePath();
    }
}

class Organism {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 1;
        this.health = 100;
        this.color = 'red';

        this.dx = this.speed;
        this.dy = this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 360, false);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > width) {
            this.dx = -this.dx; // Reverse horizontal direction
          }
      
          if (this.y < 0 || this.y > height) {
            this.dy = -this.dy; // Reverse vertical direction
          }
    }
}

function drawCanvasBorder() {
    height = gameboardContainer.offsetHeight;
    width = gameboardContainer.offsetWidth * 0.9;
    
    gameboard.width = width;
    gameboard.height = height;
    
    ctx.beginPath();
    ctx.rect(0,0, width, height);
    ctx.stroke();
    ctx.closePath();
    
    return;
}

let allFood = [];
function drawFood() {
    allFood.length = 0;
    for (let i = 0; i < Math.floor(Math.random() * 500); i++) {
        let food = new Food((Math.random() * width), (Math.random() * height), 'green');
        allFood.push(food);
        allFood[i].draw();
    }
}

let updateBoard = function() {
    ctx.clearRect(0,0,width, height);
    requestAnimationFrame(updateBoard);

    organisms.forEach(organism => {
        organism.update();
    })

    render();
}

function render() {
    allFood.forEach(food => {
        food.draw();
    })

    organisms.forEach(organism => {
        organism.draw();
    })
}

let organisms = [];
function drawOrganisms() {
    organisms.length = 0;

    for (let i = 0; i < 15; i++) {
        let organism = new Organism((Math.random() * width),(Math.random() * height));
        organisms.push(organism);
        organisms[i].draw();
        updateBoard();
    }
}


drawCanvasBorder();
drawFood();
drawOrganisms();