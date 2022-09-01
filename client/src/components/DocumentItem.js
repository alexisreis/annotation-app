import React, {useContext} from "react";
import {PageContext} from "../utils/PageContext";
import {useNavigate} from "react-router-dom";

const DocumentItem = ({data}) => {

	const {setPage} = useContext(PageContext);
	const navigate = useNavigate();

	return (<tr onClick={() => {
		setPage({
			page: 'document',
			document_cote: data[0],
			document_name: data[1],
			document_date: data[2]
		});
		navigate('document')
	}}>
		<td><span className="doc-id-span">{data[0]}</span></td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
	</tr>)
}

export default DocumentItem;