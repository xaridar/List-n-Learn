import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullFlashcard } from '../components/FullFlashcard';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { speakPhrase } from '../util';

export const ViewSet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const navigate = useNavigate();
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
	];
	useSpeechRecognition({ commands });

	return (
		<div className='view-set'>
			<div className='buttons-row'>
				{username === set.user ? (
					<a
						className='button editSet'
						href={`/edit?id=${setID}`}>
						Edit
					</a>
				) : (
					<></>
				)}
				<a
					className='button editSet'
					href={`/study?id=${setID}`}>
					Study
				</a>
			</div>
			<div className='setInformation'>
				<h1 className='title'>{set.title}</h1>
				<h2 className='setDescription'>{set.description}</h2>
			</div>
			{cards.map((c) => (
				<FullFlashcard
					term={c.term}
					definition={c.definition}
					key={c._id}></FullFlashcard>
			))}
		</div>
	);
};
