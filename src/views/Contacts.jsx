// Komponentit näyttävät, lisäävät, muokkaavat ja poistavat tietoja kontakteista
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";

export default function Contacts() {
  const { useSlice, load, create, update, remove } = useData();
  const { items, loading, error } = useSlice("contacts");

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [editingId, setEditingId] = useState(null);
  const reset = () => setForm({ name: "", phone: "", city: "" });

  useEffect(() => {
    load("contacts");
  }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || null,
    };

    if (editingId) {
      await update("contacts", editingId, body);
      setEditingId(null);
    } else {
      await create("contacts", body);
    }
    reset();
  };

  const onEdit = (it) => {
    setEditingId(it.id);
    setForm({
      name: it.name || "",
      phone: it.phone || "",
      city: it.city || "",
    });
  };

  const onDelete = async (id) => {
    await remove("contacts", id);
  };

  const onSearch = () => {
    const params = {};
    if (form.name.trim()) params.name = form.name.trim();
    if (form.phone.trim()) params.phone = form.phone.trim();
    if (form.city.trim()) params.city = form.city.trim();
    load("contacts", params);
  };

  const onClear = () => {
    reset();
    load("contacts");
  };

  return (
    <>
      <form onSubmit={onSubmit} className="entity-form">
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
          <button
            type="submit"
            disabled={!form.name.trim() || !form.phone.trim()}
          >
            {editingId ? "Tallenna" : "Lisää"}
          </button>
          <button type="button" className="btn-secondary" onClick={onSearch}>
            Haku
          </button>
          <button type="button" className="btn-secondary" onClick={onClear}>
            Tyhjennä & Näytä kaikki
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Ladataan…</p>
      ) : items.length === 0 ? (
        <p className="empty">Ei kontakteja.</p>
      ) : (
        <div className="card-list">
          {items.map((it) => (
            <Card
              key={it.id}
              heading={it.name}
              rows={[
                { text: it.phone },
                { text: `Paikkakunta: ${it.city || "—"}`, muted: true },
              ]}
              onEdit={() => onEdit(it)}
              onDelete={() => onDelete(it.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
