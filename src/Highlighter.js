import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-text-selection-popover';
import { Button, ButtonGroup, MenuList, MenuItem, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { GithubPicker } from 'react-color';

class Highlighter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.text,
			textList: [{
				text: this.props.text,
				style: null,
				ref: React.createRef()
			}],
			colorOptions: this.validateColors(this.props.colors)
		}
	}

	// makes sure color is in correct format
	validColor(color) {
		let pattern = /#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})\b|rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/;
		let match = pattern.exec(color);

		if(match) {
			return true;
		}

		console.error('Incorrect color format in props: ' + color);
		return false;
	}

	validateColors(colors) {
		let newColors = [];
		// colors have labels
		if(Array.isArray(colors[0])) {
			for(const color of colors) {
				if(color.length === 2) {
					if(this.validColor(color[0])) {
						newColors.push({
							color: color[0],
							style: this.makeButtonStyle(color[0]),
							text: color[1]
						});
					}
				} else {
					console.error('Color in incorrect format: ' + color);
				}
			}
		} else { // colors do not have labels
			for(const color of colors) {
				if(this.validColor(color)) {
					newColors.push({
						color: color,
						style: {backgroundColor: color, color: color,'min-width': '30px', 'min-height': '30px'},
						text: ''
					});
				}
			}
		}

		newColors = this.splitColors(newColors);

		return newColors;

	}

	splitColors(colors) {
		let splitList = [];

		while(colors.length > 0) {
			if(colors.length <= 8) {
				splitList.push(colors);
				colors = [];
			} else {
				splitList.push(colors.slice(0,8));
				colors = colors.slice(8);
			}
		}

		return splitList;
	}

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
			color = color.substring(1);
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
	}

	// makes style for text and background of highlighted text
	makeStyle(color) {
		// get rgb values
		let rgb = this.extractRGB(color);

		// some color theory found on stack overflow
		let val = rgb.red*0.299 + rgb.green*0.587 + rgb.blue*0.114;
		let text = val > 186 ? '#000000' : '#ffffff';

		return {
			backgroundColor: color,
			color: text,
		}		
	}

	// makes style for Buttons
	makeButtonStyle(color) {
		// get rgb values
		let rgb = this.extractRGB(color);

		// some color theory found on stack overflow
		let val = rgb.red*0.299 + rgb.green*0.587 + rgb.blue*0.114;
		let text = val > 186 ? '#000000' : '#ffffff';

		return {
			backgroundColor: color,
			color: text,
			'min-width': '30px',
			'min-height': '30px'  		
		}		
	}

	highlightText(color) {
		const selection = window.getSelection();

		if(selection) {
			if(selection.anchorNode.textContent !== selection.focusNode.textContent) {
				return;
			}

 			let str = selection.toString();
 			let span = selection.anchorNode.textContent;

			// get start and end of selection
			let start = Math.min(selection.anchorOffset,selection.focusOffset);
			let end = start + str.length;

			// get index of span which selection is in
			let textList = this.state.textList;
			var index = [];

			for(var i = 0; i < textList.length;i++) {
				if(textList[i].text === span) {
					index.push(i);
				}
			}		

			console.log('index: ' + index);
			console.log('length: ' + index.length);
			console.log('start: ' + start + ' end: ' + end);

			// Things that we need to check for
			/*
			is span === str
			does start === 0
			does end === span.length - 1
			*/

			// checks that there are only one text that matches the span
			if(index.length === 1) {

				// check if whole span is selected, if so change the background
				if (span === str) {
					textList[index].style = this.makeStyle(color);
				} else {

					let del = 1;
					let oldStyle = textList[index].style;

					// check if str is ends at the end of span
					if(end !== span.length) {
						// replace old span with span after highlight
						textList.splice(index, 1, {
							text: span.substring(end),
							style: oldStyle,
							ref: ''
						});

						del = 0
					}
					
					// insert highlighted span
					textList.splice(index, del, {
						text: str,
						style: this.makeStyle(color),
						ref: ''
					});

					// check if str starts at beginning of span 
					if (start !== 0) {
						// insert span before highlight
						textList.splice(index, 0, {
							text: span.substring(0,start),
							style: oldStyle,
							ref: ''
						});
					}
				}
				
				this.setState({
					textList: textList
				});

			}

		}
	}

	render() {
		const selectable_ref = React.createRef();

		return (
			<div style={this.props.style}>
				<span ref={selectable_ref}>
					{this.state.textList.map((text) => {
						return (
							<span 
							key={text.text}
							style={text.style} 
							>
							{text.text}
							</span>
						)
					})}
				</span>
				<Popover selectionRef={selectable_ref} >
					<Paper>
					<Grid container direction='column'>
					{this.state.colorOptions.map((colorRow) => 
						<Grid item>
							<Grid container>
								<Grid item>
									<ButtonGroup variant='contained'>
									{colorRow.map((color) => 
										<Button
										size="small"
										key={color}
										onClick={this.highlightText.bind(this,color.color)}
										style={color.style} 
										>
										{color.text}
										</Button>
									)}
									</ButtonGroup>
								</Grid>							
							</Grid>
						</Grid>
					)}
					</Grid>
					</Paper>
				</Popover>
			</div>
		);
	}
}

// ({backgroundColor: color, color: color })
/*
<ButtonGroup variant='contained'>
	{this.state.colorOptions.map((color) => 
		<Button
		size="small"
		key={color}
		onClick={this.highlightText.bind(this,color)}
		style={({backgroundColor: color, color: color })} 
		>
		Hi :)
		</Button>
	)}
</ButtonGroup>
*/


Highlighter.propTypes = {
	text: PropTypes.string.isRequired,
	style: PropTypes.object,
	colors: PropTypes.array,
	callback: PropTypes.func
}

Highlighter.defaultProps = {
	colors: [],
	style: null
}

export default Highlighter;