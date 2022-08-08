import '../styles/App.css';
import {useContext, useEffect, useState} from "react";
import {PageContext} from "../utils/PageContext";

function AnnotoriousViewer() {

	const [image, setImage] = useState(null);
	const {page} = useContext(PageContext)

	const fetchImage = async (document_cote, image_id) => {
		const data = await fetch(`/getOriginalImage/${document_cote}/${image_id}`);
		const blob = await data.blob()
		const url = URL.createObjectURL(blob)
		setImage(url);
	}

	useEffect(() => {
		if(page && page.document_cote && page.image_id) {
			fetchImage(page.document_cote, page.image_id)
				.catch(console.error)
		}
	}, [page])

	return (
		<div className="App">
			<header className="App-header">
{/*				<input type="file" id="file" accept="image/png, image/jpeg"/>
				<button id="improve-image-button">Améliorer l'image</button>*/}
				<button id="export-json-button">Exporter JSON</button>
				<div id="my-toolbar-container"/>
				<img id="my-image" width="100%" alt='To annotate' src={image}/>
			</header>
		</div>
	);
}

export default AnnotoriousViewer;
