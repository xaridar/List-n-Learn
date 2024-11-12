import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useSearchParams } from "react-router-dom";
import { Flashcard } from '../components/Flashcard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
	const keyListener = useCallback(
		(e) => {
			if (e.code === 'Space') {
				cardRef.current.flipCard();
			}
			if (e.code === 'ArrowLeft') {
				decrementCount();
			}
			if (e.code === 'ArrowRight') {
				incrementCount();
			}
		},
		[incrementCount, decrementCount],
	);
	useEffect(() => {
		document.addEventListener('keydown', keyListener, true);

		return () => {
			document.removeEventListener('keydown', keyListener);
		};
	}, [keyListener]);
    

    function incrementCount() {
        if(index + 1 < cards.length){
            setIndex(index + 1);
            cardRef.current.flipToTerm();
        }
    }

    function decrementCount() {
        if(index - 1 >= 0){
            setIndex(index - 1);
            cardRef.current.flipToTerm();
        }
    }

    const commands = [
        {
            command: 'Next card',
            callback: incrementCount
        },
        {
            command: 'Previous card',
            callback: decrementCount
        },
        {
            command: 'Flip',
            callback: () => cardRef.current.flipCard()
        }
    ];
    const {} = useSpeechRecognition({commands});
    useEffect(() => {
        SpeechRecognition.startListening({continuous: true});
        return () => SpeechRecognition.stopListening();
    }, []);

    const [cards, setCards] = useState([]);
    const [info, setInfo] = useState();
    const [index, setIndex] = useState(0);
    const cardRef = useRef();

    

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
    {cards.length ? <Flashcard ref={cardRef} term = {cards[index].term} definition = {cards[index].definition} /> : ''}
    <button onClick = {incrementCount} >Next Card</button>
    <button onClick = {decrementCount} >Previous Card</button>
    </>
           
    )
}
