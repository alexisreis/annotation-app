import '../styles/App.css';
import React from "react";
import {useNavigate} from "react-router-dom";
import error404 from "../assets/404.svg"

function Error404() {
	const navigate = useNavigate();
	return (
		<div className="App">
			<h1>Erreur 404</h1>
			<p>Cette page n'existe pas...</p>
			<a className="link" onClick={() => navigate('/')}>Retourner à la page d'accueil</a>
			<img src={error404} alt={"Error 404"}/>
		</div>
	);
}

export default Error404;
