import "../config/env.js";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  await connectDB();

  const exists = await User.findOne({
    role: "ADMIN",
  });

  if (exists) {
    console.log("Admin already exists.");
    process.exit();
  }

  await User.create({
    name: "System Admin",
    email: "admin@pharma.com",
    password: "Admin@123",
    role: "ADMIN",
    department: "Administration",
  });

  console.log("Admin created successfully.");

  process.exit();
};

seedAdmin();
