import {useNavigate} from "react-router-dom";

const Image = ({data}) => {

	const navigate = useNavigate();

	return (<tr onClick={() => {
		navigate('image')
	}}>
		<td>{data[0]}</td>
		<td>{data[1]}</td>
		<td>{data[2]}</td>
		<td>{data[3]}</td>
		<td>{data[4]}</td>
		<td>{data[5]}</td>
	</tr>)
}

export default Image;