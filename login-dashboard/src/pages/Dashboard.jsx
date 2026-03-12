import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Check token saat load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    
    if (!token) {
      navigate("/");
      return;
    }
    
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, [navigate]);

  // 🔥 ambil data dari backend
  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil kategori:", err);
        setCategories([
          { id: 1, name: "Cerita Rakyat", slug: "cerita-rakyat" },
          { id: 2, name: "Fabel", slug: "fabel" },
          { id: 3, name: "Legenda", slug: "legenda" },
          { id: 4, name: "Petualangan", slug: "petualangan" },
          { id: 5, name: "Dongeng", slug: "dongeng" },
          { id: 6, name: "Fantasi", slug: "fantasi" },
          { id: 7, name: "Sejarah", slug: "sejarah" },
          { id: 8, name: "Mitos", slug: "mitos" }
        ]);
      });

    // Fetch products
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil produk:", err);
        setBooks([
          {
            id: 1,
            title: "Cerita Rakyat Nusantara",
            author: "Murti Bunanta",
            category_name: "Cerita Rakyat",
            price: 75000,
            image: "/images/book-1.jpg"
          },
          {
            id: 2,
            title: "Si Kancil Penggalau",
            author: "Suwardi",
            category_name: "Fabel",
            price: 65000,
            image: "/images/book-2.jpg"
          },
          {
            id: 3,
            title: "Legenda Bukit Merah",
            author: "Suciwati",
            category_name: "Legenda",
            price: 80000,
            image: "/images/book-3.jpg"
          },
          {
            id: 4,
            title: "Petualangan Anak Negeri",
            author: "Seno Gumira Ajidarma",
            category_name: "Petualangan",
            price: 90000,
            image: "/images/book-4.jpg"
          },
          {
            id: 5,
            title: "Dongeng Sebelum Tidur",
            author: "Harun Erwin",
            category_name: "Dongeng",
            price: 70000,
            image: "/images/book-5.jpg"
          },
          {
            id: 6,
            title: "Kisah Panjang Emas",
            author: "Sri Dewi",
            category_name: "Fantasi",
            price: 95000,
            image: "/images/book-6.jpg"
          },
          {
            id: 7,
            title: "Pangeran Diponegoro",
            author: "Langit Kresna Hariyadhi",
            category_name: "Sejarah",
            price: 85000,
            image: "/images/book-7.jpg"
          },
          {
            id: 8,
            title: "Putri Duyung Laut Jawa",
            author: "Wiratno Hadiwinoto",
            category_name: "Mitos",
            price: 78000,
            image: "/images/book-8.jpg"
          },
          {
            id: 9,
            title: "Timun Mas dan Raksasa",
            author: "Bambang Sugiharto",
            category_name: "Cerita Rakyat",
            price: 72000,
            image: "/images/book-9.jpg"
          },
          {
            id: 10,
            title: "Sang Malin Kundang",
            author: "Awang Rasyid",
            category_name: "Legenda",
            price: 82000,
            image: "/images/book-10.jpg"
          }
        ]);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (book) => {
    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === book.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      setCart(cart.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total: totalPrice })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const order = result.data || result;
      navigate("/receipt", {
        state: {
          orderId: order.id,
          items: cart,
          total: totalPrice
        }
      });
    } catch (error) {
      console.error("Error:", error);
      const orderId = Math.floor(Date.now() / 1000);
      navigate("/receipt", {
        state: {
          orderId: orderId,
          items: cart,
          total: totalPrice
        }
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📚 Toko Buku Digital</h1>
          <p>Belanja Buku Cerita Anak Indonesia</p>
          {user && <p className="user-info">👤 {user.username}</p>}
        </div>
        <div className="header-actions">
          <button
            className="cart-btn"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Keranjang <span className="cart-badge">{totalItems}</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {showCart ? (
        <div className="cart-section">
          <div className="cart-header">
            <h2>🛒 Keranjang Belanja</h2>
            <button className="close-btn" onClick={() => setShowCart(false)}>
              ✕
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="empty-cart">Keranjang Anda kosong</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p>{item.author}</p>
                      <p className="price">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      Rp {(item.price * (item.quantity || 1)).toLocaleString("id-ID")}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total Item:</span>
                  <strong>{totalItems}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total Harga:</span>
                  <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  ✓ Checkout
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="books-section">
          <div className="books-header">
            <h2>📚 Koleksi Cerita Nusantara</h2>
            <input
              type="text"
              className="search-box"
              placeholder="🔍 Cari judul, penulis, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories Menu */}
          <div className="categories-menu">
            <button
              className={`category-btn ${selectedCategory === null ? "active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              📚 Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              gap: '20px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(37, 99, 235, 0.3)',
                borderTop: '4px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{
                fontSize: '16px',
                color: '#666',
                margin: 0
              }}>⏳ Loading buku...</p>
            </div>
          ) : (
            <p className="search-result">
              Menampilkan {filteredBooks.length} dari {books.length} buku
            </p>
          )}

          <div className="books-grid">
            {!loading && filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book.id} className="book-card">
                  <div className="book-image">
                    <img
                      src={book.image || "/images/default.jpg"}
                      alt={book.title}
                      className="book-cover"
                    />
                    <span className="category-badge">
                      {book.category}
                    </span>
                  </div>

                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">✍️ {book.author}</p>
                    <div className="book-footer">
                      <span className="price">
                        Rp {Number(book.price).toLocaleString("id-ID")}
                      </span>
                      <button 
                        className="add-btn"
                        onClick={() => addToCart(book)}
                      >
                        🛒 Beli
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999'
                }}>
                  <p style={{ fontSize: '40px', marginBottom: '10px' }}>📭</p>
                  <p style={{ fontSize: '18px', margin: 0 }}>Buku tidak ditemukan</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
