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
      alert("Failed to load products");
    }
  }

  useEffect(() => { load(); }, []);

  async function saveLeads(p) {
    try {
      await axios.put(`${API}/leads/${p._id}`, {
        green: Number(p.localGreen ?? p.leads.green),
        yellow: Number(p.localYellow ?? p.leads.yellow),
        red: Number(p.localRed ?? p.leads.red),
      });
      load();
    } catch (err) {
      alert("Failed to update");
    }
  }

  function downloadPDF() {
    window.open(`${API}/pdf`, "_blank");
  }

  return (
    <div className="container">
      <div className="title" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Sales Dashboard</h2>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      {products.map((p) => (
        <div key={p._id} className="product">

          {/* Product Title */}
          <strong>{p.name}</strong>
          <div className="small">{p.description}</div>

          {/* Horizontal details row */}
          <div className="details-row">
            <div className="detail-item">Ready: <b>{p.ready}</b></div>
            <div className="detail-item">Production: <b>{p.production}</b></div>
            <div className="detail-item">Under Ship: <b>{p.underShipment}</b></div>
            <div className="detail-item">Type: <b>{p.shipmentType || "N/A"}</b></div>
            <div className="detail-item">Date: <b>{p.expectedShipmentDate || "N/A"}</b></div>
          </div>

          {/* Editable Leads Section */}
          <div style={{ marginTop:12 }}>
            <div className="lead-row">
              <span className="dot green"></span>
              <input
                className="input"
                type="number"
                defaultValue={p.leads.green}
                onChange={(e) => p.localGreen = e.target.value}
              />
            </div>

            <div className="lead-row" style={{ marginTop:8 }}>
              <span className="dot yellow"></span>
              <input
                className="input"
                type="number"
                defaultValue={p.leads.yellow}
                onChange={(e) => p.localYellow = e.target.value}
              />
            </div>

            <div className="lead-row" style={{ marginTop:8 }}>
              <span className="dot red"></span>
              <input
                className="input"
                type="number"
                defaultValue={p.leads.red}
                onChange={(e) => p.localRed = e.target.value}
              />
            </div>
          </div>

          {/* Save Button */}
          <button style={{ marginTop:12 }} onClick={() => saveLeads(p)}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
