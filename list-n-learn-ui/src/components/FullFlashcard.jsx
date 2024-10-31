import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

export const FullFlashcard = ({term, definition}) => {
    return <div className='card-ctr'>
        <div className='fullCard'>
            <div className='cardFront card' tabIndex={-1}>
                <p>
                    {term}
                </p>
            </div>    
            <div className='cardBack card'>
                <p>
                    {definition}    
                </p>
            </div>
        </div>    
    </div>
}