import '../styles/App.css';
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../utils/UserContext";
import bcrypt from "bcryptjs"

function AdminDashboard() {

	const {user} = useContext(UserContext);

	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			addUser()
				.catch(console.error);
		}
	}

	const addUser = async () => {

		const hashedPassword = bcrypt.hashSync(password, '$2a$10$w6pb68tKZnpNiR/U7kURfu')

		const formData = new FormData();
		formData.append("name", name);
		formData.append("type", type);
		formData.append("mail", mail);
		formData.append("password", hashedPassword);

		await fetch(`addUser`, {
			method: 'POST',
			headers: {'x-access-tokens': localStorage.getItem('token')},
		    body: formData,
		}).then((res) => res.json())
			.then((json) => {
				// Token is invalid or user is not logged in
				if (json.missing || json.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (json.failure) {
					alert("Il n'y a pas de documents stockés ici");
				}else if (json.blank) {
					alert("Champs vides");
				} else if(!json.success){
					alert("Erreur inconnue")
				}
			})

	}

	return (
		<div className="App">
			{user && user.type === 'A' ? <header className="App-header">
				<h1>Console d'administration</h1>
				<form onKeyDown={handleKeyDown}>
					<span>Ajouter un utilisateur</span>
					<div>
						<p>Nom</p>
						<input type="text" id="name" name="name"
						       onChange={(e) => setName(e.target.value)}/>
					</div>
					<div>
						<p>Type</p>
						<input type="radio" name='type' value='A' id='A'
						       onClick={(e) => setType(e.target.value)}/>
						<label htmlFor='A'>Admin</label>
						<input type="radio" name='type' value='M' id='M'
						       onClick={(e) => setType(e.target.value)}/>
						<label htmlFor='M'>Modérateur</label>
						<input type="radio" name='type' value='E' id='E'
						       onClick={(e) => setType(e.target.value)}/>
						<label htmlFor='E'>Editeur</label>
						<input type="radio" name='type' value='S' id='S'
						       onClick={(e) => setType(e.target.value)}/>
						<label htmlFor='S'>Créateur (standard)</label>
					</div>
					<div>
						<p>Adresse mail</p>
						<input type="text" id="mail" name="mail"
						       onChange={(e) => setMail(e.target.value)}/>
					</div>
					<div>
						<p>Mot de passe</p>
						<input type="password" id="password" name="password"
						       onChange={(e) => setPassword(e.target.value)}/>
					</div>
					<input type="button" value="Ajouter l'utilisateur"
					       onClick={() => addUser()}/>
				</form>
			</header> : <h1>Not authorized</h1>}

		</div>
	);
}

export default AdminDashboard;