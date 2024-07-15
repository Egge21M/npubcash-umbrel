import { ScheduledTask } from "node-cron";
import cron from "node-cron";

export class Ticker {
  private job: ScheduledTask;

  start(callback: () => any) {
    this.job = cron.schedule("* * * * *", callback);
  }

  stop() {
    if (!this.job) {
      throw new Error("No job is scheduled");
    }
    this.job.stop();
  }
}
