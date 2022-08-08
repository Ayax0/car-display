export function getImageColor(image) {
	return new Promise((resolve, reject) => {
		var blockSize = 5, // only visit every 5 pixels
			defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
			bottom_threshold = 50,
			top_threshold = 220,
			color_threshold = 20,
			color_variance = 10,
			canvas = document.createElement("canvas"),
			context = canvas.getContext && canvas.getContext("2d"),
			data,
			width,
			height,
			img = new Image(),
			i = -4,
			length,
			colors = [],
			colors_alt = [];

		if (!context) {
			return defaultRGB;
		}

		height = canvas.height = image.height;
		width = canvas.width = image.width;

		img.crossOrigin = "anonymous";
		img.src = image.url;
		img.onload = () => {
			context.drawImage(img, 0, 0);

			try {
				data = context.getImageData(0, 0, width, height);
			} catch (e) {
				return reject(defaultRGB);
			}

			length = data.data.length;

			while ((i += blockSize * 4) < length) {
				const sorted_color = [data.data[i], data.data[i + 1], data.data[i + 2]].sort();
				const variance = Math.abs(sorted_color[0] - sorted_color[2]);
				if (variance > 50) {
					const color = {
						r: Math.round(data.data[i] / color_threshold) * color_threshold,
						g: Math.round(data.data[i + 1] / color_threshold) * color_threshold,
						b: Math.round(data.data[i + 2] / color_threshold) * color_threshold,
					};
					let entry = colors.findIndex((e) => e.r == color.r && e.g == color.g && e.b == color.b);
					if (entry != -1) colors[entry].c += 1;
					else colors.push({ ...color, c: 1 });
				}

				if (!(data.data[i] < bottom_threshold && data.data[i + 1] < bottom_threshold && data.data[i + 2] < bottom_threshold)) {
					if (data.data[i] < top_threshold && data.data[i + 1] < top_threshold && data.data[i + 2] < top_threshold) {
						const color = {
							r: Math.round(data.data[i] / color_threshold) * color_threshold,
							g: Math.round(data.data[i + 1] / color_threshold) * color_threshold,
							b: Math.round(data.data[i + 2] / color_threshold) * color_threshold,
						};
						let entry = colors_alt.findIndex((e) => e.r == color.r && e.g == color.g && e.b == color.b);
						if (entry != -1) colors_alt[entry].c += 1;
						else colors_alt.push({ ...color, c: 1 });
					}
				}
			}

			colors = colors.sort((a, b) => (a.c < b.c ? -1 : a.c == b.c ? 0 : 1)).reverse();
			colors_alt = colors_alt.sort((a, b) => (a.c < b.c ? -1 : a.c == b.c ? 0 : 1)).reverse();

			var selection = [];

			for (const color of colors) {
				if (selection.length == 0) selection.push(color);
				if (selection.length == 1) {
					let count = 1;
					while (selection.length == 1 && count < colors.length) {
						let color = colors[count];
						if (
							Math.abs(color.r - selection[0].r) > color_variance ||
							Math.abs(color.g - selection[0].g) > color_variance ||
							Math.abs(color.b - selection[0].b) > color_variance
						)
							selection.push(color);
						count++;
					}
				}
			}
			if (selection.length == 2) return resolve(selection);
			for (const color of colors_alt) {
				if (selection.length == 0) selection.push(color);
				if (selection.length == 1) {
					let count = 1;
					while (selection.length == 1 && count < colors.length) {
						let color = colors[count];
						if (
							Math.abs(color.r - selection[0].r) > color_variance ||
							Math.abs(color.g - selection[0].g) > color_variance ||
							Math.abs(color.b - selection[0].b) > color_variance
						)
							selection.push(color);
						count++;
					}
				}
			}
			if (selection.length == 2) return resolve(selection);
			for (const color of colors) {
				if (selection.length == 0) selection.push(color);
				if (selection.length == 1) selection.push(color);
			}
			if (selection.length == 2) return resolve(selection);
			for (const color of colors_alt) {
				if (selection.length == 0) selection.push(color);
				if (selection.length == 1) selection.push(color);
			}
			if (selection.length == 2) return resolve(selection);
			else
				return resolve([
					{ r: 22, g: 22, b: 22 },
					{ r: 48, g: 48, b: 48 },
				]);
		};
	});
}
