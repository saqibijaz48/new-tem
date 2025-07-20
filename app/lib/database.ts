import { supabase } from "./supabase";
import {
  Product,
  Category,
  Order,
  User,
  BlogPost,
  ContactMessage,
} from "@/app/types";
import {
  mockProducts,
  mockCategories,
  mockBlogPosts,
  isSupabaseConfigured,
} from "./mockData";

// Product operations
export async function getProducts(
  language: "en" | "lt" = "en",
): Promise<Product[]> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, using mock data");
    return mockProducts;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Supabase error fetching products:",
        error.message,
        error.details,
      );
      // Fallback to mock data on error
      return mockProducts;
    }

    return data as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to mock data on error
    return mockProducts;
  }
}

export async function getProduct(id: string): Promise<Product> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Supabase error fetching product:",
        error.message,
        error.details,
      );
      // Fallback to mock data
      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }

    return data as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Fallback to mock data
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return mockProducts.filter(
      (product) => product.category?.slug === categorySlug,
    );
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .eq("category.slug", categorySlug);

    if (error) {
      console.error(
        "Supabase error fetching products by category:",
        error.message,
        error.details,
      );
      // Fallback to mock data
      return mockProducts.filter(
        (product) => product.category?.slug === categorySlug,
      );
    }

    return data as Product[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    // Fallback to mock data
    return mockProducts.filter(
      (product) => product.category?.slug === categorySlug,
    );
  }
}

// Category operations
export async function getCategories(): Promise<Category[]> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, using mock categories");
    return mockCategories;
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name_en");

    if (error) {
      console.error(
        "Supabase error fetching categories:",
        error.message,
        error.details,
      );
      // Fallback to mock data
      return mockCategories;
    }

    return data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to mock data
    return mockCategories;
  }
}

// Order operations
export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  if (!isSupabaseConfigured()) {
    throw new Error("Orders functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Orders functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(
        *,
        product:products(*)
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Orders functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(
        *,
        product:products(*)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<Order> {
  if (!isSupabaseConfigured()) {
    throw new Error("Orders functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// Blog operations
export async function getBlogPosts(published = true): Promise<BlogPost[]> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return mockBlogPosts.filter((post) => !published || post.is_published);
  }

  try {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (published) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        "Supabase error fetching blog posts:",
        error.message,
        error.details,
      );
      // Fallback to mock data
      return mockBlogPosts.filter((post) => !published || post.is_published);
    }

    return data as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Fallback to mock data
    return mockBlogPosts.filter((post) => !published || post.is_published);
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const post = mockBlogPosts.find((p) => p.slug === slug);
    if (!post) throw new Error("Blog post not found");
    return post;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(
        "Supabase error fetching blog post:",
        error.message,
        error.details,
      );
      // Fallback to mock data
      const post = mockBlogPosts.find((p) => p.slug === slug);
      if (!post) throw new Error("Blog post not found");
      return post;
    }

    return data as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    // Fallback to mock data
    const post = mockBlogPosts.find((p) => p.slug === slug);
    if (!post) throw new Error("Blog post not found");
    return post;
  }
}

// Contact operations
export async function createContactMessage(
  messageData: Partial<ContactMessage>,
): Promise<ContactMessage> {
  if (!isSupabaseConfigured()) {
    throw new Error("Contact functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Contact functionality requires Supabase configuration");
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ContactMessage[];
}

// User operations
export async function getUsers(): Promise<User[]> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "User management functionality requires Supabase configuration",
    );
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as User[];
}

export async function updateUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<User> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "User management functionality requires Supabase configuration",
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Search functionality
export async function searchProducts(
  query: string,
  language: "en" | "lt" = "en",
): Promise<Product[]> {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const titleKey = language === "en" ? "title_en" : "title_lt";
    const descriptionKey =
      language === "en" ? "description_en" : "description_lt";

    return mockProducts.filter(
      (product) =>
        product[titleKey].toLowerCase().includes(query.toLowerCase()) ||
        product[descriptionKey].toLowerCase().includes(query.toLowerCase()),
    );
  }

  try {
    const titleColumn = language === "en" ? "title_en" : "title_lt";
    const descriptionColumn =
      language === "en" ? "description_en" : "description_lt";

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .or(
        `${titleColumn}.ilike.%${query}%,${descriptionColumn}.ilike.%${query}%`,
      );

    if (error) {
      console.error(
        "Supabase error searching products:",
        error.message,
        error.details,
      );
      // Fallback to mock data search
      const titleKey = language === "en" ? "title_en" : "title_lt";
      const descriptionKey =
        language === "en" ? "description_en" : "description_lt";

      return mockProducts.filter(
        (product) =>
          product[titleKey].toLowerCase().includes(query.toLowerCase()) ||
          product[descriptionKey].toLowerCase().includes(query.toLowerCase()),
      );
    }

    return data as Product[];
  } catch (error) {
    console.error("Error searching products:", error);
    // Fallback to mock data search
    const titleKey = language === "en" ? "title_en" : "title_lt";
    const descriptionKey =
      language === "en" ? "description_en" : "description_lt";

    return mockProducts.filter(
      (product) =>
        product[titleKey].toLowerCase().includes(query.toLowerCase()) ||
        product[descriptionKey].toLowerCase().includes(query.toLowerCase()),
    );
  }
}
