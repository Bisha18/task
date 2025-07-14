import cron from "cron";
import https from "https";
import dotenv from "dotenv"
dotenv.config(); // Corrected: Call dotenv.config() as a function

const job = new cron.CronJob("*/14 * * * *", function () {
  // Ensure process.env.API_URL is defined when deploying, e.g., for keep-alive pings.
  if (!process.env.API_URL) {
    console.warn("API_URL environment variable is not set. Cron job might not function correctly for keep-alive.");
    return; // Exit if URL is not defined
  }

  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully to keep server alive.");
      else console.log(`GET request failed with status code: ${res.statusCode}`);
    })
    .on("error", (e) => console.error("Error while sending keep-alive request:", e.message));
});

export default job;