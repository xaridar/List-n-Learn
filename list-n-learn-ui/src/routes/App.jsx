import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, EditSet, ViewSet, StudySet } from '.';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { faClose, faPaperPlane, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateUsername } from 'unique-username-generator';
import { checkUser, registerLogout, setSpeed, speakPhrase, useAnim } from '../util';
import ReactLoading from 'react-loading';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import { Tooltip } from 'react-tooltip';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import Popup from './Popup';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/edit',
		element: <EditSet />,
	},
	{
		path: '/view',
		element: <ViewSet />,
	},
	{
		path: '/study',
		element: <StudySet />,
	},
]);

export const App = () => {

	const [username, setUsername] = useState(null);
	const [loading, setLoading] = useState(true);
	const [signin, setSignin] = useState(false);
	const [error, setError] = useState('');
	const nameRef = useRef(null);
	const [anim, setAnim] = useAnim();
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
	const createUser = async (audio = false) => {
		if (username != null) return;
		setLoading(true);
		let uniqueUsername = false;
		let un;
		while (!uniqueUsername) {
			// Extremely low chance of collisions (random selection of approx. 5.4B options)
			un = generateUsername('', 2);
			const res = await fetch('/user', {
				method: 'POST',
				body: JSON.stringify({ username: un }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const json = await res.json();
			if (json.success) uniqueUsername = true;
		}
		if (audio) speakPhrase(`Your username is: ${un}.`);
		toast(
			'Make sure to keep track of your username! This is necessary to login from another device, and cannot be changed.',
		);
		setUsername(un);
	};

	const [helpPop, setHelpPop] = useState(false);
	const helpMenu = () => {
		setHelpPop(!helpPop);
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
		window.location.href = '/';
	};
	const keyListener = useCallback(
		(e) => {
			if (signin && e.key === 'Escape') {
				closeInput();
			}
		},
		[signin],
	);
	useEffect(() => {
		nameRef.current?.focus();
	}, [nameRef]);
	useEffect(() => {
		if (!username) return;

		setLoading(false);
		localStorage.setItem('lnl-user', username);
	}, [username]);

	useEffect(() => {
		document.addEventListener('keydown', keyListener, true);

		return () => {
			document.removeEventListener('keydown', keyListener);
		};
	}, [keyListener]);
	const commands = [
		{
			command: 'Login',
			callback: () => createUser(true)
		},
		{
			command: 'Log in',
			callback: () => createUser(true)
		}
	]

	useSpeechRecognition({ commands });

	useEffect(() => {
		registerLogout(logout);
		SpeechRecognition.startListening({ continuous: true, interimResults: true });
	}, []);

	return (
		<>
			<Toaster position='top-center' />
			<Tooltip
				id='my-tooltip'
				style={{ zIndex: 99 }}
			/>
			{loading ? (
				<ReactLoading
					type='spinningBubbles'
					width='30vw'
					className='loading'
				/>
			) : (
				<div className={`App ${anim ? '' : 'no-anim'}`}>
					{username ? (
						<header>
							<a
								href='/'
								style={{ color: 'currentcolor', textDecoration: 'none' }}>
								List n' Learn
							</a>
							<Menu
								menuButton={
									<MenuButton className='button button-sm'>
										{username}
										<FontAwesomeIcon icon={faCaretDown} />
									</MenuButton>
								}
								transition>
								<MenuItem href={'/'}>View your sets</MenuItem>
								<SubMenu label='Set Playback Speed'>
									<MenuItem onClick={() => setSpeed(0.5)}>Half Speed</MenuItem>
									<MenuItem onClick={() => setSpeed(1)}>Default Speed</MenuItem>
									<MenuItem onClick={() => setSpeed(2)}>2x Speed</MenuItem>
									<MenuItem onClick={() => setSpeed(3)}>3x Speed</MenuItem>
								</SubMenu>
								<MenuItem onClick={() => setAnim((a) => !a)}>Animations {anim ? 'off' : 'on'}</MenuItem>
								<MenuItem
									onClick={() => {
										setHelpPop(true);
									}}>
									Help
								</MenuItem>
								<MenuItem onClick={logout}>Logout</MenuItem>
							</Menu>
						</header>
					) : (
						<h1>List n' Learn</h1>
					)}
					{username ? (
						<main>
							<RouterProvider router={router} />
						</main>
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
							<button
								className='button'
								onClick={helpMenu}>
								Help
							</button>
						</div>
					)}
				</div>
			)}
			{signin ? (
				<form
					onSubmit={setName}
					className='fullpage bg'
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
						<p className='error-msg'>{error}</p>
					</div>
					<button
						className='close'
						onClick={closeInput}>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</form>
			) : null}
			{helpPop && (
				<div
					className='fullpage'
					onClick={() => setHelpPop(false)} // Close menu when clicking outside
				>
					<div
						className='dialog'
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
					>
						<h2>Help Menu (NEEDS TO BE CHANGED)</h2>
						<p>Here are some tips to get started:</p>
						<ul>
							<li>
								To create an account, click "Create Account" and mark down the given username Create a
								set with the plus icon.
							</li>
							<li>To log in, use your previously generated username.</li>
							<li>Contact support if you lose your username.</li>
							<li>ADD ALL VOICE COMMANDS INTO HELP MENU -Ethan</li>
						</ul>
						<button
							className='close'
							onClick={() => setHelpPop(false)}>
							<FontAwesomeIcon icon={faClose} />
						</button>
					</div>
				</div>
			)}
		</>
	);
};
