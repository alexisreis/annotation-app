window.onload = () => {
	document.getElementById('user-name').innerHTML =
		localStorage.getItem('user_name');
}

const addDocument = async () => {
	const nom = document.getElementById('document-name').value;
	const date = document.getElementById('document-date').value;

	if(nom === '' || date === ''){
		document.getElementById('infos').innerHTML = 'Champs manquants'
		return
	} else {
		const formData = new FormData();
		formData.append("nom", nom);
		formData.append("date", date);

		const response = await fetch(`http://localhost:5000/addDocument`, {
			method: 'POST',
			headers: {'x-access-tokens': localStorage.getItem('token')},
			body: formData,
			contentType: false,
			processData: false
		});

		console.log(response.json())
	}
}