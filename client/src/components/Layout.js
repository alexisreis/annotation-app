import {Outlet, Link, useNavigate} from "react-router-dom";
import logo from '../assets/logo.png'
import '../styles/Layout.css'

const Layout = () => {
	// TODO : recuperer infos utilisateur dans redux puis changer Layout

	const navigate = useNavigate();
	return (
		<>
			<div id="navbar-div" className="flex-column">
				<div className="flex-column" onClick={() => navigate('/')}>
					<img src={logo} alt='Logo'/>
					<h1>ANNOTATION APP</h1>
				</div>
				<nav>
					<ul className="flex-column">
						<li onClick={() => navigate('/')}>
							ACCUEIL
						</li>
						<li onClick={() => navigate('/image')}>
							IMAGE
						</li>
						<li onClick={() => navigate('/login')}>
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
