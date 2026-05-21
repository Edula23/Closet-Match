import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { use } from "react";
import prisma from "../prismaClient.js";

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim() || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        },
    });

    const token = signToken(newUser);
    return res.status(201).json({ token, user: newUser });


}
    catch (error) {
        console.error("Register error:", error.message);
        return res.status(500).json({ message: "Server error during registration." });
    }

}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const safeUser = { id: user.id, email: user.email, name: user.name };
    const token = signToken(safeUser);
    return res.json({ message: "Login Successful", token, user: safeUser });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error during login." });
  }
}

export async function me(req, res) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Me error:", error.message);
    return res.status(500).json({ message: "Server error fetching user data." });
  }
}
