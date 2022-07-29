import {useContext} from "react";
import {PageContext} from "../utils/PageContext";

const DocumentItem = ({data, setState}) => {

	const {page, setPage} = useContext(PageContext);

	return (<tr onClick={() => {
		setPage({page: 'document', document_cote: data[0], document_name: data[1]});
	}}>
		<td>{data[0]}</td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
	</tr>)
}

export default DocumentItem;