import React, { useState, useEffect, useRef } from 'react';
import ReactLoading from 'react-loading';
import { generateUsername } from 'unique-username-generator';
import { checkUser } from '../util';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SetPreview } from '../components/SetPreview';

export const Home = () => {
	useEffect(() => {
		const fetchUser = async () => {
			const user = localStorage.getItem('lnl-user');
			if (user) {
				if (await checkUser(user)) {
					setUsername(user);
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
			// Extremely low chance of collisions (random selection of approx. 5.4B options)
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
		setLoading(false);
	};
	const signIn = () => {
		setSignin(true);
		nameRef.current?.focus();
	};
	const closeInput = () => {
		setSignin(false);
	};
	const setName = async (e) => {
		e.preventDefault();
		const newName = nameRef.current.value;
		if (!newName) return;
		setLoading(true);
		if (await checkUser(newName)) {
			setUsername(newName);
			setSignin(false);
		} else {
			setError('Username not found');
			nameRef.current?.focus();
		}
		setLoading(false);
	};
	const logout = () => {
		setUsername(null);
		localStorage.removeItem('lnl-user');
	};

	const [username, setUsername] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sets, setSets] = useState([]);
	const [signin, setSignin] = useState(false);
	const [error, setError] = useState('');
	const nameRef = useRef(null);

	useEffect(() => {
		if (!username) return;

		const setupUN = async () => {
			localStorage.setItem('lnl-user', username);
			const sets = await fetch(`/sets?user=${username}`);
			setSets(await sets.json());
		};
		setupUN();
	}, [username]);

	return loading ? (
		<ReactLoading
			type='spinningBubbles'
			width='30vw'
			className='loading'
		/>
	) : (
		<div className='App'>
			<h1>List n' Learn</h1>
			{username ? (
				<>
					<p>{username}</p>
					<button onClick={logout}>Logout</button>
					{/* TODO: find num of cards */}
					<div>
						{sets.map((s) => (
							<SetPreview
								title={s.title}
								description={s.description}
								numCards={0}
								id={s._id}
							/>
						))}
					</div>
				</>
			) : (
				<div className='buttons-row'>
					<button onClick={createUser}>Create Account</button>
					<button onClick={signIn}>Log into Existing Account</button>
				</div>
			)}
			{signin ? (
				<form
					onSubmit={setName}
					className='fullpage'>
					<div className='dialog'>
						<div>
							<input ref={nameRef} />
							<button type={'submit'}>Login</button>
						</div>
						<span className='error-msg'>{error}</span>
					</div>
					<button
						className='close'
						onClick={closeInput}>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</form>
			) : (
				<></>
			)}
		</div>
	);
};
