import {
  type Request,
  type Response,
  type NextFunction
} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";

/**
 * Register a new user
 */
export async function registerUser(req: Request, res: Response) {
  try {
    // Validate input
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Check if user exists
    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // Create and save user
    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: passwordHashed
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).send("Error registering user. Error: " + error);
  }
}

/**
 * Login existing user
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const { error } = validateUserLoginInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const user: User | null = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        id: user.id
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "2h" }
    );

    res.status(200).header("auth-token", token).json({
      error: null,
      data: { userId: user.id, token }
    });
  } catch (error) {
    res.status(500).send("Error logging in user. Error: " + error);
  }
}

/**
 * Middleware to verify token
 * Looks for Authorization: Bearer <token>
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Henter Authorization-headeren
  const authHeader = req.header("Authorization");

  // Fjerner "Bearer " hvis det finnes
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
}

/**
 * Validate user registration info
 */
function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required()
  });

  return schema.validate(data);
}

/**
 * Validate login info
 */
function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required()
  });

  return schema.validate(data);
}
