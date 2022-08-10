import {useContext} from "react";
import {PageContext} from "../utils/PageContext";
import {useNavigate} from "react-router-dom";

const DocumentItem = ({data}) => {

	const {setPage} = useContext(PageContext);
	const navigate = useNavigate();

	return (<tr onClick={() => {
		setPage({
			page: 'document',
			document_cote: data[0],
			document_name: data[1]
		});
		navigate('document')
	}}>
		<td>{data[0]}</td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
	</tr>)
}

export default DocumentItem;