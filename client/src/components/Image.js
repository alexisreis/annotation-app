import {useNavigate} from "react-router-dom";

const Image = ({data}) => {

	const navigate = useNavigate();

	return (<tr onClick={() => {
		navigate('image')
	}}>
		<td>{data[0]}</td>
	</tr>)
}

export default Image;