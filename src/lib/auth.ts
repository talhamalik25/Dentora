import { NextRequest } from "next/server";
import crypto from "crypto";
import * as argon2 from "argon2";
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

export interface PatientManagePayload {
  appointmentId: string;
  reference: string;
  email: string;
  exp: number;
}

/**
 * Hash password with Argon2id (adaptive, memory-hard).
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 1,
  });
}

/**
 * Verify password against an Argon2id hash or legacy SHA-256 hash.
 * If legacy SHA-256 matches, returns { valid: true, needsRehash: true }.
 */
export async function verifyPassword(
  hash: string,
  plain: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  // Check if hash is Argon2id
  if (hash.startsWith("$argon2id$") || hash.startsWith("$argon2")) {
    try {
      const match = await argon2.verify(hash, plain);
      return { valid: match, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Legacy SHA-256 fallback for migration
  const legacyHash = crypto.createHash("sha256").update(plain + AUTH_SECRET).digest("hex");
  const plainHash = crypto.createHash("sha256").update(plain).digest("hex");

  if (hash === legacyHash || hash === plainHash) {
    return { valid: true, needsRehash: true };
  }

  return { valid: false, needsRehash: false };
}

/**
 * Sign session token (8 hours expiration for clinical shifts).
 */
export function signSession(payload: Omit<SessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60; // 8 hours
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
 * Sign a secure, expiring token for guest patient appointment self-service (valid 2 hours).
 */
export function signPatientManageToken(payload: Omit<PatientManagePayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60; // 2 hours
  const data = JSON.stringify({ ...payload, exp });
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(`patient:${data}`).digest("base64url");
  const encoded = Buffer.from(data).toString("base64url");
  return `${encoded}.${hmac}`;
}

/**
 * Verify guest patient management token.
 */
export function verifyPatientManageToken(token: string): PatientManagePayload | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const data = Buffer.from(encoded, "base64url").toString("utf-8");
    const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(`patient:${data}`).digest("base64url");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(data) as PatientManagePayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify authenticated staff user from request.
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
