import {Outlet,/* Link,*/ useNavigate} from "react-router-dom";
import logo from '../assets/folder.svg'
import '../styles/Layout.css'
import {UserContext} from "../utils/UserContext";
import {useContext} from "react";
import UserDropDownMenu from "./UserDropDownMenu";
import PathBar from "./PathBar";
import {PageContext} from "../utils/PageContext";

const Layout = () => {

	const {user} = useContext(UserContext);
	const {page, setPage} = useContext(PageContext);

	const navigate = useNavigate();
	return (
		<>
			<div id="navbar-div" className="flex-column">
				<div className="flex-column" onClick={() => {
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
				}}>
					<img src={logo} alt='Logo'/>
					<h1 className="unselectable">ANNOTATION APP</h1>
				</div>


				{!user ?
					<nav>
						<ul className="flex-column">
							<li className="unselectable"
							    id="sign-up-button"
							    onClick={() => navigate('/signup')}>
								Créer un compte
							</li>
							<li className="unselectable"
							    id="login-button"
							    onClick={() => navigate('/login')}>
								SE CONNECTER
							</li>
						</ul>
					</nav> : <nav>
						<div className="flex-column">
							<UserDropDownMenu/>
						</div>

					</nav>}

			</div>
			{user ? <div>
				<PathBar/>
			</div> : null}
			<Outlet/>
		</>
	)
};

export default Layout;
