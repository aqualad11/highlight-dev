import React from 'react';
import logo from './logo.svg';
import './App.css';
import Highlighter from './Highlighter';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      exportSingleText: '',
      exportDblText: '',
      singleCounter: 0,
      dblCounter: 0
    }
  }

  callbackSingle(exp) {
    this.setState({
      exportSingleText: exp,
      singleCounter: this.state.singleCounter + 1
    })
  }

  callbackDbl(exp) {
    this.setState({
      exportDblText: exp,
      dblCounter: this.state.dblCounter + 1
    })
  }

  render() {
    let tempText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    /*
    const colors = [
      'rgb(150,150,150)',
      'rgb(150,250,150)',
      'rgb(150,150,250)',
      '#0F357D',
      '#FFF',
      '12345'
    ];
    */
    const single_colors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
    const dbl_colors = [
      ['#B80000', 'Label 1'],
      ['#DB3E00', 'Person'],
      ['#FCCB00', 'Location'],
      ['#008B02', 'Hello World'],
      ['#006B76', 'fren'],
      ['#1273DE', 'IneedU'],
      ['#004DCF', 'Have'], 
      ['#5300EB', 'Heart'],
      ['#EB9694', 'Odd'],
      ['#B80000', 'Label 1'],
      ['#DB3E00', 'Person'],
      ['#FCCB00', 'Location'],
      ['#008B02', 'Hello World'],
      ['#006B76', 'fren'],
      ['#1273DE', 'IneedU'],
      ['#004DCF', 'Have'], 
      ['#5300EB', 'Heart'],
      ['#EB9694', 'Odd']
    ];

    const demo_colors = [
      '#b80000', 
      '#DB3E00', 
      '#008B02',
      '#FC0',
      'rgb(109,163,182)'
    ];

    const labeledColors = [
      ['#B80000', 'Label 1'],
      ['#DB3E00', 'Label 2'],
      ['#008B02', 'Label 3'],
      ['#FC0', 'Label 4'],
      ['rgb(109,163,182)', 'Label 5'],
    ]

    const demoText = 'This is the demo text for unlabeled colors.';
    const demoLabelsText = 'This is the demo text for labeled colors.';

    if(this.state.dblCounter > 4) {
      return (
        <div className="App">
          <h3>Single Color Array</h3>
          <Highlighter cols={4} text={tempText} colors={single_colors} style={({backgroundColor: '#000', color: '#FFF'})} />
          <h3>Double Color Array</h3>
          <Highlighter 
          text={tempText} 
          colors={dbl_colors} 
          style={({backgroundColor: '#000', color: '#FFF'})} 
          callback={this.callbackDbl.bind(this)} />
          <h3>export single text</h3>
          <p>{this.state.exportSingleText}</p>
          <h3>export double text</h3>
          <p>{this.state.exportDblText}</p>
          <h3>imported single text</h3>
          <Highlighter 
          import 
          cols={10} 
          text={this.state.exportSingleText} 
          colors={dbl_colors} 
          style={({backgroundColor: '#000', color: '#FFF'})} />
          <h3>imported double text</h3>
          <Highlighter import text={this.state.exportDblText} colors={dbl_colors} style={({backgroundColor: '#000', color: '#FFF'})}  />
        </div>
      );
    } else {
      return (
        <div className="App" style={({backgroundColor:'black',color: '#FFF'})}>
          <br/>
          <br/>
          <br/>
          <h3>Basic Example</h3>
          <Highlighter text={tempText} style={({backgroundColor: '#000', color: '#FFF'})} />
          <h3>Single Color Array</h3>
          <Highlighter text={tempText} colors={single_colors} style={({backgroundColor: '#000', color: '#FFF'})} callback={this.callbackSingle.bind(this)}/>
          <h3>Double Color Array</h3>
          <Highlighter cols={5} text={tempText} colors={dbl_colors} style={({backgroundColor: '#000', color: '#FFF'})} callback={this.callbackDbl.bind(this)} />
          <h3>export single text</h3>
          <p>{this.state.exportSingleText}</p>
          <h3>export double text</h3>
          <p>{this.state.exportDblText}</p>
          <p>demo colors w/out labels</p>
          <Highlighter text={demoText} colors={demo_colors} />
          <br/>
          <p>demo colors w/ labels</p>
          <Highlighter text={demoLabelsText} colors={labeledColors} />
          <br/>
          <br/>
          <br/>
        </div>
      );
    }
  }
}

export default App;
