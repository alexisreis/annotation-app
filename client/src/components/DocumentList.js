import React, {useState, useEffect} from 'react'
import DocumentItem from "./DocumentItem";

const DocumentList = ({documents}) => {

	// TODO : enlever ça
	const [displayedDocuments, setDisplayedDocument] = useState([]);

	useEffect(() => {
		setDisplayedDocument(documents);
	}, [documents]);

	const search = (title) => {
		if (title !== '') {
			setDisplayedDocument(documents.filter(
				d => d[0].toLowerCase().includes(title.toLowerCase())
					|| d[1].toLowerCase().includes(title.toLowerCase())
					|| d[2].toString().includes(title)
			));
		}
	}

	return (<div>
		<input type="text" onChange={e => search(e.target.value)}
		       id={"document-search-bar"}
		       placeholder={"Rechercher un titre, une date, une cote..."}/>

		{displayedDocuments && displayedDocuments.length > 0 ? <table>
			<thead>
			<tr>
				<th>cote</th>
				<th>titre</th>
				<th>date</th>
			</tr>
			</thead>
			<tbody>
			{displayedDocuments.sort((a, b) => a[0] - b[0])
				.map((doc, i) =>
					<DocumentItem key={i} data={doc}/>
				)}
			</tbody>

		</table> : <span>Aucun document ne correspond</span>}
	</div>)
}

export default DocumentList;