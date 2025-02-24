import { NextResponse } from "next/server";
import { admin } from "../../../lib/firebaseAdmin";

export const config = {
  runtime: "nodejs", 
};

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify the token with firebase-admin
    await admin.auth().verifyIdToken(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to verify token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
