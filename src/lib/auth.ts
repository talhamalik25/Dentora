import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "./db";
import { UserModel } from "@/models/User";

const SESSION_COOKIE_NAME = "dentora_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "dentora-white-label-secret-key-32-bytes";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "receptionist" | "dentist";
  exp: number;
}

/**
 * Hash password with SHA-256.
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + AUTH_SECRET).digest("hex");
}

/**
 * Sign session token.
 */
export function signSession(payload: Omit<SessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const data = JSON.stringify({ ...payload, exp });
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  const encoded = Buffer.from(data).toString("base64url");
  return `${encoded}.${hmac}`;
}

/**
 * Verify session token.
 */
export function verifySession(token: string): SessionPayload | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const data = Buffer.from(encoded, "base64url").toString("utf-8");
    const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(data) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract authenticated staff user from incoming request.
 */
export async function getAuthStaff(request: NextRequest): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;

  const payload = verifySession(cookie.value);
  if (!payload) return null;

  const db = await connectToDatabase();
  if (db) {
    const user = await UserModel.findById(payload.userId).lean();
    if (!user || !user.active) return null;
  }

  return payload;
}

export { SESSION_COOKIE_NAME };
