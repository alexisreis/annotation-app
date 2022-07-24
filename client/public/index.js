let isImproved = false;
let showIsOriginal = true;
let originalImage;
let improvedImage;
let imageName = "";

let annotations = [];
let anno;

let annotationCoordinates = "";
let selectedAnnotation = null;


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

const getDatabaseAnnotations = async (anno) => {
	const id = imageName.replace(/\.[^/.]+$/, "");
	const response = await fetch(`http://localhost:5000/getImageAnnotations/` + id, {
		method: 'GET',
	})
	const json = await response.json()
	anno.setAnnotations(json);
	return json;
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
		// annotations = [...annotations, annotation]
		// setLocalAnnotation(annotations)
	});

	anno.on('updateAnnotation', (annotation, previous) => {
		// const newAnnotations = annotations.map(val => {
		//   if (val.id === annotation.id) return annotation
		//   return val
		// })
		// annotations = newAnnotations;
		// setLocalAnnotation(annotations);
	});

	anno.on('deleteAnnotation', (annotation) => {
		// const newAnnotations = annotations.filter(val => val.id !== annotation.id)
		// annotations = newAnnotations;
		// setLocalAnnotation(annotations);
	});

	anno.on('clickAnnotation', function (annotation, element) {
		// let value = annotation.target.selector.value;
		// annotationCoordinates = value.substring(11, value.length);
		// selectedAnnotation = annotation;
	});

	anno.on('cancelSelected', function (selection) {
		// annotationCoordinates = "";
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
	if(anno){
		download(anno.getAnnotations(), `${imageName}.json`, 'text/plain');
	} else {
		alert("Aucune image n'est chargée...")
	}

}


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
