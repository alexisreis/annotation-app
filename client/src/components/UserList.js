import React from 'react'
import UserItem from "./UserItem";

const UserList = ({users, setUsers}) => {

	const deleteUser = async (user_id, user_mail) => {
		if(prompt('Voulez-vous vraiment-supprimer le compte de ' + user_mail + ' ?' + '\nCette action est irréversible. Taper supprimer si oui') === 'supprimer'){
			const formData = new FormData();
			formData.append("user_id", user_id);

			await fetch('deleteUser', {
				method: 'POST',
				body: formData,
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((res) => {
					// Token is invalid or user is not logged in
					if (res.missing || res.invalid) {
						alert("Erreur: Utilisateur non connecté\"");
					} else if (res.failure) {
						alert("Non autorisé")
					} else {
						setUsers(users.filter((a) => a[0] !== user_id))
						alert("Utilisateur supprimé")
					}
				}).catch(console.error)
		}
	}

	return (<div>

		{users && users.length > 0 ? <table>
			<thead>
			<tr>
				<th>id</th>
				<th>nom</th>
				<th>mail</th>
				<th>type</th>
			</tr>
			</thead>
			<tbody>
			{users.sort((a, b) => a[0] - b[0])
				.map((user, i) => <UserItem key={i} user={user} deleteUser={deleteUser}/>)}
			</tbody>

		</table> : <span>Aucun utilisateur...</span>}
	</div>)
}

export default UserList;