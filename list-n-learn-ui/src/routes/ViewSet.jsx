import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
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
    }, [])

    // retrieves all cards in db
    const getAll = () => {
        fetch('/allcards')
            .then(res => res.json())
            .then(res => {
                setCards(cards => res);
            })
    }

    const getUserSets = () => {
        fetch('/sets')
            .then(res => res.json())
            .then(res => {
                getSets(sets => res);
            }) 
    }
    
    

    const {id: setID} = useParams();
    // if current username exists setOwner, then do all this
    
    const [sets, getSets] = useState([]);

    if (setID in sets)
    {

    }

    
    const [cards, setCards] = useState([]);
    useEffect(() => {
        getUserSets();
    }, []);
    

    // for(card in cards)
    //     {
    //         if(card._id == setID)
    //         {
    //             return (
    //                 <div className='App'>
    //                     <div className='view'>
    //                         <h1>My Cards</h1>
    //                         {cards.map(c => (<FullFlashcard 
    //                                         term={c.term} 
    //                                         definition={c.definition} 
    //                                         key={c._id}></FullFlashcard>
    //                         ))}
    //                     </div>
    //                 </div>
    //             );
    //         }
    //     }
}