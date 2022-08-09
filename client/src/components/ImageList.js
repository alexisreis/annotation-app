import React, {useState, useEffect, useContext} from 'react'
import ImageItem from "./ImageItem";
import {PageContext} from "../utils/PageContext";
import DocumentDashboard from "./DocumentDashboard";

const ImageList = () => {

	const [images, setImages] = useState([]);
	const [message, setMessage] = useState("");
	const [addMessage, setAddMessage] = useState("");
	const [imageId, setImageId] = useState("");
	const [stats, setStats] = useState([]);


	const {page} = useContext(PageContext);

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

	const fetchStats = async () => {
		if(page.document_cote){
			await fetch('getSensesStats/' + page.document_cote, {
				method: 'GET',
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						setMessage("Erreur: Utilisateur non connecté");
					}
					else if (img.storage) {
						setMessage("Pas de stats pour ce document");
					}
					setStats(img[0])
				}).catch(console.error)
		}
	}



	useEffect(() => {
		fetchData()
			.catch(console.error);
		fetchStats()
			.catch(console.error)
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

		<DocumentDashboard senseStats={stats}/>

		{images.length ?
			<div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
				{images.sort((a, b) => a[0] - b[0])
					.map((doc, i) =>
					<ImageItem key={i} data={doc}/>
				)}
			</div>
			 : <span>{message}</span>}
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