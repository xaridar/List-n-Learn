import React, { useRef } from 'react';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FullFlashcard = ({
	term,
	definition,
	favorite,
	editable = false,
	onTermInput = () => null,
	onDefInput = () => null,
	onFavorite = () => null,
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
				<div className="favorite-toggle">
					<input type="checkbox" checked = {favorite}
						onChange={editable ? onFavorite : undefined}
						className={`favorite-button`}>
					</input>
				<FontAwesomeIcon icon={faStar} />
				</div>
			</div>
		</div>
	);
};
