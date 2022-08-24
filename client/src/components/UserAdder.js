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
		<h2>Créer un compte</h2>
		<div>
			<label>Nom</label>
			<input type="text" id="name" name="name"
			       onChange={(e) => setName(e.target.value)}/>
		</div>
		<div>
			<label>Adresse mail</label>
			<input type="text" id="mail" name="mail"
			       onChange={(e) => setMail(e.target.value)}/>
		</div>
		<div>
			<label>Mot de passe</label>
			<input type="password" id="password" name="password"
			       onChange={(e) => setPassword(e.target.value)}/>
		</div>
		<input type="button" id="login-button" value="Ajouter l'utilisateur"
		       onClick={() => addUser()}/>
	</form>)
}

export default UserAdder;