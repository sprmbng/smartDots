let population;
let obstacles = [];
let target;

let maxSteps = 500;
let steps = 0;
let genNum = 1;
let lastGenNum = 0;

let death = 0;
let won = 0;
let data;
let xData = [];
let yData = [];

let font1;

function preload() {
    font1 = loadFont('fonts/Minecraft.ttf');
}

function getInfo() {
    for (let i = 0; i < population.pop; i++)
        if (population.dots[i].won == true)
            won++;
}

function drawInfo() {
    textFont(font1);
    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(20);
    noStroke();
    text('Generation: ' + genNum, 300, 20);
    text('Steps: ' + steps, 300, 40);
    text('Population: ' + population.pop, 100, 20);
    text('Stats for generation: ' + lastGenNum, 200, 90);
    text('KIA: ' + death, 200, 120);
}

function drawGameArea() {
    push();
    stroke(255, 255, 255);
    strokeWeight(4);
    line(windowWidth / 3, 0, windowWidth / 3, windowHeight);
    line(windowWidth / 1.5, 0, windowWidth / 1.5, windowHeight);

    line(windowWidth / 3, 0, windowWidth / 1.5, 0);
    line(windowWidth / 3, windowHeight, windowWidth / 1.5, windowHeight)
    pop();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    population = new Population();
    target = new Target();
    obstacles[0] = new Obstacle(windowWidth / 2, windowHeight / 2);
    obstacles[1] = new Obstacle(windowWidth / 3, windowHeight / 4);

    graph = new Graph(0, 0, 10, population.pop / 10);
    data = createVector(xData, yData);
}

function draw() {
    background(0);

    target.show();
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].show();
        for (let j = 0; j < population.pop; j++)
            if (obstacles[i].hits(population.dots[j]))
                population.dots[j].dead = true;
    }
    population.run();

    steps++;
    drawGameArea();
    if (steps == maxSteps) {
        getInfo();
        population.evaluate();
        population.reproduce('ROULETTE');
        steps = 0;
        death = population.pop - won;
        won = 0;

        // limitar a qtd max de geracoes expostas no grafico
        if (genNum <= 100) {
            data.x.push(genNum);
            data.y.push(death);
            graph.setData(data);
        }

        genNum++;
        lastGenNum++;
    }

    graph.show();

    drawInfo();
}