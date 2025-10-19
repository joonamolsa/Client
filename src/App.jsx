// Pääkomponentti, joka hallitsee sovelluksen tilaa ja näkymiä
import { AppProvider, useApp } from "./context/AppContext";
import { DataProvider } from "./context/DataContext";
import "./App.css";
import Tabs from "./components/Tabs";
import Contacts from "./views/Contacts";
import Companies from "./views/Companies";
import YellowPages from "./views/YellowPages";

function Content() {
  const { view } = useApp();
  return (
    <>
      <h1 className="text-center underline">Puhelinluettelo</h1>
      <Tabs />
      {view === "contacts" && <Contacts />}
      {view === "companies" && <Companies />}
      {view === "yellow" && <YellowPages />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DataProvider>
        <div className="app-container">
          <Content />
        </div>
      </DataProvider>
    </AppProvider>
  );
}
