import { registerUserDb, loginUserDb, getProfileDb } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserCon = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, role, password } = req.body;

    const targetRole = role || "user"; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await registerUserDb(email, {
      first_name,
      last_name,
      phone_number,
      role: targetRole,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully" 
    });

  } catch (error) {
    if (error.code === "ALREADY_EXISTS") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const loginUserCon = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserDb(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      token,
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getProfileCon = async (req, res, next) => {
  try {
    const user = await getProfileDb(req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
