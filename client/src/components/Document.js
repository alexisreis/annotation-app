
const Document = ({data, setState}) => {
	return (<tr onClick={() => {
		setState({'documentId': data[0], 'image': true});
	}}>
		<td>{data[0]}</td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
	</tr>)
}

export default Document;