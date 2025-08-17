// Cron configuration placeholder
import Agenda from 'agenda';
import { config } from '../config/env';

const agenda = new Agenda({
  db: { address: config.MONGODB_URI as string, collection: 'agendaJobs' },
});

// TODO: Define cron jobs

export default agenda;
