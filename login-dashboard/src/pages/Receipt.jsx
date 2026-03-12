import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Receipt.css";

function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: urlId } = useParams(); // Get ID dari URL params
  const { orderId: stateOrderId, items: initialItems, total: initialTotal } = location.state || {};
  
  // Gunakan URL ID jika ada, jika tidak gunakan dari location.state
  const orderId = urlId || stateOrderId;
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [items, setItems] = useState(initialItems || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);

  // Fetch transaction dari database berdasarkan orderId
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Jika ada token, coba fetch dari database
        if (token) {
          const response = await fetch(`http://localhost:5000/transactions/${orderId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setTransactionData(data.data);
              // Parse items dari database jika ada
              if (data.data.items) {
                if (typeof data.data.items === 'string') {
                  setItems(JSON.parse(data.data.items));
                } else {
                  setItems(data.data.items);
                }
              } else if (initialItems) {
                setItems(initialItems);
              }
              // Set total dari database
              if (data.data.total_amount) {
                setTotal(data.data.total_amount);
              }
              setLoading(false);
              return;
            }
          }
        }
        
        // Jika fetch gagal atau tidak ada token, gunakan data dari location.state
        console.log("Menggunakan data dari cache (location.state)");
        if (initialItems) setItems(initialItems);
        if (initialTotal) setTotal(initialTotal);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        // Fallback ke data dari location.state
        if (initialItems) setItems(initialItems);
        if (initialTotal) setTotal(initialTotal);
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [orderId, initialItems, initialTotal]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!orderId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Tidak ada data pesanan.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading struk...</div>
      </div>
    );
  }

  const currentDate = new Date();
  
  // Gunakan tanggal dari database jika ada, jika tidak gunakan tanggal sekarang
  let receiptDate, receiptTime;
  if (transactionData && transactionData.created_at) {
    const dbDate = new Date(transactionData.created_at);
    receiptDate = dbDate.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    receiptTime = dbDate.toLocaleTimeString("id-ID");
  } else {
    receiptDate = currentDate.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    receiptTime = currentDate.toLocaleTimeString("id-ID");
  }

  return (
    <div className="receipt-wrapper">
      <div className="receipt-container">
        <div id="receipt-content" className="receipt-content">
          {/* Header */}
          <div className="receipt-header">
            <div className="receipt-logo">📚</div>
            <h1>Toko Buku Digital</h1>
            <p className="receipt-subtitle">Belanja Buku Cerita Anak Indonesia</p>
          </div>

          {/* Divider */}
          <div className="receipt-divider"></div>

          {/* Order Info */}
          <div className="receipt-info">
            <div className="info-row">
              <span className="label">No. Pesanan</span>
              <span className="value">#{orderId}</span>
            </div>
            {transactionData && transactionData.transaction_code && (
              <div className="info-row">
                <span className="label">Kode Transaksi</span>
                <span className="value">{transactionData.transaction_code}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Tanggal</span>
              <span className="value">{receiptDate}</span>
            </div>
            <div className="info-row">
              <span className="label">Waktu</span>
              <span className="value">{receiptTime}</span>
            </div>
            {transactionData && transactionData.status && (
              <div className="info-row">
                <span className="label">Status</span>
                <span className="value" style={{ 
                  color: transactionData.status === 'completed' ? '#4caf50' : '#ff9800',
                  fontWeight: 'bold'
                }}>
                  {transactionData.status === 'completed' ? '✅ Selesai' : transactionData.status.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="receipt-divider"></div>

          {/* Items */}
          <div className="receipt-items-header">
            <div className="item-col-1">Buku</div>
            <div className="item-col-2">Qty</div>
            <div className="item-col-3">Harga</div>
            <div className="item-col-4">Total</div>
          </div>

          <div className="receipt-items">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="item-col-1">
                    <p className="item-title">{item.title}</p>
                    <p className="item-author">{item.author}</p>
                  </div>
                  <div className="item-col-2">{item.quantity || 1}</div>
                  <div className="item-col-3">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                  <div className="item-col-4">
                    Rp {(item.price * (item.quantity || 1)).toLocaleString("id-ID")}
                  </div>
                </div>
              ))
            ) : (
              <div className="receipt-item">
                <p>Tidak ada item</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="receipt-divider"></div>

          {/* Summary */}
          <div className="receipt-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="summary-row">
              <span>Pajak (10%)</span>
              <span>Rp {Math.round(total * 0.1).toLocaleString("id-ID")}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Pembayaran</span>
              <span>Rp {Math.round(total * 1.1).toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="receipt-divider"></div>

          {/* Payment Info */}
          <div className="payment-info">
            <div className="payment-row">
              <span className="label">Metode Pembayaran</span>
              <span className="value">Tunai / Transfer</span>
            </div>
            <div className="payment-row">
              <span className="label">Status</span>
              <span className="value">✅ DITERIMA</span>
            </div>
          </div>

          {/* Divider */}
          <div className="receipt-divider"></div>

          {/* Footer */}
          <div className="receipt-footer">
            <p>Terima kasih telah berbelanja! 🙏</p>
            <p className="footer-text">
              Pesanan Anda akan diproses dalam 1-2 hari kerja
            </p>
            <p className="footer-text">
              Untuk pertanyaan, hubungi: support@tokobukudigital.com
            </p>
            <div className="barcode">
              <p>▄▀▀▀▄ ▄▀▀▀▄ Order ID: {orderId}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions">
          <button className="btn btn-print" onClick={handlePrint}>
            🖨️ Cetak
          </button>
          <button className="btn btn-back" onClick={handleBackToDashboard}>
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
