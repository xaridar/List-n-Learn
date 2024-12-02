/*
  This file defines the `Set Preview` component, which displays a set's title, description, and number of cards.

  **Core Features**:
  - **Interact with Set**:
	- Navigate to edit, view, or study set
	- Delete set

  - **Technologies**:
    - `React` for state, references, and effects.
    - Backend integration for CRUD operations on sets.
*/


import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const SetPreview = ({ title, description, numCards, id, deleteSet }) => {
	return (
		<div className='card-ctr'>
			<div className='card card-short'>
				<p>
					<span>{title}</span>
					<br />
					<small style={{ fontSize: '0.75em' }}>{description}</small>
					<span
						className='num-cards'
						data-tooltip-id='my-tooltip'
						data-tooltip-content={`${numCards} card(s) in set`}>
						{numCards}
					</span>
				</p>
			</div>
			<div className='buttons-row'>
				<a
					className='button'
					href={`/view?id=${id}`}>
					View Set
				</a>
				<a
					className='button'
					href={`/edit?id=${id}`}>
					Edit Set
				</a>
				<a
					className='button'
					href={`/study?id=${id}`}>
					Study Set
				</a>
				<button
					className='no-button'
					onClick={() => deleteSet(id)}
					data-tooltip-id='my-tooltip'
					data-tooltip-content='Delete Set'>
					<FontAwesomeIcon
						icon={faTrash}
						color='var(--error-color)'
						style={{ fontSize: 'min(2em, 5vw)' }}
					/>
				</button>
			</div>
		</div>
	);
};
