import { supabase } from "./supabase";
import {
  Product,
  Category,
  Order,
  User,
  BlogPost,
  ContactMessage,
} from "@/app/types";

// Product operations
export async function getProducts(language: "en" | "lt" = "en") {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProduct(id: string) {
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

  if (error) throw error;
  return data as Product;
}

export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .eq("category.slug", categorySlug);

  if (error) throw error;
  return data as Product[];
}

// Category operations
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_en");

  if (error) throw error;
  return data as Category[];
}

// Order operations
export async function createOrder(orderData: Partial<Order>) {
  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getOrders(userId: string) {
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

export async function getAllOrders() {
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

export async function updateOrderStatus(orderId: string, status: string) {
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
export async function getBlogPosts(published = true) {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (published) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as BlogPost;
}

// Contact operations
export async function createContactMessage(
  messageData: Partial<ContactMessage>,
) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ContactMessage[];
}

// User operations
export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as User[];
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
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
) {
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

  if (error) throw error;
  return data as Product[];
}
