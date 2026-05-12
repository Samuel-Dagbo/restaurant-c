import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI environment variable is not set.");
  console.error("Make sure you have a .env.local file with your MongoDB connection string.");
  process.exit(1);
}

// ---- Schemas (inline to avoid import complexities) ----

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, default: "" },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    spicyLevel: { type: Number, min: 0, max: 5 },
    preparationTime: { type: Number },
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        name: String,
        quantity: Number,
        price: Number,
        note: String,
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cash", "card", "online"], default: "cash" },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    deliveryAddress: { type: String },
    specialInstructions: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// ---- Seed Data ----

const categories = [
  {
    name: "Starters",
    slug: "starters",
    description: "Light and elegant beginnings to your culinary journey",
    order: 1,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  },
  {
    name: "Main Courses",
    slug: "main-courses",
    description: "Hearty and exquisite centerpiece dishes",
    order: 2,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  },
  {
    name: "Seafood",
    slug: "seafood",
    description: "Fresh catches from the deepest oceans",
    order: 3,
    image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80",
  },
  {
    name: "Desserts",
    slug: "desserts",
    description: "Sweet endings to remember",
    order: 4,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Curated drinks and premium selections",
    order: 5,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  },
];

const menuItems = [
  // ---- Starters ----
  {
    name: "Tuna Tartare",
    description: "Fresh ahi tuna with avocado mousse, sesame crisps, and yuzu dressing",
    price: 24,
    originalPrice: 28,
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&q=80",
    tags: ["popular", "signature"],
    featured: true,
    spicyLevel: 1,
    preparationTime: 15,
    categorySlug: "starters",
  },
  {
    name: "Burrata Salad",
    description: "Creamy burrata with heirloom tomatoes, basil pesto, and aged balsamic",
    price: 19,
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80",
    tags: ["vegetarian"],
    featured: false,
    preparationTime: 10,
    categorySlug: "starters",
  },
  {
    name: "French Onion Soup",
    description: "Caramelized onion soup with gruyère crouton and fresh thyme",
    price: 16,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    tags: ["classic"],
    featured: false,
    preparationTime: 20,
    categorySlug: "starters",
  },
  {
    name: "Crispy Calamari",
    description: "Lightly battered calamari with spicy marinara and lemon aioli",
    price: 18,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80",
    tags: ["shareable"],
    featured: false,
    spicyLevel: 2,
    preparationTime: 12,
    categorySlug: "starters",
  },

  // ---- Main Courses ----
  {
    name: "Wagyu Beef Steak",
    description: "8oz A5 Wagyu with truffle mash, roasted vegetables, and red wine jus",
    price: 89,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
    tags: ["signature", "premium"],
    featured: true,
    spicyLevel: 0,
    preparationTime: 25,
    categorySlug: "main-courses",
  },
  {
    name: "Herb Crusted Lamb Rack",
    description: "New Zealand lamb with rosemary crust, dauphinoise potatoes, and mint gel",
    price: 54,
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=600&q=80",
    tags: ["popular"],
    featured: true,
    preparationTime: 30,
    categorySlug: "main-courses",
  },
  {
    name: "Truffle Mushroom Risotto",
    description: "Arborio rice with wild mushrooms, black truffle, and parmesan foam",
    price: 32,
    originalPrice: 36,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    tags: ["vegetarian", "chefs-special"],
    featured: true,
    preparationTime: 25,
    categorySlug: "main-courses",
  },
  {
    name: "Free Range Chicken Supreme",
    description: "Corn-fed chicken with morel cream sauce, asparagus, and pomme purée",
    price: 38,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80",
    tags: ["classic"],
    featured: false,
    preparationTime: 25,
    categorySlug: "main-courses",
  },

  // ---- Seafood ----
  {
    name: "Lobster Thermidor",
    description: "Whole lobster with classic thermidor sauce, gratinated with gruyère",
    price: 72,
    image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&q=80",
    tags: ["premium", "signature"],
    featured: true,
    preparationTime: 30,
    categorySlug: "seafood",
  },
  {
    name: "Pan Seared Sea Bass",
    description: "Mediterranean sea bass with saffron broth, fennel, and olive tapenade",
    price: 44,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    tags: ["popular"],
    featured: false,
    preparationTime: 20,
    categorySlug: "seafood",
  },
  {
    name: "Grilled Octopus",
    description: "Charred octopus with smoked paprika, chorizo crumb, and pickled onions",
    price: 36,
    image: "https://images.unsplash.com/photo-1593510987046-1fd110e30b6f?w=600&q=80",
    tags: ["shareable"],
    featured: false,
    spicyLevel: 2,
    preparationTime: 20,
    categorySlug: "seafood",
  },
  {
    name: "Oysters Rockefeller",
    description: "Half dozen fresh oysters with spinach, pernod, and hollandaise",
    price: 28,
    image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80",
    tags: ["appetizer"],
    featured: false,
    preparationTime: 15,
    categorySlug: "seafood",
  },

  // ---- Desserts ----
  {
    name: "Dark Chocolate Soufflé",
    description: "Valrhona chocolate soufflé with vanilla bean crème anglaise",
    price: 18,
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=80",
    tags: ["signature", "must-try"],
    featured: true,
    preparationTime: 20,
    categorySlug: "desserts",
  },
  {
    name: "Crème Brûlée",
    description: "Classic vanilla crème brûlée with caramelized sugar and fresh berries",
    price: 14,
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&q=80",
    tags: ["classic"],
    featured: false,
    preparationTime: 5,
    categorySlug: "desserts",
  },
  {
    name: "Passion Fruit Panna Cotta",
    description: "Silky panna cotta with passion fruit coulis and coconut tuile",
    price: 16,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    tags: ["refreshing"],
    featured: false,
    preparationTime: 5,
    categorySlug: "desserts",
  },

  // ---- Beverages ----
  {
    name: "Signature Cocktail - Savory Spritz",
    description: "Prosecco, aperol, elderflower, fresh grapefruit, and rosemary",
    price: 18,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    tags: ["signature"],
    featured: true,
    preparationTime: 5,
    categorySlug: "beverages",
  },
  {
    name: "Premium Wine Collection",
    description: "Curated selection from our sommelier — ask for today's recommendation",
    price: 22,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    tags: ["premium"],
    featured: false,
    preparationTime: 3,
    categorySlug: "beverages",
  },
  {
    name: "Artisan Coffee",
    description: "Single origin pour-over or classic espresso — served with petit fours",
    price: 8,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    tags: ["classic"],
    featured: false,
    preparationTime: 8,
    categorySlug: "beverages",
  },
  {
    name: "Fresh Pressed Juices",
    description: "Seasonal fruit and vegetable blends — orange, carrot-ginger, or green detox",
    price: 10,
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80",
    tags: ["healthy"],
    featured: false,
    preparationTime: 5,
    categorySlug: "beverages",
  },
];

