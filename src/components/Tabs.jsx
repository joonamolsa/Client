// komponentti, joka renderöi välilehdet ja käsittelee niiden vaihtamista
import { useApp } from "../context/AppContext";

export default function Tabs() {
  const { view, setView } = useApp();
  const tabs = [
    { key: "contacts", label: "Kontaktit" },
    { key: "companies", label: "Yritykset" },
    { key: "yellow", label: "Keltaiset sivut" },
  ];
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${view === t.key ? "active" : ""}`}
          onClick={() => setView(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
