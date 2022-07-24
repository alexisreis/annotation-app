import { Outlet, Link } from "react-router-dom";

const Layout = () => {

	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/image">Image</Link>
					</li>
					<li>
						<Link to="/login">Login</Link>
					</li>
				</ul>
			</nav>
			<Outlet />
		</>
	)
};

export default Layout;
