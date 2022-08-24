import '../styles/App.css';
import HomeClient from "./HomeClient";
import {useContext} from "react";
import {UserContext} from "../utils/UserContext";
import Presentation from "./Presentation";

function HomePage() {
    const {user} = useContext(UserContext)
  return (
    <div className="App">
          {user ?
              <HomeClient />
              :
              <Presentation />}
    </div>
  );
}

export default HomePage;
