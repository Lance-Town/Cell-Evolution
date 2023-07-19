let gameboard = document.getElementById('gameboard');
let ctx = gameboard.getContext('2d');
let gameboardContainer = document.getElementById('gameboardContainer');

let height = gameboardContainer.offsetHeight;
let width = gameboardContainer.offsetWidth;

let healthBest = 10000;
let speedBest = 0.1;
let decayBest = 2;

class Food {
    constructor(x, y, color) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.health = 100;
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
        // this.speedFactor = speedBest - (Math.random() * speedBest * Math.log(healthBest));
        this.speedFactor = speedBest;
        this.health = Math.random() * healthBest - (Math.random() * 10 * Math.log(speedBest));
        this.healthDecay = 2;
        this.speedX = 1;
        this.speedY = 1;
        this.color = 'red';

        this.directionX = this.speedFactor;
        this.directionY = this.speedFactor;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 360, false);
        ctx.fill();
        ctx.closePath();
    }

    update(deltaX, deltaY, distanceToFood) {

        const directionX = deltaX / distanceToFood;
        const directionY = deltaY / distanceToFood;

        this.speedX = directionX * this.speedFactor;
        this.speedY = directionY * this.speedFactor;
        
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) {
          this.directionX = -this.directionX; // Reverse horizontal direction
        }
      
        if (this.y < 0 || this.y > height) {
          this.directionY = -this.directionY; // Reverse vertical direction
        }

        this.health -= this.healthDecay;
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
// initialize the food for the current generation
function initFood() {
    allFood = [];
    for (let i = 0; i < Math.floor(Math.random() * 10000); i++) {
        let food = new Food((Math.random() * width), (Math.random() * height), 'green');
        allFood.push(food);
        allFood[i].draw();
    }
}


let updateBoard = function() {
    ctx.clearRect(0,0,width, height);
    requestAnimationFrame(updateBoard);

    organisms.forEach((organism, i) => {
        const nearestFood = getNearestFood(organisms[i]?.x, organisms[i]?.y);

        const deltaX = nearestFood?.x - organisms[i]?.x;
        const deltaY = nearestFood?.y - organisms[i]?.y;

        const distanceToFood = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        organisms[i].update(deltaX, deltaY, distanceToFood);
        hasEaten(organisms[i]);

        if (organisms[i].health <= 0) {
            organisms.splice(i, 1);
        }

    });

    render();
}

function render() {
    if (organisms.length === 1) {
        healthBest = organisms[0].health;
        speedBest = organisms[0].speedFactor;
    }

    if (allFood.length === 0 || organisms.length === 0) {
        nextGeneration();
    }
        
    allFood.forEach((food) => {
        food?.draw();
    })

    organisms.forEach((organism) => {
        organism?.draw();
    })
}

let organisms = [];
function initOrganisms() {
    organisms = [];

    for (let i = 0; i < 15; i++) {
        let organism = new Organism((Math.random() * width),(Math.random() * height));
        organisms.push(organism);
        organism.draw();
    }
    updateBoard();
}

// check if each organism has eaten food during the frame
function hasEaten(organism) {
    allFood.forEach((food, i) => {
        const rad = food.radius*2;

        // Check for horizontal collision
        const xCollision = organism.x < food.x + rad && organism.x + rad > food.x;

        // Check for vertical collision
        const yCollision = organism.y < food.y + rad && organism.y + rad > food.y;

        if (xCollision && yCollision) {
            organism.health += food.health;
            allFood.splice(i, 1);
        }
    })
}

function getNearestFood(organismX, organismY) {
    let minDist = Infinity;
    let nearestFood = null;
    
    allFood.forEach(food => {
        const dist = findDist(organismX, organismY, food.x, food.y);

        if (dist < minDist) {
            minDist = dist;
            nearestFood = food;
        }
    })

    return nearestFood;
}

function findDist(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

drawCanvasBorder();
initFood();
initOrganisms();


function nextGeneration() {
    console.log('next Generation!')
    ctx.clearRect(0,0,width, height);
    initFood();
    initOrganisms();
}