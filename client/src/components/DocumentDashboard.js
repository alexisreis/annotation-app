import React from "react"
import ReactECharts from 'echarts-for-react'
import TranscriptionTab from "./TranscriptionTab";
import "../styles/DocumentDashboard.css"
import {colorSense} from "../utils/utils";


const DocumentDashboard = ({senseStats, transcriptions}) => {

	const option = senseStats ? {
		/*backgroundColor: '#fff',*/
		title: {
			text: 'Répartition des sens',
			left: 'center',
			top: 20,
			textStyle: {
				color: '#000'
			}
		},
		tooltip: {
			trigger: 'item'
		},
		grid: {
			height: '200px',
			containLabel: true
		},
		series: [
			{
				name: 'Sens',
				type: 'pie',
				radius: '55%',
				center: ['50%', '50%'],
				data: [
					{value: senseStats[0], name: 'Son',},
					{value: senseStats[1], name: 'Vue'},
					{value: senseStats[2], name: 'Odeur'},
					{value: senseStats[3], name: 'Toucher'},
					{value: senseStats[4], name: 'Goût'}
				].sort(function (a, b) {
					return a.value - b.value;
				}),
				itemStyle: {
					color: function (param) {
						return colorSense[param.name] || '#82c654';
					},
					shadowBlur: 20,
					shadowColor: 'rgba(0, 0, 0, 0.2)'
				},
				roseType: 'radius',
				label: {
					color: 'rgba(0, 0, 0, 0.7)',
				},
				labelLine: {
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.7)'
					},
					smooth: 0.2,
					length: 10,
					length2: 20
				},
			}
		]
	} : null;

	return (
		<div className="document-dashboard">
			<h3>📊 Statistiques</h3>
			<hr/>
			<div className={"document-stats-div"}>
				{senseStats && senseStats.length > 0 ?
					<div className={"document-graph-div"}>
						<ReactECharts option={option}/>
					</div>:
					null}
				{transcriptions && transcriptions.length > 0 ?
					<TranscriptionTab transcriptions={transcriptions}/> :
					null}
			</div>
		</div>)
}

export default DocumentDashboard;