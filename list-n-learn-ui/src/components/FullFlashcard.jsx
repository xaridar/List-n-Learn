import React, { useRef } from 'react';

export const FullFlashcard = ({
	term,
	definition,
	editable = false,
	onTermInput = () => null,
	onDefInput = () => null,
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
			</div>
		</div>
	);
};
