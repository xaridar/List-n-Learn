import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { defCommands, speakPhrase } from '../util';
import { link } from 'framer-motion/client';

export const StudySet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	
	useEffect(() => {
		setStudyingFavs(searchParams.get('favorite') === 'true')
	}, [])

	const [studyingFavs, setStudyingFavs] = useState(false);
	const [cards, setCards] = useState([]);
	const [currCards, setCurrCards] = useState([]);
	const [info, setInfo] = useState();
	const [index, setIndex] = useState(0);
	const [started, setStarted] = useState(false);
	const [leftDisable, setLeftDisabled] = useState(true);
	const [rightDisable, setRightDisabled] = useState(true);
	const cardRef = useRef();
	const navigate = useNavigate();

	const restartStudying = useCallback(() => {
		setCurrCards(studyingFavs ? cards.filter(card => card.favorite) : cards);
		console.log(cards.filter(cards => cards.favorite))
		setIndex(0);
		setLeftDisabled(true);
		cardRef.current?.flipToTerm();
	}, [cards, studyingFavs]);

	useEffect(() => {
		if (currCards.length < 2) setRightDisabled(true);
		else setRightDisabled(false);
	}, [currCards])

	const incrementCount = useCallback(() => {
		console.log(currCards);
		if (index + 1 >= currCards.length - 1) {
			setRightDisabled(true);
		} else {
			setRightDisabled(false);
		}
		if (index + 1 < currCards.length) {
			setLeftDisabled(false);
			setIndex(index + 1);
			cardRef.current.flipToTerm();
		} else if (started)
			speakPhrase('You have reached the end of the set! If you\'d like to restart it, say "Restart".');
	}, [currCards.length, index, started]);

	const decrementCount = useCallback(() => {
		if (index - 1 <= 0) {
			setLeftDisabled(true);
		} else {
			setLeftDisabled(false);
		}
		if (index - 1 >= 0) {
			setRightDisabled(false);
			setIndex(index - 1);
			cardRef.current.flipToTerm();
		} else if (started) speakPhrase('You are at the first card of the set!');
	}, [index, started]);

	useEffect(() => {
		if (!setID) {
			navigate('/');
			return;
		}
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
	}, [setID, navigate]);

	useEffect(() => {
		restartStudying();
	}, [cards]);

	//check if user exist
	const keyListener = useCallback(
		(e) => {
			console.log(e.code);
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
			command: 'Restart',
			callback: restartStudying,
		},
		{
			command: 'View set',
			callback: () => navigate(`/view?id=${setID}`),
		},
		{
			command: 'Edit set',
			callback: () => {
				if (username === info.user) navigate(`/edit?id=${setID}`);
				else speakPhrase('You cannot edit this set!');
			},
		},
		{
			command: 'Start studying',
			callback: () => setStarted(true),
		},
	];
	commands.push(...defCommands(navigate));
	useSpeechRecognition({ commands });

	const username = localStorage.getItem('lnl-user');

	//Use flashcard component

	return (
		<div style={{ maxWidth: '1000px', margin: 'auto' }}>
			<div
				className='button'
				onClick={() => setStarted(true)}>
				Start Studying
			</div>
			<div className='study-group'>
				<div className='arrow-ctr'>
					<button
						className='no-button arrow'
						disabled={!leftDisable ? '' : 'true'}
						onClick={decrementCount}>
						<FontAwesomeIcon icon={faArrowLeft} />
					</button>
				</div>
				{currCards.length ? (
					<Flashcard
						started={started}
						ref={cardRef}
						term={currCards[index].term}
						definition={currCards[index].definition}
						favorite={currCards[index].favorite}
					/>
				) : (
					''
				)}
				<div className='arrow-ctr'>
					<button
						className='no-button arrow'
						disabled={!rightDisable ? '' : 'true'}
						onClick={incrementCount}>
						<FontAwesomeIcon icon={faArrowRight} />
					</button>
				</div>
			</div>
			<button className='button' onClick={restartStudying}>Start from Beginnning</button>
			<a
				className='button action-button editSet'
				href={`/view?id=${setID}`}
				data-tooltip-id='my-tooltip'
				data-tooltip-content='View Set'>
				<FontAwesomeIcon icon={faEye} />
			</a>
			{info && username === info.user && (
				<a
					className='button action-button ab-left editSet'
					href={`/edit?id=${setID}`}
					data-tooltip-id='my-tooltip'
					data-tooltip-content='Edit Set'>
					<FontAwesomeIcon icon={faPen} />
				</a>
			)}
		</div>
	);
};
