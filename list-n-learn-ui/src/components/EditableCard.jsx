import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { FullFlashcard } from './FullFlashcard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

export const EditableCard = ({ card }) => {
	const dragController = useDragControls();

	return (
		<Reorder.Item
			value={card}
			style={{ width: '100%', padding: '1rem', boxSizing: 'border-box' }}
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
				/>
			</div>
		</Reorder.Item>
	);
};
