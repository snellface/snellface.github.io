var level = null;
var player = null;
var spriteSheet = null;

var updateTimer = null;
var canvas = null;
var canvasSize = {
	width: 400,
	height: 300
};
var input = {
	left: false,
	right: false,
	up: false,
	down: false,
	jump: false,
	run: false
};

$(document).ready(function () {
	setup();
});

async function setup() {
	// Tell the canvas to not smoothen images drawn
	$("canvas").each(function () {
		$(this)[0].getContext("2d").imageSmoothingEnabled = false;
	});

	spriteSheet = await loadImage("sprite.png");

	canvas = $("#mainCanvas")[0];
	canvas.width = canvasSize.width;
	canvas.height = canvasSize.height;

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	const width = 50;
	const height = 30;

	// Create world map array
	level = loadLevel("dummy", spriteSheet);
	player = new Player(level.getSpawnLocation(), spriteSheet);

	start();
}

function loadImage(url) {
	return new Promise(r => {
		let i = new Image();
		i.onload = (() => r(i));
		i.src = url;
	});
}

function keyDownHandler(event) {
	var inputType = getInputTypeFromEvent(event);
	if (inputType !== null)
		input[inputType] = true;
}

function keyUpHandler(event) {
	var inputType = getInputTypeFromEvent(event);
	if (inputType !== null)
		input[inputType] = false;
}

function getInputTypeFromEvent(event) {
	switch (event.code) {
		case "KeyW":
		case "ArrowUp":
			return "up";
		case "KeyA":
		case "ArrowLeft":
			return "left";
		case "KeyS":
		case "ArrowDown":
			return "down";
		case "KeyD":
		case "ArrowRight":
			return "right";
		case "Space":
			return "jump";
		case "ShiftLeft":
			return "run";
		default:
			//console.log(event);
			return null;
	}
}

var updateCycle = 0;
var averageUpdateTime = [];
var deathFadeCounter = 0;
function update() {
	try {
		// Gather performance info
		let start = performance.now();

		if (player.getRequestRestart()) {
			level = loadLevel(level.getName(), spriteSheet);
			player = new Player(level.getSpawnLocation(), spriteSheet);
		}
		if (player.getIsDead()) {
			deathFadeCounter++;
		}
		else {
			deathFadeCounter = 0;
		}


		// Perform world update
		player.update(input, level, []);

		// Begin rendering
		let context = canvas.getContext("2d");
		context.fillStyle = "silver";
		context.fillRect(0, 0, canvasSize.width, canvasSize.height);

		level.draw(context);
		player.draw(context, level.getScroll());


		if (deathFadeCounter > 50) {
			context.fillStyle = `rgba(0, 0, 0, ${(deathFadeCounter - 50) / 100})`;
			context.fillRect(0, 0, canvasSize.width, canvasSize.height);
		}

		// Gather ferformance info
		let stop = performance.now();
		let updateDuration = stop - start;
		averageUpdateTime.push(updateDuration);

		// Render performance info
		if (averageUpdateTime.length > 60) {
			console.log(`Average update() duration: ${averageUpdateTime.reduce((a, b) => a + b, 0) / averageUpdateTime.length} ms`);
			averageUpdateTime = [];
		}

		// Final house-keeping
		updateCycle++;
		if (updateCycle >= Number.MAX_SAFE_INTEGER)
			updateCycle = 0;
	}
	catch (error) {
		clearInterval(updateTimer);
		updateTimer = null;
		console.log("Exception happened, stopping update loop");
		throw error;
	}
}

function start() {
	if (updateTimer !== null)
		clearInterval(updateTimer);
	updateTimer = setInterval(update, 16);
}