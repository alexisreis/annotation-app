import {useNavigate} from "react-router-dom";
import ReactECharts from 'echarts-for-react'
import React, {useContext, useEffect, useState} from "react";
import {PageContext} from "../utils/PageContext";
import {colorSense} from "../utils/utils";
import "../styles/ImageItem.css"


const ImageItem = ({data}) => {

	const navigate = useNavigate();
	const {page, setPage} = useContext(PageContext);
	const [showGraph, setShowGraph] = useState(false);

	const options = {
/*		title: {
			text: data[0],
		},*/
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			height: '200px',
			top: '10%',
			left: '5%',
			right: '10%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			show: false,
		},
		yAxis: {
			type: 'category',
			data: ['Goût', 'Toucher', 'Odeur', 'Vue', 'Son'],
		},
		series: [
			{
				/*name: '',*/
				type: 'bar',
				data: [data[5], data[4], data[3], data[2], data[1]],
				itemStyle: {
					color: function (param) {
						return colorSense[param.name] || '#82c654';
					}
				},
				label: {
					show: true,
					precision: 1,
					position: 'right',
					valueAnimation: true,
					fontFamily: 'Quicksand'
				}
			}
		]
	};

	const [image, setImage] = useState(null);

	const fetchImage = async (image_id) => {
		const data = await fetch(`/getResizedImage/${page.document_cote}/${image_id}`, {headers: {'x-access-tokens': localStorage.getItem('token')},});
		const blob = await data.blob()
		const url = URL.createObjectURL(blob)
		setImage(url);
	}

	useEffect(() => {
		fetchImage(data[0])
	}, [data])

	return (
		<div className="image-div" onClick={() => {
			localStorage.setItem('image_id', data[0])
			setPage({
				page: 'image',
				image_id: data[0],
				document_cote: page.document_cote,
				document_name: page.document_name
			})
			navigate('image')
		}} onMouseEnter={() => setShowGraph(true)}
		     onMouseLeave={() => setShowGraph(false)}>
			<div className={"image-infos-div"}>
				<div style={{display: "flex", flexDirection: "column"}}>
					<span className="image-id-span">{data[0]}</span>
				</div>
				<div style={{display: "flex", flexDirection: "column"}}>
					<span className="sense-count-span">Sens notés : {data[1] + data[2] + data[3] + data[4] + data[5]}</span>
				</div>
			</div>

			<img src={image} alt="Previs" className={"image_previs"}
			     loading={"lazy"}/>

			<div className={"graph-div"}>
				{showGraph ?
					<ReactECharts option={options}/>
					: null}
			</div>

		</div>)
}

export default ImageItem;