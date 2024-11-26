import { useEffect, useState } from 'react';

export const checkUser = async (username) => {
	const res = await fetch(`/user?name=${username}`);
	const json = await res.json();
	return Object.keys(json).length !== 0;
};

let speechRate = 1;

export const setSpeed = (rate) => {
	speechRate = rate;
	speakPhrase(`Audio playback speed updated to ${rate}.`);
};

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

export const getCard = (cards, term) => {
	for (const card of cards) {
		if (card.term === term) {
			return card;
		}
	}
	return -1;
};

let logoutFn = () => null;
let loginFn = () => null;
let isAnim = localStorage.getItem('lnl-anim');
export const useAnim = () => {
	const [anim, setAnim] = useState(isAnim);
	useEffect(() => {
		isAnim = anim;
		localStorage.setItem('lnl-anim', anim);
	}, [anim]);
	return [anim, setAnim];
};

export const registerLogout = (logout) => {
	logoutFn = logout;
};
export const registerLogin = (login) => {
	loginFn = login;
};

export const defCommands = (navigate, setAnim) => [
	{
		command: 'Home',
		callback: () => navigate('/'),
	},
	{
		command: 'Log out',
		callback: logoutFn,
	},
	{
		command: 'Log in',
		callback: loginFn,
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
		callback: () => {
			setAnim(false);
		},
	},
	{
		command: 'Animation on',
		callback: () => {
			setAnim(true);
		},
	},
];
