import '../styles/App.css';
import DocumentList from "../components/DocumentList";
import ImageList from "../components/ImageList";
import {disconnect, verifyAuthentication} from "../utils/utils";
import {useState} from "react";


function Home() {

	const [state, setState] = useState({'image': false});
	return (
		<div id="home-div">
			<h1>Bienvenue {localStorage.getItem('user_name')},</h1>
			<br/>
			<button onClick={() => disconnect()}>Se déconnecter</button>
			<button onClick={() => verifyAuthentication()}>Vérifier authentification</button>
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

export default Home;
