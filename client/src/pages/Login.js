import '../styles/App.css';
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {

	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [incorrect, setIncorrect] = useState(false);

	const navigate = useNavigate();

	const handleKeyDown = (e) => {
		if(e.key === 'Enter'){
			login();
		}
	}

	const login = async () => {
		console.log(mail, password);
		const formData = new FormData();
		formData.append("mail", mail);
		formData.append("password", password);

		const response = await fetch(`login`, {
			method: 'POST',
			body: formData,
			contentType: false,
			processData: false
		});

		if (response.ok) {
			const token = await response.json();
			localStorage.setItem('token', token.token);

			const data = JSON.parse(
				atob(token.token.substring(
					token.token.indexOf(".") + 1,
					token.token.lastIndexOf(".")
				)));

			localStorage.setItem('user_id', data.user_id);
			localStorage.setItem('user_name', data.user_name);
			localStorage.setItem('user_mail', data.user_mail);
			localStorage.setItem('user_type', data.user_type);

			navigate('/')
		} else {
			setIncorrect(true);
		}
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Login</h1>
				<form onKeyDown={handleKeyDown}>
					{incorrect ?
						<div id="alert-div">
							Adresse mail ou mot de passe incorrect
						</div> : null}

					<div>
						<p>Adresse mail</p>
						<input type="text" id="mail" name="mail" onChange={(e) => setMail(e.target.value)}/>
					</div>
					<div>
						<p>Mot de passe</p>
						<input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
					</div>
					<input type="button" value="Login"
					       onClick={() => login()}/>
				</form>
			</header>
		</div>
	);
}

export default Login;