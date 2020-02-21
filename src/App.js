import React from 'react';
import logo from './logo.svg';
import './App.css';
import Highlighter from './Highlighter';

function App() {
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
  //const colors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
  const colors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];

  return (
    <div className="App">
      <Highlighter text={tempText} colors={colors} style={({backgroundColor: '#000', color: '#FFF'})} />
    </div>
  );
}

export default App;
