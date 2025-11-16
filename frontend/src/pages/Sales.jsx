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

  useEffect(() => {
    load();
  }, []);

  async function updateLeads(id, updateObj) {
    try {
      await axios.put(`${API}/leads/${id}`, updateObj);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update leads");
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "18px" }}>Sales Dashboard</h2>

      {products.map((p) => (
        <div key={p._id} className="product">
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ fontSize: "18px" }}>{p.name}</strong>
            <div className="small">{p.description}</div>

            <div
              style={{
                fontSize: "13px",
                marginTop: "6px",
                opacity: "0.8",
              }}
            >
              Ready: {p.ready} | Production: {p.production} | Under Shipment:{" "}
              {p.underShipment}
            </div>
          </div>

          {/* LEAD DOTS INPUT SECTION */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {/* GREEN LEAD */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="dot green"></span>
              <input
                type="number"
                defaultValue={p.leads.green}
                className="input"
                style={{ width: "70px" }}
                onBlur={(e) =>
                  updateLeads(p._id, {
                    green: Number(e.target.value),
                    yellow: p.leads.yellow,
                    red: p.leads.red,
                  })
                }
              />
            </div>

            {/* YELLOW LEAD */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="dot yellow"></span>
              <input
                type="number"
                defaultValue={p.leads.yellow}
                className="input"
                style={{ width: "70px" }}
                onBlur={(e) =>
                  updateLeads(p._id, {
                    green: p.leads.green,
                    yellow: Number(e.target.value),
                    red: p.leads.red,
                  })
                }
              />
            </div>

            {/* RED LEAD */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="dot red"></span>
              <input
                type="number"
                defaultValue={p.leads.red}
                className="input"
                style={{ width: "70px" }}
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
