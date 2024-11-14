import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { SetPreview } from '../components/SetPreview';
import toast from 'react-hot-toast';

export const Home = () => {
	const [sets, setSets] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		setSets([]);

		const setupUN = async () => {
			const username = localStorage.getItem('lnl-user');
			const sets = await fetch(`/sets?user=${username}`);
			setSets(await sets.json());
		};
		setupUN();
	}, []);
	useEffect(() => {
		setLoading(false);
	}, [sets]);

	const newSet = async () => {
		try{
			const response = await fetch('/set', {
				method: 'POST',
				body: JSON.stringify({
					username: localStorage.getItem('lnl-user')
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});		

			const json = await response.json();
			const setID = json.id;

			if (json.success) {
				toast.success('Set made');
				navigate(`/edit?id=${setID}`);
			} else {
				toast.error('Set has not been made');
			} 
		} catch (error) {
			console.error('Error creating set:', error);
			toast.error('Failed to create set');
		}
	}

	return (
		<div>
			<button className="new-set" onClick={newSet}>New Set</button>
			<h1>My Sets</h1>
			{loading ? (
				<ReactLoading
					type='spinningBubbles'
					width='30vw'
					className='loading'
				/>
			) : (
				sets.map((s) => (
					<SetPreview
						title={s.title}
						description={s.description}
						numCards={s.cards.length}
						id={s._id}
						key={s._id}
					/>
				))
			)}
		</div>
	);
};
