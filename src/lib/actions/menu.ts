"use server";

import dbConnect from "@/lib/db";
import MenuItem from "@/lib/models/MenuItem";
import Category from "@/lib/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMenuItems(categorySlug?: string) {
  await dbConnect();
  const query: any = { isAvailable: true };
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug, isActive: true });
    if (category) query.category = category._id;
  }
  const items = await MenuItem.find(query)
    .populate("category", "name slug")
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getAllMenuItems() {
  await dbConnect();
  const items = await MenuItem.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getCategories() {
  await dbConnect();
  const categories = await Category.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function getAllCategories() {
  await dbConnect();
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function createMenuItem(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const item = await MenuItem.create(data);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return JSON.parse(JSON.stringify(item));
}

export async function updateMenuItem(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const item = await MenuItem.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return JSON.parse(JSON.stringify(item));
}

export async function deleteMenuItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  await MenuItem.findByIdAndDelete(id);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function createCategory(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const category = await Category.create(data);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return JSON.parse(JSON.stringify(category));
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}
