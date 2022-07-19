let isImproved = false;
let showIsOriginal = true;
let originalImage;
let improvedImage;
let imageName = "";

let annotations = [];
let anno;

let annotationCoordinates = "";
let selectedAnnotation = null;

const getLocalAnnotations = () => {
	return localStorage.getItem(imageName)
}

const setLocalAnnotation = (newAnnotations) => {
	localStorage.setItem(imageName, JSON.stringify(newAnnotations))
}

const SenseFormatter = function (annotation) {
	//TODO améliorer algos
	const isVue = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['Vue']
	});

	const isSon = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['Son']
	});

	const isGout = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['Gout']
	});

	const isOdeur = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['Odeur']
	});

	const isToucher = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['Toucher']
	});
	// add the important css class if the tag is present
	if (isVue) return 'vue'
	if (isSon) return 'son'
	if (isGout) return 'gout'
	if (isOdeur) return 'odeur'
	if (isToucher) return 'toucher'
}

const TranscriptionFormatter = function (annotation) {
	// Find the label body (if any)
	const label = annotation.bodies.find(b => b.purpose === 'transcription');

	if (label) {
		// Return an HTML label, wrapped in an SVG foreignObject
		const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		foreignObject.innerHTML =
			`<label xmlns="http://www.w3.org/1999/xhtml" >${label.value}</label>`;

		return {
			element: foreignObject
		};
	}
}

function initAnnotorious() {
	anno = Annotorious.init({
		image: 'my-image',
		widgets: [
			recogito.SenseWidget,
			recogito.TranscriptionWidget,
			/*'COMMENT',
			 {
			 widget: 'TAG', vocabulary: ['Vue', 'Son', 'Gout', 'Toucher',
			 'Odeur']
			 }*/
		],
		formatters: [SenseFormatter, TranscriptionFormatter]
	});

	Annotorious.BetterPolygon(anno);
	anno.setDrawingTool('polygon');
	Annotorious.Toolbar(anno, document.getElementById('my-toolbar-container'));

	// FOR LOCAL STORAGE
	// const storedAnnotation = getLocalAnnotations();
	// if (storedAnnotation) {
	// 	// console.log('storedAnnotations', storedAnnotation)
	// 	const theannotations = window.JSON.parse(storedAnnotation)
	// 	annotations = theannotations;
	// 	anno.setAnnotations(annotations);
	// }

	// FOR DATA BASE
	annotations = getDatabaseAnnotations(anno);

	anno.on('createAnnotation', (annotation) => {
		annotations = [...annotations, annotation]
		setLocalAnnotation(annotations)
	});

	anno.on('updateAnnotation', (annotation, previous) => {
		const newAnnotations = annotations.map(val => {
			if (val.id === annotation.id) return annotation
			return val
		})
		annotations = newAnnotations;
		setLocalAnnotation(annotations);
	});

	anno.on('deleteAnnotation', (annotation) => {
		const newAnnotations = annotations.filter(val => val.id !== annotation.id)
		annotations = newAnnotations;
		setLocalAnnotation(annotations);
	});

	anno.on('clickAnnotation', function(annotation, element) {
		let value = annotation.target.selector.value;
		annotationCoordinates = value.substring(11, value.length);
		selectedAnnotation = annotation;
	});

	anno.on('cancelSelected', function(selection) {
		annotationCoordinates = "";
	});

	anno.setAuthInfo({
		id: 'alefi-20-20',
		displayName: 'Alexis'
	});



	document.getElementById("options-container").innerHTML =
		"<button onClick='improveImage()'>Améliorer l'image</button> " +
		"<button onClick='saveAnnotationsToJSON()'>Exporter JSON</button> " +
		"<button id='find-word-button' onClick='findWord()'>Trouver le mot</button>";
}

const getDatabaseAnnotations = async (anno) => {
	const response = await fetch(`http://localhost:5000/getImageAnnotations/3`, {
		method: 'GET',
	})
	const json = await response.json()
	const value = json;
	console.log(value);
	anno.setAnnotations(value);
	return json;
}

function upload() {

	isImproved = false;
	if (anno) {
		var toolbar = document.getElementsByClassName('a9s-toolbar')[0];
		toolbar.parentNode.removeChild(toolbar);
		anno.destroy()
	}

	const file = document.getElementById('file').files[0];
	imageName = file.name;

	const reader = new FileReader();
	reader.onload = function (e) {
		const image = document.getElementById("my-image");
		image.src = e.target.result;
		originalImage = e.target.result;
	}

	reader.readAsDataURL(file);
	showIsOriginal = true;

	initAnnotorious()
}

