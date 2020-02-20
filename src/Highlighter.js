import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-text-selection-popover';
import {Button, ButtonGroup} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

class Highlighter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.text,
			textList: [{
				text: this.props.text,
				style: null,
				background: '',
				ref: React.createRef()
			}],
			colorOptions: this.props.colors.filter(color => this.validateColor(color))
		}
	}

	// makes sure color is in correct format
	validateColor(color) {
		let pattern = /#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})\b|rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/;
		let match = pattern.exec(color);
		if(match) {
			return true;
		}
		console.error('Incorrect color format in props: ' + color);
		return false;
	}

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
				red = color.charAt(0);
				green = color.charAt(1);
				blue = color.charAt(2);
			} else if(color.length === 6) {				
				red = color.substring(0,2);
				green = color.substring(2,4);
				blue = color.substring(4);
			}

			return {
				red: red,
				green: green,
				blue: blue,
			}
		}

	}

	makeStyle(color) {

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
					textList[index].background = color;
				} else {

					let del = 1;

					// check if str is ends at the end of span
					if(end !== span.length) {
						// replace old span with span after highlight
						textList.splice(index, 1, {
							text: span.substring(end),
							background: '',
							ref: ''
						});

						del = 0
					}
					
					// insert highlighted span
					textList.splice(index, del, {
						text: str,
						background: color,
						ref: ''
					});

					// check if str starts at beginning of span 
					if (start !== 0) {
						// insert span before highlight
						textList.splice(index, 0, {
							text: span.substring(0,start),
							background: '',
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

	// TODO: add this feature once base component is done and published
	/*
	addHighlightColor() {

	}
	*/

	render() {
		const selectable_ref = React.createRef();

		return (
			<div style={this.props.style}>
				<span ref={selectable_ref}>
					{this.state.textList.map((text) => {
						if(text.background) {
							return (
								<span 
								key={text.text}
								style={({backgroundColor: text.background})} 
								>
								{text.text}
								</span>
							)
						} else {
							return (
								<span 
								key={text.text}
								>
								{text.text}
								</span>
							)
						}
					})}
				</span>
				<Popover selectionRef={selectable_ref} >
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
				</Popover>
			</div>
		);
	}
}

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