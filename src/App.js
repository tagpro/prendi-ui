import React from 'react';
import './App.css';
import ExplorerContextProvider from './Context/AppContext';

function App() {
  return (
    <ExplorerContextProvider>
      <div className="App">
      </div>
    </ExplorerContextProvider>
  );
}

export default App;
