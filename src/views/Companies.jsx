// Komponentit näyttävät, lisäävät, muokkaavat ja poistavat tietoja yrityksistä
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";

export default function Companies() {
  const { useSlice, load, create, update, remove } = useData();
  const { items, loading, error } = useSlice("companies");

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    load("companies");
  }, [load]);

  const reset = () => setForm({ name: "", phone: "", city: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || null,
    };

    if (editingId) {
      await update("companies", editingId, body);
      setEditingId(null);
    } else {
      await create("companies", body);
    }
    reset();
  };

  const search = () => {
    const params = {};
    if (form.name.trim()) params.name = form.name.trim();
    if (form.phone.trim()) params.phone = form.phone.trim();
    if (form.city.trim()) params.city = form.city.trim();
    load("companies", params);
  };

  const clear = () => {
    reset();
    load("companies");
  };

  return (
    <>
      <form onSubmit={submit} className="entity-form">
        <input
          placeholder="Yrityksen nimi"
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
          <button type="button" className="btn-secondary" onClick={search}>
            Haku
          </button>
          <button type="button" className="btn-secondary" onClick={clear}>
            Tyhjennä & Näytä kaikki
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Ladataan…</p>
      ) : items.length === 0 ? (
        <p className="empty">Ei yrityksiä.</p>
      ) : (
        <div className="card-list">
          {items.map((it) => (
            <Card
              key={it.id}
              variant="company"
              heading={it.name}
              rows={[
                { text: it.phone },
                { text: `Paikkakunta: ${it.city || "—"}`, muted: true },
              ]}
              onEdit={() => {
                setForm({
                  name: it.name || "",
                  phone: it.phone || "",
                  city: it.city || "",
                });
                setEditingId(it.id);
              }}
              onDelete={() => remove("companies", it.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
