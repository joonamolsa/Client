// Komponentit näyttävät, lisäävät, muokkaavat ja poistavat tietoja keltaisista sivuista
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import Card from "../components/Card";

const parsePrice = (val) => {
  const s = String(val ?? "")
    .replace(",", ".")
    .trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());

export default function YellowPages() {
  const { useSlice, load, create, update, remove } = useData();
  const { items, loading, error } = useSlice("yellow");

  const [form, setForm] = useState({
    item_name: "",
    description: "",
    price: "",
    phone: "",
    city: "",
    posted_date: "",
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    load("yellow");
  }, [load]);

  const reset = () =>
    setForm({
      item_name: "",
      description: "",
      price: "",
      phone: "",
      city: "",
      posted_date: "",
      image_url: "",
    });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.item_name.trim()) return;

    const priceNum = parsePrice(form.price);
    if (priceNum === null) return;

    const body = {
      item_name: form.item_name.trim(),
      description: form.description.trim() || null,
      price: priceNum,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      posted_date: isDate(form.posted_date) ? form.posted_date.trim() : null,
      image_url: form.image_url.trim() || null,
    };

    if (editingId) {
      await update("yellow", editingId, body);
      setEditingId(null);
    } else {
      await create("yellow", body);
    }
    reset();
  };

  //Hakufunktio
  const search = () => {
    const p = {};
    if (form.item_name?.trim()) p.q = form.item_name.trim(); // hakee nimeen/kuvaukseen
    if (form.city?.trim()) p.city = form.city.trim();
    if (form.phone?.trim()) p.phone = form.phone.trim();

    // Lisää hinta vain jos se on numeerinen
    const s = String(form.price ?? "")
      .replace(",", ".")
      .trim();
    const n = Number(s);
    if (s !== "" && Number.isFinite(n)) p.price_max = n;

    load("yellow", p);
  };

  const toDateInput = (d) => {
    if (!d) return "";
    // jos backend palauttaa "2025-10-21" -> ok, jos tulee aikaleima -> siivous:
    const s = String(d);
    return s.length >= 10 ? s.slice(0, 10) : s;
  };

  function calcAge(dateStr) {
    if (!dateStr) return "Tuntematon";
    const base = new Date(dateStr);
    if (isNaN(base)) return "Tuntematon";
    const now = new Date();
    let months =
      (now.getFullYear() - base.getFullYear()) * 12 +
      (now.getMonth() - base.getMonth());
    if (now.getDate() < base.getDate()) months -= 1;

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (years > 0) return `${years} v ${remMonths} kk`;
    return `${remMonths} kk`;
  }

  const clear = () => {
    reset();
    load("yellow");
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
        <input
          type="date"
          placeholder="Ostopäivä"
          value={form.posted_date}
          onChange={(e) =>
            setForm((f) => ({ ...f, posted_date: e.target.value }))
          }
        />
        <input
          placeholder="Kuvan URL (https://...)"
          value={form.image_url}
          onChange={(e) =>
            setForm((f) => ({ ...f, image_url: e.target.value }))
          }
        />
        <div className="actions">
          <button
            type="submit"
            disabled={
              !form.item_name.trim() ||
              parsePrice(form.price) === null ||
              (form.posted_date && !isDate(form.posted_date))
            }
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
        <p className="empty">Ei ilmoituksia.</p>
      ) : (
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
                { text: `Ikä: ${calcAge(it.posted_date)}` },
                { text: `Kuvan URL: ${it.image_url || "—"}`, muted: true },
              ]}
              onEdit={() => {
                setForm({
                  item_name: it.item_name || "",
                  description: it.description || "",
                  price: it.price != null ? String(it.price) : "",
                  phone: it.phone || "",
                  city: it.city || "",
                  posted_date: toDateInput(it.posted_date),
                  image_url: it.image_url || "",
                });
                setEditingId(it.id);
              }}
              onDelete={() => remove("yellow", it.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
