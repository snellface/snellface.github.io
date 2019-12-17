var level = null;
var player = null;

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

function setup() {
	// Tell the canvas to not smoothen images drawn
	$("canvas").each(function () {
		$(this)[0].getContext("2d").imageSmoothingEnabled = false;
	});


	canvas = $("#mainCanvas")[0];
	canvas.width = canvasSize.width;
	canvas.height = canvasSize.height;

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);	

	const width = 50;
	const height = 30;

	// Create world map array
	level = loadLevel("dummy");
	player = new Player(level.getSpawnLocation());

	start();
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
			return "up";
		case "KeyA":
			return "left";
		case "KeyS":
			return "down";
		case "KeyD":
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
function update() {
	try {
		// Gather performance info
		let start = performance.now();

		// Perform world update
		let scrollSpeed = 0.1;
		if (input.run)
			scrollSpeed = 0.5;

		//if (input.left)
		//	level.moveScroll(-scrollSpeed, 0, true);
		//else if (input.right)
		//	level.moveScroll(scrollSpeed, 0, true);

		//if (input.up)
		//	level.moveScroll(0, -scrollSpeed, true);
		//else if (input.down)
		//	level.moveScroll(0, scrollSpeed, true);


		player.update(input, level, []);
		let playerLocation = player.getLocation();
		level.centerScroll(playerLocation.x, playerLocation.y, true);
		

		// Begin rendering
		let context = canvas.getContext("2d");
		context.fillStyle = "silver";
		context.fillRect(0, 0, canvasSize.width, canvasSize.height);

		level.draw(context);
		player.draw(context, level.getScroll());


		// Gather ferformance info
		let stop = performance.now();
		let updateDuration = stop - start;
		averageUpdateTime.push(updateDuration);

		// Render performance info
		if (updateCycle % 60 === 0) {
			if (averageUpdateTime.length > 0) {
				console.log(`Average update() duration: ${averageUpdateTime.reduce((a, b) => a + b, 0) / averageUpdateTime.length} ms`);
			}
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