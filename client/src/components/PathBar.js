import React, {useContext} from "react"
import {PageContext} from "../utils/PageContext";

import '../styles/PathBar.css'
import {useNavigate} from "react-router-dom";

function PathBar() {

	const {page, setPage} = useContext(PageContext)
	const navigate = useNavigate()

	const goToHome = () => {
		if(page.page === 'image'){
			navigate('/')
		}

		if(page && page.page !== 'home'){
			setPage({page: 'home'})
		}
	}

	const goToDocument = () => {
		if(page.page === 'image'){
			navigate('/')
		}

		if(page.page !== 'document'){
			setPage({
				page: 'document',
				document_cote: page.document_cote,
				document_name: page.document_name
			})
		}
	}
	return (
		<div id={"pathbar"}>
			<div className={"pathbar-element"} onClick={goToHome}>
				<h2>Mon projet {' >'}</h2>
			</div>
			{page && (page.page == 'document' || page.page == 'image') ?
				<div className={"pathbar-element"} onClick={goToDocument}>
					<h2>Document {' >'}</h2>
					<span>{page.document_cote}</span>
				</div> : null}
			{page && page.page == 'image' ?
				<div className={"pathbar-element"}>
					<h2>Image</h2>
					<span>{page.image_id}</span>
				</div> : null}
		</div>)
}

export default PathBar;