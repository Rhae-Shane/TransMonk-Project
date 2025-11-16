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
    shipmentType: "air"
  });

  async function load() {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load");
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
      alert("Failed to create");
    }
  }

  async function updateProduct(id, update) {
    try {
      await axios.put(`${API}/products/${id}`, update);
      load();
    } catch (err) {
      alert("Update failed");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      load();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="container">
      <div className="title">
        <h2>Admin Inventory</h2>
      </div>

      {/* Create Product Form */}
      <form onSubmit={createProduct} style={{ marginBottom: 16 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          <input className="input" placeholder="Name" required
                 value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />

          <input className="input" placeholder="Description"
                 value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />

          <input className="input" type="number" placeholder="Ready"
                 value={form.ready} onChange={e=>setForm({...form, ready:Number(e.target.value)})} />

          <input className="input" type="number" placeholder="Production"
                 value={form.production} onChange={e=>setForm({...form, production:Number(e.target.value)})} />

          <input className="input" type="number" placeholder="Under Shipment"
                 value={form.underShipment} onChange={e=>setForm({...form, underShipment:Number(e.target.value)})} />

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

      {/* Product list */}
      {products.map((p) => (
        <div key={p._id} className="product">
          <strong>{p.name}</strong>
          <div className="small">{p.description}</div>

          <div style={{ marginTop:10, display:"flex", gap:10, flexWrap:"wrap" }}>
            <label className="small">Ready:
              <input className="input" type="number" defaultValue={p.ready}
                     onBlur={e=>updateProduct(p._id, { ready:Number(e.target.value) })} />
            </label>

            <label className="small">Production:
              <input className="input" type="number" defaultValue={p.production}
                     onBlur={e=>updateProduct(p._id, { production:Number(e.target.value) })} />
            </label>

            <label className="small">UnderShipment:
              <input className="input" type="number" defaultValue={p.underShipment}
                     onBlur={e=>updateProduct(p._id, { underShipment:Number(e.target.value) })} />
            </label>

            <label className="small">Ship Date:
              <input className="input" type="date" defaultValue={p.expectedShipmentDate}
                     onBlur={e=>updateProduct(p._id, { expectedShipmentDate:e.target.value })} />
            </label>

            <label className="small">Type:
              <select className="input" defaultValue={p.shipmentType}
                      onChange={e=>updateProduct(p._id, { shipmentType:e.target.value })}>
                <option value="">N/A</option>
                <option value="air">Air</option>
                <option value="water">Water</option>
              </select>
            </label>
          </div>

          {/* Dots for leads (view only) */}
          <div style={{ marginTop:10 }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span className="dot green"></span> {p.leads.green}
              <span className="dot yellow"></span> {p.leads.yellow}
              <span className="dot red"></span> {p.leads.red}
            </div>
          </div>

          <div style={{ marginTop:10 }}>
            <button onClick={()=>deleteProduct(p._id)}>Delete</button>
          </div>
        </div>
      ))}

    </div>
  );
}
