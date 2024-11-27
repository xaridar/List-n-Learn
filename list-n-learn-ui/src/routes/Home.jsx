import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { SetPreview } from '../components/SetPreview';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { defCommands, speakPhrase, useAnim } from '../util';

export const Home = () => {
	const [sets, setSets] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [anim, setAnim] = useAnim();

	useEffect(() => {
		setSets([]);

		const setupUN = async () => {
			const username = localStorage.getItem('lnl-user');
			const sets = await fetch(`/sets?user=${username}`, {
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
				},
			});
			setSets(await sets.json());
		};
		setupUN();
	}, []);
	useEffect(() => {
		setLoading(false);
	}, [sets]);

	const deleteSet = async (setId, audio = false) => {
		console.log(audio);
		if (!audio) {
			if (!window.confirm('Are you sure you want to delete this set? A deleted set cannot be retrieved.')) return;
		} else {
			let response = await speakPhrase(
				'Are you sure you want to delete this set? A deleted set cannot be retrieved.',
				true,
				SpeechRecognition.getRecognition(),
			);
			let decided = false;
			while (!decided) {
				if (response === 'yes') {
					decided = true;
					break;
				} else if (response === 'no') {
					decided = true;
					return;
				}
				response = await speakPhrase(
					"Sorry, I didn't get that. Are you sure you want to delete this set?",
					true,
					SpeechRecognition.getRecognition(),
				);
			}
		}
		try {
			const response = await fetch('/set', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ setId }),
			});

			const json = await response.json();

			if (json.success) {
				toast.success('Set deleted successfully');
				if (audio) await speakPhrase('Set deleted successfully.');
				setSets((prevSets) => prevSets.filter((set) => set._id !== setId)); // Remove set from state
			} else {
				toast.error('Failed to delete set');
				if (audio) await speakPhrase('Failed to delete set.');
			}
		} catch (error) {
			console.error('Error deleting set:', error);
			toast.error('An error occurred while deleting the set');
		}
	};

	// Creates empty set for user to edit to emmulate creating a new set
	const newSet = async (audio = false) => {
		try {
			const response = await fetch('/set', {
				method: 'POST',
				body: JSON.stringify({
					username: localStorage.getItem('lnl-user'),
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const json = await response.json();
			// Retrieve set id from db to create link for redirecting for set editing
			const setID = json.id;

			if (json.success) {
				toast.success('Set created');
				if (audio) speakPhrase('Set created!');
				navigate(`/edit?id=${setID}`);
			} else {
				toast.error('Set not created');
				if (audio) speakPhrase('Set not created');
			}
		} catch (error) {
			console.error('Error creating set:', error);
			toast.error('Failed to create set');
		}
	};	

	const listSets = async () => {
		await speakPhrase('The sets you\'ve made are:');
		let phrase = '';
		for (let i = 0; i < sets.length; i++) {
			if (i !== 0) phrase += '; ';
			if (i === sets.length - 1) phrase += 'and ';
			phrase += sets[i].title;
		}
		await speakPhrase(phrase);
	};

	const deleteSetByTitle = async (title) => {
		for (const set of sets) {
			console.log(set.title.trim().toLowerCase(), title);
			if (set.title.trim().toLowerCase() === title.trim().toLowerCase()) {
				await deleteSet(set._id, true);
				return;
			}
		}
		await speakPhrase(`This set does not exist`);
	};

	const commands = [
		{
			command: 'New set',
			callback: () => newSet(true),
		},
		{
			command: 'List sets',
			callback: listSets
		},
		{
			command: 'Delete set *',
			callback: deleteSetByTitle,
		},
	];
	commands.push(...defCommands(navigate, setAnim));
	useSpeechRecognition({ commands });

	return (
		<div>
			<h1>My Sets</h1>
			{loading ? (
				<ReactLoading
					type='spinningBubbles'
					width='30vw'
					className='loading'
				/>
			) : (
				<>
					{sets.map((s) => (
						<SetPreview
							title={s.title}
							description={s.description}
							numCards={s.cards.length}
							id={s._id}
							key={s._id}
							deleteSet={deleteSet}
						/>
					))}
					<button
						onClick={newSet}
						className='action-button button new-set'
						data-tooltip-id='my-tooltip'
						data-tooltip-content='New Set'>
						<FontAwesomeIcon icon={faPlus} />
					</button>
				</>
			)}
		</div>
	);
};
