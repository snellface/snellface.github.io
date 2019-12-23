var ants = [];

function caSetup() {
	// Spawn initial ants, one centered, the rest are randomized
	spawnAnt(Math.floor(grid.width / 2), Math.floor(grid.height / 2), "single");
	while (ants.length < 100) {
		let type = "rectangle";
		let x = Math.floor(Math.random() * grid.width);
		let y = Math.floor(Math.random() * grid.height);
		spawnAnt(x, y, type);
	}
}

function updateAnts(updateCycle) {
	for (let i = 0; i < ants.length; i++) {
		let ant = ants[i];
		if (ant.x < 0)
			ant.x = 0;
		if (ant.y < 0)
			ant.y = 0;
		if (ant.x >= grid.width)
			ant.x = ant.x % grid.width;
		if (ant.y >= grid.height)
			ant.y = ant.y % grid.height;

		// At a white square, turn 90° right, flip the color of the square, move forward one unit
		// At a black square, turn 90° left, flip the color of the square, move forward one unit

		if (grid[ant.x][ant.y].state === 0) {
			grid[ant.x][ant.y].state = 1;
			grid[ant.x][ant.y].color = getRainbowRgbColor(1, 1, 1, 0, 2 * Math.PI / 3, 4 * Math.PI / 3, 150, 55, updateCycle / 1000);
			ant.dir--;
			if (ant.dir < 0)
				ant.dir = 3;
		}
		else {
			grid[ant.x][ant.y].state = 0;
			grid[ant.x][ant.y].color = { r: 0, g: 0, b: 0 };
			ant.dir++;
			if (ant.dir > 3)
				ant.dir = 0;
		}

		// Move ant according to its direction
		switch (ant.dir) {
			case 0:
				ant.y--;
				break;
			case 1:
				ant.x++;
				break;
			case 2:
				ant.y++;
				break;
			case 3:
				ant.x--;
				break;
			default:
				ant.dir = 0;
				break;
		}

		// Make sure ant is within the wrapped plane
		if (ant.x < 0)
			ant.x = grid.width - 1;
		else if (ant.x >= grid.width)
			ant.x = 0;

		if (ant.y < 0)
			ant.y = grid.height - 1;
		else if (ant.y >= grid.height)
			ant.y = 0;
	}
}

function fadeGrid() {
	for (let y = 0; y < grid.height; y++) {
		for (let x = 0; x < grid.width; x++) {
			let cell = grid[x][y];
			if (cell.state > 0) {
				cell.state++;

				let avg = (cell.color.r + cell.color.g + cell.color.b) / 3;
				if (avg > 50) {
					cell.color.r *= 0.999;
					cell.color.g *= 0.999;
					cell.color.b *= 0.999;
				}
			}
		}
	}
}

function caUpdate(updateCycle) {
	updateAnts(updateCycle);
	fadeGrid();
}

function caPostRender(canvas) {
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "Red";
	for (let i = 0; i < ants.length; i++) {
		let ant = ants[i];
		ctx.fillRect(ant.x, ant.y, 1, 1);
	}
}

function spawnAnt(x, y, type) {
	let dir = Math.floor(Math.random() * 4);
	if (dir >= 3)
		dir = 3;

	let newAnts = [];

	if (typeof type === "undefined" || type === null) {
		type = "single";
	}

	switch (type) {
		case "single":
			newAnts.push({ x: x, y: y, dir: dir });
			break;
		case "spinner":
			dir = Math.random() < 0.5 ? 0 : 2;
			newAnts.push({ x: x, y: y, dir: dir });
			newAnts.push({ x: x + 1, y: y, dir: dir });
			break;
		case "rectangle":
			dir = Math.random() < 0.5 ? 0 : 2;
			newAnts.push({ x: x, y: y, dir: dir });
			newAnts.push({ x: x, y: y + 1, dir: dir });
			break;
		case "spaceship":
			newAnts.push({ x: x, y: y, dir: dir });
			newAnts.push({ x: x, y: y + 1, dir: dir });
			newAnts.push({ x: x + 1, y: y, dir: dir });
			newAnts.push({ x: x + 1, y: y + 1, dir: dir });
			break;
		default:
			console.log(`Can't spawn ant; Unknown type: "${type}"`);
			break;
	}

	for (let i = 0; i < newAnts.length; i++) {
		if (newAnts[i].x < 0)
			newAnts[i].x += grid.width;
		if (newAnts[i].x < 0)
			newAnts[i].x = 0;

		if (newAnts[i].x >= grid.width)
			newAnts[i].x -= grid.width;
		if (newAnts[i].x >= grid.width)
			newAnts[i].x = grid.width - 1;

		if (newAnts[i].y < 0)
			newAnts[i].y += grid.height;
		if (newAnts[i].y < 0)
			newAnts[i].y = 0;

		if (newAnts[i].y >= grid.height)
			newAnts[i].y -= grid.height;
		if (newAnts[i].y >= grid.height)
			newAnts[i].y = grid.height - 1;

		ants.push(newAnts[i]);
	}
} // ~spawnAnt()