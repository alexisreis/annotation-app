import '../styles/App.css';

function AnnotoriousViewer() {

	return (
		<div className="App">
			<header className="App-header">
				<input type="file" id="file" accept="image/png, image/jpeg"/>
				<button id="improve-image-button">Améliorer l'image</button>
				<button id="export-json-button">Exporter JSON</button>
				<div id="my-toolbar-container"/>
				<img id="my-image" width="100%" alt='To annotate'/>
			</header>
		</div>
	);
}

export default AnnotoriousViewer;
