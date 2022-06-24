import React, {useState} from 'react'

function UploadImage({image, setImage, setPathImage, setIsImproved, setOldImage}) {


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

	return (
		<div>
			<input type="file" onChange={fileSelectedHandler}/>
			<br/>
			{/*{image && <img src={image} alt="Bonsoir" style={{width: "720px"}}/>}*/}
		</div>
	)
}

export default UploadImage