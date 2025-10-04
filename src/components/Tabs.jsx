// komponentti, joka renderöi välilehdet ja käsittelee niiden vaihtamista
export default function Tabs({ value, onChange }) {
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
          className={`tab ${value === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
