import React, { useEffect, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { FullFlashcard } from './FullFlashcard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';

export const EditableCard = ({ card, onRemove, index }) => {
    const dragController = useDragControls();
    const [favorite, setFavorite] = useState(card.favorite);

    useEffect(() => {
        card.favorite = favorite;
    }, [favorite]);

    return (
        <Reorder.Item
            value={card}
            style={{ width: '100%', paddingInline: '1rem', boxSizing: 'border-box' }}
            dragListener={false}
            dragControls={dragController}>
            <div className="reorderable-card">
                <div
                    className="drag-handle"
                    onPointerDown={(e) => dragController.start(e)}>
                    <FontAwesomeIcon icon={faGripLinesVertical} />
                </div>
                <FullFlashcard
                    editable
                    onTermInput={(e) => {
                        card.term = e.target.textContent;
                    }}
                    term={card.term}
                    onDefInput={(e) => {
                        card.definition = e.target.textContent;
                    }}
                    definition={card.definition}
                    favorite={favorite}
                    onFavorite={(e) => {
                        setFavorite((f) => !f);
                        console.log(e);
                    }}
                />
                <div className="remove-button">
                    <button onClick={() => onRemove(index, card._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                        Remove
                    </button>
                </div>
            </div>
        </Reorder.Item>
    );
};
