import '../styles/App.css';
import img from '../assets/id.jpg'

function AnnotoriousViewer() {
	return (
		<div className="App">
			<header className="App-header">
				<div id="my-toolbar-container"/>
				<img id="my-image" width="100%" src={img} alt='To annotate'/>
			</header>
		</div>
	);
}

export default AnnotoriousViewer;
