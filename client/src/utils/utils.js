const verifyAuthentication = async () => {
	const response = await fetch(`auth`, {
		method: 'GET',
		headers: {'x-access-tokens': localStorage.getItem('token')},
	});

	console.log(response.json());
}

export {verifyAuthentication}