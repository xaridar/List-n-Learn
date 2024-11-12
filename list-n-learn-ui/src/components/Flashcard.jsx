import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

export const Flashcard = forwardRef(({term, definition, style, resetTrigger}, ref) => {

    useImperativeHandle(ref, () => ({
        flipToTerm() {
            setFlipped(false);
        },
        flipCard() {
            flipCard();
        }
    }))

    const flipCard = () => setFlipped(f => !f);

    const [flipped, setFlipped] = useState(false);

    const speakCurr = async () => {
        // const utterance = new SpeechSynthesisUtterance(flipped ? definition : term);
        // await window.speechSynthesis.speak(utterance);
        console.log('done!');
    }

    useEffect(() => {
        speakCurr();
    }, [flipped]);

    return <div style={style} className='card-ctr'>
        <div className='card selectable' onClick={flipCard}>
            <p>
                {flipped ? definition : term}
            </p>
        </div>
        <button className='flip-btn' onClick={flipCard}>
            <FontAwesomeIcon icon={faArrowsRotate}/>
        </button>
        <button onClick={speakCurr}>speak</button>
    </div>;
});