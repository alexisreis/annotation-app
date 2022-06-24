import React, {useState, useRef, useEffect} from 'react';
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';

import rectLogo from "../assets/rectangle-tool.svg"
import polygonLogo from "../assets/polygon-tool.svg"
import printLogo from "../assets/text.svg"
import ImproveImage from "./ImproveImage";

let annotations = [];

function ImageAnno ({image, setImage, isImproved, setIsImproved, pathImage, setPathImage, oldImage, setOldImage }){
	// Ref to the image DOM element
	const imgEl = useRef();

	// The current ImageAnno instance
	const [ anno, setAnno ] = useState();

	// Current drawing tool name
	const [ tool, setTool ] = useState('rect');

	// const [annotations, setAnnotations] = useState([])
	console.log('ImageAnno')
	let annotorious = null;

	// Init ImageAnno when the component
	// mounts, and keep the current 'anno'
	// instance in the application state
	useEffect(() => {
		console.log('useEffect')
		if(image) {
			annotations = [];
			if (imgEl.current) {
				// Init
				annotorious = new Annotorious({
					image: imgEl.current,
					widgets: ["TAG", "COMMENT"],
				});

				/*				// Attach event handlers here
				 annotorious.on('createAnnotation', annotation => {
				 console.log('created', annotation);
				 });

				 annotorious.on('updateAnnotation', (annotation, previous) => {
				 console.log('updated', annotation, previous);
				 });

				 annotorious.on('deleteAnnotation', annotation => {
				 console.log('deleted', annotation);
				 });*/
				const storedAnnotation = getLocalAnnotations();
				if (storedAnnotation) {
					console.log('storedAnnotations', storedAnnotation)
					const theannotations = window.JSON.parse(storedAnnotation)
					// setAnnotations(theannotations)
					annotations = theannotations;
					annotorious.setAnnotations(annotations);

				}

				annotorious.on('createAnnotation', (annotation) => {
					console.log('annotations', annotations)
					console.log('annotation', annotation)
					// const newAnnotations = [...annotations, annotation];
					// console.log('newAnnotations', newAnnotations);
					// setAnnotations(newAnnotations)
					annotations = [...annotations, annotation]
					//setLocalAnnotation(newAnnotations)
					setLocalAnnotation(annotations)
				});

				annotorious.on('updateAnnotation', (annotation, previous) => {
					console.log('update')
					const newAnnotations = annotations.map(val => {
						if (val.id === annotation.id) return annotation
						return val
					})
					// setAnnotations(newAnnotations)
					// setLocalAnnotation(newAnnotations)
					annotations = newAnnotations;
					setLocalAnnotation(annotations);
				});

				annotorious.on('deleteAnnotation', (annotation) => {
					console.log('delete')
					const newAnnotations  = annotations.filter(val => val.id !== annotation.id)
					// setAnnotations(newAnnotations)
					// setLocalAnnotation(newAnnotations)
					annotations = newAnnotations;
					setLocalAnnotation(annotations);
				});
				// Keep current ImageAnno instance in state
				setAnno(annotorious);
			}
			// Cleanup: destroy current instance
			return () => annotorious.destroy();
		}

	}, [image]);

	// Toggles current tool + button label
	const toggleTool = () => {
		if (tool === 'rect') {
			setTool('polygon');
			anno.setDrawingTool('polygon');
		} else {
			setTool('rect');
			anno.setDrawingTool('rect');
		}
	}

	const getLocalAnnotations =  () => {
		return localStorage.getItem(pathImage.name)
	}

	const setLocalAnnotation = (newAnnotations) => {
		localStorage.setItem(pathImage.name, JSON.stringify(newAnnotations))
	}

	const printAnnotations = () => {
		console.log(annotations);
	}


	return (
		<div>
			{image && <div style={{display: "flex",  flexDirection: "row"}}>
				<div style={{display: "flex",  flexDirection: "column"}}>
					<ImproveImage image={image} setImage={setImage}
					              isImproved={isImproved} setIsImproved={setIsImproved}
					              oldImage={oldImage} setOldImage={setOldImage} pathImage={pathImage} setPathImage={setPathImage}/>
					<button
						onClick={tool !== 'rect' ? toggleTool : null}>
						<img src={rectLogo} height="40" width="40" title="Rectangle box"/>
					</button>

					<button
						onClick={tool !== 'polygon' ? toggleTool : null}>
						<img src={polygonLogo} height="40" width="40" title="Polygon box"/>
					</button>
					<button onClick={printAnnotations}>
						<img src={printLogo} height="40" width="40" title="Print annotations"/>
					</button>
				</div>




				<img
				ref={imgEl}
				src={image}
				alt="Image to annotate"
				style={{maxWidth: "75vw", maxHeight: "75vh", border: "1px" +
						" black solid"}}

				/> </div>}

		</div>
	);
}

export default ImageAnno;