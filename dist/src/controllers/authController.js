"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
/**
 * Register a new user
 */
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connect)();
        const { error } = validateUserRegistrationInfo(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const emailExists = yield userModel_1.userModel.findOne({ email: req.body.email });
        if (emailExists) {
            res.status(400).json({ error: "Email already exists." });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHashed = yield bcrypt_1.default.hash(req.body.password, salt);
        const userObject = new userModel_1.userModel({
            name: req.body.name,
            email: req.body.email,
            password: passwordHashed,
        });
        const savedUser = yield userObject.save();
        res.status(201).json({ error: null, data: savedUser._id });
    }
    catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
});
exports.registerUser = registerUser;
/**
 * Login existing user
 */
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connect)();
        const { error } = validateUserLoginInfo(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const user = yield userModel_1.userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({ error: "Email or password is incorrect" });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json({ error: "Email or password is incorrect" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            name: user.name,
            email: user.email,
            id: user.id,
        }, process.env.TOKEN_SECRET, { expiresIn: "2h" });
        res.status(200).header("auth-token", token).json({
            error: null,
            data: { userId: user.id, token },
        });
    }
    catch (error) {
        console.error("❌ Error logging in user:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});
exports.loginUser = loginUser;
/**
 * Middleware to verify token (supports both 'Authorization' and 'auth-token')
 */
const verifyToken = (req, res, next) => {
    const bearer = req.header("Authorization");
    const authToken = req.header("auth-token");
    const token = (bearer === null || bearer === void 0 ? void 0 : bearer.startsWith("Bearer "))
        ? bearer.slice(7)
        : authToken;
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (_a) {
        res.status(401).send("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
/**
 * Validate user registration info
 */
function validateUserRegistrationInfo(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(6).max(255).required(),
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required(),
    });
    return schema.validate(data);
}
/**
 * Validate login info
 */
function validateUserLoginInfo(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required(),
    });
    return schema.validate(data);
}
//# sourceMappingURL=authController.js.map