// Komponentti kortin näyttämiseen
export default function Card({
  heading,
  rows = [],
  onEdit,
  onDelete,
  variant,
}) {
  return (
    <div className={`card ${variant ? `card--${variant}` : ""}`}>
      <div className="card-main">
        <strong>{heading}</strong>
        {rows.map((r, i) => (
          <div key={i} className={r.muted ? "muted" : ""}>
            {r.text}
          </div>
        ))}
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={onEdit}>
          Muokkaa
        </button>
        <button className="btn-delete" onClick={onDelete}>
          Poista
        </button>
      </div>
    </div>
  );
}
