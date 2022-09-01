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
		<div className="App">
			<div>
				<h1>Bienvenue <span className="span-blue">{user.name}</span>,</h1>
				<hr/>
			</div>

			{documents && documents.length > 0 ?
				<DocumentList documents={documents}/> :
				<span>Il n'y a aucun documents ici</span>
			}
			{user.type === 'A' || user.type === 'M' ?
				<DocumentAdder documents={documents} setDocuments={setDocuments}/> :
				null }

		</div>
	);
}

export default HomeClient;
