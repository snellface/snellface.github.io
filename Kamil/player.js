// JavaScript source code
function Player(spawnLocation) {
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
	this.update = function (input, level, enemies) {
		const acceleration = 0.03;
		if (input.left)
			speed.x -= acceleration;
		else if (input.right)
			speed.x += acceleration;

		if (input.up)
			speed.y -= acceleration;
		else if (input.down)
			speed.y += acceleration;

		const maxSpeed = 0.3;
		if (speed.x > maxSpeed)
			speed.x = maxSpeed;
		else if (speed.x < -maxSpeed)
			speed.x = -maxSpeed;

		const deacceleration = 0.02;
		if (speed.x >= deacceleration)
			speed.x -= deacceleration;
		else if (speed.x <= -deacceleration)
			speed.x += deacceleration;
		else
			speed.x = 0;

		if (speed.y >= deacceleration)
			speed.y -= deacceleration;
		else if (speed.y <= -deacceleration)
			speed.y += deacceleration;
		else
			speed.y = 0;

		location.x += speed.x;
		location.y += speed.y;

		keepPlayerInLevelArea(level);
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

	this.draw = function (context, scroll) {
		let x = Math.floor((location.x - scroll.x) * 16);
		let y = Math.floor((location.y - scroll.y) * 16);
		context.fillStyle = "Azure";
		context.fillRect(x, y - 16, 16, 32);
	};
}