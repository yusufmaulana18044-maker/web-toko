import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Get user info
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/transactions", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setTransactions(data.data);
          }
        } else {
          console.error("Failed to fetch transactions");
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleViewDetail = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: "✅ Selesai", color: "#4caf50" },
      pending: { label: "⏳ Pending", color: "#ff9800" },
      paid: { label: "💰 Bayar", color: "#2196f3" },
      shipped: { label: "🚚 Kirim", color: "#00bcd4" },
      delivered: { label: "📦 Diterima", color: "#4caf50" },
      cancelled: { label: "❌ Batal", color: "#f44336" }
    };
    return statusMap[status] || { label: status, color: "#999" };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading transaksi...</div>
      </div>
    );
  }

  return (
    <div className="transactions-wrapper">
      <div className="transactions-container">
        <div className="transactions-header">
          <h1>📋 Daftar Transaksi</h1>
          <p className="subtitle">
            {user?.role === "kasir" ? "Semua transaksi penjualan" : "Transaksi milik Anda"}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Semua
          </button>
          <button 
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Selesai
          </button>
          <button 
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
        </div>

        {/* Transactions Table */}
        {transactions.length > 0 ? (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kode Transaksi</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.transaction_code}</td>
                    <td className="amount">
                      Rp {transaction.total_amount?.toLocaleString("id-ID") || "0"}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusBadge(transaction.status).color }}
                      >
                        {getStatusBadge(transaction.status).label}
                      </span>
                    </td>
                    <td>{formatDate(transaction.created_at)}</td>
                    <td>
                      <button 
                        className="detail-btn"
                        onClick={() => handleViewDetail(transaction.id)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Tidak ada transaksi</p>
            <small>Transaksi Anda akan muncul di sini</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
