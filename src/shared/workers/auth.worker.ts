import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      log.info(`Processing job: ${job.id} for adding auth user to DB.`);
      const { value } = job.data;
      await authService.createAuthUser(value);
      log.info(`Successfully added auth user to DB for job: ${job.id}`);

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(`Error adding auth user to DB for job: ${job.id}`, error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
