-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  language_preference TEXT NOT NULL DEFAULT 'en' CHECK (language_preference IN ('en', 'lt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_lt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_lt TEXT NOT NULL,
  description_en TEXT,
  description_lt TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'lt')),
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table (for guest carts and persistence)
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_lt TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_lt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'lt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products table policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories table policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders table policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items table policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cart items table policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Blog posts table policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admin can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact messages table policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions and Triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Categories
INSERT INTO categories (name_en, name_lt, slug) VALUES
('Clothing', 'Drabužiai', 'clothing'),
('Shoes', 'Batai', 'shoes'),
('Accessories', 'Aksesuarai', 'accessories'),
('Electronics', 'Elektronika', 'electronics');

-- Sample products
INSERT INTO products (title_en, title_lt, description_en, description_lt, price, stock, category_id, image_url, images, sizes) VALUES
('Classic T-Shirt', 'Klasikinis marškinėliai', 'Comfortable cotton t-shirt perfect for everyday wear', 'Patogūs medvilniniai marškinėliai kasdieniam nešiojimui', 29.99, 50, (SELECT id FROM categories WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], ARRAY['S', 'M', 'L', 'XL']),
('Running Shoes', 'Bėgimo batai', 'High-performance running shoes for athletes', 'Aukštos kokybės bėgimo batai sportininkams', 89.99, 30, (SELECT id FROM categories WHERE slug = 'shoes'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], ARRAY['39', '40', '41', '42', '43', '44', '45']),
('Leather Wallet', 'Odinė piniginė', 'Premium leather wallet with multiple compartments', 'Aukščiausios kokybės odinė piniginė su keliais skyriais', 49.99, 25, (SELECT id FROM categories WHERE slug = 'accessories'), 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'], ARRAY[]),
('Wireless Headphones', 'Belaidės ausinės', 'High-quality wireless headphones with noise cancellation', 'Aukštos kokybės belaidės ausinės su triukšmo slopinimu', 199.99, 15, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], ARRAY[]);
