
export default {
	// makes sure color is in correct format
	validColor(color) {
		let pattern = /#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})\b|rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/;
		let match = pattern.exec(color);

		if(match) {
			return true;
		}

		console.error('Incorrect color format in props: ' + color);
		return false;
	},

	// creates the color objects for Highlighter.js
	createColorObjects(colors, columns) {
		let newColors = [];
		let colorSet = new Set();

		// colors have labels
		if(Array.isArray(colors[0])) {
			for(const color of colors) {
				if(color.length === 2) {
					if(this.validColor(color[0]) && !colorSet.has(color[0])) {
						newColors.push({
							color: color[0],
							style: this.makeButtonStyle(color[0]),
							text: color[1]
						});
						colorSet.add(color[0]);
					}
				} else {
					console.error('Color in incorrect format: ' + color);
				}
			}
		} else { // colors do not have labels
			for(const color of colors) {
				if(this.validColor(color) && !colorSet.has(color)) {
					newColors.push({
						color: color,
						style: {
							backgroundColor: color, 
							color: color, 
							minWidth: '30px', 
							minHeight: '30px',
						},
						text: null
					});
					colorSet.add(color);
				}
			}
		}

		// split colors into number of columns
		newColors = this.splitColors(newColors, columns);

		return newColors;

	}, 

	// splits color list into a 2d array to have color rows
	splitColors(colors, cols) {
		let splitList = [];

		while(colors.length > 0) {
			if(colors.length <= cols) {
				splitList.push(colors);
				colors = [];
			} else {
				splitList.push(colors.slice(0,cols));
				colors = colors.slice(cols);
			}
		}

		return splitList;
	},

	// gets color in rgb() or #rgb format and returns object with red,blue,green in decimal
	extractRGB(color) {
		let pattern = /rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/;
		let match = pattern.exec(color);

		if(match) {
			// rgb(r,g,b) pattern 
			return {
				red: match[1],
				green: match[2],
				blue: match[3],
			}			
		} else {
			// #rgb pattern 
			color = color.substring(1); // get rid of #
			let red = '';
			let green = '';
			let blue = '';

			if(color.length === 3) {
				// get single hex val 
				red = color.charAt(0);
				green = color.charAt(1);
				blue = color.charAt(2);

				// make double hex value
				red += red;
				green += green;
				blue += blue;
			} else {				
				red = color.substring(0,2);
				green = color.substring(2,4);
				blue = color.substring(4);
			}

			return {
				red: parseInt(red,16),
				green: parseInt(green,16),
				blue: parseInt(blue,16),
			}
		}
	},

	// makes style for text and background of highlighted text
	makeTextStyle(color) {
		// get rgb values
		let rgb = this.extractRGB(color);

		// some color theory found on stack overflow
		let val = rgb.red*0.299 + rgb.green*0.587 + rgb.blue*0.114;
		let text = val > 186 ? '#000000' : '#ffffff';

		return {
			backgroundColor: color,
			color: text,
		}		
	},

	// makes style for Buttons
	// TODO: check for validColor
	makeButtonStyle(color) {
		// get rgb values
		let rgb = this.extractRGB(color);

		// some color theory found on stack overflow
		let val = rgb.red*0.299 + rgb.green*0.587 + rgb.blue*0.114;
		let text = val > 186 ? '#000000' : '#ffffff';

		return {
			backgroundColor: color,
			color: text,
			minWidth: '30px',
			minHeight: '30px',  		
			whiteSpace: 'pre',
		}		
	}

}