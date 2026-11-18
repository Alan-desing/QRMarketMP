import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByUsername
} from "../database/userRepository.js";

export async function createSeller(username, password) {
  const existingUser = findUserByUsername(username);

  if (existingUser) {
    throw new Error("El nombre de usuario ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: randomUUID(),
    username,
    passwordHash
  };

  createUser(user);

  return {
    id: user.id,
    username: user.username
  };
}

export async function loginSeller(username, password) {
  const user = findUserByUsername(username);

  if (!user) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordIsValid) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token,
    seller: {
      id: user.id,
      username: user.username
    }
  };
}