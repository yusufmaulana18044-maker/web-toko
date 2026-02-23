const express = require("express");
const router = express.Router();

// GET semua transactions (admin melihat semua, user melihat milik sendiri)
router.get("/", async (req, res) => {
  try {
    const transactions = [
      {
        id: 1,
        user_id: 2,
        transaction_code: "TRX-001-2026",
        total_amount: 150000,
        status: "pending",
        payment_method: "transfer",
        shipping_address: "Jl. Merdeka No.123, Jakarta",
        items: [
          {
            id: 1,
            product_id: 1,
            quantity: 2,
            unit_price: 75000,
            subtotal: 150000
          }
        ],
        created_at: "2026-02-05T10:30:00Z",
        updated_at: "2026-02-05T10:30:00Z"
      },
      {
        id: 2,
        user_id: 2,
        transaction_code: "TRX-002-2026",
        total_amount: 130000,
        status: "paid",
        payment_method: "cash",
        shipping_address: "Jl. Merdeka No.123, Jakarta",
        items: [
          {
            id: 2,
            product_id: 3,
            quantity: 1,
            unit_price: 80000,
            subtotal: 80000
          },
          {
            id: 3,
            product_id: 5,
            quantity: 1,
            unit_price: 50000,
            subtotal: 50000
          }
        ],
        created_at: "2026-02-04T15:45:00Z",
        updated_at: "2026-02-04T16:20:00Z"
      }
    ];

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// GET transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = {
      id: parseInt(id),
      user_id: 2,
      transaction_code: `TRX-${id.padStart(3, "0")}-2026`,
      total_amount: 150000,
      status: "pending",
      payment_method: "transfer",
      shipping_address: "Jl. Merdeka No.123, Jakarta",
      notes: "Mohon dibungkus rapi",
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: "Cerita Rakyat Nusantara",
          quantity: 2,
          unit_price: 75000,
          subtotal: 150000
        }
      ],
      created_at: "2026-02-05T10:30:00Z",
      updated_at: "2026-02-05T10:30:00Z"
    };

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// POST create new transaction
router.post("/", async (req, res) => {
  try {
    const { user_id, items, shipping_address, payment_method, notes } = req.body;

    if (!user_id || !items || items.length === 0 || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: "user_id, items, dan shipping_address wajib diisi"
      });
    }

    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const newTransaction = {
      id: Date.now(),
      user_id,
      transaction_code: `TRX-${Date.now()}-2026`,
      total_amount,
      status: "pending",
      payment_method: payment_method || "pending",
      shipping_address,
      notes,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: newTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// PUT update transaction status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method, notes } = req.body;

    const validStatus = ["pending", "paid", "shipped", "delivered", "cancelled"];
    
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatus.join(", ")}`
      });
    }

    const updatedTransaction = {
      id: parseInt(id),
      user_id: 2,
      transaction_code: `TRX-${id.padStart(3, "0")}-2026`,
      total_amount: 150000,
      status: status || "pending",
      payment_method: payment_method || "transfer",
      shipping_address: "Jl. Merdeka No.123, Jakarta",
      notes,
      items: [
        {
          id: 1,
          product_id: 1,
          quantity: 2,
          unit_price: 75000,
          subtotal: 150000
        }
      ],
      created_at: "2026-02-05T10:30:00Z",
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: "Transaksi berhasil diupdate",
      data: updatedTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// DELETE cancel transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: "Transaksi berhasil dibatalkan"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
