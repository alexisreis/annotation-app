import React, {useContext, useEffect} from "react"
import {PageContext} from "../utils/PageContext";

import '../styles/PathBar.css'
import {useNavigate} from "react-router-dom";

function PathBar() {

	const {page, setPage} = useContext(PageContext)
	const navigate = useNavigate()

	const goToHome = () => {
		if (!page) {
			setPage({page: 'home'})
		} else if (page.document_cote && page.image_id) {
			setPage({
				page: 'home',
				document_cote: page.document_cote,
				document_name: page.document_name,
				image_id: page.image_id
			})
		} else if (page.document_cote && !page.image_id) {
			setPage({
				page: 'home',
				document_cote: page.document_cote,
				document_name: page.document_name,
			})
		}
		navigate('/')
	}

	const goToDocument = () => {
		if(page.page !== 'document' && page.document_cote && page.document_name && page.image_id){
			setPage({
				page: 'document',
				document_cote: page.document_cote,
				document_name: page.document_name,
				image_id: page.image_id
			})
			navigate('document')
		}
	}

	return (
		<div id={"pathbar"}>
			<div className={"pathbar-element"} onClick={goToHome}>
				<h2>Mon projet {' >'}</h2>
			</div>
			{page && (page.page === 'document' || page.page === 'image') ?
				<div className={"pathbar-element"} onClick={goToDocument}>
					<h2>Document {' >'}</h2>
					<span>{page.document_cote}</span>
					<span>{page.document_name.substr(0, 15)}</span>
				</div> : null}
			{page && page.page === 'image' ?
				<div className={"pathbar-element"}>
					<h2>Image</h2>
					<span>{page.image_id}</span>
				</div> : null}
		</div>)
}

export default PathBar;