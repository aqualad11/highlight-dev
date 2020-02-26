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
      exportText: exp,
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
      ['#008B02', 'Hello'],
      ['#006B76', 'World'],
      ['#1273DE', 'IneedU'],
      ['#004DCF', 'Have'], 
      ['#5300EB', 'Heart'],
      ['#EB9694', 'Odd'],
      ['#B80000', 'Label 1'],
      ['#DB3E00', 'Person'],
      ['#FCCB00', 'Location'],
      ['#008B02', 'Hello'],
      ['#006B76', 'World'],
      ['#1273DE', 'IneedU'],
      ['#004DCF', 'Have'], 
      ['#5300EB', 'Heart'],
      ['#EB9694', 'Odd']
    ];

    if(this.state.counter > 4) {
      return (
        <div className="App">
          <h3>Single Color Array</h3>
          <Highlighter text={tempText} colors={single_colors} style={({backgroundColor: '#000', color: '#FFF'})} />
          <h3>Double Color Array</h3>
          <Highlighter 
          text={tempText} 
          colors={dbl_colors} 
          style={({backgroundColor: '#000', color: '#FFF'})} 
          callback={this.callbackDbl.bind(this)} />
          <h3>export text</h3>
          <p>{this.state.exportDblText}</p>
          <h3>imported text</h3>
          <Highlighter import text={this.state.exportDblText} colors={dbl_colors} style={({backgroundColor: '#000', color: '#FFF'})} callback={this.callback.bind(this)} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <h3>Single Color Array</h3>
          <Highlighter text={tempText} colors={single_colors} style={({backgroundColor: '#000', color: '#FFF'})} />
          <h3>Double Color Array</h3>
          <Highlighter text={tempText} colors={dbl_colors} style={({backgroundColor: '#000', color: '#FFF'})} callback={this.callbackDbl.bind(this)} />
          <h3>export single text</h3>
          <p>{this.state.exportSingleText}</p>
          <h3>export double text</h3>
          <p>{this.state.exportDblText}</p>
        </div>
      );
    }
  }
}

export default App;
