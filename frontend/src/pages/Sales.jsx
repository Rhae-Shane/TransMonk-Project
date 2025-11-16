import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://transmonk-project.onrender.com"; // change if needed

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
      <h2 style={{ marginBottom: "20px" }}>Sales Dashboard</h2>

      {products.map((p) => (
        <div key={p._id} className="sales-card">

          {/* Product Title */}
          <div className="sales-top">
            <div>
              <h3 className="product-name">{p.name}</h3>
              <p className="small">{p.description}</p>
            </div>

            <div className="small product-meta">
              Ready: {p.ready} | Production: {p.production} | Ship: {p.underShipment}
            </div>
          </div>

          {/* Lead Dots + Inputs */}
          <div className="lead-section">

            <div className="lead-row">
              <span className="dot green"></span>
              <input
                type="number"
                defaultValue={p.leads.green}
                className="lead-input"
                onBlur={(e) =>
                  updateLeads(p._id, {
                    green: Number(e.target.value),
                    yellow: p.leads.yellow,
                    red: p.leads.red,
                  })
                }
              />
            </div>

            <div className="lead-row">
              <span className="dot yellow"></span>
              <input
                type="number"
                defaultValue={p.leads.yellow}
                className="lead-input"
                onBlur={(e) =>
                  updateLeads(p._id, {
                    green: p.leads.green,
                    yellow: Number(e.target.value),
                    red: p.leads.red,
                  })
                }
              />
            </div>

            <div className="lead-row">
              <span className="dot red"></span>
              <input
                type="number"
                defaultValue={p.leads.red}
                className="lead-input"
                onBlur={(e) =>
                  updateLeads(p._id, {
                    green: p.leads.green,
                    yellow: p.leads.yellow,
                    red: Number(e.target.value),
                  })
                }
              />
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}
