import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/index';
import Home from './components/home/home';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Home />
          <Routes />
        </div>
      </BrowserRouter>
    );
  }

}

export default App;