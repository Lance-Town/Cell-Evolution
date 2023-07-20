let gameboard = document.getElementById('gameboard');
let ctx = gameboard.getContext('2d');
let gameboardContainer = document.getElementById('gameboardContainer');

let height = gameboardContainer.offsetHeight;
let width = gameboardContainer.offsetWidth;

let animationFrameId;

let healthBest = 300;
let speedBest = 0.3;
let decayBest = 2;
let ORGANISM_SIZE = 15;

class Food {
    constructor(x, y, color) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.health = 30;
    }
    
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

class Organism {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speedFactor = speedBest + ((((Math.random() * 2 * speedBest) - speedBest)) / 10);
        this.health = healthBest + (Math.random() * (healthBest * 2 * speedBest / 10) - (Math.random() * (healthBest * speedBest / 10)));
        this.healthOriginal = this.health;
        this.healthDecay = decayBest + ((Math.random() * decayBest / 10) - decayBest / 10) + this.speedFactor;
        this.speedX = 0;
        this.speedY = 0;
        this.color = 'red';

        this.directionX = this.speedFactor;
        this.directionY = this.speedFactor;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = '#1100ff';
        ctx.font = 'bold 10pt Calibri';
        ctx.fillStyle = (this.health < (this.healthOriginal / 2)) ? 'red' : 'green';
        ctx.fillStyle = ((1 - (this.health / 100)) * 120).toString(10);
        ctx.fillText(Math.floor(this.health), this.x- (0.5*this.radius), this.y+(2.1*this.radius));
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
    for (let i = 0; i < (200 + (Math.random() * 1000)); i++) {
        let food = new Food((Math.random() * width), (Math.random() * height), 'green');
        allFood.push(food);
        allFood[i].draw();
    }
}


let updateBoard = function() {
    ctx.clearRect(0,0,width, height);
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updateBoard);

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
        healthBest =  (organisms[0].healthOriginal > 100) ? organisms[0].healthOriginal : 100;
        speedBest = organisms[0].speedFactor;
        decayBest = organisms[0].healthDecay;
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

    for (let i = 0; i < ORGANISM_SIZE; i++) {
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

let generation = 0;
function nextGeneration() {
    generation++;

    document.getElementById('generationNumber').innerHTML = generation;

    ctx.clearRect(0,0,width, height);
    drawCanvasBorder();
    initFood();
    initOrganisms();
}

function resetSimulation() {
    generation = -1;
    healthBest = 300;
    speedBest = 0.3;
    decayBest = 2;
    nextGeneration(); 
}

function updateOrgnaismCount(count) {
    ORGANISM_SIZE = count;
}