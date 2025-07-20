import { Product, Category, BlogPost } from "@/app/types";

export const mockCategories: Category[] = [
  {
    id: "1",
    name_en: "Clothing",
    name_lt: "Drabužiai",
    slug: "clothing",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name_en: "Shoes",
    name_lt: "Batai",
    slug: "shoes",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name_en: "Accessories",
    name_lt: "Aksesuarai",
    slug: "accessories",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name_en: "Electronics",
    name_lt: "Elektronika",
    slug: "electronics",
    created_at: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    title_en: "Classic T-Shirt",
    title_lt: "Klasikinis marškinėliai",
    description_en:
      "Comfortable cotton t-shirt perfect for everyday wear. Made from premium organic cotton with a relaxed fit.",
    description_lt:
      "Patogūs medvilniniai marškinėliai kasdieniam nešiojimui. Pagaminti iš aukščiausios kokybės organinės medvilnės su laisvu kroju.",
    price: 29.99,
    stock: 50,
    category_id: "1",
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341338985-0c2d36e66c1c?w=500",
    ],
    sizes: ["S", "M", "L", "XL"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: "2",
    title_en: "Running Shoes",
    title_lt: "Bėgimo batai",
    description_en:
      "High-performance running shoes designed for comfort and durability. Features advanced cushioning technology.",
    description_lt:
      "Aukštos kokybės bėgimo batai, sukurti patogumui ir ilgaamžiškumui. Su pažangūs amortizavimo technologija.",
    price: 89.99,
    stock: 30,
    category_id: "2",
    image_url:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: "3",
    title_en: "Leather Wallet",
    title_lt: "Odinė piniginė",
    description_en:
      "Premium leather wallet with multiple compartments for cards and cash. Handcrafted from genuine Italian leather.",
    description_lt:
      "Aukščiausios kokybės odinė piniginė su keliais skyriais kortelėms ir grynajiem pinigam. Rankų darbo iš tikros italų odos.",
    price: 49.99,
    stock: 25,
    category_id: "3",
    image_url:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    ],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: "4",
    title_en: "Wireless Headphones",
    title_lt: "Belaidės ausinės",
    description_en:
      "High-quality wireless headphones with active noise cancellation and superior sound quality.",
    description_lt:
      "Aukštos kokybės belaidės ausinės su aktyviu triukšmo slopinimu ir puikiu garso kokybe.",
    price: 199.99,
    stock: 15,
    category_id: "4",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
    ],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
  {
    id: "5",
    title_en: "Denim Jacket",
    title_lt: "Džinsinė striukė",
    description_en:
      "Vintage-style denim jacket made from premium denim. Perfect for layering in any season.",
    description_lt:
      "Vintažinio stiliaus džinsinė striukė iš aukščiausios kokybės džinso audinio. Tobula sluoksniuotam rengimui bet kuriuo metu.",
    price: 79.99,
    stock: 20,
    category_id: "1",
    image_url:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: "6",
    title_en: "Smart Watch",
    title_lt: "Išmanusis laikrodis",
    description_en:
      "Feature-rich smartwatch with fitness tracking, heart rate monitoring, and smartphone connectivity.",
    description_lt:
      "Funkcijų pilnas išmanusis laikrodis su fizinio aktyvumo stebėjimu, širdies ritmo kontrole ir išmaniojo telefono ryšiu.",
    price: 299.99,
    stock: 12,
    category_id: "4",
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    ],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
  {
    id: "7",
    title_en: "Canvas Sneakers",
    title_lt: "Drobės sportbačiai",
    description_en:
      "Classic canvas sneakers with rubber sole. Comfortable and stylish for casual wear.",
    description_lt:
      "Klasikiniai drobės sportbačiai su guminis padžiu. Patogūs ir stilingi kasdieniam nešiojimui.",
    price: 45.99,
    stock: 35,
    category_id: "2",
    image_url:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500",
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500",
    ],
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: "8",
    title_en: "Sunglasses",
    title_lt: "Saulės akiniai",
    description_en:
      "Stylish sunglasses with UV protection and polarized lenses. Perfect for sunny days.",
    description_lt:
      "Stilingi saulės akiniai su UV apsauga ir polarizuotais stiklais. Tobuli saulėtoms dienoms.",
    price: 69.99,
    stock: 28,
    category_id: "3",
    image_url:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    ],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title_en: "Summer Fashion Trends 2024",
    title_lt: "2024 metų vasaros mados tendencijos",
    content_en: "Discover the hottest fashion trends for summer 2024...",
    content_lt: "Atraskite karščiausias 2024 metų vasaros mados tendencijas...",
    slug: "summer-fashion-trends-2024",
    author_id: "1",
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !!(
    url &&
    key &&
    url !== "https://your-project.supabase.co" &&
    key !== "your-anon-key" &&
    url.includes("supabase.co")
  );
}
