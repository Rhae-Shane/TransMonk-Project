import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://transmonk-project.onrender.com"; // change if needed

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingMap, setSavingMap] = useState({}); // track saving per product

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products. Check console.");
    } finally {
      setLoading(false);
    }
  }

  // update partial leads; keep race conditions safe by disabling while saving
  async function updateLeads(id, newLeads) {
    setSavingMap((s) => ({ ...s, [id]: true }));
    try {
      await axios.put(`${API}/leads/${id}`, newLeads);
      // optimistic refresh
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update leads.");
    } finally {
      setSavingMap((s) => ({ ...s, [id]: false }));
    }
  }

  return (
    <main className="sales-page">
      <div className="page-header">
        <div>
          <h1>Sales Dashboard</h1>
          <p className="muted">Quickly update sales leads — green (high), yellow (medium), red (low).</p>
        </div>
        <div className="actions">
          <button className="btn subtle" onClick={load} aria-label="Refresh">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="empty">No products found. Ask admin to add products.</div>
      ) : (
        <section className="grid">
          {products.map((p) => {
            const saving = !!savingMap[p._id];
            return (
              <article className="card" key={p._id}>
                <div className="card-left">
                  <div className="product-title">
                    <h2>{p.name}</h2>
                    <div className="small muted">{p.description}</div>
                  </div>

                  <ul className="meta">
                    <li><strong>Ready:</strong> {p.ready}</li>
                    <li><strong>Production:</strong> {p.production}</li>
                    <li><strong>Under Shipment:</strong> {p.underShipment}</li>
                  </ul>

                  <div className="shipment">
                    <span className="pill">{p.shipmentType || "N/A"}</span>
                    <span className="muted small">Expected: {p.expectedShipmentDate || "N/A"}</span>
                  </div>
                </div>

                <div className="card-right">
                  <div className="leads-grid">
                    <label className="lead-item">
                      <span className="dot green" aria-hidden />
                      <div className="lead-meta">High</div>
                      <input
                        className="lead-input"
                        type="number"
                        defaultValue={p.leads?.green ?? 0}
                        onBlur={(e) =>
                          updateLeads(p._id, {
                            green: Number(e.target.value) || 0,
                            yellow: p.leads?.yellow ?? 0,
                            red: p.leads?.red ?? 0,
                          })
                        }
                        disabled={saving}
                        aria-label={`Green leads for ${p.name}`}
                      />
                    </label>

                    <label className="lead-item">
                      <span className="dot yellow" aria-hidden />
                      <div className="lead-meta">Medium</div>
                      <input
                        className="lead-input"
                        type="number"
                        defaultValue={p.leads?.yellow ?? 0}
                        onBlur={(e) =>
                          updateLeads(p._id, {
                            green: p.leads?.green ?? 0,
                            yellow: Number(e.target.value) || 0,
                            red: p.leads?.red ?? 0,
                          })
                        }
                        disabled={saving}
                        aria-label={`Yellow leads for ${p.name}`}
                      />
                    </label>

                    <label className="lead-item">
                      <span className="dot red" aria-hidden />
                      <div className="lead-meta">Low</div>
                      <input
                        className="lead-input"
                        type="number"
                        defaultValue={p.leads?.red ?? 0}
                        onBlur={(e) =>
                          updateLeads(p._id, {
                            green: p.leads?.green ?? 0,
                            yellow: p.leads?.yellow ?? 0,
                            red: Number(e.target.value) || 0,
                          })
                        }
                        disabled={saving}
                        aria-label={`Red leads for ${p.name}`}
                      />
                    </label>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn outline"
                      onClick={() =>
                        navigator.clipboard?.writeText(`${p.name} — G:${p.leads.green} Y:${p.leads.yellow} R:${p.leads.red}`)
                      }
                      title="Copy leads"
                    >
                      Copy
                    </button>

                    <div className="saving-indicator" aria-hidden>
                      {saving ? "Saving…" : "Saved"}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
