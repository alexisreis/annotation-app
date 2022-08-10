import '../styles/App.css';
import DocumentList from "../components/DocumentList";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../utils/UserContext";
import DocumentAdder from "../components/DocumentAdder";


function HomeClient() {

	const {user} = useContext(UserContext)

	const [documents, setDocuments] = useState([]);

	const fetchData = async () => {
		await fetch('getDocuments', {
			method: 'GET',
			headers: {'x-access-tokens': localStorage.getItem('token')}
		}).then((response) => response.json())
			.then((docs) => {
				// Token is invalid or user is not logged in
				if (docs.missing || docs.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (docs.storage) {
					alert("Il n'y a pas de documents stockés ici");
				}
				setDocuments(docs)
				return docs;
			}).catch(console.error)
	}

	useEffect(() => {
		fetchData()
			.catch(console.error);
	}, [])


	return (
		<div id="home-div">
			<h1>Bienvenue {user.name},</h1>
			<br/>
			<DocumentList documents={documents}/>
			<DocumentAdder documents={documents} setDocuments={setDocuments}/>
		</div>
	);
}

export default HomeClient;
