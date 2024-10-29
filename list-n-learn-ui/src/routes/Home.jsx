import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { generateUsername } from 'unique-username-generator';
import { checkUser } from '../util';

export const Home = () => {
	useEffect(() => {
		const fetchUser = async () => {
			const user = localStorage.getItem('lnl-user');
			if (user) {
				if (await checkUser(user)) {
					setUsername(user);
					const sets = await fetch(`/sets?user=${user}`);
					setSets(await sets.json());
				} else localStorage.removeItem('lnl-user');
			}
			setLoading(false);
		};
		fetchUser();
	}, []);

	const createUser = async () => {
		setLoading(true);
		let uniqueUsername = false;
		let username;
		while (!uniqueUsername) {
			// Extremely low chance of collisions (random selection of approx. 5.39B options)
			username = generateUsername('', 2);
			const res = await fetch('/user', {
				method: 'POST',
				body: JSON.stringify({ username }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const json = await res.json();
			console.log(json);
			if (json.success) uniqueUsername = true;
		}
		setUsername(username);
		localStorage.setItem('lnl-user', username);
		setLoading(false);
	};
	const signIn = () => {};

	const [username, setUsername] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sets, setSets] = useState([]);
	return loading ? (
		<ReactLoading
			type='spinningBubbles'
			width='30vw'
			className='loading'
		/>
	) : (
		<div className='App home-page'>
			{username ? (
				<>
					<p>{username}</p>
					<p>{sets.map((s) => s.title)}</p>
				</>
			) : (
				<>
					<h1>List n' Learn</h1>
					<div className='buttons-row'>
						<button onClick={createUser}>Create Account</button>
						<button onClick={signIn}>Log into Existing Account</button>
					</div>
				</>
			)}
		</div>
	);
};
