import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

(async () => {
  const queryInterface = sequelize.getQueryInterface();
  console.log('Starting migration: add email column to users');
  // 1️⃣ Add column (nullable)
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: true,
  });
  // 2️⃣ Backfill missing emails
  await queryInterface.sequelize.query(`
    UPDATE "users"
    SET "email" = CONCAT('user', "id", '@example.com')
    WHERE "email" IS NULL;
  `);
  // 3️⃣ Make column NOT NULL
  await queryInterface.changeColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: false,
  });
  // 4️⃣ Add UNIQUE constraint
  await queryInterface.addConstraint('users', {
    fields: ['email'],
    type: 'unique',
    name: 'users_email_unique_constraint',
  });
  console.log('Migration completed successfully');
  await sequelize.close();
})();
