import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://transmonk-project.onrender.com";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    ready: 0,
    production: 0,
    underShipment: 0,
    expectedShipmentDate: "",
    shipmentType: "air",
  });

  async function load() {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    }
  }

  useEffect(() => { load(); }, []);

  async function createProduct(e) {
    e.preventDefault();
    try {
      await axios.post(`${API}/products`, form);
      setForm({
        name: "",
        description: "",
        ready: 0,
        production: 0,
        underShipment: 0,
        expectedShipmentDate: "",
        shipmentType: "air",
      });
      load();
    } catch {
      alert("Create failed");
    }
  }

  async function saveProduct(p) {
    try {
      await axios.put(`${API}/products/${p._id}`, {
        ready: Number(p.localReady ?? p.ready),
        production: Number(p.localProduction ?? p.production),
        underShipment: Number(p.localUnderShipment ?? p.underShipment),
        expectedShipmentDate: p.localDate ?? p.expectedShipmentDate,
        shipmentType: p.localType ?? p.shipmentType,
      });
      load();
    } catch {
      alert("Update failed");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      load();
    } catch {
      alert("Delete failed");
    }
  }

  function downloadPDF() {
    window.open(`${API}/pdf`, "_blank");
  }

  return (
    <div className="container">
      
      {/* Header */}
      <div className="title" style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <h2>Admin Inventory</h2>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      {/* Add Product Form */}
      <form onSubmit={createProduct} style={{ marginBottom:16 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>

          <input className="input" placeholder="Name" required
            value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />

          <input className="input" placeholder="Description"
            value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />

          <input className="input" type="number" placeholder="Ready"
            value={form.ready} onChange={e=>setForm({...form, ready:e.target.value})} />

          <input className="input" type="number" placeholder="Production"
            value={form.production} onChange={e=>setForm({...form, production:e.target.value})} />

          <input className="input" type="number" placeholder="Under Shipment"
            value={form.underShipment} onChange={e=>setForm({...form, underShipment:e.target.value})} />

          <input className="input" type="date"
            value={form.expectedShipmentDate} onChange={e=>setForm({...form, expectedShipmentDate:e.target.value})} />

          <select className="input" value={form.shipmentType}
            onChange={e=>setForm({...form, shipmentType:e.target.value})}>
            <option value="air">Air</option>
            <option value="water">Water</option>
            <option value="">N/A</option>
          </select>

          <button className="input" type="submit">Add</button>
        </div>
      </form>

      {/* Existing Product Cards */}
      {products.map((p) => (
        <div key={p._id} className="product">

          <strong>{p.name}</strong>
          <div className="small">{p.description}</div>

          {/* Clean horizontal details */}
          <div className="details-row">
            <div className="detail-item">Ready: <b>{p.ready}</b></div>
            <div className="detail-item">Production: <b>{p.production}</b></div>
            <div className="detail-item">Under Ship: <b>{p.underShipment}</b></div>
            <div className="detail-item">Type: <b>{p.shipmentType || "N/A"}</b></div>
            <div className="detail-item">Date: <b>{p.expectedShipmentDate || "N/A"}</b></div>
          </div>

          {/* Editable Fields */}
          <div style={{ marginTop:12, display:"flex", gap:10, flexWrap:"wrap" }}>
            <input className="input" type="number" defaultValue={p.ready}
              onChange={(e)=>p.localReady = e.target.value} />

            <input className="input" type="number" defaultValue={p.production}
              onChange={(e)=>p.localProduction = e.target.value} />

            <input className="input" type="number" defaultValue={p.underShipment}
              onChange={(e)=>p.localUnderShipment = e.target.value} />

            <input className="input" type="date" defaultValue={p.expectedShipmentDate}
              onChange={(e)=>p.localDate = e.target.value} />

            <select className="input" defaultValue={p.shipmentType}
              onChange={(e)=>p.localType = e.target.value}>
              <option value="">N/A</option>
              <option value="air">Air</option>
              <option value="water">Water</option>
            </select>
          </div>

          {/* Lead Dots */}
          <div style={{ marginTop:12, display:"flex", gap:14 }}>
            <span className="dot green"></span> {p.leads.green}
            <span className="dot yellow"></span> {p.leads.yellow}
            <span className="dot red"></span> {p.leads.red}
          </div>

          {/* Save + Delete */}
          <div style={{ marginTop:12 }}>
            <button onClick={()=>saveProduct(p)}>Save</button>
            <button style={{ marginLeft:8 }} onClick={()=>deleteProduct(p._id)}>Delete</button>
          </div>

        </div>
      ))}
    </div>
  );
}
