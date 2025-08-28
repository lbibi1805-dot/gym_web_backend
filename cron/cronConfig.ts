// Cron configuration
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import Agenda from 'agenda';
import { cleanExpiredOTPs } from './jobs/cleanOTPs';

const agenda = new Agenda({
  db: { 
    address: process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_web', 
    collection: 'agendaJobs'
  },
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
