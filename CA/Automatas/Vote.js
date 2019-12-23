function caSetup() {
	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
			if (Math.random() > 0.5) {
				grid[x][y].state = 1;
			}
		}
	}
}

function caUpdate(updateCycle) {
	function vote(x, y) {
		let yay = 0;
		let nay = 0;

		if (yay > nay)
			return 1;
		if (nay > yay)
			return -1;
		return 0;
	}

	if (updateCycle === 120) {

		for (let x = 0; x < grid.width; x++) {
			for (let y = 0; y < grid.height; y++) {
				if (Math.random() > 0.5) {
					grid[x][y].state = 1;
				}
			}
		}
	}
}

function caPostRender(canvas) {
	
}

