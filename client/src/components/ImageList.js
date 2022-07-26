import React, {useState, useEffect} from 'react'
import Image from "./Image";

const ImageList = ({documentId}) => {
	const [images, setImages] = useState([]);
	const [message, setMessage] = useState("");
	const [addMessage, setAddMessage] = useState("");
	const [imageId, setImageId] = useState("");

	const fetchData = async () => {
		if(documentId){
			await fetch('getImagesFromDocument/' + documentId, {
				method: 'GET',
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						setMessage("Erreur: Utilisateur non connecté");
					}
					else if (img.storage) {
						setMessage("Pas d'images stockées pour ce document");
					}
					setImages(img)
				}).catch(console.error)
		}
	}

	useEffect(() => {
		fetchData()
			.catch(console.error);
	}, [])


	const addImage = async () => {
		if (imageId === '') {
			setAddMessage('Champs manquants')
		} else {
			const cleanedImageId = imageId.replace(/\.[^/.]+$/, "");
			const formData = new FormData();
			formData.append("image_id", cleanedImageId );

			await fetch(`addImageToDocument/` + documentId , {
				method: 'POST',
				headers: {'x-access-tokens': localStorage.getItem('token')},
				body: formData,
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						setAddMessage("Erreur: Utilisateur non connecté\"");
					}
					else if (img.success) {
						setAddMessage("Insertion effectuée");
						console.log(imageId)
						setImages([...images, [cleanedImageId]])
					}
				})
				.catch(console.error);
		}
	}

	return (<div>
		{images.length ? <table>
			<thead>
				<tr>
					<th>fichier</th>
					<th>Son</th>
					<th>Vue</th>
					<th>Odeur</th>
					<th>Toucher</th>
					<th>Gout</th>
				</tr>
			</thead>
			<tbody>
				{images.map((doc, i) =>
					<Image key={i} data={doc}/>
				)}
			</tbody>

		</table> : <span>{message}</span>}
		<div>
			<h4>Ajouter une image au document</h4>
			<div>
				<label>Nom :</label>
				<input
					placeholder="IMG_09090990.jpg" type="text"
					onChange={(e) => setImageId(e.target.value)}/>
			</div>

			<button onClick={addImage}>Ajouter</button>
			{addMessage ? <span>{addMessage}</span> : null}
		</div>
	</div>)
}

export default ImageList;