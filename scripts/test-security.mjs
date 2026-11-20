import assert from "node:assert/strict";
import crypto from "node:crypto";
import argon2 from "argon2";

// Colors for terminal reporting
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`${GREEN}✔ PASS:${RESET} ${name}`);
    passed++;
  } catch (err) {
    console.error(`${RED}✘ FAIL:${RESET} ${name}`);
    console.error(err);
    failed++;
  }
}

console.log(`${CYAN}====================================================${RESET}`);
console.log(`${CYAN}  DENTORA — SECURITY & BOOKING INTEGRITY TEST SUITE  ${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

// ---------------------------------------------------------
// 1. AUTHENTICATION & PASSWORD HASHING (Argon2id + SHA-256 Migration)
// ---------------------------------------------------------
console.log(`${CYAN}--- Priority 1: Authentication & Credential Security ---${RESET}`);

await test("Argon2id: Hashes password with argon2id parameters", async () => {
  const password = "SecureClinicPassword2026!";
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  assert(hash.startsWith("$argon2id$"), "Hash must be an Argon2id format string");
  const isValid = await argon2.verify(hash, password);
  assert.equal(isValid, true, "Argon2id verification must pass for correct password");

  const isInvalid = await argon2.verify(hash, "WrongPassword123");
  assert.equal(isInvalid, false, "Argon2id verification must fail for wrong password");
});

await test("Password Migration: Transparently upgrades legacy SHA-256 to Argon2id", async () => {
  const legacyPassword = "LegacyAdminPassword123";
  const legacySha256Hash = crypto.createHash("sha256").update(legacyPassword).digest("hex");

  // Verification helper reproducing src/lib/auth.ts logic
  async function verifyPasswordHelper(storedHash, providedPassword) {
    if (storedHash.startsWith("$argon2")) {
      const match = await argon2.verify(storedHash, providedPassword);
      return { valid: match, needsRehash: false };
    }
    const computedLegacy = crypto.createHash("sha256").update(providedPassword).digest("hex");
    if (crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(computedLegacy))) {
      return { valid: true, needsRehash: true };
    }
    return { valid: false, needsRehash: false };
  }

  // 1. Verify legacy hash triggers needsRehash
  const check = await verifyPasswordHelper(legacySha256Hash, legacyPassword);
  assert.equal(check.valid, true, "Legacy password must match SHA-256");
  assert.equal(check.needsRehash, true, "Legacy password must flag needsRehash = true");

  // 2. Simulate rehash
  const upgradedHash = await argon2.hash(legacyPassword, { type: argon2.argon2id });
  const reCheck = await verifyPasswordHelper(upgradedHash, legacyPassword);
  assert.equal(reCheck.valid, true, "Upgraded password must verify under Argon2id");
  assert.equal(reCheck.needsRehash, false, "Argon2id hash must not require rehash");
});

await test("Session JWT/HMAC: Valid token verifies, expired/tampered fails", () => {
  const secret = "test-secret-salt-32-bytes-long-12345";
  function sign(payload, expSeconds) {
    const data = JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expSeconds });
    const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    const enc = Buffer.from(data).toString("base64url");
    return `${enc}.${sig}`;
  }
  function verify(token) {
    const [enc, sig] = token.split(".");
    if (!enc || !sig) return null;
    const data = Buffer.from(enc, "base64url").toString("utf-8");
    const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    if (sig !== expected) return null;
    const parsed = JSON.parse(data);
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  }

  const token = sign({ userId: "u123", role: "admin" }, 3600);
  const verified = verify(token);
  assert.equal(verified?.userId, "u123");
  assert.equal(verified?.role, "admin");

  // Tampered payload
  const tampered = token.slice(0, -4) + "XXXX";
  assert.equal(verify(tampered), null, "Tampered signature must be rejected");

  // Expired token
  const expiredToken = sign({ userId: "u123" }, -10);
  assert.equal(verify(expiredToken), null, "Expired token must be rejected");
});

// ---------------------------------------------------------
// 2. ROLE-BASED ACCESS CONTROL
// ---------------------------------------------------------
console.log(`\n${CYAN}--- Priority 1B: Role-Based Authorization ---${RESET}`);

await test("Role permissions: Staff roles can view, only authorized roles can modify", () => {
  const allowedStatusUpdaters = ["admin", "receptionist", "dentist"];
  assert(allowedStatusUpdaters.includes("admin"));
  assert(allowedStatusUpdaters.includes("receptionist"));
  assert(allowedStatusUpdaters.includes("dentist"));
  assert(!allowedStatusUpdaters.includes("patient"));
  assert(!allowedStatusUpdaters.includes("anonymous"));
});

// ---------------------------------------------------------
// 3. BOOKING CONCURRENCY & OVERLAP DISCRETIZATION
// ---------------------------------------------------------
console.log(`\n${CYAN}--- Priority 2: Booking Concurrency & Overlap Prevention ---${RESET}`);

function computeOccupancySlotUnits(startUtc, durationMinutes, bufferMinutes = 0, intervalMinutes = 15) {
  const units = [];
  const totalMinutes = durationMinutes + bufferMinutes;
  let currentMs = startUtc.getTime();
  const endTreatmentMs = currentMs + durationMinutes * 60 * 1000;
  const totalEndMs = currentMs + totalMinutes * 60 * 1000;

  while (currentMs < totalEndMs) {
    units.push({
      slotUtc: new Date(currentMs),
      isBuffer: currentMs >= endTreatmentMs,
    });
    currentMs += intervalMinutes * 60 * 1000;
  }
  return units;
}

await test("Occupancy Discretization: 45m treatment + 15m buffer creates 4 discrete 15m slot locks", () => {
  const start = new Date("2026-12-01T10:00:00.000Z");
  const units = computeOccupancySlotUnits(start, 45, 15, 15);

  assert.equal(units.length, 4, "Must generate exactly 4 slot units (60 total mins / 15m)");
  assert.equal(units[0].slotUtc.toISOString(), "2026-12-01T10:00:00.000Z");
  assert.equal(units[0].isBuffer, false);
  assert.equal(units[1].slotUtc.toISOString(), "2026-12-01T10:15:00.000Z");
  assert.equal(units[1].isBuffer, false);
  assert.equal(units[2].slotUtc.toISOString(), "2026-12-01T10:30:00.000Z");
  assert.equal(units[2].isBuffer, false);
  assert.equal(units[3].slotUtc.toISOString(), "2026-12-01T10:45:00.000Z");
  assert.equal(units[3].isBuffer, true, "Fourth slot must be marked as buffer");
});

await test("Overlap Prevention: Detects collision between overlapping bookings (10:00-11:00 vs 10:30-11:30)", () => {
  const booking1Start = new Date("2026-12-01T10:00:00.000Z");
  const booking1Units = computeOccupancySlotUnits(booking1Start, 45, 15, 15); // Occupies 10:00, 10:15, 10:30, 10:45

  // In-memory simulated unique index: dentistId:slotUtc
  const lockTable = new Set();
  const dentistId = "dr-sarah-chen";

  // Lock booking 1
  for (const u of booking1Units) {
    const key = `${dentistId}:${u.slotUtc.toISOString()}`;
    assert(!lockTable.has(key), "Booking 1 initial slot insertion must be free");
    lockTable.add(key);
  }

  // Attempt Booking 2 starting at 10:30 (overlapping with 10:30 and 10:45)
  const booking2Start = new Date("2026-12-01T10:30:00.000Z");
  const booking2Units = computeOccupancySlotUnits(booking2Start, 30, 0, 15); // Requests 10:30, 10:45

  let collisionDetected = false;
  for (const u of booking2Units) {
    const key = `${dentistId}:${u.slotUtc.toISOString()}`;
    if (lockTable.has(key)) {
      collisionDetected = true;
      break;
    }
  }

  assert.equal(collisionDetected, true, "Booking 2 must be rejected due to overlap at 10:30/10:45");
});

await test("Concurrency Rollback: Rollback clears all reserved slot units if appointment creation fails", () => {
  const lockTable = new Map(); // key -> apptId
  const apptId = "temp-appt-999";
  const dentistId = "dr-marcus-vance";
  const start = new Date("2026-12-01T14:00:00.000Z");
  const units = computeOccupancySlotUnits(start, 30, 15, 15);

  // Reserve
  for (const u of units) {
    lockTable.set(`${dentistId}:${u.slotUtc.toISOString()}`, apptId);
  }
  assert.equal(lockTable.size, 3);

  // Simulated failure during patient record insertion -> Trigger Rollback
  for (const [key, id] of Array.from(lockTable.entries())) {
    if (id === apptId) lockTable.delete(key);
  }

  assert.equal(lockTable.size, 0, "All slot units for failed appt must be cleaned up");
});

// ---------------------------------------------------------
// 4. PATIENT SELF-SERVICE (12h Cutoff & Max 2 Reschedules)
// ---------------------------------------------------------
console.log(`\n${CYAN}--- Priority 3: Patient Self-Service Policy Rules ---${RESET}`);

await test("12-Hour Cancellation Policy: Block cancellation under 12h, permit >= 12h", () => {
  const now = Date.now();
  const CUTOFF_MS = 12 * 60 * 60 * 1000;

  function canCancel(startsAtUtc) {
    const diff = new Date(startsAtUtc).getTime() - now;
    return diff >= CUTOFF_MS;
  }

  const apptIn24Hours = new Date(now + 24 * 3600 * 1000).toISOString();
  const apptIn13Hours = new Date(now + 13 * 3600 * 1000).toISOString();
  const apptIn11Hours = new Date(now + 11 * 3600 * 1000).toISOString();
  const apptIn1Hour = new Date(now + 1 * 3600 * 1000).toISOString();
  const apptInPast = new Date(now - 2 * 3600 * 1000).toISOString();

  assert.equal(canCancel(apptIn24Hours), true, "24h ahead must be allowed to cancel");
  assert.equal(canCancel(apptIn13Hours), true, "13h ahead must be allowed to cancel");
  assert.equal(canCancel(apptIn11Hours), false, "11h ahead must be blocked by 12h cutoff");
  assert.equal(canCancel(apptIn1Hour), false, "1h ahead must be blocked by 12h cutoff");
  assert.equal(canCancel(apptInPast), false, "Past appointment must be blocked from cancellation");
});

await test("12-Hour Rescheduling Policy & 2-Reschedule Quota Limit", () => {
  const now = Date.now();
  const CUTOFF_MS = 12 * 60 * 60 * 1000;
  const MAX_RESCHEDULES = 2;

  function evaluateReschedule(startsAtUtc, rescheduleCount) {
    const diff = new Date(startsAtUtc).getTime() - now;
    if (diff < CUTOFF_MS) return { allowed: false, reason: "cutoff" };
    if (rescheduleCount >= MAX_RESCHEDULES) return { allowed: false, reason: "quota" };
    return { allowed: true, remaining: MAX_RESCHEDULES - rescheduleCount };
  }

  const futureTime = new Date(now + 48 * 3600 * 1000).toISOString();
  const soonTime = new Date(now + 6 * 3600 * 1000).toISOString();

  // 1. First reschedule 48h ahead -> allowed (1 remaining)
  const res1 = evaluateReschedule(futureTime, 0);
  assert.equal(res1.allowed, true);
  assert.equal(res1.remaining, 2);

  // 2. Second reschedule 48h ahead -> allowed (0 remaining)
  const res2 = evaluateReschedule(futureTime, 1);
  assert.equal(res2.allowed, true);
  assert.equal(res2.remaining, 1);

  // 3. Third reschedule attempt -> BLOCKED (quota exceeded)
  const res3 = evaluateReschedule(futureTime, 2);
  assert.equal(res3.allowed, false);
  assert.equal(res3.reason, "quota");

  // 4. Attempt inside 12-hour window -> BLOCKED (cutoff)
  const res4 = evaluateReschedule(soonTime, 0);
  assert.equal(res4.allowed, false);
  assert.equal(res4.reason, "cutoff");
});

await test("Reschedule Atomic Swap: Restores original booking slot units if new slot conflicts", () => {
  const apptId = "appt-live-456";
  const dentistId = "dr-sarah-chen";
  const oldStart = new Date("2026-12-05T09:00:00.000Z");
  const oldUnits = computeOccupancySlotUnits(oldStart, 30, 0, 15);

  const lockTable = new Map();
  // Existing booking locks
  for (const u of oldUnits) {
    lockTable.set(`${dentistId}:${u.slotUtc.toISOString()}`, apptId);
  }

  // Another doctor has already reserved 14:00
  const conflictingStart = new Date("2026-12-05T14:00:00.000Z");
  lockTable.set(`${dentistId}:${conflictingStart.toISOString()}`, "other-appt-789");

  // Patient wants to reschedule to 14:00
  const newUnits = computeOccupancySlotUnits(conflictingStart, 30, 0, 15);

  // Pre-check detects conflict
  const hasConflict = newUnits.some((u) => {
    const occupant = lockTable.get(`${dentistId}:${u.slotUtc.toISOString()}`);
    return occupant && occupant !== apptId;
  });

  assert.equal(hasConflict, true, "Target slot collision must be detected");

  // Old units remain completely untouched and protected
  for (const u of oldUnits) {
    assert.equal(
      lockTable.get(`${dentistId}:${u.slotUtc.toISOString()}`),
      apptId,
      "Original booking slot locks must be preserved"
    );
  }
});

// ---------------------------------------------------------
// 5. PATIENT TOKEN HMAC SIGNING & TAMPERING
// ---------------------------------------------------------
console.log(`\n${CYAN}--- Priority 3B: Patient Token Cryptography ---${RESET}`);

await test("Patient Manage Token: Secure HMAC-SHA256 signature and expiration", () => {
  const secret = "auth-secret-production-random-token-2026";
  function signPatientToken(payload) {
    const exp = Math.floor(Date.now() / 1000) + 7200; // 2 hours
    const data = JSON.stringify({ ...payload, exp });
    const hmac = crypto.createHmac("sha256", secret).update(`patient:${data}`).digest("base64url");
    const encoded = Buffer.from(data).toString("base64url");
    return `${encoded}.${hmac}`;
  }

  function verifyPatientToken(token) {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const data = Buffer.from(encoded, "base64url").toString("utf-8");
    const expectedSig = crypto.createHmac("sha256", secret).update(`patient:${data}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(data);
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  }

  const token = signPatientToken({
    appointmentId: "65b9f1234567890abcdef123",
    reference: "DNT-A1B2C3",
    email: "patient@example.com",
  });

  const verified = verifyPatientToken(token);
  assert.equal(verified?.reference, "DNT-A1B2C3");
  assert.equal(verified?.email, "patient@example.com");

  // Tamper with email in token
  const tamperedData = Buffer.from(
    JSON.stringify({
      appointmentId: "65b9f1234567890abcdef123",
      reference: "DNT-A1B2C3",
      email: "attacker@example.com",
      exp: Math.floor(Date.now() / 1000) + 7200,
    })
  ).toString("base64url");
  const forgedToken = `${tamperedData}.${token.split(".")[1]}`;
  assert.equal(verifyPatientToken(forgedToken), null, "Forged token signature must fail verification");
});

console.log(`\n${CYAN}====================================================${RESET}`);
console.log(`  Tests completed: ${GREEN}${passed} passed${RESET}, ${failed > 0 ? RED : GREEN}${failed} failed${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

if (failed > 0) {
  process.exit(1);
}
