import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, items, total } = location.state || {};
  const [isPrinting, setIsPrinting] = useState(false);

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
    return null;
  }

  const currentDate = new Date();
  const receiptDate = currentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const receiptTime = currentDate.toLocaleTimeString("id-ID");

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
            <div className="info-row">
              <span className="label">Tanggal</span>
              <span className="value">{receiptDate}</span>
            </div>
            <div className="info-row">
              <span className="label">Waktu</span>
              <span className="value">{receiptTime}</span>
            </div>
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
            {items &&
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
              ))}
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
