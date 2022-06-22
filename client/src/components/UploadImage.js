import React, {useState} from 'react'

function UploadImage({image, setImage}) {

	const [oldImage, setOldImage] = useState();
	const [pathImage, setPathImage] = useState();
	const [isImproved, setIsImproved] = useState(false)

	const fileSelectedHandler = (event) => {
		// console.log(event.target.files[0]);
		if (image !== null) {
			URL.revokeObjectURL(image)
		}
		setImage(URL.createObjectURL(event.target.files[0]))
		setOldImage(null)
		setIsImproved(false)
		setPathImage(event.target.files[0])
	}

	const improveImage = async () => {
		if(!isImproved){
			// Create a FormData to POST to backend
			// const files = Array.from(event.target.files);
			const formData = new FormData();
			// formData.append("file", files[0]);
			formData.append("file", pathImage);

			const response = await fetch(`uploadImage`, {
				method: 'POST',
				body: formData,
				contentType: false,
				processData: false
			})

			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			setOldImage(image)
			setImage(url)
			setPathImage(blob)
			setIsImproved(true)
		} else {
			returnToBase()
		}

	}

	const returnToBase = () => {
		const pivot = oldImage;
		setOldImage(image);
		setImage(pivot);
	}


	return (
		<div>
			<input type="file" onChange={fileSelectedHandler}/>
			<br/>
			{image && !isImproved && <input type="button" onClick={improveImage} value="Ameliorer"/>}
			{image && isImproved && <input type="button" onClick={returnToBase} value="Revenir" />}
			<br/>
			{image && <img src={image} alt="Bonsoir" style={{width: "720px"}}/>}
		</div>
	)
}

export default UploadImage