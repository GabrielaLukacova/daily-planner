import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";

/**
 * Register a new user
 */
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: passwordHashed,
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Error registering user", details: error });
  }
};

/**
 * Login existing user
 */
export const loginUser: RequestHandler = async (req, res) => {
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
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ error: "Error logging in user", details: error });
  }
};

/**
 * Middleware to verify token (supports both 'Authorization' and 'auth-token')
 */
export const verifyToken: RequestHandler = (req, res, next) => {
  const bearer = req.header("Authorization");
  const authToken = req.header("auth-token");

  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : authToken;

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
};

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

