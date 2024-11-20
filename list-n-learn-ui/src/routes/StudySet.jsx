import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const StudySet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const favorites = searchParams.get('favorite') === 'true';

	const [cards, setCards] = useState([]);
	const [info, setInfo] = useState();
	const [index, setIndex] = useState(0);
	const [started, setStarted] = useState(false);
	const cardRef = useRef();
	const navigate = useNavigate();

	const incrementCount = useCallback(() => {
		if (index + 1 < cards.length) {
			setIndex(index + 1);
			cardRef.current.flipToTerm();
		}
	}, [cards.length, index]);

	const decrementCount = useCallback(() => {
		if (index - 1 >= 0) {
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
		<>
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
			<button onClick={decrementCount}>Previous Card</button>
			<button onClick={incrementCount}>Next Card</button>
		</>
	);
};
