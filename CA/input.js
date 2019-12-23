function registerInputListeners(document) {
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

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
} // ~registerInputListeners()

var input = {
	left: false,
	right: false,
	up: false,
	down: false,
	space: false
};

function getInputTypeFromEvent(event) {
	switch (event.code) {
		case "KeyW":
		case "ArrowUp":
			return "up";
		case "KeyA":
		case "ArrowLeft":
			return "left";
		case "KeyS":
		case "ArrowDown":
			return "down";
		case "KeyD":
		case "ArrowRight":
			return "right";
		case "Space":
			return "space";
		default:
			//console.log(event);
			return null;
	}
} // ~getInputTypeFromEvent()