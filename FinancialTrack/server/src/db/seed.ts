import Transaction from "../models/Transaction";
import User from "../models/User";
import { randomBytes } from "crypto";

(async function seed() {
  await User.sync();
  const generateRandomPassword = () => randomBytes(8).toString("hex");

  const users = [
    { username: "alice", password: generateRandomPassword(), budget: 1500.0 },
    { username: "bob", password: generateRandomPassword() }, // No budget
    { username: "charlie", password: generateRandomPassword(), budget: 2000.0 },
    { username: "david", password: generateRandomPassword() }, // No budget
    { username: "eve", password: generateRandomPassword(), budget: 1200.0 },
    { username: "frank", password: generateRandomPassword() }, // No budget
    { username: "grace", password: generateRandomPassword(), budget: 1800.0 },
    { username: "heidi", password: generateRandomPassword() }, // No budget
    { username: "ivan", password: generateRandomPassword(), budget: 2500.0 },
    { username: "judy", password: generateRandomPassword() }, // No budget
    {
      username: "mathieu",
      password: "woensaksndqnwd129wekjn21e90",
      budget: 3000.0,
    },
  ];
  await User.bulkCreate(users);

  const transactions = [
    {
      id: 1,
      amount: 75.5,
      title: "Groceries at Market",
      tag: "food",
      type: "expense",
      userId: 11,
      createdAt: "2025-03-10T09:30:00.000Z",
      updatedAt: "2025-03-10T09:30:00.000Z",
    },
    {
      id: 2,
      amount: 2000.0,
      title: "Monthly Salary",
      tag: "salary",
      type: "income",
      userId: 11,
      createdAt: "2025-03-12T15:00:00.000Z",
      updatedAt: "2025-03-12T15:00:00.000Z",
    },
    {
      id: 3,
      amount: 45.0,
      title: "Internet Bill",
      tag: "utilities",
      type: "expense",
      userId: 11,
      createdAt: "2025-03-13T12:15:00.000Z",
      updatedAt: "2025-03-13T12:15:00.000Z",
    },
    {
      id: 4,
      amount: 120.0,
      title: "Co-working Space",
      tag: "work",
      type: "expense",
      userId: 11,
      createdAt: "2025-03-14T08:45:00.000Z",
      updatedAt: "2025-03-14T08:45:00.000Z",
    },
    {
      id: 5,
      amount: 300.0,
      title: "Freelance Project",
      tag: "freelance",
      type: "income",
      userId: 11,
      createdAt: "2025-03-15T17:20:00.000Z",
      updatedAt: "2025-03-15T17:20:00.000Z",
    },
    {
      id: 6,
      amount: 22.99,
      title: "Online Subscription",
      tag: "work",
      type: "expense",
      userId: 11,
      createdAt: "2025-03-16T19:00:00.000Z",
      updatedAt: "2025-03-16T19:00:00.000Z",
    },
  ];

  await Transaction.bulkCreate(transactions);
})();
