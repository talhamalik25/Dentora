import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { verifyPassword, hashPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { ensureDatabaseSeeded } from "@/lib/seed";

export async function POST(request: NextRequest) {
  // CSRF Origin verification
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site request forgery protection triggered." },
      { status: 403 }
    );
  }

  // Rate Limiting: 5 login attempts per minute per IP
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please wait 1 minute before trying again." },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const db = await connectToDatabase();

    // Fail closed if database is unavailable
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Authentication service unavailable. Database connection offline." },
        { status: 503 }
      );
    }

    await ensureDatabaseSeeded();

    const user = await UserModel.findOne({ email: cleanEmail });
    if (!user || !user.active) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password via Argon2id (with transparent SHA-256 legacy migration)
    const { valid, needsRehash } = await verifyPassword(user.passwordHash, String(password));

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Transparent credential migration: if user had legacy SHA-256 hash, upgrade to Argon2id
    if (needsRehash) {
      user.passwordHash = await hashPassword(String(password));
      await user.save();
    }

    // Record last login
    user.lastLoginAt = new Date();
    await user.save();

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
      maxAge: 8 * 60 * 60, // 8 hours (clinical shift)
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
