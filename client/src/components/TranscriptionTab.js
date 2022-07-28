
const TranscriptionTab = ({transcriptions}) => {
	return (
		<div>
			{transcriptions.length ?
				<table>
					<thead>
					<tr>
						<th>mot</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{transcriptions.map((transcription, i) =>
						<tr key={i}>
							<td>{transcription[0]}</td>
							<td>{transcription[1]}</td>
						</tr>
					)}
					</tbody>
				</table> : null
			}
		</div>
	)
}

export default TranscriptionTab