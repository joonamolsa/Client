// Kontaktien hallintaan liittyvä näkymä
import { useEffect, useState } from "react";
import { ContactsAPI } from "../api";
import Card from "../components/Card";

export default function Contacts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async (params = {}) => {
    try {
      setItems(await ContactsAPI.list(params));
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim())
      return setError("Nimi ja puhelin ovat pakollisia");
    try {
      if (editingId) {
        const saved = await ContactsAPI.update(editingId, form);
        setItems((prev) => prev.map((x) => (x.id === editingId ? saved : x)));
        setEditingId(null);
      } else {
        const saved = await ContactsAPI.create(form);
        setItems((prev) => [saved, ...prev]);
      }
      setForm({ name: "", phone: "", city: "" });
      setError("");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const search = () => load(form);
  const clear = () => {
    setForm({ name: "", phone: "", city: "" });
    load();
  };

  return (
    <>
      <form onSubmit={submit} className="entity-form">
        <input
          placeholder="Nimi"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          placeholder="Puhelin"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        <input
          placeholder="Paikkakunta"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
        />
        <div className="actions">
          <button type="submit">{editingId ? "Tallenna" : "Lisää"}</button>
          <button type="button" className="btn-secondary" onClick={search}>
            Haku
          </button>
          <button type="button" className="btn-secondary" onClick={clear}>
            Tyhjennä
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="card-list">
        {items.map((it) => (
          <Card
            key={it.id}
            variant="contact"
            heading={it.name}
            rows={[
              { text: it.phone },
              { text: `Paikkakunta: ${it.city || "—"}`, muted: true },
            ]}
            onEdit={() => {
              setForm({ name: it.name, phone: it.phone, city: it.city || "" });
              setEditingId(it.id);
            }}
            onDelete={async () => {
              await ContactsAPI.remove(it.id);
              setItems((prev) => prev.filter((x) => x.id !== it.id));
            }}
          />
        ))}
      </div>
    </>
  );
}
