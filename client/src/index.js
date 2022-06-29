import React from 'preact/compat';

import './index.css';

/*const HelloWorldWidget = props => {
	// We'll be using 'highlighting' as body purpose for
	// this type of widget
	const currentHighlight = props.annotation ?
		props.annotation.bodies.find(b => b.purpose === 'highlighting') : null;

	// This function handles body updates as the user presses buttons
	const setHighlightBody = value => () => {
		props.onUpsertBody(currentHighlight, {value, purpose: 'highlighting'});
	}

	return (
		<div className="helloworld-widget">
			{['red', 'green', 'blue', 'yellow', 'brown'].map(color =>
				<button
					key={color}
					className={currentHighlight?.value === color ? 'selected' : null}
					style={{backgroundColor: color}}
					onClick={setHighlightBody(color)}>{color}</button>
			)}
		</div>
	)

}*/

const MySenseWidget = props => {
	// We'll be using 'highlighting' as body purpose for
	// this type of widget
	const currentSense = props.annotation ?
		props.annotation.bodies.find(b => b.purpose === 'sense') : null;

	// This function handles body updates as the user presses buttons
	const setSenseBody = value => () => {
		props.onUpsertBody(currentSense, {value, purpose: 'sense'});
	}

	const senses = [
		{name: 'Son', color: 'lightgreen', icon: '🔊'},
		{name: 'Vue', color: 'lightblue', icon: '👀'},
		{name: 'Odeur', color: 'brown', icon: '👃'},
		{name: 'Toucher', color: 'yellow', icon: '🤚'},
		{name: 'Gout', color: 'pink', icon: '👅'}];

	return (
		<div className="sense-widget">
			<div className="sense-widget-choice">
				{senses.map(sense =>
					<div 	key={sense.name}
							className={currentSense?.value === sense.name ? 'sense-div selected' : 'sense-div'}
							// style={{backgroundColor: sense.color}}
							onClick={setSenseBody(sense.name)}>
						{sense.icon}
						<br/>
						{sense.name}
					</div>
				)}
			</div>

			{currentSense?.value === 'Son' ?
				<div>
					<h1>SON</h1>
				</div> : null}

			{currentSense?.value === 'Vue' ?
				<div>
					<h1>VUE</h1>
				</div> : null}

			{currentSense?.value === 'Odeur' ?
				<div>
					<h1>ODEUR</h1>
				</div> : null}

			{currentSense?.value === 'Toucher' ?
				<div>
					<h1>TOUCHER</h1>
				</div> : null}

			{currentSense?.value === 'Gout' ?
				<div>
					<h1>GOUT</h1>
				</div> : null}
		</div>
	)

}

export default MySenseWidget;