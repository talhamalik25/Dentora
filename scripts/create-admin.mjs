import mongoose from "mongoose";
import * as argon2 from "argon2";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dentora_clinic";

const [,, email, password, name] = process.argv;

if (!email || !password || !name) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> <name>");
  process.exit(1);
}

async function main() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);

  const UserSchema = new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, default: "admin" },
      active: { type: Boolean, default: true },
      lastLoginAt: { type: Date },
    },
    { timestamps: true }
  );

  const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

  const cleanEmail = email.toLowerCase().trim();
  const existing = await UserModel.findOne({ email: cleanEmail });

  if (existing) {
    console.error(`Error: User with email "${cleanEmail}" already exists.`);
    process.exit(1);
  }

  console.log(`Hashing password with Argon2id...`);
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
  });

  const user = await UserModel.create({
    email: cleanEmail,
    passwordHash,
    name: name.trim(),
    role: "admin",
    active: true,
  });

  console.log(`Successfully provisioned administrator:`);
  console.log(`- ID: ${user._id}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Name: ${user.name}`);
  console.log(`- Role: ${user.role}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to provision administrator:", err);
  process.exit(1);
});
