import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { generateUsername } from 'unique-username-generator';
import { checkUser } from '../util';
import { faClose, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SetPreview } from '../components/SetPreview';
import toast, { Toaster } from 'react-hot-toast';

export const Home = () => {
	useEffect(() => {
		const fetchUser = async () => {
			const user = localStorage.getItem('lnl-user');
			if (user) {
				if (await checkUser(user)) {
					setUsername(user);
				} else {
					localStorage.removeItem('lnl-user');
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
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
			if (json.success) uniqueUsername = true;
		}
		toast(
			'Make sure to keep track of your username! This is necessary to login fom another device, and cannot be changed.',
		);
		setUsername(username);
	};
	const signIn = () => {
		setSignin(true);
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
			setError(`Username '${newName}' not found`);
			nameRef.current?.focus();
			setLoading(false);
		}
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
		nameRef.current?.focus();
	}, [nameRef]);

	useEffect(() => {
		if (!username) return;
		setSets([]);

		const setupUN = async () => {
			localStorage.setItem('lnl-user', username);
			const sets = await fetch(`/sets?user=${username}`);
			setSets(await sets.json());
		};
		setupUN();
	}, [username]);
	useEffect(() => {
		setLoading(false);
	}, [sets]);
	const keyListener = useCallback(
		(e) => {
			if (signin && e.key === 'Escape') {
				closeInput();
			}
		},
		[signin],
	);

	useEffect(() => {
		document.addEventListener('keydown', keyListener, true);

		return () => {
			document.removeEventListener('keydown', keyListener);
		};
	}, [keyListener]);

	return (
		<>
			<Toaster position='top-center' />
			{loading ? (
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

							<button
								className='button'
								onClick={logout}>
								Logout
							</button>
							<div>
								{sets.map((s) => (
									<SetPreview
										title={s.title}
										description={s.description}
										numCards={s.cards.length}
										id={s._id}
										key={s._id}
									/>
								))}
							</div>
						</>
					) : (
						<div className='buttons-row'>
							<button
								className='button'
								onClick={createUser}>
								Create Account
							</button>
							<button
								className='button'
								onClick={signIn}>
								Log into Existing Account
							</button>
						</div>
					)}
					{signin ? (
						<form
							onSubmit={setName}
							className='fullpage'
							onClick={closeInput}>
							<div
								className='dialog'
								onClick={(e) => e.stopPropagation()}>
								<div>
									<input
										title='Username'
										placeholder='Username'
										ref={nameRef}
									/>
									<button
										className='button'
										type={'submit'}>
										<FontAwesomeIcon icon={faPaperPlane} />
									</button>
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
			)}
		</>
	);
};
