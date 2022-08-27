import React from "react"
import "../styles/Footer.css"
import {useNavigate} from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();
	return (
		<div className="footer-div">
			<span>Développé par Alexis Reis - 2022 </span>
			<a className="link" onClick={() => navigate('/credits')}>Crédits</a>
		</div>
	)
}

export default Footer;