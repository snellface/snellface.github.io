var updateTimer = null;
var updateCycle = 0;
var updateInterval = 17; // 60 fps = 16.6ms
var averageUpdateTime = [];
var canvas = null;
var grid = null;

$(document).ready(function () {
	setup();
}); // ~$(document).ready()

async function setup() {
	// Tell the canvas to not smoothen images drawn
	$("canvas").each(function () {
		$(this)[0].getContext("2d").imageSmoothingEnabled = false;
	});

	canvas = $("#mainCanvas")[0];

	$(window).resize(resize).resize();
	$(document).bind('mousewheel', function (e) {
		if (!e.shiftKey)
			return;

		if (e.originalEvent.wheelDelta / 120 > 0) {
			if (updateInterval >= 5)
				updateInterval = Math.floor(updateInterval / 2);
			else
				updateInterval--;
		}
		else {
			if (updateInterval >= 5)
				updateInterval = Math.floor(updateInterval * 2);
			else
				updateInterval++;
		}

		if (updateInterval < 1)
			updateInterval = 1;
		console.log(`New update interval is ${updateInterval} ms per frame`);
		if (updateTimer !== null)
			clearInterval(updateTimer);
		updateTimer = setInterval(update, updateInterval);
	});

	caSetup();

	start();

	registerInputListeners(document);
} // ~setup()

function resize() {
	const worldScaling = 5;

	let width = Math.floor($(window).width() / worldScaling);
	let height = Math.floor($(window).height() / worldScaling);

	console.log(`New grid size: ${[width, height]}`);

	canvas.width = width;
	canvas.height = height;

	grid = setGridSize(grid, canvas.width, canvas.height);
} // ~resize()

var nextPeformanceLog = performance.now() + 1000;
function update() {
	try {
		// Gather performance info
		let start = performance.now();

		caUpdate(updateCycle);

		renderGrid(canvas, grid);
		caPostRender(canvas);

		let stop = performance.now();
		let updateDuration = stop - start;
		averageUpdateTime.push(updateDuration);

		// Render performance info
		if (nextPeformanceLog <= start && averageUpdateTime.length >= 1) {
			console.log(`Average update() duration: ${averageUpdateTime.reduce((a, b) => a + b, 0) / averageUpdateTime.length} ms`);
			averageUpdateTime = [];
			nextPeformanceLog = start + 1000;
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
} // ~update()

function start() {
	if (updateTimer !== null)
		clearInterval(updateTimer);
	updateTimer = setInterval(update, updateInterval);
} // ~start()