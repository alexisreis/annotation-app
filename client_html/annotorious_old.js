let annotationCoordianates = "";
let selectedAnnotation;

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