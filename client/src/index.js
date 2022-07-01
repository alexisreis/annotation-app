import React from 'preact/compat';

import './index.css';

const MySenseWidget = props => {
	// We'll be using 'sense' as body purpose for
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
		const value = []
		if (currentSense) {
			value.push(...currentSense.value)
			console.log('currentSense', currentSense.value)
		}
		if (senseName === 'Son') {
			value.push({sense: 'Son', type: '', volume: 0})
		} else if (senseName === 'Vue') {
			value.push({sense: 'Vue'})
		} else if (senseName === 'Odeur') {
			value.push({sense: 'Odeur'})
		} else if (senseName === 'Toucher') {
			value.push({sense: 'Toucher'})
		} else if (senseName === 'Gout') {
			value.push({sense: 'Gout'})
		}
		console.log('value', value)
		return value;
	}

	return (
		<div className="sense-widget">
			<div className="sense-widget-choice">
				{senses.map(sense =>
					<div key={sense.name}
					     className={currentSense?.value[sense.name] ?
						     'sense-div selected' : 'sense-div'}
					     onClick={() => {
						     console.log(sense.name);

						     let newValue = new Map();
						     if (currentSense) {
							     newValue = new Map(Object.entries(currentSense.value));
							     console.log(newValue)
						     }

						     if (sense.name === 'Son') {
							     if (!currentSense?.value['Son']) {
								     newValue.set('Son', {type: [], volume: 0});
							     } else {
								     newValue.delete('Son');
							     }
						     } else if (sense.name === 'Vue') {
							     if (!currentSense?.value['Vue']) {
								     newValue.set('Vue', {sense: 'Vue'});
							     } else {
								     newValue.delete('Vue');
							     }
						     } else if (sense.name === 'Odeur') {
								 if(!currentSense?.value['Odeur']){
									 newValue.set('Odeur', {sense: 'Odeur'});
								 } else {
									 newValue.delete('Odeur');
								 }
						     } else if (sense.name === 'Toucher') {
								if(!currentSense?.value['Toucher']){
									newValue.set('Toucher', {sense: 'Toucher'});
								} else {
									newValue.delete('Toucher');
								}
						     } else if (sense.name === 'Gout') {
								 if(!currentSense?.value['Gout']) {
									 newValue.set('Gout', {sense: 'Gout'});
								 } else {
									 newValue.delete('Gout');
								 }
						     }

						     const value = Object.fromEntries(newValue);
						     console.log('value object : ', value);
						     props.onUpsertBody(currentSense, {
							     value,
							     purpose: 'sense'
						     });
						     // console.log('currentSense.value',
						     // currentSense.value);
					     }}>
						{sense.icon}
						<br/>
						{sense.name}
					</div>
				)}
			</div>

			{currentSense?.value['Son'] ?
				<div>
					<h3>Son</h3>
					<span>Origine du son</span>
					<br/>
					<input type="checkbox" id="son-origine-producteur"
					       name="son-origine" value="producer"
					       checked={currentSense.value['Son'].type.includes("producer")}
					       onClick={(e) => {
						       // TODO : décocher la case
						       let newValue = new Map(Object.entries(currentSense.value));
							   let newType = newValue.get('Son').type;

							   if(e.target.checked){
								   newType.push(e.target.value)
								   newValue.set('Son', {
									   type:  newType,
									   volume: newValue.get('Son').volume
								   })
							   } else {
								   newType = newType.filter((value) => value !== e.target.value);
								   newValue.set('Son', {
									   type:  newType,
									   volume: newValue.get('Son').volume
								   })
							   }

						       const value = Object.fromEntries(newValue);
						       props.onUpsertBody(currentSense, {
							       value,
							       purpose: 'sense'
						       });
					       }}/>
					<label htmlFor="son-origine-producteur">Producteur</label>

					<br/>
					<input type="checkbox" id="son-origine-terminologie"
					       name="son-origine" value="terminology"
					       checked={currentSense.value['Son'].type.includes("terminology")}
					       onChange={(e) => {
						       let newValue = new Map(Object.entries(currentSense.value));
						       let newType = newValue.get('Son').type;

						       if(e.target.checked){
							       newType.push(e.target.value)
							       newValue.set('Son', {
								       type:  newType,
								       volume: newValue.get('Son').volume
							       })
						       } else {
							       newType = newType.filter((value) => value !== e.target.value);
							       newValue.set('Son', {
								       type:  newType,
								       volume: newValue.get('Son').volume
							       })
						       }

						       const value = Object.fromEntries(newValue);
						       props.onUpsertBody(currentSense, {
							       value,
							       purpose: 'sense'
						       });
					       }}/>
					<label
						htmlFor="son-origine-terminologie">Terminologie</label>
					<br/>
					{/*<span>Intensité du son</span>*/}
					{/*<br/>*/}
					{/*<input type="range" min="0" max="100"*/}
					{/*       value={currentSense.value.volume}*/}
					{/*       onMouseLeave={(e) => {*/}
					{/*	       const value = [{*/}
					{/*		       sense: currentSense.value.sense,*/}
					{/*		       type: currentSense.value.type,*/}
					{/*		       volume: e.target.value*/}
					{/*	       }];*/}
					{/*	       props.onUpsertBody(currentSense, {*/}
					{/*		       value,*/}
					{/*		       purpose: 'sense'*/}
					{/*	       });*/}
					{/*       }}/>*/}
				</div> : null}

			{currentSense?.value['Vue'] ?
				<div>
					<h3>Vue</h3>
				</div> : null}

			{currentSense?.value['Odeur'] ?
				<div>
					<h3>Odeur</h3>
				</div> : null}

			{currentSense?.value['Toucher'] ?
				<div>
					<h3>Toucher</h3>
				</div> : null}

			{currentSense?.value['Gout'] ?
				<div>
					<h3>Gout</h3>
				</div> : null}
		</div>
	)

}

export default MySenseWidget;

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