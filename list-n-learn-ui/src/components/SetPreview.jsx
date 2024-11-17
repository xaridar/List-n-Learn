import React from 'react';

export const SetPreview = ({ title, description, numCards, id }) => {
	return (
		<div
			className='card-ctr'
			style={{ flexDirection: 'row' }}>
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
			</div>
		</div>
	);
};
