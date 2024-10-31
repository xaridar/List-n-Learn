import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { FullFlashcard } from '../components/FullFlashcard';
import { Flashcard } from '../components/Flashcard';

export const ViewSet = () => {
    const getAll = () => {
        fetch('/allcards')
            .then(res => res.json())
            .then(res => {
                setCards(cards => res);
            })
    }
    
    const {id: setID} = useParams();
    // if current username exists setOwner, then do all this
    
    const [cards, setCards] = useState([]);
    useEffect(() => {
        getAll();
    }, []);
    return (
        <div className='App'>
            <div className='view'>
                <h1>My Cards</h1>
                {cards.map(c => (<FullFlashcard 
                                term={c.term} 
                                definition={c.definition} 
                                key={c._id}></FullFlashcard>
                ))}
            </div>
        </div>
    );
}