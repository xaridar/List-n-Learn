import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FullFlashcard } from '../components/FullFlashcard';

export const ViewSet = () => {
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

	return (
		<div>
			<div className='setInformation'>
				<h1 className='title'>{set.title}</h1>
				<div className='setDescription'>{set.description}</div>
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
