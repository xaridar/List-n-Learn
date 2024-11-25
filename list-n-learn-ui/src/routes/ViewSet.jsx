// Project name: List n' Learn
// Description: Accessible flashcards with TTS and SST to enable hands-free studying
// Filename: ViewSet.jsx
// Description: Retreives a users' flashcard sets for viewing of individual cards
// Last modified on: 11/25/24

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullFlashcard } from '../components/FullFlashcard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { defCommands, speakPhrase } from '../util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPen } from '@fortawesome/free-solid-svg-icons';

export const ViewSet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const navigate = useNavigate();
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
					if (!res.cards.length) {
						navigate('/');
						return;
					}
					setInfo((set) => res);
					setCards((set) => res.cards);
				});
		};
		getSet();
	}, [setID, navigate]);

	const username = localStorage.getItem('lnl-user');

	// retrieves all cards in db
	// const getAll = () => {
	//     fetch('/allcards')
	//         .then(res => res.json())
	//         .then(res => {
	//             setCards(cards => res);
	//         })
	// }

	// if current username exists setOwner, then do all this

	const [cards, setCards] = useState([]);
	const [set, setInfo] = useState([]);

	const listCards = async () => {
		await speakPhrase('The terms in this set are:');
		let phrase = '';
		for (let i = 0; i < cards.length; i++) {
			if (i !== 0) phrase += '; ';
			if (i === cards.length - 1) phrase += 'and ';
			phrase += cards[i].term;
		}
		await speakPhrase(phrase);
	};

	const commands = [
		{
			command: 'Study set',
			callback: () => {
				navigate(`/study?id=${setID}`);
			},
		},
		{
			command: 'Edit set',
			callback: () => {
				if (username === set.user) navigate(`/edit?id=${setID}`);
				else speakPhrase('You cannot edit this set!');
			},
		},
		{
			command: 'List cards',
			callback: listCards,
		},
	];
	commands.push(...defCommands(navigate));
	const { transcript } = useSpeechRecognition({ commands });

	return (
		<div className='view-set'>
			<a
				className='button action-button editSet'
				href={`/study?id=${setID}`}
				data-tooltip-id='my-tooltip'
				data-tooltip-content='Study Set'>
				<FontAwesomeIcon icon={faBook} />
			</a>
			{set && username === set.user && (
				<a
					className='button action-button ab-left editSet'
					href={`/edit?id=${setID}`}
					data-tooltip-id='my-tooltip'
					data-tooltip-content='Edit Set'>
					<FontAwesomeIcon icon={faPen} />
				</a>
			)}
			<div className='setInformation'>
				<h1 className='title'>{set.title}</h1>
				<h2 className='setDescription'>{set.description}</h2>
			</div>
			{cards.map((c) => (
				<FullFlashcard
					term={c.term}
					definition={c.definition}
					favorite={c.favorite}
					key={c._id}></FullFlashcard>
			))}
			{transcript}
		</div>
	);
};
