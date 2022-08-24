import '../styles/App.css';
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../utils/UserContext";
import bcrypt from "bcryptjs";
import "../styles/Login.css"

function Login() {

	const {setUser} = useContext(UserContext);
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [incorrect, setIncorrect] = useState(false);

/*	const salt = bcrypt.genSaltSync(10)
	console.log('salt', salt)*/

	const navigate = useNavigate();

	const handleKeyDown = (e) => {
		if(e.key === 'Enter'){
			login()
				.catch(console.error);
		}
	}

	const login = async () => {

		const formData = new FormData();
		formData.append("mail", mail);

		const hashedPassword = bcrypt.hashSync(password, '$2a$10$w6pb68tKZnpNiR/U7kURfu')
		formData.append("password", hashedPassword);

		const response = await fetch(`login`, {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			const token = await response.json();
			localStorage.setItem('token', token.token);

			const data = JSON.parse(
				atob(token.token.substring(
					token.token.indexOf(".") + 1,
					token.token.lastIndexOf(".")
				)));

			/*localStorage.setItem('user_id', data["user_id"]);
			 localStorage.setItem('user_name', data["user_name"]);
			 localStorage.setItem('user_mail', data["user_mail"]);
			 localStorage.setItem('user_type', data["user_type"]);
			 */

			setUser({
				name: data["user_name"],
				type: data["user_type"],
			})
			navigate('/')

		} else {
			setIncorrect(true);
		}
	}

	return (
		<div className="App">

				<form onKeyDown={handleKeyDown}>
					<h2>Se connecter</h2>
					<div>
						<label>ADRESSE MAIL</label>
						<input type="text" id="mail" name="mail" onChange={(e) => setMail(e.target.value)}/>
					</div>
					<div>
						<label>MOT DE PASSE</label>
						<input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
					</div>

					<label className='checkbox'>
						<input type='checkbox' checked title='Keep me Signed in' /> Se souvenir de moi
					</label>
					<br/>
					{incorrect ?
						<div className="alert-div">
							Adresse mail ou mot de passe incorrect
						</div> : null }
					<input type="button" id="login-button" value="SE CONNECTER"
					       onClick={() => login()}/>
					<hr/>
					<input type="button" id="signup-button" value="CRÉER UN COMPTE"
					       onClick={() => navigate('/signup')}/>
				</form>
		</div>
	);
}

export default Login;