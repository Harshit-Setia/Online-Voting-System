import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';

(async () => {
  try {
    console.log('Checking email column existence...');
    const result = await sequelize.query('SELECT email FROM "users" LIMIT 1', { type: QueryTypes.SELECT });
    console.log('Query result:', result);
    await sequelize.close();
    console.log('Check completed');
  } catch (err) {
    console.error('Error during check:', err);
    process.exit(1);
  }
})();
