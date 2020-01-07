function caSetup() {
	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
			if (Math.random() > 0.5) {
				//grid[x][y].state = 1;
			}
		}
	}

	grid[Math.floor(grid.width / 2)][Math.floor(grid.height / 2)].state = 1;
	grid[Math.floor(grid.width / 2)][Math.floor(grid.height / 2)].color = { r: 255, g: 0, b: 0 };
}

function caUpdate(updateCycle) {
	
}

function caPostRender(canvas) {
	
}

