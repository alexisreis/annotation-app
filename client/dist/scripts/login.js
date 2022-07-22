// TODO : change page when already logged in
document.addEventListener("keypress", (event) => {
	if(event.key === "Enter"){
			event.preventDefault();
			login();
		}
	})


const login = async () => {
	const mail = document.getElementById('mail').value;
	const password = document.getElementById('password').value;
	const formData = new FormData();
	formData.append("mail", mail);
	formData.append("password", password);

	const response = await fetch(`http://localhost:5000/login`, {
		method: 'POST',
		body: formData,
		contentType: false,
		processData: false
	});

	if(response.ok){
		const token = await response.json();
		localStorage.setItem('token', token.token);

		// TODO : décoder token
		const data = JSON.parse(
			atob(token.token.substring(
				token.token.indexOf(".") + 1,
				token.token.lastIndexOf(".")
			)));

		localStorage.setItem('user_id', data.user_id);
		localStorage.setItem('user_name', data.user_name);
		localStorage.setItem('user_mail', data.user_mail);
		localStorage.setItem('user_type', data.user_type);

		window.location.href = "home.html";
	}
	else {
		document.getElementById('alert-div').innerHTML =
			"Adresse mail ou mot de passe incorrect";
	}
}