import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { FullFlashcard } from '../components/FullFlashcard';

export const ViewSet = () => {
    const getAll = () => {
        fetch('/allcards')
            .then(res => res.json())
    }
    
    const {id: setID} = useParams();
    // if current username exists setOwner, then do all this
    
    const [cards, setCards] = useState([]);
    useEffect(() => {
        getAll();
    }, []);
    return (
        <div className='App'>
            <div className="view">
                {cards.map(c => <FullFlashcard term={c.term} definition={c.definition} key={c._id}></FullFlashcard>)}
            </div>
        </div>
    );
}