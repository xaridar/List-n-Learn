import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


export const StudySet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const favorites = searchParams.get('favorite') === 'true';

	const [cards, setCards] = useState([]);
	const [info, setInfo] = useState();
	const [index, setIndex] = useState(0);
	const [started, setStarted] = useState(false);
	const [leftDisable, setLeftDisabled] = useState(true);
	const [rightDisable, setRightDisabled] = useState(false);
	const cardRef = useRef();
	const navigate = useNavigate();

	const incrementCount = useCallback(() => {
		if(index + 1 >= cards.length - 1){
			setRightDisabled(true);
		}
		else {
			setRightDisabled(false);
		}
		if (index + 1 < cards.length) {
			setLeftDisabled(false);
			setIndex(index + 1);
			cardRef.current.flipToTerm();
		}
		console.log(index);
	}, [cards.length, index]);

	const decrementCount = useCallback(() => {
		if (index - 1 <= 0){
			setLeftDisabled(true);
		}
		else{
			setLeftDisabled(false);
		}
		if (index - 1 >= 0) {
			setRightDisabled(false);
			setIndex(index - 1);
			cardRef.current.flipToTerm();
		}
	}, [index]);

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
	const commands = [
		{
			command: 'Next card',
			callback: incrementCount,
		},
		{
			command: 'Previous card',
			callback: decrementCount,
		},
		{
			command: 'Flip',
			callback: () => cardRef.current.flipCard(),
		},
		{
			command: 'Repeat',
			callback: () => cardRef.current.speak(),
		},
		{
			command: 'Stop',
			callback: () => cardRef.current.stopSpeech(),
		},
		{
			command: 'View set',
			callback: () => navigate(`/view?id=${setID}`),
		},
		{
			command: 'Start studying',
			callback: () => setStarted(true),
		},
	];
	useSpeechRecognition({ commands });

	//Use flashcard component

	return (
		<div>
			<div className='buttons-row'>
				<a
						className='button viewSet'
						href={`/view?id=${setID}`}>
						View Set
				</a>
			</div>
			{cards.length ? (
				<Flashcard
					started={started}
					ref={cardRef}
					term={cards[index].term}
					definition={cards[index].definition}
				/>
			) : (
				''
			)}
			<button
				disabled={!leftDisable? '': 'true'}
				onClick={decrementCount}>
				<FontAwesomeIcon icon={faArrowLeft}/>
			</button>
			<button 
				disabled={!rightDisable? '': 'true'}
				onClick={incrementCount}>
				<FontAwesomeIcon icon={faArrowRight}/>
			</button>
		</div>

	);
};
