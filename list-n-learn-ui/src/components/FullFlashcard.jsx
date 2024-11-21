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
