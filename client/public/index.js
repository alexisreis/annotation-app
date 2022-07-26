let isImproved = false;
let showIsOriginal = true;
let originalImage;
let improvedImage;
let imageName = "";

// let displayedAnnotations = [];
let anno;

// let annotationCoordinates = "";
let selectedAnnotation = null;


const SenseFormatter = function (annotation) {
	//TODO améliorer algos
	const isView = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['view']
	});

	const isSound = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['sound']
	});

	const isTaste = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['taste']
	});

	const isSmell = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['smell']
	});

	const isTouch = annotation.bodies.find(b => {
		return b.purpose === 'sense' && b.value['touch']
	});
	// add the important css class if the tag is present
	if (isView) return 'view'
	if (isSound) return 'sound'
	if (isTaste) return 'taste'
	if (isSmell) return 'smell'
	if (isTouch) return 'touch'
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

const getDatabaseAnnotations = async (anno) => {
	const id = imageName.replace(/\.[^/.]+$/, "");
	const response = await fetch(`http://localhost:5000/getImageAnnotations/` + id, {
		method: 'GET',
		headers: {'x-access-tokens': localStorage.getItem('token')},
	})
	const json = await response.json()
	anno.setAnnotations(json);
	return json;
}

const createAnnotation = async (anno, annotation) => {
	const id = imageName.replace(/\.[^/.]+$/, "");

	const body = annotation.body;
	const selector = annotation.target.selector;
	let zone_type;
	let zone_coord;

	if (selector.type === 'FragmentSelector') {
		zone_type = 0;
		zone_coord = selector.value.slice(11);
	} else {
		zone_type = 1;
		zone_coord = selector.value.slice(22, selector.value.length - 10);
	}

	const formData = new FormData()
	formData.append('body', JSON.stringify(body))
	formData.append('zone_type', zone_type)
	formData.append('zone_coord', zone_coord)
	formData.append('id', annotation.id)

	await fetch(`http://localhost:5000/createAnnotation/` + id, {
		method: 'POST',
		body: formData,
		headers: {'x-access-tokens': localStorage.getItem('token')},
	}).then((response) => response.json())
		.then((res) => {
			// Token is invalid or user is not logged in
			if (res.missing || res.invalid) {
				alert("Erreur: Utilisateur non connecté\"");
			} else if (!res.success) {
				alert('Erreur')
			}
		}).catch(console.error)
}


function jsonIsEqual(json1, json2) {
	for (var key in json1) {
		if (json1[key] != json2[key]) {
			return false;
		}
	}
	return true;
}

