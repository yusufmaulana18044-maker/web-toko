import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCategories.css";

function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/");
    }
  }, [token, user.role, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setCategories(data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Gagal load kategori");
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: generateSlug(value) })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.slug) {
      setError("Name dan slug wajib diisi!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/categories/${editingId}`
        : "http://localhost:5000/categories";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message || `Kategori berhasil ${editingId ? "diupdate" : "ditambah"}`);
        setFormData({ name: "", slug: "", description: "" });
        setEditingId(null);
        setShowForm(false);
        fetchCategories();
      } else {
        setError(data.message || "Gagal simpan kategori");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      try {
        const res = await fetch(`http://localhost:5000/categories/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (data.success) {
          setSuccess("Kategori berhasil dihapus");
          fetchCategories();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error: " + err.message);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "" });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-categories">
      <h2>🏷️ Manajemen Kategori</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Batal" : "+ Tambah Kategori"}
      </button>

      {showForm && (
        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Kategori</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama kategori"
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated dari nama"
              disabled
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi kategori"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? "Update" : "Simpan"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <p className="slug">#{category.slug}</p>
            <p className="description">{category.description}</p>
            <div className="card-actions">
              <button className="btn btn-sm btn-warning" onClick={() => handleEdit(category)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;
