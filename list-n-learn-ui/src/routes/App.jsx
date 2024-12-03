/*
  This file defines the main `App` component for the "List n' Learn" application. 
  It manages user authentication, routing, and primary application features, including:

  - **User Authentication**:
    - Handles user creation and login/logout functionality using local storage.
    - Generates unique usernames and verifies existing users through a backend API.
    - Uses the `generateUsername` library for random username generation.
    - Integrates voice feedback for new usernames and displays a toast notification.

  - **Routing**:
    - Utilizes react-router-dom to define and manage routes for different app views:
      - `/` (Home)
      - `/edit` (Edit Set)
      - `/view` (View Set)
      - `/study` (Study Set)

  - **UI Components and Interactions**:
    - Provides a header with a dropdown menu using @szhsin/react-menu for user options:
      - Adjust playback speed.
      - Enable/disable animations.
      - Help menu.
      - Logout.
    - Displays a loading animation during async operations.

  - **Speech and Accessibility**:
    - Integrates `react-speech-recognition` for speech recognition
    - Utilizes `react-hot-toast` for user notifications.
    - Includes `react-tooltip`

  - **State and Effects**:
    - Manages state using React's `useState` for state funcitons
    - Leverages `useEffect` for fetching user data, local storage updates, and initializing speech recognition.
    - Implements keyboard accessibility, e.g., closing modals with the `Escape` key.

  - **Help Menu**:
    - Includes help menu for users

*/
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, EditSet, ViewSet, StudySet } from '.';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { faClose, faPaperPlane, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateUsername } from 'unique-username-generator';
import { checkUser, registerHelp, registerLogout, registerLogin, setSpeed, speakPhrase, useAnim } from '../util';
import ReactLoading from 'react-loading';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import { Tooltip } from 'react-tooltip';
import SpeechRecognition from 'react-speech-recognition';
import useLocalStorage from 'react-use-localstorage';
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
	const [newUser, setNewUser] = useLocalStorage('lnl-new', 'true');
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
	const createUser = useCallback(
		async (audio = false) => {
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
		},
		[username],
	);

	const [helpPop, setHelpPop] = useState(false);
	const helpMenu = useCallback(() => {
		setHelpPop(!helpPop);
		setNewUser('false');
	}, [helpPop, setNewUser]);

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
			if (helpPop && e.key === 'Escape') {
				setHelpPop(false);
				setNewUser('false');
			}
		},
		[signin, helpPop, setNewUser],
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

	useEffect(() => {
		registerLogout(logout);
		registerLogin(() => createUser(true));
		registerHelp(helpMenu);
		SpeechRecognition.startListening({ continuous: true, interimResults: true });
	}, [createUser, helpMenu]);

	useEffect(() => {
		if (newUser === 'true') setHelpPop(true);
	}, [newUser]);

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
								<MenuItem onClick={() => setAnim(`${!anim}`)}>
									Animations {anim ? 'off' : 'on'}
								</MenuItem>
								<MenuItem
									onClick={() => {
										setHelpPop(true);
									}}>
									Commands List
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
					{signin ? (
						<div
							className='fullpage bg'
							onClick={closeInput}>
							<form onSubmit={setName}>
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
						</div>
					) : null}
					{helpPop && (
						<div
							className='fullpage bg'
							onClick={() => setHelpPop(false)} // Close menu when clicking outside
						>
							<div
								className='dialog'
								onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
							>
								<section>
									<h2 style={{ marginTop: '0' }}>Commands List</h2>
									<p>Here are some tips to get started with voice commands:</p>
									<h3>On the Study Page:</h3>
									<ul>
										<li>Say "Next card" or "Previous card" to navigate through flashcards.</li>
										<li>Say "Flip" to toggle between the term and definition on a card.</li>
										<li>Say "Restart" to begin the set from the start.</li>
										<li>Say "Repeat" to hear the current card's text again.</li>
										<li>Say "Stop" to end audio playback.</li>
										<li>Say "Start Audio" to start audio playback functionality.</li>
										<li>
											Say "Study favorites" or "Study all" to focus on favorited or all cards.
										</li>
									</ul>
									<h3>On the Edit Page:</h3>
									<ul>
										<li>Say "Add card" to create a new flashcard.</li>
										<li>Say "Edit definition [new definition]" to modify a card.</li>
										<li>Say "Edit Title"</li>
										<li>Say "Edit Description"</li>
										<li>Say "Save Set" to save changes</li>
										<li>Say "Cancel" to cancel changes</li>
										<li>Say "Define (Term)" to define a card</li>
										<li>Say "List Cards" to list all current cards in the set</li>
										<li>Say "Add / Remove favorite" to toggle the favorited funciton</li>
									</ul>
									<h3>On the View Page:</h3>
									<ul>
										<li>Say "List cards" to hear all card titles in the set.</li>
										<li>Say "Define [term]" to hear the definition of a term.</li>
										<li>Say "Study set" to navigate to the set view.</li>
										<li>Say "Edit set" to navigate to the set editor.</li>
									</ul>
									<h3>On the Home Page:</h3>
									<ul>
										<li>Say "View (set)" to view a set</li>
										<li>Say "Edit (set)" to edit a set</li>
										<li>Say "Study (set)" to study a set</li>
										<li>Say "List (set)" to list a set</li>
										<li>Say "Delete (set)" to delete a set</li>
									</ul>
								</section>
								<button
									className='close'
									onClick={() => {
										setHelpPop(false);
										setNewUser('false');
									}}>
									<FontAwesomeIcon icon={faClose} />
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};
