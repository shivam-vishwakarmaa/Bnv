require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bnv-reviews';

const products = [
  { name: 'Organic Honey', slug: 'organic-honey', category: 'Pantry', price: 45000, weight: '500g', imageUrl: 'https://images.unsplash.com/photo-1587049352847-8d4e8941554a?w=400&q=80' },
  { name: 'Whole Wheat Bread', slug: 'whole-wheat-bread', category: 'Bakery', price: 6000, weight: '400g', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { name: 'Almond Butter', slug: 'almond-butter', category: 'Pantry', price: 85000, weight: '350g', imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80' },
  { name: 'Fresh Strawberries', slug: 'fresh-strawberries', category: 'Produce', price: 20000, weight: '250g', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80' },
  { name: 'Greek Yogurt', slug: 'greek-yogurt', category: 'Dairy', price: 15000, weight: '400g', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
  { name: 'Oat Milk', slug: 'oat-milk', category: 'Dairy', price: 30000, weight: '1L', imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&q=80' },
  { name: 'Green Tea Leaves', slug: 'green-tea-leaves', category: 'Beverages', price: 40000, weight: '100g', imageUrl: 'https://images.unsplash.com/photo-1627492275512-4ca107f5b3e6?w=400&q=80' },
  { name: 'Avocado', slug: 'avocado', category: 'Produce', price: 10000, weight: '1 pc', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
  { name: 'Quinoa', slug: 'quinoa', category: 'Pantry', price: 35000, weight: '500g', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&q=80' },
  { name: 'Cheddar Cheese', slug: 'cheddar-cheese', category: 'Dairy', price: 25000, weight: '200g', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80' },
  { name: 'Coffee Beans', slug: 'coffee-beans', category: 'Beverages', price: 75000, weight: '250g', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80' },
  { name: 'Extra Virgin Olive Oil', slug: 'olive-oil', category: 'Pantry', price: 120000, weight: '500ml', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
  { name: 'Sourdough Loaf', slug: 'sourdough-loaf', category: 'Bakery', price: 12000, weight: '500g', imageUrl: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80' },
  { name: 'Cherry Tomatoes', slug: 'cherry-tomatoes', category: 'Produce', price: 18000, weight: '250g', imageUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&q=80' },
  { name: 'Croissant', slug: 'croissant', category: 'Bakery', price: 8000, weight: '1 pc', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' }
];

const reviewerNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"];
const titles = ["Great!", "Not bad", "Terrible", "Could be better", "Amazing product", "Will buy again", "Disappointed", "Just okay", "Loved it!", "Poor quality"];
const bodies = [
  "I really enjoyed this product. It exceeded my expectations.",
  "It was okay, but I've had better.",
  "Completely useless. Do not buy.",
  "It's decent for the price.",
  "Absolutely fantastic! Highly recommend.",
  "Good, but shipping took a while.",
  "The packaging was damaged, but the product is fine.",
  "Doesn't taste as good as I hoped.",
  "My family loves this.",
  "Way overpriced for what you get."
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data.');

    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products.`);

    const reviews = [];
    
    // Generate ~40 reviews
    for (let i = 0; i < 40; i++) {
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const randomName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
      const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
      
      // Weight ratings so it's not all 5s (1 to 5)
      const randomNum = Math.random();
      let rating;
      if (randomNum < 0.1) rating = 1; // 10%
      else if (randomNum < 0.2) rating = 2; // 10%
      else if (randomNum < 0.4) rating = 3; // 20%
      else if (randomNum < 0.7) rating = 4; // 30%
      else rating = 5; // 30%

      reviews.push(new Review({
        productId: randomProduct._id,
        reviewerName: randomName,
        reviewerEmail: randomEmail,
        rating: rating,
        title: titles[Math.floor(Math.random() * titles.length)],
        body: bodies[Math.floor(Math.random() * bodies.length)],
        verifiedPurchase: Math.random() > 0.5,
        helpfulVotes: Math.floor(Math.random() * 10)
      }));
    }

    // Save reviews one by one to trigger the post-save hook
    let reviewCount = 0;
    for (const review of reviews) {
      try {
        await review.save();
        reviewCount++;
      } catch (err) {
        if (err.code !== 11000) {
          console.error("Error saving review:", err);
        }
      }
    }
    
    console.log(`Inserted ${reviewCount} reviews and updated product aggregates.`);

    // Verify products have aggregated data
    const updatedProducts = await Product.find({});
    console.log("Sample Product Aggregates:");
    updatedProducts.slice(0, 3).forEach(p => {
      console.log(`- ${p.name}: ${p.averageRating} stars (${p.reviewCount} reviews)`);
    });

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
