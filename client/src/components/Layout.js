import {Outlet,/* Link,*/ useNavigate} from "react-router-dom";
import logo from '../assets/folder.svg'
import '../styles/Layout.css'

const Layout = () => {
	// TODO : recuperer infos utilisateur dans redux puis changer Layout

	const navigate = useNavigate();
	return (
		<>
			<div id="navbar-div" className="flex-column">
				<div className="flex-column" onClick={() => navigate('/')}>
					<img src={logo} alt='Logo'/>
					<h1 className="unselectable">ANNOTATION APP</h1>
				</div>
				<nav>
					<ul className="flex-column">
						<li className="unselectable" onClick={() => navigate('/')}>
							ACCUEIL
						</li>
						<li className="unselectable" onClick={() => navigate('/image')}>
							IMAGE
						</li>
						<li className="unselectable" onClick={() => navigate('/login')}>
							SE CONNECTER
						</li>
					</ul>
				</nav>
			</div>

			<Outlet />
		</>
	)
};

export default Layout;
