import {useContext, useState} from "react";
import {UserContext} from "../utils/UserContext";
import signOut from '../assets/sign-out.svg'
import arrow from '../assets/arrow-down-sign-to-navigate.svg'

import '../styles/UserDropDownMenu.css'
import {useNavigate} from "react-router-dom";
import {PageContext} from "../utils/PageContext";

function UserDropDownMenu() {
	const {user, setUser} = useContext(UserContext);
	const {setPage} = useContext(PageContext);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const disconnect = () => {
		if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
			localStorage.removeItem('token');
			setUser(null);
			setPage(null);
			navigate('/');
		}
	}

	return (<div>
		<div id="user-menu-div" className="flex-column"
		     onClick={() => setOpen(!open)}>
			<span id="user-name-span"
			      className="unselectable">{user.name}</span>
			<img id="user-menu-arrow" src={arrow}
			     className={open ? 'user-menu-arrow-reverted' : ''}/>
			<div id="user-pic-div" className={`user-pic-div-${user.type}`}>
				👤
			</div>
		</div>
		{open ?
			<div className={"dropdown"} onClick={() => setOpen(false)}>
				<div className={"menu-item"}
				     onClick={() => disconnect()}>
					<img className={"menu-item-svg"} src={signOut}/>
					<span>Se déconnecter</span>
				</div>
				{user.type === 'A' ?
					<div className={"menu-item"}
					     onClick={() =>  navigate("/admin")}>
						<img className={"menu-item-svg"} src={signOut}/>
						<span>Dashboard (admin)</span>
					</div> : null}
			</div> : null}
	</div>)
}

export default UserDropDownMenu;