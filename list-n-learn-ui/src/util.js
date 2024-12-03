/**
 * This file defines a number of utility functions for use across frontend components.
 */

import { useEffect, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';

/**
 * Checks if a user exiss in the database
 * @param {string} username the username to check in the database
 * @returns {boolean} true if the user requested exists
 */
export const checkUser = async (username) => {
	const res = await fetch(`/user?name=${username}`);
	const json = await res.json();
	return Object.keys(json).length !== 0;
};

let speechRate = 1;

/**
 * Sets speech playback rate
 * @param {number} rate the rate (0 - 10) to set playback to
 */
export const setSpeed = (rate) => {
	speechRate = rate;
	speakPhrase(`Audio playback speed updated to ${rate}.`);
};

/**
 * Uses TTS to speak a phrase, and optionally captures the user's response
 * @param {string} phrase a phrase to be spoken by TTS
 * @param {boolean} response whether this call to speakPhrase should return the user's response
 * @param {SpeechRecognition} recog the SpeechRecognition instance to be used for capturing user responses
 * @returns {string | void} void if no user response requested; otherwise, returns the spoken response
 */
export const speakPhrase = async (phrase, response = false, recog = null) => {
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(phrase);
	utterance.rate = speechRate;
	window.speechSynthesis.speak(utterance);
	await new Promise((res, rej) => {
		utterance.onend = res;
	});
	if (response)
		return new Promise((res, rej) => {
			const old = recog.onresult;
			recog.onresult = function (e) {
				if (e.results[e.results.length - 1].isFinal) {
					recog.onresult = old;
					res(e.results[e.results.length - 1][0].transcript);
				}
			};
		});
};

/**
 * Searches an array of cards for the first card with a specified term
 * @param {[Card]} cards an array of cards to search through
 * @param {string} term the term to search for
 * @returns {Card | -1} the first card found with the given term, or -1 if not found
 */
export const getCard = (cards, term) => {
	for (const card of cards) {
		if (card.term.trim().toLowerCase() === term.trim().toLowerCase()) {
			return card;
		}
	}
	return -1;
};

/**
 * Defines a React hook for the animation state of the application
 * @returns {[boolean, Dispatch<String>]} returns the defined hook
 */
export const useAnim = () => {
	const [anim, setAnim] = useLocalStorage('lnl-anim', 'true');
	const [boolAnim, setBoolAnim] = useState(anim !== 'false');
	useEffect(() => {
		setBoolAnim(anim === 'true');
	}, [anim]);
	return [boolAnim, setAnim];
};

// local functions are managed to allow for default command definition
let logoutFn = () => null;
let loginFn = () => null;
let helpFn = () => null;

export const registerLogout = (logout) => {
	logoutFn = logout;
};
export const registerLogin = (login) => {
	loginFn = login;
};
export const registerHelp = (help) => {
	helpFn = help;
};

export const defCommands = (navigate, setAnim) => [
	{
		command: 'Home',
		callback: () => navigate('/'),
	},
	{
		command: 'Help',
		callback: helpFn,
	},
	{
		command: 'Login',
		callback: loginFn,
	},
	{
		command: 'Log in',
		callback: loginFn,
	},
	{
		command: 'Log out',
		callback: logoutFn,
	},
	{
		command: 'Logout',
		callback: logoutFn,
	},
	{
		command: 'Half speed',
		callback: () => setSpeed(0.5),
	},
	{
		command: 'Default speed',
		callback: () => setSpeed(1),
	},
	{
		command: 'Double speed',
		callback: () => setSpeed(2),
	},
	{
		command: 'Triple speed',
		callback: () => setSpeed(3),
	},
	{
		command: 'Animation off',
		callback: () => setAnim('false'),
	},
	{
		command: 'Animation on',
		callback: () => setAnim('true'),
	},
];
