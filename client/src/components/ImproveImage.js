import React, {useState} from 'react'
import improveLogo from "../assets/sparks.svg";

function ImproveImage({
	                      image,
	                      setImage,
	                      isImproved,
	                      setIsImproved,
	                      oldImage,
	                      setOldImage,
	                      pathImage,
	                      // setPathImage
                      }) {

	const improveImage = async () => {
		if (!isImproved) {
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
			// setPathImage(blob)
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


	return (<div>{image && !isImproved &&

		<button onClick={improveImage} title="Improve the image">
			<img src={improveLogo} height="40" width="40" alt="Improve the image"/>
		</button>}
		{image && isImproved && <button onClick={returnToBase}
		                                title="Return to the original image">
			<img src={improveLogo} height="40" width="40" alt="Return to original image"/>
		</button>}</div>)
}

export default ImproveImage;