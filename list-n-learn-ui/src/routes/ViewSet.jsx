import React, {useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import { FullFlashcard } from '../components/FullFlashcard';
import { checkUser } from '../util';

export const ViewSet = () => {
    useEffect(() => {
        const fetchUser = async () => {
            const user = localStorage.getItem('lnl-user');
            if (user) {
                if (await checkUser(user)) {
                    console.log("Valid user");
                } else localStorage.removeItem('lnl-user');
            }
        }
        fetchUser();
        getSet();
    }, [])

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

    const setID = useSearchParams()[0].get('id');
    // if current username exists setOwner, then do all this
    
    const [cards, setCards] = useState([]);
    
    return (
        <div className='App'>
            <div className='view'>
                <h1>My Cards</h1>
                {cards.map(c => console.log(c))}
                {cards.map(c => (<FullFlashcard 
                                term={c.term} 
                                definition={c.definition} 
                                key={c._id}></FullFlashcard>
                ))}
            </div>
        </div>
    );
}