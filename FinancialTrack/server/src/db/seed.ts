import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { randomBytes } from "crypto";

(async function seed() {
  await User.sync();
  //const generateRandomPassword = () => randomBytes(8).toString("hex");

  const users = [
    { username: "test", password: "12345" },
    {
      username: "mathieu",
      password: "woensaksndqnwd129wekjn21e90",
    },
  ];
  await User.bulkCreate(users);

  await Budget.bulkCreate([
    {
      amount: 5000.0,
      note: "Good month!",
      monthYear: "2025-03",
      userId: 1,
    },
    {
      amount: 4500.0,
      note: "Okay month!",
      monthYear: "2025-02",
      userId: 1,
    },
    {
      amount: 2500.0,
      note: "Bad month!",
      monthYear: "2025-03",
      userId: 2,
    },
  ]);

  const transactions = [
    {
      id: 1,
      amount: 75.5,
      title: "Groceries at Market",
      tag: "food",
      type: "expense",
      userId: 1,
      createdAt: "2025-03-19T09:30:00.000Z",
      updatedAt: "2025-03-19T09:30:00.000Z",
    },
    {
      id: 2,
      amount: 2000.0,
      title: "Monthly Salary",
      tag: "salary",
      type: "income",
      userId: 1,
      createdAt: "2025-03-19T15:00:00.000Z",
      updatedAt: "2025-03-19T15:00:00.000Z",
    },
    {
      id: 3,
      amount: 45.0,
      title: "Internet Bill",
      tag: "utilities",
      type: "expense",
      userId: 1,
      createdAt: "2025-03-18T12:15:00.000Z",
      updatedAt: "2025-03-18T12:15:00.000Z",
    },
    {
      id: 4,
      amount: 120.0,
      title: "Co-working Space",
      tag: "work",
      type: "expense",
      userId: 1,
      createdAt: "2025-03-18T08:45:00.000Z",
      updatedAt: "2025-03-18T08:45:00.000Z",
    },
    {
      id: 5,
      amount: 300.0,
      title: "Freelance Project",
      tag: "freelance",
      type: "income",
      userId: 1,
      createdAt: "2025-03-15T17:20:00.000Z",
      updatedAt: "2025-03-15T17:20:00.000Z",
    },
    {
      id: 6,
      amount: 22.99,
      title: "Online Subscription",
      tag: "work",
      type: "expense",
      userId: 1,
      createdAt: "2025-03-16T19:00:00.000Z",
      updatedAt: "2025-03-16T19:00:00.000Z",
    },
  ];

  await Transaction.bulkCreate(transactions);
})();
