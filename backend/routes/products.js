const express = require("express");
const router = express.Router();

// GET semua buku (dari dummy data, bukan database)
router.get("/", async (req, res) => {
  try {
    const books = [
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
    ];
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