// ---- Seed Function ----

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.\n");

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("Cleared.\n");

    // Create users
    console.log("Creating users...");
    const adminPassword = await bcrypt.hash("admin123", 12);
    const userPassword = await bcrypt.hash("user123", 12);

    const admin = await User.create({
      name: "Admin",
      email: "admin@savory.com",
      password: adminPassword,
      role: "admin",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    });

    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      role: "user",
    });
    console.log(`  Admin: admin@savory.com / admin123`);
    console.log(`  User:  john@example.com / user123\n`);

    // Create categories
    console.log("Creating categories...");
    const createdCategories: Record<string, any> = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories[cat.slug] = created;
      console.log(`  ${cat.name}`);
    }

    // Create menu items
    console.log("\nCreating menu items...");
    for (const item of menuItems) {
      const { categorySlug, ...itemData } = item;
      await MenuItem.create({
        ...itemData,
        category: createdCategories[categorySlug]._id,
      });
      console.log(`  ${item.name}`);
    }

    // Create a sample order for the user
    const allMenuItems = await MenuItem.find().limit(3);
    const sampleItems = allMenuItems.map((m) => ({
      menuItem: m._id,
      name: m.name,
      quantity: 1,
      price: m.price,
    }));
    const subtotal = sampleItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + tax;

    await Order.create({
      user: user._id,
      items: sampleItems,
      subtotal,
      tax,
      total,
      status: "delivered",
      paymentMethod: "card",
      paymentStatus: "paid",
    });

    await Order.create({
      user: user._id,
      items: sampleItems.slice(0, 1),
      subtotal: sampleItems[0].price,
      tax: Math.round(sampleItems[0].price * 0.08 * 100) / 100,
      total: sampleItems[0].price + Math.round(sampleItems[0].price * 0.08 * 100) / 100,
      status: "preparing",
      paymentMethod: "cash",
      paymentStatus: "pending",
    });

    console.log(`\nSample orders created for john@example.com`);
    console.log("\n✓ Seed complete!");
    console.log("\nLogin credentials:");
    console.log("  Admin: admin@savory.com / admin123");
    console.log("  User:  john@example.com / user123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
