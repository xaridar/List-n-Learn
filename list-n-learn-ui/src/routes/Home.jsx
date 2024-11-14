import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { SetPreview } from '../components/SetPreview';

export const Home = () => {
	const [sets, setSets] = useState([]);
	const [loading, setLoading] = useState(true);

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

	return (
		<div>
			<button className="new-set" onClick={newSet}>New Set</button>
			{loading ? <ReactLoading
					type='spinningBubbles'
					width='30vw'
					className='loading' /> : sets.map((s) => (
				<SetPreview
					title={s.title}
					description={s.description}
					numCards={s.cards.length}
					id={s._id}
					key={s._id}
				/>
			))}
		</div>
	);
};
