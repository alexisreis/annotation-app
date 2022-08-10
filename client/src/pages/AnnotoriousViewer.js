import '../styles/App.css';
import {useContext, useEffect, useState} from "react";
import {PageContext} from "../utils/PageContext";

function AnnotoriousViewer() {

	const [image, setImage] = useState(null);
	const {page, setPage} = useContext(PageContext)

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
		if(page.page !== 'image' && page.image_id){
			setPage({
				page: 'image',
				image_id: page.image_id,
				document_cote: page.document_cote,
				document_name: page.document_name
			})
		}
	}, [page])

	return (
		<div className="App">
{/*				<input type="file" id="file" accept="image/png, image/jpeg"/>
				<button id="improve-image-button">Améliorer l'image</button>*/}
				<button id="export-json-button">Exporter JSON</button>
				<div id="my-toolbar-container"/>
				<img id="my-image" width="100%" alt='To annotate' src={image}/>
		</div>
	);
}

export default AnnotoriousViewer;
