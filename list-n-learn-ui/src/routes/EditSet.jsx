import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Reorder } from 'framer-motion';
import { EditableCard } from '../components/EditableCard';

export const EditSet = () => {
	const [searchParams] = useSearchParams();
	const setID = searchParams.get('id');
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [cards, setCards] = useState([]);
	const [description, setDescription] = useState('');

	// Fetch set data on component mount
	useEffect(() => {
		const getSet = async () => {
			try {
				const res = await fetch(`/set?id=${setID}`);
				const data = await res.json();
				setTitle(data.title || '');
				setCards(data.cards || []);
				setDescription(data.description || '');
			} catch (error) {
				console.error('Error fetching set:', error);
			}
		};
		getSet();
	}, [setID]);

	// Handle input changes for title
	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
	};

	// Save changes to the backend
	const handleSave = async () => {
		const updatedSet = {
			id: setID,
			title,
			cards,
			description,
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
				navigate(`/view?id=${setID}`);
			} else {
				toast.error('Set has not been saved');
			}
		} catch (error) {
			console.error('Error saving set:', error);
			toast.error('Failed to save changes');
		}
	};

	// Add a new blank card to the set
	const handleNewCard = async () => {
		setCards(cards => {
			const card = {
				term: '',
				definition: '',
				favorite: false,
				_id: ''
			};
			return [...cards, card]
		})
	};

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
				<div></div>
				<input
					value={description}
					onChange={handleDescriptionChange}
					className='input-h2'
					placeholder='Set Description'
					rows={4}
				/>
			</div>

			<button onClick={handleNewCard} className="button add-card">
				Create New Card
			</button>
			<Reorder.Group
				values={cards}
				onReorder={setCards}>
				{cards.map((c, i) => (
					<EditableCard
						card={c}
						key={c._id}
					/>
				))}
			</Reorder.Group>
			<button
				onClick={handleSave}
				className='button save'>
				Save Changes
			</button>
		</>
	);
};

export default EditSet;
