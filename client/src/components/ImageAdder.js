import React, {useContext, useState} from "react"
import {PageContext} from "../utils/PageContext";

const ImageAdder = ({images, setImages}) => {

	const [imageId, setImageId] = useState("");
	const {page} = useContext(PageContext);

	const addImage = async () => {
		if (imageId === '') {
			alert('Champs manquants')
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
						alert("Erreur: Utilisateur non connecté\"");
					}
					else if (img.success) {
						alert("Insertion effectuée");
						setImages([...images, [cleanedImageId]])
					}
				})
				.catch(console.error);
		}
	}

	return (
		<div>
			<h4>Ajouter une image au document</h4>
			<div>
				<label>Nom :</label>
				<input
					placeholder="IMG_09090990.jpg" type="text"
					onChange={(e) => setImageId(e.target.value)}/>
			</div>
			<button onClick={addImage}>Ajouter</button>
		</div>)
}

export default ImageAdder;