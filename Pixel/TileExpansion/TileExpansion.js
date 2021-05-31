function loadImageDataFromCanvas(canvas) {
	const ctx = canvas.getContext('2d');
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function getRgbaFromImageData(x, y, imageData) {
	const offset = (x + y * imageData.width) * 4;
	const data = imageData.data;
	if (offset >= data.length)
		throw "Index outside image area";

	return {
		r: data[offset + 0],
		g: data[offset + 1],
		b: data[offset + 2],
		a: data[offset + 3],
	}
}

function renderExpandedImage(canvas, imageData, tileScale, tilePadding, paddingColor) {
	const sourceWidth = imageData.width;
	const sourceHeight = imageData.height;

	const xOffset = 0; // Axis text offset

	const expandedWidth = sourceWidth * (tileScale + tilePadding) + tilePadding + xOffset;
	const expandedHeight = sourceHeight * (tileScale + tilePadding) + tilePadding;
	canvas.width = expandedWidth;
	canvas.height = expandedHeight;

	const ctx = canvas.getContext('2d');
	ctx.fillStyle = paddingColor;
	ctx.fillRect(0, 0, expandedWidth, expandedHeight);

	for (let y = 0; y < sourceHeight; y++) {
		for (let x = 0; x < sourceWidth; x++) {
			const { r, g, b, a } = getRgbaFromImageData(x, y, imageData);
			const pixelX = x * (tileScale + tilePadding) + tilePadding;
			const pixelY = y * (tileScale + tilePadding) + tilePadding;

			ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
			ctx.fillRect(xOffset + pixelX, pixelY, tileScale, tileScale);
		}
	}
}