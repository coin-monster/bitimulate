require('dotenv').config();
const { CronJob } = require('cron');
const db = require('db');
const processWallets = require('./processWallets');
require('mongoose').set('debug', true);

function initialize() {
  db.connect();
  processWallets();  
}

initialize();