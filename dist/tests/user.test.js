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
const authController_1 = require("../src/controllers/authController");
const userModel_1 = require("../src/models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockResponse_1 = require("./mocks/mockResponse");
// mock dependencies to isolate controller logic
jest.mock('../src/models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe("AuthController - registerUser", () => {
    test("Should return 201 when user is registered successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const req = {
            body: {
                name: "Julia Lalala",
                email: "julia@gmail.com",
                password: "12345678"
            }
        };
        userModel_1.userModel.findOne.mockResolvedValue(null);
        bcrypt_1.default.genSalt.mockResolvedValue("salt");
        bcrypt_1.default.hash.mockResolvedValue("$2b$10$hashedPasswordExample");
        userModel_1.userModel.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ _id: "user123" })
        }));
        const res = (0, mockResponse_1.mockResponse)();
        // Act
        yield (0, authController_1.registerUser)(req, res, jest.fn());
        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ error: null, data: "user123" });
    }));
    test("Should return 400 when email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const req = {
            body: {
                name: "Julia Lalala",
                email: "julia@gmail.com",
                password: "12345678"
            }
        };
        userModel_1.userModel.findOne.mockResolvedValue({});
        const res = (0, mockResponse_1.mockResponse)();
        // Act
        yield (0, authController_1.registerUser)(req, res, jest.fn());
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email already exists." });
    }));
});
describe("AuthController - loginUser", () => {
    test("Should return 200 when login is successful", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const req = {
            body: {
                email: "julia@gmail.com",
                password: "12345678"
            }
        };
        userModel_1.userModel.findOne.mockResolvedValue({
            name: "Julia Lalala",
            email: "julia@gmail.com",
            id: "user123",
            password: "$2b$10$hashedPasswordExample"
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue("mocked.jwt.token");
        const res = (0, mockResponse_1.mockResponse)();
        // Act
        yield (0, authController_1.loginUser)(req, res, jest.fn());
        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.header).toHaveBeenCalledWith("auth-token", "mocked.jwt.token");
        expect(res.json).toHaveBeenCalledWith({
            error: null,
            data: { userId: "user123", token: "mocked.jwt.token" }
        });
    }));
    test("Should return 400 for invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const req = {
            body: {
                email: "julia@gmail.com",
                password: "wrongpass"
            }
        };
        userModel_1.userModel.findOne.mockResolvedValue({
            email: "julia@gmail.com",
            password: "$2b$10$hashedPasswordExample"
        });
        bcrypt_1.default.compare.mockResolvedValue(false);
        const res = (0, mockResponse_1.mockResponse)();
        // Act
        yield (0, authController_1.loginUser)(req, res, jest.fn());
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email or password is incorrect" });
    }));
});
//# sourceMappingURL=user.test.js.map