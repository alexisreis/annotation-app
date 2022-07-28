import React, {useMemo, useState} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AnnotoriousViewer from "./pages/AnnotoriousViewer";
import Login from "./pages/Login";
import Test from "./pages/Test";
import {UserContext} from "./utils/UserContext";

function App(){

	const [user, setUser] = useState(null);
	const userprovider = useMemo(() => ({user, setUser}), [user, setUser])

	return(
		<UserContext.Provider value={userprovider}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path="image" element={<AnnotoriousViewer />} />
						<Route path="login" element={<Login />} />
						<Route path="test" element={<Test />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</UserContext.Provider>

	)
}

export default App