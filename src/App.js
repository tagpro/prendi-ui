import React from 'react';
import './App.css';
import ExplorerContextProvider from './Context/AppContext';
import ClickBaitContainer from './ClickBait/ClickBaitContainer';

function App() {
  return (
    <ExplorerContextProvider>
      <div className="App">
        <ClickBaitContainer></ClickBaitContainer>
      </div>
    </ExplorerContextProvider>
  );
}

export default App;
