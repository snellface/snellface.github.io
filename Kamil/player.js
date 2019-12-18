// JavaScript source code
function Player(spawnLocation, spriteSheet) {
	var location = {
		x: spawnLocation.x,
		y: spawnLocation.y
	};
	var speed = {
		x: 0,
		y: 0
	};
	this.getLocation = function () {
		return {
			x: location.x,
			y: location.y
		};
	};

	let direction = "right";
	let action = "still";

	var jumpValidCountdown = 0; // Can only jump when this is above 0, used to allow for jumping shortly after falling of a ledge
	var boostingJump = false;
	this.update = function (input, level, enemies) {
		if (dead) {
			deathAnimation();
			return;
		}
		// User input
		// Left and right movement
		let acceleration = 0.03;
		if (input.run)
			acceleration += 0.02;

		if (input.left)
			speed.x -= acceleration;
		else if (input.right)
			speed.x += acceleration;

		// Bleed speed
		const deacceleration = 0.02;
		if (speed.x >= deacceleration) {
			speed.x -= deacceleration;
			direction = "right";
		}
		else if (speed.x <= -deacceleration) {
			speed.x += deacceleration;
			direction = "left";
		}
		else
			speed.x = 0;

		let absSpeed = Math.abs(speed.x);
		if (absSpeed < deacceleration) {
			if (action !== "still") {
				action = "still";
				animationFrame = 0;
			}
		}
		else if (absSpeed < deacceleration) {
			if (action !== "run") {
				action = "run";
				animationFrame = 0;
			}
		}
		else {
			if (action !== "walk") {
				action = "walk";
				animationFrame = 0;
			}
		}

		// Limit max speeds
		let maxSpeed = 0.3;
		if (input.run)
			maxSpeed += 0.1;

		if (speed.x > maxSpeed)
			speed.x = maxSpeed;
		else if (speed.x < -maxSpeed)
			speed.x = -maxSpeed;

		// Jumping and falling
		jumpValidCountdown--;
		if (jumpValidCountdown < 0)
			jumpValidCountdown = 0;

		if (input.jump) {
			if (jumpValidCountdown > 0) {
				speed.y = -0.3;
				boostingJump = true;
				jumpValidCountdown = 0;
			}
			else if (boostingJump) {
				speed.y -= 0.01;
			}
		}
		else {
			boostingJump = false;
		}

		const gravity = 0.02;
		speed.y += gravity;

		// Perform movement and check for collisions
		location.x += speed.x;
		if (speed.x > 0) {
			// Going right
			let collided = false;
			for (let i = -1; i < 2 && !collided; i++) {
				let tile = level.getTile(Math.floor(location.x + 1), Math.floor(location.y + i));
				if (tile === null || tile.isCollidable)
					collided = true;
			}
			if (collided) {
				location.x = Math.floor(location.x) - 0.001;
				speed.x = 0;
			}
		}
		else if (speed.x < 0) {
			// Going left
			let collided = false;
			for (let i = -1; i < 2 && !collided; i++) {
				let tile = level.getTile(Math.floor(location.x), Math.floor(location.y + i));
				if (tile === null || tile.isCollidable)
					collided = true;
			}
			if (collided) {
				location.x = Math.floor(location.x + 1) + 0.001;
				speed.x = 0;
			}
		}

		onGround = false;
		location.y += speed.y;
		if (speed.y > 0) { 
			// Going down
			let collided = false;
			for (let i = 0; i < 2 && !collided; i++) {
				let tile = level.getTile(Math.floor(location.x + i), Math.floor(location.y + 1));
				if (tile === null || tile.isCollidable)
					collided = true;
			}
			if (collided) {
				location.y = Math.floor(location.y) - 0.001;
				speed.y = 0;
				jumpValidCountdown = 10;
			}
		}
		else if (speed.y < 0) {
			// Going up
			let collided = false;
			for (let i = 0; i < 2 && !collided; i++) {
				let tile = level.getTile(Math.floor(location.x + i), Math.floor(location.y - 1));
				if (tile === null || tile.isCollidable)
					collided = true;
			}
			if (collided) {
				location.y = Math.floor(location.y + 1) + 0.001;
				speed.y = 0;
			}
		}

		// Check for damage tiles
		let damage = false;
		for (let y = -1; y < 2; y++) {
			for (let x = 0; x < 2; x++) {
				let tile = level.getTile(Math.floor(location.x + x), Math.floor(location.y + y));
				if (tile !== null && tile.isDamageSource)
					damage = true;
			}
		}

		if (damage) {
			death();
			return;
		}

		if (action === "run")
			animationFrame += 3 / 60;
		animationFrame += 5 / 60;
		if (animationFrame >= animationFrameLength)
			animationFrame = 0;

		keepPlayerInLevelArea(level);
		level.centerScroll(location.x, location.y, true);
	};

	var dead = false;
	this.getIsDead = function () {
		return dead;
	};
	function death() {
		dead = true;
		speed = {
			x: 0,
			y: 0
		};
	}

	var deathAnimationFrame = 0;
	var requestRestartLevel = false;
	function deathAnimation() {
		if (deathAnimationFrame === 0) {
			// some setup
			speed.y = -0.3;
		}
		else if (deathAnimationFrame > 20) {
			location.y += speed.y;
			speed.y += 0.02;
		}


		if (deathAnimationFrame > 260) {
			requestRestartLevel = true;
		}

		deathAnimationFrame++;
	}

	this.getRequestRestart = function () {
		return requestRestartLevel;
	};

	function keepPlayerInLevelArea(level) {
		let levelSize = level.getSize();
		if (location.x < 0)
			location.x = 0;
		else if (location.x >= levelSize.width - 1)
			location.x = levelSize.width - 1;

		if (location.y < 0)
			location.y = 0;
		else if (location.y >= levelSize.height)
			location.y = levelSize.height;
	}

	const animationFrameLength = 4;
	var animationFrame = 0;
	function getAnimationInfo() {
		let spriteX = Math.floor(animationFrame) * 16;
		switch (action) {
			case "still":
				break;
			case "walk":
				spriteX += 16 * animationFrameLength;
				break;
			case "run":
				spriteX += 16 * animationFrameLength * 2;
				break;
		}

		let spriteY = 0;
		if (direction === "left")
			spriteY = 2*16;

		return {
			x: spriteX,
			y: spriteY
		};
	}

	this.draw = function (context, scroll) {
		let x = Math.floor((location.x - scroll.x) * 16);
		let y = Math.floor((location.y - scroll.y) * 16);

		let animationInfo = getAnimationInfo();;
		context.save();
		context.scale(1, 1);
		context.drawImage(spriteSheet, animationInfo.x, animationInfo.y, 16, 32, x, y - 16, 16, 32);
		context.restore();
	};
}