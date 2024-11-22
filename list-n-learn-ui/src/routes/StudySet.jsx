import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { defCommands, speakPhrase } from '../util';

export const StudySet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const favorites = searchParams.get('favorite') === 'true';

	const [cards, setCards] = useState([]);
	const [info, setInfo] = useState();
	const [index, setIndex] = useState(0);
	const [started, setStarted] = useState(false);
	const [leftDisable, setLeftDisabled] = useState(true);
	const [rightDisable, setRightDisabled] = useState(true);
	const cardRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		setIndex(0);
		setLeftDisabled(true);
		if (cards.length < 2) setRightDisabled(true);
		else setRightDisabled(false);
	}, [cards]);
	const incrementCount = useCallback(() => {
		if (index + 1 >= cards.length - 1) {
			setRightDisabled(true);
		} else {
			setRightDisabled(false);
		}
		if (index + 1 < cards.length) {
			setLeftDisabled(false);
			setIndex(index + 1);
			cardRef.current.flipToTerm();
		}
	}, [cards.length, index]);

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
		}
	}, [index]);

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
				<div className='arrow-ctr'>
					<button
						className='no-button arrow'
						disabled={!rightDisable ? '' : 'true'}
						onClick={incrementCount}>
						<FontAwesomeIcon icon={faArrowRight} />
					</button>
				</div>
			</div>
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
