import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

export const Flashcard = ({term, definition}) => {
    const flipCard = () => setFlipped(f => !f);

    const [flipped, setFlipped] = useState(false);
    return <div className='card-ctr'>
        <div className='card selectable' tabIndex={-1} onClick={flipCard}>
            <p>
                {flipped ? definition : term}
            </p>
        </div>
        <button className='flip-btn' onClick={flipCard}>
            <FontAwesomeIcon icon={faArrowsRotate}/>
        </button>
    </div>;
}