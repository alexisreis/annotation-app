import React, {useState, useEffect, useContext} from "react"
import DocumentDashboard from "../components/DocumentDashboard";
import {PageContext} from "../utils/PageContext";
import ImageList from "../components/ImageList";
import ImageAdder from "../components/ImageAdder";

export default function DocumentPage() {

	const [images, setImages] = useState([]);
	const [stats, setStats] = useState([]);
	const [transcriptions, setTranscriptions] = useState([]);

	const {page, setPage} = useContext(PageContext);

	const fetchData = async () => {
		if (page.document_cote) {
			await fetch('getDocument/' + page.document_cote, {
				method: 'GET',
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						alert("Erreur: Utilisateur non connecté");
					} else if (img.storage) {
						alert("Pas d'images stockées pour ce document");
					} else {
						setImages(img.images)
						setStats(img.stats)
						setTranscriptions(img.transcriptions)
					}
				}).catch(console.error)
		}
	}


	useEffect(() => {
		fetchData()
			.catch(console.error);
	}, [page])

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
		}}>
			<h2 style={{textAlign: "center"}}>{page.document_name}</h2>
			<DocumentDashboard senseStats={stats}
			                   transcriptions={transcriptions}/>
			<ImageList images={images}/>
			<ImageAdder images={images} setImages={setImages}/>
		</div>
	)
}