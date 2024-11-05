import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

export const FullFlashcard = ({term, definition, editable = false, onTermInput = () => null, onDefInput = () => null}) => {
    return <div className='card-ctr'>
        <div className='fullCard'>
            <div className='cardFront card'>
                <p suppressContentEditableWarning={true} contentEditable={editable?'true':'false'} onInput={onTermInput}>
                    {term}
                </p>
            </div>    
            <div className='cardBack card'>
                <p suppressContentEditableWarning={true} contentEditable={editable?'true':'false'} onInput={onDefInput}>
                    {definition}    
                </p>
            </div>
        </div>    
    </div>
}