const verifyAuthentication = async () => {
	const response = await fetch(`auth`, {
		method: 'GET',
		headers: {'x-access-tokens': localStorage.getItem('token')},
	});

	console.log(response.json());
}

const colorSense = {
	Son: '#19ff00',
	Vue: '#00e0ff',
	Odeur: '#a8482c',
	Toucher: '#fff200',
	Goût: '#ff00ae'
}

export {verifyAuthentication, colorSense}