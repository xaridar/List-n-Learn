import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Reorder } from 'framer-motion';
import { EditableCard } from '../components/EditableCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { defCommands, speakPhrase, getCard } from '../util';

export const EditSet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [cards, setCards] = useState([]);
	const [toDel, setToDel] = useState([]);
	const [description, setDescription] = useState('');
	const bottomRef = useRef();

	// Fetch set data on component mount
	useEffect(() => {
		if (!setID) {
			navigate('/');
			return;
		}
		const getSet = async () => {
			try {
				const res = await fetch(`/set?id=${setID}`);
				const data = await res.json();
				if (data.user !== localStorage.getItem('lnl-user')) navigate('/');
				else {
					setTitle(data.title || '');
					setCards(data.cards || []);
					setDescription(data.description || '');
				}
			} catch (error) {
				console.error('Error fetching set:', error);
			}
		};
		getSet();
	}, [setID, navigate]);

	// Remove a card from the set
	const removeCard = async (i, cardId, audio = false) => {
		if (!audio) {
			if (
				!window.confirm(
					'Are you sure you want to delete this card? A deleted card cannot be retrieved unless edits are discarded.',
				)
			)
				return;
		} else {
			let response = await speakPhrase(
				'Are you sure you want to delete this card? A deleted card cannot be retrieved unless edits are discarded.',
				true,
				SpeechRecognition.getRecognition(),
			);
			let decided = false;
			while (!decided) {
				if (response === 'yes') {
					decided = true;
				} else if (response === 'no') {
					decided = true;
					return;
				}
				response = speakPhrase(
					"Sorry, I didn't get that. Are you sure you want to delete this card?",
					true,
					SpeechRecognition.getRecognition(),
				);
			}
		}
		setCards((cards) => {
			cards.splice(i, 1);
			return cards;
		});
		if (cardId.startsWith('newcard')) return;
		setToDel((cards) => {
			return [...cards, cardId];
		});
	};

	// Handle input changes for title and description
	const handleTitleChange = (e) => setTitle(e.target.value);
	const handleDescriptionChange = (e) => setDescription(e.target.value);

	// Save changes to the backend
	const handleSave = async (audio = false) => {
		if (title === '') {
			toast.error('Set needs title to be saved!');
			if (audio) await speakPhrase('Set needs title to be saved!');
			return;
		}
		if (description === '') {
			toast.error('Set needs description to be saved!');
			if (audio) await speakPhrase('Set needs description to be saved!');
			return;
		}
		const updatedSet = {
			id: setID,
			title,
			cards,
			description,
			toDel,
		};
		console.log(updatedSet);

		try {
			const response = await fetch('/set', {
				method: 'PUT',
				body: JSON.stringify(updatedSet),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const json = await response.json();
			if (json.success) {
				toast.success('Set saved');
				if (audio) await speakPhrase('Your set has been saved!');
				navigate(`/view?id=${setID}`);
			} else {
				toast.error('Set has not been saved');
				if (audio) await speakPhrase('Set has not been saved due to an error.');
			}
		} catch (error) {
			console.error('Error saving set:', error);
			toast.error('Failed to save changes');
		}
	};

	const editTitle = async () => {
		if (title) await speakPhrase(`The current title of this set is: ${title}`);
		const newTitle = await speakPhrase(
			'What would you like to change the title to?',
			true,
			SpeechRecognition.getRecognition(),
		);
		setTitle(
			newTitle
				.split(' ')
				.filter((w) => w)
				.map((w) => {
					return w[0].toUpperCase() + w.substring(1).toLowerCase();
				})
				.join(' '),
		);
	};

	const editDesc = async () => {
		if (description) await speakPhrase(`The current description of this set is: ${description}`);
		const newDesc = await speakPhrase(
			'What would you like to change the description to?',
			true,
			SpeechRecognition.getRecognition(),
		);
		setDescription(newDesc);
	};

	const editDef = async (term) => {
		const card = getCard(cards, term);
		if (card == -1)
		{
			await speakPhrase(`That is an invalid term`);
		}
		else
		{
			await speakPhrase(`The current definition of ${term} is ${card.definition}`);
			const newDef = await speakPhrase(
				'What would you like to change the definition to?',
				true,
				SpeechRecognition.getRecognition(),
			);
			card.definition = newDef;
		}
	}

	const getDef = async (term) => {
		const card = getCard(cards, term);
		if (card == -1)
		{
			await speakPhrase(`That is an invalid term`);
		}
		else
		{
			await speakPhrase(`The current definition of ${term} is ${card.definition}`);
		}
	}

	// Add a new blank card to the set
	const handleNewCard = async () => {
		setCards((cards) => {
			const card = {
				term: '',
				definition: '',
				favorite: false,
				_id: 'newCard' + cards.length,
			};
			return [...cards, card];
		});
	};

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

	useEffect(() => {
		if (!cards.length || cards[cards.length - 1].term !== '') return;
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		bottomRef.current?.previousSibling?.querySelector('.card:first-child p')?.focus();
	}, [cards]);

	const commands = [
		{
			command: 'Add card',
			callback: handleNewCard,
		},
		{
			command: 'Edit title',
			callback: editTitle,
		},
		{
			command: 'Edit description',
			callback: editDesc,
		},
		{
			command: 'Save set',
			callback: () => handleSave(true),
		},
		{
			command: 'Edit *',
			callback: editDef,
		},
		{
			command: 'Define *',
			callback: getDef,
		}
	];
	commands.push(...defCommands(navigate));
	useSpeechRecognition({ commands });

	return (
		<>
			<div className='edit-text'>
				<input
					type='text'
					value={title}
					onChange={handleTitleChange}
					className='input-h1'
					placeholder='Set Title'
				/>
				<input
					value={description}
					onChange={handleDescriptionChange}
					className='input-h2'
					placeholder='Set Description'
					rows={4}
				/>
			</div>

			<Reorder.Group
				values={cards}
				onReorder={setCards}>
				{cards.map((c, i) => (
					<EditableCard
						card={c}
						key={c._id}
						index={i}
						onRemove={removeCard} // Pass remove function
					/>
				))}
				<div ref={bottomRef}></div>
			</Reorder.Group>
			<div className='buttons-row save'>
				<button
					onClick={() => navigate(`/view?id=${setID}`)}
					className='button cancel'>
					Cancel
				</button>
				<button
					onClick={() => handleSave()}
					className='button'>
					Save Changes
				</button>
			</div>
			<button
				onClick={handleNewCard}
				className='action-button button add-card'
				data-tooltip-id='my-tooltip'
				data-tooltip-content='Add card to set'>
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</>
	);
};

export default EditSet;
