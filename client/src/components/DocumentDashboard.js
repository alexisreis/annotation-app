import React, {useContext, useEffect, useState} from "react"
import ReactECharts from 'echarts-for-react'
import TranscriptionTab from "./TranscriptionTab";
import {PageContext} from "../utils/PageContext";

const colorSense = {
	Son: '#19ff00',
	Vue: '#00e0ff',
	Odeur: '#a8482c',
	Toucher: '#fff200',
	Goût: '#ff00ae'
}

const DocumentDashboard = ({senseStats}) => {

	const option = {
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
		series: [
			{
				name: 'Sens',
				type: 'pie',
				radius: '55%',
				center: ['50%', '50%'],
				data: [
					{ value: senseStats[0], name: 'Son',},
					{ value: senseStats[1], name: 'Vue' },
					{ value: senseStats[2], name: 'Odeur' },
					{ value: senseStats[3], name: 'Toucher' },
					{ value: senseStats[4], name: 'Goût' }
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
	};
	const {page} = useContext(PageContext);

	const [transcriptions, setTranscriptions] = useState([]);

	const fetchTranscriptions = async () => {
		if(page.document_cote){
			await fetch('getMostTranscribed/' + page.document_cote, {
				method: 'GET',
				headers: {'x-access-tokens': localStorage.getItem('token')}
			}).then((response) => response.json())
				.then((img) => {
					// Token is invalid or user is not logged in
					if (img.missing || img.invalid) {
						alert("Erreur: Utilisateur non connecté");
					}
					else if (img.storage) {
						alert("Pas de transcriptions");
					} else if (!img.success) {
						alert('Erreur - transcriptions')
					}
					setTranscriptions(img)
				}).catch(console.error)
		}
	}

	useEffect(() => {
		fetchTranscriptions()
			.catch(console.error);
	}, [])

	return (
		<div className="document-dashboard">
			<h3>{page.document_name}</h3>
			<ReactECharts option={option}/>
			<TranscriptionTab transcriptions={transcriptions}/>
		</div>)
}

export default DocumentDashboard;