import React from 'react'
import ImageItem from "./ImageItem";

const ImageList = ({images}) => {

	return (
	<div>
		{images && images.length ?
			<div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
				{images.sort((a, b) => a[0] - b[0])
					.map((doc, i) =>
					<ImageItem key={i} data={doc}/>
				)}
			</div>
			 : <span>Ce document ne continent pas de pages...</span>}
	</div>)
}

export default ImageList;