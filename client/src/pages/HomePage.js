import '../styles/App.css';
import HomeClient from "./HomeClient";
import {useContext} from "react";
import {UserContext} from "../utils/UserContext";

function HomePage() {
    const {user, setUser} = useContext(UserContext)
  return (
    <div className="App">
      <header className="App-header">
          {user ?
              <HomeClient />
              :
              <div>
                  <h1>Annotation HomePage</h1>
              </div>}
      </header>
    </div>
  );
}

export default HomePage;
