import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ensureDatabaseSeeded } from "@/lib/seed";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await connectToDatabase();

    if (db) {
      await ensureDatabaseSeeded();

      const user = await UserModel.findOne({ email: cleanEmail });
      if (user && user.active) {
        // Check hash
        const hashedInput = hashPassword(password);
        // Also support default seeded demo password "admin123"
        const isValid =
          user.passwordHash === hashedInput ||
          (cleanEmail === "admin@dentora.example" && password === "admin123");

        if (isValid) {
          const token = signSession({
            userId: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
          });

          const response = NextResponse.json({
            success: true,
            data: {
              email: user.email,
              name: user.name,
              role: user.role,
            },
          });

          response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });

          return response;
        }
      }

      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Offline / Demo fallback authentication for "admin@dentora.example" / "admin123"
    if (cleanEmail === "admin@dentora.example" && password === "admin123") {
      const token = signSession({
        userId: "demo-admin-id",
        email: "admin@dentora.example",
        name: "Clinic Administrator (Demo)",
        role: "admin",
      });

      const response = NextResponse.json({
        success: true,
        data: {
          email: "admin@dentora.example",
          name: "Clinic Administrator (Demo)",
          role: "admin",
        },
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service error." },
      { status: 500 }
    );
  }
}
