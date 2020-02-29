import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-text-selection-popover';
import { Button, Grid } from '@material-ui/core';
import ColorHelper from './ColorHelper'

class Highlighter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			textList: this.props.import ? this.import(this.props.text) : 
			[{
				text: this.props.text,
				style: null,
				label: null,
				id: Date.now(),
				ref: React.createRef()
			}],
			colorOptions: ColorHelper.createColorObjects(this.props.colors, this.props.cols),
			isOpen: false,
		}
	}

	// import existing highlighted text that has been exported
	import(text) {
		let pattern = /\[([^[]*)\]\((.{4,17})\)/g;
		let match =  [];//text.match(/\[([^[]*)\]\((.{4,17})\)/g)
		let matches = [];

		// extract colors and text
		do {
			match = pattern.exec(text);
			if(match) {
				let colorLabel = match[2].split(', ');
				matches.push({
					fullLength: match[0].length,
					innerText: match[1],
					color: colorLabel[0],
					label: colorLabel.length === 2 ? colorLabel[1] : null,
					index: match.index
				})
			}

			
		} while(match);

		let textList = [];
		let start = 0;
		let ids = Date.now();

		// construct textList 
		for(const m of matches) {
			// there is text before the next highlighted text
			if(start !== m.index) {
				textList.push({
					text: text.substring(start, m.index),
					style: null,
					label: null,
					id: ids++,
					ref: React.createRef()
				});
			} 


			// add highlighted text
			textList.push({
				text: m.innerText, 
				style: ColorHelper.makeTextStyle(m.color),
				label: m.label,
				id: ids++,
				ref: React.createRef()
			});

			start = m.index + m.fullLength;
			ids++;
		}

		// get last piece of unhighlighted text
		if(start !== text.length) {
			textList.push({
				text: text.substring(start),
				style: null,
				label: null,
				id: ids,
				ref: React.createRef()
			});

		}
		

		return textList;
	}

	// export highlighted text to be stored
	export() {
		let str = '';
		for(const text of this.state.textList) {
			if(text.style) {
				// check if text has labels
				if(text.label) {
					str += '['+ text.text + '](' + text.style.backgroundColor + ', ' + text.label + ')';
				} else {
					str += '['+ text.text + '](' + text.style.backgroundColor +')'
				}

			} else {
				str += text.text;
			}
		}

		this.props.export(str);
	}	
	

	// highlight selected text
	highlightText(color, label) {
		// get selected text
		const selection = window.getSelection();

		if(selection) {
			// check if selected unhighlighted and highlighted text
			if(selection.anchorNode.textContent !== selection.focusNode.textContent) {
				return;
			}

			// get span vars
			let spanId = selection.getRangeAt(0).startContainer.parentNode.id; 
 			let str = selection.toString();
 			let span = selection.anchorNode.textContent;

			// get start and end of selection
			let start = Math.min(selection.anchorOffset,selection.focusOffset);
			let end = start + str.length;

			// get index of span which selection is in
			let textList = this.state.textList;
			var index = null;

			for(var i = 0; i < textList.length;i++) {
				if(textList[i].id == spanId) {
					index = i;
					break;
				}
			}		

	
			// checks that there are only one text that matches the span
			if(index !== null) {

				// check if whole span is selected, if so change the background
				if (span === str) {
					textList[index].style = ColorHelper.makeTextStyle(color);
				} else {

					let del = 1;
					let ids = Date.now();

					// grab outer span style and label
					let outerStyle = textList[index].style;
					let outerLabel = textList[index].label;


					// check if str is ends at the end of span
					if(end !== span.length) {
						// replace old span with span after highlight
						textList.splice(index, 1, {
							text: span.substring(end),
							style: outerStyle,
							label: outerLabel,
							id: ids,
							ref: label
						});

						del = 0
					}
					
					// insert highlighted span
					textList.splice(index, del, {
						text: str,
						style: ColorHelper.makeTextStyle(color),
						label: label,
						id: ++ids,
						ref: ''
					});

					// check if str starts at beginning of span 
					if (start !== 0) {
						// insert span before highlight
						textList.splice(index, 0, {
							text: span.substring(0,start),
							style: outerStyle,
							label: outerLabel,
							id: ++ids,
							ref: ''
						});
					}
				}
				
				// update state
				this.setState({
					textList: textList,
					isOpen: false
				});

				// export text
				if(this.props.export) {
					this.export();
				}
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
							id={text.id}
							key={text.id}
							style={text.style} 
							title={text.label}
							>
							{text.text}
							</span>
						)
					})}
				</span>
				<Popover 
				selectionRef={selectable_ref}
				isOpen={this.state.isOpen}
				onTextSelect={() => this.setState({ isOpen: true })}
			 	onTextUnselect={() => this.setState({ isOpen: false })} >
					<Grid container alignContent='space-around' direction='column'>
					{this.state.colorOptions.map((colorRow) => 
						<Grid container key={'cont_' + colorRow[0].color}>
							{colorRow.map((color) => 
								<Grid item xs key={'item_' + color.color}> 
									<Button
									fullWidth
									size="small"
									title={color.text}
									key={color.color}
									onClick={this.highlightText.bind(this,color.color,color.text)}
									style={color.style}
									>
									{color.text}
									</Button>
								</Grid>							
							)}
						</Grid>
					)}
					</Grid>
				</Popover>
			</div>
		);
	}
}


Highlighter.propTypes = {
	text: PropTypes.string.isRequired,
	style: PropTypes.object,
	colors: PropTypes.array,
	export: PropTypes.func,
	cols: PropTypes.number,
	import: PropTypes.bool
}

Highlighter.defaultProps = {
	colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'],
	style: null,
	export: null,
	cols: 8,
	import: false
}

export default Highlighter;