async function improveImage() {
	if (!isImproved) {
		// Create a FormData to POST to backend
		const formData = new FormData();
		formData.append("file", document.getElementById('file').files[0]);

		const response = await fetch(`http://localhost:5000/uploadImage`, {
			method: 'POST',
			body: formData,
			contentType: false,
			processData: false
		})

		const blob = await response.blob()
		improvedImage = URL.createObjectURL(blob)
		document.getElementById("my-image").src = improvedImage;
		isImproved = true;
		showIsOriginal = false;
	} else {
		returnToBase()
	}
}

function returnToBase() {
	if (showIsOriginal) {
		document.getElementById("my-image").src =
			improvedImage;
	} else {
		document.getElementById("my-image").src =
			originalImage;
	}
	showIsOriginal = !showIsOriginal;
}

function download(content, fileName, contentType) {
	var a = document.createElement("a");
	var file = new Blob([JSON.stringify(content, null, 2)], {
		type:
		contentType
	});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

function saveAnnotationsToJSON() {
	download(anno.getAnnotations(), `${imageName}.json`, 'text/plain');
}

async function findWord(){

	if (annotationCoordinates) {
		// Create a FormData to POST to backend
		// console.log('annotationCoordinates', annotationCoordinates);
		let tab_coordinates = annotationCoordinates.split(',');
		// console.log('tab_coordinates', tab_coordinates);
		tab_coordinates = tab_coordinates.map(x => parseInt(x, 10));
		// console.log('tab_coordinates', tab_coordinates);

		const formData = new FormData();
		formData.append("file", document.getElementById('file').files[0]);
		formData.set("x", tab_coordinates[0].toString());
		formData.set("y", tab_coordinates[1].toString());
		formData.set("w", tab_coordinates[2].toString());
		formData.set("h", tab_coordinates[3].toString());

		JSON.stringify(Object.fromEntries(formData));
		// console.log(formData);

		const response = await
			fetch(`http://localhost:5000/findWordInImage`, {
				method: 'POST',
				body: formData,
				contentType: false,
				processData: false
			})

		const json = await response.json();
		console.log(json)

		//TODO: afficher l'image croppée avec les valeurs de retour de la fonction
		const potentialDiv = document.getElementById("potential-word");
		for(let i = 0; i < json.length; i++){

			const div = document.createElement("div");
			div.setAttribute("id", "found-word-div-" + i)
			div.setAttribute("style",
				"display: flex; flex-direction: column; margin: 2em;")

			const canvas = document.createElement("canvas");
			canvas.setAttribute("id", "found-word-" + i);

			const x = json[i][0];
			const y = json[i][1];

			const context = canvas.getContext('2d');

			var image = new Image();
			image.src = originalImage;

			image.onload = () => {
				context.drawImage(image,y, x, tab_coordinates[2],
					tab_coordinates[3], 0, 0, tab_coordinates[2],
					tab_coordinates[3])
			}

			const span = document.createElement('span')
			span.innerHTML = "x : " + x + "\ty: " + y;
			div.appendChild(span)

			const duplicateButton = document.createElement('button');
			duplicateButton.innerHTML = "Dupliquer l'annotation";
			duplicateButton.setAttribute("onClick",
				"duplicateAnnotation()");
			duplicateButton.setAttribute("style", "color: green");

			const removePotentialButton =
				document.createElement('button');
			removePotentialButton.innerHTML = "Enlever";
			removePotentialButton.setAttribute("onClick",
				"removePotential(" + i + ")");
			removePotentialButton.setAttribute("style", "color: red");

			div.appendChild(canvas);
			div.appendChild(duplicateButton);
			div.appendChild(removePotentialButton);

			potentialDiv.appendChild(div);
		}
		potentialDiv.setAttribute('style',
			'display: flex; flex-direction: row;');
		//TODO: envoyer plusieurs potentiels

		// const blob = await response.blob()
		// wordFound = URL.createObjectURL(blob)
		// document.getElementById("found-word").src = wordFound;

	} else {
		alert("Aucun mot selectionné\nVeuillez selectionner un mot sur l'image")
	}
}

function duplicateAnnotation(x, y){
	console.log(selectedAnnotation, x, y);
	// changer target
	// changer id
	alert("A FAIRE")
}

function removePotential(i) {
	console.log("found-word-div-" + i)
	document.getElementById("found-word-div-" + i).remove();
}