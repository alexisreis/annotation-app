import React, {useState} from 'react'

const DocumentAdder = ({documents, setDocuments}) => {

	const [cote, setCote] = useState("")
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");

	const addDocument = async () => {

		if (title === '' || date === '') {
			alert('Champs manquants');
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
						alert("Erreur: Utilisateur non connecté\"");
					} else if (docs.success) {
						alert("Insertion effectuée");
						setDocuments([...documents, [cote, title, date]])
					}
				})
				.catch(console.error);
		}
	}
	return (<div>
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
	</div>)
}

export default DocumentAdder;