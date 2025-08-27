// Cron configuration
import Agenda from 'agenda';
import { config } from '../config/env';
import { cleanExpiredOTPs } from './jobs/cleanOTPs';

const agenda = new Agenda({
  db: { address: config.MONGODB_URI as string, collection: 'agendaJobs' },
});

// Define cron jobs
agenda.define('clean expired otps', cleanExpiredOTPs);

// Schedule jobs
agenda.on('ready', async () => {
  console.log('Agenda started');
  
  // Clean expired OTPs every 10 minutes
  await agenda.every('10 minutes', 'clean expired otps');
  
  await agenda.start();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  console.log('Agenda stopped');
});

process.on('SIGINT', async () => {
  await agenda.stop();
  console.log('Agenda stopped');
});

export default agenda;
