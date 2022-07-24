import React, {useState, useEffect} from 'react'
import Document from "./Document";

const DocumentList = ({setState}) => {
	const [documents, setDocuments] = useState([]);
	const [message, setMessage] = useState("");
	const [addMessage, setAddMessage] = useState("");

	const [title, setTitle] = useState("");
	const [date, setDate] = useState('');

	const fetchData = async () => {
		await fetch('getDocuments', {
			method: 'GET',
			headers: {'x-access-tokens': localStorage.getItem('token')}
		}).then((response) => response.json())
			.then((docs) => {
				// Token is invalid or user is not logged in
				if (docs.missing || docs.invalid) {
					setMessage("Erreur: Utilisateur non connecté\"");
				}
				else if (docs.storage) {
					setMessage("Il n'y a pas de documents stockés ici");
				}
				setDocuments(docs)
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
					}
					else if (docs.success) {
						setAddMessage("Insertion effectuée");
					}
				})
				.catch(console.error);
		}
	}

	return (<div>
		{message ? <span>{message}</span> : null}
		{documents.length ? <table>
			<thead>
			<tr>
				<th>id</th>
				<th>titre</th>
				<th>date</th>
			</tr>
			</thead>
			<tbody>
			{documents.map((doc, i) =>
				<Document key={i} data={doc} setState={setState}/>
			)}
			</tbody>

		</table> : <span>Pas de documents dans la base de données</span>}
		<div>
			<h4>Ajouter un document</h4>
			<div>
				<label>Nom :</label>
				<input
					placeholder="Registre de la ville de Lyon" type="text"
					onChange={(e) => setTitle(e.target.value)}/>
			</div>

			<div>
				<label>Date :</label>
				<input type="number" min="1700" max="2022"
				       onChange={(e) => setDate(e.target.value)}/>
			</div>

			<button onClick={addDocument}>Ajouter</button>
			{addMessage ? <span>{addMessage}</span> : null}
		</div>
	</div>)
}

export default DocumentList;