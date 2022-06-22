import React, {useState} from 'react'
import UploadImage from "./components/UploadImage";

function App() {

	const [image, setImage] = useState()

  return (
        <div>
	        <UploadImage image={image} setImage={setImage}/>
		</div>
  )
}

export default App