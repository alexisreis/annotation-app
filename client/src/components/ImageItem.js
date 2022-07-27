import {useNavigate} from "react-router-dom";
import ReactECharts from 'echarts-for-react'

const colorSense = {
	Son: '#19ff00',
	Vue: '#00e0ff',
	Odeur: '#a8482c',
	Toucher: '#fff200',
	Goût: '#ff00ae'
}


const ImageItem = ({data}) => {

	const navigate = useNavigate();

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

	return (
		<tr onClick={() => {
		navigate('image')
	}}>
		<td>{data[0]}</td>
		<td>
			<ReactECharts option={options} />
		</td>

	</tr>)
}

export default ImageItem;