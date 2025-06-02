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
exports.startCron = startCron;
const node_cron_1 = __importDefault(require("node-cron"));
const https_1 = __importDefault(require("https"));
// Settings
const MINUTES_DELTA = 100;
const URL = "https://daily-planner-kyar.onrender.com/api/";
let counter = 0;
let task = null;
/**
 * Ping the server and log remaining time.
 */
function pingServer() {
    https_1.default.get(URL, () => {
        counter -= MINUTES_DELTA;
        console.log("Pinged the server");
        console.log("Minutes Left:", counter);
    });
}
/**
 * Stop the cron task.
 */
function stopPingingServer() {
    if (task) {
        task.stop();
        console.log(" Stopped the cron job due to inactivity");
    }
}
/**
 * Clean up any existing cron task.
 */
function cleanUpTask() {
    if (task) {
        task.stop();
        task = null;
    }
}
/**
 * Starts the cron job.
 */
function startCron(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            cleanUpTask();
            const cronPattern = `*/${MINUTES_DELTA} * * * *`;
            const totalDuration = parseInt(req.params.duration) || 60;
            counter = totalDuration;
            task = node_cron_1.default.schedule(cronPattern, pingServer, { scheduled: false });
            task.start();
            // Stop task after duration (in milliseconds)
            setTimeout(stopPingingServer, totalDuration * 60 * 1000);
            res.status(200).send(` Started background task for ${totalDuration} minutes.`);
        }
        catch (error) {
            console.error(" Error starting cron job:", error);
            res.status(500).send("Failed to start cron job.");
        }
    });
}
//# sourceMappingURL=devController.js.map