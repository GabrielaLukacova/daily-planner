"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./repository/database");
const swagger_1 = require("./swagger");
const devController_1 = require("./controllers/devController");
// Load environment variables
dotenv_flow_1.default.config();
// Start server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🌐 Connecting to MongoDB...");
            yield (0, database_1.connect)();
            console.log("✅ MongoDB connection established");
        }
        catch (error) {
            console.error("❌ Failed to connect to MongoDB. Server will not start.");
            process.exit(1);
        }
        const app = (0, express_1.default)();
        /**
         * ✅ Stable CORS configuration with logging
         */
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "https://daily-planner-front.onrender.com",
            "https://daily-planner-kyar.onrender.com",
            "https://planit-41v2.onrender.com",
        ];
        const corsOptions = {
            origin: function (origin, callback) {
                console.log("🔍 Incoming origin:", origin);
                if (!origin || allowedOrigins.includes(origin)) {
                    console.log("✅ Allowed by CORS:", origin);
                    callback(null, true);
                }
                else {
                    console.log("❌ Blocked by CORS:", origin);
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "auth-token",
                "Origin",
                "X-Requested-With",
                "Accept",
            ],
            credentials: true,
        };
        // 💡 Apply CORS *before* JSON parser and routes
        app.use((0, cors_1.default)(corsOptions));
        app.options("*", (0, cors_1.default)(corsOptions));
        app.use(express_1.default.json());
        // Optional: Log requests (can be removed)
        app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
        // Swagger docs
        (0, swagger_1.setupSwagger)(app);
        // Cron route
        app.get("/startCron/:duration", devController_1.startCron);
        // 👇 Import routes AFTER DB connection
        const router = (yield Promise.resolve().then(() => __importStar(require("./routes")))).default;
        app.use("/api", router);
        // Root route
        app.get("/", (req, res) => {
            res.send("Welcome to Daily Planner API!");
        });
        const PORT = parseInt(process.env.PORT) || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📚 Swagger docs available at /api-docs`);
        });
    });
}
exports.default = startServer;
//# sourceMappingURL=app.js.map