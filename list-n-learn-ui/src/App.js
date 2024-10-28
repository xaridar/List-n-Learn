import logo from './logo.svg';
import './App.css';

import React, {useState, useEffect} from 'react';
import {Flashcard} from './components/Flashcard';

const App = () => {
  const callApi = () => {
    fetch('/api')
        .then(res => res.json())
        .then(res => {
            console.log(cards);
            setCards(cards => [...cards, res._doc]);
        });
  }

  const [cards, setCards] = useState([]);
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
        <button onClick={callApi}>Press me</button>
        {cards.map(c => <Flashcard term={c.term} definition={c.definition} key={c._id}></Flashcard>)}
      </header>
    </div>
  );
}

export default App;
