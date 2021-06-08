function getColorsFromCanvas(sourceCanvas) {
	const imageData = loadImageDataFromCanvas(sourceCanvas);
	const sourceWidth = imageData.width;
	const sourceHeight = imageData.height;

	let colors = {};

	for (let y = 0; y < sourceHeight; y++) {
		for (let x = 0; x < sourceWidth; x++) {
			const { r, g, b, a } = getRgbaFromImageData(x, y, imageData);

			const key = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
			if (!Object.prototype.hasOwnProperty.call(colors, key))
				colors[key] = {
					count: 1,
					rgb: {r: r, g: g, b: b},
				};
			else
				colors[key].count += 1;
		}
	}

	let palette = [];
	for (let key in colors) {
		let color = colors[key];
		palette.push({
			r: color.rgb.r, 
			g: color.rgb.g, 
			b: color.rgb.b, 
			count: color.count,
		});
	}
	
	return palette;
}

function mapColorsToPalette(colors, paletteTable) {

}

function generateDefaultPaletteTable() {
	function getObjectFromRgbAndName(r, g, b, name) {
		return {
			r: r,
			g: g,
			b: b,
			name: name
		};
	}

	// Temporary list until i get the real one
	return [
		getObjectFromRgbAndName(255, 0, 0, "Red"),
		getObjectFromRgbAndName(0, 255, 0, "Green"),
		getObjectFromRgbAndName(0, 0, 255, "Blue"),
		getObjectFromRgbAndName(127, 127, 127, "Grey"),
		getObjectFromRgbAndName(0, 0, 0, "Black"),
		getObjectFromRgbAndName(255, 255, 255, "White"),
	]
}

function getClosestColor(r, g, b, palette) {
	let closestEntry = palette[0];
	let closestDistance = Number.MAX_VALUE;

	function colorDistanceSquared(r1, g1, b1, r2, g2, b2) {
		return Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2);
	}

	for (let entry of palette) {
		let thisDistance = colorDistanceSquared(r, g, b, entry.r, entry.g, entry.b);
		if (thisDistance < closestDistance) {
			closestDistance = thisDistance;
			closestEntry = entry;
		}
	}

	return closestEntry;
}

function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;

	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	}
	else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4; 
				break;
		}

		h /= 6;
	}

	return {
		h: h,
		s: s,
		l: l
	};
}