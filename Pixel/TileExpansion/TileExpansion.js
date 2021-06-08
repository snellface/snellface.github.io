function renderExpandedImage(canvas, imageData, tileScale, tilePadding, paddingColor, forcePaletteColors, palette, fontSettings, renderPaletteNames) {
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

	ctx.font = `${fontSettings.size}px Tahoma`;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	// Render tiles
	for (let y = 0; y < sourceHeight; y++) {
		for (let x = 0; x < sourceWidth; x++) {
			const pixelX = x * (tileScale + tilePadding) + tilePadding;
			const pixelY = y * (tileScale + tilePadding) + tilePadding;

			let { r, g, b, a } = getRgbaFromImageData(x, y, imageData);
			let closestPaletteEntry = getClosestColor(r, g, b, palette);

			if (forcePaletteColors) {
				r = closestPaletteEntry.r;
				g = closestPaletteEntry.g;
				b = closestPaletteEntry.b;
			}

			ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
			ctx.fillRect(xOffset + pixelX, pixelY, tileScale, tileScale);


			if (renderPaletteNames) {
				const hsl = rgbToHsl(closestPaletteEntry.r, closestPaletteEntry.g, closestPaletteEntry.b);
				const textColor = hsl.l > 0.1 ? "black" : "white";
				const colorName = closestPaletteEntry.name;
				const textX = pixelX + Math.floor(tileScale / 2);
				const textY = pixelY + (Math.floor(tileScale / 2));

				ctx.save();
				ctx.translate(textX, textY);

				const angle = 45;
				ctx.rotate(angle * Math.PI / 180);

				ctx.fillStyle = `rgb(${255}, ${255}, ${255}, 0.5)`;
				let metrics = ctx.measureText(colorName);
				ctx.fillRect(
					Math.floor(-metrics.actualBoundingBoxLeft - 1),
					Math.floor(-metrics.actualBoundingBoxAscent - 2),
					Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight + 3),
					Math.ceil(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + 2),
				)

				ctx.fillStyle = textColor;
				ctx.fillText(colorName, 0, 0);
				ctx.restore();
			}
		}
	}
}