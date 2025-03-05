import User from "../models/User";
import { randomBytes } from "crypto";

(async function seed() {
  await User.sync();
  const generateRandomPassword = () => randomBytes(8).toString("hex");

  const users = [
    { username: "alice", password: generateRandomPassword() },
    { username: "bob", password: generateRandomPassword() },
    { username: "charlie", password: generateRandomPassword() },
    { username: "david", password: generateRandomPassword() },
    { username: "eve", password: generateRandomPassword() },
    { username: "frank", password: generateRandomPassword() },
    { username: "grace", password: generateRandomPassword() },
    { username: "heidi", password: generateRandomPassword() },
    { username: "ivan", password: generateRandomPassword() },
    { username: "judy", password: generateRandomPassword() },
  ];
  await User.bulkCreate(users);
})();
