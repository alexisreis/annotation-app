const disconnect = () => {
	if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
		localStorage.removeItem('token');
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_name');
		localStorage.removeItem('user_mail');
		localStorage.removeItem('user_type');

		window.location.reload()
	}
}

const verifyAuthentication = async () => {
	const response = await fetch(`auth`, {
		method: 'GET',
		headers: {'x-access-tokens': localStorage.getItem('token')},
	});

	console.log(response.json());
}

export {disconnect, verifyAuthentication}