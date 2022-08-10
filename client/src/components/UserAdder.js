import React, {useState} from "react"
import bcrypt from "bcryptjs";

const UserAdder = () => {

	const [name, setName] = useState("");
	/*const [type, setType] = useState("");*/
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			addUser()
				.catch(console.error);
		}
	}

	const addUser = async () => {
		if(!name || !password || !mail){
			alert("Champs manquants! Veuillez remplir tous les champs!");
			return;
		}

		const hashedPassword = bcrypt.hashSync(password, '$2a$10$w6pb68tKZnpNiR/U7kURfu')
		console.log(hashedPassword);
		const formData = new FormData();
		formData.append("name", name);
		/*formData.append("type", type);*/
		formData.append("mail", mail);
		formData.append("password", hashedPassword);

		await fetch(`createNewUser`, {
			method: 'POST',
			body: formData,
		}).then((res) => res.json())
			.then((json) => {
				// Token is invalid or user is not logged in
				if(json.blank){
					alert("Champs manquants! (request)")
				} else if(json.exists){
					alert("Cet email a déja un compte")
				} else if (!json.success){
					alert("Erreur lors de l'insertion")
				} else {
					alert("Utilisateur créé")
				}

			})
	}


	return (
	<form onKeyDown={handleKeyDown}>
		<div>
			<p>Nom</p>
			<input type="text" id="name" name="name"
			       onChange={(e) => setName(e.target.value)}/>
		</div>
{/*		<div>
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
		</div>*/}
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
	</form>)
}

export default UserAdder;