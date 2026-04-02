/**
 * Script untuk setup dan seed Supabase dengan sample data produk
 */

const { supabase } = require('./db/supabase');

const seedProducts = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Sample categories
    const categories = [
      { name: 'Cerita Rakyat', slug: 'cerita-rakyat', description: 'Cerita tradisional Indonesia' },
      { name: 'Fabel', slug: 'fabel', description: 'Cerita dengan hikmah' },
      { name: 'Legenda', slug: 'legenda', description: 'Cerita legendaris' },
      { name: 'Petualangan', slug: 'petualangan', description: 'Cerita petualangan seru' },
      { name: 'Fantasi', slug: 'fantasi', description: 'Cerita dunia fantasi' },
      { name: 'Sejarah', slug: 'sejarah', description: 'Cerita bersejarah' },
    ];

    console.log('📝 Checking categories...');
    for (const category of categories) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (!existing) {
        const { data, error } = await supabase
          .from('categories')
          .insert([category])
          .select();

        if (error) {
          console.error(`❌ Error adding category ${category.name}:`, error.message);
        } else {
          console.log(`✅ Category added: ${category.name}`);
        }
      } else {
        console.log(`ℹ️  Category already exists: ${category.name}`);
      }
    }

    // Sample products
    const products = [
      { 
        title: 'Laskar Pelangi', 
        author: 'Andrea Hirata', 
        category: 'Sastra Anak', 
        price: 85000, 
        stock: 15, 
        image: '/images/book-1.jpg' 
      },
      { 
        title: 'Si Kancil Penggalau', 
        author: 'Suwardi', 
        category: 'Fabel', 
        price: 65000, 
        stock: 22, 
        image: '/images/book-2.jpg' 
      },
      { 
        title: 'Legenda Bukit Merah', 
        author: 'Suciwati', 
        category: 'Legenda', 
        price: 80000, 
        stock: 30, 
        image: '/images/book-3.jpg' 
      },
      { 
        title: 'Petualangan di Hutan Terlarang', 
        author: 'Enid Blyton (Adaptasi)', 
        category: 'Petualangan', 
        price: 75000, 
        stock: 18, 
        image: '/images/book-4.jpg' 
      },
      { 
        title: 'Kerajaan Batu Permata', 
        author: 'J.K. Rowling (Adaptasi)', 
        category: 'Fantasi', 
        price: 95000, 
        stock: 12, 
        image: '/images/book-5.jpg' 
      },
      { 
        title: 'Sejarah Indonesia Jilid 1', 
        author: 'Anri Wijaya', 
        category: 'Sejarah', 
        price: 120000, 
        stock: 8, 
        image: '/images/SEJARAH-INDONESIA-II.jpg' 
      },
    ];

    console.log('\n📚 Adding products...');
    for (const product of products) {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('title', product.title)
        .single();

      if (!existing) {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...product,
            price: parseInt(product.price),
            stock: parseInt(product.stock)
          }])
          .select();

        if (error) {
          console.error(`❌ Error adding product ${product.title}:`, error.message);
        } else {
          console.log(`✅ Product added: ${product.title}`);
        }
      } else {
        console.log(`ℹ️  Product already exists: ${product.title}`);
      }
    }

    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
};

seedProducts();
