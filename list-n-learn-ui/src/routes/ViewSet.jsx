import React, {useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import { FullFlashcard } from '../components/FullFlashcard';

export const ViewSet = () => {
    useEffect(() => {
        getSet();
    }, []);

    // retrieves all cards in db
    // const getAll = () => {
    //     fetch('/allcards')
    //         .then(res => res.json())
    //         .then(res => {
    //             setCards(cards => res);
    //         })
    // }

    const getSet = () => {
        console.log(setID);
        fetch(`/set?id=${setID}`)
            .then(res => res.json())
            .then(res => {
                console.log(res.cards);
                setCards(sets => res.cards);
                
            }) 
    }

    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    // if current username exists setOwner, then do all this
    
    const [cards, setCards] = useState([]);

    return (
        <div>
            <h1 className='title'>My Cards</h1>
            {cards.map(c => console.log(c))}
            {cards.map(c => (<FullFlashcard 
                            term={c.term} 
                            definition={c.definition} 
                            key={c._id}></FullFlashcard>
            ))}
        </div>
    );
}