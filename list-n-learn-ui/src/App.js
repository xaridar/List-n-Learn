import logo from './logo.svg';
import './App.css';

import {useState, useEffect} from 'react';

const App = () => {
  const callApi = () => {
    fetch('/api')
      .then(res => res.text())
      .then(res => setMsg(res));
  }

  const [msg, setMsg] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {msg}
        <button onClick={callApi}>Press me</button>
      </header>
    </div>
  );
}

export default App;
