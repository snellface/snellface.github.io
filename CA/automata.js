function setGridSize(grid, width, height) {
	function defaultGridElement(x, y) {
		return {
			x: x,
			y: y,
			state: 0,
			color: { r: 0, g: 0, b: 0 },
			neighbours: {
				n: null,
				ne: null,
				e: null,
				se: null,
				s: null,
				sw: null,
				w: null,
				nw: null,
				all: []
			}
		};
	}

	if (grid === null) {
		grid = new Array(width).fill(0).map(item => new Array(height).fill(0));

		grid.width = width;
		grid.height = height;

		for (let x = 0; x < grid.width; x++) {
			for (let y = 0; y < grid.height; y++) {
				grid[x][y] = defaultGridElement(x, y);
			}
		}
	}

	let oldGrid = grid;
	grid = new Array(width).fill(0).map(item => (new Array(height).fill(0)));
	grid.width = width;
	grid.height = height;

	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
			if (x < oldGrid.width && y < oldGrid.height)
				grid[x][y] = oldGrid[x][y];
			else
				grid[x][y] = defaultGridElement(x, y);
		}
	}

	// Fill neighbour data
	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
			grid[x][y].neighbours.n = grid[x][y - 1];
		}
	}

	return grid;
} // ~setGridSize()

function getUint32FromRgb(rgb) {
	return 255 << 24 | // alpha
		Math.floor(rgb.b) << 16 |   // blue
		Math.floor(rgb.g) << 8 |    // green
		Math.floor(rgb.r);          // red
}

function renderGrid(canvas, grid) {
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;
	const ctx = canvas.getContext('2d');
	const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	const buf = new ArrayBuffer(imageData.data.length);
	const buf8 = new Uint8ClampedArray(buf);
	let data = new Uint32Array(buf);
	for (let y = 0; y < canvasHeight; y++) {
		let yOffset = y * canvasWidth;
		for (let x = 0; x < canvasWidth; x++) {
			let cell = grid[x][y];
			let byte = getUint32FromRgb(cell.color);
			data[yOffset + x] = byte;
		}
	}
	imageData.data.set(buf8);
	ctx.putImageData(imageData, 0, 0);
} // ~renderGrid()

function renderXyColorList(canvas, list) {
	//const canvasWidth = canvas.width;
	//const canvasHeight = canvas.height;
	//const ctx = canvas.getContext('2d');
	//const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	//let pixels = imageData.data;

	//for (let i = 0; i < list.length; i++) {
	//	let item = list[i];
	//	if (item.x >= 0 && item.x < canvas.width) {
	//		if (item.y >= 0 && item.y < canvas.height) {
	//			let offset = (item.y * canvasWidth + item.x) * 4;
	//			pixels[offset] = item.color.r;
	//			pixels[offset + 1] = item.color.g;
	//			pixels[offset + 2] = item.color.b;
	//			pixels[offset + 3] = 255; // Alpha
	//		}
	//	}
	//}
	//ctx.putImageData(imageData, 0, 0);
} // ~renderXyColorList()


// getRainbowRgbColor is normally used as such:
// let color = getRainbowRgbColor(1, 1, 1, 0, 2 * Math.PI / 3, 4 * Math.PI / 3, 150, 55, updateCounter / 1000);
function getRainbowRgbColor(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, counter) {
	// Center is the R, G, B values middle point, width is how much they oscillate around that
	// Counter offsets the color to cycle the rainbow
	if (typeof center === "undefined")
		center = 128;
	if (typeof width === "undefined")
		width = 127;
	if (typeof counter === "undefined")
		counter = 0;

	let r = Math.sin(frequency1 * counter + phase1) * width + center;
	let g = Math.sin(frequency2 * counter + phase2) * width + center;
	let b = Math.sin(frequency3 * counter + phase3) * width + center;
	return { r: r, g: g, b: b };
} // ~getRainbowRgbColor()