const updateAnnotation = async (annotation, oldAnnotation) => {

	// Changement de coordonnées ?
	if (annotation.target.selector.value !== oldAnnotation.target.selector.value) {
		let zone_coord;
		if (annotation.target.selector.type === 'FragmentSelector') {
			zone_coord = annotation.target.selector.value.slice(11);
		} else {
			zone_coord = annotation.target.selector.value.slice(22, annotation.target.selector.value.length - 10);
		}

		const formData = new FormData();
		formData.append('id', annotation.id)
		formData.append('zone_coord', zone_coord)
		await fetch(`http://localhost:5000/updateAnnotationCoord`, {
			method: 'POST',
			body: formData,
			headers: {'x-access-tokens': localStorage.getItem('token')},
		}).then((response) => response.json())
			.then((res) => {
				// Token is invalid or user is not logged in
				if (res.missing || res.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (!res.success) {
					alert('Erreur')
				}
			}).catch(console.error)
	}

	// Changement de transcription
	const newTranscription = annotation.body.find(b => b.purpose === 'transcription');
	const oldTransciption = oldAnnotation.body.find(b => b.purpose === 'transcription');
	if (!oldTransciption && !newTranscription) {
		console.log('rien')
	} else if (oldTransciption && !newTranscription?.value) {
		// Delete the transcription
		console.log('deleteTranscription')
		const formData = new FormData();
		formData.append('id', annotation.id)
		await fetch(`http://localhost:5000/deleteTranscription`, {
			method: 'POST',
			body: formData,
			headers: {'x-access-tokens': localStorage.getItem('token')},
		}).then((response) => response.json())
			.then((res) => {
				// Token is invalid or user is not logged in
				if (res.missing || res.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (!res.success) {
					alert('Erreur')
				}
			}).catch(console.error)
	} else if (!oldTransciption || !oldTransciption.value) {
		// Create transcription
		console.log('Create transcription')
		const formData = new FormData();
		formData.append('id', annotation.id)
		formData.append('transcription', newTranscription.value)
		await fetch(`http://localhost:5000/createTranscription`, {
			method: 'POST',
			body: formData,
			headers: {'x-access-tokens': localStorage.getItem('token')},
		}).then((response) => response.json())
			.then((res) => {
				// Token is invalid or user is not logged in
				if (res.missing || res.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (!res.success) {
					alert('Erreur')
				}
			}).catch(console.error)
	} else if (newTranscription.value !== oldTransciption.value) {
		// Edit the transcription
		console.log('updateTranscription')
		const formData = new FormData();
		formData.append('id', annotation.id)
		formData.append('transcription', newTranscription.value)
		await fetch(`http://localhost:5000/updateTranscription`, {
			method: 'POST',
			body: formData,
			headers: {'x-access-tokens': localStorage.getItem('token')},
		}).then((response) => response.json())
			.then((res) => {
				// Token is invalid or user is not logged in
				if (res.missing || res.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (!res.success) {
					alert('Erreur')
				}
			}).catch(console.error)
	}

	// Checks if changes in senses
	const senseBody = annotation.body.find(b => b.purpose === 'sense')
	const oldSenseBody = oldAnnotation.body.find(b => b.purpose === 'sense')

	// Delete all senses that are no longer present in the updated version
	if (oldSenseBody) {
		console.log('deleting')
		for (let sense in oldSenseBody.value) {
			if (senseBody && !senseBody.value[sense]) {
				console.log('delete ' + sense)
				const formData = new FormData();
				formData.append('id', annotation.id)
				await fetch(`http://localhost:5000/deleteSense/` + sense, {
					method: 'POST',
					body: formData,
					headers: {'x-access-tokens': localStorage.getItem('token')},
				}).then((response) => response.json())
					.then((res) => {
						// Token is invalid or user is not logged in
						if (res.missing || res.invalid) {
							alert("Erreur: Utilisateur non connecté\"");
						} else if (!res.success) {
							alert('Erreur')
						}
					}).catch(console.error)
			}
		}
	}


	if (senseBody) {
		// Create senses that were not present in the old version
		console.log('creating')
		for (let sense in senseBody.value) {
			if (!oldSenseBody || (oldSenseBody && !oldSenseBody.value[sense])) {
				console.log('Create ' + sense)
				const formData = new FormData();
				formData.append('id', annotation.id)

				if (sense === 'sound') {
					const type = JSON.stringify(senseBody.value['sound'].type)
					formData.append('sound_type', type);
					formData.append('sound_volume', senseBody.value['sound'].volume)
				}

				await fetch(`http://localhost:5000/createSense/` + sense, {
					method: 'POST',
					body: formData,
					headers: {'x-access-tokens': localStorage.getItem('token')},
				}).then((response) => response.json())
					.then((res) => {
						// Token is invalid or user is not logged in
						if (res.missing || res.invalid) {
							alert("Erreur: Utilisateur non connecté\"");
						} else if (!res.success) {
							alert('Erreur')
						}
					}).catch(console.error)
			}
		}

		// Update senses that are in the old and the updated version and are
		// different

		for (let sense in senseBody.value) {
			if (oldSenseBody && oldSenseBody.value[sense] && !jsonIsEqual(senseBody.value[sense], oldSenseBody.value[sense])) {
				console.log('update ' + sense)
				const formData = new FormData();
				formData.append('id', annotation.id)

				if (sense === 'sound') {
					const type = JSON.stringify(senseBody.value['sound'].type)
					console.log(type)
					formData.append('sound_type', type);
					formData.append('sound_volume', senseBody.value['sound'].volume)
				}

				await fetch(`http://localhost:5000/updateSense/` + sense, {
					method: 'POST',
					body: formData,
					headers: {'x-access-tokens': localStorage.getItem('token')},
				}).then((response) => response.json())
					.then((res) => {
						// Token is invalid or user is not logged in
						if (res.missing || res.invalid) {
							alert("Erreur: Utilisateur non connecté\"");
						} else if (!res.success) {
							alert('Erreur')
						}
					}).catch(console.error)
			}
		}

	}

}


const deleteAnnotation = async (anno, annotation) => {
	const formData = new FormData();
	formData.append('id', annotation.id)
	await fetch(`http://localhost:5000/deleteAnnotation`, {
		method: 'POST',
		body: formData,
		headers: {'x-access-tokens': localStorage.getItem('token')},
	}).then((response) => response.json())
		.then((res) => {
			// Token is invalid or user is not logged in
			if (res.missing || res.invalid) {
				alert("Erreur: Utilisateur non connecté\"");
			} else if (!res.success) {
				alert('Erreur')
			}
		}).catch(console.error)
}

const initAnnotorious = () => {
	console.log('initAnno')
	anno = Annotorious.init({
		image: 'my-image',
		widgets: [
			recogito.SenseWidget,
			recogito.TranscriptionWidget,
		],
		formatters: [SenseFormatter, TranscriptionFormatter]
	});


	Annotorious.BetterPolygon(anno);
	anno.setDrawingTool('polygon');
	Annotorious.Toolbar(anno, document.getElementById('my-toolbar-container'));

	// FOR LOCAL STORAGE
	/*	const storedAnnotation = getLocalAnnotations();
	 if (storedAnnotation) {
	 // console.log('storedAnnotations', storedAnnotation)
	 const theannotations = window.JSON.parse(storedAnnotation)
	 annotations = theannotations;
	 anno.setAnnotations(annotations);
	 }*/

	// FOR DATA BASE
	getDatabaseAnnotations(anno);

	anno.on('createAnnotation', (annotation) => {
		// annotations = [...annotations, annotation]
		// setLocalAnnotation(annotations)
		createAnnotation(anno, annotation);
	});

	anno.on('updateAnnotation', (annotation, previous) => {
		// const newAnnotations = annotations.map(val => {
		//   if (val.id === annotation.id) return annotation
		//   return val
		// })
		// annotations = newAnnotations;
		// setLocalAnnotation(annotations);
		updateAnnotation(annotation, selectedAnnotation);
	});

	anno.on('deleteAnnotation', (annotation) => {
		deleteAnnotation(anno, annotation)
	});

	anno.on('clickAnnotation', function (annotation, element) {
		// let value = annotation.target.selector.value;
		// annotationCoordinates = value.substring(11, value.length);
		selectedAnnotation = annotation;
	});

	anno.on('cancelSelected', function (selection) {
		// annotationCoordinates = "";
		selectedAnnotation = null;
	});
}

const upload = () => {
	console.log('upload')
	isImproved = false;
	if (anno) {
		var toolbar = document.getElementsByClassName('a9s-toolbar')[0];
		toolbar.parentNode.removeChild(toolbar);
		anno.destroy()
	}

	const file = document.getElementById('file').files[0];
	imageName = file.name;

	// TODO : vérifier si les noms de fichier correspondent

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

const improveImage = async () => {
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

const returnToBase = () => {
	if (showIsOriginal) {
		document.getElementById("my-image").src =
			improvedImage;
	} else {
		document.getElementById("my-image").src =
			originalImage;
	}
	showIsOriginal = !showIsOriginal;
}

const download = (content, fileName, contentType) => {
	var a = document.createElement("a");
	var file = new Blob([JSON.stringify(content, null, 2)], {
		type:
		contentType
	});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

const saveAnnotationsToJSON = () => {
	if (anno) {
		download(anno.getAnnotations(), `${imageName}.json`, 'text/plain');
	} else {
		alert("Aucune image n'est chargée...")
	}

}

// TODO : améliorer (détection de changement d'URL ou autre...)
window.onclick = () => {
	if (document.getElementById('my-image') && !anno) {
		document.getElementById('file').setAttribute('onchange', 'upload()');
		document.getElementById('improve-image-button').setAttribute('onclick', 'improveImage()');
		document.getElementById('export-json-button').setAttribute('onclick', 'saveAnnotationsToJSON()');
	} else if (anno && !document.getElementById('my-image')) {
		anno.destroy();
		anno = undefined;
	}
}
