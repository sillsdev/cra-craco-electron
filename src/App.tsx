import React from "react";
import logo from "./logo.svg";
import "./App.css";
const ipc = (window as any).electron;

function App() {
  const [spellLangs, setSpellLangs] = React.useState("");

  React.useEffect(() => {
    ipc?.availSpellLangs().then((langs: string[]) => {
      setSpellLangs(
        JSON.stringify(langs)
          .replace(/\[|\]|"/g, "")
          .replace(/,/g, ", ")
      );
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {ipc && <p>Available Spelling languages:{" " + spellLangs}</p>}
      </header>
    </div>
  );
}

export default App;
