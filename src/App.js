import * as React from 'react';
import { Component } from 'react';
import * as logo from './logo.svg';
import './App.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {mainContent: null};
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.mainContent? <this.state.mainContent /> : <button onClick={()=>this.loadMainContent()}>Load main content</button>}
      </div>
    );
  }

  async loadMainContent() {
    const module = await import("./MainContent");
    this.setState({mainContent: module.MainContent});
  }
}

export default App;
