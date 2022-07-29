import '../styles/App.css';
import DocumentList from "../components/DocumentList";
import ImageList from "../components/ImageList";
import {useState, useContext} from "react";
import {UserContext} from "../utils/UserContext";
import {PageContext} from "../utils/PageContext";


function HomeClient() {

	const [state, setState] = useState({'image': false});
	const {user, setUser} = useContext(UserContext);
	const {page, setPage} = useContext(PageContext)

	return (
		<div id="home-div">
			<h1>Bienvenue {user.name},</h1>
			<br/>
			{/*TODO: TABBAR*/}
			{!page || page.page == 'home' ?
				<DocumentList/>
				: null}
			{page && page.page == 'document' ?
				<ImageList state={state} setState={setState} />
				: null}
		</div>
	);
}

export default HomeClient;
