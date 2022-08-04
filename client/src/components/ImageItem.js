import {useNavigate} from "react-router-dom";
import ReactECharts from 'echarts-for-react'
import React, {useContext, useEffect, useState} from "react";
import {PageContext} from "../utils/PageContext";

const colorSense = {
	Son: '#19ff00',
	Vue: '#00e0ff',
	Odeur: '#a8482c',
	Toucher: '#fff200',
	Goût: '#ff00ae'
}


const ImageItem = ({data}) => {

	const navigate = useNavigate();
	const {page, setPage} = useContext(PageContext);

	const options = {
		title: {
			text: ''
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			/*			height: '100px',*/
			top: '0%',
			left: '0%',
			right: '10%',
			bottom: '0%',
			containLabel: true
		},
		media: [{
			query: {
				height: '150px'
			}
		}],
		xAxis: {
			type: 'value',
		},
		yAxis: {
			type: 'category',
			data: ['Son', 'Vue', 'Odeur', 'Toucher', 'Goût'],
		},
		series: [
			{
				name: '',
				type: 'bar',
				data: [data[1], data[2], data[3], data[4], data[5]],
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
					fontFamily: 'monospace'
				}
			}
		]
	};

	const [image, setImage] = useState(null);

	const fetchImage = async () => {
		const data = await fetch('/get/1/resized');
		const blob = await data.blob()
		const url = URL.createObjectURL(blob)
		setImage(url);
	}

	useEffect(() => {
		fetchImage()
	}, [])

	return (
		<tr onClick={() => {
			setPage({
				page: 'image',
				image_id: data[0],
				document_cote: page.document_cote,
				document_name: page.document_name
			})
			navigate('image')
		}}>
			<td>{data[0]}</td>
			<td><img src={image} alt="Previs"/></td>
			<td>
				<ReactECharts option={options}/>
			</td>

		</tr>)
}

export default ImageItem;