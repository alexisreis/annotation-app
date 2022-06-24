import React, {useState} from 'react'
import UploadImage from "./components/UploadImage";
import ImageAnno from "./components/ImageAnno";
import ImproveImage from "./components/ImproveImage";

function App() {

	const [image, setImage] = useState()
	const [pathImage, setPathImage] = useState()
	const [isImproved, setIsImproved] = useState(false)
	const [oldImage, setOldImage] = useState();

	return (
		<div>
			<UploadImage image={image} setImage={setImage}
			             setPathImage={setPathImage}
			             setIsImproved={setIsImproved}
			             setOldImage={setOldImage}/>

			{/*  <ImageAnno image={image}/>*/}
			<ImageAnno image={image} setImage={setImage}
			           isImproved={isImproved} setIsImproved={setIsImproved}
			           oldImage={oldImage} setOldImage={setOldImage} pathImage={pathImage} setPathImage={setPathImage}/>
		</div>
	)
}

export default App