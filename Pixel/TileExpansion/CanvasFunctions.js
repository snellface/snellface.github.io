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