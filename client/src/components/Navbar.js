import React, {useContext} from "react"
import logo from "../assets/folder.svg";
import UserDropDownMenu from "./UserDropDownMenu";
import {UserContext} from "../utils/UserContext";
import {PageContext} from "../utils/PageContext";
import {useNavigate} from "react-router-dom";
import "../styles/Layout.css"

const Navbar = () => {

	const {user} = useContext(UserContext);
	const {page, setPage} = useContext(PageContext);

	const navigate = useNavigate();

	return (
		<div id="navbar-div" className="flex-column">
			<div id="navbar-title" className="flex-column" onClick={() => {
				if (!page) {
					setPage({page: 'home'})
				} else if (page.document_cote && page.image_id) {
					setPage({
						page: 'home',
						document_cote: page.document_cote,
						document_name: page.document_name,
						document_date: page.document_date,
						image_id: page.image_id
					})
				} else if (page.document_cote && !page.image_id) {
					setPage({
						page: 'home',
						document_cote: page.document_cote,
						document_name: page.document_name,
						document_date: page.document_date
					})
				}
				navigate('/')
			}}>
				<img src={logo} alt='Logo'/>
				<h1 className="unselectable">annotation-app</h1>
			</div>


			{!user ?
				<nav>
					<div className="flex-column">
						<div className="unselectable link"
						    id="sign-up-button"
						    onClick={() => navigate('/signup')}>
							Créer un compte
						</div>
						<div className="unselectable"
						    id="login-button"
						    onClick={() => navigate('/login')}>
							SE CONNECTER
						</div>
					</div>
				</nav> : <nav>
					<div className="flex-column">
						<UserDropDownMenu/>
					</div>

				</nav>}

		</div>)
}

export default Navbar;