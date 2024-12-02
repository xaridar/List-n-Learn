import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faStar } from '@fortawesome/free-solid-svg-icons';
import { speakPhrase, useAnim } from '../util';

export const Flashcard = forwardRef(({ started, term, definition, style, favorite }, ref) => {
	const [anim, setAnim] = useAnim();
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

	const flipCard = () => {
		setFlipped((f) => !f);
		if (!anim) return;
		if (flipped) {
			cardRef.current?.classList.add('flipFront');
			cardRef.current?.classList.remove('flipBack');
		} else {
			cardRef.current?.classList.add('flipBack');
			cardRef.current?.classList.remove('flipFront');
		}
	};

	const [flipped, setFlipped] = useState(false);
	const cardRef = useRef();

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
						onClick={flipCard}
						ref={cardRef}>
						<p>{flipped ? definition : term}</p>
						{favorite ? <FontAwesomeIcon icon={faStar} /> : ''}
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
