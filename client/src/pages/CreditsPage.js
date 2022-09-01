import '../styles/CreditsPage.css';

function CreditsPage() {

	return (
		<div className="App credits">
			<h1>‍💻 Crédits</h1>
			<p>Application développée de juin à août 2022 par <span className="span-blue">Alexis Reis</span></p>
			<div>
				<hr/>
				<h4>📚 Librairies :</h4>
				<ul>
					<li><a
						href="https://github.com/recogito/annotorious">Annotorious</a> de
						Simon Rainer
					</li>
				</ul>
				<hr/>
			</div>

			<h4>📸 Crédits photos :</h4>
			<ul>
				<li>Icônes : <a
					href="https://www.flaticon.com/">Flaticon.com</a></li>
				<li>Illustrations : <a
					href="https://www.manypixels.co/gallery">Manypixels.co</a>
				</li>
			</ul>

		</div>
	);
}

export default CreditsPage;
