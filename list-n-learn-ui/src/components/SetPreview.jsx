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
					{/* TODO: tooltip */}
					<span className='num-cards'>{numCards}</span>
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
