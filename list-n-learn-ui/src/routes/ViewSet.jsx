import React, {useState, useEffect} from 'react';
import {Flashcard} from '../components/Flashcard';
import { useParams } from "react-router-dom";

export const ViewSet = () => {
    const getAll = () => {
        fetch('/cards')
            .then(res => res.json())
            .then(res => {
                console.log(cards);
                setCards(cards => [...cards, res._doc]);
            });
    }
    
    const {id: setID} = useParams();
    // if current username exists setOwner, then do all this
    
    const [cards, setCards] = useState([]);
    useEffect(() => {
        getAll();
    }, []);
    return (
        
        <div classname="view">
            {cards.map(c => <Flashcard term={c.term} definition={c.definition} key={c._id}></Flashcard>)}
        </div>
    );
}