import React, {useMemo, useState, useEffect} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AnnotoriousViewer from "./pages/AnnotoriousViewer";
import Login from "./pages/Login";
import {UserContext} from "./utils/UserContext";
import {PageContext} from "./utils/PageContext";
import AdminDashboard from "./pages/AdminDashboard";
import DocumentPage from "./pages/DocumentPage";
import SignUp from "./pages/SignUp";

function App(){

	const [user, setUser] = useState(null);
	const userProvider = useMemo(() => ({user, setUser}), [user, setUser])

	const [page, setPage] = useState({page: 'home'})
	const pageProvider = useMemo(() => ({page, setPage}), [page, setPage])

	useEffect(() => {
		if(localStorage.getItem('token')){
			const data = JSON.parse(
				atob(localStorage.getItem('token').substring(
					localStorage.getItem('token').indexOf(".") + 1,
					localStorage.getItem('token').lastIndexOf(".")
				)));
			setUser({
				name: data["user_name"],
				type: data["user_type"],
			})
		}
	}, [])

	return(
		<UserContext.Provider value={userProvider}>
			<PageContext.Provider value={pageProvider}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path="document" element={<DocumentPage />} />
							<Route path="document/image" element={<AnnotoriousViewer />} />
							<Route path="login" element={<Login />} />
							<Route path="signup" element={<SignUp />} />
							<Route path="admin" element={<AdminDashboard />} />
							<Route path="*" element={<h1>404</h1>} />
						</Route>
					</Routes>
				</BrowserRouter>
			</PageContext.Provider>
		</UserContext.Provider>

	)
}

export default App