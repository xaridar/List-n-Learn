/*
  This file defines the `FullFlashcard` component, which displays a singular card's term and definitio at the same time (used in View Set and Edit Set (through EditableFlashcard)).

  **Core Features**:
	- Reorderable Cards:
		- Uses `framer-motion`'s `Reorder.Item` for drag-and-drop functionality.
		- Includes a draggable handle (`FontAwesomeIcon` with `faGripLinesVertical`) for reordering.

  	-	Editable Flashcard:
		- Renders a `FullFlashcard` component with editable fields for term and definition.
		- Updates the `card` object directly when fields are modified.

	- Favorite Toggle:
		- Displays a favorite toggle button linked to the card's state.
		- Updates the card's `favorite` property when toggled.

	- Technologies:
		- `React` for state, references, and effects.
		- Backend integration for CRUD operations on cards.
*/

import React, { useRef } from 'react';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FullFlashcard = ({
	term,
	definition,
	favorite,
	editable = false,
	index = -1,
	id = '',
	onTermInput = () => null,
	onDefInput = () => null,
	onFavorite = () => null,
	onRemove = () => null,
}) => {
	const termRef = useRef();
	const defRef = useRef();

	return (
		<div className='card-ctr'>
			<div className='fullCard'>
				<div
					className='card'
					style={{ cursor: editable ? 'text' : 'default' }}
					onClick={() => termRef.current?.focus()}>
					<p
						ref={termRef}
						suppressContentEditableWarning={true}
						contentEditable={editable ? 'true' : 'false'}
						onInput={onTermInput}>
						{term}
					</p>
				</div>
				<div
					className='card'
					style={{ cursor: editable ? 'text' : 'default' }}
					onClick={() => defRef.current?.focus()}>
					<p
						ref={defRef}
						suppressContentEditableWarning={true}
						contentEditable={editable ? 'true' : 'false'}
						onInput={onDefInput}>
						{definition}
					</p>
				</div>
				<div className='favorite-toggle'>
					<label>
						<input
							type='checkbox'
							checked={favorite}
							onChange={editable ? onFavorite : undefined}
							className='favorite-button'></input>
						<FontAwesomeIcon icon={faStar} />
					</label>
				</div>
				{editable && (
					<div className='remove-button'>
						<button
							className='no-button'
							onClick={() => onRemove(index, id)}
							data-tooltip-id='my-tooltip'
							data-tooltip-content='Remove card'>
							<FontAwesomeIcon
								icon={faTrash}
								color='var(--error-color)'
								style={{ fontSize: 'min(2em, 5vw)' }}
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
