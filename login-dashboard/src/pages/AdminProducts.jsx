import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    stock: "",
    image: ""
  });

  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check authorization
  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/");
    }
  }, [token, user.role, navigate]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const response = await res.json();
      // API returns {success: true, data: [...]}
      const productData = response.data || response || [];
      setProducts(Array.isArray(productData) ? productData : []);
      setLoading(false);
    } catch (err) {
      setError("Gagal load produk");
      setProducts([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/products/upload-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: uploadFormData
      });

      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image: data.imagePath
        }));
        setSuccess("Gambar berhasil diupload: " + data.imagePath);
      } else {
        setError(data.message || "Gagal upload gambar");
      }
    } catch (err) {
      setError("Error upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.author || !formData.category || !formData.price) {
      setError("Semua field wajib diisi!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `http://localhost:5000/products/${editingId}`
        : "http://localhost:5000/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      // Check if response is ok before parsing JSON
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message || `Produk berhasil ${editingId ? "diupdate" : "ditambah"}`);
        setFormData({ title: "", author: "", category: "", price: "", image: "" });
        setEditingId(null);
        setShowForm(false);
        fetchProducts();
      } else {
        setError(data.message || "Gagal simpan produk");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        const res = await fetch(`http://localhost:5000/products/${id}`, {
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
          setSuccess("Produk berhasil dihapus");
          fetchProducts();
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
    setFormData({ title: "", author: "", category: "", price: "", stock: "", image: "" });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-products">
      <h2>📦 Manajemen Produk</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Batal" : "+ Tambah Produk"}
      </button>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Produk</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul produk"
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Masukkan nama author"
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Masukkan kategori"
            />
          </div>

          <div className="form-group">
            <label>Harga</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Masukkan harga"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Masukkan jumlah stock"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              placeholder="Pilih gambar"
            />
            {uploading && <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>⏳ Uploading...</p>}
            {formData.image && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '12px', color: '#4caf50' }}>✅ Gambar: {formData.image}</p>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px', marginTop: '5px' }}
                />
              </div>
            )}
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

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Author</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stock</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.author}</td>
                <td>{product.category_name || product.category}</td>
                <td>Rp {product.price?.toLocaleString('id-ID')}</td>
                <td style={{ fontWeight: 'bold', color: product.stock > 0 ? '#4caf50' : '#f44336' }}>
                  {product.stock || 0}
                </td>
                <td className="actions">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
