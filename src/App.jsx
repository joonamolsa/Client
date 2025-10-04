// Pääkomponentti, joka hallitsee sovelluksen tilaa ja näkymiä
import { useState } from "react";
import "./App.css";
import Tabs from "./components/Tabs";
import Contacts from "./views/Contacts";
import Companies from "./views/Companies";
import YellowPages from "./views/YellowPages";

export default function App() {
  const [view, setView] = useState("contacts");
  return (
    <div className="app-container">
      <h1>Puhelinluettelo</h1>
      <Tabs value={view} onChange={setView} />
      {view === "contacts" && <Contacts />}
      {view === "companies" && <Companies />}
      {view === "yellow" && <YellowPages />}
    </div>
  );
}
