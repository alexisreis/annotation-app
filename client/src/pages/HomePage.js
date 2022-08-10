import '../styles/App.css';
import HomeClient from "./HomeClient";
import {useContext} from "react";
import {UserContext} from "../utils/UserContext";

function HomePage() {
    const {user} = useContext(UserContext)
  return (
    <div className="App">
          {user ?
              <HomeClient />
              :
              <div>
                  <h1>Annotation HomePage</h1>
              </div>}
    </div>
  );
}

export default HomePage;
