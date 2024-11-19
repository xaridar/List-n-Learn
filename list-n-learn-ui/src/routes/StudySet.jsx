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


    //Use flashcard component
    //add title and description
    //disabled attribute on next card and previous card buttons
    //disabled = true : false
    //put arrows in the buttons

    return (
    <>
    {cards.length ? <Flashcard term = {cards[index].term} definition = {cards[index].definition} /> : ''}
    <button onClick = {incrementCount} >Next Card</button>
    <button onClick = {decrementCount} >Previous Card</button>
    </>
           
    )
}
