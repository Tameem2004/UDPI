import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { udpiId } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("ID");
    const collection = db.collection("UDPI_ID");

    // Check if udpiId already exists
    const existing = await collection.findOne({ udpiId });

    if (existing) {
      return NextResponse.json({ success: false, message: "UDPI ID already exists" }, { status: 409 });
    }

    // If not, insert new
    await collection.insertOne({ udpiId, createdAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
