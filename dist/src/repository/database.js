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
exports.testConnection = testConnection;
exports.connect = connect;
exports.disconnect = disconnect;
const inspector_1 = require("inspector");
const mongoose_1 = __importDefault(require("mongoose"));
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connect();
            yield disconnect();
            inspector_1.console.log("Database connection test was successful (connect + disconnect)");
        }
        catch (error) {
            inspector_1.console.log("Error testing database connection. Error:" + error);
        }
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.DBHOST) {
                throw new Error("DBHOST enviroment variable is not defined");
            }
            yield mongoose_1.default.connect(process.env.DBHOST);
            if (mongoose_1.default.connection.db) {
                yield mongoose_1.default.connection.db.admin().command({ ping: 1 });
                inspector_1.console.log("Connection established");
            }
            else {
                throw new Error("Database connection is not established");
            }
        }
        catch (error) {
            inspector_1.console.log("Error connecting to the database. Eror:" + error);
        }
    });
}
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.disconnect();
            inspector_1.console.log("Connection closed");
        }
        catch (error) {
            inspector_1.console.log("Error closing database connection. Error:" + error);
        }
    });
}
//# sourceMappingURL=database.js.map