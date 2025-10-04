// Ilmoitusten hallintaan liittyvä näkymä
import { useEffect, useState } from "react";
import { YellowAPI } from "../api";
import Card from "../components/Card";

function parsePrice(val) {
  if (val == null || val === "") return "";
  const cleaned = String(val)
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? cleaned : "";
}

export default function YellowPages() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_name: "",
    description: "",
    price: "",
    phone: "",
    city: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async (params = {}) => {
    try {
      setItems(await YellowAPI.list(params));
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.item_name.trim()) return setError("Tuotteen nimi on pakollinen");
    const cleaned = parsePrice(form.price);
    if (cleaned === "") return setError("Hinta on pakollinen (numero)");
    const body = {
      item_name: form.item_name,
      description: form.description || null,
      price: Number(cleaned),
      phone: form.phone || null,
      city: form.city || null,
    };
    try {
      if (editingId) {
        const saved = await YellowAPI.update(editingId, body);
        setItems((prev) => prev.map((x) => (x.id === editingId ? saved : x)));
        setEditingId(null);
      } else {
        const saved = await YellowAPI.create(body);
        setItems((prev) => [saved, ...prev]);
      }
      setForm({
        item_name: "",
        description: "",
        price: "",
        phone: "",
        city: "",
      });
      setError("");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  // Haku: item_name → q, city/phone suoraan
  const search = () => {
    const params = {};
    if (form.item_name.trim()) params.q = form.item_name.trim();
    if (form.city.trim()) params.city = form.city.trim();
    if (form.phone.trim()) params.phone = form.phone.trim();
    if (form.price.trim()) params.price_max = Number(parsePrice(form.price));
    load(params);
  };

  const clear = () => {
    setForm({ item_name: "", description: "", price: "", phone: "", city: "" });
    load();
  };

  return (
    <>
      <form onSubmit={submit} className="entity-form">
        <input
          placeholder="Tuotteen nimi"
          value={form.item_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, item_name: e.target.value }))
          }
        />
        <input
          placeholder="Kuvaus"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input
          placeholder="Hinta (esim. 499,90)"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
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
            variant="yellow"
            heading={it.item_name}
            rows={[
              { text: it.description || "—", muted: true },
              { text: `Hinta: ${Number(it.price).toFixed(2)} €` },
              { text: `Puhelin: ${it.phone || "—"}` },
              { text: `Paikkakunta: ${it.city || "—"}` },
            ]}
            onEdit={() => {
              setForm({
                item_name: it.item_name || "",
                description: it.description || "",
                price: it.price != null ? String(it.price) : "",
                phone: it.phone || "",
                city: it.city || "",
              });
              setEditingId(it.id);
            }}
            onDelete={async () => {
              await YellowAPI.remove(it.id);
              setItems((prev) => prev.filter((x) => x.id !== it.id));
            }}
          />
        ))}
      </div>
    </>
  );
}
