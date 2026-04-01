#!/bin/bash
# Test API Produk

echo "=== TEST API PRODUK ==="
echo ""

# 1. Get token dulu
echo "1️⃣ Login sebagai admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# 2. Get semua produk
echo "2️⃣ Get semua produk..."
curl -s http://localhost:5000/products | jq '.[0:2]'
echo ""

# 3. Add produk baru
echo "3️⃣ Add produk baru..."
curl -s -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Produk",
    "author": "Test Author",
    "category": "Test",
    "price": 50000,
    "stock": 10
  }' | jq '.'
echo ""

# 4. Check produk lagi
echo "4️⃣ Check produk setelah add..."
curl -s http://localhost:5000/products | jq '.[-1]'
