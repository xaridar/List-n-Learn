import React, {useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import { Flashcard } from '../components/Flashcard';


export const StudySet = () => {
    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    useEffect(() => {
		const getSet = () => {
			console.log(setID);
			fetch(`/set?id=${setID}`)
				.then((res) => res.json())
				.then((res) => {
					setInfo((set) => res);
					setCards((set) => res.cards);
				});
		};
		getSet();
	}, [setID]);
    //check if user exist
    



    const [cards, setCards] = useState([]);
    const [info, setInfo] = useState([]);
    const [index, setIndex] = useState(0);
    

    function incrementCount() {
        if(index + 1 < cards.length){
            setIndex(index + 1)
        }
    }

    function decrementCount() {
        if(index - 1 >= 0){
            setIndex(index - 1)
        }
    }

    

    //call function that displays card
    //const displaySet = ({term, definition}) => {
        //return (
           // <div>
                //<h1 className = 'cardFront'>My Cards</h1>
            //</div>
        //)
        
    //}

    //Use flashcard component

    return (
    <>
    {cards.length ? <Flashcard term = {cards[index].term} definition = {cards[index].definition} /> : ''}
    <button onClick = {incrementCount} >Next Card</button>
    <button onClick = {decrementCount} >Previous Card</button>
    </>
           
    )
}
