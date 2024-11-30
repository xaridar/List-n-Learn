/*
  The `EditableCard` component represents a single editable flashcard within a reorderable list.

  **Features**:
  - **Reorderable Cards**:
    - Uses `framer-motion`'s `Reorder.Item` for drag-and-drop functionality.
    - Includes a draggable handle (`FontAwesomeIcon` with `faGripLinesVertical`) for reordering.

  - **Editable Flashcard**:
    - Renders a `FullFlashcard` component with editable fields for term and definition.
    - Updates the `card` object directly when fields are modified.

  - **Favorite Toggle**:
    - Displays a favorite toggle button linked to the card's state.
    - Updates the card's `favorite` property when toggled.

  **Props**:
  - `card`: Object containing term, definition, and favorite state.
  - `onRemove`: Function to handle card deletion.
  - `index`: Card's position in the list.
*/
import React, { useEffect, useReducer, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { FullFlashcard } from './FullFlashcard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

export const EditableCard = ({ card, onRemove, index, updater }) => {
	const dragController = useDragControls();
	const [favorite, setFavorite] = useState(card.favorite);

	useEffect(() => {
		card.favorite = favorite;
	}, [favorite, card]);

	return (
		<Reorder.Item
			value={card}
			style={{ width: '100%', boxSizing: 'border-box' }}
			dragListener={false}
			dragControls={dragController}>
			<div className='reorderable-card'>
				<div
					className='drag-handle'
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
					}}
					onRemove={onRemove}
					index={index}
					id={card._id}
				/>
			</div>
		</Reorder.Item>
	);
};
