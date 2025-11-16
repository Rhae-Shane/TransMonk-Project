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
      // Sort products by creation date or name if available
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  }

  useEffect(() => {
    load();
  }, []);

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
    window.open(`${API}/pdf`, "_blank");
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Admin Inventory</h2>
        <button className="btn" onClick={openPDF}>
          Download Inventory PDF
        </button>
      </div>

      <div className="card">
        <h3>Add New Product</h3>
        <form onSubmit={createProduct}>
          <div className="form-grid" style={{ marginBottom: "1rem" }}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                className="input"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="input"
                placeholder="Short description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Ready</label>
              <input
                className="input"
                type="number"
                placeholder="Ready"
                value={form.ready}
                onChange={(e) =>
                  setForm({ ...form, ready: Number(e.target.value) })
                }
              />
            </div>
            <div className="form-group">
              <label>Production</label>
              <input
                className="input"
                type="number"
                placeholder="Production"
                value={form.production}
                onChange={(e) =>
                  setForm({ ...form, production: Number(e.target.value) })
                }
              />
            </div>
            <div className="form-group">
              <label>Under Shipment</label>
              <input
                className="input"
                type="number"
                placeholder="Under Shipment"
                value={form.underShipment}
                onChange={(e) =>
                  setForm({ ...form, underShipment: Number(e.target.value) })
                }
              />
            </div>
            <div className="form-group">
              <label>Shipment Date</label>
              <input
                className="input"
                type="date"
                value={form.expectedShipmentDate}
                onChange={(e) =>
                  setForm({ ...form, expectedShipmentDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Shipment Type</label>
              <select
                className="input"
                value={form.shipmentType}
                onChange={(e) =>
                  setForm({ ...form, shipmentType: e.target.value })
                }
              >
                <option value="air">Air</option>
                <option value="water">Water</option>
                <option value="">N/A</option>
              </select>
            </div>
          </div>
          <button className="btn" type="submit">
            Add Product
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Existing Products</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Ready</th>
              <th>Production</th>
              <th>Shipping</th>
              <th>Ship Date</th>
              <th>Type</th>
              <th>Leads (G/Y/R)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <strong>{p.name}</strong>
                  <div className="small">{p.description}</div>
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    defaultValue={p.ready}
                    onBlur={(e) =>
                      updateProduct(p._id, { ready: Number(e.target.value) })
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    defaultValue={p.production}
                    onBlur={(e) =>
                      updateProduct(p._id, {
                        production: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    defaultValue={p.underShipment}
                    onBlur={(e) =>
                      updateProduct(p._id, {
                        underShipment: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="date"
                    defaultValue={p.expectedShipmentDate?.split("T")[0] || ""}
                    onBlur={(e) =>
                      updateProduct(p._id, {
                        expectedShipmentDate: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    className="input"
                    defaultValue={p.shipmentType || ""}
                    onChange={(e) =>
                      updateProduct(p._id, { shipmentType: e.target.value })
                    }
                  >
                    <option value="">N/A</option>
                    <option value="air">Air</option>
                    <option value="water">Water</option>
                  </select>
                </td>
                <td className="small">
                  G:{p.leads.green} Y:{p.leads.yellow} R:{p.leads.red}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn"
                      onClick={() => {
                        const newName = prompt("New name", p.name);
                        if (newName) updateProduct(p._id, { name: newName });
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}