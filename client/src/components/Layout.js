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
					console.log(page.page)
					if(page && page.page === 'image'){
						navigate('/')
					}

					if(page && page.page !== 'home'){
						setPage({page: 'home'})
					}
				}}>
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
						<div className="flex-column">
							<UserDropDownMenu/>
						</div>

					</nav>}

			</div>
			{user ? <div>
				<PathBar />
			</div> : null}
			<Outlet/>
		</>
	)
};

export default Layout;
