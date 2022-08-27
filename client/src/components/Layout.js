import {Outlet,/* Link,*/ useNavigate} from "react-router-dom";
import logo from '../assets/folder.svg'
import '../styles/Layout.css'
import {UserContext} from "../utils/UserContext";
import {useContext} from "react";
import UserDropDownMenu from "./UserDropDownMenu";
import PathBar from "./PathBar";
import {PageContext} from "../utils/PageContext";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {

	const {user} = useContext(UserContext);

	return (
		<>
			<Navbar />
			{user ? <div>
				<PathBar/>
			</div> : null}
			<Outlet/>
			<Footer />
		</>
	)
};

export default Layout;
