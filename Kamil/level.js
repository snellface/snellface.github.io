function loadLevel(levelName, spriteSheet) {
	if (levelName === "dummy")
		return createDummyLevel(spriteSheet);
	else
		throw 'Loading real levels not yet implemented, please request level named "dummy" for now';
}

function createDummyLevel(spriteSheet) {
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
		tileArray[x][11] = 8;
	}
	// Make ground
	for (let x = 0; x < width; x++) {
		if (x % 10 > 3)
			continue;
		tileArray[x][17] = 2;
	}

	// Make a ceiling wall
	for (let y = 0; y < 7; y++) {
		tileArray[24][y] = 6;
	}

	// Make some lava
	for (let x = 0; x < width; x++) {
		if (x > 40)
			continue;

		tileArray[x][height - 1] = 3;
	}
	// Make some lava
	tileArray[0][10] = 3;
	tileArray[1][10] = 3;
	tileArray[2][10] = 3;

	// put some ugly flames on top of lava
	tileArray[0][9] = 7;
	tileArray[1][9] = 7;
	tileArray[2][9] = 7;


	tileArray[width - 1][0] = 4;

	let playerSpawnLocation = {
		x: 10,
		y: 9
	};

	tileArray[playerSpawnLocation.x][playerSpawnLocation.y] = 4;
	tileArray[playerSpawnLocation.x][playerSpawnLocation.y - 1] = 4;
	tileArray[playerSpawnLocation.x][playerSpawnLocation.y - 2] = 5;


	return new Level("dummy", width, height, tileArray, playerSpawnLocation, spriteSheet);
}


function Tile(spriteInfo, name, color, isCollidable, isDamageSource) {
	this.isCollidable = isCollidable;
	this.isDamageSource = isDamageSource;
	this.color = color;
	this.name = name;
	//this.sprite = null;

	//if (spriteInfo !== null) {
	//	this.sprite = spriteInfo;
	//}

	this.draw = function (context, x, y) {
		if (spriteInfo !== null) {
			context.drawImage(spriteInfo.image, spriteInfo.x * 16, spriteInfo.y * 16, 16, 16, x, y, 16, 16);
		}
		else {
			context.fillStyle = color;
			context.fillRect(x, y, 16, 16);
		}
	};
}

function Level(name, width, height, tileArray, playerSpawnLocation, spriteSheet) {
	this.getSize = function () {
		return { width: width, height: height };
	};

	const screenTileWidth = 400 / 16;
	const screenTileHeight = 300 / 16;

	this.getName = function () {
		return name;
	};

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
					tile = new Tile(null, "bg1", "Black", false, false);
					break;
				case 1:
					tile = new Tile(null, "bg2", "rgb(50, 50, 50)", false, false);
					break;
				case 2:
					tile = new Tile({ image: spriteSheet, x: 0, y: 4 }, "green floor with orange stuff", "Green", true, false);
					break;
				case 3:
					tile = new Tile({ image: spriteSheet, x: 2, y: 4 }, "lava", "Red", false, true);
					break;
				case 4:
					tile = new Tile(null, "door pt1", "Orange", false, false);
					break;
				case 5:
					tile = new Tile(null, "door pt2", "Silver", false, false);
					break;
				case 6:
					tile = new Tile({ image: spriteSheet, x: 1, y: 4 }, "brick wall", "Orange", true, false);
					break;
				case 7:
					tile = new Tile({ image: spriteSheet, x: 3, y: 4 }, "lava flame (non lethal)", "Black", false, false);
					break;
				case 8:
					tile = new Tile({ image: spriteSheet, x: 4, y: 4 }, "green floor without orange stuff", "Green", true, false);
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
		scroll.x = x - screenTileWidth / 2;
		scroll.y = y - screenTileHeight / 2;

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

				let tilePixelX = tilePixelOffsetX + x * 16;
				let tilePixelY = tilePixelOffsetY + y * 16;
				tile.draw(context, tilePixelX, tilePixelY);
			}
		}
	};

	return this;
}