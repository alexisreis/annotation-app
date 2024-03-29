import '../styles/App.css';
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../utils/UserContext";
import UserList from "../components/UserList";

function AdminDashboard() {

	const {user} = useContext(UserContext);
	const [usersList, setUsersList] = useState([]);

	const fetchData = async () => {
		await fetch('getUsersList', {
			method: 'GET',
			headers: {'x-access-tokens': localStorage.getItem('token')}
		}).then((response) => response.json())
			.then((users) => {
				// Token is invalid or user is not logged in
				if (users.missing || users.invalid) {
					alert("Erreur: Utilisateur non connecté\"");
				} else if (users.failure){
					alert("Non autorisé")
				} else if (users.storage) {
					alert("Pas d'utilisateur");
				} else {
					setUsersList(users)
				}
			}).catch(console.error)
	}

	const initDB = async () => {
		await fetch('initdb', {
			method: 'GET',
			headers: {'x-access-tokens': localStorage.getItem('token')}
		})
	}

	useEffect(() => {
		fetchData()
			.catch(console.error);
	}, [])

	return (
		<div className="App">
			{user && user.type === 'A' ? <header className="App-header">
				<h1>Console d'administration</h1>
				<h4>Liste des utilisateurs</h4>
				<UserList users={usersList} setUsers={setUsersList}/>
				<button onClick={initDB}>Initialiser la base de données</button>
			</header> : <h1>Not authorized</h1>}

		</div>
	);
}

export default AdminDashboard;