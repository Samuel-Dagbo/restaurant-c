import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import MenuItem from "@/lib/models/MenuItem";
import Category from "@/lib/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    await dbConnect();

    const type = searchParams.get("type");
    if (type === "categories") {
      const categories = await Category.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean();
      return NextResponse.json(JSON.parse(JSON.stringify(categories)));
    }

    const category = searchParams.get("category");
    const query: any = {};
    if (category) query.category = category;
    const items = await MenuItem.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(JSON.parse(JSON.stringify(items)));
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    await dbConnect();

    if (data.type === "category") {
      const categoryData = { ...data };
      delete categoryData.type;
      const category = await Category.create(categoryData);
      return NextResponse.json(JSON.parse(JSON.stringify(category)), { status: 201 });
    }

    const item = await MenuItem.create(data);
    return NextResponse.json(JSON.parse(JSON.stringify(item)), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
