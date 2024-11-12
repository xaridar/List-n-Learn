import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

export const Flashcard = forwardRef(({ term, definition, style }, ref) => {
	useImperativeHandle(ref, () => ({
		flipToTerm() {
			setFlipped(false);
		},
		flipCard() {
			flipCard();
		},
		speak() {
			speakCurr();
		},
		stopSpeech() {
			window.speechSynthesis.cancel();
		},
	}));

	const flipCard = () => setFlipped((f) => !f);

	const [flipped, setFlipped] = useState(false);

	const speakCurr = useCallback(async () => {
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(flipped ? definition : term);
		await window.speechSynthesis.speak(utterance);
		console.log('done!');
	}, [definition, term, flipped]);

	useEffect(() => {
		speakCurr();
	}, [flipped, speakCurr]);

	return (
		<div
			style={style}
			className='card-ctr'>
			<div
				className='card selectable'
				onClick={flipCard}>
				<p>{flipped ? definition : term}</p>
			</div>
			<button
				className='flip-btn'
				onClick={flipCard}>
				<FontAwesomeIcon icon={faArrowsRotate} />
			</button>
		</div>
	);
});
