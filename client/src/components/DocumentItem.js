
const DocumentItem = ({data, setState}) => {
	return (<tr onClick={() => {
		setState({'document_cote': data[0], 'document_name': data[1], 'image': true});
	}}>
		<td>{data[0]}</td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
	</tr>)
}

export default DocumentItem;