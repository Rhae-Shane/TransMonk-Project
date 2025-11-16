
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://transmonk-project.onrender.com";

export default function Sales() {
  const [products, setProducts] = useState([]);

  async function load() {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  }

  useEffect(() => { load(); }, []);

  async function updateLeads(id, newLeads) {
    try {
      await axios.put(`${API}/leads/${id}`, newLeads);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update leads");
    }
  }

  return (
    <div className="container">
      <div className="title">
        <h2>Sales Dashboard</h2>
      </div>

      {products.map(p => (
        <div key={p._id} className="product">
          <div style={{ display: "flex", justifyContent:"space-between" }}>
            <div>
              <strong>{p.name}</strong>
              <div className="small">{p.description}</div>
            </div>
            <div className="small">Ready: {p.ready} | Prod: {p.production} | Ship: {p.underShipment}</div>
          </div>

          <div style={{ marginTop:8, display:"flex", gap:8, alignItems:"center" }}>
            <label className="small">Green:
              <input className="input" type="number" defaultValue={p.leads.green}
                     onBlur={e => updateLeads(p._id, { green: Number(e.target.value), yellow: p.leads.yellow, red: p.leads.red })}
              />
            </label>

            <label className="small">Yellow:
              <input className="input" type="number" defaultValue={p.leads.yellow}
                     onBlur={e => updateLeads(p._id, { green: p.leads.green, yellow: Number(e.target.value), red: p.leads.red })}
              />
            </label>

            <label className="small">Red:
              <input className="input" type="number" defaultValue={p.leads.red}
                     onBlur={e => updateLeads(p._id, { green: p.leads.green, yellow: p.leads.yellow, red: Number(e.target.value) })}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
