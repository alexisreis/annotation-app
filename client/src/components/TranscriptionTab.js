import '../styles/TranscriptionTab.css'

const TranscriptionTab = ({transcriptions}) => {
	return (
		<div className={"transcription-tab flex-center"}>
			<span>Mots les plus transcrits</span>
			{transcriptions.length ?
				<ul>
					{transcriptions.map((transcription, i) =>
						<li key={i}>{transcription[0] + '     '}{transcription[1]}</li>
					)}
				</ul> : null
			}
		</div>
	)
}

export default TranscriptionTab