import React, {useState} from 'react';
import {Flashcard} from '../components/Flashcard';

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
        <h1>List n' Learn</h1>
        <button onClick={callApi}>Press me</button>
        {cards.map(c => <Flashcard term={c.term} definition={c.definition} key={c._id}></Flashcard>)}
    </div>
  );
}

export default App;
