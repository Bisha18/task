// scripts/ping.js
import cron from "cron";
import http from "http";
import https from "https";
import dotenv from "dotenv";

dotenv.config();
// 
const API_URL = process.env.API_URL || "http://localhost:5000/ping";
const isHttps = API_URL.startsWith("https");
const client = isHttps ? https : http;

const job = new cron.CronJob("*/14 * * * *", function () {
  client
    .get(API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(`[✓] Ping successful at ${new Date().toISOString()}`);
      } else {
        console.log(`[✗] Ping failed with status code: ${res.statusCode}`);
      }
    })
    .on("error", (e) => {
      console.error(`[✗] Ping error: ${e.message}`);
    });
});

job.start(); 
