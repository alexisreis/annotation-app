import '../styles/App.css';
import DocumentList from "../components/DocumentList";
import ImageList from "../components/ImageList";
import {useState, useContext} from "react";
import {UserContext} from "../utils/UserContext";


function HomeClient() {

	const [state, setState] = useState({'image': false});
	const {user, setUser} = useContext(UserContext);

	return (
		<div id="home-div">
			<h1>Bienvenue {user.name},</h1>
			<br/>
			{/*TODO: TABBAR*/}
			{!state.image ?
				<DocumentList setState={setState}/>
				:
				<ImageList state={state} setState={setState} />
			}
		</div>
	);
}

export default HomeClient;
