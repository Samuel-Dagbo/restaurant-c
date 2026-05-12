"use server";

import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  items: { menuItem: string; name: string; quantity: number; price: number; note?: string }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  phone?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  const order = await Order.create({
    user: (session.user as any).id,
    ...data,
    status: "pending",
    paymentStatus: "pending",
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/admin/orders");
  return JSON.parse(JSON.stringify(order));
}

export async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  const orders = await Order.find({ user: (session.user as any).id })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
}

export async function getAllOrders() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await dbConnect();
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await dbConnect();
  await Order.findByIdAndUpdate(orderId, { status });
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await dbConnect();
  await Order.findByIdAndUpdate(orderId, { paymentStatus });
  revalidatePath("/admin/orders");
}
