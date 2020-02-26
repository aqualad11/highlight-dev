import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-text-selection-popover';
import { Button, ButtonGroup } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ColorHelper from './ColorHelper'

class Highlighter extends React.Component {
	constructor(props) {
		super(props);
		console.log(ColorHelper);
		this.state = {
			text: this.import(this.props.text),
			textList: this.props.import ? this.import(this.props.text) : 
			[{
				text: this.props.text,
				style: null,
				label: null,
				ref: React.createRef()
			}],
			colorOptions: ColorHelper.createColorObjects(this.props.colors)
		}
	}

	import(text) {
		let pattern = /\[([^[]*)\]\((.{4,17})\)/g;
		let match =  [];//text.match(/\[([^[]*)\]\((.{4,17})\)/g)
		let matches = [];

		// extract colors and text
		do {
			match = pattern.exec(text);
			if(match) {
				let colorLabel = match[2].split(', ');
				console.log('labelColor: ');
				console.log(colorLabel);
				matches.push({
					fullLength: match[0].length,
					innerText: match[1],
					color: colorLabel[0],
					label: colorLabel.length === 2 ? colorLabel[1] : null,
					index: match.index
				})
			}

			console.log('matches')
			console.log(match)
			
		} while(match);

		let textList = [];
		let start = 0;

		// construct textList 
		for(const m of matches) {
			// there is text before the next highlighted text
			if(start !== m.index) {
				textList.push({
					text: text.substring(start, m.index),
					style: null,
					label: null,
					ref: React.createRef()
				});
			} 

			// add highlighted text
			textList.push({
				text: m.innerText, 
				style: ColorHelper.makeTextStyle(m.color),
				label: m.label,
				ref: React.createRef()
			});
			start = m.index + m.fullLength;

		}

		// get last piece of unhighlighted text
		if(start !== text.length) {
			textList.push({
				text: text.substring(start),
				style: null,
				label: null,
				ref: React.createRef()
			});

		}
		

		return textList;
	}

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

		this.props.callback(str);
	}	
	

	highlightText(color, label) {
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
					textList[index].style = ColorHelper.makeTextStyle(color);
				} else {

					let del = 1;
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
							ref: label
						});

						del = 0
					}
					
					// insert highlighted span
					textList.splice(index, del, {
						text: str,
						style: ColorHelper.makeTextStyle(color),
						label: label,
						ref: ''
					});

					// check if str starts at beginning of span 
					if (start !== 0) {
						// insert span before highlight
						textList.splice(index, 0, {
							text: span.substring(0,start),
							style: outerStyle,
							label: outerLabel,
							ref: ''
						});
					}
				}
				
				this.setState({
					textList: textList
				});

				if(this.props.callback) {
					this.export();
				}
			}

		}
	}

	// TODO: the title isn't working, figure it out
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
							title={text.label}
							>
							{text.text}
							</span>
						)
					})}
				</span>
				<Popover selectionRef={selectable_ref} >
				<Grid container alignContent='space-around' direction='column'>
					{this.state.colorOptions.map((colorRow) => 
							<Grid container>
									{colorRow.map((color) => 
										<Grid item style={({flexGrow: '2'})}>
										<Button
										size="small"
										title={color.text}
										key={color.text}
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

/*
<Grid container direction='column'>
					{this.state.colorOptions.map((colorRow) => 
						<Grid item>
							<Grid container style={({'align-items': 'stretch'})}>
								<Grid item>
									<ButtonGroup variant='contained'>
									{colorRow.map((color) => 
										<Button
										size="small"
										title={color.text}
										key={color.text}
										onClick={this.highlightText.bind(this,color.color,color.text)}
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
*/

/*
					<GridList cols={6}>
					{this.props.colors.map((color) => 
						<GridListTile key={color}>
							<Button
							size="small"
							title={color.text}
							key={color.text}
							onClick={this.highlightText.bind(this,color)}
							style={({backgroundColor: color})} 
							>
							Hello
							</Button>	
						</GridListTile>
					)}	
					</GridList>

*/


Highlighter.propTypes = {
	text: PropTypes.string.isRequired,
	style: PropTypes.object,
	colors: PropTypes.array,
	callback: PropTypes.func,
	import: PropTypes.bool
}

Highlighter.defaultProps = {
	colors: [],
	style: null,
	callback: null,
	import: false
}

export default Highlighter;