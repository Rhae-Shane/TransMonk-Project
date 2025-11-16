
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    ready: 0,
    production: 0,
    underShipment: 0,
    expectedShipmentDate: "",
    shipmentType: "air"
  });

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
        shipmentType: "air"
      });
      load();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  }

  async function updateProduct(id, updateObj) {
    try {
      await axios.put(`${API}/products/${id}`, updateObj);
      load();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  function openPDF() {
    // opens in new tab and triggers download
    window.open(`${API}/pdf`, "_blank");
  }

  return (
    <div className="container">
      <div className="title">
        <h2>Admin Inventory</h2>
        <div>
          <button className="btn" onClick={openPDF} style={{ marginRight: 8 }}>
            Download Inventory PDF
          </button>
        </div>
      </div>

      <form onSubmit={createProduct} style={{ marginBottom: 12 }}>
        <div className="form-row">
          <input className="input" placeholder="Product name" value={form.name}
                 onChange={e=>setForm({...form, name: e.target.value})} required />
          <input className="input" placeholder="Short description" value={form.description}
                 onChange={e=>setForm({...form, description: e.target.value})} />
          <input className="input" type="number" placeholder="Ready" value={form.ready}
                 onChange={e=>setForm({...form, ready: Number(e.target.value)})} />
          <input className="input" type="number" placeholder="Production" value={form.production}
                 onChange={e=>setForm({...form, production: Number(e.target.value)})} />
        </div>
        <div style={{ marginTop: 8 }} className="form-row">
          <input className="input" type="number" placeholder="Under Shipment" value={form.underShipment}
                 onChange={e=>setForm({...form, underShipment: Number(e.target.value)})} />
          <input className="input" type="date" value={form.expectedShipmentDate}
                 onChange={e=>setForm({...form, expectedShipmentDate: e.target.value})} />
          <select className="input" value={form.shipmentType} onChange={e=>setForm({...form, shipmentType: e.target.value})}>
            <option value="air">Air</option>
            <option value="water">Water</option>
            <option value="">N/A</option>
          </select>
          <button className="btn" type="submit">Add Product</button>
        </div>
      </form>

      <hr />

      {products.map(p => (
        <div className="product" key={p._id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{p.name}</strong>
              <div className="small">{p.description}</div>
            </div>

            <div>
              <button className="btn" onClick={()=>{
                const newName = prompt("New name", p.name);
                if (newName) updateProduct(p._id, { name: newName });
              }}>Rename</button>
              <button className="btn btn-danger" style={{ marginLeft:8 }} onClick={()=>deleteProduct(p._id)}>Delete</button>
            </div>
          </div>

          <div style={{ marginTop:8, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <label className="small">Ready:
              <input className="input" type="number" defaultValue={p.ready}
                     onBlur={e => updateProduct(p._id, { ready: Number(e.target.value) })} />
            </label>

            <label className="small">Production:
              <input className="input" type="number" defaultValue={p.production}
                     onBlur={e => updateProduct(p._id, { production: Number(e.target.value) })} />
            </label>

            <label className="small">UnderShipment:
              <input className="input" type="number" defaultValue={p.underShipment}
                     onBlur={e => updateProduct(p._id, { underShipment: Number(e.target.value) })} />
            </label>

            <label className="small">Shipment Date:
              <input className="input" type="date" defaultValue={p.expectedShipmentDate}
                     onBlur={e => updateProduct(p._id, { expectedShipmentDate: e.target.value })} />
            </label>

            <label className="small">Shipment Type:
              <select className="input" defaultValue={p.shipmentType || ""} onChange={e => updateProduct(p._id, { shipmentType: e.target.value })}>
                <option value="">N/A</option>
                <option value="air">Air</option>
                <option value="water">Water</option>
              </select>
            </label>

            <div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
              <div>Leads: G:{p.leads.green} Y:{p.leads.yellow} R:{p.leads.red}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
