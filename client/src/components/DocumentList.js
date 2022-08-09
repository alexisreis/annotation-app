import React, {useState, useEffect, useContext} from 'react'
import DocumentItem from "./DocumentItem";
import {UserContext} from "../utils/UserContext";
import DocumentDashboard from "./DocumentDashboard";

const DocumentList = () => {
	const [documents, setDocuments] = useState([]);
	// TODO : enlever ça
	const [displayedDocuments, setDisplayedDocument] = useState([]);

	const [message, setMessage] = useState("");
	const [addMessage, setAddMessage] = useState("");

	const [cote, setCote] = useState("")
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");

	const {user} = useContext(UserContext)

	const fetchData = async () => {
		await fetch('getDocuments', {
			method: 'GET',
			headers: {'x-access-tokens': localStorage.getItem('token')}
		}).then((response) => response.json())
			.then((docs) => {
				// Token is invalid or user is not logged in
				if (docs.missing || docs.invalid) {
					setMessage("Erreur: Utilisateur non connecté\"");
				} else if (docs.storage) {
					setMessage("Il n'y a pas de documents stockés ici");
				}
				setDocuments(docs)
				setDisplayedDocument(docs);
				return docs;
			}).catch(console.error)
	}

	useEffect(() => {
		fetchData()
			.catch(console.error);
	}, [])

	const addDocument = async () => {

		if (title === '' || date === '') {
			setAddMessage('Champs manquants');
		} else {
			const formData = new FormData();
			formData.append("cote", cote);
			formData.append("nom", title);
			formData.append("date", date);

			await fetch(`addDocument`, {
				method: 'POST',
				headers: {'x-access-tokens': localStorage.getItem('token')},
				body: formData,
			}).then((response) => response.json())
				.then((docs) => {
					// Token is invalid or user is not logged in
					if (docs.missing || docs.invalid) {
						setAddMessage("Erreur: Utilisateur non connecté\"");
					} else if (docs.success) {
						setAddMessage("Insertion effectuée");
						setDocuments([...documents, [cote, title, date]])
					}
				})
				.catch(console.error);
		}
	}

	const search = (title) => {
		if (title !== '') {
			setDisplayedDocument(documents.filter(
				d => d[0].toLowerCase().includes(title.toLowerCase())
					|| d[1].toLowerCase().includes(title.toLowerCase())
					|| d[2].toString().includes(title)
			));
		}
	}


	return (<div>
		<h1>Bienvenue {user.name},</h1>
		<br/>
		<input type="text" onChange={e => search(e.target.value)}
		       id={"document-search-bar"}
		       placeholder={"Rechercher un titre, une date, une cote..."}/>
		{message ? <span>{message}</span> : null}

		{displayedDocuments ? <table>
			<thead>
			<tr>
				<th>cote</th>
				<th>titre</th>
				<th>date</th>
			</tr>
			</thead>
			<tbody>
			{displayedDocuments.sort((a, b) => a[0] - b[0])
				.map((doc, i) =>
					<DocumentItem key={i} data={doc}/>
				)}
			</tbody>

		</table> : <span>Aucun document ne correspond</span>}
		<div>
			<h4>Ajouter un document</h4>
			<div>
				<p>Cote :</p>
				<input
					placeholder="AML_09999" type="text"
					onChange={(e) => setCote(e.target.value)}/>
			</div>

			<div>
				<p>Nom :</p>
				<input
					placeholder="Registre de la ville de Lyon" type="text"
					onChange={(e) => setTitle(e.target.value)}/>
			</div>

			<div>
				<p>Date :</p>
				<input type="number" min="1700" max="2022"
				       onChange={(e) => setDate(e.target.value)}/>
			</div>

			<button onClick={addDocument}>Ajouter</button>
			{addMessage ? <span>{addMessage}</span> : null}
		</div>
	</div>)
}

export default DocumentList;