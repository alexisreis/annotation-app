import React from 'preact/compat';

import './sense-widget.css';
// import './transcription-widget.css'

const MySenseWidget = props => {

	// Initialise the sense JSON object if it is already present
	const currentSense = props.annotation ?
		props.annotation.bodies.find(b => b.purpose === 'sense') : null;

	// Updates the sense JSON value object
	const setSenseBody = (value) => {
		props.onUpsertBody(currentSense, {value, purpose: 'sense'});
	}

	// Check / uncheck a sense
	const addSense = (senseName) => {
		let newValue = new Map();
		if (currentSense) {
			newValue = new Map(Object.entries(currentSense.value));
		}

		if (senseName === 'sound') {
			if (!currentSense?.value['sound']) {
				newValue.set('sound', {type: [], volume: 0});
			} else {
				newValue.delete('sound');
			}
		} else if (senseName === 'view') {
			if (!currentSense?.value['view']) {
				newValue.set('view', {sense: 'view'});
			} else {
				newValue.delete('view');
			}
		} else if (senseName === 'smell') {
			if (!currentSense?.value['smell']) {
				newValue.set('smell', {sense: 'smell'});
			} else {
				newValue.delete('smell');
			}
		} else if (senseName === 'touch') {
			if (!currentSense?.value['touch']) {
				newValue.set('touch', {sense: 'touch'});
			} else {
				newValue.delete('touch');
			}
		} else if (senseName === 'taste') {
			if (!currentSense?.value['taste']) {
				newValue.set('taste', {sense: 'taste'});
			} else {
				newValue.delete('taste');
			}
		}

		const value = Object.fromEntries(newValue);
		setSenseBody(value);
	}

	// Edit the type of the sound (producer / terminology)
	const editSoundType = (e) => {
		let newValue = new Map(Object.entries(currentSense.value));
		let newType = newValue.get('sound').type;

		if (e.target.checked) {
			newType.push(e.target.value)
			newValue.set('sound', {
				type: newType,
				volume: newValue.get('sound').volume
			})
		} else {
			newType = newType.filter((value) => value !== e.target.value);
			newValue.set('sound', {
				type: newType,
				volume: newValue.get('sound').volume
			})
		}

		const value = Object.fromEntries(newValue);
		setSenseBody(value);
	}

	// Edit the intensity of the sound via range input
	const editSoundIntensity = (e) => {
		let newValue = new Map(Object.entries(currentSense.value));

		newValue.set('sound', {
			type: newValue.get('sound').type,
			volume: e.target.value,
		})

		const value = Object.fromEntries(newValue);
		setSenseBody(value);
	}

	const senses = [
		{name: 'sound', color: 'lightgreen', icon: '🔊'},
		{name: 'view', color: 'lightblue', icon: '👀'},
		{name: 'smell', color: 'brown', icon: '👃'},
		{name: 'touch', color: 'yellow', icon: '🤚'},
		{name: 'taste', color: 'pink', icon: '👅'}];

	// What is displayed :
	return (
		<div className="sense-widget">
			{/*Sense choice div*/}
			<div className="sense-widget-choice">
				{senses.map(sense =>
					<div key={sense.name}
					     className={currentSense?.value[sense.name] ?
						     'sense-div selected' : 'sense-div'}
					     onClick={() => {
						     addSense(sense.name);
					     }}>
						{sense.icon}
						<br/>
						{sense.name}
					</div>
				)}
			</div>

			{/*If the sense is chosen, display the options accordingly*/}
			{currentSense?.value['sound'] ?
				<div className="infos-div">
					<span>Son</span>
					<p>Origine du son</p>
					<div>
						<input type="checkbox" id="son-origine-producteur"
						       name="son-origine" value="producer"
						       checked={currentSense.value['sound'].type.includes("producer")}
						       onClick={(e) => {
							       editSoundType(e)
						       }}/>
						<label
							htmlFor="son-origine-producteur">Producteur</label>

					</div>
					<div>
						<input type="checkbox" id="son-origine-terminologie"
						       name="son-origine" value="terminology"
						       checked={currentSense.value['sound'].type.includes("terminology")}
						       onChange={(e) => {
							       editSoundType(e)
						       }}/>
						<label
							htmlFor="son-origine-terminologie">Terminologie</label>

					</div>
					<hr/>
					<p>Intensité du son</p>
					<input type="range" min="0" max="100"
					       value={currentSense.value['sound'].volume}
					       onMouseLeave={(e) => {
						       editSoundIntensity(e)
					       }}/>
				</div> : null}

			{currentSense?.value['view'] ?
				<div>
					<span>Vue</span>
				</div> : null}

			{currentSense?.value['smell'] ?
				<div>
					<span>Odeur</span>
				</div> : null}

			{currentSense?.value['touch'] ?
				<div>
					<span>Toucher</span>
				</div> : null}

			{currentSense?.value['taste'] ?
				<div>
					<span>Gout</span>
				</div> : null}
		</div>
	)
}
export default MySenseWidget;

const MyTranscriptionWidget = props => {
	// We'll be using 'transcription' as body purpose for
	// this type of widget
	const currentTranscription = props.annotation ?
		props.annotation.bodies.find(b => b.purpose === 'transcription') : null;

	// This function handles body updates as the user presses buttons
	const setTranscriptionBody = (value) => {
		props.onUpsertBody(currentTranscription, {value, purpose: 'transcription'});
	}

	return (
		<div className="transcription-widget">
			<h3>Transcription</h3>
			<input type="text" placeholder="Transcription"
			       value={currentTranscription?.value}
			       onChange={(e) => setTranscriptionBody(e.target.value)}/>
		</div>
	)
}

// export default MyTranscriptionWidget;