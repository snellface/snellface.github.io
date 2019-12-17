function loadLevel(levelName) {
	if (levelName === "dummy")
		return createDummyLevel();
	else
		throw 'Loading real levels not yet implemented, please request level named "dummy" for now';
}

function createDummyLevel() {
	const width = 150;
	const height = 30;
	let tileArray = new Array(width).fill(0).map(item => new Array(height).fill(0));

	// Make background checker-board
	for (let x = 0; x < width; x++) {
		for (let y = x % 2; y < height; y += 2) {
			tileArray[x][y] = 1;
		}
	}

	// Make ground
	for (let x = 0; x < width; x++) {
		if (x > 30 && x < 35)
			continue;

		tileArray[x][10] = 2;
	}

	// Make a ceiling wall
	for (let y = 0; y < 6; y++) {
		tileArray[24][y] = 2;
	}

	// Make some lava
	for (let x = 0; x < width; x++) {
		if (x > 40)
			continue;

		tileArray[x][height - 1] = 3;
	}

	tileArray[width - 1][0] = 4;

	let playerSpawnLocation = {
		x: 10,
		y: 8
	};

	tileArray[playerSpawnLocation.x][playerSpawnLocation.y] = 4;
	tileArray[playerSpawnLocation.x][playerSpawnLocation.y - 1] = 4;
	tileArray[playerSpawnLocation.x][playerSpawnLocation.y + 1] = 5;
	tileArray[playerSpawnLocation.x][playerSpawnLocation.y - 2] = 5;


	return new Level(width, height, tileArray, playerSpawnLocation);
}

function Tile(spriteFile, color, isCollidable, isDamageSource) {
	this.isCollidable = isCollidable;
	this.isDamageSource = isDamageSource;
	this.color = color;
	this.sprite = null;

	if (spriteFile !== null) {
		throw "Loading sprite file is not yet implemented";
		// Do sprite loading here
	}

	this.draw = function (context, x, y) {
		context.fillStyle = color;
		context.fillRect(x, y, 16, 16);
	};
}


function Level(width, height, tileArray, playerSpawnLocation) {
	this.getSize = function () {
		return { width: width, height: height };
	};

	const screenTileWidth = 400 / 16;
	const screenTileHeight = 300 / 16;

	// Create first level axis
	this.tiles = new Array(width);
	for (let x = 0; x < width; x++) {
		// Create second level axis
		this.tiles[x] = new Array(height);

		for (let y = 0; y < height; y++) {
			let tileArrayElement = tileArray[x][y];

			let tile = null;
			switch (tileArrayElement) {
				case 0:
					tile = new Tile(null, "Black", false, false);
					break;
				case 1:
					tile = new Tile(null, "rgb(50, 50, 50)", false, false);
					break;
				case 2:
					tile = new Tile(null, "Green", true, false);
					break;
				case 3:
					tile = new Tile(null, "Red", false, true);
					break;
				case 4:
					tile = new Tile(null, "Orange", false, false);
					break;
				case 5:
					tile = new Tile(null, "Silver", false, false);
					break;
				default:
					throw "Invalid tile type found";
			}
			this.tiles[x][y] = tile;
		}
	}

	var scroll = { x: 0, y: 0 };
	this.getScroll = function () {
		return { x: scroll.x, y: scroll.y };
	};
	this.setScroll = function (x, y) {
		scroll.x = x;
		scroll.y = y;
	};
	this.moveScroll = function (x, y, lockLevelInView) {
		scroll.x += x;
		scroll.y += y;

		if (lockLevelInView === true) {
			if (scroll.x + screenTileWidth >= width)
				scroll.x = width - screenTileWidth;
			if (scroll.x < 0)
				scroll.x = 0;

			if (scroll.y + screenTileHeight >= height)
				scroll.y = height - screenTileHeight;
			if (scroll.y < 0)
				scroll.y = 0;
		}
	};
	this.centerScroll = function (x, y, lockLevelInView) {
		scroll.x = x - (screenTileWidth / 2);
		scroll.y = y - (screenTileHeight / 2);

		if (lockLevelInView === true) {
			if (scroll.x + screenTileWidth >= width)
				scroll.x = width - screenTileWidth;
			if (scroll.x < 0)
				scroll.x = 0;

			if (scroll.y + screenTileHeight >= height)
				scroll.y = height - screenTileHeight;
			if (scroll.y < 0)
				scroll.y = 0;
		}
	}
	this.getSpawnLocation = function () {
		return {
			x: playerSpawnLocation.x,
			y: playerSpawnLocation.y
		};
	};
	this.getTile = function (x, y) {
		if (x < 0 || x >= width)
			return null;

		if (y < 0 || y >= height)
			return null;

		return this.tiles[x][y];
	};

	this.translateToScreenCoordinates = function (x, y) {
		return {
			x: Math.floor((x - scroll.x) * 16),
			y: Math.floor((y - scroll.y) * 16)
		};
	};

	this.draw = function (context) {
		let tilePixelOffsetX = Math.floor((Math.floor(scroll.x) - scroll.x) * 16);
		let tilePixelOffsetY = Math.floor((Math.floor(scroll.y) - scroll.y) * 16);

		for (let x = 0; x < 26; x++) {
			for (let y = 0; y < 20; y++) {
				let tileX = Math.floor(scroll.x) + x;
				let tileY = Math.floor(scroll.y) + y;

				let tile = this.getTile(tileX, tileY);
				if (tile === null)
					continue;

				if (tile.sprite === null) {
					let tilePixelX = tilePixelOffsetX + x * 16;
					let tilePixelY = tilePixelOffsetY + y * 16;

					context.fillStyle = tile.color;
					context.fillRect(tilePixelX, tilePixelY, 16, 16);
				}
				else {
					throw "Render with sprite not yet implemented";
					// Render tiles sprite
				}
			}
		}
	};

	return this;
}