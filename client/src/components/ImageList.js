import React, {useState, useEffect, useContext} from 'react'
import ImageItem from "./ImageItem";
import TranscriptionTab from "./TranscriptionTab";
import {PageContext} from "../utils/PageContext";

const ImageList = () => {
	const [images, setImages] = useState([]);
	const [message, setMessage] = useState("");
	const [addMessage, setAddMessage] = useState("");
	const [imageId, setImageId] = useState("");
	const [transcriptions, setTranscriptions] = useState([]);

	const {page, setPage} = useContext(PageContext);

	const fetchData = async () => {
		if(page.document_cote){
			await fetch('getImagesFromDocument/' + page.document_cote, {
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

	const fetchTranscriptions = async () => {
		if(page.document_cote){
			await fetch('getMostTranscribed/' + page.document_cote, {
				method: 'GET',
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						setMessage("Erreur: Utilisateur non connecté");
					}
					else if (img.storage) {
						setMessage("Pas de transcriptions");
					} else if (!img.success) {
						setMessage('Erreur - transcriptions')
					}
					setTranscriptions(img)
				}).catch(console.error)
		}
	}

	useEffect(() => {
		fetchData()
			.catch(console.error);
		fetchTranscriptions()
			.catch(console.error);
	}, [])


	const addImage = async () => {
		if (imageId === '') {
			setAddMessage('Champs manquants')
		} else {
			const cleanedImageId = imageId.replace(/\.[^/.]+$/, "");
			const formData = new FormData();
			formData.append("image_id", cleanedImageId );

			await fetch(`addImageToDocument/` + page.document_cote , {
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
						setImages([...images, [cleanedImageId]])
					}
				})
				.catch(console.error);
		}
	}

	return (<div style={{display: "flex", flexDirection:"column", justifyContent:"center"}}>
		<button onClick={() => setPage({page: 'home'})}>Retour à la liste</button>

		<div className="document-dashboard">
			<h3>{page.document_name}</h3>
			<TranscriptionTab transcriptions={transcriptions}/>
		</div>

		{images.length ?
			<table>
			<thead>
				<tr>
					<th>image</th>
					<th>Répartition des sens</th>
				</tr>
			</thead>
			<tbody>
				{images.sort((a, b) => a[0] - b[0])
					.map((doc, i) =>
					<ImageItem key={i} data={doc}/>
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