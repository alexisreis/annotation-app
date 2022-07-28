import {useContext, useState} from "react";
import {UserContext} from "../utils/UserContext";
import signOut from '../assets/sign-out.svg'
import arrow from '../assets/arrow-down-sign-to-navigate.svg'

import '../styles/UserDropDownMenu.css'
import {disconnect} from "../utils/utils";

function UserDropDownMenu(){
	const {user, setUser} = useContext(UserContext);
	const [open, setOpen] = useState(false);

	return(<div>
		<div id="user-menu-div" className="flex-column" onClick={() => setOpen(!open)}>
			<span id="user-name-span" className="unselectable">{user.name}</span>
			<img id="user-menu-arrow" src={arrow} className={open ? 'user-menu-arrow-reverted' : ''}/>
			<div id="user-pic-div" className={`user-pic-div-${user.type}`}>
				👤
			</div>
		</div>
		{open ?
			<div className={"dropdown"} onClick={() => setOpen(false)}>
				<div className={"menu-item"} onClick={() => disconnect(setUser)}>
					<img className={"menu-item-svg"} src={signOut}/>
					<span>Se déconnecter</span>
				</div>
			</div> : null}
	</div>)
}

export default UserDropDownMenu;