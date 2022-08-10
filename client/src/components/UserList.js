import React from 'react'

const UserList = ({users}) => {

	return (<div>

		{users ? <table>
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
				.map((doc, i) =>
					<tr>
						<td>{doc[0]}</td>
						<td>{doc[1]}</td>
						<td>{doc[2]}</td>
						<td>{doc[3]}</td>
					</tr>
				)}
			</tbody>

		</table> : <span>Aucun utilisateur...</span>}
	</div>)
}

export default UserList;