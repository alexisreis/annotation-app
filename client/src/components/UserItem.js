import React, {useState} from "react"
import "../styles/UserItem.css"

const UserItem = ({user, deleteUser}) => {

	const [changeType, setChangeType] = useState(false);
	const [type, setType] = useState(user[3]);

	const editType = async () => {
		const formData = new FormData();
		formData.append("user_id", user[0]);
		formData.append("user_type", type);

		await fetch('editUserType', {
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
					setChangeType(false);
				}
			}).catch(console.error)
	}


	return (<tr>
		<td>{user[0]}</td>
		<td>{user[1]}</td>
		<td>{user[2]}</td>
		<td>
			{!changeType ?
				<div style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				}}>
					{type === 'A' ? 'Admin' : type === 'M' ? 'Moderateur' : type === 'E' ? 'Editeur' : type === 'S' ? 'Créateur' : type === 'W' ? 'Watcher' : user}
					<div style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between"
					}}>
						<span className="user-options" style={{color: "blue"}}
						   onClick={() => setChangeType(true)}>📝
							Changer le type</span>
						<span className="user-options" style={{color: "red"}}
							onClick={() => deleteUser(user[0], user[2])}>🗑️
							Supprimer</span>
					</div>
				</div>
				:
				<div>
					<div style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center"
					}}>
						<input type="radio" name='type' value='A' id='A'
						       onClick={(e) => setType(e.target.value)}
						       checked={type === 'A'}/>
						<label htmlFor='A'>Admin</label>
						<input type="radio" name='type' value='M' id='M'
						       onClick={(e) => setType(e.target.value)}
						       checked={type === 'M'}/>
						<label htmlFor='M'>Modérateur</label>
						<input type="radio" name='type' value='E' id='E'
						       onClick={(e) => setType(e.target.value)}
						       checked={type === 'E'}/>
						<label htmlFor='E'>Editeur</label>
						<input type="radio" name='type' value='S' id='S'
						       onClick={(e) => setType(e.target.value)}
						       checked={type === 'S'}/>
						<label htmlFor='S'>Créateur</label>
						<input type="radio" name='type' value='W' id='W'
						       onClick={(e) => setType(e.target.value)}
						       checked={type === 'W'}/>
						<label htmlFor='S'>Watcher</label>
					</div>
					<button onClick={() => {
						setChangeType(false);
						setType(user[3]);
					}}>Annuler
					</button>
					<button onClick={() => editType()}>Confirmer</button>
				</div>
			}


		</td>
	</tr>)
}

export default UserItem;