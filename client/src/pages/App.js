import '../styles/App.css';
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          {localStorage.getItem('token') ?
              <Home />
              :
              <h1>Annotation App</h1>}
      </header>
    </div>
  );
}

export default App;
