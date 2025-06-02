import { type Request, type Response } from 'express';
import cron, { ScheduledTask } from 'node-cron';
import https from 'https';

// Settings
const MINUTES_DELTA = 100;
const URL = 'https://daily-planner-kyar.onrender.com/api/';
let counter = 0;
let task: ScheduledTask | null = null;

/**
 * Ping the server and log remaining time.
 */
function pingServer() {
  https.get(URL, () => {
    counter -= MINUTES_DELTA;
    console.log('Pinged the server');
    console.log('Minutes Left:', counter);
  });
}

/**
 * Stop the cron task.
 */
function stopPingingServer() {
  if (task) {
    task.stop();
    console.log(' Stopped the cron job due to inactivity');
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
export async function startCron(req: Request, res: Response) {
  try {
    cleanUpTask();

    const cronPattern = `*/${MINUTES_DELTA} * * * *`;
    const totalDuration = parseInt(req.params.duration as string) || 60;

    counter = totalDuration;

    task = cron.schedule(cronPattern, pingServer, { scheduled: false } as any);

    task.start();

    // Stop task after duration (in milliseconds)
    setTimeout(stopPingingServer, totalDuration * 60 * 1000);

    res.status(200).send(` Started background task for ${totalDuration} minutes.`);
  } catch (error) {
    console.error(' Error starting cron job:', error);
    res.status(500).send('Failed to start cron job.');
  }
}
