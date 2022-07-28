const disconnect = (setUser) => {
	if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
		localStorage.removeItem('token');
		setUser(null)
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