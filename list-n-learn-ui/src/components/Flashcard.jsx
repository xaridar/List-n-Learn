import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { speakPhrase } from '../util';

export const Flashcard = forwardRef(({ started, term, definition, style }, ref) => {
	useImperativeHandle(ref, () => ({
		flipToTerm() {
			setFlipped(false);
		},
		flipCard() {
			flipCard();
		},
		speak() {
			speakPhrase(flipped ? definition : term);
		},
		stopSpeech() {
			window.speechSynthesis.cancel();
		},
	}));

	const flipCard = () => setFlipped((f) => !f);

	const [flipped, setFlipped] = useState(false);

	useEffect(() => {
		if (started) speakPhrase(flipped ? definition : term);
	}, [flipped, definition, term, started]);

	return (
		<div
			style={style}
			className='card-ctr'>
			<div style={{ width: '100%' }}>
				<div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
					<div
						className='card selectable'
						style={{ width: '100%' }}
						onClick={flipCard}>
						<p>{flipped ? definition : term}</p>
					</div>
					<button
						className='flip-btn'
						onClick={flipCard}>
						<FontAwesomeIcon icon={faArrowsRotate} />
					</button>
				</div>
			</div>
		</div>
	);
});
