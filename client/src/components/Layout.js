import {Outlet,/* Link,*/ useNavigate} from "react-router-dom";
import logo from '../assets/folder.svg'
import '../styles/Layout.css'
import {UserContext} from "../utils/UserContext";
import {useContext} from "react";
import UserDropDownMenu from "./UserDropDownMenu";

const Layout = () => {
	// TODO : recuperer infos utilisateurpuis changer Layout
	const {user} = useContext(UserContext);

	const navigate = useNavigate();
	return (
		<>
			<div id="navbar-div" className="flex-column">
				<div className="flex-column" onClick={() => navigate('/')}>
					<img src={logo} alt='Logo'/>
					<h1 className="unselectable">ANNOTATION APP</h1>
				</div>


				{!user ?
					<nav>
						<ul className="flex-column">
							<li className="unselectable"
							    onClick={() => navigate('/login')}>
								SE CONNECTER
							</li>
						</ul>
					</nav> : <nav>
						<ul className="flex-column">
							<li className="unselectable"
							    onClick={() => navigate('/')}>
								ACCUEIL
							</li>
							<li className="unselectable"
							    onClick={() => navigate('/image')}>
								IMAGE
							</li>
							<UserDropDownMenu/>
						</ul>

					</nav>}

			</div>

			<Outlet/>
		</>
	)
};

export default Layout;
