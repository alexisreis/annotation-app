import "../styles/Presentation.css"
import teamWork from "../assets/Team work.svg"
import dataProcessing from "../assets/Data processing.svg"

function Presentation() {

	return (
		<div className="App presentation-div">
			<h1>Bienvenue sur</h1>
				<h1>📝 <span className="span-blue">annotation-app</span>!</h1>
			<div className="presentation-section">
                <img className="presentation-illustration" src={teamWork} alt="Annotez vos images"/>
				<div className="presentation-explication">
					<h3>📝 Annotez vos manuscrits</h3>
					<p>Sélectionnez un ou plusieurs mot(s) sur une page et entrez</p>
					<ul>
						<li>les informations liées à la <span>sensorialité</span> (mot relatif au son, à l'odorat...)</li>
						<li>la <span>transcription</span> du mot</li>
					</ul>
				</div>
			</div>
			<hr/>
			<div className="presentation-section">
                <div className="presentation-explication">
	                <h3>🔎 Retrouvez facilement une information</h3>
                    <p>Retrouvez facilement les documents les plus relatifs à un sens, où un certain mot apparait... avec les annotations.</p></div>
                <img className="presentation-illustration" src={dataProcessing} alt="Annotez vos images"/>
			</div>
		</div>
	);
}

export default Presentation;
