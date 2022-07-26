import '../styles/App.css';
import {useState} from "react";

// import './sense-widget.css'

function Test() {

	const [currentSense, setCurrentSense] = useState({value: [], purpose: 'sense'});

	// Updates the sense JSON value object
	const setSenseBody = (value) => {
		setCurrentSense(value)
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
		{name: 'sound', color: 'lightgreen', icon: '🔊', displayName: 'Son'},
		{name: 'view', color: 'lightblue', icon: '👀', displayName: 'Vue'},
		{name: 'smell', color: 'brown', icon: '👃', displayName: 'Odeur'},
		{name: 'touch', color: 'yellow', icon: '🤚', displayName: 'Toucher'},
		{name: 'taste', color: 'pink', icon: '👅', displayName: 'Goût'}];

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
						{sense.displayName}
					</div>
				)}
			</div>

			{/*If the sense is chosen, display the options accordingly*/}

				<div className="infos-div">
					<h3>Son</h3>
					<div className="infos-div infos-delimiter">
						<span>Origine du son</span>
						<div className="choice-div">
							<div>
								<input type="checkbox" id="son-origine-producteur"
								       name="son-origine" value="producer"

								       onClick={(e) => {
									       editSoundType(e)
								       }}/>
								<label
									htmlFor="son-origine-producteur">Producteur</label>
							</div>
							<div>
								<input type="checkbox" id="son-origine-terminologie"
								       name="son-origine" value="terminology"

								       onChange={(e) => {
									       editSoundType(e)
								       }}/>
								<label
									htmlFor="son-origine-terminologie">Terminologie</label>
							</div>

						</div>
					</div>

					<div className="infos-div infos-delimiter">
					<span>Intensité du son</span>
					<input type="range" min="0" max="100"

					       onMouseLeave={(e) => {
						       editSoundIntensity(e)
					       }}/>
					</div>
				</div>


				<div className="infos-div">
					<h3>Vue</h3>
				</div>


				<div className={'infos-div'}>
					<h3>Odeur</h3>
				</div>


				<div>
					<span>Toucher</span>
				</div>


				<div>
					<span>Gout</span>
				</div>
		</div>
	)
}

export default Test;
