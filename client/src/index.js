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

	const senseObject = (senseName) => {
		console.log('senseObject')
		if(senseName === 'Son'){
			return {sense: 'Son', type: '', volume: 0}
		} else if (senseName === 'Vue'){
			return {sense: 'Vue'}
		}else if (senseName === 'Odeur'){
			return {sense: 'Odeur'}
		}else if (senseName === 'Toucher'){
			return {sense: 'Toucher'}
		}else if (senseName === 'Gout'){
			return {sense: 'Gout'}
		}
	}

	return (
		<div className="sense-widget">
			<div className="sense-widget-choice">
				{senses.map(sense =>
					<div 	key={sense.name}
							className={currentSense?.value.sense === sense.name ? 'sense-div selected' : 'sense-div'}
							onClick={setSenseBody(senseObject(sense.name))}>
						{sense.icon}
						<br/>
						{sense.name}
					</div>
				)}
			</div>

			{currentSense?.value.sense === 'Son' ?
				<div>
					<h3>Son</h3>
					<span>Origine du son</span>
					<br/>
					<input type="checkbox" id="son-origine-producteur"
					       name="son-origine" value="producer"
					       checked={currentSense.value.type === "producer"}
					       onClick={(e) => {
						       const value = {sense: currentSense.value.sense, type: e.target.value, volume: currentSense.value.volume};
						       props.onUpsertBody(currentSense, {value, purpose: 'sense'});
					       }}/>
					<label htmlFor="son-origine-producteur">Producteur</label>
					<br/>
					<input type="checkbox" id="son-origine-terminologie"
					       name="son-origine" value="terminology"
					       checked={currentSense.value.type === "terminology"}
					       onChange={(e) => {
						       const value = {sense: currentSense.value.sense, type: e.target.value, volume: currentSense.value.volume};
						       props.onUpsertBody(currentSense, {value, purpose: 'sense'});
					       }}/>
					<label
						htmlFor="son-origine-terminologie">Terminologie</label>
					<br/>
					<span>Intensité du son</span>
					<br/>
					<input type="range" min="0" max="100" value={currentSense.value.volume}
					       onMouseLeave={(e) => {
							   const value = {sense: currentSense.value.sense, type: currentSense.value.type, volume: e.target.value};
						       props.onUpsertBody(currentSense, {value, purpose: 'sense'});
					       }}/>
				</div> : null}

			{currentSense?.value.sense === 'Vue' ?
				<div>
					<h1>VUE</h1>
				</div> : null}

			{currentSense?.value.sense === 'Odeur' ?
				<div>
					<h1>ODEUR</h1>
				</div> : null}

			{currentSense?.value.sense === 'Toucher' ?
				<div>
					<h1>TOUCHER</h1>
				</div> : null}

			{currentSense?.value.sense === 'Gout' ?
				<div>
					<h1>GOUT</h1>
				</div> : null}
		</div>
	)

}

export default MySenseWidget;